const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Question = require("./models/Question");
const {loadExamData} = require("./utils/examData");

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
  console.log(examData);
  const app = express();
  app.use(cors());

  app.get("/", function (req, res) {
    console.log("Got request");
    res.send("Hello, World!");
  });

  app.get("/questions", function (req, res) {
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
    } else {
      res.send("Error");
    }
  });

  app.get("/exams", function(req,res) {
    res.json(examData);
  });
  app.get("/exams/technician", function(req, res) {
    res.json(examData.T)
  });

  app.get("/exams/general", function(req, res) {
    res.json(examData.G)
  });

  app.get("/exams/extra", function(req, res) {
    res.json(examData.E)
  });
  app.listen(8080, () => {
    console.log("Server listening on port 8080");
  });
}
