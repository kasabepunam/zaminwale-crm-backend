import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import customerRoutes from "./routes/customerRoutes.js";

dotenv.config();
const app = express();

// ---------------- CORS ----------------
app.use(cors({ origin: "*" })); // कोणत्याही frontend port वरून request allowed
app.use(express.json());

// ---------------- MongoDB ----------------
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/zaminwale_crm";
mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error(err));

// ---------------- Routes ----------------
app.use("/api/customers", customerRoutes);

// ---------------- Start Server ----------------
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

