import axios from "axios";

const API = axios.create({ baseURL: `${process.env.ARI_CALL_URL}` });

export const login = (credentials) => API.post('api/auth/login', credentials);
export const register = (userData) => API.post('api/auth/register', userData);

export const fetchTasks = (query) => API.get('/tasks', { params: query });
export const createTask = (taskData) => API.post('/tasks', taskData);
export const updateTask = (taskId, updates) => API.put(`/tasks/${taskId}`, updates);
export const deleteTask = (taskId) => API.delete(`/tasks/${taskId}`);

export const fetchNotifications = () => API.get('/notifications');