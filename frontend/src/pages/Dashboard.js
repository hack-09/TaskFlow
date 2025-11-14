import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import TaskAnalytics from "../components/TaskAnalytics";
import { fetchTasks } from "../service/api";
import { 
  PlusCircle, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  ListTodo,
  Zap,
  Calendar,
  ArrowRight,
  Users,
  Target
} from "lucide-react";

const Dashboard = () => {
  const { socket } = useSocket();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Cache keys for localStorage
  const CACHE_KEYS = {
    TASKS: 'dashboard_tasks',
    SUMMARY: 'dashboard_summary',
    RECENT_TASKS: 'dashboard_recent_tasks',
    TIMESTAMP: 'dashboard_cache_timestamp'
  };

  // Load cached data on component mount
  const loadCachedData = () => {
    try {
      const cachedTasks = localStorage.getItem(CACHE_KEYS.TASKS);
      const cachedSummary = localStorage.getItem(CACHE_KEYS.SUMMARY);
      const cachedRecentTasks = localStorage.getItem(CACHE_KEYS.RECENT_TASKS);
      const cacheTimestamp = localStorage.getItem(CACHE_KEYS.TIMESTAMP);

      // Check if cache is less than 5 minutes old
      const isCacheValid = cacheTimestamp && (Date.now() - parseInt(cacheTimestamp)) < 5 * 60 * 1000;

      if (cachedTasks && cachedSummary && cachedRecentTasks && isCacheValid) {
        setTasks(JSON.parse(cachedTasks));
        setSummary(JSON.parse(cachedSummary));
        setRecentTasks(JSON.parse(cachedRecentTasks));
        return true;
      }
    } catch (error) {
      console.error("Error loading cached data:", error);
    }
    return false;
  };

  // Save data to cache
  const saveToCache = (tasks, summary, recentTasks) => {
    try {
      localStorage.setItem(CACHE_KEYS.TASKS, JSON.stringify(tasks));
      localStorage.setItem(CACHE_KEYS.SUMMARY, JSON.stringify(summary));
      localStorage.setItem(CACHE_KEYS.RECENT_TASKS, JSON.stringify(recentTasks));
      localStorage.setItem(CACHE_KEYS.TIMESTAMP, Date.now().toString());
    } catch (error) {
      console.error("Error saving to cache:", error);
    }
  };

  const fetchTaskDetails = async (isBackgroundRefresh = false) => {
    if (!isBackgroundRefresh) {
      setLoading(true);
    } else {
      setIsRefreshing(true);
    }

    try {
      const res = await fetchTasks("", "");
      const fetchedTasks = res.data.tasks || [];
      
      setTasks(fetchedTasks);
      const recent = fetchedTasks.slice(0, 5);
      setRecentTasks(recent);
      
      const newSummary = calculateSummary(fetchedTasks);
      setSummary(newSummary);
      
      // Save to cache
      saveToCache(fetchedTasks, newSummary, recent);
      
    } catch (err) {
      console.error("Failed to fetch personal tasks:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const calculateSummary = (taskList) => {
    const total = taskList.length;
    const pending = taskList.filter((t) => t.status === "pending").length;
    const inProgress = taskList.filter((t) => t.status === "in progress").length;
    const completed = taskList.filter((t) => t.status === "completed").length;
    const overdue = taskList.filter(
      (t) =>
        t.status !== "completed" &&
        t.dueDate &&
        new Date(t.dueDate) < new Date()
    ).length;
    
    return { total, pending, inProgress, completed, overdue };
  };

  useEffect(() => {
    // Try to load cached data first
    const hasCachedData = loadCachedData();
    
    // Always fetch fresh data, but don't show loading if we have cached data
    if (hasCachedData) {
      setLoading(false);
      // Refresh data in background
      fetchTaskDetails(true);
    } else {
      fetchTaskDetails(false);
    }
    // eslint-disable-next-line
  }, []);

  const getTaskBadge = (task) => {
    const now = new Date();
    const dueDate = task.dueDate ? new Date(task.dueDate) : null;
    const badges = [];

    if (task.priority === "High" && dueDate && (dueDate - now) < 24*60*60*1000 && task.status !== "completed") {
      badges.push({ text: "⚠️ Urgent", color: "bg-red-100 text-red-800 border-red-200" });
    }

    if (dueDate && dueDate < now && task.status !== "completed") {
      badges.push({ text: "⏰ Overdue", color: "bg-orange-100 text-orange-800 border-orange-200" });
    }

    if (task.status === "in progress") {
      badges.push({ text: "🔄 Ongoing", color: "bg-blue-100 text-blue-800 border-blue-200" });
    }

    if (task.priority === "High" && task.status !== "completed") {
      badges.push({ text: "🔥 High Priority", color: "bg-purple-100 text-purple-800 border-purple-200" });
    }

    return badges;
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "High":
        return <Zap className="w-4 h-4 text-red-500" />;
      case "Medium":
        return <Target className="w-4 h-4 text-yellow-500" />;
      case "Low":
        return <Clock className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50 border-green-200";
      case "in progress":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  // Skeleton Loading Components
  const SkeletonCard = ({ className = "" }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 animate-pulse ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
        </div>
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
      </div>
    </div>
  );

  const SkeletonTaskCard = () => (
    <div className="group p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3"></div>
          <div className="flex items-center space-x-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const SkeletonHeader = () => (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
      <div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-80 animate-pulse"></div>
      </div>
      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl w-48 mt-4 lg:mt-0 animate-pulse"></div>
    </div>
  );

  const SkeletonStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
      <div className="bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-6 h-24"></div>
      <div className="bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-6 h-24"></div>
      <div className="bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-6 h-24"></div>
    </div>
  );

  if (loading) {
    return (
      <div className="h-fill bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Skeleton Header */}
          <SkeletonHeader />

          {/* Skeleton Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {[...Array(5)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>

          {/* Skeleton Analytics */}
          <div className="mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 h-96 animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>

          {/* Skeleton Recent Tasks */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <SkeletonTaskCard key={i} />
              ))}
            </div>
          </div>

          {/* Skeleton Quick Stats */}
          <SkeletonStats />
        </div>
      </div>
    );
  }

  return (
    <div className="h-fill bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Personal Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back! Here's your productivity overview
              {isRefreshing && (
                <span className="ml-2 text-sm text-blue-500 animate-pulse">
                  • Updating...
                </span>
              )}
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <button
              onClick={() => fetchTaskDetails(true)}
              disabled={isRefreshing}
              className="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 disabled:opacity-50"
            >
              <Clock className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            
            <button
              onClick={() => navigate("/addtasks")}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Add New Task</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{summary.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <ListTodo className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">{summary.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">{summary.inProgress}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{summary.completed}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overdue</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">{summary.overdue}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="mb-8">
          <TaskAnalytics />
        </div>

        {/* Recent Tasks Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
              <ListTodo className="w-6 h-6 text-blue-600" />
              <span>Recent Tasks</span>
            </h2>
            <button
              onClick={() => navigate("/tasks")}
              className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 group"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>

          {recentTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <ListTodo className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No tasks yet
              </h3>
              <p className="text-gray-500 dark:text-gray-500 mb-6">
                Get started by creating your first task
              </p>
              <button
                onClick={() => navigate("/addtasks")}
                className="bg-blue-600 text-white py-2 px-6 rounded-xl hover:bg-blue-700 transition-colors duration-300"
              >
                Create Your First Task
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div 
                  key={task._id} 
                  className="group p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  onClick={() => navigate(`/tasks`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                          {task.title}
                        </h3>
                        {getPriorityIcon(task.priority)}
                      </div>
                      
                      {task.description && (
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full border ${getStatusColor(task.status)}`}>
                          <span className="text-xs font-medium capitalize">{task.status}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{task.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Smart badges */}
                  {getTaskBadge(task).length > 0 && (
                    <div className="mt-3 flex gap-2 flex-wrap">
                      {getTaskBadge(task).map((badge, idx) => (
                        <span 
                          key={idx} 
                          className={`text-xs px-3 py-1 rounded-full border ${badge.color}`}
                        >
                          {badge.text}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Completion Rate</p>
                <p className="text-2xl font-bold mt-1">
                  {summary.total > 0 ? Math.round((summary.completed / summary.total) * 100) : 0}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Productivity Score</p>
                <p className="text-2xl font-bold mt-1">
                  {Math.round((summary.completed + (summary.inProgress * 0.5)) / summary.total * 100) || 0}%
                </p>
              </div>
              <Target className="w-8 h-8 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Urgent Tasks</p>
                <p className="text-2xl font-bold mt-1">{summary.overdue}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-200" />
            </div>
          </div>
        </div>
      </div>

      <style>{`
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

export default Dashboard;