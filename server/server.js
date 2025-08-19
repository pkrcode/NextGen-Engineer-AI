// server/server.js - NextGen Engineer AI Backend

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const workspaceRoutes = require('./routes/workspaceRoutes');
const taskRoutes = require('./routes/taskRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');
const chatRoutes = require('./routes/chatRoutes');
const gamificationRoutes = require('./routes/gamificationRoutes');
const timeCapsuleRoutes = require('./routes/timeCapsuleRoutes');
const aiRoutes = require('./routes/aiRoutes');
const careerRoutes = require('./routes/careerRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const learningPathsRoutes = require('./routes/learningPathsRoutes');

// Import services
const { deliverScheduledMessages } = require('./services/messageDeliveryService');
const { setupSocketIO } = require('./services/socketService');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nextgen-engineer-ai')
  .then(() => console.log('🔄 MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Setup Socket.IO
setupSocketIO(io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/timecapsules', timeCapsuleRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/learning-paths', learningPathsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    message: 'NextGen Engineer AI server is running! 🚀',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
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

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 NextGen Engineer AI server running on port ${PORT}`);
  console.log(`💬 Real-time chat enabled with Socket.IO`);
  console.log(`📧 Message delivery scheduler active`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Server URL: http://localhost:${PORT}`);
});
