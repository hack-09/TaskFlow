const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  // When user joins a workspace
  socket.on("joinWorkspace", (workspaceId) => {
    socket.join(workspaceId);
    console.log(`User ${socket.id} joined workspace: ${workspaceId}`);
  });

  // When user leaves a workspace
  socket.on("leaveWorkspace", (workspaceId) => {
    socket.leave(workspaceId);
    console.log(`User ${socket.id} left workspace: ${workspaceId}`);
  });

  // When a new task is created in a workspace
  socket.on("workspaceTaskCreated", (workspaceId, task) => {
    io.to(workspaceId).emit("workspaceTaskCreated", task);
  });

  socket.on("workspaceTaskUpdated", (workspaceId, updatedTask) => {
    io.to(workspaceId).emit("workspaceTaskUpdated", updatedTask);
  });

  socket.on("workspaceTaskDeleted", (workspaceId, taskId) => {
    io.to(workspaceId).emit("workspaceTaskDeleted", taskId);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

module.exports = io;
