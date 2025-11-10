import React, { createContext, useContext, useState, useEffect } from "react";

const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children }) => {
  const [workspaceId, setWorkspaceId] = useState(null); // null = personal mode
  const [workspaceName, setWorkspaceName] = useState("Personal Workspace");

  // Load from localStorage on startup
  useEffect(() => {
    const stored = localStorage.getItem("activeWorkspace");
    const storedName = localStorage.getItem("activeWorkspaceName");
    if (stored) setWorkspaceId(stored);
    if (storedName) setWorkspaceName(storedName);
  }, []);

  // Persist on change
  useEffect(() => {
    if (workspaceId)
      localStorage.setItem("activeWorkspace", workspaceId);
    else
      localStorage.removeItem("activeWorkspace");

    localStorage.setItem("activeWorkspaceName", workspaceName);
  }, [workspaceId, workspaceName]);

  // Switch workspace (null means personal)
  const switchWorkspace = (id, name = "Personal Workspace") => {
    setWorkspaceId(id || null);
    setWorkspaceName(name);
  };

  return (
    <WorkspaceContext.Provider
      value={{
        workspaceId,
        workspaceName,
        switchWorkspace,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => useContext(WorkspaceContext);
