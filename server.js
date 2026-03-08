import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import rateLimit from "express-rate-limit";
import validator from "validator";
import e from "express";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

// ✅ CORS
const allowedOrigins = [
  process.env.DEV_FRONTEND, // dev frontend
  process.env.CONTAINER_DEPLOYMENT_URI, // container
  process.env.DOMAIN, //domain
];
app.use(cors({ origin: allowedOrigins }));

// ✅ Catch-all: frontend routes go to React
// Included a catch limiter
const catchAllLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes - how long a request should be remembered
  max: 100, // limit each IP to 100 requests per windowMs
});

// Define the transporter here, rather than on every request.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// ✅ API routes (all start with /api)
app.post("/api/send-email", catchAllLimiter, async (req, res) => {
  const { name, email, message } = req.body;

  // Sanitize name input/
  const safeName = name.replace(/[\r\n]/g, " ").trim();

  // Check if the message contains a long message.
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }

  // Check if the message contains a long name
  if (name.length > 100 || message.length > 2000) {
    return res.status(400).json({ message: "Input too long" });
  }

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    await transporter.sendMail({
      from: `"${safeName}" <${process.env.GMAIL_USER}>`,
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

app.get(/.*/, catchAllLimiter, (req, res) => {
  res.sendFile(path.join(__dirname, "./dist", "index.html"));
});

const PORT = process.env.PORT;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
