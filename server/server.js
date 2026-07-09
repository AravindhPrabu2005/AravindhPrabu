require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Resend } = require("resend");
const path = require("path");
const fs = require("fs");
const serverless = require("serverless-http");
const axios = require("axios");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "aravindhprabu_portfolio_jwt_secret_token_key_2026_saibaba";

const app = express();
app.set("trust proxy", true);
const PORT = process.env.PORT || 5000;

// Ensure public directory exists
const publicDir = path.join(__dirname, "public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
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

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true }
});

const Admin = mongoose.model("Admin", adminSchema);

async function initAdmin() {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      console.log("Seeding default admin user...");
      const hashedPassword = await bcrypt.hash("Saibaba@123@123", 10);
      const defaultAdmin = new Admin({
        email: "aravindhprabu2005@gmail.com",
        password: hashedPassword
      });
      await defaultAdmin.save();
      console.log("✓ Default admin user seeded successfully!");
    } else {
      console.log("✓ Admin user already exists in database");
    }
  } catch (err) {
    console.error("✗ Error initializing/seeding admin:", err.message);
  }
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✓ MongoDB Connected Successfully");
    initSettings();
    initAdmin();
  })
  .catch((err) => {
    console.error("✗ MongoDB Connection Error:");
    console.error("Error Message:", err.message);
    console.error("Error Code:", err.code);
    console.error("Full Error:", err);
  });

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model("Contact", contactSchema);

const settingsSchema = new mongoose.Schema({
  key: { type: String, default: "admin_settings", unique: true },
  resumeUrl: { type: String, default: "" },
  coverLetterText: { type: String, default: `Dear Candidate,

Thank you for your interest in my professional profile. As requested, I have attached my resume to this email.

Please feel free to reach out if you have any questions or would like to connect further.

Best regards,  
Aravindh Prabu` }
});

const AdminSettings = mongoose.model("AdminSettings", settingsSchema);

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  github: { type: String, required: true },
  stack: [String],
  featured: { type: Boolean, default: false },
  videoLink: { type: String, default: "" },
  liveLink: { type: String, default: "" }
});
const Project = mongoose.model("Project", projectSchema);

const certificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  provider: { type: String, required: true },
  image: { type: String, required: true },
  description: String
});
const Certification = mongoose.model("Certification", certificationSchema);

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  position: { type: String, required: true },
  description: { type: String, required: true },
  certificate: { type: String, required: true },
  type: { type: Number, required: true }
});
const Achievement = mongoose.model("Achievement", achievementSchema);

const experienceSchema = new mongoose.Schema({
  role: { type: String, required: true },
  logo: { type: String, required: true },
  duration: { type: String, required: true },
  location: { type: String, required: true },
  points: [String]
});
const Experience = mongoose.model("Experience", experienceSchema);


const initSettings = async () => {
  try {
    let settings = await AdminSettings.findOne({ key: "admin_settings" });
    if (!settings) {
      await AdminSettings.create({ 
        key: "admin_settings",
        resumeUrl: "/public/Aravindh Prabu Resume.pdf"
      });
      console.log("✓ Default AdminSettings created");
    } else if (settings.resumeUrl && settings.resumeUrl.includes("cloudinary")) {
      settings.resumeUrl = "/public/Aravindh Prabu Resume.pdf";
      await settings.save();
      console.log("✓ Reset Cloudinary URL to local path in DB settings");
    }
  } catch (err) {
    console.error("✗ Failed to initialize settings:", err);
  }
};

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
// JWT Verification Middleware
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("✗ Unauthorized access attempt: No Bearer Token");
    return res.status(401).json({ error: "Unauthorized access: Please login first." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    console.log("✗ Unauthorized access attempt: Invalid token signature");
    return res.status(401).json({ error: "Unauthorized access: Session expired or invalid token." });
  }
};

