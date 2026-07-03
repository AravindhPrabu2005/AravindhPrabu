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
const clientAssetsPath = path.join(__dirname, "..", "client", "src", "assets");

// Mongoose Models definitions for migration
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  github: { type: String, required: true },
  stack: [String],
  featured: { type: Boolean, default: false }
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

// Existing Data Definitions
const achievementsData = [
  {
    title: "TechXcelerate 2025",
    position: '2nd Place',
    description: 'Developed a blockchain-based voting system tailored for university elections using JavaScript blockchain. Integrated a chatbot to assist users in selecting candidates by answering common queries. Awarded a cash prize of ₹25,000.',
    fileName: 'TechXcelerate.jpg',
    type: 1
  },
  {
    title: "L&T Hack Appsters '25",
    position: '1st Place',
    description: 'Designed a skill-sharing platform that allows users to teach and learn from one another. Introduced a barter-style knowledge exchange system. Integrated Gemini API to enable AI mentorship and generate quizzes. Secured a cash prize of ₹25,000.',
    fileName: 'L&T Hack Appsters.jpg',
    type: 1
  },
  {
    title: "SRCAS Hackathon 2024",
    position: 'Finalist',
    description: 'Built a decentralized renewable energy trading platform using React.js, Node.js, MongoDB, and Socket.io. Enabled real-time bidding for energy transactions. Achieved a 10% improvement in transaction efficiency and a 15% cost reduction through optimized algorithms.',
    fileName: 'SRCAS hackathon.jpg',
    type: 1
  },
  {
    title: "SREC INNOVATE 2024",
    position: 'The Best Innovation Award',
    description: 'Created a web-based Deepfake detection system using HTML, CSS, and the open-source MesoNet algorithm. Focused on identifying manipulated media through visual pattern analysis',
    fileName: 'Best Innovation award.jpg',
    type: 2
  },
  {
    title: "ICMRSH 2024 - International Conference",
    position: 'Best Paper Award',
    description: 'Published a research paper on "Digital Identity Verification Using Blockchain," detailing a secure and intelligent verification process leveraging smart contracts and AI-driven security bots.',
    fileName: 'Best Paper Award.jpg',
    type: 2
  },
  {
    title: "Design Thinking Challenge 6.0",
    position: '2nd Place',
    description: 'Developed a civic engagement platform named Portal India to enable citizens to propose and discuss government schemes. Integrated interactive features such as polls, quizzes, forums, webinars, and live feedback. Received a cash award of ₹750.',
    fileName: 'Best design Challange.jpg',
    type: 2
  },
  {
    title: "Tech Sprint Phase-1",
    position: 'Top Performer',
    description: 'Proposed an innovative idea titled "AI-Powered Firewall Protection Suite", which incorporates AI to dynamically detect and respond to emerging cyber threats, offering a smarter and adaptive security solution.',
    fileName: 'Tech Sprint.jpg',
    type: 2
  },
  {
    title: "Curio Prompt cynosure 2k23 (Prompt Engineering contest)",
    position: '2nd Place',
    description: 'Participated in a prompt engineering contest where I successfully crafted creative strategies to elicit responses from ChatGPT on prompts typically restricted or unanswered.',
    fileName: 'Curio Prompt - kgisl.jpg',
    type: 2
  },
  {
    title: "Web Design cynosure 2k23",
    position: '2nd Place',
    description: 'Tasked with designing an e-commerce platform on the spot. Developed a responsive homepage featuring top-banner image sliders and a structured product listing section.',
    fileName: 'web design - kgisl.jpg',
    type: 2
  },
  {
    title: "Q'CIPHER quiz competition",
    position: '2nd Place',
    description: 'Competed in a technical quiz organized by the FOSS Club, focusing on Free and Open Source Software tools and technologies commonly used in development.',
    fileName: 'Q CIPHER.jpg',
    type: 2
  }
];

