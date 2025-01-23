import React, { useState, useEffect } from "react";
import AddTaskModal from "./AddTaskModal";
import Navbar from "./Navbar";
import axios from "axios";
import "./TaskList.css";

const TaskList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        status: "",
        priority: "",
        dueDate: "",
    });

    const handleTaskAdded = (newTask) => {
        setTasks([...tasks, newTask]);
    };

    // Fetch tasks from the backend
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:5000/tasks", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTasks(res.data);
                setFilteredTasks(res.data); // Initialize with all tasks
            } catch (err) {
                console.error("Failed to fetch tasks:", err);
            }
        };
        fetchTasks();
    }, []);

    // Handle search and filter logic
    useEffect(() => {
        let updatedTasks = tasks;

        // Search by title
        if (searchTerm) {
            updatedTasks = updatedTasks.filter((task) =>
                task.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by status
        if (filters.status) {
            updatedTasks = updatedTasks.filter((task) =>
                filters.status === "overdue"
                    ? !task.completed && new Date(task.dueDate) < new Date()
                    : task.status === filters.status
            );
        }

        // Filter by priority
        if (filters.priority) {
            updatedTasks = updatedTasks.filter(
                (task) => task.priority === filters.priority
            );
        }

        // Filter by due date
        if (filters.dueDate) {
            updatedTasks = updatedTasks.filter(
                (task) => new Date(task.dueDate).toISOString().split("T")[0] === filters.dueDate
            );
        }

        setFilteredTasks(updatedTasks);
    }, [tasks, searchTerm, filters]);

    return (
        <div style={{ display: "flex"}}>
            <Navbar/>
            <div className="task-list">
                <h1>Your Tasks</h1>

                <div className="filters">
                    <input
                        type="text"
                        placeholder="Search by title"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="overdue">Overdue</option>
                    </select>

                    <select
                        value={filters.priority}
                        onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                    >
                        <option value="">All Priorities</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>

                    <input
                        type="date"
                        value={filters.dueDate}
                        onChange={(e) => setFilters({ ...filters, dueDate: e.target.value })}
                    />

                    <button onClick={() => setIsModalOpen(true)}>Add New Task</button>
                    <AddTaskModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onTaskAdded={handleTaskAdded}
                    />
                </div>

                <ul className="task-list-items">
                    {filteredTasks.map((task) => (
                        <li key={task._id} className={`task ${task.priority}`}>
                            <h3>{task.title}</h3>
                            <p>Priority: {task.priority}</p>
                            <p>Status: {task.completed ? "Completed" : "Pending"}</p>
                            <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TaskList;
