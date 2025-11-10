import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Clock } from "lucide-react";

const ActivityLog = () => {
  const { id } = useParams();
  const workspaceId = id;
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const url = workspaceId
          ? `${API_BASE}/activity?workspaceId=${workspaceId}`
          : `${API_BASE}/activity`;

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setLogs(res.data || []);
      } catch (err) {
        console.error("Error fetching activity logs:", err);
        setError("Failed to fetch activity logs");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [workspaceId]);

  if (loading) return <div className="p-4 text-gray-500">Loading activity logs...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!logs.length) return <div className="p-4 text-gray-500">No recent activity yet.</div>;

  return (
    <div className="min-h-screen p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
        Activity Log
      </h3>

      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {logs.map((log) => (
          <li key={log._id} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-800 dark:text-gray-100">
                <span className="font-medium">
                  {log.userId?.name || log.userId?.email || "Unknown User"}
                </span>{" "}
                — {log.details}
              </p>
              <p className="text-xs text-gray-500 mt-1 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {new Date(log.createdAt).toLocaleString()}
              </p>
            </div>
            <span
              className={`mt-2 sm:mt-0 px-2 py-1 text-xs font-semibold rounded-md ${
                log.action.includes("TASK")
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                  : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
              }`}
            >
              {log.action}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityLog;
