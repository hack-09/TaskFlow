// routes/tasks.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const taskController = require("../controllers/taskController");

// Task CRUD
router.post("/", authMiddleware, taskController.createTask);
router.get("/", authMiddleware, taskController.getTasks);
router.put("/:id", authMiddleware, taskController.updateTask);
router.delete("/:id", authMiddleware, taskController.deleteTask);

// Subtasks
router.post("/:id/subtasks", authMiddleware, taskController.addSubtask);
router.put("/:id/subtasks/:subtaskId", authMiddleware, taskController.updateSubtask);
router.delete("/:id/subtasks/:subtaskId", authMiddleware, taskController.deleteSubtask);

module.exports = router;
