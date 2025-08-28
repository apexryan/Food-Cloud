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
} = require("../controllers/foodcontroller");

// Import middleware (the "security guards")
const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware"); // From Person 1
const { uploadMultiple, handleUploadError } = require("../middleware/upload"); // From Day 3

console.log("Setting up basic food routes...");


router.get("/", async (req, res) => {
  console.log(" GET /api/food - Fetching food posts");
  console.log("Query parameters:", req.query);
  await getAllFood(req, res);
});
console.log("Route registered: GET /api/food (Get all food posts)");


router.get("/:id", async (req, res) => {
  console.log(`  GET /api/food/${req.params.id} - Fetching single food post`);
  await getFoodById(req, res);
});
console.log("Route registered: GET /api/food/:id (Get single food post)");


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
