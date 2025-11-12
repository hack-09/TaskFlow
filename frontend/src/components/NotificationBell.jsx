import React, { useEffect, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsRead,
  respondToInvitation,
} from "../service/api";
import { useSocket } from "../context/SocketContext";

export default function NotificationBell() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const { socket } = useSocket();

  const loadNotifications = async () => {
    const res = await fetchNotifications();
    setNotifications(res.data);
  };

  useEffect(() => {
    loadNotifications();

    if (!socket) return;

    socket.on("notification", (notif) => {
      setNotifications((prev) => [notif, ...prev]);
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-3">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              🔔 New Notification
            </p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              {notif.message}
            </p>
          </div>
          <div className="flex border-l border-gray-200 dark:border-gray-700">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-2 flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:hover:text-blue-400"
            >
              Close
            </button>
          </div>
        </div>
      ));
    });

    return () => socket.off("notification");
  }, [socket]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = async (id) => {
    await markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // ✅ Handle invitation response (accept/decline)
  const handleInvitationResponse = async (inviteId, action) => {
    try {
      const res = await respondToInvitation(inviteId, action);
      toast.success(res.data.message || `Invitation ${action}ed successfully`);
      // Mark notification as read
      setNotifications((prev) =>
        prev.map((n) =>
          n.inviteId === inviteId ? { ...n, read: true } : n
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to respond to invitation");
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative text-gray-600 dark:text-white"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full px-1 text-xs">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-50 max-h-96 overflow-y-auto" style={{ left: "1rem" }}>
          <div className="flex justify-between items-center p-2 border-b dark:border-gray-700">
            <h4 className="font-semibold text-gray-700 dark:text-gray-200">
              Notifications
            </h4>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-blue-600 text-xs flex items-center gap-1 hover:underline"
              >
                <CheckCheck className="w-4 h-4" /> Mark all as read
              </button>
            )}
          </div>

          <div className="p-2 text-center border-t dark:border-gray-700">
            <button
              onClick={() => navigate("/notifications")}
              className="text-blue-600 text-sm hover:underline"
            >
              View all notifications →
            </button>

            <button
              onClick={() => navigate("/invitations")}
              className="text-green-600 text-sm hover:underline"
            >
              View workspace invitations →
            </button>
          </div>

          {notifications.length === 0 ? (
            <p className="p-4 text-gray-500 text-sm">No notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`p-3 border-b ${
                  !n.read
                    ? "bg-blue-50 dark:bg-gray-700 hover:bg-blue-100"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {/* If it's a workspace invite */}
                {n.type === "workspace_invite" ? (
                  <>
                    <p className="text-sm text-gray-800 dark:text-gray-100 font-medium">
                      📩 {n.message}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() =>
                          handleInvitationResponse(n.inviteId, "accept")
                        }
                        className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          handleInvitationResponse(n.inviteId, "decline")
                        }
                        className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                      >
                        Decline
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p
                      className="text-sm text-gray-800 dark:text-gray-100 cursor-pointer"
                      onClick={() => handleMarkAsRead(n._id)}
                    >
                      {n.message}
                    </p>
                    <span className="text-xs text-gray-500">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
