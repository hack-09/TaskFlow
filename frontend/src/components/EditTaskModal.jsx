import React, { useState, useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import { updateTask } from "../service/api";
import { 
  X, 
  Calendar, 
  Flag, 
  Tag, 
  CheckCircle, 
  Clock,
  Save,
  Loader2,
  AlertCircle,
  Zap,
  Target,
  TrendingUp
} from "lucide-react";

const EditTaskModal = ({ isOpen, onClose, task, onUpdate }) => {
    const { socket, isConnected } = useSocket();
    const [updatedTask, setUpdatedTask] = useState({
        dueDate: "",
        priority: "",
        category: "",
        status: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (task) {
            setUpdatedTask({
                dueDate: task.dueDate || "",
                priority: task.priority || "",
                category: task.category || "",
                status: task.status || ""
            });
        }
        setError("");
    }, [task, isOpen]);

    const handleChange = (e) => {
        setUpdatedTask({ ...updatedTask, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async () => {
        if (!updatedTask.dueDate || !updatedTask.priority || !updatedTask.category || !updatedTask.status) {
            setError("Please fill in all fields");
            return;
        }

        try {
            setLoading(true);
            setError("");
            await updateTask(task._id, updatedTask);
            
            onUpdate({ ...task, ...updatedTask });
            if (socket && isConnected) {
                socket.emit("taskUpdated", { ...task, ...updatedTask });
            }
            onClose();
        } catch (err) {
            console.error("Failed to update task:", err);
            setError("Failed to update task. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const priorities = [
        { value: "High", label: "High Priority", icon: Zap, color: "red" },
        { value: "Medium", label: "Medium Priority", icon: Target, color: "yellow" },
        { value: "Low", label: "Low Priority", icon: TrendingUp, color: "green" }
    ];

    const statuses = [
        { value: "pending", label: "Pending", icon: Clock, color: "yellow" },
        { value: "in progress", label: "In Progress", icon: TrendingUp, color: "blue" },
        { value: "completed", label: "Completed", icon: CheckCircle, color: "green" }
    ];

    const categories = [
        "Work", "Personal", "Health", "Education", "Finance", "Other"
    ];

    // const getPriorityIcon = (priority) => {
    //     const priorityObj = priorities.find(p => p.value === priority);
    //     const Icon = priorityObj?.icon || Flag;
    //     return <Icon className="w-4 h-4" />;
    // };

    // const getStatusIcon = (status) => {
    //     const statusObj = statuses.find(s => s.value === status);
    //     const Icon = statusObj?.icon || Clock;
    //     return <Icon className="w-4 h-4" />;
    // };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4 animate-fade-in">
            <div 
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md transform animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Edit Task
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Update task details
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors duration-200"
                    >
                        <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Task Title Preview */}
                {task?.title && (
                    <div className="px-6 pt-4">
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 border border-gray-200 dark:border-gray-600">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Task</p>
                            <p className="font-semibold text-gray-900 dark:text-white truncate">
                                {task.title}
                            </p>
                        </div>
                    </div>
                )}

                {/* Form */}
                <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {error && (
                        <div className="flex items-center space-x-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-3 rounded-xl">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    {/* Due Date */}
                    <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            <Calendar className="w-4 h-4" />
                            <span>Due Date</span>
                        </label>
                        <input
                            type="date"
                            name="dueDate"
                            value={updatedTask.dueDate ? new Date(updatedTask.dueDate).toISOString().split("T")[0] : ""}
                            onChange={handleChange}
                            min={new Date().toISOString().split("T")[0]}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        />
                    </div>

                    {/* Priority */}
                    <div className="space-y-3">
                        <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            <Flag className="w-4 h-4" />
                            <span>Priority</span>
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {priorities.map((priority) => {
                                const Icon = priority.icon;
                                return (
                                    <button
                                        key={priority.value}
                                        type="button"
                                        onClick={() => setUpdatedTask(prev => ({ ...prev, priority: priority.value }))}
                                        className={`p-3 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                                            updatedTask.priority === priority.value
                                                ? `bg-${priority.color}-100 dark:bg-${priority.color}-900/20 border-${priority.color}-500 text-${priority.color}-700 dark:text-${priority.color}-300 shadow-md`
                                                : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="flex flex-col items-center space-y-1">
                                            <Icon className="w-4 h-4" />
                                            <span className="text-xs font-medium">{priority.value}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            <Tag className="w-4 h-4" />
                            <span>Category</span>
                        </label>
                        <select
                            name="category"
                            value={updatedTask.category}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none"
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Status */}
                    <div className="space-y-3">
                        <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            <CheckCircle className="w-4 h-4" />
                            <span>Status</span>
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {statuses.map((status) => {
                                const Icon = status.icon;
                                return (
                                    <button
                                        key={status.value}
                                        type="button"
                                        onClick={() => setUpdatedTask(prev => ({ ...prev, status: status.value }))}
                                        className={`p-3 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                                            updatedTask.status === status.value
                                                ? `bg-${status.color}-100 dark:bg-${status.color}-900/20 border-${status.color}-500 text-${status.color}-700 dark:text-${status.color}-300 shadow-md`
                                                : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="flex flex-col items-center space-y-1">
                                            <Icon className="w-4 h-4" />
                                            <span className="text-xs font-medium text-center leading-tight">
                                                {status.label.split(' ')[0]}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 shadow-lg"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Updating...</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                <span>Update Task</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Connection Status */}
                <div className="px-6 pb-4">
                    <div className={`flex items-center justify-center space-x-2 text-xs ${
                        isConnected 
                            ? "text-green-600 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800" 
                            : "text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                    } py-2 px-3 rounded-xl`}>
                        <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"} animate-pulse`}></div>
                        <span>{isConnected ? "Live updates enabled" : "Offline - updates local only"}</span>
                    </div>
                </div>
            </div>

            {/* Custom Styles */}
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scale-in {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out;
                }
                .animate-scale-in {
                    animation: scale-in 0.2s ease-out;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 0, 0, 0.3);
                }
            `}</style>
        </div>
    );
};

export default EditTaskModal;