// Admin Login endpoint
app.post("/api/admin/login", async (req, res) => {
  console.log("\n=== Admin Login Attempt ===");
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() }).exec();
    if (!admin) {
      console.log(`✗ Login failed: admin user not found with email ${email}`);
      return res.status(401).json({ error: "Invalid email address or password." });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.log("✗ Login failed: incorrect password");
      return res.status(401).json({ error: "Invalid email address or password." });
    }

    console.log("✓ Login successful, signing JWT...");
    const token = jwt.sign({ id: admin._id, email: admin.email }, JWT_SECRET, { expiresIn: "24h" });
    
    res.json({
      success: true,
      token,
      message: "Authentication successful!"
    });
  } catch (error) {
    console.error("✗ Login endpoint error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Helper function to screen out illegitimate/test/spam emails
function isLegitimateEmail(email) {
  if (!email) return false;
  const lowerEmail = email.toLowerCase().trim();
  
  // Basic Regex Check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(lowerEmail)) return false;

  // Block generic dummy handles
  const blockedLocalParts = [
    "test", "fake", "temp", "spam", "dummy", "admin", "noreply", 
    "no-reply", "null", "undefined", "abcd", "abc", "testing", "user"
  ];
  
  // Block common dummy domains
  const blockedDomains = [
    "example.com", "example.org", "example.net", "test.com", "test.org", "test.net",
    "tempmail.com", "tempmail.org", "mailinator.com", "yopmail.com", 
    "10minutemail.com", "dispostable.com", "getairmail.com", "throwawaymail.com",
    "guerrillamail.com", "maildrop.cc", "sharklasers.com", "trashmail.com",
    "email.com", "gmailinator.com"
  ];

  const parts = lowerEmail.split("@");
  if (parts.length !== 2) return false;
  const localPart = parts[0];
  const domain = parts[1];

  // If local part is a blocked keyword or matches test/fake/spam patterns
  if (blockedLocalParts.includes(localPart)) return false;
  if (localPart.includes("test") || localPart.includes("fake") || localPart.includes("spam")) {
    // Make sure it's not a real name containing 'test' (rare, but keep it robust)
    if (localPart === "test" || localPart.startsWith("test") && isNaN(localPart.replace("test", ""))) {
      return false;
    }
  }

  // If domain is directly blocked or contains spam keywords
  if (blockedDomains.includes(domain)) return false;
  if (domain.includes("example") || domain.includes("test") || domain.includes("fake") || domain.includes("tempmail")) {
    return false;
  }

  return true;
}

app.post("/api/contact", async (req, res) => {
  console.log("\n=== Contact Form Submission ===");
  console.log("Timestamp:", new Date().toISOString());
  console.log("Request Body:", req.body);

  try {
    const { name, email, message } = req.body;

    // 1. Enforce all fields are provided and non-empty
    if (!name || !email || !message || name.trim() === "" || email.trim() === "" || message.trim() === "") {
      console.log("✗ Validation failed: Missing required fields");
      return res.status(400).json({ success: false, message: "All fields (Name, Email, and Message) are required." });
    }

    // 2. Validate email legitimacy
    if (!isLegitimateEmail(email)) {
      console.log(`✗ Validation failed: Illegitimate or invalid email detected: ${email}`);
      return res.status(400).json({ 
        success: false, 
        message: "Please enter a valid, legitimate email address. Test or temporary emails are not accepted." 
      });
    }

    // Save to database
    const newContact = new Contact({ 
      name: name.trim(), 
      email: email.toLowerCase().trim(), 
      message: message.trim() 
    });
    await newContact.save();
    console.log("✓ Contact saved to MongoDB");

    console.log("Attempting to send notification email to Aravindh...");
    // Send email using Resend to your personal Gmail
    const { data: notificationData, error: notificationError } = await resend.emails.send({
      from: process.env.EMAIL_USER,
      to: [NOTIFICATION_EMAIL],
      subject: `New Contact Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message}</p>`,
    });

    if (notificationError) {
      console.error("✗ Resend Notification Error:", notificationError);
      // We log the error but don't abort since database storage was successful
    } else {
      console.log("✓ Notification email sent successfully via Resend!");
    }

    console.log(`Attempting to send auto-reply to viewer (${email})...`);
    // Send dynamic styled auto-reply to the visitor
    const { data: autoReplyData, error: autoReplyError } = await resend.emails.send({
      from: process.env.EMAIL_USER,
      to: [email.toLowerCase().trim()],
      subject: "Inquiry Received - Aravindh Prabu",
      html: `
        <div style="background-color: #f8fafc; padding: 32px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #334155; line-height: 1.6; -webkit-font-smoothing: antialiased;">
          <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.025);">
            <!-- Accent Top Line -->
            <div style="height: 4px; background-color: #4f46e5;"></div>
            
            <!-- Email Body Content -->
            <div style="padding: 32px 24px;">
              <!-- Header -->
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td>
                    <h2 style="margin: 0; font-size: 20px; font-weight: 700; color: #0f172a; letter-spacing: -0.25px;">Inquiry Confirmation</h2>
                    <p style="margin: 4px 0 0 0; font-size: 13px; color: #64748b; font-weight: 500;">Aravindh Prabu — Professional Portfolio</p>
                  </td>
                </tr>
              </table>
              
              <p style="margin-top: 0; font-size: 15px; color: #334155;">Dear ${name.trim()},</p>
              
              <p style="font-size: 15px; color: #334155; margin-bottom: 20px;">
                Thank you for your message and for visiting my portfolio website. This email confirms that your submission has been received successfully.
              </p>
              
              <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; border-left: 3px solid #cbd5e1; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; letter-spacing: 0.5px;">Message Excerpt</p>
                <p style="margin: 6px 0 0 0; font-size: 13px; color: #475569; font-style: italic; white-space: pre-line;">"${message.trim().length > 250 ? message.trim().substring(0, 250) + '...' : message.trim()}"</p>
              </div>
              
              <p style="font-size: 15px; color: #334155; margin-bottom: 28px;">
                I am currently reviewing your inquiry and will follow up with you as soon as possible.
              </p>
              
              <hr style="border: 0; border-top: 1px solid #f1f5f9; margin-bottom: 20px;" />
              
              <!-- Signature -->
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td>
                    <p style="margin: 0; font-size: 14px; font-weight: 600; color: #0f172a;">Aravindh Prabu</p>
                    <p style="margin: 2px 0 0 0; font-size: 12px; color: #64748b;">Developer & Student</p>
                    <p style="margin: 8px 0 0 0; font-size: 13px;">
                      <a href="https://aravindhprabu.me" style="color: #4f46e5; text-decoration: none; font-weight: 600;">aravindhprabu.me</a>
                    </p>
                  </td>
                </tr>
              </table>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8fafc; padding: 16px 24px; border-top: 1px solid #f1f5f9; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                This is an automated confirmation. Please do not reply directly to this email.
              </p>
            </div>
          </div>
        </div>
      `
    });

    if (autoReplyError) {
      console.error("✗ Resend Auto-Reply Error:", autoReplyError);
    } else {
      console.log("✓ Auto-reply email sent successfully to viewer!");
    }

    res.status(201).json({ success: true, message: "Message stored and confirmation email sent!" });
  } catch (error) {
    console.error("\n✗ ERROR in /api/contact:");
    console.error("Error Message:", error.message);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message,
    });
  }
});

