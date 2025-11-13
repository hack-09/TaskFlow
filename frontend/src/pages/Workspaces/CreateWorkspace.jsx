import React, { useState } from "react";
import { createWorkspace } from "../../service/workspaceService";
import { useNavigate } from "react-router-dom";
import { useWorkspace } from "../../context/WorkspaceContext";
import { 
  Building2, 
  ArrowLeft, 
  Users, 
  Sparkles, 
  Loader2,
  AlertCircle,
  CheckCircle,
  Rocket
} from "lucide-react";
import { toast } from "react-hot-toast";

const CreateWorkspace = () => {
  const [form, setForm] = useState({ name: "", description: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { switchWorkspace } = useWorkspace();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.name.trim()) {
      setError("Workspace name is required");
      setLoading(false);
      return;
    }

    try {
      const res = await createWorkspace(form);
      switchWorkspace(res._id, res.name);
      
      // Success animation delay
      setTimeout(() => {
        navigate(`/workspace/${res._id}`, { 
          state: { message: "Workspace created successfully! 🎉" }
        });
      }, 500);
      
    } catch (err) {
      console.error("Create workspace failed:", err);
      const errorMessage = err.response?.data?.message || "Failed to create workspace. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="h-fill bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Back Button */}
        <button
          onClick={handleGoBack}
          className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
          <span>Back to Workspaces</span>
        </button>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8 transform hover:shadow-3xl transition-all duration-500">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Create Workspace
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Start collaborating with your team in a new workspace
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-xl mb-6 animate-fade-in">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Workspace Name */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <Building2 className="w-4 h-4" />
                <span>Workspace Name *</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter workspace name (e.g., Marketing Team, Project Alpha)"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500"
                required
                maxLength={50}
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>This will be your team's workspace name</span>
                <span>{form.name.length}/50</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <span>📝</span>
                <span>Description</span>
              </label>
              <textarea
                name="description"
                placeholder="Describe what this workspace will be used for (optional)"
                value={form.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none placeholder-gray-400 dark:placeholder-gray-500"
                maxLength={200}
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Optional description for your team</span>
                <span>{form.description.length}/200</span>
              </div>
            </div>

            {/* Features Preview */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Workspace Features</span>
              </h3>
              <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Real-time task collaboration</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Team member management</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>File sharing and comments</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
              <button
                type="button"
                onClick={handleGoBack}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !form.name.trim()}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Rocket className="w-5 h-5" />
                    <span>Create Workspace</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Workspace Tips</h3>
          </div>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-start space-x-2">
              <span className="text-blue-500">•</span>
              <span>Choose a clear, descriptive name that your team will recognize</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-500">•</span>
              <span>You can invite team members after creating the workspace</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-500">•</span>
              <span>Workspaces can be customized with different themes and settings</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-500">•</span>
              <span>Each workspace has its own tasks, members, and activity log</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Building2 className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">Unlimited</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Workspaces</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Users className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">50+</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Members Each</p>
          </div>
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

export default CreateWorkspace;