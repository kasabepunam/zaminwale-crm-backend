import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    status: { type: String, enum: ["Ongoing", "Completed"], default: "Ongoing" },
    startDate: { type: Date },
    endDate: { type: Date },
});

export default mongoose.model("Project", projectSchema);
