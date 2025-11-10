import React, { useState } from "react";
import { createWorkspace } from "../../service/workspaceService";
import { useNavigate } from "react-router-dom";
import { useWorkspace } from "../../context/WorkspaceContext";

const CreateWorkspace = () => {
  const [form, setForm] = useState({ name: "", description: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { switchWorkspace } = useWorkspace();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await createWorkspace(form);
      switchWorkspace(res._id, res.name);
      navigate(`/workspace/${res._id}`);
    } catch (err) {
      console.error("Create workspace failed:", err);
      setError("Failed to create workspace. Try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-800">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Create Workspace</h2>
        <input
          type="text"
          name="name"
          placeholder="Workspace Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Short description (optional)"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateWorkspace;
