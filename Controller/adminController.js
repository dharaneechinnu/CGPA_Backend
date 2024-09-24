const usermodel = require('../Model/adminModel');
const teacher = require('../Model/TecherSchema')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const PASS = process.env.PASS;
const nodemailer = require('nodemailer');


const loginAdmin = async (req, res) => {
  try {
    const { mail, password } = req.body;

    // Check if admin exists by email
    const existingAdmin = await usermodel.findOne({ mail });
    if (!existingAdmin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, existingAdmin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: existingAdmin._id, role: 'admin' },
      process.env.ACCESS_TOKEN, // Ensure you have a JWT secret in your environment variables
      { expiresIn: '1h' }
    );

    // Send success response with the token
    return res.status(200).json({
      message: 'Login successful',
      token,
      admin: {
        id: existingAdmin._id,
        name: existingAdmin.name,
        mail: existingAdmin.mail,
        role: 'admin',
      },
    });
  } catch (error) {
    console.error('Error during admin login:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const register = async (req, res) => {
    try {
      const { name, password, mail} = req.body;
  
      // Check if user already exists by email or registration number
      const existingUser = await usermodel.findOne({mail});
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email or registration number already exists' });
      }
  
      // Hash the password
      const hashpwd = await bcrypt.hash(password, 10);
  
      // Create the new user
      await usermodel.create({
        name,
        mail,
        password: hashpwd
      });
  
      // Send success response
      return res.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error registering user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  const registerTeacher = async (req, res) => {
    try {
        const { name, password, mail, dob, gender, year, section } = req.body;
  
      // Check if user already exists by email or registration number
      const existingUser = await teacher.findOne({mail});
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email or registration number already exists' });
      }
  
      // Hash the password
      const hashpwd = await bcrypt.hash(password, 10);
  
      // Create the new user
      await teacher.create({
        name,
        email: mail,
        password: hashpwd,
        dob,
        gender,
        role: "teacher",
        year,
        section
      });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "dharaneedharanchinnusamy@gmail.com",
            pass: PASS
        }
    });

    const mailOptions = {
        from: "dharaneedharanchinnusamy@gmail.com",
        to: mail,
        subject: "Teacher Registration Successfull",
        html: `
          <div style="color: black; font-size: 20px;">
            <p>Hello,</p>
            <p><strong>Your username is:${mail}</strong></p>
            <p>Your password is:${password}</p>
            <p>Best regards,<br/>Your App Team</p>
          </div>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending acknowledgement email:", error);
            return res.status(500).json({ message: "Failed to send verification OTP email" });
        }
        console.log("Verification OTP email sent:", info.response,otp);
    });
  
      // Send success response
      return res.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error registering user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

// Update teacher
const updateTeacher = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedTeacher = await teacher.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedTeacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.status(200).json(updatedTeacher);
  } catch (error) {
    console.error('Error updating teacher:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete teacher
const deleteTeacher = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTeacher = await teacher.findByIdAndDelete(id);
    if (!deletedTeacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.status(200).json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



  module.exports = {register,loginAdmin, registerTeacher,deleteTeacher,updateTeacher}