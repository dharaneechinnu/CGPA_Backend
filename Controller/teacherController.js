const usermodel = require('../Model/User');
const teacher = require('../Model/TecherSchema');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import jsonwebtoken

const getStudents = async(req,res)=>{
    try {
        const {year, section} = req.body;
        if(!year || !section){
            res.json({"message": "please enter the year and section details"})
        }
        const students = await usermodel.find({year, section, role: "student"});
        res.json(students);
    } catch (error) {
        console.log(error.message)
    }
}

const login = async (req, res) => {
    try {
      const { mail, password } = req.body;
  console.log(mail)
  console.log(password)
      // Check if the user exists by email
      const existingUser = await teacher.findOne({ email:mail });

      if (!existingUser) {
        return res.status(400).json({ message: 'Invalid email' });
      }
  
      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, existingUser.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'password' });
      }
  
      // Create a token (optional, if you're using JWT for session management)
      const token = jwt.sign({ id: existingUser._id, role: 'teacher' }, process.env.ACCESS_TOKEN, { expiresIn: '1h' });
  
      // Send success response with token and user information
      return res.status(200).json({
        message: 'Login successful',
        token, // Include the token in the response
        user: {
          id: existingUser._id,
          name: existingUser.name,
          mail: existingUser.email,
          role: existingUser.role,
          year:existingUser.year,
          section:existingUser.section,

          // Add other user fields you want to send in the response
        },
      });
    } catch (error) {
      console.error('Error logging in:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

module.exports = {getStudents,login}