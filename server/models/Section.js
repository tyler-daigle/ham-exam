const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  subelement_id: String,
  section_id: String,
  section_description: String,
});

const Section = mongoose.model("Section", sectionSchema);
module.exports = Section;
