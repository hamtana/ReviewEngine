import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import rateLimit from "express-rate-limit";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

// ✅ CORS
const allowedOrigins = [
  "http://localhost:5173", // dev frontend
  "http://localhost:3001", // container
  "https://review-engine.phillipsmusictech.co.nz", //domain
];
app.use(cors({ origin: allowedOrigins }));

// ✅ API routes (all start with /api)
app.post("/api/send-email", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"${name}" <${process.env.GMAIL_USER}>`,
      replyTo: email,
      to: process.env.GMAIL_USER,
      subject: `Review form Feedback from ${name}`,
      text: `Message:\n${message}\n\nFrom: ${name} <${email}>`,
    });
    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ message: "Failed to send email" });
  }
});

// ✅ Serve React static build
app.use(express.static(path.join(__dirname, "./dist")));

// ✅ Catch-all: frontend routes go to React
// Included a catch limiter
const catchAllLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes - how long a request should be remembered
  max: 100, // limit each IP to 100 requests per windowMs
});
app.get(/.*/, catchAllLimiter, (req, res) => {
  res.sendFile(path.join(__dirname, "./dist", "index.html"));
});

const PORT = 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
