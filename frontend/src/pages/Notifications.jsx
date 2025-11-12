import React, { useEffect, useState } from "react";
import { fetchNotifications, markNotificationAsRead } from "../service/api";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await fetchNotifications();
      setNotifications(res.data);
    })();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">All Notifications</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700">
        {notifications.length === 0 ? (
          <p className="p-4 text-gray-500">No notifications yet.</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              className={`p-4 cursor-pointer ${
                n.read
                  ? "hover:bg-gray-100 dark:hover:bg-gray-700"
                  : "bg-blue-50 dark:bg-gray-700"
              }`}
              onClick={() => markNotificationAsRead(n._id)}
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
    </div>
  );
}
