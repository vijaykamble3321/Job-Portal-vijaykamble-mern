import mongoose, { model, Schema } from "mongoose";

const JobSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  salary: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  experience: { type: String, required: true },
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employers",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const jobModel = model("Jobs", JobSchema);
export default jobModel;