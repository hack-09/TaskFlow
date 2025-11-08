import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import TaskList from './pages/TaskList';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';
import Documentation from './pages/Documentation';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import AddTaskModal from './pages/AddTaskModal';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />

          {/* Protected Routes */}
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <div className="flex w-full">
                  <Navbar />
                  <div className="flex-1 bg-gray-800">
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/tasks" element={<TaskList />} />
                      <Route path="/addtasks" element={<AddTaskModal />} />
                    </Routes>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
