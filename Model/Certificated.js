// models/Certificate.js
const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  certificateUrl: { type: String, required: true },
  reg: { type: String, required: true },
});

module.exports = mongoose.model('Certificate', CertificateSchema);
