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
        const {
            date,
            customerId,
            name,
            phone,
            alternatePhone,
            address,
            panCard,
            aadhaarCard,
            guntha,
            rate,
            totalAmount,
            bookingAmount,
            mouCharge,
            installmentAmount,
            installmentNo,
            receivedAmount,
            balanceAmount,
            stampDutyCharges,
            location,
            village,
            bankName,
            chequeNo,
            chequeDate,
            clearDate,
            remark,
            saleDeed,
            cancelBooking,
            employeeId,
            paymentDate,
            nextDueDate,
        } = req.body;

        const newCustomer = new Customer({
            date,
            customerId,
            name,
            phone,
            alternatePhone,
            address,
            panCard,
            aadhaarCard,
            guntha,
            rate,
            totalAmount,
            bookingAmount,
            mouCharge,
            installmentAmount,
            installmentNo,
            receivedAmount,
            balanceAmount,
            stampDutyCharges,
            location,
            village,
            bankName,
            chequeNo,
            chequeDate,
            clearDate,
            remark,
            saleDeed: saleDeed || false,
            cancelBooking: cancelBooking || false,
            employeeId,
            paymentDate,
            nextDueDate,
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
        const updatedCustomer = await Customer.findByIdAndUpdate(
            req.params.id,
            req.body,
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
