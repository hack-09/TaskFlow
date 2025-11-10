import React, { useState } from "react";
import { joinWorkspace } from "../../service/workspaceService";
import { useWorkspace } from "../../context/WorkspaceContext";
import { useNavigate } from "react-router-dom";

const JoinWorkspace = () => {
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const { switchWorkspace } = useWorkspace();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await joinWorkspace(inviteCode);
      switchWorkspace(res._id, res.name);
      navigate("/dashboard");
    } catch (err) {
      console.error("Join workspace failed:", err);
      setError("Invalid or expired invite code.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-800">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Join Workspace</h2>
        <input
          type="text"
          placeholder="Enter Invite Code"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
          required
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded"
        >
          Join
        </button>
      </form>
    </div>
  );
};

export default JoinWorkspace;
