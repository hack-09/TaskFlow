import axios from "axios";

// Create an Axios instance with the base URL
const API = axios.create({ baseURL: process.env.REACT_APP_API_URL }); // Use REACT_APP prefix

// Export login and register API calls
export const login = (credentials) => API.post('api/auth/login', credentials);
export const register = (userData) => API.post('api/auth/register', userData);
