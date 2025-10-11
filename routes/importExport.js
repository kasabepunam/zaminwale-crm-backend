import express from "express";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";
import { Parser } from "json2csv";
import Customer from "../models/Customer.js"; // ✅ path adjust केला

const router = express.Router();

// Multer setup (uploads folder मध्ये file temporary save होईल)
const upload = multer({ dest: "uploads/" });

// ---------------------
// Import CSV → MongoDB
// ---------------------
router.post("/import", upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "CSV file required" });

    const results = [];
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", async () => {
            try {
                const customers = await Customer.insertMany(results);
                fs.unlinkSync(req.file.path); // temp file delete
                res.json({ message: "CSV Imported Successfully", customers });
            } catch (err) {
                console.error("❌ Import Error:", err);
                res.status(500).json({ error: "Server error" });
            }
        });
});

// ---------------------
// Export MongoDB → CSV
// ---------------------
router.get("/export", async (req, res) => {
    try {
        const customers = await Customer.find();
        const fields = [
            "date","customerId","name","phone","alternatePhone","address",
            "panCard","aadhaarCard","guntha","rate","totalAmount","bookingAmount",
            "mouCharge","installmentAmount","installmentNo","receivedAmount",
            "balanceAmount","stampDutyCharges","location","village",
            "bankName","chequeNo","chequeDate","clearDate","remark","saleDeed","cancelBooking"
        ];

        const json2csv = new Parser({ fields });
        const csvData = json2csv.parse(customers);

        res.header("Content-Type", "text/csv");
        res.attachment("customers.csv");
        return res.send(csvData);
    } catch (err) {
        console.error("❌ Export Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
