const cron = require("node-cron");
const Task = require("../models/Task");
const { sendNotification } = require("./sendNotification");

// Runs every day at 9 AM server time
cron.schedule("0 9 * * *", async () => {
  console.log("Running daily task reminder check...");

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // find tasks due tomorrow
  const upcomingTasks = await Task.find({
    dueDate: { $gte: now, $lte: tomorrow },
    status: { $ne: "completed" },
  }).populate("userId workspaceId");

  for (const task of upcomingTasks) {
    const message = `Reminder: Task "${task.title}" is due soon (${task.dueDate.toDateString()}).`;

    // Send notification
    await sendNotification(task.userId, message);
  }

  console.log(`Reminders sent for ${upcomingTasks.length} tasks.`);
});
