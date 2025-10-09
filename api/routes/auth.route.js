import express from 'express';
import { forgotPassword, google, resetPassword, signin, signOut, signup, verifyOTP } from '../controllers/auth.controller.js';
import { verifyToken } from '../controllers/auth.controller.js';

const router = express.Router();

// Authentication routes
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.post("/signout", signOut);
router.post('/forgot-password', forgotPassword); // send reset link
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);
// Protected route to get current user
router.get("/profile", verifyToken, (req, res) => {
  res.json({ success: true, user: req.user });
});

export default router;
