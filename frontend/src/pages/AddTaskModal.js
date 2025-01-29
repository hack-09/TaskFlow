import React, { useState } from "react";
import axios from "axios";

const AddTaskModal = ({ isOpen, onClose, onTaskAdded }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "Medium",
        dueDate: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                "http://localhost:5000/tasks",
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            console.log('Task created:', res.data);
            onTaskAdded(res.data); // Notify parent component
            onClose(); // Close modal
        } catch (err) {
            console.error("Failed to create task:", err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Task</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="title"
                        placeholder="Task Title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <textarea
                        name="description"
                        placeholder="Task Description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    ></textarea>
                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                    <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <div className="flex justify-end space-x-4">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                        >
                            Add Task
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-300"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTaskModal;
