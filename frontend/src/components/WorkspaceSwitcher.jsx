import React, { useState, useEffect } from "react";
import axios from "axios";
import { useWorkspace } from "../context/WorkspaceContext";

const WorkspaceSwitcher = () => {
  const { workspaceId, workspaceName, switchWorkspace } = useWorkspace();
  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.REACT_APP_ARI_CALL_URL}/workspaces`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWorkspaces(res.data);
      } catch (err) {
        console.error("Failed to fetch workspaces:", err);
      }
    };
    fetchWorkspaces();
  }, []);

  const handleSelect = (id, name) => {
    switchWorkspace(id, name);
  };

  return (
    <div className="relative inline-block">
      <select
        className="border rounded px-3 py-2 text-sm"
        value={workspaceId || ""}
        onChange={(e) => {
          const selected = workspaces.find(w => w._id === e.target.value);
          handleSelect(e.target.value || null, selected?.name || "Personal Workspace");
        }}
      >
        <option value="">Personal Workspace</option>
        {workspaces.map((w) => (
          <option key={w._id} value={w._id}>
            {w.name}
          </option>
        ))}
      </select>
      <span className="ml-2 text-gray-500 text-sm">({workspaceName})</span>
    </div>
  );
};

export default WorkspaceSwitcher;
