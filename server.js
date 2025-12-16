// backend/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import os from "os";

import customerRoutes from "./routes/customerRoutes.js";
import activityLogRoutes from "./routes/activityLogRoutes.js";

dotenv.config();
const app = express();

// ---------------- Middlewares ----------------
app.use(
  cors({
    origin: [
      "http://localhost:3000",           // local frontend
      "http://192.168.29.50:3000",      // LAN frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ---------------- MongoDB Connection ----------------
const MONGO_URI = process.env.MONGO_URI || "mongodb://192.168.29.50:27017/zaminwale_crm";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// ---------------- Routes ----------------
app.use("/api/customers", customerRoutes);
app.use("/api/activity-log", activityLogRoutes);

// ---------------- Serve Frontend ----------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, "../frontend/build");

app.use(express.static(frontendPath));

// Serve React frontend for any unmatched route
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"), (err) => {
    if (err) {
      console.error("🔥 Frontend Serve Error:", err);
      res.status(500).send("Frontend not found");
    }
  });
});

// ---------------- Error Handler ----------------
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// ---------------- Start Server ----------------
const PORT = process.env.PORT || 5001;

app.listen(PORT, "0.0.0.0", () => {
  const networkInterfaces = os.networkInterfaces();
  let localIP = "localhost";

  for (const ifaceList of Object.values(networkInterfaces)) {
    for (const alias of ifaceList) {
      if (alias.family === "IPv4" && !alias.internal) {
        localIP = alias.address;
        break;
      }
    }
    if (localIP !== "localhost") break;
  }

  console.log("🚀 Server running at:");
  console.log(`➡️ Local:   http://localhost:${PORT}`);
  console.log(`➡️ Network: http://${localIP}:${PORT}`);
});
