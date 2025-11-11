const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require('cors');
const http = require("http");
const { Server } = require("socket.io");
require("./utils/taskReminderScheduler");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app); // Create HTTP server for Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
    credentials: true, // Allow cookies if needed
  })
);

// ─────────────────────────────────────────────
// Connect to MongoDB
// ─────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

  // ─────────────────────────────────────────────
// Socket.IO Setup
// ─────────────────────────────────────────────
const userSocketMap = {}; // userId -> socketId

io.on("connection", (socket) => {
  console.log(`🟢 User connected: ${socket.id}`);

  socket.on("register", (userId) => {
    userSocketMap[userId] = socket.id;
    console.log(`User ${userId} registered to socket ${socket.id}`);
  });

  socket.on("disconnect", () => {
    console.log(`🔴 User disconnected: ${socket.id}`);
    for (const [userId, sId] of Object.entries(userSocketMap)) {
      if (sId === socket.id) delete userSocketMap[userId];
    }
  });

  socket.on("taskCreated", (task) => socket.broadcast.emit("newTask", task));
  socket.on("taskUpdated", (task) => socket.broadcast.emit("taskUpdated", task));
  socket.on("taskDeleted", (id) => socket.broadcast.emit("taskDeleted", id));
});

// Export function for controllers to emit events
const emitToUser = (userId, event, data) => {
  const socketId = userSocketMap[userId];
  if (socketId) io.to(socketId).emit(event, data);
};

app.set("io", io);
app.set("emitToUser", emitToUser);

// ─────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────
const authMiddleware = require("./middleware/authMiddleware");
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: `Welcome, user ID: ${req.user}` });
});

const authRoute = require("./routes/auth");
app.use("/api/auth", authRoute);

const taskRoutes = require("./routes/tasks");
app.use("/tasks", taskRoutes);

const workspaceRoutes = require("./routes/workspaceRoutes");
app.use("/workspaces", workspaceRoutes);

const activityRoutes = require("./routes/activityRoutes");
app.use("/activity", activityRoutes);

const notificationRoutes = require("./routes/notificationRoutes");
app.use("/notifications", notificationRoutes);

// ─────────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────────
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});