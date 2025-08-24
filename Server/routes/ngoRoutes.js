/*const express = require('express');
const router = express.Router();
const ngoController = require('../controllers/ngoController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// ===== NGO Routes =====

// Public routes
router.post('/register', ngoController.createNGO);
router.post('/login', ngoController.loginNGO);

// Protected NGO routes
router.get('/assigned-foods', verifyToken, authorizeRoles('ngo'), ngoController.getAssignedFoods);
router.put('/profile', verifyToken, authorizeRoles('ngo'), ngoController.updateProfile);

// ❌ Removed NGO self-delete
// ✅ Only Admin can delete NGO
router.delete('/:id', verifyToken, authorizeRoles('admin'), ngoController.deleteNGO);

module.exports = router;*/


const express = require('express');
const router = express.Router();
const ngoController = require('../controllers/ngoController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// ===== NGO Routes =====

// Public routes
router.post('/register', ngoController.createNGO);
router.post('/login', ngoController.loginNGO);

// Protected NGO routes
router.get('/profile', verifyToken, authorizeRoles('ngo'), ngoController.getProfile);
router.get('/assigned-foods', verifyToken, authorizeRoles('ngo'), ngoController.getAssignedFoods);
router.put('/profile', verifyToken, authorizeRoles('ngo'), ngoController.updateProfile);

// ✅ BACK TO ORIGINAL NAMES - matches Person 1's routes exactly
router.delete('/:id', verifyToken, authorizeRoles('admin'), ngoController.deleteNGO);
router.put('/:id', verifyToken, authorizeRoles('admin'), ngoController.updateNGO);

module.exports = router;