const certificationsData = [
  {
    title: 'The Complete Full-Stack Web Development Bootcamp',
    provider: 'Udemy',
    fileName: 'full stack development.png',
    description: 'A comprehensive course covering both frontend and backend technologies, including HTML, CSS, JavaScript, React, Node.js, and more.'
  },
  {
    title: 'Software Development Lifecycle Fundamentals',
    provider: 'Great Learning',
    fileName: 'SDLC principles.jpg',
    description: 'An introduction to the software development lifecycle, covering methodologies, processes, and best practices for software development.'
  }
];

const projectsData = [
  {
    title: 'JVL Cart E-commerce',
    description: 'A Ecommerce Website. Built with MERN Stack.',
    github: 'https://github.com/jvlcode/jvlcart',
    stack: ['React', 'Node.js', 'MongoDB', 'Express'],
    fileName: 'ecommerce-websites.jpg',
    featured: true
  },
  {
    title: 'Food Appsters Swiggy',
    description: 'Food Ecommerce website like Swiggy, Built with Angular & .Net',
    github: 'https://github.com/jvlcode/food',
    stack: ['Angular', '.Net Core', 'SQL Server'],
    fileName: 'food-ecommerce.jpg',
    featured: true
  },
  {
    title: 'Next.js Blog Platform',
    description: 'Basic Blog Website. Built with Next JS and MongoDB',
    github: 'https://github.com/jvlcode/blog',
    stack: ['Next.js', 'React', 'MongoDB'],
    fileName: 'website-blog.jpg',
    featured: true
  },
  {
    title: 'Mealzy Health Companion',
    description: 'Mealzy Health is a health and wellness companion powered by AI, designed to help users make smarter food choices, monitor their nutritional intake, and build sustainable habits.',
    github: 'https://github.com/your-repo/mealzy-health',
    stack: ['React Native', 'Node.js', 'MongoDB', 'Next.js'],
    fileName: 'ecommerce-websites.jpg', // fallback image
    featured: false
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

    // 1. Migrate Achievements
    console.log("\n--- Migrating Achievements ---");
    // Clear existing achievements to avoid duplication
    await Achievement.deleteMany({});
    
    for (const item of achievementsData) {
      const filePath = path.join(clientPublicPath, "Hackathons and Achivements", item.fileName);
      console.log(`Uploading certificate: ${item.fileName}...`);
      const url = await uploadFileToCloudinary(filePath, "achievements");
      
      if (url) {
        await Achievement.create({
          title: item.title,
          position: item.position,
          description: item.description,
          type: item.type,
          certificate: url
        });
        console.log(`✓ Saved achievement: ${item.title}`);
      } else {
        console.error(`✗ Failed to upload certificate for: ${item.title}`);
      }
    }

    // 2. Migrate Certifications
    console.log("\n--- Migrating Certifications ---");
    await Certification.deleteMany({});
    
    for (const item of certificationsData) {
      const filePath = path.join(clientPublicPath, "Certifications", item.fileName);
      console.log(`Uploading certification image: ${item.fileName}...`);
      const url = await uploadFileToCloudinary(filePath, "certifications");
      
      if (url) {
        await Certification.create({
          title: item.title,
          provider: item.provider,
          description: item.description,
          image: url
        });
        console.log(`✓ Saved certification: ${item.title}`);
      } else {
        console.error(`✗ Failed to upload certification image for: ${item.title}`);
      }
    }

    // 3. Migrate Projects
    console.log("\n--- Migrating Projects ---");
    await Project.deleteMany({});
    
    for (const item of projectsData) {
      const filePath = path.join(clientAssetsPath, item.fileName);
      console.log(`Uploading project thumbnail: ${item.fileName}...`);
      const url = await uploadFileToCloudinary(filePath, "projects");
      
      if (url) {
        await Project.create({
          title: item.title,
          description: item.description,
          github: item.github,
          stack: item.stack,
          featured: item.featured,
          image: url
        });
        console.log(`✓ Saved project: ${item.title}`);
      } else {
        console.error(`✗ Failed to upload project image for: ${item.title}`);
      }
    }

    console.log("\n=================================");
    console.log("✓ Migration Completed Successfully!");
    console.log("=================================");
  } catch (err) {
    console.error("Migration Error:", err);
  } finally {
    await mongoose.connection.close();
  }
};

runMigration();
