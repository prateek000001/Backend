import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { transporter } from "../utils/mail.js";
// Verify Token Middleware
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json("Token expired or invalid!");

    req.user = user;
    next();
  });
};

// Sign Up
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  console.log("sign up req body",req.body);
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json("New User Created Successfully");
  } catch (error) {
    next(error);
  }
};

// Sign In
export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials!!"));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, { expiresIn: "5m" });
    const { password: pass, ...rest } = validUser._doc;

    res
      .cookie("access_token", token, { httpOnly: true, maxAge: 5 * 60 * 1000 })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// Google OAuth
export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "5m" });
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true, maxAge: 5 * 60 * 1000 })
        .status(200)
        .json(rest);
    } else {
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatePassword, 10);
      const newUser = new User({
        username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "5m" });
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true, maxAge: 5 * 60 * 1000 })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

// Sign Out
export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json({
      success: true,
      message: "User has been logged out!",
    });
  } catch (error) {
    next(error);
  }
};

// Forgot Password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    user.resetPasswordToken = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 min expiry
    await user.save();

    // Send email
    await transporter.sendMail({
      from: `"EstateStack" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Your OTP for Password Reset",
      text: `Hello ${user.username},\n\nYour OTP is: ${otp}\nIt will expire in 10 minutes.`,
    });

    res.json({ message: "OTP generated. Check server Gmail for OTP." });
  } catch (err) {
    next(err);
  }
};
// Verify OTP
export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (
      user.resetPasswordToken !== otp ||
      user.resetPasswordExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    next(err);
  }
};
// Reset Password
export const resetPassword = async (req, res, next) => {
 try {
    const { email, password, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (
      user.resetPasswordToken !== otp ||
      user.resetPasswordExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    next(err);
  }
};