app.get("/api/messages", requireAuth, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    console.log(`✓ Fetched ${messages.length} messages from database (sorted by date)`);
    res.json(messages);
  } catch (error) {
    console.error("✗ Error fetching messages:", error.message);
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
          <a href="http://aravindhprabu.me/admin/resume-requests" style="display:inline-block;padding:10px 15px;background-color:#4CAF50;color:white;text-decoration:none;border-radius:4px;">
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

app.get("/api/resume-emails", requireAuth, async (req, res) => {
  try {
    const emails = await ResumeEmail.find();
    console.log(`✓ Fetched ${emails.length} resume requests from database`);
    res.json(emails);
  } catch (error) {
    console.error("✗ Error fetching resume emails:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/api/resume-emails/:id", requireAuth, async (req, res) => {
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

      // Fetch dynamic settings from Database
      const settings = await AdminSettings.findOne({ key: "admin_settings" });
      const coverLetter = settings ? settings.coverLetterText : `Dear Candidate,

Thank you for your interest in my professional profile. As requested, I have attached my resume to this email.

Please feel free to reach out if you have any questions or would like to connect further.

Best regards,  
Aravindh Prabu`;
      const resumePath = path.join(__dirname, "public", "Aravindh Prabu Resume.pdf");
      console.log("Reading local resume file path:", resumePath);
      const resumeBuffer = fs.readFileSync(resumePath);
      const resumeBase64 = resumeBuffer.toString("base64");

      console.log("Attempting to send resume email with attachment via Resend...");
      const coverLetterHtml = coverLetter.replace(/\n/g, "<br />");

      // Send email with attachment using Resend
      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_USER,
        to: [recipientEmail],
        subject: "Professional Resume - Aravindh Prabu",
        text: coverLetter,
        html: `
          <div style="background-color: #f8fafc; padding: 32px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #334155; line-height: 1.6; -webkit-font-smoothing: antialiased;">
            <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.025);">
              <!-- Accent Top Line -->
              <div style="height: 4px; background-color: #0284c7;"></div>
              
              <!-- Email Body Content -->
              <div style="padding: 32px 24px;">
                <!-- Header -->
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                  <tr>
                    <td>
                      <h2 style="margin: 0; font-size: 20px; font-weight: 700; color: #0f172a; letter-spacing: -0.25px;">Resume & Profile Details</h2>
                      <p style="margin: 4px 0 0 0; font-size: 13px; color: #64748b; font-weight: 500;">Aravindh Prabu — Professional Portfolio</p>
                    </td>
                  </tr>
                </table>
                
                <div style="font-size: 15px; color: #334155; margin-bottom: 24px;">
                  <p style="margin: 0; white-space: pre-line;">${coverLetter.trim()}</p>
                </div>
                
                <!-- Attachment / Action Card -->
                <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; border: 1px solid #e2e8f0; margin-bottom: 28px; text-align: center;">
                  <p style="margin: 0 0 12px 0; font-size: 13px; color: #64748b; font-weight: 500;">
                    My professional resume is attached to this email. You can also view it online:
                  </p>
                  <a href="https://aravindhprabu.me" style="display: inline-block; padding: 10px 20px; background-color: #0284c7; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: 600; box-shadow: 0 2px 4px rgba(2, 132, 199, 0.15);">
                    View Portfolio Website
                  </a>
                </div>
                
                <hr style="border: 0; border-top: 1px solid #f1f5f9; margin-bottom: 20px;" />
                
                <!-- Signature -->
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td>
                      <p style="margin: 0; font-size: 14px; font-weight: 600; color: #0f172a;">Aravindh Prabu</p>
                      <p style="margin: 2px 0 0 0; font-size: 12px; color: #64748b;">Developer & Student</p>
                      <p style="margin: 8px 0 0 0; font-size: 13px;">
                        <a href="https://aravindhprabu.me" style="color: #0284c7; text-decoration: none; font-weight: 600;">aravindhprabu.me</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </div>
              
              <!-- Footer -->
              <div style="background-color: #f8fafc; padding: 16px 24px; border-top: 1px solid #f1f5f9; text-align: center;">
                <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                  This email was sent in response to your request on aravindhprabu.me
                </p>
              </div>
            </div>
          </div>
        `,
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

// DELETE individual contact message
app.delete("/api/messages/:id", requireAuth, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// DELETE all contact messages
app.delete("/api/messages", requireAuth, async (req, res) => {
  try {
    await Contact.deleteMany({});
    res.json({ success: true, message: "All messages deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// DELETE individual resume request
app.delete("/api/resume-emails/:id", requireAuth, async (req, res) => {
  try {
    await ResumeEmail.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Resume request deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// DELETE resume requests (all or history status)
app.delete("/api/resume-emails", requireAuth, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status === "history" ? { status: { $ne: "pending" } } : {};
    await ResumeEmail.deleteMany(filter);
    res.json({ success: true, message: "Resume requests deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});
// Configure Cloudinary
// Configure Multer storage locally
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public"));
  },
  filename: (req, file, cb) => {
    cb(null, "Aravindh Prabu Resume.pdf");
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed!"), false);
    }
  }
});

// GET Settings
app.get("/api/settings", async (req, res) => {
  try {
    const settings = await AdminSettings.findOne({ key: "admin_settings" });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// PUT Cover Letter
app.put("/api/settings/cover-letter", requireAuth, async (req, res) => {
  try {
    const { coverLetterText } = req.body;
    const settings = await AdminSettings.findOneAndUpdate(
      { key: "admin_settings" },
      { coverLetterText },
      { new: true }
    );
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// POST Resume PDF upload locally
app.post("/api/settings/resume", requireAuth, upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No PDF file provided" });
    }

    const resumeUrl = "/public/Aravindh Prabu Resume.pdf";

    // Save in settings
    const settings = await AdminSettings.findOneAndUpdate(
      { key: "admin_settings" },
      { resumeUrl },
      { new: true }
    );

    res.json({ success: true, resumeUrl, settings });
  } catch (error) {
    console.error("Local file write failed:", error);
    res.status(500).json({ error: "Local file write failed", details: error.message });
  }
});


// GET Secure Resume PDF view
app.get("/api/settings/resume/view", (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(401).send("Unauthorized: Missing token");
    }

    try {
      jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).send("Unauthorized: Invalid or expired token");
    }

    const resumePath = path.join(__dirname, "public", "Aravindh Prabu Resume.pdf");
    if (!fs.existsSync(resumePath)) {
      return res.status(404).send("Resume file not found");
    }

    res.setHeader("Content-Type", "application/pdf");
    res.sendFile(resumePath);
  } catch (error) {
    res.status(500).send("Error loading resume file");
  }
});



// Configure Cloudinary for generic portfolio image uploads
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Configure Multer memory storage for portfolio images
const imageUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  }
});

// Cloudinary image upload helper
const uploadImageToCloudinary = (fileBuffer, folder = "portfolio") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        folder: folder,
        overwrite: true
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

// ==========================================
// PROJECTS CRUD ENDPOINTS
// ==========================================

// GET all projects
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// POST create project (with image upload)
app.post("/api/projects", requireAuth, imageUpload.single("image"), async (req, res) => {
  try {
    const { title, description, github, stack, featured, videoLink, liveLink } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const imageUrl = await uploadImageToCloudinary(req.file.buffer, "projects");
    const project = await Project.create({
      title,
      description,
      github,
      stack: typeof stack === "string" ? JSON.parse(stack) : stack,
      featured: featured === "true" || featured === true,
      videoLink: videoLink || "",
      liveLink: liveLink || "",
      image: imageUrl
    });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// PUT update project (optional image upload)
app.put("/api/projects/:id", requireAuth, imageUpload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, github, stack, featured, videoLink, liveLink } = req.body;
    const updateData = {
      title,
      description,
      github,
      stack: typeof stack === "string" ? JSON.parse(stack) : stack,
      featured: featured === "true" || featured === true,
      videoLink: videoLink || "",
      liveLink: liveLink || ""
    };

    if (req.file) {
      const imageUrl = await uploadImageToCloudinary(req.file.buffer, "projects");
      updateData.image = imageUrl;
    }

    const project = await Project.findByIdAndUpdate(id, updateData, { new: true });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// DELETE project
app.delete("/api/projects/:id", requireAuth, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// ==========================================
// CERTIFICATIONS CRUD ENDPOINTS
// ==========================================

// GET all certifications
app.get("/api/certifications", async (req, res) => {
  try {
    const certs = await Certification.find();
    res.json(certs);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// POST create certification (with image upload)
app.post("/api/certifications", requireAuth, imageUpload.single("image"), async (req, res) => {
  try {
    const { title, provider, description } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const imageUrl = await uploadImageToCloudinary(req.file.buffer, "certifications");
    const cert = await Certification.create({
      title,
      provider,
      description,
      image: imageUrl
    });
    res.json(cert);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// PUT update certification (optional image upload)
app.put("/api/certifications/:id", requireAuth, imageUpload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, provider, description } = req.body;
    const updateData = { title, provider, description };

    if (req.file) {
      const imageUrl = await uploadImageToCloudinary(req.file.buffer, "certifications");
      updateData.image = imageUrl;
    }

    const cert = await Certification.findByIdAndUpdate(id, updateData, { new: true });
    res.json(cert);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// DELETE certification
app.delete("/api/certifications/:id", requireAuth, async (req, res) => {
  try {
    await Certification.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Certification deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// ==========================================
// ACHIEVEMENTS CRUD ENDPOINTS
// ==========================================

// GET all achievements
app.get("/api/achievements", async (req, res) => {
  try {
    const achievements = await Achievement.find();
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// POST create achievement (with image upload)
app.post("/api/achievements", requireAuth, imageUpload.single("image"), async (req, res) => {
  try {
    const { title, position, description, type } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: "Certificate image file is required" });
    }

    const imageUrl = await uploadImageToCloudinary(req.file.buffer, "achievements");
    const achievement = await Achievement.create({
      title,
      position,
      description,
      type: Number(type),
      certificate: imageUrl
    });
    res.json(achievement);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// PUT update achievement (optional image upload)
app.put("/api/achievements/:id", requireAuth, imageUpload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, position, description, type } = req.body;
    const updateData = {
      title,
      position,
      description,
      type: Number(type)
    };

    if (req.file) {
      const imageUrl = await uploadImageToCloudinary(req.file.buffer, "achievements");
      updateData.certificate = imageUrl;
    }

    const achievement = await Achievement.findByIdAndUpdate(id, updateData, { new: true });
    res.json(achievement);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// DELETE achievement
app.delete("/api/achievements/:id", requireAuth, async (req, res) => {
  try {
    await Achievement.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Achievement deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});


// ==========================================
// EXPERIENCE CRUD ENDPOINTS
// ==========================================

// GET all experiences
app.get("/api/experiences", async (req, res) => {
  try {
    const experiences = await Experience.find();
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// POST create experience (with logo image upload)
app.post("/api/experiences", requireAuth, imageUpload.single("image"), async (req, res) => {
  try {
    const { role, duration, location, points } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: "Company logo is required" });
    }

    const imageUrl = await uploadImageToCloudinary(req.file.buffer, "experience");
    const experience = await Experience.create({
      role,
      duration,
      location,
      points: typeof points === "string" ? JSON.parse(points) : points,
      logo: imageUrl
    });
    res.json(experience);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// PUT update experience (optional logo upload)
app.put("/api/experiences/:id", requireAuth, imageUpload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { role, duration, location, points } = req.body;
    const updateData = {
      role,
      duration,
      location,
      points: typeof points === "string" ? JSON.parse(points) : points
    };

    if (req.file) {
      const imageUrl = await uploadImageToCloudinary(req.file.buffer, "experience");
      updateData.logo = imageUrl;
    }

    const experience = await Experience.findByIdAndUpdate(id, updateData, { new: true });
    res.json(experience);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// DELETE experience
app.delete("/api/experiences/:id", requireAuth, async (req, res) => {
  try {
    await Experience.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Experience deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});


// ==========================================
// VISITOR TRACKING ENDPOINTS
// ==========================================

const visitorSchema = new mongoose.Schema({
  ip: String,
  country: String,
  city: String,
  region: String,
  isp: String,
  org: String,
  latitude: Number,
  longitude: Number,
  userAgent: String,
  referrer: String,
  screenResolution: String,
  language: String,
  path: String,
  timezone: String,
  visitedAt: { type: Date, default: Date.now }
});

const Visitor = mongoose.model("Visitor", visitorSchema);

// POST visitor details (silent tracker)
app.post("/api/visit", async (req, res) => {
  try {
    const { userAgent, referrer, screenResolution, language, path, timezone, geoData } = req.body;
    
    // Extract IP and location details from the client-side payload
    let ip = geoData?.ip || "Unknown";
    let country = geoData?.country || "Unknown";
    let city = geoData?.city || "Unknown";
    let region = geoData?.region || "Unknown";
    let isp = geoData?.isp || "Unknown";
    let org = geoData?.org || "Unknown";
    let latitude = geoData?.latitude || null;
    let longitude = geoData?.longitude || null;

    // If client-side geolocation failed or returned default values, fallback to server-side request headers
    if (ip === "Unknown" || ip === "") {
      ip = req.headers['x-forwarded-for'] || 
           req.headers['x-real-ip'] || 
           req.ip || 
           req.socket.remoteAddress;
      if (ip) {
        if (ip.includes(',')) {
          ip = ip.split(',')[0].trim();
        }
        if (ip.startsWith("::ffff:")) {
          ip = ip.substring(7);
        }
      }
    }

    // If location is still unknown on server, perform server-side lookup as a fallback
    if (city === "Unknown" && ip && ip !== '::1' && ip !== '127.0.0.1' && !ip.startsWith('192.168.')) {
      try {
        const geoRes = await axios.get(`http://ip-api.com/json/${ip}`, { timeout: 3000 });
        if (geoRes.data && geoRes.data.status === "success") {
          country = geoRes.data.country || "Unknown";
          city = geoRes.data.city || "Unknown";
          region = geoRes.data.regionName || "Unknown";
          isp = geoRes.data.isp || "Unknown";
          
          let rawOrg = geoRes.data.org || "";
          if ((!rawOrg || rawOrg.toLowerCase() === "unknown") && geoRes.data.as) {
            const match = geoRes.data.as.match(/^AS\d+\s+(.*)$/i);
            rawOrg = match ? match[1].trim() : geoRes.data.as.trim();
          }
          org = rawOrg || geoRes.data.isp || "Unknown";
          
          latitude = geoRes.data.lat || null;
          longitude = geoRes.data.lon || null;
        }
      } catch (geoErr) {
        console.error("Geo IP lookup fallback failed:", geoErr.message);
      }
    }

    const visitor = await Visitor.create({
      ip,
      country,
      city,
      region,
      isp,
      org,
      latitude,
      longitude,
      userAgent,
      referrer,
      screenResolution,
      language,
      path,
      timezone
    });

    console.log(`[Visitor] New visit recorded: IP ${ip} (${city}, ${country})`);

    // Send email notification to owner via Resend (always send on new visit session)
    try {
      await resend.emails.send({
        from: process.env.EMAIL_USER,
        to: [NOTIFICATION_EMAIL],
        subject: `🎯 New Portfolio Visit from ${city}, ${country}`,
        html: `
          <h3>New Visitor Recorded</h3>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>IP Address:</strong> ${ip}</p>
          <p><strong>Estimated Location:</strong> ${city}, ${region}, ${country}</p>
          <p><strong>Network / ISP:</strong> ${isp}</p>
          <p><strong>Referrer:</strong> ${referrer}</p>
          <p><strong>Screen:</strong> ${screenResolution}</p>
          <p><strong>Language:</strong> ${language}</p>
          <p><strong>Entry Path:</strong> ${path}</p>
          <p><strong>User Agent:</strong> ${userAgent}</p>
          <br/>
          <p><a href="https://aravindhprabu.me/admin/visitors" style="display:inline-block;padding:10px 15px;background-color:#7c3aed;color:white;text-decoration:none;border-radius:8px;font-weight:bold;">View in Admin Panel</a></p>
        `
      });
      console.log("✓ Visitor email notification sent successfully.");
    } catch (mailErr) {
      console.error("Failed to send visitor email notification:", mailErr.message);
    }

    res.status(201).json({ success: true, data: visitor });
  } catch (error) {
    console.error("Error logging visitor:", error.message);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// GET all visitors (limited to latest 100)
app.get("/api/visitors", requireAuth, async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ visitedAt: -1 }).limit(100);
    res.json(visitors);
  } catch (error) {
    console.error("Error fetching visitors:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE clear all visitors
app.delete("/api/visitors", requireAuth, async (req, res) => {
  try {
    await Visitor.deleteMany({});
    res.json({ success: true, message: "All visitor logs cleared successfully" });
  } catch (error) {
    console.error("Error clearing visitor logs:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE single visitor log
app.delete("/api/visitors/:id", requireAuth, async (req, res) => {
  try {
    await Visitor.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Visitor log deleted successfully" });
  } catch (error) {
    console.error("Error deleting visitor log:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



app.listen(PORT, () => {
  console.log("\n================================");
  console.log(`✓ Server running on port ${PORT}`);
  console.log("================================\n");
});

// module.exports.handler = serverless(app);
