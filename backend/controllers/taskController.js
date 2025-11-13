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
    const { workspaceId, category, priority, title, dueDate, page=1, limit=10 } = req.query;
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

    const pageNum = Math.max(parseInt(page), 1);
    const limitNum = Math.max(parseInt(limit), 1);
    const skip = (pageNum - 1) * limitNum;

    const totalTasks = await Task.countDocuments(query);
    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      totalTasks,
      totalPages: Math.ceil(totalTasks / limitNum),
      currentPage: pageNum,
      limit: limitNum,
      tasks,
    });
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

// ------------------ FETCH TASK STATISTICS ------------------
exports.getTaskStats = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user;
    // console.log("Fetching task stats for:", { workspaceId, userId });

    let filter = {};

    if (workspaceId) {
      filter.workspaceId = workspaceId;
    } else {
      filter.userId = userId;
    }

    const tasks = await Task.find(filter);

    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "completed").length;
    const pending = total - completed;

    // ---- Tasks completed per day ----
    const perDay = {};
    tasks.forEach(t => {
      if (t.status === "completed" && t.updatedAt) {
        const date = new Date(t.updatedAt).toLocaleDateString();
        perDay[date] = (perDay[date] || 0) + 1;
      }
    });

    // ---- Tasks completed per week ----
    const perWeek = {};
    tasks.forEach(t => {
      if (t.status === "completed" && t.updatedAt) {
        const d = new Date(t.updatedAt);
        const week = `${d.getFullYear()}-W${Math.ceil(d.getDate() / 7)}`;
        perWeek[week] = (perWeek[week] || 0) + 1;
      }
    });

    // ---- Top contributors ----
    let topContributors = [];
    if (workspaceId && workspaceId !== "personal") {
      const contributorCount = {};
      tasks.forEach(t => {
        const id = t.assignedTo?.toString() || t.userId?.toString();
        if (id) contributorCount[id] = (contributorCount[id] || 0) + 1;
      });

      topContributors = Object.entries(contributorCount)
        .map(([user, count]) => ({ user, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    }

    // ---- Task Priority Distribution ----
    const priorityDistribution = {};
    tasks.forEach(t => {
      const p = t.priority || "Unspecified";
      priorityDistribution[p] = (priorityDistribution[p] || 0) + 1;
    });

    res.json({ total, completed, pending, perDay, perWeek, topContributors, priorityDistribution });
  } catch (err) {
    console.error("Error in getTaskStats:", err);
    res.status(500).json({ message: "Failed to fetch task stats" });
  }
};
