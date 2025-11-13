import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/ai`;

export const getAISuggestedPriority = (taskTitle, description, deadline) => {
  return axios.post(`${API_URL}/smart-priority`, { taskTitle, description, deadline },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
  });
};

export const getAISuggestedDeadline = (dueDate, status, dependencies) => {
  return axios.post(`${API_URL}/deadline`, { dueDate, status, dependencies });
};
