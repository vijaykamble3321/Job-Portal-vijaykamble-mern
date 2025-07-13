import mongoose, { model, Schema } from "mongoose";

const ApplicationSchema = new Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Jobs", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  coverLetter: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "Shortlisted", "Rejected"],
    default: "Pending",
  },
  appliedAt: { type: Date, default: Date.now },
  resumeFilename: { type: String } 
});

const ApplicationModel = model("applications", ApplicationSchema);
export default ApplicationModel;
