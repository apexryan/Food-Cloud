const mongoose = require('mongoose');

const ngoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'ngo'
  },
  passwordResetToken: String,
  passwordResetExpires: Date
}, { timestamps: true });

module.exports = mongoose.model('NGO', ngoSchema);