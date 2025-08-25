require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { verifyToken, authorizeRoles } = require("./middleware/authMiddleware");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Base route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes imports
const reportRoutes = require("./routes/reportRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const foodRoutes = require("./routes/foodroutes"); // ✅ YOUR Person 2 routes
const adminRoutes = require("./routes/adminRoutes");
const ngoRoutes = require("./routes/ngoRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes");
// Removed Razorpay routes
const chatRoutes = require("./routes/chatRoutes");
const razorpayRoutes = require("./routes/razorpayRoutes");

// Route middleware
app.use("/api/reports", reportRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/food", foodRoutes); // ✅ YOUR food system handles everything
app.use("/api/admins", adminRoutes);
app.use("/api/ngos", ngoRoutes);
app.use("/api/volunteers", volunteerRoutes);
// Removed Razorpay route mount
app.use("/api/chat", chatRoutes);
app.use("/api/razorpay", razorpayRoutes);

// ❌ REMOVED: Duplicate food route - your foodRoutes already handles admin access

// MongoDB connection - YOUR database
mongoose
  .connect(process.env.MONGODB_URI) // ✅ Change this to YOUR variable name
  .then(() => {
    console.log("✅ MongoDB connected...");
    app.listen(process.env.PORT || 5000, () => {
      console.log(
        `🚀 Server running on http://localhost:${process.env.PORT || 5000}`
      );
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
