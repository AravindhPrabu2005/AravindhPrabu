const mongoose = require("mongoose");
require("dotenv").config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
    
    // Check Settings
    const settingsSchema = new mongoose.Schema({
      key: String,
      resumeUrl: String,
      coverLetterText: String
    }, { collection: "adminsettings" });
    
    const AdminSettings = mongoose.model("AdminSettings", settingsSchema);
    const settings = await AdminSettings.findOne({ key: "admin_settings" });
    console.log("Settings Document:", settings);
    
    await mongoose.connection.close();
  } catch (err) {
    console.error("Error:", err);
  }
};

run();
