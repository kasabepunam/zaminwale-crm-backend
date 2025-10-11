const express = require("express");
const router = express.Router();
const Agent = require("../models/Agent");

// Add New Agent
router.post("/", async (req, res) => {
    try {
        const newAgent = new Agent(req.body);
        await newAgent.save();
        res.status(201).json(newAgent);
    } catch (error) {
        res.status(500).json({ message: "Error adding agent", error });
    }
});

// Get All Agents
router.get("/", async (req, res) => {
    try {
        const agents = await Agent.find().sort({ createdAt: -1 });
        res.json(agents);
    } catch (error) {
        res.status(500).json({ message: "Error fetching agents", error });
    }
});

// Update Agent
router.put("/:id", async (req, res) => {
    try {
        const updatedAgent = await Agent.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedAgent);
    } catch (error) {
        res.status(500).json({ message: "Error updating agent", error });
    }
});

// Delete Agent
router.delete("/:id", async (req, res) => {
    try {
        await Agent.findByIdAndDelete(req.params.id);
        res.json({ message: "Agent deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting agent", error });
    }
});

module.exports = router;
