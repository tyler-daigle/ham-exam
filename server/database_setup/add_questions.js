const mongoose = require("mongoose");
const Question = require("../models/Question");
const fs = require("fs");
const { databaseHost, port, databaseName } = require("./config");

if (process.argv.length < 3) {
  console.log("Enter the json file to add to the database.");
  return;
}

const dataFile = process.argv[2];
let questionData;

try {
  questionData = fs.readFileSync(dataFile, { encoding: "utf-8" });
} catch (err) {
  console.log(err);
  return;
}

const questionObjects = JSON.parse(questionData);
console.log(`${questionObjects.length} questions loaded.`);
console.log(questionObjects[0]);
mongoose
  .connect(`mongodb://${databaseHost}:${port}/${databaseName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log(`Connected to database on ${databaseHost}:${port}`);
    Question.insertMany(questionObjects)
      .then((data) => {
        console.log(`${data.length} Questions added`);
        mongoose.connection.close();
      })
      .catch((e) => console.log(e));
  })
  .catch((e) => console.log(`Error connecting: ${e}`));
