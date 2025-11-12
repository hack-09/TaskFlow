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
  CartesianGrid,
} from "recharts";
import { fetchTaskStats } from "../service/api";
import { 
  Filter, 
  Calendar, 
  Tag,
  TrendingUp,
  Users,
  PieChart as PieChartIcon,
  BarChart3
} from "lucide-react";

export default function TaskAnalytics({ workspaceId }) {
  const [stats, setStats] = useState(null);
  const [dateRange, setDateRange] = useState("7d");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const res = await fetchTaskStats(workspaceId, { dateRange, category });
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [workspaceId, dateRange, category]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
          No analytics data
        </h3>
        <p className="text-gray-500 dark:text-gray-500">
          Analytics will appear as you complete more tasks
        </p>
      </div>
    );
  }

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

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <span>Task Analytics</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Insights into your productivity and task patterns
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mt-4 lg:mt-0">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="pl-10 pr-8 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>

          <div className="relative">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="pl-10 pr-8 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none"
            >
              <option value="all">All Categories</option>
              <option value="Work">Work</option>
              <option value="Study">Study</option>
              <option value="Personal">Personal</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Tasks Completed per Day */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 border border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2 text-gray-900 dark:text-white">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span>Tasks Completed</span>
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={perDayData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 12 }}
                className="text-xs"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                className="text-xs"
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                fill="#60a5fa" 
                radius={[4, 4, 0, 0]}
                className="hover:opacity-80 transition-opacity"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Task Priority Distribution */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 border border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2 text-gray-900 dark:text-white">
            <PieChartIcon className="w-5 h-5 text-green-600" />
            <span>Priority Distribution</span>
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie 
                data={priorityData} 
                dataKey="value" 
                outerRadius={80} 
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {priorityData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Either show Top Contributors (workspace) or Progress Trend (personal) */}
        {workspaceId ? (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 border border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2 text-gray-900 dark:text-white">
              <Users className="w-5 h-5 text-purple-600" />
              <span>Top Contributors</span>
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.topContributors || []}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="user" 
                  tick={{ fontSize: 12 }}
                  className="text-xs"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  className="text-xs"
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="count" 
                  fill="#a78bfa" 
                  radius={[4, 4, 0, 0]}
                  className="hover:opacity-80 transition-opacity"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 border border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2 text-gray-900 dark:text-white">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span>Progress Trend</span>
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 12 }}
                  className="text-xs"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  className="text-xs"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="Completed" 
                  stroke="#4ade80" 
                  strokeWidth={2}
                  dot={{ fill: '#4ade80', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="In Progress" 
                  stroke="#60a5fa" 
                  strokeWidth={2}
                  dot={{ fill: '#60a5fa', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Pending" 
                  stroke="#f87171" 
                  strokeWidth={2}
                  dot={{ fill: '#f87171', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}