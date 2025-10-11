const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    role: { type: String, default: "Sales Executive" },
    status: { type: String, default: "Active" }, // Active / Inactive
    notes: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Agent", agentSchema);
