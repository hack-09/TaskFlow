// src/pages/WorkspaceList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { fetchWorkspaces } from "../../service/workspaceService";

const WorkspaceList = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [newWorkspace, setNewWorkspace] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkspacesDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetchWorkspaces();
        setWorkspaces(res);
      } catch (err) {
        console.error("Failed to fetch workspaces:", err);
      }
    };
    fetchWorkspacesDetails();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Your Workspaces</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {workspaces.map((w) => (
          <div
            key={w._id}
            className="p-4 bg-white rounded shadow cursor-pointer hover:bg-gray-100"
            onClick={() => navigate(`/workspace/${w._id}`)}
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
