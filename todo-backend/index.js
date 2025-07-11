const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");  // ✅ Needed for safe path joining

const authMiddleware = require("./middleware/auth");
const todoRoutes = require("./routes/todoRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

// ✅ Serve uploaded files publicly before authMiddleware
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test Route
app.get("/", (req, res) => {
  res.send("API is working 🚀");
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB connection failed", err));

// Public Auth Routes
app.use("/api/auth", authRoutes);

app.use("/api/todos", todoRoutes); // 🔓 No auth for testing

app.use("/api/todos", require("./routes/todoRoutes"));

app.use("/api/todos", todoRoutes);

