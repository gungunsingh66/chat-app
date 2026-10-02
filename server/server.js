import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";

import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import groupRouter from "./routes/groupRoutes.js";

import { Server } from "socket.io";

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO server
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Store online users
export const userSocketMap = {}; // { userId: socketId }

// Socket.IO connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  console.log("User Connected:", userId);

  // Store online user
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // Emit online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Join group
  socket.on("joinGroup", (groupId) => {
    socket.join(`group:${groupId}`);

    console.log(
      `User ${userId} joined group ${groupId}`
    );
  });

  // Leave group
  socket.on("leaveGroup", (groupId) => {
    socket.leave(`group:${groupId}`);

    console.log(
      `User ${userId} left group ${groupId}`
    );
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("User Disconnected:", userId);

    if (
      userId &&
      userSocketMap[userId] === socket.id
    ) {
      delete userSocketMap[userId];
    }

    // Update online users
    io.emit(
      "getOnlineUsers",
      Object.keys(userSocketMap)
    );
  });
});

// Middleware
app.use(express.json({ limit: "4mb" }));

app.use(cors());

// Routes
app.use("/api/status", (req, res) => {
  res.send("Server is live");
});

app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);
app.use("/api/groups", groupRouter);

// Connect to MongoDB
await connectDB();

// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("Server is running on PORT:", PORT);
});
