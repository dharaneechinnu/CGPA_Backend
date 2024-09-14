const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Prevent duplicate emails
    lowercase: true,
    trim: true,
    validate: {
      validator: function (v) {
        // Basic email regex validation
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`,
    },
  },
  dob: {
    type: Date, // Change to Date type for proper date handling
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'Other'], // Optionally restrict to certain values
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Add minimum password length for security
  },
  current_sem: {
    type: Number,
    required: true,
    min: 1, // Add minimum value validation for semester
  },
  otpToken: {
    type: String,
    default: null, // Ensure default value is null
  },
  otpExpire: {
    type: Date,
    default: null, // Ensure default value is null
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
});

// Create the model based on the schema
const userModel = mongoose.model('UsersLogins', userSchema);

module.exports = userModel;
