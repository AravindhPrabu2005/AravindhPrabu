require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Resend } = require("resend");
const path = require("path");
const fs = require("fs");
const serverless = require("serverless-http");

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());

// Your personal Gmail for receiving notifications
const NOTIFICATION_EMAIL = "aravindhprabu2005@gmail.com";

// Log environment variables status (without exposing values)
console.log("=== Environment Variables Check ===");
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "✓ Set" : "✗ Missing");
console.log("EMAIL_USER:", process.env.EMAIL_USER ? "✓ Set" : "✗ Missing");
console.log("RESEND_API_KEY:", process.env.RESEND_API_KEY ? "✓ Set" : "✗ Missing");
console.log("NOTIFICATION_EMAIL:", NOTIFICATION_EMAIL);
console.log("PORT:", PORT);
console.log("===================================");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✓ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("✗ MongoDB Connection Error:");
    console.error("Error Message:", err.message);
    console.error("Error Code:", err.code);
    console.error("Full Error:", err);
  });

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
});

const Contact = mongoose.model("Contact", contactSchema);

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Test Resend on startup
(async () => {
  if (process.env.RESEND_API_KEY) {
    console.log("✓ Resend initialized successfully");
  } else {
    console.error("✗ RESEND_API_KEY not found in environment variables");
  }
})();

app.get("/test", (req, res) => {
  res.send("I am here da!");
});

app.post("/api/contact", async (req, res) => {
  console.log("\n=== Contact Form Submission ===");
  console.log("Timestamp:", new Date().toISOString());
  console.log("Request Body:", req.body);

  try {
    const { name, email, message } = req.body;

    // Save to database
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    console.log("✓ Contact saved to MongoDB");

    console.log("Attempting to send email via Resend...");
    console.log("From:", process.env.EMAIL_USER);
    console.log("To:", NOTIFICATION_EMAIL);

    // Send email using Resend to your personal Gmail
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_USER,
      to: [NOTIFICATION_EMAIL], // Changed to your personal Gmail
      subject: `New Contact Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message}</p>`,
    });

    if (error) {
      console.error("✗ Resend Error:", error);
      throw error;
    }

    console.log("✓ Email sent successfully via Resend!");
    console.log("Message ID:", data.id);

    res.status(201).json({ success: true, message: "Message stored and email sent!" });
  } catch (error) {
    console.error("\n✗ ERROR in /api/contact:");
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    console.error("Error Stack:", error.stack);

    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message,
    });
  }
});

app.get("/api/messages", async (req, res) => {
  try {
    const messages = await Contact.find();
    console.log(`✓ Fetched ${messages.length} messages from database`);
    res.json(messages);
  } catch (error) {
    console.error("✗ Error fetching messages:", error.message);
    console.error("Full Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const resumeEmailSchema = new mongoose.Schema({
  email: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "approved", "declined"], default: "pending" },
});

const ResumeEmail = mongoose.model("ResumeEmail", resumeEmailSchema);

app.post("/api/send-download-link", async (req, res) => {
  console.log("\n=== Resume Request ===");
  console.log("Timestamp:", new Date().toISOString());
  console.log("Request Body:", req.body);

  const { email } = req.body;
  if (!email) {
    console.log("✗ No email provided");
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const newEmailEntry = new ResumeEmail({ email });
    await newEmailEntry.save();
    console.log("✓ Resume request saved to MongoDB");

    console.log("Attempting to send resume request email via Resend...");

    // Send email using Resend to your personal Gmail
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_USER,
      to: [NOTIFICATION_EMAIL], // Changed to your personal Gmail
      subject: "Resume Request Notification",
      html: `
        <p>This email (<strong>${email}</strong>) has requested your resume.</p>
        <p>
          <a href="http://aravindhprabu.me/adminresume" style="display:inline-block;padding:10px 15px;background-color:#4CAF50;color:white;text-decoration:none;border-radius:4px;">
            Review and Approve
          </a>
        </p>
      `,
    });

    if (error) {
      console.error("✗ Resend Error:", error);
      throw error;
    }

    console.log("✓ Resume request email sent via Resend!");
    console.log("Message ID:", data.id);

    res.status(200).json({ message: "The resume has been requested" });
  } catch (error) {
    console.error("\n✗ ERROR in /api/send-download-link:");
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    console.error("Error Stack:", error.stack);

    res.status(500).json({
      message: "Failed to process request",
      details: error.message,
    });
  }
});

app.get("/api/resume-emails", async (req, res) => {
  try {
    const emails = await ResumeEmail.find();
    console.log(`✓ Fetched ${emails.length} resume requests from database`);
    res.json(emails);
  } catch (error) {
    console.error("✗ Error fetching resume emails:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/api/resume-emails/:id", async (req, res) => {
  console.log("\n=== Resume Approval ===");
  console.log("Timestamp:", new Date().toISOString());

  const { id } = req.params;
  const { status } = req.body;

  console.log("Resume Email ID:", id);
  console.log("New Status:", status);

  try {
    const updatedEmail = await ResumeEmail.findByIdAndUpdate(id, { status }, { new: true });
    console.log("✓ Resume status updated in database");

    if (status === "approved") {
      const recipientEmail = updatedEmail.email;
      console.log("Sending resume to:", recipientEmail);

      const resumePath = path.join(__dirname, "public", "Aravindh Prabu Resume.pdf");
      console.log("Resume file path:", resumePath);

      // Read file and convert to base64 for Resend
      const resumeBuffer = fs.readFileSync(resumePath);
      const resumeBase64 = resumeBuffer.toString("base64");

      console.log("Attempting to send resume email with attachment via Resend...");

      // Send email with attachment using Resend
      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_USER,
        to: [recipientEmail],
        subject: "Requested Resume - Aravindh Prabu",
        text: `Dear Candidate,

Thank you for your interest in my professional profile. As requested, I have attached my resume to this email.

Please feel free to reach out if you have any questions or would like to connect further.

Best regards,  
Aravindh Prabu`,
        html: `<p>Dear Candidate,</p>
<p>Thank you for your interest in my professional profile. As requested, I have attached my resume to this email.</p>
<p>Please feel free to reach out if you have any questions or would like to connect further.</p>
<p>Best regards,<br>Aravindh Prabu</p>`,
        attachments: [
          {
            filename: "Aravindh Prabu Resume.pdf",
            content: resumeBase64,
          },
        ],
      });

      if (error) {
        console.error("✗ Resend Error:", error);
        throw error;
      }

      console.log("✓ Resume email sent successfully via Resend!");
      console.log("Message ID:", data.id);
    }

    res.json(updatedEmail);
  } catch (error) {
    console.error("\n✗ ERROR in /api/resume-emails/:id:");
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    console.error("Error Stack:", error.stack);

    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log("\n================================");
  console.log(`✓ Server running on port ${PORT}`);
  console.log("================================\n");
});

// module.exports.handler = serverless(app);
