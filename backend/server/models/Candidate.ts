import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  party: { type: String, required: true },
  symbol: { type: String, required: true },
  image: { type: String },
  description: { type: String, required: true },
  voteCount: { type: Number, default: 0 },
});

export const Candidate = mongoose.model("Candidate", candidateSchema);
