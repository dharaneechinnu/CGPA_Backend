// models/Resume.js
const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  reg: { type: String, required: true }, // Registration number
  courseName: { type: String, required: true },
  certificateUrl: { type: String, required: true },
});

module.exports = mongoose.model('Resume', resumeSchema);
