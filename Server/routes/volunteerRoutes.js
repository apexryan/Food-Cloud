const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// ===== Public Routes =====
router.post('/register', volunteerController.registerVolunteer);
router.post('/login', volunteerController.loginVolunteer);

// ===== Protected Routes =====

// Get all volunteers → Admin & NGO only
router.get('/', verifyToken, authorizeRoles('admin', 'ngo'), volunteerController.getVolunteers);

// Get volunteer by ID → Admin & NGO only
router.get('/:id', verifyToken, authorizeRoles('admin', 'ngo'), volunteerController.getVolunteerById);

// ✅ Volunteer updates their own profile
router.put('/me', verifyToken, authorizeRoles('volunteer'), volunteerController.updateSelf);

// ✅ Admin updates any volunteer
router.put('/:id', verifyToken, authorizeRoles('admin'), volunteerController.updateVolunteer);

// ❌ Volunteer cannot delete themselves
// ✅ Only Admin can delete volunteers
router.delete('/:id', verifyToken, authorizeRoles('admin'), volunteerController.deleteVolunteer);

module.exports = router;