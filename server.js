const express = require("express");
const path = require("path");
const socketio = require("socket.io");
const app = express();
const http = require("http");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users.js");
const formatMessage = require("./utils/messages.js");
const server = http.createServer(app);
const io = socketio(server);

require("dotenv").config();

// set static folder
app.use(express.static(path.join(__dirname, "public")));
const botName = "Chat Bot";
// run when client connects to server

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    // Welcome current user (single)
    socket.emit(
      "message",
      formatMessage(botName, `Welcome ${user.username} to the ${room} room`)
    );

    // Broadcast to everyone else when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Broadcast to everyone
  io.emit();

  // Listen for chatMessage
  socket.on("chat-message", (msg) => {

    const user = getCurrentUser(socket.id);

    io.emit("message", formatMessage(user.username, msg));
  });

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );

      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const PORT =
  process.env.NODE_ENV === "production" ? process.env.PORT || 3000 : 3000;

server.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
