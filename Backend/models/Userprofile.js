import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  fullname:{
    type: String,
    required: true,
  },

  skills: {
    type: [String], 
    required: true,
  },
  experience: {
    type: Number, 
    required: true,
  },
  education: {
    type: String, 
    required: true,
  },
  phone: {
    type: String, 
    required: true,
  },
});

const userProfileModel = mongoose.model("profiles", userProfileSchema);
export default userProfileModel;
