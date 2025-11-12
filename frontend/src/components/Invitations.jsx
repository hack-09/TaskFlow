import React, { useEffect, useState } from "react";
import axios from "axios";

const Invitations = () => {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const API_BASE = process.env.REACT_APP_ARI_CALL_URL;

  const fetchInvites = async () => {
    try {
      const res = await axios.get(`${API_BASE}/invite`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvites(res.data || []);
    } catch (err) {
      console.error("Failed to load invites:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  const respondToInvite = async (inviteId, action) => {
    try {
      await axios.post(
        `${API_BASE}/invites/${inviteId}/respond`,
        { action }, // 'accept' or 'decline'
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInvites(invites.filter((i) => i._id !== inviteId));
    } catch (err) {
      console.error("Failed to respond:", err);
    }
  };

  if (loading) return <div className="p-8">Loading invitations...</div>;

  return (
    <div className="p-8 bg-gray-100 dark:bg-gray-800 min-h-screen">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Workspace Invitations</h1>
      {invites.length === 0 ? (
        <p className="text-gray-500">No pending invitations.</p>
      ) : (
        <ul className="space-y-4">
          {invites.map((invite) => (
            <li
              key={invite._id}
              className="bg-white dark:bg-gray-700 shadow-md rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {invite.workspaceName}
                </p>
                <p className="text-sm text-gray-500">
                  Invited by {invite.invitedByName}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => respondToInvite(invite._id, "accept")}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                >
                  Accept
                </button>
                <button
                  onClick={() => respondToInvite(invite._id, "decline")}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  Decline
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Invitations;
