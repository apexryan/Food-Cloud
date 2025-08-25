const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");

// Simple health/config endpoint to provide public key to the frontend
router.get("/config", (req, res) => {
  const key = process.env.RAZORPAY_KEY_ID;
  if (!key) {
    return res
      .status(500)
      .json({ success: false, message: "Missing RAZORPAY_KEY_ID" });
  }
  return res.json({ success: true, config: { key } });
});

// Create Razorpay order on server using secret
router.post("/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body || {};
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      return res
        .status(500)
        .json({ success: false, message: "Razorpay keys not configured" });
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) < 100) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount. Must be integer paise >= 100",
      });
    }

    const rzp = new Razorpay({ key_id, key_secret });

    const order = await rzp.orders.create({
      amount: Math.floor(Number(amount)),
      currency: String(currency || "INR").toUpperCase(),
      receipt: receipt || `rcpt_${Date.now()}`,
      payment_capture: 1,
    });

    return res.json({ success: true, order });
  } catch (err) {
    // Razorpay SDK often returns rich error in err.error
    const details = err?.error || err;
    console.error("Failed to create Razorpay order:", details);
    return res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: details?.description || details?.message || String(details),
      code: details?.code || undefined,
    });
  }
});

module.exports = router;
