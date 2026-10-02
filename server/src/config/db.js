const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mini-ecommerce', {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`MongoDB Connection Notice: ${error.message}`);
    console.warn('Running without active MongoDB connection. Configure MONGO_URI in server/.env when database is ready.');
  }
};

module.exports = connectDB;
