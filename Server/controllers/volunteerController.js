const Volunteer = require('../models/volunteerModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ✅ Volunteer self-registration
exports.registerVolunteer = async (req, res) => {
  try {
    const { name, phone, area, email, password } = req.body;

    const existing = await Volunteer.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const volunteer = new Volunteer({
      name,
      phone,
      area,
      email,
      password: hashedPassword,
      role: "volunteer"
    });

    await volunteer.save();

    res.status(201).json({ message: "Volunteer registered successfully", volunteer });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Volunteer login
exports.loginVolunteer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const volunteer = await Volunteer.findOne({ email });
    if (!volunteer) return res.status(404).json({ message: "Volunteer not found" });

    const isMatch = await bcrypt.compare(password, volunteer.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: volunteer._id, role: volunteer.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, volunteer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Volunteer updates their own profile
exports.updateSelf = async (req, res) => {
  try {
    if (req.user.role !== "volunteer") {
      return res.status(403).json({ message: "Only volunteers can update their own profile" });
    }

    const updates = req.body;
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const volunteer = await Volunteer.findByIdAndUpdate(req.user.id, updates, { new: true }).select("-password");
    if (!volunteer) return res.status(404).json({ message: "Volunteer not found" });

    res.status(200).json(volunteer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Volunteer deletes their own profile
exports.deleteSelf = async (req, res) => {
  try {
    if (req.user.role !== "volunteer") {
      return res.status(403).json({ message: "Only volunteers can delete their own profile" });
    }

    const volunteer = await Volunteer.findByIdAndDelete(req.user.id);
    if (!volunteer) return res.status(404).json({ message: "Volunteer not found" });

    res.status(200).json({ message: "Volunteer deleted their account" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Admin/NGO specific routes 🔹

// Create Volunteer - Admin only
exports.createVolunteer = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access Denied" });
    }

    const volunteer = await Volunteer.create(req.body);
    res.status(201).json(volunteer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all Volunteers - Admin & NGO
exports.getVolunteers = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'ngo') {
      return res.status(403).json({ message: "Access Denied" });
    }

    const volunteers = await Volunteer.find().select("-password");
    res.status(200).json(volunteers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single Volunteer - Admin & NGO
exports.getVolunteerById = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'ngo') {
      return res.status(403).json({ message: "Access Denied" });
    }

    const volunteer = await Volunteer.findById(req.params.id).select("-password");
    if (!volunteer) return res.status(404).json({ message: "Volunteer not found" });

    res.status(200).json(volunteer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update Volunteer - Admin only
exports.updateVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
    if (!volunteer) return res.status(404).json({ message: "Volunteer not found" });

    res.status(200).json(volunteer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Delete Volunteer - Admin only
exports.deleteVolunteer = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access Denied" });
    }

    const volunteer = await Volunteer.findByIdAndDelete(req.params.id);
    if (!volunteer) return res.status(404).json({ message: "Volunteer not found" });

    res.status(200).json({ message: "Volunteer deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};