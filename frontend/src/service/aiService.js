import axios from "axios";

const API_URL = `${process.env.REACT_APP_ARI_CALL_URL}/ai`;

export const getAISuggestedPriority = (title, description) => {
  return axios.post(`${API_URL}/smart-priority`, { title, description });
};

export const getAISuggestedDeadline = (dueDate, status, dependencies) => {
  return axios.post(`${API_URL}/deadline`, { dueDate, status, dependencies });
};
