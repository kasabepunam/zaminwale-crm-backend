import mongoose from "mongoose";

const installmentSchema = new mongoose.Schema({
    installmentNo: { type: Number, default: 1 },
    installmentDate: { type: String },
    installmentAmount: { type: Number, default: 0 },
    receivedAmount: { type: Number, default: 0 },
    balanceAmount: { type: Number, default: 0 },
    bankName: String,
    chequeNo: String,
    clearDate: String,
    remark: String,
    nextDueDate: String,
    status: { type: String, enum: ["Paid", "Pending"], default: "Pending" },
    callingBy: String,
    attendingBy: String,
    siteVisitBy: String,
    closingBy: String
}, { _id: false });

export default installmentSchema;
