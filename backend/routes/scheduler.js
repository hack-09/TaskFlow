const cron = require("node-cron");
const Task = require("../models/Task");
const sendNotification = require("../utils/sendNotification");

cron.schedule("0 9 * * *", async () => {
    console.log("Scheduler is running at", new Date());
    try {
        const now = new Date();
        const task = await Task.find({
            dueDate: { $gte: now, $lte: new Date(now.getTime() + 24 * 60 * 60 * 1000) },
            status: { $ne: "Completed" },
        });

        task.forEach(task => {
            console.log(`Reminder: Task "${task.title}" is due on ${task.dueDate}!`);
            sendNotification(task.userId, `Task "${task.title}" is due on ${task.dueDate}`);
        });
    } catch (error) {
        console.error("Error in task reminder scheduler:", error);
    }
});

console.log("Task scheduler initialized.");

module.exports = cron;
