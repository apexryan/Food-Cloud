const Volunteer = require('../models/volunteerModel');
const FoodPost = require('../models/foodpost');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Volunteer
exports.registerVolunteer = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingVolunteer = await Volunteer.findOne({ email });
    if (existingVolunteer) {
      return res.status(400).json({ message: 'Volunteer already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const volunteer = new Volunteer({
      name,
      email,
      password: hashedPassword,
      role: 'volunteer'  // Explicitly set role
    });

    await volunteer.save();

    const token = jwt.sign(
      { id: volunteer._id, role: 'volunteer' },  // Explicitly set role in token
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({ 
      message: 'Volunteer registered successfully',
      token,
      volunteer: {
        id: volunteer._id,
        name: volunteer.name,
        email: volunteer.email,
        role: volunteer.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login Volunteer
exports.loginVolunteer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const volunteer = await Volunteer.findOne({ email });
    
    if (!volunteer) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, volunteer.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: volunteer._id, role: 'volunteer' },  // Explicitly set role in token
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      token, 
      volunteer: {
        id: volunteer._id,
        name: volunteer.name,
        email: volunteer.email,
        role: 'volunteer'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update food post availability
exports.updateFoodPostStatus = async (req, res) => {
  try {
    const { postId } = req.params;
    const { status } = req.body;

    const foodPost = await FoodPost.findById(postId);
    if (!foodPost) {
      return res.status(404).json({ message: 'Food post not found' });
    }

    // Validate the status value
    if (!['available', 'unavailable'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    foodPost.status = status;
    await foodPost.save();

    res.json({ 
      message: 'Food post status updated successfully',
      foodPost
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// List all food posts
exports.listFoodPosts = async (req, res) => {
  try {
    const foodPosts = await FoodPost.find()
      .sort({ createdAt: -1 });
    res.json(foodPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Volunteer profile
exports.getProfile = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.user.id).select('-password');
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    res.json(volunteer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};