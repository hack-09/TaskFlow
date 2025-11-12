const express = require("express");
const router = express.Router();
const rateLimiter = require("../middleware/rateLimiter.js");
const authMiddleware = require("../middleware/authMiddleware");
const aiController = require("../controllers/aiController");

router.post("/smart-priority", authMiddleware, rateLimiter, aiController.getSmartPriority);
router.post("/deadline", authMiddleware, rateLimiter, aiController.suggestDeadline);

module.exports = router;
