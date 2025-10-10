import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import contactRoute from "./routes/contact.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ CORS Configuration (important for Render)
app.use(
  cors({
    origin: "https://frontend-a6z3.onrender.com", // your live frontend URL
    credentials: true, // allow cookies to be sent
  })
);

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ API Routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);
app.use("/api/contact", contactRoute);

// ✅ Root test route
app.get("/", (req, res) => {
  res.send("🌍 Backend API is live and connected successfully!");
});

// ✅ Error handling middleware (must be at end)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
