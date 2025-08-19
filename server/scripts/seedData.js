const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Badge = require('../models/Badge');
const Roadmap = require('../models/Roadmap');
const Workspace = require('../models/Workspace');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nextgen-engineer-ai')
  .then(() => console.log('🔄 Connected to MongoDB for seeding'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Seed data
const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Badge.deleteMany({});
    await Roadmap.deleteMany({});
    await Workspace.deleteMany({});

    console.log('🧹 Cleared existing data');

    // Create badges
    const badges = [
      {
        name: 'First Steps',
        description: 'Complete your first task',
        icon: '🎯',
        category: 'achievement',
        requirements: {
          type: 'tasks',
          value: 1,
          timeframe: 'once'
        },
        rewards: { xp: 50 },
        rarity: 'common',
        color: '#10B981'
      },
      {
        name: 'Task Master',
        description: 'Complete 10 tasks',
        icon: '⚡',
        category: 'achievement',
        requirements: {
          type: 'tasks',
          value: 10,
          timeframe: 'once'
        },
        rewards: { xp: 200 },
        rarity: 'uncommon',
        color: '#3B82F6'
      },
      {
        name: 'Streak Warrior',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        category: 'streak',
        requirements: {
          type: 'streak',
          value: 7,
          timeframe: 'once'
        },
        rewards: { xp: 300 },
        rarity: 'rare',
        color: '#F59E0B'
      },
      {
        name: 'Team Player',
        description: 'Join 3 workspaces',
        icon: '👥',
        category: 'collaboration',
        requirements: {
          type: 'workspace',
          value: 3,
          timeframe: 'once'
        },
        rewards: { xp: 150 },
        rarity: 'uncommon',
        color: '#8B5CF6'
      },
      {
        name: 'Roadmap Explorer',
        description: 'Complete your first roadmap milestone',
        icon: '🗺️',
        category: 'learning',
        requirements: {
          type: 'roadmap',
          value: 1,
          timeframe: 'once'
        },
        rewards: { xp: 250 },
        rarity: 'rare',
        color: '#EC4899'
      },
      {
        name: 'XP Collector',
        description: 'Earn 1000 XP',
        icon: '💎',
        category: 'achievement',
        requirements: {
          type: 'xp',
          value: 1000,
          timeframe: 'once'
        },
        rewards: { xp: 500 },
        rarity: 'epic',
        color: '#F59E0B'
      },
      {
        name: 'Legendary Learner',
        description: 'Earn 5000 XP',
        icon: '👑',
        category: 'achievement',
        requirements: {
          type: 'xp',
          value: 5000,
          timeframe: 'once'
        },
        rewards: { xp: 1000, title: 'Legendary Learner' },
        rarity: 'legendary',
        color: '#F59E0B'
      }
    ];

    const createdBadges = await Badge.insertMany(badges);
    console.log(`✅ Created ${createdBadges.length} badges`);

    // Create sample users
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const users = [
      {
        name: 'Alex Johnson',
        email: 'alex@example.com',
        password: hashedPassword,
        branch: 'Computer Science',
        year: 3,
        careerGoal: 'Full-Stack Developer',
        skills: [
          { name: 'JavaScript', level: 'Intermediate' },
          { name: 'React', level: 'Intermediate' },
          { name: 'Node.js', level: 'Beginner' }
        ],
        xp: 1250,
        level: 2,
        streak: 5,
        badges: [createdBadges[0]._id, createdBadges[1]._id],
        role: 'student'
      },
      {
        name: 'Sarah Chen',
        email: 'sarah@example.com',
        password: hashedPassword,
        branch: 'Electrical Engineering',
        year: 2,
        careerGoal: 'Embedded Systems Engineer',
        skills: [
          { name: 'C++', level: 'Intermediate' },
          { name: 'Arduino', level: 'Advanced' },
          { name: 'Circuit Design', level: 'Beginner' }
        ],
        xp: 800,
        level: 1,
        streak: 3,
        badges: [createdBadges[0]._id],
        role: 'student'
      },
      {
        name: 'Mike Rodriguez',
        email: 'mike@example.com',
        password: hashedPassword,
        branch: 'Mechanical Engineering',
        year: 4,
        careerGoal: 'Robotics Engineer',
        skills: [
          { name: 'SolidWorks', level: 'Advanced' },
          { name: 'Python', level: 'Intermediate' },
          { name: '3D Printing', level: 'Expert' }
        ],
        xp: 2100,
        level: 3,
        streak: 12,
        badges: [createdBadges[0]._id, createdBadges[1]._id, createdBadges[2]._id],
        role: 'student'
      },
      {
        name: 'Admin User',
        email: 'admin@nextgen.com',
        password: hashedPassword,
        branch: 'Computer Science',
        year: 4,
        careerGoal: 'Software Architect',
        skills: [
          { name: 'System Design', level: 'Expert' },
          { name: 'Cloud Architecture', level: 'Advanced' },
          { name: 'Team Leadership', level: 'Advanced' }
        ],
        xp: 5000,
        level: 5,
        streak: 30,
        badges: createdBadges.map(badge => badge._id),
        role: 'admin'
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create sample roadmaps
    const roadmaps = [
      {
        title: 'Full-Stack Web Development',
        description: 'Complete roadmap to become a full-stack web developer',
        domain: 'Web Development',
        level: 'beginner',
        estimatedDuration: 16,
        milestones: [
          {
            title: 'HTML & CSS Fundamentals',
            description: 'Learn the basics of web markup and styling',
            order: 1,
            estimatedWeeks: 2,
            skills: [
              { name: 'HTML', level: 'basic' },
              { name: 'CSS', level: 'basic' }
            ],
            resources: [
              {
                title: 'MDN Web Docs - HTML',
                url: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
                type: 'article',
                description: 'Comprehensive HTML documentation',
                isRequired: true
              }
            ],
            tasks: [
              {
                title: 'Create a personal portfolio page',
                description: 'Build a simple portfolio using HTML and CSS',
                type: 'project',
                xp: 50,
                isRequired: true
              }
            ]
          },
          {
            title: 'JavaScript Basics',
            description: 'Learn JavaScript programming fundamentals',
            order: 2,
            estimatedWeeks: 3,
            skills: [
              { name: 'JavaScript', level: 'basic' }
            ],
            resources: [
              {
                title: 'Eloquent JavaScript',
                url: 'https://eloquentjavascript.net/',
                type: 'book',
                description: 'Free online JavaScript book',
                isRequired: true
              }
            ],
            tasks: [
              {
                title: 'Build a calculator app',
                description: 'Create a functional calculator using JavaScript',
                type: 'project',
                xp: 75,
                isRequired: true
              }
            ]
          }
        ],
        prerequisites: [
          { skill: 'Basic Computer Skills', level: 'basic' }
        ],
        outcomes: [
          'Build responsive websites',
          'Create interactive web applications',
          'Understand modern web development practices'
        ],
        isPublic: true,
        isFeatured: true,
        usageCount: 150,
        tags: ['web', 'frontend', 'backend', 'javascript']
      },
      {
        title: 'Machine Learning Fundamentals',
        description: 'Introduction to machine learning and AI',
        domain: 'AI/ML',
        level: 'intermediate',
        estimatedDuration: 20,
        milestones: [
          {
            title: 'Python for Data Science',
            description: 'Learn Python programming for data analysis',
            order: 1,
            estimatedWeeks: 4,
            skills: [
              { name: 'Python', level: 'intermediate' },
              { name: 'NumPy', level: 'basic' },
              { name: 'Pandas', level: 'basic' }
            ],
            resources: [
              {
                title: 'Python for Data Analysis',
                url: 'https://wesmckinney.com/book/',
                type: 'book',
                description: 'Comprehensive guide to pandas',
                isRequired: true
              }
            ],
            tasks: [
              {
                title: 'Data cleaning project',
                description: 'Clean and analyze a real-world dataset',
                type: 'project',
                xp: 100,
                isRequired: true
              }
            ]
          }
        ],
        prerequisites: [
          { skill: 'Python', level: 'basic' },
          { skill: 'Mathematics', level: 'intermediate' }
        ],
        outcomes: [
          'Understand ML algorithms',
          'Build predictive models',
          'Deploy ML solutions'
        ],
        isPublic: true,
        isFeatured: true,
        usageCount: 89,
        tags: ['ai', 'ml', 'python', 'data-science']
      }
    ];

    const createdRoadmaps = await Roadmap.insertMany(roadmaps);
    console.log(`✅ Created ${createdRoadmaps.length} roadmaps`);

    // Create sample workspaces
    const workspaces = [
      {
        name: 'Study Group - Web Development',
        description: 'Collaborative workspace for web development students',
        type: 'study',
        owner: createdUsers[0]._id,
        members: [
          { user: createdUsers[0]._id, role: 'owner' },
          { user: createdUsers[1]._id, role: 'member' },
          { user: createdUsers[2]._id, role: 'member' }
        ],
        isPublic: true,
        template: 'study-group',
        stats: {
          totalTasks: 8,
          completedTasks: 5,
          totalXP: 450
        }
      },
      {
        name: 'Project Team - E-commerce App',
        description: 'Team workspace for building an e-commerce application',
        type: 'project',
        owner: createdUsers[1]._id,
        members: [
          { user: createdUsers[1]._id, role: 'owner' },
          { user: createdUsers[0]._id, role: 'admin' },
          { user: createdUsers[3]._id, role: 'member' }
        ],
        isPublic: false,
        template: 'project-team',
        stats: {
          totalTasks: 15,
          completedTasks: 7,
          totalXP: 800
        }
      },
      {
        name: 'Personal Goals - Alex',
        description: 'Personal workspace for tracking individual goals',
        type: 'personal',
        owner: createdUsers[0]._id,
        members: [
          { user: createdUsers[0]._id, role: 'owner' }
        ],
        isPublic: false,
        template: 'blank',
        stats: {
          totalTasks: 12,
          completedTasks: 8,
          totalXP: 600
        }
      }
    ];

    const createdWorkspaces = await Workspace.insertMany(workspaces);
    console.log(`✅ Created ${createdWorkspaces.length} workspaces`);

    // Update users with workspace references
    for (let i = 0; i < createdUsers.length; i++) {
      const user = createdUsers[i];
      const userWorkspaces = createdWorkspaces.filter(ws => 
        ws.owner.toString() === user._id.toString() ||
        ws.members.some(m => m.user.toString() === user._id.toString())
      );
      
      user.workspaces = userWorkspaces.map(ws => ws._id);
      await user.save();
    }

    console.log('✅ Updated users with workspace references');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- ${createdBadges.length} badges created`);
    console.log(`- ${createdUsers.length} users created`);
    console.log(`- ${createdRoadmaps.length} roadmaps created`);
    console.log(`- ${createdWorkspaces.length} workspaces created`);
    console.log('\n🔑 Default login credentials:');
    console.log('Email: admin@nextgen.com');
    console.log('Password: password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run seeding
seedData();
