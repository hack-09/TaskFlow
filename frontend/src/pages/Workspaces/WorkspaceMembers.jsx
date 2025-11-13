import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useWorkspace } from "../../context/WorkspaceContext";
import { inviteMember, removeMember } from "../../service/api";
import { getWorkspaceDetails } from "../../service/workspaceService";

const WorkspaceMembers = () => {
  const { id } = useParams();
  const workspaceId = id;
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  // Fetch workspace details (members, name, etc.)
  const fetchWorkspace = async () => {
    if (!workspaceId) return;
    try {
      setLoading(true);
      const data = await getWorkspaceDetails(id);
      setWorkspace(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch workspace:", err);
      setMessage({ type: "error", text: "Could not load workspace details." });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspace();
  }, [workspaceId]);

  // Invite new member by email
  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) {
      setMessage({ type: "error", text: "Please enter a valid email." });
      return;
    }
    try {
      setLoading(true);
      const res = await inviteMember(workspaceId, inviteEmail);
      setMessage({ type: "success", text: res.data.message || "Invitation sent!" });
      setInviteEmail("");
      await fetchWorkspace(); // Reload workspace to show new member
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          "Failed to invite user. Check email or permissions.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Remove a member (admin only)
  const handleRemove = async (memberId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    try {
      await removeMember(workspaceId, memberId);
      setMessage({ type: "success", text: "Member removed successfully." });
      await fetchWorkspace();
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to remove member.",
      });
    }
  };

  if (!workspaceId)
    return (
      <div className="p-6 text-center text-gray-500">
        No workspace selected. Please create or join one.
      </div>
    );

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-800 h-fill">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">
        Members of Workspace: {workspace?.name || "Loading..."}
      </h1>

      {/* Invite Section */}
      <form
        onSubmit={handleInvite}
        className="flex flex-col md:flex-row gap-3 mb-6"
      >
        <input
          type="email"
          placeholder="Invite member by email"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          required
          className="border p-3 rounded flex-1 dark:bg-gray-700 dark:text-white"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow disabled:opacity-60"
        >
          {loading ? "Processing..." : "Send Invite"}
        </button>
      </form>

      {/* Message Alerts */}
      {message.text && (
        <p
          className={`mb-4 text-center font-medium ${
            message.type === "error"
              ? "text-red-600"
              : "text-green-600"
          }`}
        >
          {message.text}
        </p>
      )}

      {/* Members List */}
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-5">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Members ({workspace?.members?.length || 0})
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading members...</p>
        ) : workspace?.members?.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-600">
            {workspace.members.map((member) => (
              <li
                key={member._id}
                className="flex justify-between items-center py-3"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {member.name || member.email}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    {member.role === "admin" ? "Admin" : "Member"}
                  </p>
                </div>

                {workspace.role === "admin" && member.role !== "admin" && (
                  <button
                    onClick={() => handleRemove(member._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No members found.</p>
        )}
      </div>
    </div>
  );
};

export default WorkspaceMembers;
