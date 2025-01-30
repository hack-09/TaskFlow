import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, ListCheck, LogIn, PlusCircle, LogOut } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear the token
    navigate("/"); // Redirect to login or home page
  };

  return (
    <nav className="bg-blue-600 text-white">
      <div className="w-64 h-full bg-blue-600 text-white flex flex-col p-4 hidden lg:flex lg:flex-col">
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
      </div>
    </nav>
  );
}

export default Navbar;
