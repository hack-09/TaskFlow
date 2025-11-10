import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  ListCheck,
  LogIn,
  PlusCircle,
  LogOut,
  Sun,
  Moon,
  Users,
} from "lucide-react";
import axios from "axios";

function Navbar() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user workspaces (personal + collaborative)
  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/workspaces", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWorkspaces(res.data);
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkspaces();
  }, []);

  // Dark mode handling
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

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

  return (
    <nav className="bg-blue-600 text-white">
      <div className="w-64 h-full bg-blue-600 dark:bg-blue-900 text-white flex flex-col p-4 hidden lg:flex lg:flex-col">
        <h2 className="text-2xl font-bold mb-8">Navigation</h2>

        {/* Personal Section */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex py-2 px-4 mb-4 bg-blue-500 hover:bg-blue-700 rounded text-white text-left"
        >
          <Home className="w-5 h-5 mr-2" /> Personal Dashboard
        </button>

        <button
          onClick={() => navigate("/tasks")}
          className="flex py-2 px-4 mb-4 bg-blue-500 hover:bg-blue-700 rounded text-white text-left"
        >
          <ListCheck className="w-5 h-5 mr-2" /> My Tasks
        </button>

        <button
          onClick={() => navigate("/addtasks")}
          className="flex py-2 px-4 mb-4 bg-blue-500 hover:bg-blue-700 rounded text-white text-left"
        >
          <PlusCircle className="w-5 h-5 mr-2" /> Add Tasks
        </button>

        {/* Collaborative Workspaces */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Collaborations</h3>

          {loading ? (
            <p className="text-sm">Loading...</p>
          ) : workspaces.length > 0 ? (
            <>
              {workspaces.slice(0, 3).map((ws) => (
                <button
                  key={ws._id}
                  onClick={() => navigate(`/workspace/${ws._id}`)}
                  className="flex py-2 px-4 mb-2 bg-blue-500 hover:bg-blue-700 rounded text-white text-left w-full"
                >
                  <Users className="w-5 h-5 mr-2" /> {ws.name}
                </button>
              ))}
            </>
          ) : (
            <p className="text-sm italic">No collaborations yet</p>
          )}
          
          <button
            onClick={() => navigate("/workspaces")}
            className="flex py-2 px-4 mb-2 bg-gray-500 hover:bg-gray-700 rounded text-white text-left w-full"
          >
            View All Workspaces →
          </button>

          <button
            onClick={() => navigate("/create-workspace")}
            className="flex py-2 px-4 mt-2 bg-green-500 hover:bg-green-700 rounded text-white text-left w-full"
          >
            <PlusCircle className="w-5 h-5 mr-2" /> New Workspace
          </button>
        </div>

        {/* Logout + Theme */}
        <button
          onClick={handleLogout}
          className="flex py-2 px-4 mt-6 bg-red-500 hover:bg-red-700 rounded text-white text-left"
        >
          <LogOut className="w-5 h-5 mr-2" /> Logout
        </button>

        <button
          onClick={handleThemeToggle}
          className="flex py-2 px-4 mt-4 bg-gray-200 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-gray-900 text-left"
        >
          {isDarkMode ? (
            <>
              <Sun className="w-5 h-5 mr-2" /> Light Mode
            </>
          ) : (
            <>
              <Moon className="w-5 h-5 mr-2" /> Dark Mode
            </>
          )}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
