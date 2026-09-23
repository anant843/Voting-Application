import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import { initializeDatabase } from "./server/config/db.ts";
import authRoutes from "./server/routes/auth.ts";
import candidateRoutes from "./server/routes/candidates.ts";
import voteRoutes from "./server/routes/vote.ts";
import rulesRoutes from "./server/routes/rules.ts";

async function startServer() {
  try {
    await initializeDatabase();

    const app = express();
    const PORT = Number(process.env.PORT) || 3000;

    app.use(cors());
    app.use(express.json());

    app.use("/api/auth", authRoutes);
    app.use("/api/candidates", candidateRoutes);
    app.use("/api/vote", voteRoutes);
    app.use("/api/rules", rulesRoutes);

    app.get("/api/stats", (req, res) => {
      res.json({
        totalVoters: 1250,
        activeElection: "General Election 2026",
        serverStatus: "Online",
        region: "India (All States)",
      });
    });

    app.get("/", (req, res) => {
      res.json({
        success: true,
        message: "Voting Application Backend Running",
      });
    });

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
}

startServer();
