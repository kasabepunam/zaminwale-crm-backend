const Customer = require("../models/Customer");

// Add Customer
exports.addCustomer = async (req, res) => {
    try {
        const customer = new Customer(req.body);
        await customer.save();
        res.status(201).json(customer);
    } catch (error) {
        console.error("Add Customer Error:", error);
        res.status(500).json({ error: "Failed to add customer" });
    }
};

// Get All Customers
exports.getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find().sort({ createdAt: -1 });
        res.status(200).json(customers);
    } catch (error) {
        console.error("Fetch Customers Error:", error);
        res.status(500).json({ error: "Failed to fetch customers" });
    }
};

// Get Single Customer
exports.getCustomer = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ error: "Customer not found" });
        res.status(200).json(customer);
    } catch (error) {
        console.error("Fetch Customer Error:", error);
        res.status(500).json({ error: "Failed to fetch customer" });
    }
};

// Update Customer
exports.updateCustomer = async (req, res) => {
    try {
        const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ error: "Customer not found" });
        res.status(200).json(updated);
    } catch (error) {
        console.error("Update Customer Error:", error);
        res.status(500).json({ error: "Failed to update customer" });
    }
};

// Delete Customer
exports.deleteCustomer = async (req, res) => {
    try {
        const deleted = await Customer.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Customer not found" });
        res.status(200).json({ message: "Customer deleted successfully" });
    } catch (error) {
        console.error("Delete Customer Error:", error);
        res.status(500).json({ error: "Failed to delete customer" });
    }
};
