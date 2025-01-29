import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import TaskList from './pages/TaskList';
import RegisterPage from './pages/RegisterPage';
import Navbar from './pages/Navbar'; // Ensure Navbar is imported
import './App.css';
import AddTaskModal from './pages/AddTaskModal';

function App() {
  return (
    <Router>
      <div className="h-screen">
        {/* Conditional rendering for Navbar */}
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="*"
            element={
              <div className="flex w-full">
                <Navbar />
                <div className="flex-1 p-8 bg-gray-100">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/tasks" element={<TaskList />} />
                    <Route path="/addtasks" element={<AddTaskModal />} />
                  </Routes>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
