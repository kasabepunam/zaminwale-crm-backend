// routes/importRoutes.js
import express from "express";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";
import Customer from "../models/Customer.js";

const router = express.Router();

// ---------------------
// Multer Config
// ---------------------
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // ensure this folder exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage });

// ---------------------
// Import CSV API
// ---------------------
router.post("/installments", upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "CSV file is required" });

    const results = [];

    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (data) => {
            // Map CSV fields to Customer + Installments
            results.push({
                customerId: data.customerId,
                name: data.name,
                phone: data.phone,
                installments: [
                    {
                        installmentNo: Number(data.installmentNo),
                        installmentAmount: Number(data.installmentAmount),
                        receivedAmount: Number(data.receivedAmount),
                        balanceAmount: Number(data.balanceAmount),
                        paymentDate: data.paymentDate,
                        nextDueDate: data.nextDueDate,
                        bankName: data.bankName || "",
                        chequeNo: data.chequeNo || "",
                        chequeDate: data.chequeDate || "",
                        clearDate: data.clearDate || "",
                        remark: data.remark || ""
                    }
                ]
            });
        })
        .on("end", async () => {
            try {
                for (const cust of results) {
                    // Check if customer exists
                    let existing = await Customer.findOne({ customerId: cust.customerId });
                    if (existing) {
                        // Add new installment to existing customer
                        existing.installments = existing.installments.concat(cust.installments);
                        await existing.save();
                    } else {
                        // Create new customer
                        const newCust = new Customer(cust);
                        await newCust.save();
                    }
                }

                fs.unlinkSync(req.file.path); // delete temp CSV
                res.status(200).json({ message: "CSV imported successfully" });
            } catch (err) {
                console.error(err);
                res.status(500).json({ message: "Server error", error: err.message });
            }
        });
});

export default router;
