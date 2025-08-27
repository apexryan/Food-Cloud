const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', volunteerController.registerVolunteer);
router.post('/login', volunteerController.loginVolunteer);

// Protected Volunteer routes
router.get('/profile', verifyToken, authorizeRoles('volunteer'), volunteerController.getProfile);
router.get('/food-posts', verifyToken, authorizeRoles('volunteer'), volunteerController.listFoodPosts);
router.put('/food-posts/:postId/status', verifyToken, authorizeRoles('volunteer'), volunteerController.updateFoodPostStatus);

module.exports = router;