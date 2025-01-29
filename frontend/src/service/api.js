import axios from "axios";

const API = axios.create({ baseURL: `${process.env.REACT_APP_ARI_CALL_URL}` }); // Use REACT_APP prefix

// Add Authorization header
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

export const fetchTasks = (query) => API.get('/tasks', { params: query });
export const createTask = (taskData) => API.post('/tasks', taskData);
export const updateTask = (taskId, updates) => API.put(`/tasks/${taskId}`, updates);
export const deleteTask = (taskId) => API.delete(`/tasks/${taskId}`);

export const fetchNotifications = () => API.get('/notifications');