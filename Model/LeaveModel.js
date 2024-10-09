const mongoose = require('mongoose');

// Define the Leave Request Schema
const LeaveRequestSchema = new mongoose.Schema({
  RegNo: {
    type: String, // Registration Number of the student
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  section: {
    type: String, // Class section, e.g., A, B, C
    required: true,
  },
  year: {
    type: Number, // Year of study, e.g., 1 for first year, 2 for second year, etc.
    required: true,
  },
  leaveReason: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  approvalDate: {
    type: Date, 
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',  // Reference to the Teacher model
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


// Model creation
const LeaveRequest = mongoose.model('LeaveRequest', LeaveRequestSchema);

module.exports = LeaveRequest;
