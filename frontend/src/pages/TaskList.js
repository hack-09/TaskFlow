import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import AddTaskModal from "./AddTaskModal";
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
        category: "",
    });

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:5000/tasks", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTasks(res.data);
                setFilteredTasks(res.data);
            } catch (err) {
                console.error("Failed to fetch tasks:", err);
            }
        };
        fetchTasks();
    }, []);

    useEffect(() => {
        let updatedTasks = tasks;

        if (searchTerm) {
            updatedTasks = updatedTasks.filter((task) =>
                task.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (filters.status) {
            updatedTasks = updatedTasks.filter((task) =>
                filters.status === "overdue"
                    ? !task.completed && new Date(task.dueDate) < new Date()
                    : task.status === filters.status
            );
        }
        if (filters.priority) {
            updatedTasks = updatedTasks.filter(
                (task) => task.priority === filters.priority
            );
        }
        if (filters.dueDate) {
            updatedTasks = updatedTasks.filter(
                (task) => new Date(task.dueDate).toISOString().split("T")[0] === filters.dueDate
            );
        }
        if (filters.category) {
            updatedTasks = updatedTasks.filter(
                (task) => task.category === filters.category
            );
        }

        setFilteredTasks(updatedTasks);
    }, [tasks, searchTerm, filters]);

    const handleDelete = async (taskId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5000/tasks/${taskId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(tasks.filter((task) => task._id !== taskId));
        } catch (err) {
            console.error("Failed to delete task:", err);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="w-full p-6">
                <h1 className="text-3xl font-bold text-blue-600 mb-6">Your Tasks</h1>

                <div className="flex flex-wrap gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search by title"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border p-2 rounded-lg w-full md:w-1/4 focus:ring-2 focus:ring-blue-600"
                    />

                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="border p-2 rounded-lg w-full md:w-1/4 focus:ring-2 focus:ring-blue-600"
                    >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="overdue">Overdue</option>
                    </select>

                    <select
                        value={filters.priority}
                        onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                        className="border p-2 rounded-lg w-full md:w-1/4 focus:ring-2 focus:ring-blue-600"
                    >
                        <option value="">All Priorities</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>

                    <select
                        value={filters.category}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                        className="border p-2 rounded-lg w-full md:w-1/4 focus:ring-2 focus:ring-blue-600"
                    >
                        <option value="">All Categories</option>
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Health">Health</option>
                    </select>

                    <input
                        type="date"
                        value={filters.dueDate}
                        onChange={(e) => setFilters({ ...filters, dueDate: e.target.value })}
                        className="border p-2 rounded-lg w-full md:w-1/4 focus:ring-2 focus:ring-blue-600"
                    />

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        Add New Task
                    </button>
                    <AddTaskModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTasks.map((task) => (
                        <div
                            key={task._id}
                            className={`relative bg-white p-6 rounded-xl shadow-md border-l-4 
                            ${
                                task.priority === "High"
                                    ? "border-red-500"
                                    : task.priority === "Medium"
                                    ? "border-yellow-500"
                                    : "border-green-500"
                            }`}
                        >
                            <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
                            
                            <div className="flex justify-between mt-2">
                                <span
                                    className={`px-2 py-1 text-sm font-semibold rounded-md
                                    ${
                                        task.completed
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {task.completed ? "Completed" : "Pending"}
                                </span>

                                <span className="text-sm text-gray-500">
                                    {new Date(task.dueDate).toLocaleDateString()}
                                </span>
                            </div>

                            <p className="text-gray-600 text-sm mt-2">Priority: {task.priority}</p>
                            <p className="text-gray-600 text-sm">Category: {task.category}</p>

                            <div className="absolute top-2 right-2 flex space-x-3">
                                <button
                                    onClick={() => handleDelete(task._id)}
                                    className="text-red-500 hover:text-red-700 transition"
                                >
                                    <FaTrash size={16} />
                                </button>
                                <button
                                    className="text-blue-500 hover:text-blue-700 transition"
                                >
                                    <FaEdit size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TaskList;
