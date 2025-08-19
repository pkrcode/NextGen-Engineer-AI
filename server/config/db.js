const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use local MongoDB for development, Atlas for production
    const mongoURI = process.env.NODE_ENV === 'production' 
      ? process.env.MONGODB_URI 
      : process.env.MONGODB_URI_LOCAL || 'mongodb://localhost:27017/nextgen-engineer-ai';

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`🔄 MongoDB connected successfully: ${conn.connection.host}`);
    
    // Log the database name
    console.log(`📊 Database: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
