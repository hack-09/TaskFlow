const ActivityLog = require("../models/ActivityLog");

async function logActivity({ userId, workspaceId = null, taskId = null, action, details = "" }) {
  try {
    await ActivityLog.create({ userId, workspaceId, taskId, action, details });
  } catch (err) {
    console.error("Failed to log activity:", err.message);
  }
}

module.exports = logActivity;
