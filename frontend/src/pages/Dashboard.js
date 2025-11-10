import React, { useEffect, useState } from "react";
import { useWorkspace } from "../context/WorkspaceContext";
import { useSocket } from "../context/SocketContext";
import axios from "axios";

const Dashboard = () => {
  const { socket } = useSocket(); // keep socket for real-time personal tasks
  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
  });

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return console.warn("No auth token found.");
      const res = await axios.get(`${process.env.REACT_APP_ARI_CALL_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
      calculateSummary(res.data);
    } catch (err) {
      console.error("Failed to fetch personal tasks:", err);
    }
  };

  const calculateSummary = (taskList) => {
    const total = taskList.length;
    const pending = taskList.filter((t) => t.status === "pending").length;
    const inProgress = taskList.filter((t) => t.status === "in progress").length;
    const completed = taskList.filter((t) => t.status === "completed").length;
    const overdue = taskList.filter(
      (t) =>
        t.status !== "completed" &&
        t.dueDate &&
        new Date(t.dueDate) < new Date()
    ).length;
    setSummary({ total, pending, inProgress, completed, overdue });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">
          {"Personal Dashboard"}
        </h1>
        <span className="text-gray-500 text-sm">
          {tasks.length} {"Personal"} Tasks
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="p-4 bg-white rounded shadow">Total: {summary.total}</div>
        <div className="p-4 bg-yellow-100 rounded shadow">Pending: {summary.pending}</div>
        <div className="p-4 bg-blue-100 rounded shadow">In Progress: {summary.inProgress}</div>
        <div className="p-4 bg-green-100 rounded shadow">Completed: {summary.completed}</div>
        <div className="p-4 bg-red-100 rounded shadow">Overdue: {summary.overdue}</div>
      </div>

      {tasks.length === 0 ? (
        <p className="text-gray-400 text-center mt-10">
          No tasks found for this {"account"}.
        </p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task._id} className="p-4 bg-white rounded shadow hover:bg-gray-50">
              <h2 className="font-semibold text-lg">{task.title}</h2>
              <p>Status: <span className="font-medium">{task.status}</span></p>
              <p>Priority: {task.priority}</p>
              <p>Category: {task.category}</p>
              <p>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
