require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const movieRoutes = require("./routes/movies");
const cors = require("cors");

const app = express();

// Use CORS middleware
app.use(cors());

// Use environment variables
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

// MongoDB connection
(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
})();

// Middleware
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to the Movie API");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
