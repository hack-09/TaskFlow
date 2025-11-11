// controllers/taskController.js
const Task = require("../models/Task");
const Workspace = require("../models/Workspace");
const sendNotification = require("../utils/sendNotification");
const logActivity = require("../utils/logActivity");

// ------------------ CREATE TASK ------------------
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, status, category, priority, workspaceId } = req.body;
    const userId = req.user?.id || req.user?._id || req.user;

    let taskData = {
      title,
      description,
      dueDate,
      status,
      category,
      priority,
      userId: req.user,
    };

    // If it's a workspace task — verify access
    if (workspaceId) {
      const workspace = await Workspace.findById(workspaceId);
      if (!workspace) return res.status(404).json({ error: "Workspace not found" });

      const isMember =
        workspace.ownerId.toString() === userId ||
        workspace.members.some((m) => m.user.toString() === userId);

      if (!isMember)
        return res.status(403).json({ error: "You are not a member of this workspace" });

      taskData.workspaceId = workspaceId;
    }

    const task = await Task.create(taskData);
    await logActivity({
      userId: req.user,
      workspaceId: workspaceId || null,
      taskId: task._id,
      action: "TASK_CREATED",
      details: `Task "${task.title}" created`,
    });
    await sendNotification(req.user, `Task "${task.title}" created successfully.`);
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create task", details: err.message });
  }
};

// ✅ Get All Tasks (Personal + Workspace)
exports.getTasks = async (req, res) => {
  try {
    const { workspaceId, category, priority, title, dueDate } = req.query;
    const userId = req.user?.id || req.user?._id || req.user;
    const query = {};

    if (workspaceId) {
      const workspace = await Workspace.findById(workspaceId);
      if (!workspace) return res.status(404).json({ error: "Workspace not found" });

      const isMember =
        workspace.ownerId.toString() === userId ||
        workspace.members?.some((m) => m.user?.toString() === userId);

      if (!isMember)
        return res.status(403).json({
          error:
            "You are not authorized to view this workspace",
          debug: {
            workspaceId,
            ownerId: workspace.ownerId.toString(),
            userId
          }
        });

      query.workspaceId = workspaceId;
    } else {
      query.userId = req.user; // personal tasks
    }

    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (title) query.title = { $regex: title, $options: "i" };
    if (dueDate) query.dueDate = { $lte: new Date(dueDate) };

    const tasks = await Task.find(query);
    res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// ✅ Update Task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    // Permission check for workspace tasks
    if (task.workspaceId) {
      const workspace = await Workspace.findById(task.workspaceId);
      const isAdmin =
        workspace.ownerId.toString() === req.user ||
        workspace.members.some(
          (m) => m.user.toString() === req.user && m.role === "admin"
        );
      if (!isAdmin)
        return res.status(403).json({ error: "Only workspace admin can update this task" });
    } else if (task.userId.toString() !== req.user) {
      return res.status(403).json({ error: "You do not own this task" });
    }

    Object.assign(task, updates);
    await task.save();

    await logActivity({
      userId: req.user,
      workspaceId: task.workspaceId || null,
      taskId: task._id,
      action: "TASK_UPDATED",
      details: `Task "${task.title}" updated`,
    });
    await sendNotification(task.userId, `Task "${task.title}" updated.`);
    res.status(200).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update task" });
  }
};

// ✅ Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    // Permission check
    if (task.workspaceId) {
      const workspace = await Workspace.findById(task.workspaceId);
      const isAdmin =
        workspace.ownerId.toString() === req.user ||
        workspace.members.some(
          (m) => m.user.toString() === req.user && m.role === "admin"
        );
      if (!isAdmin)
        return res.status(403).json({ error: "Only workspace admin can delete this task" });
    } else if (task.userId.toString() !== req.user) {
      return res.status(403).json({ error: "You do not own this task" });
    }

    await task.deleteOne();
    await logActivity({
      userId: req.user,
      workspaceId: task.workspaceId || null,
      taskId: task._id,
      action: "TASK_DELETED",
      details: `Task "${task.title}" deleted`,
    });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete task" });
  }
};

// ------------------ ADD SUBTASK ------------------
exports.addSubtask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title) return res.status(400).json({ error: "Subtask title is required" });

    const task = await Task.findByIdAndUpdate(
      id,
      { $push: { subtasks: { title } } },
      { new: true }
    );

    if (!task) return res.status(404).json({ error: "Task not found" });

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to add subtask" });
  }
};

// ------------------ UPDATE SUBTASK ------------------
exports.updateSubtask = async (req, res) => {
  try {
    const { id, subtaskId } = req.params;
    const { title, status } = req.body;

    const validStatuses = ["Pending", "In-Progress", "Completed"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updateFields = {};
    if (title) updateFields["subtasks.$.title"] = title;
    if (status) updateFields["subtasks.$.status"] = status;

    const task = await Task.findOneAndUpdate(
      { _id: id, "subtasks._id": subtaskId },
      { $set: updateFields },
      { new: true }
    );

    if (!task) return res.status(404).json({ error: "Task or subtask not found" });

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to update subtask" });
  }
};

// ------------------ DELETE SUBTASK ------------------
exports.deleteSubtask = async (req, res) => {
  try {
    const { id, subtaskId } = req.params;

    const task = await Task.findByIdAndUpdate(
      id,
      { $pull: { subtasks: { _id: subtaskId } } },
      { new: true }
    );

    if (!task) return res.status(404).json({ error: "Task or subtask not found" });

    res.status(200).json({ message: "Subtask deleted successfully", task });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete subtask" });
  }
};
