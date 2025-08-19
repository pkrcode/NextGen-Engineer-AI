const mongoose = require('mongoose');

const timeCapsuleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  // Message Type
  type: {
    type: String,
    enum: ['text', 'audio', 'video', 'image', 'career-goal', 'reflection', 'motivation'],
    default: 'text'
  },
  // Media Content
  mediaUrl: {
    type: String
  },
  mediaType: {
    type: String,
    enum: ['audio', 'video', 'image']
  },
  mediaDuration: {
    type: Number // in seconds
  },
  thumbnailUrl: {
    type: String
  },
  // Delivery Settings
  deliveryDate: {
    type: Date,
    required: true
  },
  isDelivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: {
    type: Date
  },
  // Career Context
  careerContext: {
    currentRole: String,
    targetRole: String,
    skills: [String],
    goals: [String],
    challenges: [String],
    achievements: [String]
  },
  // Reflection Questions
  reflectionQuestions: [{
    question: String,
    answer: String
  }],
  // Motivation and Goals
  motivation: {
    currentMotivation: {
      type: String,
      enum: ['low', 'medium', 'high', 'very-high'],
      default: 'medium'
    },
    goals: [{
      title: String,
      targetDate: Date,
      completed: {
        type: Boolean,
        default: false
      }
    }],
    affirmations: [String]
  },
  // Academic Context
  academicContext: {
    semester: String,
    courses: [String],
    projects: [String],
    grades: [{
      course: String,
      grade: String,
      semester: String
    }]
  },
  // Personal Development
  personalDevelopment: {
    habits: [{
      name: String,
      frequency: String,
      completed: {
        type: Boolean,
        default: false
      }
    }],
    skillsToLearn: [String],
    booksToRead: [String],
    peopleToConnect: [String]
  },
  // Settings
  settings: {
    reminderBeforeDelivery: {
      type: Boolean,
      default: true
    },
    reminderDays: {
      type: Number,
      default: 7
    },
    allowEarlyAccess: {
      type: Boolean,
      default: false
    },
    shareWithMentor: {
      type: Boolean,
      default: false
    }
  },
  // Tags and Categories
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    enum: ['career', 'academic', 'personal', 'reflection', 'motivation', 'goals'],
    default: 'personal'
  },
  // AI Integration
  aiGenerated: {
    type: Boolean,
    default: false
  },
  aiSuggestions: [{
    type: String
  }],
  // Privacy
  isPrivate: {
    type: Boolean,
    default: true
  },
  // Recipients (for shared capsules)
  recipients: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['mentor', 'friend', 'family', 'colleague'],
      default: 'friend'
    }
  }]
}, {
  timestamps: true
});

// Indexes
timeCapsuleSchema.index({ user: 1, deliveryDate: 1 });
timeCapsuleSchema.index({ deliveryDate: 1, isDelivered: 1 });
timeCapsuleSchema.index({ category: 1, isPrivate: 1 });

// Virtual for time until delivery
timeCapsuleSchema.virtual('timeUntilDelivery').get(function() {
  if (this.isDelivered) return 0;
  const now = new Date();
  const delivery = new Date(this.deliveryDate);
  return Math.max(0, delivery.getTime() - now.getTime());
});

// Virtual for days until delivery
timeCapsuleSchema.virtual('daysUntilDelivery').get(function() {
  return Math.ceil(this.timeUntilDelivery / (1000 * 60 * 60 * 24));
});

// Virtual for is overdue
timeCapsuleSchema.virtual('isOverdue').get(function() {
  if (this.isDelivered) return false;
  return new Date() > this.deliveryDate;
});

// Pre-save middleware to validate delivery date
timeCapsuleSchema.pre('save', function(next) {
  if (this.deliveryDate && this.deliveryDate <= new Date()) {
    return next(new Error('Delivery date must be in the future'));
  }
  next();
});

// Method to mark as delivered
timeCapsuleSchema.methods.markAsDelivered = function() {
  this.isDelivered = true;
  this.deliveredAt = new Date();
  return this.save();
};

// Method to add reflection question
timeCapsuleSchema.methods.addReflectionQuestion = function(question, answer = '') {
  this.reflectionQuestions.push({
    question: question,
    answer: answer
  });
  return this.save();
};

// Method to add goal
timeCapsuleSchema.methods.addGoal = function(title, targetDate) {
  this.motivation.goals.push({
    title: title,
    targetDate: targetDate,
    completed: false
  });
  return this.save();
};

// Method to complete goal
timeCapsuleSchema.methods.completeGoal = function(goalIndex) {
  if (this.motivation.goals[goalIndex]) {
    this.motivation.goals[goalIndex].completed = true;
    return this.save();
  }
  return Promise.reject(new Error('Goal not found'));
};

// Method to add habit
timeCapsuleSchema.methods.addHabit = function(name, frequency) {
  this.personalDevelopment.habits.push({
    name: name,
    frequency: frequency,
    completed: false
  });
  return this.save();
};

// Method to add recipient
timeCapsuleSchema.methods.addRecipient = function(userId, role = 'friend') {
  const existingRecipient = this.recipients.find(
    recipient => recipient.user.toString() === userId.toString()
  );
  
  if (!existingRecipient) {
    this.recipients.push({
      user: userId,
      role: role
    });
    return this.save();
  }
  
  return Promise.resolve(this);
};

// Static method to get capsules by user
timeCapsuleSchema.statics.getByUser = function(userId, options = {}) {
  const query = { user: userId };
  
  if (options.category) {
    query.category = options.category;
  }
  
  if (options.isDelivered !== undefined) {
    query.isDelivered = options.isDelivered;
  }
  
  return this.find(query)
    .populate('recipients.user', 'name avatar')
    .sort({ deliveryDate: 1 });
};

// Static method to get capsules ready for delivery
timeCapsuleSchema.statics.getReadyForDelivery = function() {
  return this.find({
    deliveryDate: { $lte: new Date() },
    isDelivered: false
  }).populate('user', 'name email');
};

// Static method to get shared capsules
timeCapsuleSchema.statics.getSharedWithUser = function(userId) {
  return this.find({
    'recipients.user': userId,
    isPrivate: false
  }).populate('user', 'name avatar');
};

module.exports = mongoose.model('TimeCapsule', timeCapsuleSchema);
