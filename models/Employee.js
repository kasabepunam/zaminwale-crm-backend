const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: { type: String, enum: ["admin", "employee"], default: "employee" }
});

module.exports = mongoose.model("Employee", EmployeeSchema);
