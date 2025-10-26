import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import app from "./app";
import prisma from "./prisma"; 
dotenv.config();

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

const onlineUsers = new Map<number, string>();

io.on("connection", (socket) => {
  socket.on("register", (userId: number) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send_message", async (payload) => {
    const { senderId, receiverId, text } = payload;

    const message = await prisma.message.create({
      data: { senderId, receiverId, text },
    });

    const receiverSocket = onlineUsers.get(receiverId);
    if (receiverSocket) io.to(receiverSocket).emit("message", message);

    socket.emit("message", message);
  });

  socket.on("disconnect", () => {
    for (const [userId, id] of onlineUsers.entries()) {
      if (id === socket.id) onlineUsers.delete(userId);
    }
  });
});

server.listen(PORT, () => console.log(`server go on  ${PORT}`));
