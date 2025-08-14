// server/server.js - TimeCapsule.AI Backend

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const timeCapsuleRoutes = require('./routes/timeCapsuleRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Import services
const { deliverScheduledMessages } = require('./services/messageDeliveryService');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/timecapsule-ai')
  .then(() => console.log('🔄 MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/timecapsules', timeCapsuleRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    message: 'TimeCapsule.AI server is running! 🚀',
    timestamp: new Date().toISOString()
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Global error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Schedule message delivery (runs every hour)
cron.schedule('0 * * * *', async () => {
  console.log('🕐 Running scheduled message delivery...');
  try {
    await deliverScheduledMessages();
    console.log('✅ Scheduled message delivery completed');
  } catch (error) {
    console.error('❌ Error in scheduled message delivery:', error);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 TimeCapsule.AI server running on port ${PORT}`);
  console.log(`📧 Message delivery scheduler active`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});
