const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// ===== Public Routes =====
router.post('/', userController.createUser);         // Register
router.post('/signup', userController.createUser);   // Alias
router.post('/login', userController.loginUser);     // Login

// ===== Protected Routes =====

// Get all users → Admin only
router.get('/', verifyToken, authorizeRoles('admin'), userController.getAllUsers);

// Get single user (self or Admin)
router.get('/:id', verifyToken, userController.getUserById);

// Update user (self or Admin)
// If user updates themselves
router.put('/me', verifyToken, userController.updateSelf);

// ✅ Alias for updating own profile
router.put('/profile', verifyToken, userController.updateSelf);

// If admin updates any user
router.put('/:id', verifyToken, authorizeRoles('admin'), userController.updateUserByAdmin);

// User deletes own account
router.delete('/me', verifyToken, userController.deleteSelf);

// ✅ Alias for deleting own profile
router.delete('/profile', verifyToken, userController.deleteSelf);

// Admin deletes any user by ID
router.delete('/:id', verifyToken, authorizeRoles('admin'), userController.deleteUserByAdmin);

module.exports = router;