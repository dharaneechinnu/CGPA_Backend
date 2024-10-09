const userModel = require('../Model/User'); // Import your user model
const teacherModel = require('../Model/TecherSchema'); // Assuming this is your teacher schema
const LeaveRequest = require('../Model/LeaveModel')
const bcrypt = require('bcrypt'); // For password hashing
const jwt = require('jsonwebtoken'); // For generating tokens

// Get students by year and section
const getStudents = async (req, res) => {
  try {
    const { year, section } = req.body;
    
    if (!year || !section) {
      return res.status(400).json({ message: 'Year and section are required' });
    }

    // Fetch students from the database based on year and section
    const students = await userModel.find({ year, section });

    // Log the data for debugging purposes
    console.log('Students fetched:', students);

    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found' });
    }

    // Send the students data in the response
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Teacher login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the teacher by email
        const teacher = await teacherModel.findOne({ email });
        if (!teacher) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check if password matches
        const isPasswordValid = await bcrypt.compare(password, teacher.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT token for session management
        const token = jwt.sign(
            { id: teacher._id, role: 'teacher' },
            process.env.Teacher_Access_Token, // Ensure this environment variable is set
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: teacher._id,
                name: teacher.name,
                email: teacher.email,
                role: teacher.role,
                year: teacher.year,
                section: teacher.section,
            },
        });
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Get top CGPA students
const getTopCGPAStudents = async (req, res) => {
    try {
        const { year, section } = req.body; // Use body for POST request

        if (!year || !section) {
            return res.status(400).json({ message: 'Year and section are required' });
        }

        const students = await userModel
            .find({ year, section, role: 'student' })
            .sort({ cgpa: -1 }) // Sort by CGPA in descending order
            .limit(5); // Limit to top 5 students

        return res.status(200).json({ topStudents: students });
    } catch (error) {
        console.error('Error fetching top CGPA students:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get total number of students
const getTotalStudents = async (req, res) => {
    try {
        const { year, section } = req.body; // Use POST request body

        const totalStudents = await userModel.countDocuments({ year, section, role: 'student' });
        return res.status(200).json({ totalStudents });
    } catch (error) {
        console.error('Error fetching total students:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get CGPA analysis for the class
const getClassCGPAAnalysis = async (req, res) => {
    try {
        const { year, section } = req.body; // Use POST request body

        const students = await userModel.find({ year, section, role: 'student' });
        const totalCGPA = students.reduce((sum, student) => sum + student.cgpa, 0);
        const averageCGPA = totalCGPA / students.length;

        return res.status(200).json({ students, averageCGPA });
    } catch (error) {
        console.error('Error fetching CGPA analysis:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getApprovedLeaves = async (req, res) => {
  try {
      const { year, section } = req.body; // Get year and section from the request body
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Start of today
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // End of today

      // Fetch approved leaves from your leaves model
      const approvedLeaves = await LeaveRequest.find({
          approvalStatus: 'approved',
          leaveDate: {
              $gte: startOfDay,
              $lte: endOfDay
          },
          year: year,
          section: section
      }).select('studentId'); // Select only the necessary fields

      const studentIds = approvedLeaves.map(leave => leave.studentId); // Get student IDs from leaves

      // Fetch student details based on the IDs
      const students = await userModel.find({ _id: { $in: studentIds } }).select('name Reg'); // Adjust fields as necessary

      res.status(200).json({ approvedLeaves: students });
      console.log(students)
  } catch (error) {
      console.error('Error fetching approved leaves:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getStudents, login, getTopCGPAStudents, getTotalStudents, getClassCGPAAnalysis,getApprovedLeaves };
