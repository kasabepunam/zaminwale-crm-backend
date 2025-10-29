import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Routes
import customerRoutes from "./routes/customerRoutes.js";
import activityLogRoutes from "./routes/activityLogRoutes.js"; // ✅ Activity Log route

dotenv.config();
const app = express();

// ---------------- CORS ----------------
app.use(cors({ origin: "*" }));
app.use(express.json());

// ---------------- MongoDB Atlas Connection ----------------
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ---------------- Routes ----------------
app.use("/api/customers", customerRoutes);
app.use("/api/activity-log", activityLogRoutes); // ✅ Activity Log API

// ---------------- Start Server ----------------
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
