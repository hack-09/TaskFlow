import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTask } from "../service/api";
import { ArrowLeftCircle } from "lucide-react";
import { useWorkspace } from "../context/WorkspaceContext";
import { useSocket } from "../context/SocketContext";
import toast from "react-hot-toast";

const AddTaskPage = () => {
  const { workspaceId } = useWorkspace();
  const navigate = useNavigate();
  const { socket } = useSocket();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "General",
    priority: "Medium",
    dueDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // ✅ AI Smart Priority Suggestion (Hugging Face)
  const handleAISuggestion = async () => {
    if (!formData.title && !formData.description) {
      toast.error("Please fill title or description first.");
      return;
    }

    try {
      setAiLoading(true);
      toast.loading("Analyzing task priority...");

      const res = await fetch("http://localhost:5000/ai/smart-priority", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          dueDate: formData.dueDate,
        }),
      });

      const data = await res.json();
      toast.dismiss();

      if (data.suggestedPriority) {
        setFormData((prev) => ({
          ...prev,
          priority: data.suggestedPriority,
        }));
        toast.success(`🤖 AI suggests: ${data.suggestedPriority} priority`);
      } else {
        toast.error("AI could not determine priority");
      }
    } catch (err) {
      console.error("AI Suggestion failed:", err);
      toast.dismiss();
      toast.error("AI Suggestion failed");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await createTask(workspaceId, formData);
      socket.emit("taskCreated", res.data, workspaceId);
      navigate(workspaceId ? `/workspace/${workspaceId}/tasks` : "/tasks");
    } catch (err) {
      console.error("Failed to create task:", err);
      setError("Failed to create task. Please try again.");
    } finally {
      setLoading(false);
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

          <div className="flex items-center gap-2">
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

            <button
              type="button"
              onClick={handleAISuggestion}
              disabled={aiLoading}
              className={`${
                aiLoading ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"
              } text-white px-3 py-2 rounded-lg transition-all duration-300`}
            >
              {aiLoading ? "🤖 Analyzing..." : "🤖 AI Suggest"}
            </button>
          </div>

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
              {loading ? "Adding..." : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskPage;
