const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Connect MongoDB
connectDB();

// Routes
app.use("/api/auth", require("./routes/auth"));      
app.use("/api/services", require("./routes/services")); 
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/admin", require("./routes/admin"));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
