const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'ngo', 'volunteer', 'user', 'food'],
    default: 'user',   // 👈 role will be user unless you pass something else
    required: true
  },

// Add these two lines here:
passwordResetToken: {
  type: String,
  default: undefined
},
passwordResetExpires: {
  type: Date,
  default: undefined
},

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);