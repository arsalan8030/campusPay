import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  course: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ["STUDENT", "TEACHER"], required: true },
});

export default mongoose.model("User", userSchema);
