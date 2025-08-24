const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const adminAuth = require("../middleware/adminAuthMiddleware");

// ===== Public routes =====
router.post("/register", adminController.createAdmin); // Register new admin
router.post("/login", adminController.loginAdmin); // Login admin

// ===== Protected routes (Admin only) =====
router.get("/admins", adminAuth, adminController.getAllAdmins);
router.put("/admins/:id", adminAuth, adminController.updateAdmin); // ✅ Update Admin
router.delete("/admins/:id", adminAuth, adminController.deleteAdmin);
router.put("/change-password", adminAuth, adminController.changeAdminPassword); // ✅ Change Admin Password

router.get("/ngos", adminAuth, adminController.getAllNGOs);
router.put("/ngos/:id", adminAuth, adminController.updateNGO); // ✅ Update NGO
router.delete("/ngos/:id", adminAuth, adminController.deleteNGO);

router.get("/volunteers", adminAuth, adminController.getAllVolunteers);
router.put("/volunteers/:id", adminAuth, adminController.updateVolunteer); // ✅ Update Volunteer
router.delete("/volunteers/:id", adminAuth, adminController.deleteVolunteer);

router.get("/donors", adminAuth, adminController.getAllDonors);
router.put("/donors/:id", adminAuth, adminController.updateDonor); // ✅ Update Donor
router.delete("/donors/:id", adminAuth, adminController.deleteDonor);

// Food assignment
router.post("/assign-food", adminAuth, adminController.assignFoodToNGO);

module.exports = router;
