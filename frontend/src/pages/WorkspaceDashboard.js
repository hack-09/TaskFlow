import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { Users, ListCheck, Activity, UserPlus, ArrowLeft } from "lucide-react";
import { useSocket } from "../context/SocketContext";
import { getWorkspaceDetails } from "../service/workspaceService";
import ActivityLog from "../components/ActivityLog";

function WorkspaceDashboard() {
  const { id } = useParams(); // workspace ID from URL
  const navigate = useNavigate();
  const { socket } = useSocket();

  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const userId = decoded?.id || decoded?._id; 

  // Fetch workspace details
  const fetchWorkspace = async () => {
    try {
      setLoading(true);
      const res = await getWorkspaceDetails(id);
      const data = res.workspace || res;
      setWorkspace(data);
      setIsAdmin(data?.ownerId._id == userId || false);
    } catch (err) {
      console.error("Error fetching workspace:", err);
      setError("Unable to load workspace data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspace();
  }, [id]);

  // Socket join/leave workspace room
  useEffect(() => {
    if (!socket) return;
    socket.emit("joinWorkspace", id);
    return () => socket.emit("leaveWorkspace", id);
  }, [socket, id]);

  if (loading) return <div className="p-8">Loading workspace...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!workspace) return <div className="p-8 text-gray-500">No workspace data found</div>;

  // UI
  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-4 flex items-center text-blue-500 hover:text-blue-700"
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> Back to Dashboard
      </button>

      <h1 className="text-3xl font-bold mb-6">{workspace?.name || "Workspace"}</h1>

      {/* ─────────────── Workspace Actions ─────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tasks */}
        <div
          onClick={() => navigate(`/workspace/${id}/tasks`)}
          className="cursor-pointer bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 hover:shadow-xl transition"
        >
          <div className="flex items-center mb-2">
            <ListCheck className="w-6 h-6 mr-2 text-blue-500" />
            <h2 className="text-lg font-semibold">Tasks</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            View and manage all tasks within this workspace.
          </p>
        </div>

        {/* Members */}
        <div
          onClick={() => navigate(`/workspace/${id}/members`)}
          className="cursor-pointer bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 hover:shadow-xl transition"
        >
          <div className="flex items-center mb-2">
            <Users className="w-6 h-6 mr-2 text-purple-500" />
            <h2 className="text-lg font-semibold">Members</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            View all workspace members and manage access.
          </p>
        </div>

        {/* Activity Log */}
        <div
          onClick={() => navigate(`/workspace/${id}/activity`)}
          className="cursor-pointer bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 hover:shadow-xl transition"
        >
          <div className="flex items-center mb-2">
            <Activity className="w-6 h-6 mr-2 text-orange-500" />
            <h2 className="text-lg font-semibold">Activity Log</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Track all recent actions performed by workspace members.
          </p>
        </div>
      </div>
    </div>
  );
}

export default WorkspaceDashboard;
