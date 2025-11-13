import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Users, 
  Settings, 
  ArrowRight, 
  Building2, 
  Search, 
  Filter,
  Sparkles,
  Loader2,
  MoreVertical,
  UserPlus,
  Calendar
} from "lucide-react";
import { fetchWorkspaces } from "../../service/workspaceService";

const WorkspaceList = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [filteredWorkspaces, setFilteredWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState("");
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkspacesDetails = async () => {
      try {
        setLoading(true);
        const res = await fetchWorkspaces();
        setWorkspaces(res || []);
      } catch (err) {
        console.error("Failed to fetch workspaces:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkspacesDetails();
  }, []);

  useEffect(() => {
    const filtered = workspaces.filter(workspace =>
      workspace.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredWorkspaces(filtered);
  }, [workspaces, searchTerm]);

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    if (!newWorkspace.trim()) return;

    try {
      setCreating(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/workspaces`,
        { name: newWorkspace },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setWorkspaces(prev => [res.data, ...prev]);
      setNewWorkspace("");
      setShowCreateModal(false);
      // You might want to add a toast notification here
    } catch (err) {
      console.error("Failed to create workspace:", err);
    } finally {
      setCreating(false);
    }
  };

  const getMemberCountText = (members) => {
    const count = members?.length || 1;
    return `${count} member${count !== 1 ? 's' : ''}`;
  };

  const getRandomGradient = (index) => {
    const gradients = [
      "from-blue-500 to-purple-600",
      "from-green-500 to-teal-600",
      "from-orange-500 to-red-600",
      "from-purple-500 to-pink-600",
      "from-teal-500 to-blue-600",
      "from-red-500 to-orange-600"
    ];
    return gradients[index % gradients.length];
  };

  if (loading) {
    return (
      <div className="h-fill bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your workspaces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-fill bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Your Workspaces
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Collaborate and manage tasks with your team
            </p>
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg mt-4 lg:mt-0"
          >
            <Plus className="w-5 h-5" />
            <span>New Workspace</span>
          </button>
        </div>

        {/* Search and Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="flex-1 w-full lg:max-w-md">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search workspaces..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-6 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {workspaces.length}
                </div>
                <div className="text-gray-500 dark:text-gray-400">Workspaces</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {workspaces.reduce((total, ws) => total + (ws.members?.length || 1), 0)}
                </div>
                <div className="text-gray-500 dark:text-gray-400">Total Members</div>
              </div>
            </div>
          </div>
        </div>

        {/* Workspaces Grid */}
        {filteredWorkspaces.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
              {searchTerm ? "No matching workspaces" : "No workspaces yet"}
            </h3>
            <p className="text-gray-500 dark:text-gray-500 mb-6 max-w-md mx-auto">
              {searchTerm 
                ? "Try adjusting your search terms" 
                : "Create your first workspace to start collaborating with your team"
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white py-2 px-6 rounded-xl hover:bg-blue-700 transition-colors duration-300"
              >
                Create Workspace
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Create Workspace Card */}
            <div 
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 transform hover:scale-105 cursor-pointer group"
            >
              <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Plus className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Create Workspace
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Start a new collaboration space
                </p>
              </div>
            </div>

            {/* Workspace Cards */}
            {filteredWorkspaces.map((workspace, index) => (
              <div
                key={workspace._id}
                onClick={() => navigate(`/workspace/${workspace._id}`)}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer group overflow-hidden"
              >
                {/* Gradient Header */}
                <div className={`h-3 bg-gradient-to-r ${getRandomGradient(index)}`}></div>
                
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add workspace settings or menu functionality
                      }}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors duration-200 opacity-0 group-hover:opacity-100"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  {/* Workspace Info */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg leading-tight line-clamp-2">
                      {workspace.name}
                    </h3>
                    
                    {workspace.description && (
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                        {workspace.description}
                      </p>
                    )}

                    {/* Metadata */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>{getMemberCountText(workspace.members)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {workspace.createdAt 
                            ? new Date(workspace.createdAt).toLocaleDateString() 
                            : 'Recently'
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hover Action */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:underline">
                      Open Workspace
                    </span>
                    <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400 transform group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Workspace Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4 animate-fade-in">
            <div 
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md transform animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Create Workspace
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Start collaborating with your team
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors duration-200"
                  >
                    <Plus className="w-5 h-5 text-gray-500 rotate-45" />
                  </button>
                </div>

                <form onSubmit={handleCreateWorkspace} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Workspace Name
                    </label>
                    <input
                      type="text"
                      value={newWorkspace}
                      onChange={(e) => setNewWorkspace(e.target.value)}
                      placeholder="Enter workspace name..."
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      required
                      autoFocus
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={creating || !newWorkspace.trim()}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {creating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      <span>{creating ? "Creating..." : "Create"}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default WorkspaceList;