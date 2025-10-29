// backend/models/Customer.js
import mongoose from "mongoose";

// ---------------- Installment Schema ----------------
const installmentSchema = new mongoose.Schema({
  installmentNo: { type: Number, required: true },
  installmentDate: { type: String, required: true },
  installmentAmount: { type: Number, required: true },
  receivedAmount: { type: Number, default: 0 },
  balanceAmount: { type: Number, default: 0 },
  bankName: { type: String, default: "" },
  paymentMode: { type: String, default: "" },
  chequeNo: { type: String, default: "" },
  chequeDate: { type: String, default: "" },
  remark: { type: String, default: "" },
  status: { type: String, default: "Pending" }
}, { _id: false });

// ---------------- Edit History / Activity Log ----------------
const editHistorySchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  previousData: Object,
}, { _id: false });

// ---------------- Customer Schema ----------------
const customerSchema = new mongoose.Schema(
  {
    date: { type: String, default: () => new Date().toISOString().split("T")[0] },
    customerId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, default: "" },
    alternatePhone: { type: String, default: "" },
    address: { type: String, default: "" },
    zipcode: { type: String, default: "" },
    panCard: { type: String, default: "" },
    aadharCard: { type: String, default: "" },
    bookingArea: { type: Number, default: 0 },
    plotArea: { type: Number, default: 0 },
    rate: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    bookingAmount: { type: Number, default: 0 },
    receivedAmount: { type: Number, default: 0 },
    balanceAmount: { type: Number, default: 0 },
    location: { type: String, default: "" },
    village: { type: String, default: "" },
    bankName: { type: String, default: "" },
    paymentMode: { type: String, default: "" },
    utrChequeNo: { type: String, required: true },
    dueDate: { type: String, default: "" },
    clearDate: { type: String, default: "" },
    chequeNo: { type: String, default: "" },
    chequeDate:{ type: String, default: "" },
    remark: { type: String, default: "" },
    attendingBy: { type: String, default: "" },

    // ---------------- Multi-select staff fields ----------------
    callingBy: {
      type: [String],
      default: [],
      set: val => Array.isArray(val) ? val : JSON.parse(val || "[]")
    },
    siteVisitBy: {
      type: [String],
      default: [],
      set: val => Array.isArray(val) ? val : JSON.parse(val || "[]")
    },
    attendingBy: {
      type: [String],
      default: [],
      set: val => Array.isArray(val) ? val : JSON.parse(val || "[]")
    },
    closingBy: {
      type: [String],
      default: [],
      set: val => Array.isArray(val) ? val : JSON.parse(val || "[]")
    },

    // ---------------- Installments & Edit History ----------------
    installments: { type: [installmentSchema], default: [] },
    editHistory: { type: [editHistorySchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);
