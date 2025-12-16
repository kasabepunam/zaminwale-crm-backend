// updateOldDates.js
import mongoose from "mongoose";

// ----------------- MongoDB connection -----------------
const MONGO_URI = "mongodb://127.0.0.1:27017/zaminwaleCRM";
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected ✅"))
    .catch(err => console.error("MongoDB connection error:", err));

// ----------------- Schema -----------------
const customerSchema = new mongoose.Schema({
    customerId: String,
    date: String
}, { collection: "customers" });

const Customer = mongoose.model("Customer", customerSchema);

// ----------------- Helper function to format dates -----------------
function formatDate(dateStr) {
    if (!dateStr) return null;

    const parts = dateStr.split(/[.\-/]/); // Split by ., -, /
    if (parts.length !== 3) return dateStr;

    let [day, month, year] = parts;

    // Handle mm.dd.yyyy mistakenly stored
    if (parseInt(day) > 12 && parseInt(month) <= 12) {
        [day, month] = [month, day];
    }

    if (day.length === 1) day = "0" + day;
    if (month.length === 1) month = "0" + month;

    return `${day}.${month}.${year}`;
}

// ----------------- Main update function -----------------
async function updateAllDates() {
    try {
        const customers = await Customer.find({});
        let updatedCount = 0;

        for (const customer of customers) {
            const oldDate = customer.date;
            const newDate = formatDate(oldDate);

            if (newDate !== oldDate) {
                await Customer.updateOne(
                    { _id: customer._id },
                    { $set: { date: newDate } }
                );
                updatedCount++;
                console.log(`Updated ${customer.customerId}: ${oldDate} → ${newDate}`);
            }
        }

        console.log(`\n✅ Total records updated: ${updatedCount}`);
    } catch (err) {
        console.error("Error updating dates:", err);
    } finally {
        mongoose.disconnect();
    }
}

// ----------------- Run the script -----------------
updateAllDates();
