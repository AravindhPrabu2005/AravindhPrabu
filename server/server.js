require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bodyParser = require("body-parser")
const path = require("path")
const serverless = require("serverless-http")

const PORT = 5000;

const { SESClient, SendEmailCommand, SendRawEmailCommand } = require("@aws-sdk/client-ses")

const app = express()
app.use(cors())
app.use(bodyParser.json())

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Error:", err.message))

const ses = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.SES_ACCESS_KEY,
    secretAccessKey: process.env.SES_SECRET_KEY
  }
})

const sendTextEmail = async (subject, body, to) => {
  const command = new SendEmailCommand({
    Source: process.env.SES_FROM_EMAIL,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject },
      Body: { Text: { Data: body } }
    }
  })
  return ses.send(command)
}

const sendResumeEmail = async (toEmail, fileBuffer) => {
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

Thank you for your interest in my profile. Please find my resume attached.

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

  return ses.send(command)
}

const Contact = mongoose.model("Contact", new mongoose.Schema({
  name: String,
  email: String,
  message: String
}))

const ResumeEmail = mongoose.model("ResumeEmail", new mongoose.Schema({
  email: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "approved", "declined"], default: "pending" }
}))

app.get("/test", (req, res) => {
  res.send("I am here da!")
})

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body
    await new Contact({ name, email, message }).save()

    res.status(201).json({ message: "Message saved" })

    sendTextEmail(
      `New Contact Message from ${name}`,
      `Name: ${name}\nEmail: ${email}\n\n${message}`,
      process.env.SES_FROM_EMAIL
    ).catch(err => console.error("SES Error:", err.message))

  } catch (err) {
    console.error("Contact API Error:", err.message)
    res.status(500).json({ message: "Internal server error" })
  }
})

app.post("/api/send-download-link", async (req, res) => {
  const { email } = req.body
  if (!email) return res.status(400).json({ message: "Email required" })

  try {
    await new ResumeEmail({ email }).save()
    res.json({ message: "Resume request saved" })

    sendTextEmail(
      "Resume Request Notification",
      `Resume requested by: ${email}\nReview at: http://aravindhprabu.me/adminresume`,
      process.env.SES_FROM_EMAIL
    ).catch(err => console.error("SES Error:", err.message))

  } catch (err) {
    console.error("Resume Request Error:", err.message)
    res.status(500).json({ message: "Internal server error" })
  }
})

app.get("/api/resume-emails", async (req, res) => {
  const emails = await ResumeEmail.find()
  res.json(emails)
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
      const fileBuffer = require("fs").readFileSync(
        path.join(__dirname, "public", "Aravindh Prabu Resume.pdf")
      )

      sendResumeEmail(updated.email, fileBuffer)
        .catch(err => console.error("SES Resume Error:", err.message))
    }

    res.json(updated)
  } catch (err) {
    console.error("Approval Error:", err.message)
    res.status(500).json({ message: "Internal server error" })
  }
})

module.exports.handler = serverless(app)
// app.listen(PORT,()=>{
//   console.log(`Server is running on ${PORT}`);
// })