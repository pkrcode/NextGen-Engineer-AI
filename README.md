# 🚀 AdhyayanMarg – The Path of Study, Growth, and Reflection

> **AI-powered collaborative productivity and self-reflection platform designed for students, self-learners, and teams.**

**AdhyayanMarg** is a comprehensive platform that blends **project/task management**, **real-time collaboration**, **gamified productivity**, and a unique **Future Self journaling** feature into a single, cohesive system for personal and academic growth.

## ✨ Features

### 📚 Core Learning Features
- **Workspace Management** - Create dedicated spaces for study projects, assignments, team collaborations, or personal goals
- **Task & Subtask Organization** - Add tasks with categories, priorities, deadlines, and recurrence options
- **Built-in Templates** - Ready-made structures for exam prep, thesis workflow, video production, and more
- **Real-time Collaboration** - Invite team members and collaborate with instant sync via Firebase

### 🤝 Collaboration Features
- **Team Workspaces** - Invite members and work together on shared learning goals
- **Task-specific Chat** - Each task has its own discussion area
- **File Sharing** - Share documents, notes, and resources within workspaces
- **Instant Sync** - All updates sync in real-time across all collaborators

### 🎮 Gamified Productivity
- **Progress Tracking** - Visual percentage bars and completion streaks
- **Milestone Celebrations** - Celebrate achievements to maintain momentum
- **Productivity Analytics** - Track your learning patterns and growth

### 🧠 Future Self Reflection
- **Time Capsule Messages** - Write messages to your future self and save them securely
- **Personal Memory Vault** - Revisit past goals and compare with present achievements
- **Self-Awareness Tools** - Encourage long-term motivation through reflection
- **Growth Tracking** - See how your thoughts and goals evolve over time

### 🤖 AI-Enhanced Features
- **Smart Task Suggestions** - AI-powered recommendations for task breakdown
- **Automated Milestone Planning** - Break down big goals into manageable steps
- **Personalized Motivation** - AI insights based on your learning patterns
- **Future Self AI** - AI persona of your "future self" for motivational guidance

## 🛠 Tech Stack

### Frontend (React)
- **Framework**: React.js
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router
- **State Management**: Context API
- **Real-time Updates**: Firebase Firestore listeners
- **HTTP Client**: Axios
- **Animations**: Framer Motion

### Backend Services
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore (real-time)
- **File Storage**: Firebase Storage
- **Analytics**: Firebase Analytics
- **Backend API**: Node.js/Express (extendable)

### External Services
- **AI Integration**: OpenAI GPT-3.5/4 (future scope)
- **Email Service**: Nodemailer
- **Cloud Storage**: Cloudinary (for media files)

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Firebase project setup
- Cloudinary account (for media features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd adhyayanmarg-platform
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   npm install
   
   # Install client dependencies
   cd client && npm install
   cd ..
   ```

3. **Firebase Setup**
   - Create a Firebase project
   - Enable Authentication and Firestore
   - Update `client/src/services/firebase.js` with your config

4. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Firebase Admin (for server-side operations)
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY=your-private-key
   FIREBASE_CLIENT_EMAIL=your-client-email
   
   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   
   # Cloudinary (for media uploads)
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

5. **Start the development servers**
   ```bash
   # Start both server and client
   npm run dev
   
   # Or start them separately
   npm run server  # Backend on port 5000
   npm run client  # Frontend on port 3000
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
adhyayanmarg-platform/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   ├── services/      # Firebase services
│   │   ├── utils/         # Utility functions
│   │   └── theme/         # MUI theme configuration
│   └── package.json
├── server/                # Node.js backend
│   ├── models/           # Data models
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   ├── services/         # Business logic services
│   └── server.js         # Main server file
├── package.json
└── README.md
```

## 🎯 Use Cases

### For Students
- **Academic Project Management** - Organize assignments, research, and study schedules
- **Exam Preparation** - Use templates for systematic exam prep
- **Group Projects** - Collaborate with classmates on shared assignments
- **Personal Growth Tracking** - Document learning journey and future goals

### For Self-Learners
- **Skill Development** - Track progress in learning new skills
- **Goal Setting** - Break down big learning goals into manageable tasks
- **Consistency Tracking** - Maintain learning streaks and momentum
- **Reflection Journal** - Connect current efforts with future aspirations

### For Teams
- **Collaborative Learning** - Work together on shared educational goals
- **Project Coordination** - Manage team projects with real-time updates
- **Knowledge Sharing** - Share resources and insights within teams
- **Progress Monitoring** - Track team achievements and milestones

### For Educational Institutions
- **Project-Based Learning** - Support collaborative learning initiatives
- **Student Progress Tracking** - Monitor individual and group progress
- **Resource Management** - Organize educational materials and assignments
- **Student Engagement** - Gamified approach to maintain student motivation

## 🔒 Privacy & Security

- **User Authentication** - Secure Firebase Authentication
- **Data Privacy** - User data is private and secure
- **Real-time Security** - Firestore security rules protect user data
- **File Security** - Secure file uploads and sharing

## 🚀 Deployment

### Production Setup
1. Set up Firebase project with production configuration
2. Configure environment variables for production
3. Set up Cloudinary for media storage
4. Deploy to your preferred platform (Vercel, Heroku, AWS, etc.)

### Environment Variables for Production
```env
NODE_ENV=production
FIREBASE_PROJECT_ID=your-production-project-id
CLIENT_URL=https://your-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Firebase for real-time collaboration capabilities
- Material-UI for beautiful, responsive components
- The educational community for inspiration
- MIT's Future You research for temporal self-continuity concepts

## 📞 Support

- **Email**: support@adhyayanmarg.com
- **Documentation**: [docs.adhyayanmarg.com](https://docs.adhyayanmarg.com)
- **Issues**: [GitHub Issues](https://github.com/your-username/adhyayanmarg-platform/issues)

---

**Made with ❤️ for students, learners, and teams on their path of growth and reflection.**
