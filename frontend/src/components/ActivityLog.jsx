import React, { useEffect, useState } from "react";
import axios from "axios";

const ActivityLog = ({ workspaceId }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.REACT_APP_ARI_CALL_URL}/workspaces/${workspaceId}/activity`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(res.data);
    };
    fetchLogs();
  }, [workspaceId]);

  return (
    <div>
      <h4>Activity Log</h4>
      <ul>
        {logs.map((log, idx) => <li key={idx}>{log.message} ({new Date(log.timestamp).toLocaleString()})</li>)}
      </ul>
    </div>
  );
};

export default ActivityLog;