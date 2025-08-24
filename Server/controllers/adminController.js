const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dbPromise = require("../config/db"); // ← Admin DB
const getAdminModel = require("../models/adminModel");
const NGO = require("../models/ngoModel");
const Volunteer = require("../models/volunteerModel");
const Donor = require("../models/userModel"); // Assuming donor = userModel
const Food = require("../models/foodpost");

let Admin;

// Initialize Admin model from separate DB connection
dbPromise
  .then(({ adminConnection }) => {
    Admin = getAdminModel(adminConnection);
    console.log("✅ Admin model initialized");
  })
  .catch((err) => {
    console.error("❌ Failed to initialize Admin model:", err);
  });

// ========== Admin Registration ==========
exports.createAdmin = async (req, res) => {
  if (!Admin) return res.status(503).json({ error: "Admin DB not ready yet" });

  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin)
      return res.status(400).json({ error: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });
    res.status(201).json(newAdmin);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ========== Admin Login ==========
exports.loginAdmin = async (req, res) => {
  if (!Admin) return res.status(503).json({ error: "Admin DB not ready yet" });

  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      {
        userId: admin._id,
        email: admin.email,
        userType: "admin",
        role: "admin",
      },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ========== Get All Admins ==========
exports.getAllAdmins = async (req, res) => {
  if (!Admin) return res.status(503).json({ error: "Admin DB not ready yet" });

  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ========== UPDATE Admin ==========
exports.updateAdmin = async (req, res) => {
  if (!Admin) return res.status(503).json({ error: "Admin DB not ready yet" });

  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedAdmin)
      return res.status(404).json({ message: "Admin not found" });

    res.json(updatedAdmin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ========== DELETE Admin ==========
exports.deleteAdmin = async (req, res) => {
  if (!Admin) return res.status(503).json({ error: "Admin DB not ready yet" });

  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting admin", error });
  }
};

// ========== NGO Management ==========
exports.getAllNGOs = async (req, res) => {
  try {
    const ngos = await NGO.find();
    res.json(ngos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 UPDATE NGO
exports.updateNGO = async (req, res) => {
  try {
    const updatedNGO = await NGO.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedNGO) return res.status(404).json({ message: "NGO not found" });

    res.json(updatedNGO);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteNGO = async (req, res) => {
  try {
    const ngoId = req.params.id;
    await NGO.findByIdAndDelete(ngoId);
    res.json({ message: "NGO deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ========== Volunteer Management ==========
exports.getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find({ role: "volunteer" });
    res.json(volunteers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 UPDATE Volunteer
exports.updateVolunteer = async (req, res) => {
  try {
    const updatedVolunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedVolunteer)
      return res.status(404).json({ message: "Volunteer not found" });

    res.json(updatedVolunteer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteVolunteer = async (req, res) => {
  try {
    const volunteerId = req.params.id;
    await Volunteer.findByIdAndDelete(volunteerId);
    res.json({ message: "Volunteer deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ========== Donor Management ==========
exports.getAllDonors = async (req, res) => {
  try {
    const donors = await Donor.find({ role: "donor" });
    res.json(donors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 UPDATE Donor
exports.updateDonor = async (req, res) => {
  try {
    const updatedDonor = await Donor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedDonor)
      return res.status(404).json({ message: "Donor not found" });

    res.json(updatedDonor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteDonor = async (req, res) => {
  try {
    const donorId = req.params.id;
    await Donor.findByIdAndDelete(donorId);
    res.json({ message: "Donor deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ========== Food Management ==========
exports.assignFoodToNGO = async (req, res) => {
  try {
    const { foodId, ngoId } = req.body;

    const food = await Food.findById(foodId);
    if (!food) return res.status(404).json({ error: "Food not found" });

    const ngo = await NGO.findById(ngoId);
    if (!ngo) return res.status(404).json({ error: "NGO not found" });

    food.assignedTo = ngo._id;
    food.status = "assigned";
    await food.save();

    res.json({ message: "Food assigned successfully", food });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ========== Admin Password Change ==========
exports.changeAdminPassword = async (req, res) => {
  if (!Admin) return res.status(503).json({ error: "Admin DB not ready yet" });

  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.user.userId; // From JWT token

    // Find admin by ID
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      admin.password
    );
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedNewPassword;
    await admin.save();

    res.status(200).json({
      message: "Admin password changed successfully",
      success: true,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 UPDATE Food
exports.updateFood = async (req, res) => {
  try {
    const updatedFood = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedFood)
      return res.status(404).json({ message: "Food not found" });

    res.json(updatedFood);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
