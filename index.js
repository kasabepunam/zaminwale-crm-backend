const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
import projectRoutes from "./routes/projects.js";
const customerRoutes = require("./routes/customerRoutes");
const app = express();
const PORT = 5001;

// Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/zaminwaleCRM", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Connection Failed:", err.message));

// Customer Schema
const customerSchema = new mongoose.Schema({
    customerId: String,
    name: String,
    phone: String,
    alternatePhone: String,
    email: String,
    panCard: String,
    aadharCard: String,
    utrNo: String,
    bookingType: String,
    location: String,
    address: String,
    district: String,
    taluka: String,
    bookingArea: Number,
    rate: Number,
    plotArea: Number,
    actualAmount: Number,
    receivedAmount: Number,
    balanceAmount: Number,
    bankName: String,
    paymentMode: String,
    transactionNo: String,
    sevenTwelveStatus: String,
});

const Customer = mongoose.model("Customer", customerSchema);

// Routes
app.post("/api/customers", async (req, res) => {
    try {
        const newCustomer = new Customer(req.body);
        const savedCustomer = await newCustomer.save();
        res.status(201).json(savedCustomer);
    } catch (err) {
        console.error("Error saving customer:", err);
        res.status(500).json({ error: "Failed to save customer" });
    }
});
// ✅ ACTIVE CUSTOMERS ENDPOINT
app.get("/api/customers/active", async (req, res) => {
  try {
    const activeCustomers = await Customer.find({ status: "Active Customer" });
    res.json(activeCustomers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/customers", async (req, res) => {
    try {
        const customers = await Customer.find().sort({ _id: -1 });
        res.json(customers);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch customers" });
    }
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
