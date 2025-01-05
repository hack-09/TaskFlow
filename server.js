const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
require("./routes/scheduler")

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const authMiddleware = require("./middleware/authMiddleware");
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: `Welcome, user ID: ${req.user}` });
});

const authRoute = require("./routes/auth");
app.use("/api/auth", authRoute);

const taskRoutes = require("./routes/tasks");
app.use("/tasks", taskRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});