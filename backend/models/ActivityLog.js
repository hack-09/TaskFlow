const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      default: null,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },
    action: {
      type: String,
      enum: [
        "TASK_CREATED",
        "TASK_UPDATED",
        "TASK_DELETED",
        "WORKSPACE_CREATED",
        "WORKSPACE_UPDATED",
        "WORKSPACE_MEMBER_ADDED",
        "WORKSPACE_MEMBER_REMOVED",
      ],
      required: true,
    },
    details: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);
