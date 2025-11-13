import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Mail, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  UserPlus,
  RefreshCw,
  Loader2,
  ArrowRight,
  Building2,
  Sparkles
} from "lucide-react";

const Invitations = () => {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(null);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const API_BASE = process.env.REACT_APP_ARI_CALL_URL;

  const fetchInvites = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${API_BASE}/invite`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvites(res.data || []);
    } catch (err) {
      console.error("Failed to load invites:", err);
      setError("Failed to load invitations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  const respondToInvite = async (inviteId, action) => {
    try {
      setResponding(inviteId);
      setError("");
      await axios.post(
        `${API_BASE}/invites/${inviteId}/respond`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInvites(invites.filter((i) => i._id !== inviteId));
    } catch (err) {
      console.error("Failed to respond:", err);
      setError(`Failed to ${action} invitation. Please try again.`);
    } finally {
      setResponding(null);
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="h-fill bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading invitations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-fill bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Workspace Invitations
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your workspace collaboration requests
            </p>
          </div>
          
          <button
            onClick={fetchInvites}
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 mt-4 lg:mt-0"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-2xl mb-6 flex items-center space-x-3">
            <XCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Invitations List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Pending Invitations
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {invites.length} invitation{invites.length !== 1 ? 's' : ''} waiting for your response
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Invitations Content */}
          {invites.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No pending invitations
              </h3>
              <p className="text-gray-500 dark:text-gray-500 mb-6 max-w-md mx-auto">
                You're all caught up! When someone invites you to collaborate, 
                it will appear here.
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Sparkles className="w-4 h-4" />
                <span>Ready to collaborate with your team</span>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {invites.map((invite) => (
                <div 
                  key={invite._id}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Invitation Details */}
                    <div className="flex-1">
                      <div className="flex items-start space-x-4">
                        {/* Workspace Icon */}
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                            <Building2 className="w-6 h-6 text-white" />
                          </div>
                        </div>

                        {/* Invitation Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {invite.workspaceName}
                            </h3>
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                              New
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center space-x-1">
                                <Users className="w-4 h-4" />
                                <span>Workspace Collaboration</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <UserPlus className="w-4 h-4" />
                                <span>Invited by {invite.invitedByName}</span>
                              </div>
                              {invite.createdAt && (
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{getTimeAgo(invite.createdAt)}</span>
                                </div>
                              )}
                            </div>

                            {/* Additional Info */}
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 mt-2">
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                You've been invited to collaborate on this workspace. 
                                Accept to start working together with the team.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 lg:gap-2 xl:gap-3">
                      <button
                        onClick={() => respondToInvite(invite._id, "accept")}
                        disabled={responding === invite._id}
                        className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg min-w-[120px]"
                      >
                        {responding === invite._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        <span>{responding === invite._id ? "Accepting..." : "Accept"}</span>
                      </button>
                      
                      <button
                        onClick={() => respondToInvite(invite._id, "decline")}
                        disabled={responding === invite._id}
                        className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-w-[120px]"
                      >
                        {responding === invite._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        <span>{responding === invite._id ? "Declining..." : "Decline"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          {invites.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Manage all your collaboration requests from one place</span>
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Accept Invitation</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Join the workspace and start collaborating with team members immediately.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Team Collaboration</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Work together on tasks, share updates, and track progress as a team.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                <ArrowRight className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Get Started</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Accept an invitation to begin your collaborative journey with the team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invitations;