import mongoose from "mongoose";

// 🏦 Installment Schema
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

// 🧾 Customer Schema
const customerSchema = new mongoose.Schema({
    date: { type: String, required: true },
    customerId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    address: { type: String, default: "" },
    phone: { type: String, default: "" },
    aadhaarCard: { type: String, default: "" },
    panCard: { type: String, default: "" },
    bookingArea: { type: Number, default: 0 },
    rate: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    bookingAmount: { type: Number, default: 0 },
    receivedAmount: { type: Number, default: 0 },
    balanceAmount: { type: Number, default: 0 },
    stampDutyCharges: { type: Number, default: 0 }, // ✅ New field
    location: { type: String, default: "" },
    village: { type: String, default: "" },
    mouCharge: { type: Number, default: 0 },
    bankName: { type: String, default: "" },
    paymentMode: { type: String, default: "" },
    chequeNo: { type: String, default: "" },
    chequeDate: { type: String, default: "" },
    remark: { type: String, default: "" }, // SaleDeed / Cancel Booking
    installments: { type: [installmentSchema], default: [] },
    status: { type: String, default: "Pending" } // Overall customer status
}, { timestamps: true });

export default mongoose.model("Customer", customerSchema);
