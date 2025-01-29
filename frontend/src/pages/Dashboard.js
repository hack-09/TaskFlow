import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    overdue: 0,
  });

  // Fetch tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.REACT_APP_ARI_CALL_URL}/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(res.data);

        // Calculate summary
        const total = res.data.length;
        const pending = res.data.filter((task) => !task.completed).length;
        const completed = res.data.filter((task) => task.completed).length;
        const overdue = res.data.filter(
          (task) =>
            !task.completed && new Date(task.dueDate) < new Date()
        ).length;

        setSummary({ total, pending, completed, overdue });
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome to Your Dashboard</h1>
        
        {/* Task Summary */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Task Summary</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-blue-100 text-blue-700 p-4 rounded-lg text-center">
              <p className="text-lg font-medium">Total</p>
              <p className="text-2xl font-bold">{summary.total}</p>
            </div>
            <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg text-center">
              <p className="text-lg font-medium">Pending</p>
              <p className="text-2xl font-bold">{summary.pending}</p>
            </div>
            <div className="bg-green-100 text-green-700 p-4 rounded-lg text-center">
              <p className="text-lg font-medium">Completed</p>
              <p className="text-2xl font-bold">{summary.completed}</p>
            </div>
            <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center">
              <p className="text-lg font-medium">Overdue</p>
              <p className="text-2xl font-bold">{summary.overdue}</p>
            </div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Recent Tasks</h2>
          <ul className="space-y-3">
            {tasks.slice(0, 5).map((task) => (
              <li
                key={task._id}
                className="p-4 bg-gray-100 rounded-lg flex justify-between items-center"
              >
                <span className="font-medium text-gray-800">{task.title}</span>
                <span className="text-sm text-gray-600">Priority: {task.priority}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          Add New Task
        </button> */}
      </div>
    </div>
  );
};

export default Dashboard;
