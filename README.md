# Task Management App

A **Task Management Application** with real-time updates, allowing users to **create, update, and manage tasks efficiently**. The app supports **JWT-based authentication**, **task filtering**, and **real-time updates** using WebSockets.

---

## 🚀 Features

✅ **User Authentication** - Secure login and registration with JWT authentication.  
✅ **Task Management** - Create, update, delete, and mark tasks as completed.  
✅ **Real-Time Updates** - Tasks update instantly using WebSockets (Socket.io).  
✅ **Filtering & Sorting** - Organize tasks by priority, deadline, or completion status.  
✅ **Responsive UI** - Designed for both desktop and mobile users.  
✅ **Secure API** - Built with Express.js, Node.js, and MongoDB for efficient backend processing.  

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Axios, TailwindCSS
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT (JSON Web Token)
- **Real-Time Updates**: Socket.io
- **Database**: MongoDB with Mongoose ORM

---

## ⚡ Installation & Setup

### 1️⃣ Clone the Repository
```sh
 git clone https://github.com/yourusername/task-management-app.git
 cd task-management-app
```

### 2️⃣ Install Dependencies
```sh
# Backend Setup
cd server
npm install

# Frontend Setup
cd ../client
npm install
```

### 3️⃣ Configure Environment Variables
Create a `.env` file inside the **server** directory with:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4️⃣ Start the Application
```sh
# Start the backend server
cd server
npm run dev

# Start the frontend
cd ../client
npm start
```

The app will be available at: **`http://localhost:3000`**

---

## 🔥 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login

### Task Management
- `GET /api/tasks` - Fetch all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

---

## 🌐 Real-Time Updates with WebSockets

To enable real-time task updates, we use **Socket.io**.

### 📡 Backend Socket.io Implementation (server.js)
```js
io.on("connection", (socket) => {
    console.log("User connected");
    
    socket.on("taskUpdated", (updatedTask) => {
        io.emit("updateTask", updatedTask);
    });
});
```

### 🎯 Frontend Socket.io Implementation (React)
```js
useEffect(() => {
    socket.on("updateTask", (updatedTask) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task._id === updatedTask._id ? updatedTask : task
            )
        );
    });
    return () => socket.off("updateTask");
}, []);
```

---

## 🤝 Contribution

1. **Fork the Repository**
2. **Create a New Branch** (`feature-name`)
3. **Commit Changes** (`git commit -m 'Added new feature'`)
4. **Push to GitHub** (`git push origin feature-name`)
5. **Create a Pull Request** 🎉

---

## 📜 License

This project is licensed under the **MIT License**. Feel free to use and modify it as per your needs.

---

## 💡 Acknowledgments

Special thanks to the **open-source community** for inspiring this project!

---

### ⭐ Star the repository if you find this useful!

📌 **GitHub Repo**: [Your GitHub Link](https://github.com/yourusername/task-management-app)

