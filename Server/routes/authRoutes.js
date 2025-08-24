const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const { 
  sanitizeInput, 
  validateRegistration, 
  validateLogin,
  validatePasswordResetRequest,
  validatePasswordReset,
  validatePasswordChange,
  verifyToken
} = require('../middleware/authMiddleware');

// Basic auth routes with validation
router.post('/register', sanitizeInput, validateRegistration, authController.registerUser);
router.post('/login', sanitizeInput, validateLogin, authController.loginUser);

// Password reset routes
router.post('/forgot-password', sanitizeInput, validatePasswordResetRequest, authController.requestPasswordReset);
router.post('/reset-password', sanitizeInput, validatePasswordReset, authController.resetPassword);

// Change password (authenticated users)
router.put('/change-password', verifyToken, sanitizeInput, validatePasswordChange, authController.changePassword);
module.exports = router;