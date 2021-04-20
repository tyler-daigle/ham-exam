const mongoose = require("mongoose");

// refer to https://www.fcc.gov/wireless/bureau-divisions/mobility-division/amateur-radio-service/examinations
// for the requirements of the exams
//
//                        Questions    Minimum Passing Score
//	Technician Class	    35	                26
//  General Class       	35	                26
// 	Amateur Extra Class	    50	                37

const examSchema = new mongoose.Schema({
    exam_name: String,
    exam_id: String, // T - Technician, G - General, E - Amateur Extra
    subelements: [String],
    totalQuestions: Number, // total number of questions in the pool
    numExamQuestions: Number, // number of questions that are on the exam
    requiredCorrect: Number // the number of questions you must get correct to pass

});

const Exam = mongoose.model("Exam", examSchema);

module.exports = Exam;
