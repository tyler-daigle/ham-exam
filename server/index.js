const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Question = require("./models/Question");
const SubElement = require("./models/SubElement");
const Section = require("./models/Section");
const { serverPort, databaseHost } = require("./config.js");

const { loadExamData } = require("./utils/examData");
// Connect to the server
mongoose
  .connect(`mongodb://${databaseHost}:27017/ham_test`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to database. Starting Server");

    // examData is just an object that makes it easier to get info about the exams.
    // examData = { T: {tech exam data}, G: {general exam data}, E: {amateur extra exam data}}
    const examData = await loadExamData();
    startServer(examData);
  })
  .catch((e) => {
    console.log(`Error connecting to the database: ${e}`);
    exit();
  });

process.on("exit", () => {
  console.log("Server is shutting down.");
  mongoose.connection.close();
});

// called after the server has successfully started
function startServer(examData) {
  const app = express();

  app.use(cors());

  app.get("/question/:questionId", function (req, res) {
    Question.findOne({ id: req.params.questionId }).then(data => res.json(data));
  });

  // /questions/section/sectionId will get all the questions that are in the section
  app.get("/questions/section/:sectionId", function (req, res) {
    Question.find({ section_id: req.params.sectionId }).then(data => res.json(data));
  });

  app.get("/questions/section/", function (req, res) {
    res.json([]); // temp fix for a request to a blank sectionId
  });

  // get all questions in a subelement
  app.get("/questions/subelement/:subelementId", function (req, res) {
    Question.find({ subelement_id: req.params.subelementId }).then(data => res.json(data));
  });

  // /exams routes return data about each exam, such as number of questions and the sections that
  // each exam covers. Right now it just uses the examData object rather than actually querying.
  app.get("/exams", function (req, res) {
    res.json(examData);
  });

  // get the info about a specific exam
  app.get("/exams/:examName", function (req, res) {
    const exam = req.params.examName.toLowerCase();
    switch (exam) {
      case 'technician':
        res.json(examData.T);
        break;
      case 'general':
        res.json(examData.G);
        break;
      case 'extra':
        res.json(examData.E);
        break;
      default:
        res.json({ msg: "No such exam" });
    }
  });


  // get all the questions for the technician exam
  app.get("/exams/technician/questions", function (req, res) {
    Question.find({ subelement_id: /T[0-9]/ }).then(data => res.json(data));
  });

  app.get("/exams/general/questions", function (req, res) {
    Question.find({ subelement_id: /G[0-9]/ }).then(data => res.json(data));
  });

  app.get("/exams/extra/questions", function (req, res) {
    Question.find({ subelement_id: /E[0-9]/ }).then(data => res.json(data));
  });


  // /subelement/:subId gets the description of a specific subelement (subId)
  app.get("/subelement/:subId", function (req, res) {
    SubElement.findOne({ subelement_id: req.params.subId }).then(data => res.json(data));
  });

  // app.get("/subelements/general", function (req, res) {
  //   SubElement.find({ subelement_id: { $regex: /G[0-9]/ } }).then(data => res.json(data));
  // });

  // app.get("/subelements/technician", function (req, res) {
  //   SubElement.find({ subelement_id: { $regex: /T[0-9]/ } }).then(data => res.json(data));
  // });

  // app.get("/subelements/extra", function (req, res) {
  //   SubElement.find({ subelement_id: { $regex: /E[0-9]/ } }).then(data => res.json(data));
  // });

  // get ALL the sections and their descriptions
  app.get("/sections", function (req, res) {
    Section.find().then(data => res.json(data));
  });

  // get all the sections in a subelement
  // Example: http://localhost/sections/subelement/T1 will get all of the details for all
  // of the sections that are in the subelement T1

  app.get("/sections/subelement/:subId", function (req, res) {
    Section.find({ subelement_id: req.params.subId }).then(data => res.json(data));
  });

  app.listen(serverPort, () => {
    console.log(`Server listening on port ${serverPort} `);
  });
}
