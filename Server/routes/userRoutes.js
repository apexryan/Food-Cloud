const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// ===== Public Routes =====
router.post('/', userController.createUser);         // Register
router.post('/signup', userController.createUser);   // Alias
router.post('/login', userController.loginUser);     // Login


router.get('/', verifyToken, authorizeRoles('admin'), userController.getAllUsers);


router.get('/:id', verifyToken, userController.getUserById);


router.put('/me', verifyToken, userController.updateSelf);


router.put('/profile', verifyToken, userController.updateSelf);


router.put('/:id', verifyToken, authorizeRoles('admin'), userController.updateUserByAdmin);


router.delete('/me', verifyToken, userController.deleteSelf);


router.delete('/profile', verifyToken, userController.deleteSelf);


router.delete('/:id', verifyToken, authorizeRoles('admin'), userController.deleteUserByAdmin);

module.exports = router;