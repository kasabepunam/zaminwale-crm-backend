// backend/routes/customerRoutes.js
import express from "express";
import Customer from "../models/Customer.js"; // Customer model
const router = express.Router();

// ---------------------
// GET all customers
// ---------------------
router.get("/", async (req, res) => {
    try {
        const customers = await Customer.find().sort({ createdAt: -1 });
        res.status(200).json(customers);
    } catch (err) {
        console.error("Fetch Customers Error:", err);
        res.status(500).json({ error: "Failed to fetch customers" });
    }
});

// ---------------------
// POST new customer
// ---------------------
router.post("/", async (req, res) => {
    try {
        // Normalize array fields
        const normalizeArray = (field) => Array.isArray(field) ? field : JSON.parse(field || "[]");

        const newCustomer = new Customer({
            ...req.body,
            callingBy: normalizeArray(req.body.callingBy),
            siteVisitBy: normalizeArray(req.body.siteVisitBy),
            attendingBy: normalizeArray(req.body.attendingBy),
            closingBy: normalizeArray(req.body.closingBy),
            saleDeed: req.body.saleDeed || false,
            cancelBooking: req.body.cancelBooking || false,
        });

        await newCustomer.save();
        res.status(201).json(newCustomer);
    } catch (err) {
        console.error("Add Customer Error:", err);
        res.status(400).json({ error: err.message });
    }
});

// ---------------------
// PUT update customer
// ---------------------
router.put("/:id", async (req, res) => {
    try {
        const normalizeArray = (field) => Array.isArray(field) ? field : JSON.parse(field || "[]");

        const updatedData = {
            ...req.body,
            callingBy: normalizeArray(req.body.callingBy),
            siteVisitBy: normalizeArray(req.body.siteVisitBy),
            attendingBy: normalizeArray(req.body.attendingBy),
            closingBy: normalizeArray(req.body.closingBy),
            saleDeed: req.body.saleDeed || false,
            cancelBooking: req.body.cancelBooking || false,
        };

        const updatedCustomer = await Customer.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true, runValidators: true }
        );

        if (!updatedCustomer) return res.status(404).json({ error: "Customer not found" });
        res.status(200).json(updatedCustomer);
    } catch (err) {
        console.error("Update Customer Error:", err);
        res.status(400).json({ error: err.message });
    }
});

// ---------------------
// DELETE customer
// ---------------------
router.delete("/:id", async (req, res) => {
    try {
        const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
        if (!deletedCustomer) return res.status(404).json({ error: "Customer not found" });
        res.status(200).json({ message: "Customer deleted successfully" });
    } catch (err) {
        console.error("Delete Customer Error:", err);
        res.status(500).json({ error: "Failed to delete customer" });
    }
});

export default router;
