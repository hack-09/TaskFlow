import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { fetchTaskStats } from "../service/api";

export default function TaskAnalytics({ workspaceId }) {
  const [stats, setStats] = useState(null);
  const [dateRange, setDateRange] = useState("7d");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetchTaskStats(workspaceId, { dateRange, category });
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load analytics:", err);
      }
    };
    loadStats();
  }, [workspaceId, dateRange, category]);

  if (!stats) return <p>Loading analytics...</p>;

  const perDayData = Object.entries(stats.perDay || {}).map(([day, count]) => ({
    day,
    count,
  }));

  const priorityData = Object.entries(stats.priorityDistribution || {}).map(
    ([name, value]) => ({ name, value })
  );

  const trendData = Object.entries(stats.perDay || {}).map(([day, count]) => ({
    day,
    Completed: count,
    Pending: Math.floor(count * 0.6),
    "In Progress": Math.floor(count * 0.3),
  }));

  const COLORS = ["#4ade80", "#60a5fa", "#f87171", "#facc15", "#a78bfa"];

  return (
    <div className="mt-8">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm bg-white dark:bg-gray-800"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="all">All Time</option>
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm bg-white dark:bg-gray-800"
        >
          <option value="all">All Categories</option>
          <option value="Work">Work</option>
          <option value="Study">Study</option>
          <option value="Personal">Personal</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tasks Completed per Day */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-3">Tasks Completed per Day</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={perDayData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Task Priority Distribution */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-3">Task Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={priorityData} dataKey="value" outerRadius={80} label>
                {priorityData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Either show Top Contributors (workspace) or Progress Trend (personal) */}
        {workspaceId ? (
          <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-3">Top Contributors</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.topContributors || []}>
                <XAxis dataKey="user" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#4ade80" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-3">Task Progress Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Completed" stroke="#4ade80" />
                <Line type="monotone" dataKey="In Progress" stroke="#60a5fa" />
                <Line type="monotone" dataKey="Pending" stroke="#f87171" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
