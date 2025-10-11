import express from "express";
import Customer from "../models/Customer.js";

const router = express.Router();

// GET all customers
router.get("/", async (req, res) => {
    try {
        const customers = await Customer.find().sort({ createdAt: -1 });
        res.json(customers);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch customers" });
    }
});

// POST add customer
router.post("/", async (req, res) => {
    try {
        const newCustomer = new Customer(req.body);
        await newCustomer.save();
        res.status(201).json(newCustomer);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
