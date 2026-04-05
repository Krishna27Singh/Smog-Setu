const express = require("express");
const router = express.Router();
const multer = require("multer");
const axios = require("axios");
const Task = require("../models/Task");
const { verifyFirebaseToken } = require("../middleware/auth");

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:5001";
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// POST /scanner/upload — receive image, forward to Gemini OCR, create task
router.post("/upload", verifyFirebaseToken, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const imageBase64 = req.file.buffer.toString("base64");

    // Forward to Python ML service for Gemini OCR
    const mlResponse = await axios.post(`${ML_SERVICE_URL}/ml/ocr`, {
      image: imageBase64,
      mimeType: req.file.mimetype,
    });

    const parsed = mlResponse.data;

    // Create a task from the parsed data
    const task = new Task({
      title: `Survey: ${parsed.location || "Unknown Location"}`,
      requiredResource: parsed.needs || "General Supplies",
      quantity: parsed.quantity || 1,
      location: parsed.location || "Unknown",
      urgency: parsed.urgency || "Medium",
      status: "Unassigned",
    });
    await task.save();

    res.status(201).json({ parsed, task });
  } catch (err) {
    console.error("Scanner upload error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
