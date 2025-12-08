require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");
const serverless = require("serverless-http")

const app = express();
// const PORT = 5000;
app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
});

const Contact = mongoose.model("Contact", contactSchema);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


app.get("/test",(req,res)=>{
  res.send("Hello world!");
});



app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Contact Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ success: true, message: "Message stored and email sent!" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.get("/api/messages", async (req, res) => {
  try {
    const messages = await Contact.find();
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const resumeEmailSchema = new mongoose.Schema({
  email: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "approved", "declined"], default: "pending" },
})


const ResumeEmail = mongoose.model("ResumeEmail", resumeEmailSchema);

app.post("/api/send-download-link", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const newEmailEntry = new ResumeEmail({ email });
    await newEmailEntry.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Resume Request Notification",
      html: `
    <p>This email (<strong>${email}</strong>) has requested your resume.</p>
    <p>
      <a href="http://aravindhprabu.me/adminresume" style="display:inline-block;padding:10px 15px;background-color:#4CAF50;color:white;text-decoration:none;border-radius:4px;">
        Review and Approve
      </a>
    </p>
  `
    }

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "The resume has been requested" });
  } catch (error) {
    console.error("Error requesting resume:", error);
    res.status(500).json({ message: "Failed to process request" });
  }
});


app.get("/api/resume-emails", async (req, res) => {
  try {
    const emails = await ResumeEmail.find();
    res.json(emails);
  } catch (error) {
    console.error("Error fetching resume emails:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/api/resume-emails/:id", async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  try {
    const updatedEmail = await ResumeEmail.findByIdAndUpdate(id, { status }, { new: true })

    if (status === "approved") {
      const recipientEmail = updatedEmail.email

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        subject: "Requested Resume - Aravindh Prabu",
        text: `Dear Candidate,

Thank you for your interest in my professional profile. As requested, I have attached my resume to this email.

Please feel free to reach out if you have any questions or would like to connect further.

Best regards,  
Aravindh Prabu`,
        attachments: [
          {
            filename: "Aravindh Prabu Resume.pdf",
            path: path.join(__dirname, "public", "Aravindh Prabu Resume.pdf")
          }
        ]
      }

      await transporter.sendMail(mailOptions)
    }

    res.json(updatedEmail)
  } catch (error) {
    console.error("Update error:", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})





// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports.handler = serverless(app);