const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  area: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // for login
  password: { type: String, required: true },            // for login
  role: { type: String, default: "Volunteer" },          // role to differentiate
  isAvailable: { type: Boolean, default: true },
  passwordResetToken: {
  type: String,
  default: undefined
},
passwordResetExpires: {
  type: Date,
  default: undefined
}
}, { timestamps: true });

module.exports = mongoose.model('Volunteer', volunteerSchema);