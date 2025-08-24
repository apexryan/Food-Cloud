// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const { getDashboardStats, getFoodDonationAnalytics } = require('../controllers/reportController');

// GET dashboard stats
router.get('/dashboard', getDashboardStats);

// GET food donation analytics
router.get('/food-analytics', getFoodDonationAnalytics);

module.exports = router;