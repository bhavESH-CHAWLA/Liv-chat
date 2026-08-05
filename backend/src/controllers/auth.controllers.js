import { sendWelcomeEmail, sendEmailVerification, sendPasswordResetEmail, sendTwoFactorCodeEmail } from "../emails/emailHandlers.js";
import { generateToken, createRandomToken, hashToken, createSixDigitCode } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { ENV } from "../lib/env.js";
import cloudinary from "../lib/cloudinary.js";
import mongoose from "mongoose";

const createAndSendEmailVerification = async (user) => {
  const verificationToken = createRandomToken();
  user.emailVerificationToken = hashToken(verificationToken);
  user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
  await user.save();

  await sendEmailVerification(user.email, user.fullName, ENV.CLIENT_URL, verificationToken);
};

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    // If the DB is not connected, fail fast with a helpful message
    if (mongoose.connection.readyState !== 1) {
      console.warn("Database not connected - rejecting signup");
      return res.status(503).json({ message: "Database unavailable. Start MongoDB or set MONGO_URI and restart the server." });
    }
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // check if emailis valid: regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    await createAndSendEmailVerification(savedUser);

    generateToken(savedUser._id, res);

    res.status(201).json({
      _id: savedUser._id,
      fullName: savedUser.fullName,
      email: savedUser.email,
      profilePic: savedUser.profilePic,
      isEmailVerified: savedUser.isEmailVerified,
    });

    try {
      await sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL);
    } catch (error) {
      console.error("Failed to send welcome email:", error);
    }
  } catch (error) {
    console.log("Error in signup controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password, twoFactorCode } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    if (user.twoFactorEnabled) {
      if (!twoFactorCode) {
        const code = createSixDigitCode();
        user.twoFactorCode = hashToken(code);
        user.twoFactorCodeExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        await sendTwoFactorCodeEmail(user.email, user.fullName, code);

        return res.status(202).json({
          message: "Two-factor authentication code sent to your email",
          twoFactorRequired: true,
        });
      }

      const hashedCode = hashToken(twoFactorCode);
      if (!user.twoFactorCode || user.twoFactorCode !== hashedCode || user.twoFactorCodeExpires < Date.now()) {
        return res.status(400).json({ message: "Invalid or expired two-factor code" });
      }

      user.twoFactorCode = undefined;
      user.twoFactorCodeExpires = undefined;
      await user.save();
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      isEmailVerified: user.isEmailVerified,
      twoFactorEnabled: user.twoFactorEnabled,
    });
  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyLoginTwoFactor = async (req, res) => {
  const { email, twoFactorCode } = req.body;

  if (!email || !twoFactorCode) {
    return res.status(400).json({ message: "Email and two-factor code are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !user.twoFactorEnabled) return res.status(400).json({ message: "Invalid two-factor login attempt" });

    const hashedCode = hashToken(twoFactorCode);
    if (!user.twoFactorCode || user.twoFactorCode !== hashedCode || user.twoFactorCodeExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired two-factor code" });
    }

    user.twoFactorCode = undefined;
    user.twoFactorCodeExpires = undefined;
    await user.save();

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      isEmailVerified: user.isEmailVerified,
      twoFactorEnabled: user.twoFactorEnabled,
    });
  } catch (error) {
    console.error("Error in verifyLoginTwoFactor controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (_, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "Logged out successfully" });
};

export const resendVerificationEmail = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isEmailVerified) return res.status(400).json({ message: "Email already verified" });

    await createAndSendEmailVerification(user);

    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    console.error("Error resending verification email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Verification token is required" });
  }

  try {
    const hashedToken = hashToken(token);
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired email verification token" });

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (user) {
      const resetToken = createRandomToken();
      user.passwordResetToken = hashToken(resetToken);
      user.passwordResetExpires = Date.now() + 60 * 60 * 1000;
      await user.save();

      await sendPasswordResetEmail(user.email, user.fullName, ENV.CLIENT_URL, resetToken);
    }

    res.status(200).json({ message: "If the email is registered, a password reset link has been sent." });
  } catch (error) {
    console.error("Error requesting password reset:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  const { token, password, confirmPassword } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: "Token and password are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const hashedToken = hashToken(token);
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired password reset token" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    generateToken(user._id, res);

    res.status(200).json({
      message: "Password reset successful",
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      isEmailVerified: user.isEmailVerified,
      twoFactorEnabled: user.twoFactorEnabled,
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Current and new password are required" });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: "New password must be at least 6 characters" });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Current password is incorrect" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const enableTwoFactor = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.twoFactorEnabled) {
      return res.status(400).json({ message: "Two-factor authentication is already enabled" });
    }

    user.twoFactorEnabled = true;
    await user.save();

    res.status(200).json({ message: "Two-factor authentication enabled", twoFactorEnabled: true });
  } catch (error) {
    console.error("Error enabling two-factor authentication:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyTwoFactor = async (req, res) => {
  const { twoFactorCode } = req.body;
  if (!twoFactorCode) return res.status(400).json({ message: "Two-factor code is required" });

  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.twoFactorEnabled) return res.status(400).json({ message: "Two-factor authentication is not enabled" });

    const hashedCode = hashToken(twoFactorCode);
    if (!user.twoFactorCode || user.twoFactorCode !== hashedCode || user.twoFactorCodeExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired two-factor code" });
    }

    user.twoFactorCode = undefined;
    user.twoFactorCodeExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Two-factor code verified" });
  } catch (error) {
    console.error("Error verifying two-factor code:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const disableTwoFactor = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.twoFactorEnabled) {
      return res.status(400).json({ message: "Two-factor authentication is not enabled" });
    }

    user.twoFactorEnabled = false;
    user.twoFactorCode = undefined;
    user.twoFactorCodeExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Two-factor authentication disabled", twoFactorEnabled: false });
  } catch (error) {
    console.error("Error disabling two-factor authentication:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, email, profilePic } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (fullName) user.fullName = fullName;
    if (email && email !== user.email) {
      user.email = email;
      user.isEmailVerified = false;
      await createAndSendEmailVerification(user);
    }

    if (profilePic) {
      let imageUrl = profilePic;
      if (ENV.CLOUDINARY_CLOUD_NAME && ENV.CLOUDINARY_API_KEY && ENV.CLOUDINARY_API_SECRET) {
        try {
          const uploadResponse = await cloudinary.uploader.upload(profilePic);
          imageUrl = uploadResponse.secure_url;
        } catch (uploadError) {
          console.warn("Cloudinary upload failed, storing the provided value instead.", uploadError.message);
        }
      }
      user.profilePic = imageUrl;
    }

    await user.save();

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      isEmailVerified: user.isEmailVerified,
      twoFactorEnabled: user.twoFactorEnabled,
    });
  } catch (error) {
    console.log("Error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};