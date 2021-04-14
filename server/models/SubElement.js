const mongoose = require("mongoose");

const subelementSchema = new mongoose.Schema({
  subelement_id: String,
  subelement_description: String,
  num_questions: Number,
  num_groups: Number,
});

const SubElement = mongoose.model("SubElement", subelementSchema);
module.exports = SubElement;
