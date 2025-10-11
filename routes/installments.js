import express from "express";
import Customer from "../models/Customer.js";

const router = express.Router();

// ---------------- Add Installment ----------------
router.post("/", async (req, res) => {
    try {
        const data = req.body;
        console.log("Received Installment Data:", data);

        const customer = await Customer.findOne({ customerId: data.customerId });
        if (!customer) return res.status(404).json({ message: "Customer not found" });

        // Push installment into customer's installments array
        customer.installments.push({
            installmentNo: parseInt(data.installmentNo) || 0,
            installmentDate: data.installmentDate || "",
            installmentAmount: parseFloat(data.installmentAmount) || 0,
            receivedAmount: parseFloat(data.receivedAmount) || 0,
            balanceAmount: parseFloat(data.balanceAmount) || 0,
            bankName: data.bankName || "",
            chequeNo: data.chequeNo || "",
            clearDate: data.clearDate || "",
            remark: data.remark || "",
            status: data.status || "Pending",
            callingBy: data.callingBy || "",
            attendingBy: data.attendingBy || "",
            siteVisitBy: data.siteVisitBy || "",
            closingBy: data.closingBy || ""
        });

        await customer.save();

        res.status(201).json({ message: "Installment added successfully", installments: customer.installments });
    } catch (err) {
        console.error("Installment POST Error:", err);
        res.status(500).json({ message: err.message || "Server Error" });
    }
});

export default router;
