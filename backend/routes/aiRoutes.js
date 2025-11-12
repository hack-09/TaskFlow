const express = require("express");
const router = express.Router();
const { suggestPriority, suggestDeadline } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

router.post("/priority", protect, suggestPriority);
router.post("/deadline", protect, suggestDeadline);

module.exports = router;
