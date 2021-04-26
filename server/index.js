const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Question = require("./models/Question");
const SubElement = require("./models/SubElement");
const Section = require("./models/Section");

const { loadExamData } = require("./utils/examData");
const port = 8080;

// Connect to the server
mongoose
  .connect("mongodb://localhost:27017/ham_test", {
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

  app.get("/", function (req, res) {
    console.log("Got request");
    res.send("Hello, World!");
  });

  app.get("/question/:questionId", function (req, res) {
    Question.findOne({ id: req.params.questionId }).then(data => res.json(data));    
  });

  // /questions/section/sectionId will get all the questions that are in the section
  app.get("/questions/section/:sectionId", function (req, res) {
    Question.find({ section_id: req.params.sectionId }).then(data => res.json(data));
  });

  // /exams routes return data about each exam, such as number of questions and the sections that
  // each exam covers. Right now it just uses the examData object rather than actually querying.
  app.get("/exams", function (req, res) {
    res.json(examData);
  });

  app.get("/exams/technician", function (req, res) {
    res.json(examData.T)
    console.log(req.params.subId);
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

  app.listen(port, () => {
    console.log(`Server listening on port ${port} `);
  });
}
