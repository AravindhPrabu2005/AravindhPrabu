require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bodyParser = require("body-parser")
const path = require("path")
const fs = require("fs")
const serverless = require('serverless-http');

const { SESClient, SendEmailCommand, SendRawEmailCommand } = require("@aws-sdk/client-ses")

const app = express()
const PORT = 5000

app.use(cors())
app.use(bodyParser.json())

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Error:", err))

const ses = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.SES_ACCESS_KEY,
    secretAccessKey: process.env.SES_SECRET_KEY
  }
})

async function sendTextEmail(subject, body, to) {
  try {
    const command = new SendEmailCommand({
      Source: process.env.SES_FROM_EMAIL,
      Destination: { ToAddresses: [to] },
      Message: {
        Subject: { Data: subject },
        Body: { Text: { Data: body } }
      }
    })

    const response = await ses.send(command)
    console.log("SES EMAIL SENT:", response.MessageId)
    return true
  } catch (err) {
    console.error("SES TEXT EMAIL FAILED")
    console.error("Code:", err.code)
    console.error("Message:", err.message)
    return false
  }
}

async function sendResumeEmail(toEmail, filePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath)
    const boundary = "NextPart"

    const rawMessage =
`From: ${process.env.SES_FROM_EMAIL}
To: ${toEmail}
Subject: Requested Resume - Aravindh Prabu
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="${boundary}"

--${boundary}
Content-Type: text/plain; charset="UTF-8"

Dear Candidate,

Thank you for your interest in my profile.
Please find my resume attached.

Best regards,
Aravindh Prabu

--${boundary}
Content-Type: application/pdf; name="Aravindh Prabu Resume.pdf"
Content-Disposition: attachment; filename="Aravindh Prabu Resume.pdf"
Content-Transfer-Encoding: base64

${fileBuffer.toString("base64")}
--${boundary}--`

    const command = new SendRawEmailCommand({
      RawMessage: { Data: Buffer.from(rawMessage) }
    })

    const response = await ses.send(command)
    console.log("SES RESUME EMAIL SENT:", response.MessageId)
    return true
  } catch (err) {
    console.error("SES RESUME EMAIL FAILED")
    console.error("Code:", err.code)
    console.error("Message:", err.message)
    return false
  }
}

/* ================= MODELS ================= */

const Contact = mongoose.model("Contact", new mongoose.Schema({
  name: String,
  email: String,
  message: String
}))

const ResumeEmail = mongoose.model("ResumeEmail", new mongoose.Schema({
  email: String,
  sentAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "approved", "declined"], default: "pending" }
}))

/* ================= ROUTES ================= */

app.get("/test", (req, res) => {
  res.send("I am here da!")
})

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body

    await new Contact({ name, email, message }).save()
    res.status(201).json({ success: true, message: "Message stored" })

    await sendTextEmail(
      `New Contact Message from ${name}`,
      `Name: ${name}\nEmail: ${email}\n\n${message}`,
      process.env.SES_FROM_EMAIL
    )

  } catch (err) {
    console.error("CONTACT API ERROR:", err)
    res.status(500).json({ success: false, message: "Internal server error" })
  }
})

app.get("/api/messages", async (req, res) => {
  try {
    const messages = await Contact.find()
    res.json(messages)
  } catch (err) {
    console.error("FETCH MESSAGES ERROR:", err)
    res.status(500).json({ message: "Internal server error" })
  }
})

app.post("/api/send-download-link", async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ message: "Email required" })

    await new ResumeEmail({ email }).save()
    res.json({ message: "Resume request stored" })

    await sendTextEmail(
      "Resume Request Notification",
      `Resume requested by: ${email}\nReview: http://aravindhprabu.me/adminresume`,
      process.env.SES_FROM_EMAIL
    )

  } catch (err) {
    console.error("SEND DOWNLOAD LINK ERROR:", err)
    res.status(500).json({ message: "Internal server error" })
  }
})

app.get("/api/resume-emails", async (req, res) => {
  try {
    const emails = await ResumeEmail.find()
    res.json(emails)
  } catch (err) {
    console.error("FETCH RESUME EMAILS ERROR:", err)
    res.status(500).json({ message: "Internal server error" })
  }
})

app.put("/api/resume-emails/:id", async (req, res) => {
  try {
    const { status } = req.body

    const updated = await ResumeEmail.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )

    if (status === "approved") {
      await sendResumeEmail(
        updated.email,
        path.join(__dirname, "public", "Aravindh Prabu Resume.pdf")
      )
    }

    res.json(updated)
  } catch (err) {
    console.error("RESUME APPROVAL ERROR:", err)
    res.status(500).json({ message: "Internal server error" })
  }
})

/* ================= START SERVER ================= */

// app.listen(PORT, () => {
//   console.log(`Server running on ${PORT}`)
// })

exports.module.handler = serverless(app);