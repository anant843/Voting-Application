import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  voterId: { type: String, unique: true },
  aadhaarNumber: { type: String, required: true, unique: true },
  digiLockerId: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  hasVoted: { type: Boolean, default: false },
  votedFor: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate" },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  verificationOtp: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model("User", userSchema);
