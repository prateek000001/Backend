import express from "express";
import { sendInterestEmail } from "../controllers/contact.controller.js";

const router = express.Router();

// POST /api/contact/send
router.post("/send", sendInterestEmail);

export default router;
