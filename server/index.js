const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Question = require("./models/Question");

mongoose
  .connect("mongodb://localhost:27017/ham_test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database. Starting Server");
    startServer();
  })
  .catch((e) => {
    console.log(`Error connecting to the database: ${e}`);
    exit();
  });

process.on("exit", () => {
  console.log("Server is shutting down.");
  mongoose.connection.close();
});

function startServer() {
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

  app.listen(8080, () => {
    console.log("Server listening on port 8080");
  });
}
