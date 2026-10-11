const mongoose = require('mongoose');

// Connect to MongoDB database using connection string from environment variables
const connectDB = async () => {
  try {
    // Uses Atlas MONGO_URI if provided, or defaults to local MongoDB for development
    const mongoUri = process.env.MONGO_URI && process.env.MONGO_URI.trim() !== ''
      ? process.env.MONGO_URI
      : 'mongodb://127.0.0.1:27017/student_db';

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};


module.exports = connectDB;
