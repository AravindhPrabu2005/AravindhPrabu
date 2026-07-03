const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const clientPublicPath = path.join(__dirname, "..", "client", "public");

// Mongoose Model definition for migration
const experienceSchema = new mongoose.Schema({
  role: { type: String, required: true },
  logo: { type: String, required: true },
  duration: { type: String, required: true },
  location: { type: String, required: true },
  points: [String]
});
const Experience = mongoose.model("Experience", experienceSchema);

const experiencesData = [
  {
    role: "FREELANCING | FRONT-END DEVELOPER",
    fileName: "freelancing.png",
    duration: "July 2024 – Sep 2024",
    location: "Coimbatore, India",
    points: [
      "Collaborated with a freelancer to work on holidayjoy.com project.",
      "Managed tasks via Jira and contributed on GitHub.",
      "Utilized React.js and TailwindCSS in the tech stack."
    ]
  },
  {
    role: "INTERNSHIP | RBG.ai",
    fileName: "RBG.jpeg",
    duration: "Dec 2024 – Jan 2025",
    location: "Coimbatore, India",
    points: [
      "Worked with MongoDB, Fast API and React.js with TailwindCSS.",
      "Developed a web application for attendance & task management (Internal ERP).",
      "Improved security by creating JWT auth and writing protected routes.",
      "Improved User experience by adding Role based entry."
    ]
  }
];

// Helper to upload a local file to Cloudinary
const uploadFileToCloudinary = (filePath, folder) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      return resolve(null);
    }
    
    cloudinary.uploader.upload(
      filePath,
      { folder: folder, resource_type: "image" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
  });
};

const runMigration = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✓ Connected to MongoDB.");

    console.log("\n--- Migrating Experience ---");
    // Clear existing experiences to avoid duplication
    await Experience.deleteMany({});
    
    for (const item of experiencesData) {
      const filePath = path.join(clientPublicPath, "Experience", item.fileName);
      console.log(`Uploading company logo: ${item.fileName}...`);
      const url = await uploadFileToCloudinary(filePath, "experience");
      
      if (url) {
        await Experience.create({
          role: item.role,
          duration: item.duration,
          location: item.location,
          points: item.points,
          logo: url
        });
        console.log(`✓ Saved experience: ${item.role}`);
      } else {
        console.error(`✗ Failed to upload logo for: ${item.role}`);
      }
    }

    console.log("\n=================================");
    console.log("✓ Experience Migration Completed Successfully!");
    console.log("=================================");
  } catch (err) {
    console.error("Migration Error:", err);
  } finally {
    await mongoose.connection.close();
  }
};

runMigration();
