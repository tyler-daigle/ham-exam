const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Question = require("./models/Question");
const SubElement = require("./models/SubElement");
const { loadExamData } = require("./utils/examData");
const port = 8080;
mongoose
  .connect("mongodb://localhost:27017/ham_test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to database. Starting Server");
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

function startServer(examData) {
  const app = express();
  app.use(cors());

  app.get("/", function (req, res) {
    console.log("Got request");
    res.send("Hello, World!");
  });

  // TODO: Get all questions in each subelement?

  app.get("/questions", function (req, res) {
    // get questions by ID, example: /questions?id=T1A01
    if ("id" in req.query) {
      Question.findOne({ id: req.query.id }, (err, data) => {
        if (!err) {
          if (data === null) {
            res.json({ message: "Question Not Found" });
          } else {
            res.json(data);
          }
        }
      });
    } else if ("section" in req.query) {
      // get all questions in a section
      // Example: /questions?section=T1A

      const { section } = req.query;

      Question.find({ section_id: section }).then(data => res.json({ count: data.length, data })).catch(err => res.json({ msg: err }));
    } else {
      res.send("Error");
    }
  });

  // /exams routes return data about each exam, such as number of questions and the sections that
  // each exam covers.
  app.get("/exams", function (req, res) {
    res.json(examData);
  });
  app.get("/exams/technician", function (req, res) {
    res.json(examData.T)
  });

  app.get("/exams/general", function (req, res) {
    res.json(examData.G)
  });

  app.get("/exams/extra", function (req, res) {
    res.json(examData.E)
  });

  app.get("/subelements", function (req, res) {
    SubElement.find().then(data => res.json(data));
  });

  app.get("/subelement/:subId", function(req, res) {
    console.log(req.params.subId);
    SubElement.findOne({subelement_id : req.params.subId}).then(data => res.json(data));    
  });
  app.get("/subelements/general", function (req, res) {
    SubElement.find({ subelement_id: { $regex: /G[0-9]/ } }).then(data => res.json(data));
  });

  app.get("/subelements/technician", function (req, res) {
    SubElement.find({ subelement_id: { $regex: /T[0-9]/ } }).then(data => res.json(data));
  });

  app.get("/subelements/extra", function (req, res) {
    SubElement.find({ subelement_id: { $regex: /E[0-9]/ } }).then(data => res.json(data));
  });

  app.listen(port, () => {
    console.log(`Server listening on port ${port} `);
  });
}
