import express from "express";
import cors from "cors";
import sequelize from "./config/connection";
import userRouter from "./routes/User";
import groupRouter from "./routes/Group";
import favoriteRouter from "./routes/Favorites";
import userGroupRouter from "./routes/UserGroup";
import visitedRouter from "./routes/Visited";
import yelpRouter from "./routes/YelpFetch";
import inviteRouter from "./routes/Invitations";
import http from 'http';
import { Server } from 'socket.io';

import "dotenv/config";

const app: express.Application = express();
const PORT: number = Number(process.env.PORT) | 3001;
const API_URL: string[] = ["https://bar-spot-capstone.github.io", "http://localhost:4173", "http://localhost:5173"];
const options: cors.CorsOptions = {
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "X-Access-Token",
    "Authorization",
    "XMLHttpRequest"
  ],
  credentials: true,
  origin: API_URL,
};

//Middleware
app.use(express.json());
app.use(cors(options));

//Routers
app.use("/user", userRouter);
app.use("/group", groupRouter);
app.use("/visit", visitedRouter);
app.use("/favorite", favoriteRouter);
app.use("/party", userGroupRouter);
app.use("/yelp", yelpRouter);
app.use("/invite", inviteRouter);

// Create HTTP server
const server: any = http.createServer(app);

// Attach Socket.IO server to the HTTP server
const io: Server = new Server(server, {
  cors: {
    origin: API_URL,
    methods: ["GET", "POST"]
  }
});

// Socket.IO event handlers
io.on('connection', (socket: any) => {
  console.log('Client connected');

  // Handle joining a group and adding user to room
  socket.on('join_group', (groupId: number) => {
    socket.join(groupId); // Add user to room corresponding to group ID
  });

  // Handle sending message to specific group
  socket.on('send_message_to_group', (data: any) => {
    const { groupId } = data;
    const { message } = data;
    io.to(groupId).emit('group_message', { message }); // Emit message to room corresponding to group ID
  });

  // Handle leaving a group and removing user from room
  socket.on('leave_group', (groupId: number) => {
    socket.leave(groupId); // Remove user from room corresponding to group ID
  });

  socket.on('destroy_group', (groupId: any) => {
    // Remove all users from the group room
    io.of('/').in(groupId).allSockets().then((sockets) => {
      sockets.forEach((socketId: any) => {
        io.sockets.sockets.get(socketId)?.leave(groupId);
      });
    }).catch((error: any) => {
      console.error('Error removing users from group room:', error);
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

sequelize.sync()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error: any) => {
    console.error("Error synchronizing database:", error);
  });