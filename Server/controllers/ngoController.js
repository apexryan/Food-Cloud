/*const NGO = require('../models/ngoModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// ✅ Register or Create NGO
const createNGO = async (req, res) => {
  try {
    const { name, email, password, location, address, phone } = req.body;

    if (!name || !email || !password || !location) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const existingNGO = await NGO.findOne({ email });
    if (existingNGO) {
      return res.status(400).json({ message: 'NGO already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newNGO = await NGO.create({
      name,
      email,
      password: hashedPassword,
      location,
      address,
      phone,
    });

    const token = jwt.sign(
      { id: newNGO._id, role: 'NGO' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: 'NGO registered successfully',
      token,
      ngo: {
        id: newNGO._id,
        name: newNGO.name,
        email: newNGO.email,
        location: newNGO.location,
        address: newNGO.address,
        phone: newNGO.phone,
        verified: newNGO.verified,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Login NGO
const loginNGO = async (req, res) => {
  try {
    const { email, password } = req.body;

    const ngo = await NGO.findOne({ email });
    if (!ngo) {
      return res.status(400).json({ message: 'NGO not found' });
    }

    const isMatch = await bcrypt.compare(password, ngo.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: ngo._id, role: ngo.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      ngo: {
        id: ngo._id,
        name: ngo.name,
        email: ngo.email,
        location: ngo.location,
        address: ngo.address,
        phone: ngo.phone,
        verified: ngo.verified,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Get assigned foods (placeholder)
const getAssignedFoods = async (req, res) => {
  res.status(200).json({ message: 'Assigned foods will be implemented soon.' });
};

// ✅ NGO self update (only their own profile)
const updateProfile = async (req, res) => {
  try {
    const ngoId = req.user.id;
    const updates = { ...req.body };

    // if password is being updated → hash it
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedNGO = await NGO.findByIdAndUpdate(ngoId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedNGO) {
      return res.status(404).json({ message: 'NGO not found' });
    }

    res.status(200).json(updatedNGO);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

// ✅ NGO self delete
const deleteNGO = async (req, res) => {
  try {
    const ngoId = req.user.id;
    await NGO.findByIdAndDelete(ngoId);
    res.status(200).json({ message: 'NGO deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting NGO', error: error.message });
  }
};

// ✅ Admin-only update NGO
const updateNGOByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // hash password if admin updates it
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedNGO = await NGO.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedNGO) {
      return res.status(404).json({ message: 'NGO not found' });
    }

    res.status(200).json(updatedNGO);
  } catch (error) {
    res.status(500).json({ message: 'Error updating NGO by admin', error: error.message });
  }
};
// ✅ Get NGO's own profile
const getProfile = async (req, res) => {
  try {
    const ngoId = req.user.id; // from token
    const ngo = await NGO.findById(ngoId).select('-password'); // exclude password

    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }

    res.status(200).json(ngo);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching NGO profile', error: error.message });
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

  module.exports = {
  createNGO,
  loginNGO,
  getAssignedFoods,
  updateProfile,
  deleteNGO,
  updateNGOByAdmin,
  getProfile,  // 👈 added
};*/



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
