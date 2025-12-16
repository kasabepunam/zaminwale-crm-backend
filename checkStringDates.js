import mongoose from "mongoose";
import Customer from "./models/Customer.js";

await mongoose.connect("mongodb://127.0.0.1:27017/zaminwaleCRM");

const customers = await Customer.find();

let found = 0;

customers.forEach(cust => {
  for (let key in cust.toObject()) {
    if (typeof cust[key] === "string" && cust[key].match(/\d{2}.\d{2}.\d{4}/)) {
      console.log("🔹", key, "=>", cust[key]);
      found++;
    }
  }
});

console.log("✅ Found string dates:", found);
process.exit();
