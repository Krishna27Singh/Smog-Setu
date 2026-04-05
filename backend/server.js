require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const inventoryRoutes = require("./routes/inventory");
const taskRoutes = require("./routes/tasks");
const scannerRoutes = require("./routes/scanner");
const ngoRoutes = require("./routes/ngos");

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors({ 
  origin: 'http://localhost:8080', 
  credentials: true 
}));
app.use(express.json({ limit: "20mb" }));

// Routes
app.use("/api/inventory", inventoryRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/scanner", scannerRoutes);
app.use("/api/ngos", ngoRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/smogsetu")
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
