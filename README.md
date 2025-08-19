# NextGen Engineer AI 🚀

An AI-powered career guidance, productivity, and collaboration platform designed specifically for engineering students.

## 🌟 Features

### 🎯 Career Path Mentorship
- AI-curated learning roadmaps for different engineering domains
- Personalized milestone tracking and progress visualization
- Domain-specific resources and skill assessments
- Adaptive learning paths based on performance

### 📋 Project & Study Goal Management
- Create personal or team workspaces
- Organize projects, set study goals, and break them into tasks
- Task assignment, deadline tracking, and progress monitoring
- Streak-based productivity tracking

### 💬 Real-time Collaboration
- Live chat with team members inside workspaces
- File sharing, task updates, and deadline coordination
- Message reactions, threads, and read receipts
- Online status and typing indicators

### 🏆 Gamification & Motivation
- XP points for task completions and streaks
- Unlock badges and compete on leaderboards
- Level progression and achievement tracking
- Branch and year-specific rankings

### ⏰ Future Self / Time Capsule
- Write messages, record videos, or create audio notes
- Schedule delivery to your future self
- Career goal tracking and reflection prompts
- Academic progress documentation

### 🤖 AI-powered Planning
- AI mentor for domain-specific advice
- Intelligent project planning and task generation
- Resource suggestions and learning recommendations
- Adaptive roadmap customization

### 📚 Built-in Templates
- Pre-designed project templates and roadmap structures
- Study trackers and collaboration frameworks
- Quick onboarding for different use cases

## 🛠️ Technology Stack

### Frontend
- **React.js** - UI framework
- **Tailwind CSS** - Styling and design system
- **React Router** - Navigation
- **Socket.IO Client** - Real-time communication
- **Framer Motion** - Animations
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.IO** - Real-time communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### AI & Services
- **OpenAI API** - AI features
- **Cloudinary** - File storage
- **Nodemailer** - Email notifications
- **Node-cron** - Scheduled tasks

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/nextgen-engineer-ai.git
   cd nextgen-engineer-ai
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. **Environment Setup**
   ```bash
   # Copy environment file
   cp env.example .env
   
   # Edit .env with your configuration
   nano .env
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB (if local)
   mongod
   
   # Seed the database with sample data
   npm run seed
   ```

5. **Start Development Servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start separately:
   npm run server  # Backend on port 5000
   npm run client  # Frontend on port 3000
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Create your account to get started

## 📁 Project Structure

```
nextgen-engineer-ai/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   └── theme/         # Theme configuration
│   ├── tailwind.config.js
│   └── package.json
├── server/                # Node.js backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   ├── services/         # Business logic
│   ├── scripts/          # Database scripts
│   └── server.js         # Main server file
├── env.example           # Environment variables template
├── package.json          # Root package.json
└── README.md
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=3001
CLIENT_URL=http://localhost:3000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/nextgen-engineer-ai

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# OpenAI (for AI features)
OPENAI_API_KEY=your-openai-api-key-here

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Workspaces
- `GET /api/workspaces` - Get user's workspaces
- `POST /api/workspaces` - Create workspace
- `GET /api/workspaces/:id` - Get workspace details
- `PUT /api/workspaces/:id` - Update workspace
- `DELETE /api/workspaces/:id` - Delete workspace

### Tasks
- `GET /api/tasks` - Get user's tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Roadmaps
- `GET /api/roadmaps` - Get available roadmaps
- `POST /api/roadmaps` - Create custom roadmap
- `GET /api/roadmaps/:id` - Get roadmap details
- `POST /api/roadmaps/:id/start` - Start roadmap

### Chat
- `GET /api/chat/workspace/:id` - Get workspace messages
- `POST /api/chat/workspace/:id` - Send message
- `PUT /api/chat/:id` - Edit message
- `DELETE /api/chat/:id` - Delete message

### Gamification
- `GET /api/gamification/profile` - Get user's gamification profile
- `GET /api/gamification/leaderboard` - Get leaderboard
- `GET /api/gamification/badges` - Get available badges
- `POST /api/gamification/check-badges` - Check for new badges

## 🎨 Design System

The platform uses a modern design system inspired by Monolith AI with:

- **Dark/Light Theme Support** - System preference detection
- **Responsive Design** - Mobile-first approach
- **Accessibility** - WCAG 2.1 compliant
- **Modern UI** - Clean, professional interface

### Color Palette
- **Primary**: Blue gradient (#0ea5e9 to #0284c7)
- **Secondary**: Purple gradient (#d946ef to #c026d3)
- **Success**: Green (#22c55e)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)

## 🚀 Deployment

### Backend Deployment (Render/Railway)

1. **Connect your repository**
2. **Set environment variables**
3. **Build command**: `npm install`
4. **Start command**: `npm run server`

### Frontend Deployment (Vercel/Netlify)

1. **Connect your repository**
2. **Build command**: `cd client && npm install && npm run build`
3. **Output directory**: `client/build`
4. **Set environment variables**

### Database (MongoDB Atlas)

1. **Create MongoDB Atlas cluster**
2. **Get connection string**
3. **Update MONGODB_URI in environment**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by modern learning platforms
- Design inspiration from Monolith AI
- Built with love for the engineering community

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/nextgen-engineer-ai/issues)
- **Documentation**: See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) and [AI_SETUP_GUIDE.md](AI_SETUP_GUIDE.md)

---

**NextGen Engineer AI** - Empowering the next generation of engineers! 🚀
