const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const ChatMessage = require("./models/ChatMessage");
const Booking = require("./models/Booking");

const server = http.createServer(app);

// Initialize Socket.io server with CORS
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
});

// Pass `io` instance to Express routes
app.set("io", io);

// Real-time Socket.io Connection & Event Handling
io.on("connection", (socket) => {
  console.log("--> Socket Connected:", socket.id);

  socket.on("join_chat_room", async ({ bookingId }) => {
    socket.join(`booking_${bookingId}`);
    console.log(`Socket ${socket.id} joined booking_${bookingId}`);
    try {
      const history = await ChatMessage.find({ bookingId }).sort({ createdAt: 1 });
      socket.emit("chat_history", history);
    } catch (err) {
      console.error("Error retrieving chat history:", err.message);
    }
  });

  socket.on("send_chat_message", async (data) => {
    try {
      const newMsg = await ChatMessage.create({
        bookingId: data.bookingId,
        sender: data.senderId,
        senderRole: data.senderRole,
        message: data.message,
      });
      io.to(`booking_${data.bookingId}`).emit("receive_chat_message", newMsg);
    } catch (err) {
      console.error("Error saving chat message:", err.message);
    }
  });

  socket.on("join_admin_room", () => {
    socket.join("admin_room");
    console.log(`Admin socket ${socket.id} joined admin_room.`);
  });

  socket.on("sos_acknowledge", ({ bookingId, alertIndex }) => {
    io.to(`booking_${bookingId}`).emit("sos_acknowledged", { bookingId, alertIndex });
  });

  socket.on("disconnect", () => {
    console.log("--> Socket Disconnected:", socket.id);
  });
});

// Start recurring booking scheduler
const { startRecurringScheduler } = require("./services/recurringScheduler");
startRecurringScheduler();

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 ServiceHub Server listening on http://localhost:${PORT}`);
}).on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`⚠️ Port ${PORT} is already in use by another running Node process.`);
    console.log(`💡 The backend server is ALREADY RUNNING! You don't need to run 'node server.js' again.`);
  } else {
    console.error("Server error:", err);
  }
});

module.exports = app;
