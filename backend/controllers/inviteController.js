// const Invitation = require("../models/Invitation");
// const Workspace = require("../models/Workspace");

// exports.getInvitations = async (req, res) => {
//   try {
//     const invitations = await Invitation.find({ receiver: req.user.id })
//       .populate("workspace", "name")
//       .populate("sender", "name email");
//     res.status(200).json(invitations);
//   } catch (err) {
//     console.error("Error fetching invitations:", err);
//     res.status(500).json({ error: "Failed to fetch invitations" });
//   }
// };

// exports.respondToInvite = async (req, res) => {
//   try {
//     const { inviteId } = req.params;
//     const { response } = req.body;

//     const invite = await Invitation.findById(inviteId);
//     if (!invite) return res.status(404).json({ message: "Invite not found" });
//     if (invite.receiver.toString() !== req.user.id)
//       return res.status(403).json({ message: "Not authorized" });

//     if (response === "accept") {
//       const workspace = await Workspace.findById(invite.workspace);
//       workspace.members.push(req.user.id);
//       await workspace.save();
//     }

//     await invite.deleteOne();
//     res.status(200).json({ message: `Invitation ${response}ed successfully.` });
//   } catch (err) {
//     console.error("Error responding to invitation:", err);
//     res.status(500).json({ error: "Failed to respond to invitation" });
//   }
// };
