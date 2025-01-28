import React, { useState } from "react";
import axios from "axios";
import "./AddTaskModal.css";

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
        <div className="modal-overlay" style={{padding: "400px"}}>
            <div className="modal-content">
                <h2>Add New Task</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="title"
                        placeholder="Task Title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                    />
                    <textarea
                        name="description"
                        placeholder="Task Description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                    ></textarea>
                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
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
                    />
                    <button type="submit">Add Task</button>
                    <button type="button" onClick={onClose}>
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTaskModal;
