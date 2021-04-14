const mongoose = require("mongoose");
const Section = require("../models/Section");
const fs = require("fs");
const { databaseHost, port, databaseName } = require("./config");

if (process.argv.length < 3) {
  console.log("Enter the json file to add to the database.");
  return;
}

const dataFile = process.argv[2];
let sectionData;

try {
  sectionData = fs.readFileSync(dataFile, { encoding: "utf-8" });
} catch (err) {
  console.log(err);
  return;
}

const sectionObjects = JSON.parse(sectionData);
console.log(`${sectionObjects.length} sections loaded.`);
console.log(sectionObjects[0]);
mongoose
  .connect(`mongodb://${databaseHost}:${port}/${databaseName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log(`Connected to database on ${databaseHost}:${port}`);
    Section.insertMany(sectionObjects)
      .then((data) => {
        console.log(`${data.length} Sections added`);
        mongoose.connection.close();
      })
      .catch((e) => console.log(e));
  })
  .catch((e) => console.log(`Error connecting: ${e}`));
