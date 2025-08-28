


const express = require('express');
const router = express.Router();
const ngoController = require('../controllers/ngoController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', ngoController.createNGO);
router.post('/login', ngoController.loginNGO);

// Protected NGO routes
router.get('/profile', verifyToken, authorizeRoles('ngo'), ngoController.getProfile);
router.get('/food-posts', verifyToken, authorizeRoles('ngo'), ngoController.listFoodPosts);
router.put('/food-posts/:postId/status', verifyToken, authorizeRoles('ngo'), ngoController.updateFoodPostStatus);

module.exports = router;