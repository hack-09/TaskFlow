const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const ActivityLog = require("../models/ActivityLog");

// Get activity for current user or workspace
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { workspaceId } = req.query;
    const filter = workspaceId ? { workspaceId } : { userId: req.user };
    const logs = await ActivityLog.find(filter)
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch activity logs" });
  }
});

module.exports = router;
