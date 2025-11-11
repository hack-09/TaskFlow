import axios from "axios";
import { useWorkspace } from "../context/WorkspaceContext"; // only if you want dynamic hook inside

const API = axios.create({ baseURL: `${process.env.REACT_APP_ARI_CALL_URL}` });

// Add Authorization header
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// ------------------- TASKS -------------------

// Pass workspaceId explicitly when calling these

export const fetchTasks = (workspaceId, query) =>
  API.get("/tasks", { params: { ...query, workspaceId } });

export const createTask = (workspaceId, taskData) =>
  API.post("/tasks", { ...taskData, workspaceId });

export const updateTask = (taskId, updates) =>
  API.put(`/tasks/${taskId}`, updates);

export const deleteTask = (taskId) =>
  API.delete(`/tasks/${taskId}`);

// ------------------- NOTIFICATIONS -------------------

export const fetchNotifications = () => API.get("/notifications");

export const markNotificationAsRead = (id) =>
  API.put(`/notifications/${id}/read`);

export const markAllNotificationsRead = () =>
  API.put(`/notifications/read/all`);

