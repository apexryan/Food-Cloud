
const NGO = require('../models/ngoModel');
const FoodPost = require('../models/foodpost');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register NGO
exports.createNGO = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingNGO = await NGO.findOne({ email });
    if (existingNGO) {
      return res.status(400).json({ message: 'NGO already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const ngo = new NGO({
      name,
      email,
      password: hashedPassword,
      role: 'ngo'  // Explicitly set role
    });

    await ngo.save();

    const token = jwt.sign(
      { id: ngo._id, role: 'ngo' },  // Explicitly set role in token
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({ 
      message: 'NGO registered successfully',
      token,
      ngo: {
        id: ngo._id,
        name: ngo.name,
        email: ngo.email,
        role: ngo.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login NGO
exports.loginNGO = async (req, res) => {
  try {
    const { email, password } = req.body;
    const ngo = await NGO.findOne({ email });
    
    if (!ngo) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, ngo.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: ngo._id, role: 'ngo' },  // Explicitly set role in token
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      token, 
      ngo: {
        id: ngo._id,
        name: ngo.name,
        email: ngo.email,
        role: 'ngo'
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

// Get NGO profile
exports.getProfile = async (req, res) => {
  try {
    const ngo = await NGO.findById(req.user.id).select('-password');
    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }
    res.json(ngo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
