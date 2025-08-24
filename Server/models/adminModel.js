const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    default: "admin",
    enum: ["admin"],
  },
  // Add more fields if needed
});

module.exports = (adminConnection) => {
  return adminConnection.model("Admin", adminSchema);
};
