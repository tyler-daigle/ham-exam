// const mongoose = require("mongoose");
const Exam = require("../models/Exam");

async function loadExamData() {
    return new Promise((resolve, reject) => {
        Exam.find().then(data => {
            // create an object where each exam is indexed by its letter ID
            // {T: {exam_data}, E: {exam_data}, G: {exam_data}}
            const examData = {};

            data.forEach(d => examData[d.exam_id] = d);
            resolve(examData)
        }).catch(error => reject(error));
    });
}

module.exports = {
    loadExamData
}
