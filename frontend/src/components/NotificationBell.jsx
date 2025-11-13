import React, { useEffect, useState, useRef } from "react";
import { 
  Bell, 
  CheckCheck, 
  X, 
  Mail, 
  Users, 
  Calendar,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  UserPlus,
  MessageSquare,
  Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsRead,
  respondToInvitation,
} from "../service/api";
import { useSocket } from "../context/SocketContext";

export default function NotificationBell({ isCollapsed = false }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responding, setResponding] = useState(null);
  const { socket } = useSocket();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetchNotifications();
      setNotifications(res.data || []);
    } catch (error) {
      console.error("Failed to load notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();

    if (!socket) return;

    socket.on("notification", (notif) => {
      setNotifications((prev) => [notif, ...prev]);
      
      // Enhanced toast notification
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-sm w-full bg-white dark:bg-gray-800 shadow-2xl rounded-2xl pointer-events-auto flex ring-2 ring-blue-500/20 border border-gray-100 dark:border-gray-700`}
        >
          <div className="flex-1 p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Bell className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  New Notification
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {notif.message}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200 dark:border-gray-700">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-2xl p-4 flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ));
    });

    return () => socket.off("notification");
  }, [socket]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
      toast.error("Failed to mark notification as read");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      toast.error("Failed to mark all notifications as read");
    }
  };

  const handleInvitationResponse = async (inviteId, action) => {
    try {
      setResponding(inviteId);
      const res = await respondToInvitation(inviteId, action);
      toast.success(res.data.message || `Invitation ${action}ed successfully`);
      
      // Mark notification as read and remove from list
      setNotifications((prev) =>
        prev.filter((n) => n.inviteId !== inviteId)
      );
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${action} invitation`);
    } finally {
      setResponding(null);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "workspace_invite":
        return <UserPlus className="w-4 h-4 text-green-500" />;
      case "task_assigned":
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case "mention":
        return <MessageSquare className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
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

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell */}
      <button
        onClick={() => setOpen(!open)}
        className={`relative p-2 rounded-xl transition-all duration-300 group ${
          open 
            ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" 
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
        } ${isCollapsed ? "w-10 h-10 flex items-center justify-center" : ""}`}
      >
        <Bell className={`${isCollapsed ? "w-5 h-5" : "w-5 h-5"}`} />
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs min-w-[18px] h-[18px] flex items-center justify-center animate-pulse ring-2 ring-white dark:ring-gray-800">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="left-1 absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-hidden transform animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Bell className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Notifications
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {unreadCount} unread
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  disabled={loading}
                >
                  <CheckCheck className="w-3 h-3" />
                  <span>Mark All</span>
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-64 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8 px-4">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
                  No notifications
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-xs">
                  You're all caught up!
                </p>
              </div>
            ) : (
              notifications.slice(0, 10).map((n) => (
                <div
                  key={n._id}
                  className={`p-4 border-b border-gray-100 dark:border-gray-700 transition-all duration-200 ${
                    !n.read
                      ? "bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-100/50 dark:hover:bg-blue-900/20"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  {/* Workspace Invitation */}
                  {n.type === "workspace_invite" ? (
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <UserPlus className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white leading-relaxed">
                            {n.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {getTimeAgo(n.createdAt)}
                          </p>
                        </div>
                        {!n.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2 ml-11">
                        <button
                          onClick={() => handleInvitationResponse(n.inviteId, "accept")}
                          disabled={responding === n.inviteId}
                          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {responding === n.inviteId ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <CheckCheck className="w-3 h-3" />
                          )}
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => handleInvitationResponse(n.inviteId, "decline")}
                          disabled={responding === n.inviteId}
                          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-gray-600 text-white text-xs rounded-lg hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {responding === n.inviteId ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <X className="w-3 h-3" />
                          )}
                          <span>Decline</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Regular Notification */
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        {getNotificationIcon(n.type)}
                      </div>
                      <div 
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => handleMarkAsRead(n._id)}
                      >
                        <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
                          {n.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {getTimeAgo(n.createdAt)}
                        </p>
                      </div>
                      {!n.read && (
                        <button
                          onClick={() => handleMarkAsRead(n._id)}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors duration-200 flex-shrink-0"
                          title="Mark as read"
                        >
                          <Eye className="w-3 h-3 text-gray-400" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <div className="grid grid-cols-2 gap-1 p-2">
              <button
                onClick={() => {
                  navigate("/notifications");
                  setOpen(false);
                }}
                className="flex items-center justify-center space-x-2 px-3 py-2 text-xs text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 group"
              >
                <Eye className="w-3 h-3" />
                <span>View All</span>
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </button>
              
              <button
                onClick={() => {
                  navigate("/invitations");
                  setOpen(false);
                }}
                className="flex items-center justify-center space-x-2 px-3 py-2 text-xs text-green-600 dark:text-green-400 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 group"
              >
                <Users className="w-3 h-3" />
                <span>Invitations</span>
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style >{`
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.15s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}