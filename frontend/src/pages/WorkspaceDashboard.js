import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { 
  Users, 
  ListCheck, 
  Activity, 
  UserPlus, 
  ArrowLeft, 
  Settings,
  Calendar,
  FileText,
  MessageSquare,
  BarChart3,
  Shield,
  Clock,
  ChevronRight,
  Sparkles,
  Building2
} from "lucide-react";
import { useSocket } from "../context/SocketContext";
import { getWorkspaceDetails } from "../service/workspaceService";

function WorkspaceDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { socket } = useSocket();

  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    totalMembers: 0,
    activeMembers: 0
  });

  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const userId = decoded?.id || decoded?._id;

  // Fetch workspace details
  const fetchWorkspace = async () => {
    try {
      setLoading(true);
      const res = await getWorkspaceDetails(id);
      const data = res.workspace || res;
      setWorkspace(data);
      setIsAdmin(data?.ownerId._id === userId || false);
      
      // Mock stats - replace with actual API calls
      setStats({
        totalTasks: data?.tasks?.length || 12,
        completedTasks: data?.tasks?.filter(t => t.status === 'completed')?.length || 8,
        totalMembers: data?.members?.length || 5,
        activeMembers: data?.members?.filter(m => m.isActive)?.length || 4
      });
    } catch (err) {
      console.error("Error fetching workspace:", err);
      setError("Unable to load workspace data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspace();
    // eslint-disable-next-line
  }, [id]);

  // Socket join/leave workspace room
  useEffect(() => {
    if (!socket) return;
    socket.emit("joinWorkspace", id);
    return () => socket.emit("leaveWorkspace", id);
  }, [socket, id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Building2 className="w-8 h-8 text-blue-500 animate-pulse" />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Loading Workspace
          </h3>
          <p className="text-gray-500 dark:text-gray-500 text-sm">
            Getting everything ready for you...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Unable to Load Workspace
          </h3>
          <p className="text-gray-500 dark:text-gray-500 text-sm mb-4">
            {error}
          </p>
          <button
            onClick={fetchWorkspace}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No workspace data
  if (!workspace) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No Workspace Found
          </h3>
          <p className="text-gray-500 dark:text-gray-500 text-sm">
            The workspace you're looking for doesn't exist or you don't have access.
          </p>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: ListCheck,
      title: "Tasks",
      description: "Manage and track all workspace tasks",
      count: stats.totalTasks,
      completed: stats.completedTasks,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      path: `/workspace/${id}/tasks`
    },
    {
      icon: Users,
      title: "Members",
      description: "Manage team members and permissions",
      count: stats.totalMembers,
      active: stats.activeMembers,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
      path: `/workspace/${id}/members`
    },
    {
      icon: Activity,
      title: "Activity Log",
      description: "Track all workspace activities",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      iconColor: "text-orange-600 dark:text-orange-400",
      path: `/workspace/${id}/activity`
    },
    {
      icon: FileText,
      title: "Documents",
      description: "Shared documents and files",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      iconColor: "text-green-600 dark:text-green-400",
      path: `/workspace/${id}/documents`
    },
    {
      icon: MessageSquare,
      title: "Discussions",
      description: "Team conversations and chats",
      color: "from-indigo-500 to-blue-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      path: `/workspace/${id}/discussions`
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Workspace insights and reports",
      color: "from-teal-500 to-green-500",
      bgColor: "bg-teal-50 dark:bg-teal-900/20",
      iconColor: "text-teal-600 dark:text-teal-400",
      path: `/workspace/${id}/analytics`
    }
  ];

  const quickActions = [
    {
      icon: UserPlus,
      title: "Invite Members",
      description: "Add new team members",
      action: () => navigate(`/workspace/${id}/members`),
      color: "text-green-600 dark:text-green-400"
    },
    {
      icon: Calendar,
      title: "Create Task",
      description: "Add a new task",
      action: () => navigate(`/workspace/${id}/tasks`),
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      icon: Settings,
      title: "Settings",
      description: "Workspace configuration",
      action: () => navigate(`/workspace/${id}/settings`),
      color: "text-gray-600 dark:text-gray-400"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div className="mb-6 lg:mb-0">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200 mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="text-sm font-medium">Back to Dashboard</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  {workspace?.name || "Workspace"}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mt-1 flex items-center space-x-2">
                  <span>{workspace?.description || "Collaborate with your team"}</span>
                  {isAdmin && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                      <Shield className="w-3 h-3 mr-1" />
                      Admin
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-auto">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-3 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTasks}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Total Tasks</div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-3 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedTasks}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Completed</div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-3 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalMembers}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Members</div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-3 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeMembers}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Active</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] text-left group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${action.color.includes('green') ? 'bg-green-100 dark:bg-green-900/20' : action.color.includes('blue') ? 'bg-blue-100 dark:bg-blue-900/20' : 'bg-gray-100 dark:bg-gray-700'} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <action.icon className={`w-5 h-5 ${action.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {action.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                      {action.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-200" />
              </div>
            </button>
          ))}
        </div>

        {/* Main Features Grid */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Sparkles className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Workspace Features</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                onClick={() => navigate(feature.path)}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                  </div>
                  {feature.count !== undefined && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {feature.count}
                      </div>
                      {feature.completed !== undefined && (
                        <div className="text-xs text-green-600 dark:text-green-400">
                          {feature.completed} completed
                        </div>
                      )}
                      {feature.active !== undefined && (
                        <div className="text-xs text-blue-600 dark:text-blue-400">
                          {feature.active} active
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                  {feature.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center space-x-1 text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-200">
                    <span>Explore</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                  <div className={`w-6 h-1 bg-gradient-to-r ${feature.color} rounded-full`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Preview */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Clock className="w-6 h-6 text-orange-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
            </div>
            <button
              onClick={() => navigate(`/workspace/${id}/activity`)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              View All
            </button>
          </div>
          
          <div className="space-y-3">
            {workspace?.recentActivity?.length > 0 ? (
              workspace.recentActivity.slice(0, 3).map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No recent activity to display
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                  Activity will appear here as team members work
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkspaceDashboard;