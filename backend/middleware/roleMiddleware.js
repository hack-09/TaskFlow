const Workspace = require("../models/Workspace");

/**
 * Middleware to check if user has a specific role (e.g., "admin") in the workspace.
 * Use after authMiddleware so req.user is available.
 */
const checkRole = (requiredRoles = []) => {
  return async (req, res, next) => {
    try {
      const workspaceId = req.params.id || req.body.workspaceId;
      if (!workspaceId)
        return res.status(400).json({ error: "Workspace ID is required" });

      const workspace = await Workspace.findById(workspaceId);
      if (!workspace)
        return res.status(404).json({ error: "Workspace not found" });

      // Allow owner full access
      if (workspace.owner.toString() === req.user) {
        req.workspace = workspace;
        return next();
      }

      // Check member role
      const member = workspace.members.find(
        (m) => m.user.toString() === req.user
      );

      if (!member)
        return res.status(403).json({ error: "You are not a member of this workspace" });

      if (!requiredRoles.includes(member.role))
        return res.status(403).json({ error: "Insufficient permissions" });

      req.workspace = workspace;
      next();
    } catch (err) {
      console.error("Role check failed:", err);
      res.status(500).json({ error: "Role check failed" });
    }
  };
};

module.exports = checkRole;
