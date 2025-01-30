import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, ListCheck, LogIn, PlusCircle, LogOut, Sun, Moon } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Handle theme toggle
  const handleThemeToggle = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      document.documentElement.classList.toggle("dark", newMode);
      return newMode;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear the token
    navigate("/"); // Redirect to login or home page
  };

  return (
    <nav className="bg-blue-600 text-white">
      <div className="w-64 h-full bg-blue-600 dark:bg-blue-900 text-white flex flex-col p-4 hidden lg:flex lg:flex-col">
        <h2 className="text-2xl font-bold mb-8">Navigation</h2>
        <button
          onClick={() => navigate("/")}
          className="flex py-2 px-4 mb-4 bg-blue-500 hover:bg-blue-700 rounded text-white text-left hidden"
        >
          <LogIn className="w-5 h-5 mr-2" />Login
        </button>
        <button
          onClick={() => navigate("/dashboard")}
          className="flex py-2 px-4 mb-4 bg-blue-500 hover:bg-blue-700 rounded text-white text-left"
        >
          <Home className="w-5 h-5 mr-2" />Dashboard
        </button>
        <button
          onClick={() => navigate("/tasks")}
          className="flex py-2 px-4 mb-4 bg-blue-500 hover:bg-blue-700 rounded text-white text-left"
        >
          <ListCheck className="w-5 h-5 mr-2" />My Tasks
        </button>
        <button
          onClick={() => navigate("/addtasks")}
          className="flex py-2 px-4 mb-4 bg-blue-500 hover:bg-blue-700 rounded text-white text-left"
        >
          <PlusCircle className="w-5 h-5 mr-2" />Add Tasks
        </button>
        <button
          onClick={handleLogout}
          className="flex py-2 px-4 bg-red-500 hover:bg-red-700 rounded text-white text-left"
        >
          <LogOut className="w-5 h-5 mr-2" />Logout
        </button>

        {/* Theme Toggle Button */}
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
