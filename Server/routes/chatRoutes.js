const express = require("express");
const router = express.Router();
const { sendMessage, getHistory } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");



router.post("/message", sendMessage);
router.get("/history", getHistory);

module.exports = router;
