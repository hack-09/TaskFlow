const Workspace = require("../models/Workspace");
const User = require("../models/User");
const logActivity = require("../utils/logActivity");
const sendNotification = require("../utils/sendNotification");

// ------------------ CREATE WORKSPACE ------------------
exports.createWorkspace = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: "Workspace name is required" });

    const workspace = await Workspace.create({
      name,
      description,
      ownerId: req.user,
      members: [{ user: req.user, role: "admin" }],
    });

    await logActivity({
      userId: req.user,
      workspaceId: workspace._id,
      action: "WORKSPACE_CREATED",
      details: `Workspace "${name}" created`,
    });

    res.status(201).json(workspace);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create workspace" });
  }
};

// ------------------ GET ALL WORKSPACES (User’s) ------------------
exports.getUserWorkspaces = async (req, res) => {
  try {
    const userId = req.user; // Comes from authMiddleware
    console.log("Fetching workspaces for userId:", userId);

    const workspaces = await Workspace.find({
      $or: [
        { ownerId: userId },
        { "members.user": userId }
      ]
    }).populate("ownerId", "name email"); // populate owner info

    res.status(200).json(workspaces);
  } catch (err) {
    console.error("Error fetching user workspaces:", err);
    res.status(500).json({ error: "Failed to fetch workspaces" });
  }
};

// ------------------ GET WORKSPACE BY ID ------------------
exports.getWorkspaceById = async (req, res) => {
  try {
    const { id } = req.params;
    const workspace = await Workspace.findById(id)
      .populate("ownerId", "name email")
      .populate("members._id", "name email");

    if (!workspace) return res.status(404).json({ error: "Workspace not found" });

    const isMember =
      workspace.ownerId._id.toString() === req.user ||
      workspace.members.some((m) => m._id.toString() === req.user);

    if (!isMember)
      return res.status(403).json({ error: "Access denied: not a member" });

    res.status(200).json(workspace);
  } catch (err) {
    console.error("Error fetching workspace:", err);
    res.status(500).json({ error: "Failed to fetch workspace" });
  }
};

// ------------------ UPDATE WORKSPACE ------------------
exports.updateWorkspace = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const workspace = await Workspace.findOneAndUpdate(
      { _id: id, createdBy: req.user },
      { name, description },
      { new: true }
    );

    if (!workspace) return res.status(404).json({ message: "Workspace not found or not authorized" });

    await logActivity({
      userId: req.user,
      workspaceId: workspace._id,
      action: "WORKSPACE_UPDATED",
      details: `Workspace "${workspace.name}" updated`,
    });

    res.status(200).json(workspace);
  } catch (err) {
    res.status(500).json({ error: "Failed to update workspace" });
  }
};

// ------------------ DELETE WORKSPACE ------------------
exports.deleteWorkspace = async (req, res) => {
  try {
    const { id } = req.params;

    const workspace = await Workspace.findOneAndDelete({
      _id: id,
      createdBy: req.user,
    });

    if (!workspace) return res.status(404).json({ message: "Workspace not found or unauthorized" });

    await logActivity({
      userId: req.user,
      workspaceId: workspace._id,
      action: "WORKSPACE_DELETED",
      details: `Workspace "${workspace.name}" deleted`,
    });

    res.status(200).json({ message: "Workspace deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete workspace" });
  }
};

// ------------------ INVITE MEMBER ------------------
exports.inviteMember = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { email } = req.body;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) return res.status(404).json({ message: "Workspace not found" });

    if (!workspace.members.includes(req.user))
      return res.status(403).json({ message: "You are not a member of this workspace" });

    const userToAdd = await User.findOne({ email });
    if (!userToAdd) return res.status(404).json({ message: "User not found" });

    if (workspace.members.includes(userToAdd._id))
      return res.status(400).json({ message: "User already in workspace" });

    workspace.members.push(userToAdd._id);
    await workspace.save();

    await logActivity({
      userId: req.user,
      workspaceId,
      action: "WORKSPACE_MEMBER_ADDED",
      details: `${email} added to workspace "${workspace.name}"`,
    });

    res.status(200).json({ message: "Member added successfully", workspace });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to invite member" });
  }
};

// ------------------ REMOVE MEMBER ------------------
exports.removeMember = async (req, res) => {
  try {
    const { workspaceId, memberId } = req.params;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) return res.status(404).json({ message: "Workspace not found" });

    if (workspace.createdBy.toString() !== req.user)
      return res.status(403).json({ message: "Only workspace owner can remove members" });

    if (!workspace.members.includes(memberId))
      return res.status(400).json({ message: "Member not in workspace" });

    workspace.members.pull(memberId);
    await workspace.save();

    await logActivity({
      userId: req.user,
      workspaceId,
      action: "WORKSPACE_MEMBER_REMOVED",
      details: `Member ${memberId} removed from workspace "${workspace.name}"`,
    });

    res.status(200).json({ message: "Member removed successfully", workspace });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove member" });
  }
};