/*// controllers/reportController.js
const Food = require('../models/foodpost');
const User = require('../models/userModel');
const Volunteer = require('../models/volunteerModel');

const reportController = {
  // Dashboard statistics
  async getDashboardStats(req, res) {
    try {
      const totalUsers = await User.countDocuments();
      const totalVolunteers = await Volunteer.countDocuments();
      const totalFoodDonations = await Food.countDocuments();
      const activeDonations = await Food.countDocuments({ status: "pending" });

      res.json({
        totalUsers,
        totalVolunteers,
        totalFoodDonations,
        activeDonations
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Food donation analytics
  async getFoodDonationAnalytics(req, res) {
    try {
      const donationsByStatus = await Food.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]);

      res.json({ donationsByStatus });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = reportController;*/


// controllers/reportController.js
const FoodPost = require('../models/foodpost');  // ✅ FIXED: Changed from foodModel
const User = require('../models/userModel');
const Volunteer = require('../models/volunteerModel');

const reportController = {
  // Dashboard statistics
  async getDashboardStats(req, res) {
    try {
      const totalUsers = await User.countDocuments();
      const totalVolunteers = await Volunteer.countDocuments();
      const totalFoodDonations = await FoodPost.countDocuments();  // ✅ FIXED: FoodPost instead of Food
      const activeDonations = await FoodPost.countDocuments({ status: "available" });  // ✅ FIXED: status "available" instead of "pending"

      res.json({
        totalUsers,
        totalVolunteers,
        totalFoodDonations,
        activeDonations
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Food donation analytics
  async getFoodDonationAnalytics(req, res) {
    try {
      const donationsByStatus = await FoodPost.aggregate([  // ✅ FIXED: FoodPost instead of Food
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]);

      res.json({ donationsByStatus });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = reportController;