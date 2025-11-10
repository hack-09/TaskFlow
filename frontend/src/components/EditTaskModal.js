import React, { useState, useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import axios from "axios";

const EditTaskModal = ({ isOpen, onClose, task, onUpdate }) => {
    const { socket, isConnected } = useSocket();
    const [updatedTask, setUpdatedTask] = useState({
        dueDate: "",
        priority: "",
        category: "",
        status: ""
    });

    useEffect(() => {
        if (task) {
            setUpdatedTask({
                dueDate: task.dueDate || "",
                priority: task.priority || "",
                category: task.category || "",
                status: task.status || ""
            });
        }
    }, [task]);

    const handleChange = (e) => {
        setUpdatedTask({ ...updatedTask, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`${process.env.REACT_APP_ARI_CALL_URL}/tasks/${task._id}`, updatedTask, {
                headers: { Authorization: `Bearer ${token}` },
            });
            onClose(); // Close modal after update
            onUpdate(updatedTask); // Refresh task list
            socket.emit("taskUpdated", { ...task, ...updatedTask });
        } catch (err) {
            console.error("Failed to update task:", err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Edit Task</h2>

                <label className="block mb-2">Due Date:</label>
                <input
                    type="date"
                    name="dueDate"
                    value={updatedTask.dueDate ? new Date(updatedTask.dueDate).toISOString().split("T")[0] : ""}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                />

                <label className="block mt-4 mb-2">Priority:</label>
                <select
                    name="priority"
                    value={updatedTask.priority}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                >
                    <option value="" disabled>Select Priority</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>

                <label className="block mt-4 mb-2">Category:</label>
                <input
                    type="text"
                    name="category"
                    value={updatedTask.category}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                />

                <label className="block mt-4 mb-2">Status:</label>
                <select
                    name="status"
                    value={updatedTask.status}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                </select>

                <div className="flex justify-end mt-6">
                    <button onClick={onClose} className="mr-2 px-4 py-2 bg-gray-300 rounded">Cancel</button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Update</button>
                </div>
            </div>
        </div>
    );
};

export default EditTaskModal;
