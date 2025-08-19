const mongoose = require('mongoose');

const roadmapSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  // Career Domain
  domain: {
    type: String,
    enum: ['AI/ML', 'Web Development', 'Mobile Development', 'Data Science', 'Cybersecurity', 'Cloud Computing', 'DevOps', 'Blockchain', 'IoT', 'Game Development', 'UI/UX', 'Software Engineering', 'Civil', 'Mechanical', 'Electrical', 'Chemical', 'Biomedical', 'Aerospace'],
    required: true
  },
  // Difficulty and Level
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'beginner'
  },
  estimatedDuration: {
    type: Number, // in weeks
    default: 12
  },
  // Content Structure
  milestones: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    order: {
      type: Number,
      required: true
    },
    estimatedWeeks: {
      type: Number,
      default: 2
    },
    skills: [{
      name: String,
      level: {
        type: String,
        enum: ['basic', 'intermediate', 'advanced'],
        default: 'basic'
      }
    }],
    resources: [{
      title: String,
      url: String,
      type: {
        type: String,
        enum: ['video', 'article', 'course', 'book', 'project', 'practice'],
        default: 'article'
      },
      description: String,
      isRequired: {
        type: Boolean,
        default: false
      }
    }],
    tasks: [{
      title: String,
      description: String,
      type: {
        type: String,
        enum: ['learning', 'practice', 'project', 'assessment'],
        default: 'learning'
      },
      xp: {
        type: Number,
        default: 10
      },
      isRequired: {
        type: Boolean,
        default: true
      }
    }],
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date
  }],
  // Prerequisites
  prerequisites: [{
    skill: String,
    level: {
      type: String,
      enum: ['basic', 'intermediate', 'advanced'],
      default: 'basic'
    }
  }],
  // Outcomes
  outcomes: [{
    type: String
  }],
  // AI Integration
  aiGenerated: {
    type: Boolean,
    default: false
  },
  aiAdaptive: {
    type: Boolean,
    default: false
  },
  // Customization
  isCustom: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Usage Statistics
  usageCount: {
    type: Number,
    default: 0
  },
  averageCompletionTime: {
    type: Number // in weeks
  },
  successRate: {
    type: Number, // percentage
    min: 0,
    max: 100
  },
  // Tags and Categories
  tags: [{
    type: String,
    trim: true
  }],
  // Visibility
  isPublic: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
roadmapSchema.index({ domain: 1, level: 1 });
roadmapSchema.index({ isPublic: 1, isFeatured: 1 });
roadmapSchema.index({ createdBy: 1 });
roadmapSchema.index({ tags: 1 });

// Virtual for total XP
roadmapSchema.virtual('totalXP').get(function() {
  return this.milestones.reduce((total, milestone) => {
    return total + milestone.tasks.reduce((milestoneTotal, task) => {
      return milestoneTotal + task.xp;
    }, 0);
  }, 0);
});

// Virtual for completion percentage
roadmapSchema.virtual('completionPercentage').get(function() {
  if (this.milestones.length === 0) return 0;
  const completed = this.milestones.filter(milestone => milestone.completed).length;
  return Math.round((completed / this.milestones.length) * 100);
});

// Virtual for estimated total weeks
roadmapSchema.virtual('totalWeeks').get(function() {
  return this.milestones.reduce((total, milestone) => total + milestone.estimatedWeeks, 0);
});

// Method to complete milestone
roadmapSchema.methods.completeMilestone = function(milestoneIndex) {
  if (this.milestones[milestoneIndex]) {
    this.milestones[milestoneIndex].completed = true;
    this.milestones[milestoneIndex].completedAt = new Date();
    return this.save();
  }
  return Promise.reject(new Error('Milestone not found'));
};

// Method to add milestone
roadmapSchema.methods.addMilestone = function(milestoneData) {
  const newMilestone = {
    ...milestoneData,
    order: this.milestones.length + 1
  };
  this.milestones.push(newMilestone);
  return this.save();
};

// Method to update milestone
roadmapSchema.methods.updateMilestone = function(milestoneIndex, updates) {
  if (this.milestones[milestoneIndex]) {
    Object.assign(this.milestones[milestoneIndex], updates);
    return this.save();
  }
  return Promise.reject(new Error('Milestone not found'));
};

// Method to reorder milestones
roadmapSchema.methods.reorderMilestones = function(newOrder) {
  // newOrder should be an array of milestone indices in the desired order
  const reorderedMilestones = newOrder.map((index, newIndex) => ({
    ...this.milestones[index],
    order: newIndex + 1
  }));
  
  this.milestones = reorderedMilestones;
  return this.save();
};

// Method to add resource to milestone
roadmapSchema.methods.addResource = function(milestoneIndex, resource) {
  if (this.milestones[milestoneIndex]) {
    this.milestones[milestoneIndex].resources.push(resource);
    return this.save();
  }
  return Promise.reject(new Error('Milestone not found'));
};

// Method to add task to milestone
roadmapSchema.methods.addTask = function(milestoneIndex, task) {
  if (this.milestones[milestoneIndex]) {
    this.milestones[milestoneIndex].tasks.push(task);
    return this.save();
  }
  return Promise.reject(new Error('Milestone not found'));
};

// Static method to get roadmaps by domain
roadmapSchema.statics.getByDomain = function(domain, options = {}) {
  const query = { domain, isPublic: true };
  
  if (options.level) {
    query.level = options.level;
  }
  
  return this.find(query)
    .populate('createdBy', 'name avatar')
    .sort({ isFeatured: -1, usageCount: -1, createdAt: -1 });
};

// Static method to get featured roadmaps
roadmapSchema.statics.getFeatured = function() {
  return this.find({ isPublic: true, isFeatured: true })
    .populate('createdBy', 'name avatar')
    .sort({ usageCount: -1 });
};

module.exports = mongoose.model('Roadmap', roadmapSchema);
