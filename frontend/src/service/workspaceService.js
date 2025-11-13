import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Attach JWT automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// ─── CRUD ──────────────────────────────

// Fetch all workspaces where user is a member
export const fetchWorkspaces = async () => {
  const { data } = await API.get("/workspaces");
  return data;
};

// Create new workspace
export const createWorkspace = async (workspaceData) => {
  const { data } = await API.post("/workspaces", workspaceData);
  return data;
};

// Join an existing workspace via invite code
export const joinWorkspace = async (inviteCode) => {
  const { data } = await API.post(`/workspaces/join`, { inviteCode });
  return data;
};

// Remove user or delete workspace (admin)
export const removeWorkspace = async (workspaceId) => {
  const { data } = await API.delete(`/workspaces/${workspaceId}`);
  return data;
};

// Get workspace details
export const getWorkspaceDetails = async (workspaceId) => {
  const { data } = await API.get(`/workspaces/${workspaceId}`);
  return data;
};
