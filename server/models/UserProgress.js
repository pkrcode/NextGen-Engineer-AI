const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  learningPathId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LearningPath',
    required: true
  },
  // Initial skill assessment results
  skillAssessment: {
    completed: {
      type: Boolean,
      default: false
    },
    score: Number,
    totalQuestions: Number,
    correctAnswers: Number,
    wrongAnswers: Number,
    timeTaken: Number, // in minutes
    recommendedDifficulty: String,
    skillGaps: [{
      skill: String,
      currentLevel: String,
      targetLevel: String,
      gapDescription: String
    }],
    aiRecommendations: [{
      type: String, // 'prerequisite', 'focus-area', 'skip-module', 'additional-resource'
      description: String,
      priority: String // 'high', 'medium', 'low'
    }]
  },
  // Current progress through modules
  currentModule: {
    moduleIndex: {
      type: Number,
      default: 0
    },
    moduleId: String,
    startedAt: Date,
    completedAt: Date,
    status: {
      type: String,
      enum: ['not-started', 'in-progress', 'completed', 'failed'],
      default: 'not-started'
    },
    adaptiveDifficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Beginner'
    },
    performance: {
      theoryScore: Number,
      practicalScore: Number,
      assessmentScore: Number,
      overallScore: Number
    }
  },
  // Module completion history
  completedModules: [{
    moduleIndex: Number,
    moduleId: String,
    completedAt: Date,
    finalDifficulty: String,
    performance: {
      theoryScore: Number,
      practicalScore: Number,
      assessmentScore: Number,
      overallScore: Number
    },
    timeSpent: Number, // in hours
    attempts: Number,
    adaptiveAdjustments: [{
      type: String, // 'difficulty-increase', 'difficulty-decrease', 'additional-resources'
      reason: String,
      timestamp: Date
    }]
  }],
  // Real-world project progress
  realWorldProjects: [{
    projectId: String,
    title: String,
    status: {
      type: String,
      enum: ['not-started', 'in-progress', 'review', 'completed'],
      default: 'not-started'
    },
    startedAt: Date,
    completedAt: Date,
    mentorFeedback: [{
      mentorId: String,
      mentorType: String, // 'AI', 'Human'
      feedback: String,
      rating: Number,
      timestamp: Date
    }],
    deliverables: [{
      name: String,
      status: String,
      submittedAt: Date,
      reviewedAt: Date,
      score: Number
    }],
    industryContext: String,
    skillsDemonstrated: [String]
  }],
  // AI assistance usage
  aiAssistance: {
    totalInteractions: {
      type: Number,
      default: 0
    },
    helpRequests: [{
      type: String, // 'concept-explanation', 'code-review', 'debugging', 'project-guidance'
      moduleId: String,
      question: String,
      aiResponse: String,
      helpful: Boolean,
      timestamp: Date
    }],
    adaptiveQuizzesTaken: [{
      quizId: String,
      score: Number,
      difficulty: String,
      questionsAnswered: Number,
      timestamp: Date
    }],
    skillGapAnalysis: [{
      analysisDate: Date,
      gaps: [{
        skill: String,
        currentLevel: String,
        targetLevel: String,
        recommendedActions: [String]
      }]
    }]
  },
  // Learning analytics
  analytics: {
    totalTimeSpent: Number, // in hours
    averageSessionLength: Number, // in minutes
    completionRate: Number, // percentage
    difficultyProgression: [{
      moduleIndex: Number,
      difficulty: String,
      timestamp: Date
    }],
    learningVelocity: Number, // modules completed per week
    retentionRate: Number, // percentage of concepts retained
    engagementScore: Number, // based on interactions, time spent, etc.
    lastActive: Date
  },
  // Certificates and achievements
  achievements: [{
    type: String, // 'module-completion', 'skill-mastery', 'project-completion', 'streak'
    title: String,
    description: String,
    earnedAt: Date,
    badge: String,
    points: Number
  }],
  // Learning path customization
  customizations: {
    skippedModules: [Number],
    additionalResources: [{
      type: String,
      title: String,
      url: String,
      reason: String
    }],
    focusAreas: [{
      skill: String,
      priority: String,
      additionalTime: Number
    }],
    aiGeneratedPath: {
      isCustomized: Boolean,
      customizationReason: String,
      originalPath: String,
      modifiedPath: String
    }
  },
  // Overall progress status
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'paused', 'completed', 'abandoned'],
    default: 'not-started'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  estimatedCompletionDate: Date,
  actualCompletionDate: Date,
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
userProgressSchema.index({ userId: 1, learningPathId: 1 });
userProgressSchema.index({ userId: 1, status: 1 });
userProgressSchema.index({ 'currentModule.status': 1 });

// Instance methods
userProgressSchema.methods.updateProgress = function(moduleIndex, performance) {
  this.currentModule.performance = performance;
  this.currentModule.moduleIndex = moduleIndex;
  this.lastUpdated = new Date();
  return this.save();
};

userProgressSchema.methods.completeModule = function(moduleIndex, finalPerformance) {
  const completedModule = {
    moduleIndex,
    moduleId: this.currentModule.moduleId,
    completedAt: new Date(),
    finalDifficulty: this.currentModule.adaptiveDifficulty,
    performance: finalPerformance,
    timeSpent: this.currentModule.timeSpent || 0,
    attempts: 1
  };
  
  this.completedModules.push(completedModule);
  this.currentModule.moduleIndex = moduleIndex + 1;
  this.currentModule.status = 'completed';
  this.lastUpdated = new Date();
  
  return this.save();
};

userProgressSchema.methods.adjustDifficulty = function(newDifficulty, reason) {
  this.currentModule.adaptiveDifficulty = newDifficulty;
  this.currentModule.adaptiveAdjustments.push({
    type: 'difficulty-adjustment',
    reason,
    timestamp: new Date()
  });
  return this.save();
};

// Static methods
userProgressSchema.statics.findByUserAndPath = function(userId, learningPathId) {
  return this.findOne({ userId, learningPathId });
};

userProgressSchema.statics.getUserProgress = function(userId) {
  return this.find({ userId }).populate('learningPathId');
};

userProgressSchema.statics.getAnalytics = function(userId) {
  return this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalPaths: { $sum: 1 },
        completedPaths: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
        averageCompletionRate: { $avg: '$analytics.completionRate' },
        totalTimeSpent: { $sum: '$analytics.totalTimeSpent' }
      }
    }
  ]);
};

module.exports = mongoose.model('UserProgress', userProgressSchema);
