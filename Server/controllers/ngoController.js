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

// ✅ Admin deletes NGO by ID (matches route)
const deleteNGO = async (req, res) => {
  try {
    const { id } = req.params;  // ✅ Get ID from params
    
    const deletedNGO = await NGO.findByIdAndDelete(id);
    if (!deletedNGO) {
      return res.status(404).json({ message: 'NGO not found' });
    }
    
    res.status(200).json({ message: 'NGO deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting NGO', error: error.message });
  }
};

// ✅ Admin-only update NGO
const updateNGO = async (req, res) => {
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

module.exports = {
  createNGO,
  loginNGO,
  getAssignedFoods,
  updateProfile,
  deleteNGO,  // ✅ Back to original name
  updateNGO,  // ✅ Back to original name
  getProfile,
};
