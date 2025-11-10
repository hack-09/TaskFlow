import axios from "axios";
import { useWorkspace } from "../context/WorkspaceContext"; // only if you want dynamic hook inside

const API = axios.create({ baseURL: `${process.env.REACT_APP_ARI_CALL_URL}` });

// Add Authorization header
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

/**
 * Helper to generate endpoint based on workspace context
 */
const taskEndpoint = (workspaceId) =>
  workspaceId ? `/workspaces/${workspaceId}/tasks` : "/tasks";

// ------------------- TASKS -------------------

// Pass workspaceId explicitly when calling these
export const fetchTasks = (workspaceId, query) =>
  API.get(taskEndpoint(workspaceId), { params: query });

export const createTask = (workspaceId, taskData) =>
  API.post(taskEndpoint(workspaceId), taskData);

export const updateTask = (workspaceId, taskId, updates) =>
  API.put(`${taskEndpoint(workspaceId)}/${taskId}`, updates);

export const deleteTask = (workspaceId, taskId) =>
  API.delete(`${taskEndpoint(workspaceId)}/${taskId}`);

// ------------------- NOTIFICATIONS -------------------

export const fetchNotifications = () => API.get("/notifications");
