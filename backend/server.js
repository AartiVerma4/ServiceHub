const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const ChatMessage = require("./models/ChatMessage");
const Booking = require("./models/Booking");

dotenv.config();
const app = express();
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

// Middlewares
app.use(express.json());
app.use(cors());

// Connect Database
connectDB();

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));
app.use("/api/services", require("./routes/services"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/providers", require("./routes/providers"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/admin", require("./routes/admin"));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

// Real-time Socket.io Connection & Event Handling
io.on("connection", (socket) => {
  console.log("--> Socket Connected:", socket.id);

  // 1. Join room for a specific booking (for chat & tracking updates)
  socket.on("join_booking_room", (bookingId) => {
    socket.join(`booking_${bookingId}`);
    console.log(`Socket ${socket.id} joined room booking_${bookingId}`);
  });

  // 2. Real-time Live Map Provider Location Updates
  socket.on("update_provider_location", async ({ bookingId, lat, lng }) => {
    try {
      // Broadcast location change to all subscribers in the booking room
      io.to(`booking_${bookingId}`).emit("provider_location_changed", {
        bookingId,
        lat,
        lng,
        updatedAt: new Date(),
      });

      // Update location in database asynchronously
      await Booking.findByIdAndUpdate(bookingId, {
        providerLocation: { lat, lng },
      });
    } catch (err) {
      console.error("Location update error:", err);
    }
  });

  // 3. Real-time In-App Chat Messaging
  socket.on("send_chat_message", async ({ bookingId, senderId, senderRole, message }) => {
    try {
      const chatDoc = await ChatMessage.create({
        bookingId,
        sender: senderId,
        senderRole,
        message,
      });

      const populatedChat = await ChatMessage.findById(chatDoc._id).populate("sender", "name avatar");

      // Broadcast message to everyone in the booking room
      io.to(`booking_${bookingId}`).emit("receive_chat_message", populatedChat);
    } catch (err) {
      console.error("Chat message error:", err);
    }
  });

  // 4. Fetch Chat History
  socket.on("fetch_chat_history", async (bookingId) => {
    try {
      const messages = await ChatMessage.find({ bookingId })
        .populate("sender", "name avatar")
        .sort({ createdAt: 1 });
      socket.emit("chat_history_loaded", messages);
    } catch (err) {
      console.error("Chat history fetch error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("--> Socket Disconnected:", socket.id);
  });
});

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
