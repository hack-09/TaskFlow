import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

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
                const res = await axios.get("http://localhost:5000/tasks", {
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
        <div className="dashboard">
            <h1>Welcome to Your Dashboard</h1>
            <div className="task-summary">
                <h2>Task Summary</h2>
                <div className="summary-cards">
                    <div className="card">Total: {summary.total}</div>
                    <div className="card">Pending: {summary.pending}</div>
                    <div className="card">Completed: {summary.completed}</div>
                    <div className="card">Overdue: {summary.overdue}</div>
                </div>
            </div>
            <div className="task-list-preview">
                <h2>Recent Tasks</h2>
                <ul>
                    {tasks.slice(0, 5).map((task) => (
                        <li key={task._id}>
                            {task.title} - {task.priority}
                        </li>
                    ))}
                </ul>
            </div>
            <button>Add New Task</button>
        </div>
    );
};

export default Dashboard;
