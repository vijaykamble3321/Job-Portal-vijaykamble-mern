import { model, Schema } from "mongoose";

const userSchema = new Schema({
  fname: String,
  lname: String,
  email: String,
  password: String,
  mobile: String,
  role: { type: String, enum: ["user", "employer", "admin"], required: true },
});

const userModel = model("users", userSchema);
export default userModel;
