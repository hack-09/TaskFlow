const Notification = require('../models/Notification');

const sendNotification = async (userId, message) => {
    try {
        const notification = new Notification({
            userId,
            message,
        });
        await notification.save();
    } catch (err) {
        console.error('Failed to send notification:', err.message);
    }
};

module.exports = sendNotification ;
