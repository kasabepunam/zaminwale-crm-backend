// routes/reports.js
const express = require("express");
const Customer = require("../models/Customer");
const router = express.Router();

// Active Customers
router.get("/active", async (req, res) => {
    const customers = await Customer.find({ status: "active" });
    res.json(customers);
});

// Cancelled Customers
router.get("/cancelled", async (req, res) => {
    const customers = await Customer.find({ status: "cancelled" });
    res.json(customers);
});

// Refund Details
router.get("/refunds", async (req, res) => {
    const customers = await Customer.find({ refundAmount: { $gt: 0 } });
    res.json(customers);
});

module.exports = router;
