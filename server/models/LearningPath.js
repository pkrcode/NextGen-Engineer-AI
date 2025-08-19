const mongoose = require('mongoose');

const learningPathSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  domain: {
    type: String,
    required: true,
    enum: ['Web Development', 'Data Science', 'AI/ML', 'Cybersecurity', 'Mobile Development', 'DevOps', 'Game Development']
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Beginner'
  },
  estimatedDuration: {
    weeks: Number,
    hoursPerWeek: Number
  },
  prerequisites: [{
    skill: String,
    level: String
  }],
  // Skill assessment questions for initial placement
  skillAssessment: {
    questions: [{
      question: String,
      options: [String],
      correctAnswer: Number,
      explanation: String,
      skill: String,
      difficulty: String
    }],
    passingThreshold: {
      type: Number,
      default: 70 // 70% correct to pass
    },
    maxWrongAnswers: {
      type: Number,
      default: 3 // Stop after 3 wrong answers
    }
  },
  // Learning modules with adaptive difficulty
  modules: [{
    title: String,
    description: String,
    order: Number,
    difficulty: String,
    estimatedHours: Number,
    content: {
      theory: [{
        title: String,
        content: String,
        resources: [{
          type: String, // 'video', 'article', 'interactive', 'project'
          title: String,
          url: String,
          description: String
        }]
      }],
      practical: [{
        title: String,
        description: String,
        type: String, // 'exercise', 'project', 'challenge', 'real-world-scenario'
        difficulty: String,
        requirements: [String],
        expectedOutcome: String,
        hints: [String],
        solution: String,
        realWorldContext: String
      }],
      assessments: [{
        title: String,
        type: String, // 'quiz', 'project-review', 'code-review', 'scenario-test'
        questions: [{
          question: String,
          type: String, // 'multiple-choice', 'coding', 'scenario', 'open-ended'
          options: [String],
          correctAnswer: String,
          explanation: String,
          difficulty: String,
          points: Number
        }],
        passingScore: Number
      }]
    },
    adaptiveRules: {
      // Rules for adjusting difficulty based on performance
      difficultyIncrease: {
        threshold: Number, // Score threshold to increase difficulty
        newDifficulty: String
      },
      difficultyDecrease: {
        threshold: Number, // Score threshold to decrease difficulty
        newDifficulty: String
      },
      additionalResources: {
        threshold: Number, // Score threshold to provide extra resources
        resources: [{
          type: String,
          title: String,
          url: String,
          description: String
        }]
      }
    }
  }],
  // Real-world scenarios and projects
  realWorldScenarios: [{
    title: String,
    description: String,
    context: String, // Real business/industry context
    requirements: [String],
    deliverables: [String],
    difficulty: String,
    estimatedTime: Number,
    skills: [String],
    industry: String, // e.g., 'E-commerce', 'Healthcare', 'Finance'
    mentorship: {
      available: Boolean,
      mentorType: String // 'AI', 'Human', 'Both'
    }
  }],
  // AI-powered learning assistance
  aiAssistance: {
    adaptiveQuizzes: Boolean,
    personalizedFeedback: Boolean,
    skillGapAnalysis: Boolean,
    learningPathOptimization: Boolean,
    realTimeHelp: Boolean
  },
  // Progress tracking
  progressTracking: {
    milestones: [{
      title: String,
      description: String,
      criteria: [String],
      reward: {
        type: String, // 'badge', 'certificate', 'points', 'unlock'
        value: String
      }
    }],
    skillMapping: {
      skills: [{
        name: String,
        level: String,
        assessmentCriteria: [String]
      }]
    }
  },
  // Integration with external platforms
  integrations: {
    theOdinProject: {
      enabled: Boolean,
      curriculumMapping: [{
        odinTopic: String,
        ourModule: String,
        difficulty: String
      }]
    },
    otherPlatforms: [{
      name: String,
      url: String,
      integrationType: String
    }]
  },
  // Pricing and access
  pricing: {
    isFree: {
      type: Boolean,
      default: false
    },
    price: {
      amount: Number,
      currency: String,
      period: String // 'one-time', 'monthly', 'yearly'
    },
    features: [String]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for efficient querying
learningPathSchema.index({ domain: 1, difficulty: 1 });
learningPathSchema.index({ 'skillAssessment.questions.skill': 1 });
learningPathSchema.index({ isActive: 1 });

// Static methods
learningPathSchema.statics.findByDomainAndDifficulty = function(domain, difficulty) {
  return this.find({ domain, difficulty, isActive: true }).sort({ title: 1 });
};

learningPathSchema.statics.getSkillAssessment = function(pathId) {
  return this.findById(pathId).select('skillAssessment');
};

learningPathSchema.statics.getAdaptiveModule = function(pathId, moduleIndex, userPerformance) {
  return this.findById(pathId).select(`modules.${moduleIndex}`);
};

module.exports = mongoose.model('LearningPath', learningPathSchema);
