const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    default: "student",
  },
  year: {
    type: Number,
  },
  section: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Basic email validation
      },
      message: props => `${props.value} is not a valid email!`,
    },
  },
  Reg: {
    type: String,
    default: null,
  },
  dob: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'Other'],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  current_sem: {
    type: Number,
    min: 1,
    max: 8,
  },
  mobileNo: {
    type: String, // Changed to String for handling leading zeros and large numbers
    trim: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v); // 10-digit mobile number validation
      },
      message: props => `${props.value} is not a valid mobile number!`,
    },
  },
  address: {
    type: String,
    trim: true,
  },
  parentAddress: {
    type: String,
    trim: true,
  },
  otpToken: {
    type: String,
    default: null,
  },
  otpExpire: {
    type: Date,
    default: null,
  },
  resetPwdToken: {
    type: String,
    default: null,
  },
  resetPwdExpire: {
    type: Date,
    default: null,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  sgpas: [
    {
      semester: {
        type: Number,
        min: 1,
        max: 8,
      },
      sgpa: {
        type: Number,
        min: 0,
        max: 10,
      },
    },
  ],
  cgpa: {
    type: Number,
    default: 0,
    min: 0,
    max: 10,
  },
  targetCgpa: {
    type: Number,
    min: 0,
    max: 10,
    default: null,
  },
});

// Middleware to prevent duplicate SGPA entries for the same semester
userSchema.pre('save', function (next) {
  if (this.sgpas && this.sgpas.length > 0) {
    const semesterSet = new Set();
    for (const sgpaRecord of this.sgpas) {
      if (semesterSet.has(sgpaRecord.semester)) {
        return next(new Error(`Duplicate SGPA entry for semester ${sgpaRecord.semester}`));
      }
      semesterSet.add(sgpaRecord.semester);
    }

    // Calculate CGPA if no duplicates are found
    const totalSgpa = this.sgpas.reduce((sum, sgpaRecord) => sum + sgpaRecord.sgpa, 0);
    this.cgpa = totalSgpa / this.sgpas.length;
  } else {
    this.cgpa = 0; // Set CGPA to 0 if there are no SGPA entries
  }
  next();
});

// Create the model based on the schema
const userModel = mongoose.model('UsersLogins', userSchema);

module.exports = userModel;
