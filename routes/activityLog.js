import express from "express";
import ActivityLog from "../models/ActivityLog.js";

const router = express.Router();

/* ----------------------- 🟢 GET all activity logs ----------------------- */
router.get("/", async (req, res) => {
  try {
    const { user, customerId } = req.query;

    // Build filter dynamically
    const filter = {};
    if (user) filter.user = user;
    if (customerId) filter.customerId = customerId;

    const logs = await ActivityLog.find(filter).sort({ timestamp: -1 });
    res.status(200).json(logs);
  } catch (err) {
    console.error("Fetch Logs Error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ----------------------- 🟢 POST add a new log ----------------------- */
router.post("/", async (req, res) => {
  try {
    const log = new ActivityLog(req.body);
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    console.error("Add Log Error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
