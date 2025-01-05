const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const Notification = require("../models/Notification");

router.get("/", authMiddleware, async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user }).sort({ timestamp: -1 });
        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch notifications" });
    }
});

router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );

        if (!notification) return res.status(404).json({ message: 'Notification not found' });

        res.status(200).json(notification);
    } catch (err) {
        res.status(500).json({ message: "Failed to mark notification as read" });
    }
});

module.exports = router;
