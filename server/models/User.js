const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  avatar: {
    type: String,
    default: ''
  },
  // Career Information
  branch: {
    type: String,
    enum: ['Computer Science', 'Electrical', 'Mechanical', 'Civil', 'Chemical', 'Biomedical', 'Aerospace', 'Other'],
    required: true
  },
  year: {
    type: Number,
    min: 1,
    max: 4,
    required: true
  },
  careerGoal: {
    type: String,
    required: true
  },
  skills: [{
    name: String,
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Beginner'
    }
  }],
  // Gamification
  xp: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  streak: {
    type: Number,
    default: 0
  },
  lastActivityDate: {
    type: Date,
    default: Date.now
  },
  badges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Badge'
  }],
  // Preferences
  theme: {
    type: String,
    enum: ['light', 'dark', 'system'],
    default: 'system'
  },
  notifications: {
    email: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: true
    }
  },
  // Workspace Management
  workspaces: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace'
  }],
  // Roadmap Progress
  activeRoadmap: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Roadmap'
  },
  roadmapProgress: {
    type: Map,
    of: Number, // percentage completion
    default: new Map()
  },
  // Social Features
  connections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Account Status
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ xp: -1 }); // For leaderboards
userSchema.index({ branch: 1, year: 1 }); // For filtering

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return this.name;
});

// Virtual for next level XP requirement
userSchema.virtual('nextLevelXP').get(function() {
  return this.level * 1000; // Simple progression: 1000 XP per level
});

// Virtual for progress to next level
userSchema.virtual('levelProgress').get(function() {
  const currentLevelXP = (this.level - 1) * 1000;
  const nextLevelXP = this.level * 1000;
  const progressInLevel = this.xp - currentLevelXP;
  const xpNeededForLevel = nextLevelXP - currentLevelXP;
  return Math.min(100, Math.max(0, (progressInLevel / xpNeededForLevel) * 100));
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to add XP
userSchema.methods.addXP = function(amount) {
  this.xp += amount;
  
  // Check for level up
  const nextLevelXP = this.level * 1000;
  if (this.xp >= nextLevelXP) {
    this.level += 1;
  }
  
  return this.save();
};

// Method to update streak
userSchema.methods.updateStreak = function() {
  const today = new Date();
  const lastActivity = new Date(this.lastActivityDate);
  const daysDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === 1) {
    // Consecutive day
    this.streak += 1;
  } else if (daysDiff > 1) {
    // Streak broken
    this.streak = 1;
  }
  // If daysDiff === 0, same day, don't change streak
  
  this.lastActivityDate = today;
  return this.save();
};

// Method to add badge
userSchema.methods.addBadge = function(badgeId) {
  if (!this.badges.includes(badgeId)) {
    this.badges.push(badgeId);
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function() {
  return {
    _id: this._id,
    name: this.name,
    avatar: this.avatar,
    branch: this.branch,
    year: this.year,
    careerGoal: this.careerGoal,
    skills: this.skills,
    xp: this.xp,
    level: this.level,
    streak: this.streak,
    badges: this.badges,
    isActive: this.isActive,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('User', userSchema);
