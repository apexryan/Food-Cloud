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

// Route middleware
app.use("/api/reports", reportRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ngo", ngoRoutes);
app.use("/api/volunteer", volunteerRoutes);
app.use("/api/chat", chatRoutes);


mongoose
  .connect(process.env.MONGODB_URI) 
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
