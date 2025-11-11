import React, { useEffect, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import toast from "react-hot-toast";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsRead,
} from "../service/api";
import { useSocket } from "../context/SocketContext";

export default function NotificationBell() {
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
      // Add new notification to list
      setNotifications((prev) => [notif, ...prev]);

      // Show live toast
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
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-50 max-h-96 overflow-y-auto">
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

          {notifications.length === 0 ? (
            <p className="p-4 text-gray-500 text-sm">No notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => handleMarkAsRead(n._id)}
                className={`p-3 border-b cursor-pointer ${
                  !n.read
                    ? "bg-blue-50 dark:bg-gray-700 hover:bg-blue-100"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <p className="text-sm text-gray-800 dark:text-gray-100">
                  {n.message}
                </p>
                <span className="text-xs text-gray-500">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
