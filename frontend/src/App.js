import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Authentication/LoginPage";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import TaskList from "./pages/TaskList";
import RegisterPage from "./pages/Authentication/RegisterPage";

import LandingPage from "./pages/LandingPage";
import Documentation from "./pages/legal/Documentation";
import Contact from "./pages/legal/Contact";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsOfService from "./pages/legal/TermsOfService";

import AddTaskModal from "./pages/AddTaskModal";
import ProtectedRoute from "./components/ProtectedRoute";
import ActivityLog from "./components/ActivityLog";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "./context/SocketContext";
import { WorkspaceProvider } from "./context/WorkspaceContext";
import CreateWorkspace from "./pages/Workspaces/CreateWorkspace";
import JoinWorkspace from "./pages/Workspaces/JoinWorkspace";
import WorkspaceList from "./pages/Workspaces/WorkspaceList";
import WorkspaceMembers from "./pages/Workspaces/WorkspaceMembers";
import WorkspaceDashboard from "./pages/WorkspaceDashboard";
import InviteMembersModal from "./pages/Workspaces/InviteMembersModal";
import Invitations from "./components/Invitations";
import NotificationsPage from "./pages/Notifications";
import "./App.css";

function App() {
  return (
    <Router>
      <SocketProvider>
        <WorkspaceProvider>
            <div className="h-screen">
              <Routes>
                {/* ---------- Public Routes ---------- */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/documentation" element={<Documentation />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />

                {/* ---------- Protected (Authenticated) Routes ---------- */}
                <Route
                  path="*"
                  element={
                    <ProtectedRoute>
                      <div className="flex w-full">
                        <Navbar />
                        <div className="flex-1 bg-gray-800">
                          <Routes>
                            {/* Personal workspace routes */}
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/tasks" element={<TaskList />} />
                            <Route path="/addtasks" element={<AddTaskModal />} />

                            {/* Collaboration workspace routes */}
                            <Route path="/workspaces" element={<WorkspaceList />} />
                            <Route path="/workspace/:id" element={<WorkspaceDashboard  />} />
                            <Route path="/create-workspace" element={<CreateWorkspace />} />
                            <Route path="/workspace/:id/addtasks" element={<AddTaskModal />} />
                            <Route path="/workspace/:id/tasks" element={<TaskList />} />
                            <Route path="/workspace/:id/invite" element={<InviteMembersModal />} />
                            <Route path="/workspace/:id/activity" element={<ActivityLog />} />
                            <Route path="/workspace/join" element={<JoinWorkspace />} />
                            <Route path="/workspace/:id/members" element={<WorkspaceMembers />} />
                            <Route path="/invitations" element={<Invitations />} />
                            <Route path="/notifications" element={<NotificationsPage />} />

                          </Routes>
                        </div>
                      </div>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
        </WorkspaceProvider>
      </SocketProvider>
    </Router>
  );
}

export default App;
