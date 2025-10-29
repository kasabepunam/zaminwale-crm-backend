// backend/routes/customerRoutes.js
import express from "express";
import Customer from "../models/Customer.js";
import ActivityLog from "../models/ActivityLog.js";

const router = express.Router();

/* ----------------------- 🟢 GET all customers ----------------------- */
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.status(200).json(customers);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

/* ----------------------- 🟢 GET single customer by ID ----------------------- */
router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.status(200).json(customer);
  } catch (err) {
    console.error("Get One Error:", err);
    res.status(500).json({ error: "Failed to fetch customer" });
  }
});

/* ----------------------- Helper: Ensure arrays ----------------------- */
const ensureArrayField = (field) => {
  if (Array.isArray(field)) return field;
  try {
    return JSON.parse(field || "[]");
  } catch {
    return [];
  }
};

/* ----------------------- 🟢 POST add new customer ----------------------- */
router.post("/", async (req, res) => {
  try {
    const { user = "Admin", ...data } = req.body;

    // Ensure multi-select fields are arrays
    data.callingBy = ensureArrayField(data.callingBy);
    data.siteVisitBy = ensureArrayField(data.siteVisitBy);
    data.attendingBy = ensureArrayField(data.attendingBy);
    data.closingBy = ensureArrayField(data.closingBy);

    const newCustomer = new Customer(data);
    await newCustomer.save();

    await ActivityLog.create({
      user,
      action: "Added Customer",
      customerId: newCustomer.customerId,
      details: `Name: ${newCustomer.name}, Location: ${newCustomer.location}, Village: ${newCustomer.village}`,
    });

    res.status(201).json(newCustomer);
  } catch (err) {
    console.error("Add Error:", err);
    res.status(400).json({ error: err.message });
  }
});

/* ----------------------- 🟡 PUT update customer by ID ----------------------- */
router.put("/:id", async (req, res) => {
  try {
    const { user = "Admin", ...updatedData } = req.body;

    // Ensure multi-select fields are arrays
    updatedData.callingBy = ensureArrayField(updatedData.callingBy);
    updatedData.siteVisitBy = ensureArrayField(updatedData.siteVisitBy);
    updatedData.attendingBy = ensureArrayField(updatedData.attendingBy);
    updatedData.closingBy = ensureArrayField(updatedData.closingBy);

    const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedCustomer) return res.status(404).json({ message: "Customer not found" });

    await ActivityLog.create({
      user,
      action: "Updated Customer",
      customerId: updatedCustomer.customerId,
      details: `Updated ${updatedCustomer.name}, Location: ${updatedCustomer.location}, Village: ${updatedCustomer.village}`,
    });

    res.status(200).json({
      message: "Customer updated successfully",
      data: updatedCustomer,
    });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/* ----------------------- 🔴 DELETE customer by ID ----------------------- */
router.delete("/:id", async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) return res.status(404).json({ message: "Customer not found" });

    await ActivityLog.create({
      user: req.body.user || "Admin",
      action: "Deleted Customer",
      customerId: deletedCustomer.customerId,
      details: `Deleted ${deletedCustomer.name}, Location: ${deletedCustomer.location}, Village: ${deletedCustomer.village}`,
    });

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
