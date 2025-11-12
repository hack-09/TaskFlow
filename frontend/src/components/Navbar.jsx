import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NotificationBell from "./NotificationBell";
import {
  Home,
  ListCheck,
  PlusCircle,
  LogOut,
  Sun,
  Moon,
  Users,
  LayoutDashboard,
  FolderPlus,
  ChevronRight,
  ChevronDown,
  Settings,
  User,
  Sparkles,
  Briefcase,
  Search,
} from "lucide-react";
import axios from "axios";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isWorkspacesOpen, setIsWorkspacesOpen] = useState(true);
  const [user, setUser] = useState(null);

  // Fetch user data and workspaces
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [userRes, workspacesRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/auth/user`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/workspaces", {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);
        setUser(userRes.data);
        setWorkspaces(workspacesRes.data);
        console.log("User workspaces:", userRes.data);
        console.log("User Data:", user);
        console.log("Workspace Data:", workspaces);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // Dark mode handling
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    console.log("User updated:", user);
    console.log("User name:", user?user["name"]:"");
  }, [user]);

  useEffect(() => {
    console.log("Workspaces updated:", workspaces);
  }, [workspaces]);

  const handleThemeToggle = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      document.documentElement.classList.toggle("dark", newMode);
      return newMode;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const NavItem = ({ icon: Icon, label, onClick, isActive, isCollapsed, hasNotification, isButton = true }) => (
    <div
      onClick={onClick}
      className={`flex items-center p-3 rounded-xl transition-all duration-300 cursor-pointer group ${
        isActive
          ? "bg-white/20 text-white shadow-lg transform scale-105"
          : "text-blue-100 hover:bg-white/10 hover:text-white hover:shadow-md"
      } ${isCollapsed ? "justify-center" : ""}`}
    >
      <div className="relative">
        <Icon className={`w-5 h-5 ${isCollapsed ? "" : "mr-3"} transition-all duration-300`} />
        {hasNotification && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full ring-2 ring-blue-600"></div>
        )}
      </div>
      {!isCollapsed && (
        <span className="font-medium transition-all duration-300 flex-1">{label}</span>
      )}
      {!isCollapsed && isButton && (
        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <nav className={`fixed lg:static inset-y-0 left-0 z-50 bg-gradient-to-b from-blue-600 to-purple-700 dark:from-gray-900 dark:to-gray-800 text-white transition-all duration-500 ease-in-out ${
        isCollapsed ? "w-20" : "w-80"
      } shadow-2xl border-r border-white/10`}>
        
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className={`flex items-center justify-between transition-all duration-300 ${
            isCollapsed ? "flex-col space-y-4" : "flex-row"
          }`}>
            {/* Logo & Title */}
            <div className={`flex items-center transition-all duration-300 ${
              isCollapsed ? "flex-col space-y-2" : "space-x-3"
            }`}>
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              {!isCollapsed && (
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
                    TaskFlow
                  </h1>
                  <p className="text-blue-200/80 text-xs">Productivity Suite</p>
                </div>
              )}
            </div>

            {/* Toggle & Notification */}
            <div className={`flex items-center space-x-2 ${isCollapsed ? "flex-col space-y-2" : ""}`}>
              <NotificationBell isCollapsed={isCollapsed} />
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200"
              >
                <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${
                  isCollapsed ? "rotate-180" : ""
                }`} />
              </button>
            </div>
          </div>

          {/* User Profile */}
          {!isCollapsed && user && (
            <div className="mt-6 p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">Name: {user.name}</h3>
                  <p className="text-blue-200/80 text-sm truncate">Email: {user.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar py-6">
          <div className="space-y-2 px-4">
            {/* Quick Access */}
            <div className="mb-6">
              {!isCollapsed && (
                <h3 className="text-xs font-semibold text-blue-200/60 uppercase tracking-wider mb-3 px-3">
                  Quick Access
                </h3>
              )}
              <div className="space-y-1">
                <NavItem
                  icon={LayoutDashboard}
                  label="Dashboard"
                  onClick={() => navigate("/dashboard")}
                  isActive={isActiveRoute("/dashboard")}
                  isCollapsed={isCollapsed}
                />
                <NavItem
                  icon={ListCheck}
                  label="My Tasks"
                  onClick={() => navigate("/tasks")}
                  isActive={isActiveRoute("/tasks")}
                  isCollapsed={isCollapsed}
                  hasNotification={true}
                />
                <NavItem
                  icon={PlusCircle}
                  label="Add Task"
                  onClick={() => navigate("/addtasks")}
                  isActive={isActiveRoute("/addtasks")}
                  isCollapsed={isCollapsed}
                />
              </div>
            </div>

            {/* Workspaces Section */}
            <div className="mb-6">
              <div 
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer hover:bg-white/5 transition-colors duration-200 ${
                  isCollapsed ? "justify-center" : ""
                }`}
                onClick={() => !isCollapsed && setIsWorkspacesOpen(!isWorkspacesOpen)}
              >
                {!isCollapsed && (
                  <>
                    <div className="flex items-center space-x-3">
                      <Briefcase className="w-5 h-5 text-cyan-300" />
                      <span className="font-semibold">Workspaces</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                      isWorkspacesOpen ? "rotate-180" : ""
                    }`} />
                  </>
                )}
                {isCollapsed && <Briefcase className="w-5 h-5 text-cyan-300" />}
              </div>

              {!isCollapsed && isWorkspacesOpen && (
                <div className="mt-2 space-y-1 pl-8">
                  {loading ? (
                    <div className="flex items-center space-x-2 p-2 text-blue-200/60">
                      <div className="w-4 h-4 border-2 border-blue-200/30 border-t-blue-200 rounded-full animate-spin"></div>
                      <span className="text-sm">Loading...</span>
                    </div>
                  ) : workspaces.length > 0 ? (
                    <>
                      {workspaces.slice(0, 4).map((ws) => (
                        <NavItem
                          key={ws._id}
                          icon={Users}
                          label={ws.name}
                          onClick={() => navigate(`/workspace/${ws._id}`)}
                          isActive={location.pathname === `/workspace/${ws._id}`}
                          isCollapsed={isCollapsed}
                          isButton={false}
                        />
                      ))}
                    </>
                  ) : (
                    <div className="p-3 text-center text-blue-200/60 text-sm">
                      No workspaces yet
                    </div>
                  )}

                  <div className="space-y-1 mt-2">
                    <NavItem
                      icon={FolderPlus}
                      label="Create Workspace"
                      onClick={() => navigate("/create-workspace")}
                      isActive={isActiveRoute("/create-workspace")}
                      isCollapsed={isCollapsed}
                    />
                    <NavItem
                      icon={Briefcase}
                      label="All Workspaces"
                      onClick={() => navigate("/workspaces")}
                      isActive={isActiveRoute("/workspaces")}
                      isCollapsed={isCollapsed}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Settings Section */}
            {!isCollapsed && (
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-blue-200/60 uppercase tracking-wider mb-3 px-3">
                  Settings
                </h3>
                <div className="space-y-1">
                  <NavItem
                    icon={User}
                    label="Profile"
                    onClick={() => navigate("/profile")}
                    isActive={isActiveRoute("/profile")}
                    isCollapsed={isCollapsed}
                  />
                  <NavItem
                    icon={Settings}
                    label="Settings"
                    onClick={() => navigate("/settings")}
                    isActive={isActiveRoute("/settings")}
                    isCollapsed={isCollapsed}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={handleThemeToggle}
            className={`flex items-center w-full p-3 rounded-xl transition-all duration-300 group ${
              isCollapsed ? "justify-center" : ""
            } bg-white/5 hover:bg-white/10 text-blue-100 hover:text-white`}
          >
            {isDarkMode ? (
              <Sun className={`w-5 h-5 ${isCollapsed ? "" : "mr-3"} transition-all duration-300`} />
            ) : (
              <Moon className={`w-5 h-5 ${isCollapsed ? "" : "mr-3"} transition-all duration-300`} />
            )}
            {!isCollapsed && (
              <span className="font-medium flex-1 text-left">
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </span>
            )}
          </button>

          <button
            onClick={handleLogout}
            className={`flex items-center w-full p-3 rounded-xl transition-all duration-300 group ${
              isCollapsed ? "justify-center" : ""
            } bg-red-500/20 hover:bg-red-500/30 text-red-200 hover:text-white border border-red-500/30`}
          >
            <LogOut className={`w-5 h-5 ${isCollapsed ? "" : "mr-3"} transition-all duration-300`} />
            {!isCollapsed && (
              <span className="font-medium flex-1 text-left">Logout</span>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-blue-600 text-white rounded-2xl shadow-lg hover:bg-blue-700 transition-colors duration-200"
      >
        <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${
          isCollapsed ? "" : "rotate-180"
        }`} />
      </button>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </>
  );
}

export default Navbar;