const Notification = require("../models/Notification");
const { io } = require("../server"); // Import your socket instance

exports.sendNotification = async (userId, message, type = "info", link = "") => {
  try {
    const notification = await Notification.create({ userId, message, type, link });

    // Emit to user in real time if connected
    io.to(userId.toString()).emit("notification", notification);

    return notification;
  } catch (err) {
    console.error("Error sending notification:", err.message);
  }
};
