import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
  user: { type: String, required: true },
  action: { type: String, required: true },
  customerId: { type: String },
  details: { type: String },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("ActivityLog", activityLogSchema);
