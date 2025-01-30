import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTask } from "../service/api";
import { ArrowLeftCircle } from "lucide-react";

const AddTaskPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // eslint-disable-next-line
      const res = await createTask(formData);
      navigate("/tasks");
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-blue-800 p-4 dark:from-gray-900 dark:to-black-800">
      <div className="bg-white dark:bg-gray-400 shadow-xl rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-blue-700">Add New Task</h2>
          <ArrowLeftCircle
            className="w-8 h-8 text-blue-700 cursor-pointer hover:text-blue-900"
            onClick={() => navigate("/tasks")}
          />
        </div>
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            rows={4}
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
              type="button"
              onClick={() => navigate("/tasks")}
              className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskPage;
