const express = require("express");
const path = require("path");
const socketio = require("socket.io");
const app = express();
cosnt formatMessage = require('./utils/messages')
const http = require("http");
const formatMessage = require("./utils/messages");
const server = http.createServer(app);
const io = socketio(server);

// set static folder
app.use(express.static(path.join(__dirname, "public")));
const botName = 'Chat Bot'
// run when client connects to server

io.on("connection", (socket) => {
  // Welcome current user (single)
  socket.emit("message", formatMessage(botName, "Welcome to ChatRoom"));

  // Broadcast to everyone else when a user connects
  socket.broadcast.emit("message",formatMessage(botName, "A user has joined the chat"));

  // Broadcast to everyone
  io.emit();

  socket.on("disconnect", () => {
    io.emit("message",formatMessage(botName, "A user has left the chat"));
  });

  // Listen for chatMessage
  socket.on("chat-message", (msg) => {
    io.emit("message", formatMessage("USER", msg));
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
