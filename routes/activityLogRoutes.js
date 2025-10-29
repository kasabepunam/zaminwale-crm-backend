// backend/routes/activityLogRoutes.js
import express from "express";
import ActivityLog from "../models/ActivityLog.js";

const router = express.Router();

// GET - fetch all activity logs
router.get("/", async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    console.error("Error fetching activity logs:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST - add new log
router.post("/", async (req, res) => {
  try {
    const { user, action, details } = req.body;
    const log = new ActivityLog({ user, action, details });
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    console.error("Error saving log:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
