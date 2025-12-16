import mongoose from "mongoose";
import Customer from "./models/Customer.js";

const MONGO_URL = "mongodb://127.0.0.1:27017/zaminwaleCRM";

// ✅ Connect DB
await mongoose.connect(MONGO_URL);
console.log("✅ MongoDB Connected");

// ✅ Convert dd.mm.yyyy → Date
function parseDDMMYYYY(dateStr) {
  if (!dateStr) return null;

  if (dateStr instanceof Date) return dateStr;

  // support "11-04-2025" also
  const clean = dateStr.replace(/-/g, ".");
  const parts = clean.split(".");

  if (parts.length !== 3) return null;

  const [dd, mm, yyyy] = parts;
  const iso = `${yyyy}-${mm}-${dd}`;

  const d = new Date(iso);
  return isNaN(d) ? null : d;
}

// ✅ Migration Function
async function migrateDates() {
  const customers = await Customer.find();
  let updated = 0;

  for (const cust of customers) {

    const dateFields = ["date", "dueDate", "clearDate", "chequeDate"];
    let changed = false;

    dateFields.forEach(field => {
      if (typeof cust[field] === "string" && cust[field]) {
        const parsed = parseDDMMYYYY(cust[field]);
        if (parsed) {
          cust[field] = parsed;
          changed = true;
        }
      }
    });

    if (changed) {
      await cust.save();
      updated++;
    }
  }

  console.log(`✅ Migration Completed | Updated: ${updated}`);
  await mongoose.disconnect();
}

migrateDates();
