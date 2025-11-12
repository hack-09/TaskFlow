import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { fetchTaskStats } from "../service/api";

export default function TaskAnalytics({ workspaceId }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      const res = await fetchTaskStats(workspaceId);
      setStats(res.data);
    };
    loadStats();
  }, [workspaceId]);

  if (!stats) return <p>Loading analytics...</p>;

  const barData = Object.entries(stats.perDay).map(([day, count]) => ({ day, count }));
  const pieData = [
    { name: "Completed", value: stats.completed },
    { name: "Pending", value: stats.pending },
  ];
  const COLORS = ["#4ade80", "#f87171"];

  return (
    <div className="grid md:grid-cols-2 gap-6 mt-8">
      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-3">Tasks Completed per Day</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#60a5fa" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-3">Completion Overview</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={pieData} dataKey="value" outerRadius={80} label>
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
