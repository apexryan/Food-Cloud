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
    required: true, // 👈 Needed for login
  },
  location: {
    type: String, // 👈 matches controller "location"
    required: true,
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ['NGO'],
    default: 'NGO',
  },

  passwordResetToken: {
  type: String,
  default: undefined
},
passwordResetExpires: {
  type: Date,
  default: undefined
},

passwordResetToken: {
  type: String,
  default: undefined
},
passwordResetExpires: {
  type: Date,
  default: undefined
}
}, { timestamps: true });

module.exports = mongoose.model('NGO', ngoSchema);