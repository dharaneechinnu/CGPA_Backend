const usermodel = require('../Model/adminModel');
const teacher = require('../Model/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const PASS = process.env.PASS;
const nodemailer = require('nodemailer');

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
        const { name, password, mail, dob, gender } = req.body;
  
      // Check if user already exists by email or registration number
      const existingUser = await teacher.findOne({mail});
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email or registration number already exists' });
      }
  
      // Hash the password
      const hashpwd = await bcrypt.hash(password, 10);
  
      // Create the new user
      await usermodel.create({
        name,
        mail,
        password: hashpwd,
        dob,
        gender,
        role: "teacher"
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

  module.exports = {register, registerTeacher}