const express = require("express");
const router = express.Router();

// Get Razorpay configuration (public key only)
router.get("/config", (req, res) => {
  try {
    const config = {
      key: process.env.RAZORPAY_KEY_ID || "rzp_test_xEWdAnsz4jtFW5",
      environment: process.env.RAZORPAY_ENV || "test",
    };

    res.json({
      success: true,
      config,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to get Razorpay configuration",
    });
  }
});

module.exports = router;
