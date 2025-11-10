const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/roleMiddleware");
const workspaceController = require("../controllers/workspaceController");

// CRUD
router.post("/", authMiddleware, workspaceController.createWorkspace);
router.get("/", authMiddleware, workspaceController.getUserWorkspaces);
router.get("/:id", authMiddleware, workspaceController.getWorkspaceById);
router.put("/:id", authMiddleware, checkRole(["admin"]), workspaceController.updateWorkspace);
router.delete("/:id", authMiddleware, checkRole(["admin"]), workspaceController.deleteWorkspace);

// Member management
router.post("/:id/invite", authMiddleware, checkRole(["admin"]), workspaceController.inviteMember);
router.delete("/:id/members/:memberId", authMiddleware, checkRole(["admin"]), workspaceController.removeMember);

module.exports = router;
