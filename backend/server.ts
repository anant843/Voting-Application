import dotenv from "dotenv";
dotenv.config();

//console.log("MONGODB_URI:", process.env.MONGODB_URI);

import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

import { initializeDatabase } from "./server/config/db.ts";
import authRoutes from "./server/routes/auth.ts";
import candidateRoutes from "./server/routes/candidates.ts";
import voteRoutes from "./server/routes/vote.ts";
import rulesRoutes from "./server/routes/rules.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  await initializeDatabase();

  const app = express();
  const PORT = 3000;

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
      region: "India (All States)"
    });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      root: path.join(process.cwd(), 'frontend'),
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
