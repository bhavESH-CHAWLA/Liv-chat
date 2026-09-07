import crypto from "crypto";
import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

export const generateToken = (user, res) => {
  const { JWT_SECRET } = ENV;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  const token = jwt.sign(
    { userId: user._id.toString(), tokenVersion: user.tokenVersion ?? 0 },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: ENV.NODE_ENV === "development" ? false : true,
  });

  return token;
};

export const createRandomToken = () => crypto.randomBytes(32).toString("hex");

export const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const createSixDigitCode = () => crypto.randomInt(100000, 1000000).toString();

// http://localhost
// https://dsmakmk.com