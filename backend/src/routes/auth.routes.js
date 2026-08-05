import express from "express";
import {
  signup,
  login,
  verifyLoginTwoFactor,
  logout,
  updateProfile,
  changePassword,
  deleteAccount,
  requestPasswordReset,
  resetPassword,
  resendVerificationEmail,
  verifyEmail,
  enableTwoFactor,
  verifyTwoFactor,
  disableTwoFactor,
} from "../controllers/auth.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

router.use(arcjetProtection);

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-login-2fa", verifyLoginTwoFactor);
router.post("/logout", logout);

router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

router.post("/verify-email", verifyEmail);
router.post("/resend-verification", protectRoute, resendVerificationEmail);

router.put("/update-profile", protectRoute, updateProfile);
router.put("/change-password", protectRoute, changePassword);

router.post("/enable-2fa", protectRoute, enableTwoFactor);
router.post("/verify-2fa", protectRoute, verifyTwoFactor);
router.post("/disable-2fa", protectRoute, disableTwoFactor);

router.delete("/delete-account", protectRoute, deleteAccount);

router.get("/check", protectRoute, (req, res) => res.status(200).json(req.user));

export default router;