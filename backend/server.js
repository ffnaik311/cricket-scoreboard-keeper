const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for local college testing
    methods: ["GET", "POST"]
  }
});

// A simple in-memory store for the match state
let currentMatchState = null;

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // When a new user connects, send them the current state immediately
  if (currentMatchState) {
    socket.emit("matchStateUpdated", currentMatchState);
  }

  // Admin sends a fully updated state object when anything changes
  socket.on("syncState", (state) => {
    currentMatchState = state;
    // Broadcast to EVERYONE else
    socket.broadcast.emit("matchStateUpdated", currentMatchState);
  });

  // Admin can clear the match
  socket.on("clearMatch", () => {
    currentMatchState = null;
    io.emit("matchStateUpdated", null);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Socket.io server running at http://0.0.0.0:${PORT}`);
  console.log(`Connect your phone to your laptop's Local IP address!`);
});
