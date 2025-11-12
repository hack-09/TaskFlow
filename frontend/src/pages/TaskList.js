import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { 
  FaTrash, 
  FaEdit, 
  FaFilter,
  FaSearch,
  FaPlus,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaTag,
  FaBolt,
  FaEllipsisV
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import EditTaskModal from '../components/EditTaskModal';
import { deleteTask } from "../service/api";
import { useSocket } from "../context/SocketContext";
import axios from "axios";

const TaskList = () => {
    const { id } = useParams();
    const workspaceId = id;
    const { socket, isConnected } = useSocket();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTask, setSelectedTask] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: "",
        priority: "",
        dueDate: "",
        category: "",
    });

    useEffect(() => {
        if (!socket) return;
        
        if (workspaceId) socket.emit("joinWorkspace", workspaceId);

        socket.on(workspaceId ? "workspaceTaskUpdated" : "taskUpdated", (updatedTask) => {
            setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
        });

        socket.on("newTask", (newTask) => {
            setTasks((prev) => [newTask, ...prev]);
        });

        socket.on("taskDeleted", (deletedTaskId) => {
            setTasks((prev) => prev.filter((t) => t._id !== deletedTaskId));
        });

        return () => {
            if (workspaceId) socket.emit("leaveWorkspace", workspaceId);
            socket.off("workspaceTaskUpdated");
            socket.off("taskUpdated");
            socket.off("newTask");
            socket.off("taskDeleted");
        };
    }, [socket, workspaceId]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                const endpoint = workspaceId ? `/tasks?workspaceId=${workspaceId}` : '/tasks';
                const res = await axios.get(`${process.env.REACT_APP_ARI_CALL_URL}${endpoint}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const fetchedTasks = res.data.tasks || [];
                setTasks(fetchedTasks);
                setFilteredTasks(fetchedTasks);
            } catch (err) {
                console.error("Failed to fetch tasks:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, [workspaceId]);

    useEffect(() => {
        let updatedTasks = tasks;

        if (searchTerm) {
            updatedTasks = updatedTasks.filter((task) =>
                task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.description?.toLowerCase().includes(searchTerm.toLowerCase())
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
            await deleteTask(taskId);
            setTasks(tasks.filter((task) => task._id !== taskId));
            setConfirmDelete(null);
        } catch (err) {
            console.error("Failed to delete task:", err);
        }
    };

    const handleEditClick = (task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleUpdateTask = async (updatedTask) => {
        try {
            setTasks((prevTasks) => {
                const taskIndex = prevTasks.findIndex((task) => task._id === updatedTask._id);
                if (taskIndex === -1) return prevTasks;
              
                const updatedTasks = [...prevTasks];
                updatedTasks[taskIndex] = { ...prevTasks[taskIndex], ...updatedTask };
                return updatedTasks;
            });
            setIsModalOpen(false);
        } catch (err) {
            console.error("Failed to update task:", err);
        }
    };

    const clearFilters = () => {
        setFilters({
            status: "",
            priority: "",
            dueDate: "",
            category: "",
        });
        setSearchTerm("");
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case "High":
                return <FaExclamationTriangle className="text-red-500" />;
            case "Medium":
                return <FaBolt className="text-yellow-500" />;
            case "Low":
                return <FaClock className="text-green-500" />;
            default:
                return <FaClock className="text-gray-500" />;
        }
    };

    const getStatusIcon = (status, dueDate) => {
        const isOverdue = !status && new Date(dueDate) < new Date();
        
        if (status === "completed") {
            return <FaCheckCircle className="text-green-500" />;
        } else if (isOverdue) {
            return <FaExclamationTriangle className="text-red-500" />;
        } else {
            return <FaClock className="text-blue-500" />;
        }
    };

    const getStatusText = (status, dueDate) => {
        const isOverdue = !status && new Date(dueDate) < new Date();
        
        if (status === "completed") return "Completed";
        if (isOverdue) return "Overdue";
        return "Pending";
    };

    const getStatusColor = (status, dueDate) => {
        const isOverdue = !status && new Date(dueDate) < new Date();
        
        if (status === "completed") return "bg-green-100 text-green-800 border-green-200";
        if (isOverdue) return "bg-red-100 text-red-800 border-red-200";
        return "bg-blue-100 text-blue-800 border-blue-200";
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "High":
                return "bg-red-100 text-red-800 border-red-200";
            case "Medium":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "Low":
                return "bg-green-100 text-green-800 border-green-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading your tasks...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            Your Tasks
                        </h1>
                        <div className="flex items-center space-x-4">
                            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                                isConnected 
                                    ? "bg-green-100 text-green-800 border border-green-200" 
                                    : "bg-red-100 text-red-800 border border-red-200"
                            }`}>
                                <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"} animate-pulse`}></div>
                                <span>{isConnected ? "Live Updates" : "Offline"}</span>
                            </div>
                            <span className="text-gray-500 dark:text-gray-400">
                                {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} found
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate(workspaceId? `/workspace/${workspaceId}/addtasks`:'/addtasks')}
                        className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg mt-4 lg:mt-0"
                    >
                        <FaPlus className="w-4 h-4" />
                        <span>Add New Task</span>
                    </button>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-700">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search Input */}
                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search tasks by title or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            />
                        </div>

                        {/* Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center space-x-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors duration-300"
                        >
                            <FaFilter className="w-4 h-4" />
                            <span>Filters</span>
                        </button>

                        {/* Clear Filters */}
                        {(searchTerm || Object.values(filters).some(filter => filter !== "")) && (
                            <button
                                onClick={clearFilters}
                                className="px-6 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors duration-300"
                            >
                                Clear All
                            </button>
                        )}
                    </div>

                    {/* Expandable Filters */}
                    {showFilters && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            >
                                <option value="">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                                <option value="overdue">Overdue</option>
                            </select>

                            <select
                                value={filters.priority}
                                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            >
                                <option value="">All Priorities</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>

                            <select
                                value={filters.category}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            >
                                <option value="">All Categories</option>
                                <option value="Work">Work</option>
                                <option value="Personal">Personal</option>
                                <option value="Health">Health</option>
                                <option value="Education">Education</option>
                            </select>

                            <input
                                type="date"
                                value={filters.dueDate}
                                onChange={(e) => setFilters({ ...filters, dueDate: e.target.value })}
                                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            />
                        </div>
                    )}
                </div>

                {/* Task Grid */}
                {filteredTasks.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaSearch className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                            No tasks found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-500 mb-6">
                            {searchTerm || Object.values(filters).some(filter => filter !== "") 
                                ? "Try adjusting your search or filters" 
                                : "Get started by creating your first task"
                            }
                        </p>
                        <button
                            onClick={() => navigate(workspaceId? `/workspace/${workspaceId}/addtasks`:'/addtasks')}
                            className="bg-blue-600 text-white py-3 px-8 rounded-xl hover:bg-blue-700 transition-colors duration-300"
                        >
                            Create Your First Task
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredTasks.map((task) => (
                            <div
                                key={task._id}
                                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 dark:border-gray-700 transition-all duration-500 transform hover:scale-105 relative overflow-hidden"
                            >
                                {/* Priority Indicator Bar */}
                                <div className={`absolute top-0 left-0 w-1 h-full ${
                                    task.priority === "High" ? "bg-red-500" :
                                    task.priority === "Medium" ? "bg-yellow-500" : "bg-green-500"
                                }`}></div>

                                <div className="p-6">
                                    {/* Task Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white pr-8 line-clamp-2">
                                            {task.title}
                                        </h3>
                                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <button
                                                onClick={() => handleEditClick(task)}
                                                className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                                            >
                                                <FaEdit size={14} />
                                            </button>
                                            <button
                                                onClick={() => setConfirmDelete(task._id)}
                                                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Task Description */}
                                    {task.description && (
                                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                                            {task.description}
                                        </p>
                                    )}

                                    {/* Task Meta Information */}
                                    <div className="space-y-3">
                                        {/* Status and Priority */}
                                        <div className="flex justify-between items-center">
                                            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(task.status, task.dueDate)}`}>
                                                {getStatusIcon(task.status, task.dueDate)}
                                                <span>{getStatusText(task.status, task.dueDate)}</span>
                                            </div>
                                            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                                {getPriorityIcon(task.priority)}
                                                <span>{task.priority}</span>
                                            </div>
                                        </div>

                                        {/* Category and Due Date */}
                                        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center space-x-2">
                                                <FaTag className="w-3 h-3" />
                                                <span>{task.category}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <FaCalendarAlt className="w-3 h-3" />
                                                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    
                )}

                {/* Edit Task Modal */}
                {isModalOpen && selectedTask && (
                    <EditTaskModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        task={selectedTask}
                        onUpdate={handleUpdateTask}
                    />
                )}

                {/* Delete Confirmation Modal */}
                {confirmDelete && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-md w-full transform animate-scale-in">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FaTrash className="w-8 h-8 text-red-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                                    Delete Task?
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    This action cannot be undone. The task will be permanently removed.
                                </p>
                                <div className="flex space-x-3 justify-center">
                                    <button 
                                        onClick={() => setConfirmDelete(null)}
                                        className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(confirmDelete)}
                                        className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-300"
                                    >
                                        Delete Task
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Custom Styles */}
            <style jsx>{`
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                @keyframes scale-in {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in {
                    animation: scale-in 0.2s ease-out;
                }
            `}</style>
        </div>
    );
};

export default TaskList;