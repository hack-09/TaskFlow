import React, { useEffect, useState } from "react";
import {
  getWorkspaceDetails,
  removeWorkspace,
} from "../../service/workspaceService";
import axios from "axios";
import { useWorkspace } from "../../context/WorkspaceContext";

const WorkspaceMembers = () => {
  const { workspaceId } = useWorkspace();
  const [workspace, setWorkspace] = useState(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch workspace details (members, name, etc.)
  const fetchWorkspace = async () => {
    if (!workspaceId) return;
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${process.env.REACT_APP_ARI_CALL_URL}/workspaces/${workspaceId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWorkspace(data);
    } catch (err) {
      console.error("Failed to fetch workspace:", err);
      setError("Could not load workspace details.");
    }
  };

  useEffect(() => {
    fetchWorkspace();
  }, [workspaceId]);

  // Invite new member by email
  const handleInvite = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_ARI_CALL_URL}/workspaces/${workspaceId}/invite`,
        { email: inviteEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Invitation sent successfully!");
      setInviteEmail("");
      fetchWorkspace(); // refresh member list
    } catch (err) {
      console.error("Invite failed:", err);
      setError("Failed to send invitation.");
    } finally {
      setLoading(false);
    }
  };

  // Remove a member (admin only)
  const handleRemove = async (memberId) => {
    if (!window.confirm("Remove this member?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.REACT_APP_ARI_CALL_URL}/workspaces/${workspaceId}/members/${memberId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchWorkspace();
    } catch (err) {
      console.error("Remove failed:", err);
      alert("Failed to remove member");
    }
  };

  if (!workspaceId)
    return (
      <div className="p-6 text-center text-gray-500">
        No workspace selected. Please create or join one.
      </div>
    );

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-800 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">
        Members of Workspace: {workspace?.name}
      </h1>

      {/* Invite Section */}
      <form
        onSubmit={handleInvite}
        className="flex flex-col md:flex-row gap-2 mb-6"
      >
        <input
          type="email"
          placeholder="Invite member by email"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          required
          className="border p-2 rounded flex-1"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          {loading ? "Sending..." : "Send Invite"}
        </button>
      </form>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">{success}</p>}

      {/* Members List */}
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
          Members ({workspace?.members?.length || 0})
        </h2>
        {workspace?.members?.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-600">
            {workspace.members.map((member) => (
              <li
                key={member._id}
                className="flex justify-between items-center py-2"
              >
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-100">
                    {member.name || member.email}
                  </p>
                  <p className="text-sm text-gray-500">
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
