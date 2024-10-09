const express = require('express');
const router = express.Router();
const leaveController = require('../Controller/LeaveContoller');

// Route to create a leave request (Student)
router.post('/leave-request', leaveController.createLeaveRequest);

// Route to approve/reject a leave request (Teacher)
router.post('/leave-request/approve', leaveController.approveLeaveRequest);

// Route to get all leave requests (Optional: filter by status)
router.post('/leave-requests', leaveController.getLeaveRequests);

router.post('/leave-requestreg', leaveController.getLeaveRequestsByRegNo);

module.exports = router;
