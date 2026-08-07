import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    title: "Election Rules & Regulations - India",
    rules: [
      "Every citizen of India aged 18 or above is eligible to vote.",
      "One person, one vote. Multiple voting is a punishable offense.",
      "Voters must have a valid Voter ID (EPIC card) or other government-approved ID.",
      "The model code of conduct must be followed by all candidates and parties.",
      "Campaigning must stop 48 hours before the conclusion of polling.",
      "Bribery or intimidation of voters is strictly prohibited.",
      "Electronic Voting Machines (EVMs) with VVPAT are used for transparency.",
    ]
  });
});

export default router;
