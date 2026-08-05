import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/messages.routes.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";

const __dirname = path.resolve();

const PORT = process.env.PORT || ENV.PORT || 3001;

app.use(express.json({ limit: "5mb" })); // req.body
// Allow CORS for the configured client URL in production, but be permissive for local development
if (ENV.NODE_ENV === "production") {
  app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
} else {
  app.use(
    cors({
      origin: (origin, callback) => {
        // allow requests with no origin (e.g. mobile apps, curl)
        if (!origin) return callback(null, true);
        // allow localhost dev ports
        if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return callback(null, true);
        // fallback to configured client URL
        return callback(null, origin === ENV.CLIENT_URL);
      },
      credentials: true,
    })
  );
}
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
  if (ENV.NODE_ENV === "production") return;

  const existing = await User.findOne({ email: "tester1@example.com" });
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
};

server.listen(PORT, async () => {
  console.log("Server running on port: " + PORT);
  await connectDB();
  await seedTestAccounts();
});