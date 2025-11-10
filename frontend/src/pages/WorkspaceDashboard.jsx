import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Users, ListCheck, UserPlus, Trash2, ArrowLeft } from "lucide-react";

function WorkspaceDashboard() {
  const { id } = useParams(); // workspace ID from URL
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Fetch workspace details
  const fetchWorkspace = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/workspaces/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWorkspace(res.data.workspace);
      setTasks(res.data.tasks || []);
      setIsAdmin(res.data.isAdmin);
    } catch (err) {
      console.error("Error fetching workspace:", err);
      setError("Unable to load workspace data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspace();
  }, [id]);

  // Invite a new member
  const handleInvite = async () => {
    if (!newMemberEmail) return;
    try {
      await axios.post(
        `http://localhost:5000/api/workspaces/${id}/invite`,
        { email: newMemberEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Member invited successfully");
      setNewMemberEmail("");
      fetchWorkspace();
    } catch (err) {
      alert("Failed to invite member");
      console.error(err);
    }
  };

  // Remove member (admin only)
  const handleRemove = async (memberId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/workspaces/${id}/remove`,
        { memberId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Member removed");
      fetchWorkspace();
    } catch (err) {
      alert("Error removing member");
      console.error(err);
    }
  };

  if (loading) return <div className="p-8">Loading workspace...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-4 flex items-center text-blue-500 hover:text-blue-700"
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> Back to Dashboard
      </button>

      <h1 className="text-3xl font-bold mb-6">{workspace?.name}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Members Section */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6">
          <div className="flex items-center mb-4">
            <Users className="w-6 h-6 mr-2 text-blue-500" />
            <h2 className="text-xl font-semibold">Members</h2>
          </div>
          <ul className="space-y-2">
            {workspace?.members?.map((member) => (
              <li
                key={member._id}
                className="flex justify-between items-center border-b border-gray-300 dark:border-gray-700 pb-2"
              >
                <span>{member?.email}</span>
                {isAdmin && (
                  <button
                    onClick={() => handleRemove(member._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </li>
            ))}
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
                    Status:{" "}
                    <span className="font-medium">{task.status || "Pending"}</span>
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
