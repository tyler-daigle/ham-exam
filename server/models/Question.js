const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question_text: String,
  id: String,
  answer: String,
  choices: {
    A: String,
    B: String,
    C: String,
    D: String,
  },
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
