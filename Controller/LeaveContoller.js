const LeaveRequest = require('../Model/LeaveModel');
const Teacher = require('../Model/TecherSchema'); // Assuming you have a teacher model

// Create a leave request (submitted by a student)
const createLeaveRequest = async (req, res) => {
  try {
    const response = { RegNo, studentName, section, year, leaveReason, startDate, endDate } = req.body;
    console.log(response)
    // Check if all required fields are provided
    if (!RegNo || !studentName || !section || !year || !leaveReason || !startDate || !endDate) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Create a new leave request
    const newLeaveRequest = new LeaveRequest({
      RegNo,
      studentName,
      section,
      year,
      leaveReason,
      startDate,
      endDate,
    });

    // Save the leave request
    await newLeaveRequest.save();
    return res.status(200).json({ message: 'Leave request submitted successfully', leaveRequest: newLeaveRequest });
  } catch (error) {
    console.error('Error creating leave request:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Approve or reject a leave request (by a teacher)
const approveLeaveRequest = async (req, res) => {
  try {
    const { leaveId, status } = req.body;
  console.log(leaveId)
    // Ensure leave ID, teacher ID, and status are provided
    if (!leaveId  || !status) {
      return res.status(400).json({ message: 'Leave ID, teacher ID, and status are required.' });
    }

    // Ensure the status is either "approved" or "rejected"
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. It must be either "approved" or "rejected".' });
    }

    // Find the leave request
    const leaveRequest = await LeaveRequest.findById(leaveId);
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found.' });
    }


    // Update the leave request with the new status and approval date
    leaveRequest.status = status;
    leaveRequest.approvalDate = new Date();
  
    // Save the updated leave request
    await leaveRequest.save();

    return res.status(200).json({ message: `Leave request ${status} successfully`, leaveRequest });
  } catch (error) {
    console.error('Error approving/rejecting leave request:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getLeaveRequests = async (req, res) => {
    try {
      const response =  { status, section, year } = req.body; // Get status, section, and year from the query parameters
        console.log(response)
      let query = {};
  
      // Add status to the query if provided
      if (status) {
        query.status = status;
      }
  
      // Add section to the query if provided
      if (section) {
        query.section = section;
      }
  
      // Add year to the query if provided
      if (year) {
        query.year = year;
      }
  
      // Fetch leave requests that match the query
      const leaveRequests = await LeaveRequest.find(query).populate('approvedBy', 'name'); // Populates teacher's name for approved requests
       console.log(leaveRequests)
      // Return the filtered leave requests
      return res.status(200).json({ leaveRequests });
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  


  // Get today's approved leave requests with student name and registration number
const getApprovedLeavesToday = async (req, res) => {
  try {
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to the start of the day

    // Fetch all leave requests that are approved and for today
    const approvedLeavesToday = await LeaveRequest.find({
      status: 'Approved',
      startDate: { $gte: today },
      endDate: { $lte: today },
    }).populate('student', 'name Reg'); // Assuming 'student' is a reference field and you want to populate 'name' and 'Reg'

    if (!approvedLeavesToday.length) {
      return res.status(404).json({ message: 'No approved leaves found for today.' });
    }

    res.status(200).json({ approvedLeaves: approvedLeavesToday });
  } catch (error) {
    console.error('Error fetching approved leave requests for today:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

  const getLeaveRequestsByRegNo = async (req, res) => {
    try {
      // Get RegNo from request body
      const { RegNo } = req.body; // Use body for POST requests
      console.log(RegNo);
  
      // Ensure RegNo is provided
      if (!RegNo) {
        return res.status(400).json({ message: 'RegNo is required.' });
      }
  
      // Build the query to find leave requests by RegNo
      const query = { RegNo };
  
      // Fetch leave requests based on the RegNo
      const leaveRequests = await LeaveRequest.find(query);
  
      // If no leave requests found, return a 404 message
      if (leaveRequests.length === 0) {
        return res.status(404).json({ message: 'No leave requests found for the given RegNo.' });
      }
  
      // Return the leave requests
      return res.status(200).json({ leaveRequests });
    } catch (error) {
      console.error('Error fetching leave requests by RegNo:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  

module.exports = {
  createLeaveRequest,
  approveLeaveRequest,
  getLeaveRequests,
  getLeaveRequestsByRegNo
};
