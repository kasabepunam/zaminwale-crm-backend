// routes/import.js
import express from "express";
import multer from "multer";
import XLSX from "xlsx";
import Customer from "../models/Customer.js"; // create this model file or export from server if you prefer

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

        const workbook = XLSX.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        // Basic mapping: ensure keys match your Customer schema fields e.g. customerId, name, phone, totalAmount, bookingAmount, receivedAmount, date
        for (const item of data) {
            // Normalize keys (example safe-mapping)
            const doc = {
                date: item.date || item.Date || new Date().toISOString().split("T")[0],
                customerId: item.customerId || item["Customer ID"] || item["CustomerId"] || item["ID"],
                name: item.name || item.Name,
                address: item.address || item.Address || "",
                phone: item.phone || item.Phone || "",
                receivedAmount: Number(item.received || item.Received || item.receivedAmount || 0) || 0,
                totalAmount: Number(item.total || item.Total || item.totalAmount || 0) || 0,
                bookingAmount: Number(item.bookingAmount || item.Booking || 0) || 0,
                balanceAmount: Number(item.balance || item.Balance || 0) || 0,
                // add other mappings as needed
            };

            if (!doc.customerId) {
                // skip rows without ID (or you may generate)
                continue;
            }

            await Customer.updateOne(
                { customerId: doc.customerId },
                { $set: doc },
                { upsert: true }
            );
        }

        res.json({ success: true, message: "Customers imported successfully" });
    } catch (err) {
        console.error("Import error:", err);
        res.status(500).json({ success: false, message: "Import failed" });
    }
});

export default router;
