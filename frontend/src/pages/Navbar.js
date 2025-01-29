import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-200 h-screen p-6 w-64 flex flex-col gap-4 shadow-md">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Navigation</h2>
      <button
        onClick={() => navigate('/dashboard')}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 text-left"
      >
        Home
      </button>
      <button
        onClick={() => navigate('/tasks')}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 text-left"
      >
        My Task
      </button>
      <button
        disabled
        className="bg-gray-300 text-gray-600 py-2 px-4 rounded-lg cursor-not-allowed text-left"
      >
        Disabled
      </button>
      <button
        onClick={() => navigate('/messages')}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 text-left"
      >
        Messages
      </button>
      <button
        onClick={() => navigate('/settings')}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 text-left"
      >
        Settings
      </button>
    </div>
  );
}

export default Navbar;
