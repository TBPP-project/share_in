const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const MONGODB_URI = process.env.DB_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);

    if (mongoose.connection.readyState === 1) {
      console.log("✅ MongoDB connected!");
    } else {
      throw new Error("❌ MongoDB connection failed!");
    }
  } catch (error) {
    console.log(error);
  }
};


module.exports = connectDB;
