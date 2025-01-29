import React, { useState, useEffect } from "react";
import AddTaskModal from "./AddTaskModal";
import Navbar from "./Navbar";
import axios from "axios";

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
        <div className="flex min-h-screen bg-gray-100">
            <div className="w-full p-8">
                <h1 className="text-3xl font-bold text-blue-600 mb-6">Your Tasks</h1>

                <div className="flex flex-wrap gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search by title"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border p-2 rounded-lg w-full md:w-1/4 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />

                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="border p-2 rounded-lg w-full md:w-1/4 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="overdue">Overdue</option>
                    </select>

                    <select
                        value={filters.priority}
                        onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                        className="border p-2 rounded-lg w-full md:w-1/4 focus:ring-2 focus:ring-blue-600 focus:outline-none"
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
                        className="border p-2 rounded-lg w-full md:w-1/4 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 w-full md:w-auto"
                    >
                        Add New Task
                    </button>
                    <AddTaskModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onTaskAdded={handleTaskAdded}
                    />
                </div>

                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTasks.map((task) => (
                        <li
                            key={task._id}
                            className={`bg-white p-4 rounded-lg shadow-md border-l-4 ${
                                task.priority === "High"
                                    ? "border-red-500"
                                    : task.priority === "Medium"
                                    ? "border-yellow-500"
                                    : "border-green-500"
                            }`}
                        >
                            <h3 className="text-lg font-semibold mb-2 text-gray-800">
                                {task.title}
                            </h3>
                            <p className="text-sm text-gray-600">Priority: {task.priority}</p>
                            <p className="text-sm text-gray-600">
                                Status: {task.completed ? "Completed" : "Pending"}
                            </p>
                            <p className="text-sm text-gray-600">
                                Due Date: {new Date(task.dueDate).toLocaleDateString()}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TaskList;
