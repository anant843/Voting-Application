import express from "express";
import { User } from "../models/User.ts";
import { Candidate } from "../models/Candidate.ts";
import { authenticateToken } from "../middleware/auth.ts";
//import { mockDb } from "../config/mockDb.ts";

const router = express.Router();

// Cast a vote
router.post("/:candidateId", authenticateToken, async (req: any, res) => {
  try {
    // if (mockDb.isUsingMockDb) {
    //   const user = mockDb.users.find(u => u._id === req.user.id);
    //   if (!user) return res.status(404).json({ message: "User not found" });
    //   if (!user.isVerified) return res.status(403).json({ message: "Please verify your email before voting." });
    //   if (user.hasVoted) return res.status(400).json({ message: "You have already cast your vote." });

    //   const candidate = mockDb.candidates.find(c => c._id === req.params.candidateId);
    //   if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    //   candidate.voteCount += 1;
    //   user.hasVoted = true;
    //   user.votedFor = candidate._id;

    //   return res.json({ message: "Vote cast successfully!", candidate });
    // }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.isVerified) return res.status(403).json({ message: "Please verify your email before voting." });
    if (user.hasVoted) return res.status(400).json({ message: "You have already cast your vote." });

    const candidate = await Candidate.findById(req.params.candidateId);
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    candidate.voteCount += 1;
    await candidate.save();

    user.hasVoted = true;
    user.votedFor = candidate._id as any;
    await user.save();

    res.json({ message: "Vote cast successfully!", candidate });
  } catch (err) {
    res.status(500).json({ message: "Error casting vote" });
  }
});

export default router;
