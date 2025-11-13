import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createTask } from "../service/api";
import { getAISuggestedPriority } from "../service/aiService";
import { 
  ArrowLeft, 
  PlusCircle, 
  Calendar, 
  Tag, 
  AlertCircle,
  FileText,
  Target,
  Loader2,
  Sparkles,
  Clock,
  Zap,
  Brain,
  Wand2
} from "lucide-react";
import { useSocket } from "../context/SocketContext";
import { toast } from "react-toastify";

const AddTaskPage = () => {
  const { id: workspaceId } = useParams();
  const navigate = useNavigate();
  const { socket } = useSocket();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Work",
    priority: "Medium",
    dueDate: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({});
  const [aiLoading, setAiLoading] = useState({
    priority: false,
    description: false,
    dueDate: false
  });

  const categories = [
    { value: "Work", label: "Work", icon: "💼", color: "blue" },
    { value: "Personal", label: "Personal", icon: "👤", color: "green" },
    { value: "Health", label: "Health", icon: "🏥", color: "red" },
    { value: "Education", label: "Education", icon: "🎓", color: "purple" },
    { value: "Finance", label: "Finance", icon: "💰", color: "emerald" },
    { value: "Other", label: "Other", icon: "📝", color: "gray" }
  ];

  const priorities = [
    { value: "High", label: "High Priority", icon: Zap, color: "red" },
    { value: "Medium", label: "Medium Priority", icon: Target, color: "yellow" },
    { value: "Low", label: "Low Priority", icon: Clock, color: "green" }
  ];

  // ✅ AI Smart Priority Suggestion
  const handleAIPrioritySuggestion = async () => {
    if (!formData.title && !formData.description) {
      toast.error("Please fill title or description first.");
      return;
    }

    try {
      setAiLoading(prev => ({ ...prev, priority: true }));
      toast.loading("Analyzing task priority...");

      const res = await getAISuggestedPriority(
        formData.title,
        formData.description,
        formData.dueDate
      );

      const data = res.data;
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
      setAiLoading(prev => ({ ...prev, priority: false }));
    }
  };

  // 🎯 AI Description Suggestion (Placeholder - API to be developed)
  const handleAIDescriptionSuggestion = async () => {
    if (!formData.title) {
      toast.error("Please fill task title first.");
      return;
    }

    try {
      setAiLoading(prev => ({ ...prev, description: true }));
      toast.info("AI Description suggestion coming soon!");
      
      // Simulate API call delay
      setTimeout(() => {
        setAiLoading(prev => ({ ...prev, description: false }));
      }, 1500);

    } catch (err) {
      console.error("AI Description Suggestion failed:", err);
      setAiLoading(prev => ({ ...prev, description: false }));
      toast.error("AI Description suggestion failed");
    }
  };

  // 📅 AI Due Date Suggestion (Placeholder - API to be developed)
  const handleAIDueDateSuggestion = async () => {
    if (!formData.title && !formData.description) {
      toast.error("Please fill title or description first.");
      return;
    }

    try {
      setAiLoading(prev => ({ ...prev, dueDate: true }));
      toast.info("AI Due Date suggestion coming soon!");
      
      // Simulate API call delay
      setTimeout(() => {
        setAiLoading(prev => ({ ...prev, dueDate: false }));
      }, 1500);

    } catch (err) {
      console.error("AI Due Date Suggestion failed:", err);
      setAiLoading(prev => ({ ...prev, dueDate: false }));
      toast.error("AI Due Date suggestion failed");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Mark all fields as touched
    setTouched({
      title: true,
      description: true,
      dueDate: true
    });

    // Basic validation
    if (!formData.title.trim() || !formData.description.trim() || !formData.dueDate) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await createTask(workspaceId, formData);
      if (socket) {
        socket.emit("taskCreated", res.data, workspaceId);
      }
      
      // Success animation delay
      setTimeout(() => {
        if (workspaceId) {
          navigate(`/workspace/${workspaceId}/tasks`, { 
            state: { message: "Task created successfully! 🎉" }
          });
        } else {
          navigate("/tasks", { 
            state: { message: "Task created successfully! 🎉" }
          });
        }
      }, 500);
      
    } catch (err) {
      console.error("Failed to create task:", err);
      setError(err.response?.data?.message || "Failed to create task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line
  const getPriorityColor = (priority) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return priorityObj ? priorityObj.color : "gray";
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="h-fill bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <PlusCircle className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create New Task
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Organize your work and boost your productivity with AI assistance
          </p>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
          <span>Back to Tasks</span>
        </button>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8">
          {error && (
            <div className="flex items-center space-x-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-xl mb-6 animate-fade-in">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Task Title */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <FileText className="w-4 h-4" />
                <span>Task Title *</span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="What needs to be done?"
                value={formData.title}
                onChange={handleInputChange}
                onBlur={() => handleBlur('title')}
                required
                className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:outline-none transition-all duration-300 ${
                  touched.title && !formData.title.trim()
                    ? 'border-red-300 focus:ring-2 focus:ring-red-500'
                    : 'border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                }`}
              />
              {touched.title && !formData.title.trim() && (
                <p className="text-red-500 text-xs flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>Task title is required</span>
                </p>
              )}
            </div>

            {/* Task Description with AI Button */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <FileText className="w-4 h-4" />
                  <span>Description *</span>
                </label>
                <button
                  type="button"
                  onClick={handleAIDescriptionSuggestion}
                  disabled={aiLoading.description}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    aiLoading.description
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-md"
                  }`}
                >
                  {aiLoading.description ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Wand2 className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {aiLoading.description ? "Thinking..." : "AI Enhance"}
                  </span>
                </button>
              </div>
              <textarea
                name="description"
                placeholder="Describe your task in detail..."
                value={formData.description}
                onChange={handleInputChange}
                onBlur={() => handleBlur('description')}
                required
                rows={4}
                className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:outline-none transition-all duration-300 resize-none ${
                  touched.description && !formData.description.trim()
                    ? 'border-red-300 focus:ring-2 focus:ring-red-500'
                    : 'border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                }`}
              ></textarea>
              {touched.description && !formData.description.trim() && (
                <p className="text-red-500 text-xs flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>Task description is required</span>
                </p>
              )}
            </div>

            {/* Priority and Category Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Priority with AI Button */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Zap className="w-4 h-4" />
                    <span>Priority</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAIPrioritySuggestion}
                    disabled={aiLoading.priority}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                      aiLoading.priority
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md"
                    }`}
                  >
                    {aiLoading.priority ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Brain className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">
                      {aiLoading.priority ? "Analyzing..." : "AI Suggest"}
                    </span>
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {priorities.map((priority) => {
                    const Icon = priority.icon;
                    return (
                      <button
                        key={priority.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, priority: priority.value }))}
                        className={`p-3 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                          formData.priority === priority.value
                            ? `bg-${priority.color}-100 dark:bg-${priority.color}-900/20 border-${priority.color}-500 text-${priority.color}-700 dark:text-${priority.color}-300 shadow-md`
                            : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex flex-col items-center space-y-1">
                          <Icon className="w-4 h-4" />
                          <span className="text-xs font-medium">{priority.label.split(' ')[0]}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Tag className="w-4 h-4" />
                  <span>Category</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.icon} {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Due Date with AI Button */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span>Due Date *</span>
                </label>
                <button
                  type="button"
                  onClick={handleAIDueDateSuggestion}
                  disabled={aiLoading.dueDate}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    aiLoading.dueDate
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md"
                  }`}
                >
                  {aiLoading.dueDate ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {aiLoading.dueDate ? "Calculating..." : "AI Suggest"}
                  </span>
                </button>
              </div>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                onBlur={() => handleBlur('dueDate')}
                min={minDate}
                required
                className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:outline-none transition-all duration-300 ${
                  touched.dueDate && !formData.dueDate
                    ? 'border-red-300 focus:ring-2 focus:ring-red-500'
                    : 'border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                }`}
              />
              {touched.dueDate && !formData.dueDate && (
                <p className="text-red-500 text-xs flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>Due date is required</span>
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={loading}
                className="px-8 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating Task...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-5 h-5" />
                    <span>Create Task</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-blue-800 dark:text-blue-300">AI Assistant Features</h3>
          </div>
          <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-2">
            <li>• <strong>AI Priority:</strong> Automatically suggests optimal priority based on task content</li>
            <li>• <strong>AI Description:</strong> Coming soon - Enhance your task descriptions with AI</li>
            <li>• <strong>AI Due Date:</strong> Coming soon - Get smart due date suggestions</li>
            <li>• All AI features work in real-time to boost your productivity</li>
          </ul>
        </div>
      </div>

      {/* Animation Styles */}
      <style >{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AddTaskPage;