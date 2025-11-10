import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Users, ListCheck, UserPlus, Trash2, ArrowLeft } from "lucide-react";
import { useSocket } from "../context/SocketContext"; // optional — if you have it

function WorkspaceDashboard() {
  const { id } = useParams(); // workspace ID from URL
  const navigate = useNavigate();
  const socketContext = useSocket?.(); // might be undefined if you don't have SocketContext
  const socket = socketContext ? socketContext.socket : null;

  const [workspace, setWorkspace] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE = process.env.REACT_APP_ARI_CALL_URL || "http://localhost:5000";
  const token = localStorage.getItem("token");

  // Fetch workspace details
  const fetchWorkspace = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_BASE}/workspaces/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // backend may return workspace directly or wrapped; handle both
      const payload = res.data || {};
      const ws = payload.workspace || payload; // if backend returns workspace object directly
      const wsTasks = payload.tasks || payload.tasks === undefined ? (payload.tasks || []) : [];

      setWorkspace(ws);
      setTasks(wsTasks.length ? wsTasks : payload.tasks || []); // keep tasks if provided
      setIsAdmin(Boolean(payload.isAdmin || ws.isAdmin)); // support both shapes

      // in case backend returns member.user populated or flattened email, no-op here
    } catch (err) {
      console.error("Error fetching workspace:", err);
      setError("Unable to load workspace data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspace();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Socket real-time (optional)
  useEffect(() => {
    if (!socket) return;

    socket.emit("joinWorkspace", id);

    const handleTaskUpdate = (updatedTask) => {
      setTasks((prev) => {
        const exists = prev.some((t) => t._id === updatedTask._id);
        return exists ? prev.map((t) => (t._id === updatedTask._id ? updatedTask : t)) : [updatedTask, ...prev];
      });
    };
    const handleTaskCreate = (newTask) => setTasks((prev) => [newTask, ...prev]);
    const handleTaskDelete = (deletedId) => setTasks((prev) => prev.filter((t) => t._id !== deletedId));

    socket.on("workspaceTaskUpdated", handleTaskUpdate);
    socket.on("workspaceTaskCreated", handleTaskCreate);
    socket.on("workspaceTaskDeleted", handleTaskDelete);

    return () => {
      socket.emit("leaveWorkspace", id);
      socket.off("workspaceTaskUpdated", handleTaskUpdate);
      socket.off("workspaceTaskCreated", handleTaskCreate);
      socket.off("workspaceTaskDeleted", handleTaskDelete);
    };
  }, [socket, id]);

  // Invite a new member
  const handleInvite = async () => {
    const email = (newMemberEmail || "").trim();
    if (!email) return alert("Enter a valid email");
    try {
      await axios.post(
        `${API_BASE}/workspaces/${id}/invite`,
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Member invited successfully");
      setNewMemberEmail("");
      fetchWorkspace();
    } catch (err) {
      console.error("Invite failed:", err);
      alert("Failed to invite member");
    }
  };

  // Remove member (admin only) — tries DELETE then falls back to legacy POST /remove
  const handleRemove = async (memberId) => {
    if (!window.confirm("Remove this member?")) return;
    try {
      // preferred RESTful delete endpoint
      await axios.delete(`${API_BASE}/workspaces/${id}/members/${memberId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Member removed");
      fetchWorkspace();
    } catch (err) {
      // fallback for projects that still use POST /remove
      try {
        await axios.post(
          `${API_BASE}/workspaces/${id}/remove`,
          { memberId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Member removed (fallback)");
        fetchWorkspace();
      } catch (err2) {
        console.error("Remove failed:", err2);
        alert("Error removing member");
      }
    }
  };

  if (loading) return <div className="p-8">Loading workspace...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!workspace) return <div className="p-8 text-gray-500">No workspace data</div>;

  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-4 flex items-center text-blue-500 hover:text-blue-700"
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> Back to Dashboard
      </button>

      <h1 className="text-3xl font-bold mb-6">{workspace?.name || "Workspace"}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Members Section */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6">
          <div className="flex items-center mb-4">
            <Users className="w-6 h-6 mr-2 text-blue-500" />
            <h2 className="text-xl font-semibold">Members</h2>
          </div>

          <ul className="space-y-2">
            {(workspace?.members || []).map((member) => {
              // be tolerant with shapes: member.email OR member.user.email
              const email = member?.email || member?.user?.email || member?.user;
              return (
                <li
                  key={member._id || member.user?._id || email}
                  className="flex justify-between items-center border-b border-gray-300 dark:border-gray-700 pb-2"
                >
                  <span>{email || "Unknown"}</span>
                  {isAdmin && (
                    <button
                      onClick={() => handleRemove(member._id || member.user?._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </li>
              );
            })}
            {(!workspace?.members || workspace.members.length === 0) && (
              <p className="text-gray-500 italic">No members yet</p>
            )}
          </ul>

          {isAdmin && (
            <div className="mt-4 flex">
              <input
                type="email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                placeholder="Invite member by email"
                className="border rounded-l-lg p-2 flex-1 dark:bg-gray-700"
              />
              <button
                onClick={handleInvite}
                className="bg-green-600 hover:bg-green-700 text-white px-4 rounded-r-lg flex items-center"
              >
                <UserPlus className="w-4 h-4 mr-1" /> Invite
              </button>
            </div>
          )}
        </div>

        {/* Tasks Section */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6">
          <div className="flex items-center mb-4">
            <ListCheck className="w-6 h-6 mr-2 text-blue-500" />
            <h2 className="text-xl font-semibold">Workspace Tasks</h2>
          </div>

          {tasks.length === 0 ? (
            <p className="text-gray-500 italic">No tasks yet</p>
          ) : (
            <ul className="space-y-3">
              {tasks.map((task) => (
                <li
                  key={task._id}
                  className="p-3 border border-gray-300 dark:border-gray-700 rounded-lg"
                >
                  <h3 className="font-semibold">{task.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {task.description}
                  </p>
                  <p className="text-xs mt-1">
                    Status: <span className="font-medium">{task.status || "Pending"}</span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default WorkspaceDashboard;
