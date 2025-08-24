// Import Express router
const express = require("express");
const router = express.Router();

const FoodPost = require("../models/foodpost");

// Import our controller functions (the "brain")
const {
  createFood,
  getAllFood,
  getFoodById,
  updateFood,
  deleteFood,
  markAsUnavailable,
  markAsAvailable,
} = require("../controllers/foodcontroller");

// Import middleware (the "security guards")
const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware"); // From Person 1
const { uploadMultiple, handleUploadError } = require("../middleware/upload"); // From Day 3

console.log("Setting up basic food routes...");

// ================== PUBLIC ROUTES ==================

// ROUTE 1: Get all food posts
// URL: GET /api/food
// Access: Public (anyone can view available food)
router.get("/", async (req, res) => {
  console.log(" GET /api/food - Fetching food posts");
  console.log("Query parameters:", req.query);
  await getAllFood(req, res);
});
console.log("Route registered: GET /api/food (Get all food posts)");

// ROUTE 2: Get specific food post by ID
// URL: GET /api/food/:id
// Access: Public (anyone can view a food post)
router.get("/:id", async (req, res) => {
  console.log(`  GET /api/food/${req.params.id} - Fetching single food post`);
  await getFoodById(req, res);
});
console.log("Route registered: GET /api/food/:id (Get single food post)");

// ================== AUTHENTICATED ROUTES ==================

// ROUTE 3: Create new food post
// URL: POST /api/food
// Access: Authenticated users (donors)
// Features: Image upload, authentication required
router.post(
  "/",
  authenticateUser, // Check if user is logged in
  uploadMultiple, // Handle image uploads
  handleUploadError, // Handle upload errors
  async (req, res) => {
    console.log("POST /api/food - Creating new food post");
    console.log("User:", req.user.name, "(ID:", req.user.id, ")");
    console.log("Files uploaded:", req.files ? req.files.length : 0);
    await createFood(req, res);
  }
);
console.log("Route registered: POST /api/food (Create food post)");

// ROUTE 4: Update food post
// URL: PUT /api/food/:id
// Access: Owner, NGO, or Admin
router.put(
  "/:id",
  authenticateUser, // Must be logged in
  uploadMultiple, // Can upload new images
  handleUploadError, // Handle errors
  async (req, res) => {
    console.log(`PUT /api/food/${req.params.id} - Updating food post`);
    console.log("Updated by:", req.user.name, "(Role:", req.user.role, ")");
    await updateFood(req, res);
  }
);
console.log("Route registered: PUT /api/food/:id (Update food post)");

// ROUTE 5: Delete food post
// URL: DELETE /api/food/:id
// Access: Owner or Admin only
router.delete(
  "/:id",
  authenticateUser, // Must be logged in
  async (req, res) => {
    console.log(`DELETE /api/food/${req.params.id} - Deleting food post`);
    console.log("Deleted by:", req.user.name, "(Role:", req.user.role, ")");
    await deleteFood(req, res);
  }
);
console.log("Route registered: DELETE /api/food/:id (Delete food post)");

// ROUTE 6: Admin - Mark food post as unavailable
// URL: PUT /api/food/:id/unavailable
// Access: Admin only
router.put(
  "/:id/unavailable",
  authenticateUser, // Must be logged in
  authorizeRoles("admin"), // Must be admin
  async (req, res) => {
    console.log(
      `PUT /api/food/${req.params.id}/unavailable - Marking as unavailable`
    );
    console.log("Action by:", req.user.name, "(Role:", req.user.role, ")");
    await markAsUnavailable(req, res);
  }
);
console.log(
  "Route registered: PUT /api/food/:id/unavailable (Admin mark as unavailable)"
);

// ROUTE 7: Admin - Mark food post as available
// URL: PUT /api/food/:id/available
// Access: Admin only
router.put(
  "/:id/available",
  authenticateUser, // Must be logged in
  authorizeRoles("admin"), // Must be admin
  async (req, res) => {
    console.log(
      `PUT /api/food/${req.params.id}/available - Marking as available`
    );
    console.log("Action by:", req.user.name, "(Role:", req.user.role, ")");
    await markAsAvailable(req, res);
  }
);
console.log(
  "Route registered: PUT /api/food/:id/available (Admin mark as available)"
);

// ================== ERROR HANDLING ==================

// Catch-all for undefined routes
// Option 1: matches everything
router.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    availableRoutes: [
      "GET /api/food - Get all food posts",
      "GET /api/food/:id - Get single food post",
      "POST /api/food - Create food post (auth required)",
      "PUT /api/food/:id - Update food post (auth required)",
      "DELETE /api/food/:id - Delete food post (auth required)",
      "PUT /api/food/:id/unavailable - Mark as unavailable (admin only)",
      "PUT /api/food/:id/available - Mark as available (admin only)",
    ],
  });
});

module.exports = router;
