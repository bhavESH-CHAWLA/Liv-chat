import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    contacts: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ],
    incomingContactRequests: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ],
    outgoingContactRequests: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ],
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorCode: String,
    twoFactorCodeExpires: Date,
    tokenVersion: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true } // createdAt & updatedAt
);

userSchema.index({ emailVerificationToken: 1 }, { sparse: true });
userSchema.index({ passwordResetToken: 1 }, { sparse: true });
userSchema.index({ twoFactorCode: 1 }, { sparse: true });

const User = mongoose.model("User", userSchema);

export default User;