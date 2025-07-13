import mongoose, { model, Schema } from "mongoose";

const employerSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },

  employerName: {
    type: String,
    required: true,
  },
  legalName: {
    type: String,
    required: true,
  },
  sector: {
    type: [String],
    default: [],
  },
  category: {
    type: String,
    required: true,
  },
  contactPerson: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"], 
    default: "pending", 
  },

  deleted: {
    type: Boolean,
    default: false,
  },
});

const employeModel = model("employers", employerSchema);

export default employeModel;
