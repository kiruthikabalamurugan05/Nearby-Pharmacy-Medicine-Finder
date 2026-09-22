const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 20000, // Increase timeout to 20 seconds
      connectTimeoutMS: 20000,
      socketTimeoutMS: 20000,
      retryWrites: true,
      w: 'majority',
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`);
    console.error('Connection Details:', {
      uri: process.env.MONGO_URI ? 'Set' : 'Not set',
      error: error.name,
    });
  }
};

module.exports = connectDB;

module.exports = connectDB;