const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Connect Database (only if not in test mode)
if (process.env.NODE_ENV !== "test") {
  connectDB();
}

// Mount routers
app.use("/api/auth", require("./routes/auth"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/services", require("./routes/services"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/geocode", require("./routes/geocode"));
app.use("/api/wallet", require("./routes/wallet"));
app.use("/api/referrals", require("./routes/referrals"));
app.use("/api/disputes", require("./routes/disputes"));
app.use("/api/recurring", require("./routes/recurring"));
app.use("/api/photos", require("./routes/photos"));
app.use("/api/providers/availability", require("./routes/availability"));
app.use("/api/providers", require("./routes/providers"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/user", require("./routes/user"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/ai", require("./routes/ai"));
app.use("/uploads", express.static("public/uploads"));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

module.exports = app;
