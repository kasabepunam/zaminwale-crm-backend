// backend/routes/dashboardRoutes.js
import express from "express";
import Customer from "../models/Customer.js";

const router = express.Router();

// ✅ Active Customers API
router.get("/active-customers", async (req, res) => {
  try {
    const activeCustomers = await Customer.find({
      $or: [{ status: "Active" }, { status: "Booking" }, { status: "Pending" }],
    });

    res.json({
      totalActive: activeCustomers.length,
      data: activeCustomers,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
