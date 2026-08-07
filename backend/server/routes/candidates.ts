import express from "express";
import { Candidate } from "../models/Candidate.ts";
import { authenticateToken, isAdmin } from "../middleware/auth.ts";
//import { mockDb } from "../config/mockDb.ts";

const router = express.Router();

// Get all candidates
router.get("/", async (req, res) => {
  try {
    // if (mockDb.isUsingMockDb) {
    //   return res.json(mockDb.candidates);
    // }
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ message: "Error fetching candidates" });
  }
});

// Add candidate (Admin only)
router.post("/", authenticateToken, isAdmin, async (req, res) => {
  try {
    // if (mockDb.isUsingMockDb) {
    //   const candidate = { _id: String(mockDb.candidates.length + 1), ...req.body, voteCount: 0 };
    //   mockDb.candidates.push(candidate);
    //   return res.status(201).json(candidate);
    // }
    const candidate = new Candidate(req.body);
    await candidate.save();
    res.status(201).json(candidate);
  } catch (err) {
    res.status(500).json({ message: "Error creating candidate" });
  }
});

// Delete candidate (Admin only)
router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    // if (mockDb.isUsingMockDb) {
    //   const index = mockDb.candidates.findIndex(c => c._id === req.params.id);
    //   if (index === -1) return res.status(404).json({ message: "Candidate not found" });
    //   mockDb.candidates.splice(index, 1);
    //   return res.json({ message: "Candidate deleted successfully" });
    // }
    const result = await Candidate.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: "Candidate not found" });
    res.json({ message: "Candidate deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting candidate" });
  }
});

export default router;
