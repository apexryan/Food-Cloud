const express = require("express");
const router = express.Router();
const { sendMessage, getHistory } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

// Public or protected? If you want only logged-in users, enable protect
// router.use(protect);

router.post("/message", sendMessage);
router.get("/history", getHistory);

module.exports = router;
