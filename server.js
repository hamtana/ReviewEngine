import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({origin: "http://localhost:5173"})); 
app.use(express.json());

app.post("/send-email", async (req, res) => {
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});