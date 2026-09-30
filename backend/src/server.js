import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/messages.routes.js";
import { connectDB, isDbConnected } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";

const __dirname = path.resolve();

const PORT = process.env.PORT || ENV.PORT || 3000;

const allowedOrigins = new Set([
  ENV.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://localhost:3000",
  "http://localhost:3001",
]);

app.use(express.json({ limit: "5mb" }));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const isAllowedLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
      const isAllowedVercelPreview = /^https:\/\/.*\.vercel\.app$/.test(origin);

      if (allowedOrigins.has(origin) || isAllowedLocalhost || isAllowedVercelPreview) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// make ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

const seedTestAccounts = async () => {
  if (ENV.NODE_ENV === "production" || !isDbConnected()) return;

  try {
    const existing = await User.findOne({ email: "tester1@example.com" }).maxTimeMS(3000);
    if (existing) return;

    const password = await bcrypt.hash("password123", 10);
    const users = [
      { fullName: "Tester One", email: "tester1@example.com", password },
      { fullName: "Tester Two", email: "tester2@example.com", password },
      { fullName: "Alice Demo", email: "alice@example.com", password },
      { fullName: "Bob Demo", email: "bob@example.com", password },
    ];
    await User.insertMany(users);
    console.log("Seeded test accounts for development.");
  } catch (error) {
    console.warn("Could not seed test accounts:", error.message);
  }
};

const startServer = async () => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });

  try {
    await connectDB();
    await seedTestAccounts();
  } catch (err) {
    console.error("Non-fatal startup error:", err.message);
  }
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
});
