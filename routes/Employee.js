const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "employee"], default: "employee" }
});

module.exports = mongoose.model("Employee", employeeSchema);
