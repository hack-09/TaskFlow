// src/pages/WorkspaceList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const WorkspaceList = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [newWorkspace, setNewWorkspace] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.REACT_APP_ARI_CALL_URL}/workspaces/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched workspaces:", res.data);
        setWorkspaces(res.data);
      } catch (err) {
        console.error("Failed to fetch workspaces:", err);
      }
    };
    fetchWorkspaces();
  }, []);

  const handleCreate = async () => {
    if (!newWorkspace.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${process.env.REACT_APP_ARI_CALL_URL}/workspaces`,
        { name: newWorkspace },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWorkspaces([res.data, ...workspaces]);
      setNewWorkspace("");
    } catch (err) {
      console.error("Failed to create workspace:", err);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Your Workspaces</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="New workspace name"
          value={newWorkspace}
          onChange={(e) => setNewWorkspace(e.target.value)}
          className="px-3 py-2 border rounded w-64"
        />
        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {workspaces.map((w) => (
          <div
            key={w._id}
            className="p-4 bg-white rounded shadow cursor-pointer hover:bg-gray-100"
            onClick={() => navigate(`/workspaces/${w._id}`)}
          >
            <h2 className="font-semibold text-lg">{w.name}</h2>
            <p className="text-gray-500 text-sm">
              Members: {w.members?.length || 1}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkspaceList;
