const express = require("express");
const router = express.Router();
const axios = require("axios");
const Task = require("../models/Task");
const { verifyFirebaseToken } = require("../middleware/auth");

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:5001";

// GET all tasks
router.get("/", verifyFirebaseToken, async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create task
router.post("/", verifyFirebaseToken, async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /tasks/match — trigger ML-based volunteer matching
router.post("/match", verifyFirebaseToken, async (req, res) => {
  const { taskId } = req.body;
  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    // Call the Python ML microservice for matching
    const mlResponse = await axios.post(`${ML_SERVICE_URL}/ml/match`, {
      taskLocation: task.location,
      volunteers: [
        { id: "v1", name: "Aman Singh", lat: 28.61, lng: 77.23 },
        { id: "v2", name: "Priya Sharma", lat: 28.62, lng: 77.21 },
        { id: "v3", name: "Rahul Verma", lat: 28.60, lng: 77.25 },
      ],
    });

    // Update task status
    task.status = "In Transit";
    task.assignedVolunteer = mlResponse.data.bestMatch?.name || "Auto-Assigned";
    await task.save();

    res.json({ task, match: mlResponse.data });
  } catch (err) {
    console.error("Match error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
