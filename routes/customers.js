const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");
const { isAdmin } = require("./auth");

// 🟢 Add Customer
router.post("/", isAdmin, async (req, res) => {
    try {
        const newCustomer = new Customer(req.body);
        await newCustomer.save();
        res.status(201).json(newCustomer);
    } catch (err) {
        console.error("Add Customer Error:", err);
        res.status(400).json({ error: err.message });
    }
});

// 🟢 Get All Customers
router.get("/", async (req, res) => {
    try {
        const customers = await Customer.find().sort({ createdAt: -1 });
        res.json(customers);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch customers" });
    }
});

// 🟢 Get Single Customer by ID
router.get("/:id", async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ error: "Customer not found" });
        res.json(customer);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch customer" });
    }
});

// 🟢 Update Customer (with edit history)
router.put("/:id", isAdmin, async (req, res) => {
    try {
        const existingCustomer = await Customer.findById(req.params.id);
        if (!existingCustomer) return res.status(404).json({ error: "Customer not found" });

        // Add old data to history before update
        if (!existingCustomer.editHistory) existingCustomer.editHistory = [];
        existingCustomer.editHistory.push({
            date: new Date(),
            previousData: { ...existingCustomer._doc },
        });

        // Update with new data
        Object.assign(existingCustomer, req.body);
        await existingCustomer.save();

        res.json({
            success: true,
            message: "Customer updated successfully with edit history",
            customer: existingCustomer,
        });
    } catch (err) {
        console.error("Update Error:", err);
        res.status(400).json({ error: err.message });
    }
});

// 🟢 Delete Customer
router.delete("/:id", isAdmin, async (req, res) => {
    try {
        const deleted = await Customer.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Customer not found" });
        res.json({ success: true, message: "Customer deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete customer" });
    }
});

// 🟢 Bulk Import (Customer + Installments)
router.post("/bulk", isAdmin, async (req, res) => {
    try {
        const customersData = req.body;
        if (!Array.isArray(customersData)) return res.status(400).json({ error: "Invalid format" });

        for (const row of customersData) {
            let customer = await Customer.findOne({ customerId: row.customerId });
            const totalAmt = parseFloat(row.totalAmount) || 0;
            const receivedAmt = parseFloat(row.receivedAmount) || 0;

            const newInstallment = {
                installmentNo: 1,
                installmentDate: row.date || "",
                installmentAmount: receivedAmt,
                receivedAmount: receivedAmt,
                balanceAmount: totalAmt - receivedAmt,
                bankName: row.bankName || "",
                paymentMode: row.paymentMode || "",
                chequeNo: row.chequeNo || "",
                chequeDate: row.chequeDate || "",
                remark: row.remark || "SaleDeed Pending",
                status: "Completed",
            };

            if (customer) {
                const last = customer.installments[customer.installments.length - 1];
                newInstallment.installmentNo = last ? last.installmentNo + 1 : 1;
                customer.installments.push(newInstallment);
                customer.receivedAmount = customer.installments.reduce(
                    (sum, i) => sum + (i.receivedAmount || 0),
                    0
                );
                customer.balanceAmount = (customer.totalAmount || totalAmt) - customer.receivedAmount;
                await customer.save();
            } else {
                const newCustomer = new Customer({
                    date: row.date || "",
                    customerId: row.customerId || "",
                    name: row.name || "",
                    address: row.address || "",
                    phone: row.phone || "",
                    aadhaarCard: row.aadhaarCard || "",
                    panCard: row.panCard || "",
                    bookingArea: parseFloat(row.bookingArea) || 0,
                    rate: parseFloat(row.rate) || 0,
                    totalAmount: totalAmt,
                    bookingAmount: parseFloat(row.bookingAmount) || 0,
                    receivedAmount: receivedAmt,
                    balanceAmount: totalAmt - receivedAmt,
                    location: row.location || "",
                    village: row.village || "",
                    mouCharge: parseFloat(row.mouCharge) || 0,
                    bankName: row.bankName || "",
                    paymentMode: row.paymentMode || "",
                    chequeNo: row.chequeNo || "",
                    chequeDate: row.chequeDate || "",
                    remark: row.remark || "",
                    installments: [newInstallment],
                });
                await newCustomer.save();
            }
        }

        res.json({ success: true, message: "Bulk data imported successfully" });
    } catch (err) {
        console.error("Bulk import error:", err);
        res.status(500).json({ error: "Bulk import failed", details: err.message });
    }
});

module.exports = router;
