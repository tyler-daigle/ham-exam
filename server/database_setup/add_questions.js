const mongoose = require("mongoose");
const Question = require("./Question");
const fs = require("fs");
const dataFile = "../questions_json/tech_questions.json";

const questionData = fs.readFileSync(dataFile, { encoding: "utf-8" });

const questionObjects = JSON.parse(questionData);
console.log(`${questionObjects.length} questions loaded.`);
console.log(questionObjects[0]);
mongoose
  .connect("mongodb://localhost:27017/ham_test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to database");
    Question.insertMany(questionObjects)
      .then(() => {
        console.log("Questions added");
        mongoose.connection.close();
      })
      .catch((e) => console.log(e));
  })
  .catch((e) => console.log(`Error connecting: ${e}`));
