const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  // Task Details
  type: {
    type: String,
    enum: ['task', 'milestone', 'goal', 'study', 'project'],
    default: 'task'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'review', 'completed', 'cancelled'],
    default: 'pending'
  },
  // Assignment
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Workspace and Project
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  // Dependencies
  dependencies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  subtasks: [{
    title: String,
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date
  }],
  // Time Management
  dueDate: {
    type: Date
  },
  estimatedHours: {
    type: Number,
    min: 0
  },
  actualHours: {
    type: Number,
    min: 0
  },
  startedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  // Gamification
  xp: {
    type: Number,
    default: 0
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'expert'],
    default: 'medium'
  },
  // Tags and Categories
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    trim: true
  },
  // Progress Tracking
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  // Comments and Notes
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Attachments
  attachments: [{
    name: String,
    url: String,
    type: String,
    size: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // AI Integration
  aiGenerated: {
    type: Boolean,
    default: false
  },
  aiSuggestions: [{
    type: String
  }]
}, {
  timestamps: true
});

// Indexes
taskSchema.index({ workspace: 1, status: 1 });
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ createdBy: 1 });

// Virtual for overdue status
taskSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate || this.status === 'completed') return false;
  return new Date() > this.dueDate;
});

// Virtual for completion percentage based on subtasks
taskSchema.virtual('subtaskProgress').get(function() {
  if (this.subtasks.length === 0) return 0;
  const completed = this.subtasks.filter(subtask => subtask.completed).length;
  return Math.round((completed / this.subtasks.length) * 100);
});

// Pre-save middleware to calculate XP based on difficulty
taskSchema.pre('save', function(next) {
  if (this.isModified('difficulty') || this.isNew) {
    const xpMap = {
      'easy': 10,
      'medium': 25,
      'hard': 50,
      'expert': 100
    };
    this.xp = xpMap[this.difficulty] || 25;
  }
  
  // Update completion time when status changes to completed
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  
  // Update start time when status changes to in-progress
  if (this.isModified('status') && this.status === 'in-progress' && !this.startedAt) {
    this.startedAt = new Date();
  }
  
  next();
});

// Method to add comment
taskSchema.methods.addComment = function(userId, content) {
  this.comments.push({
    user: userId,
    content: content
  });
  return this.save();
};

// Method to add subtask
taskSchema.methods.addSubtask = function(title) {
  this.subtasks.push({
    title: title,
    completed: false
  });
  return this.save();
};

// Method to complete subtask
taskSchema.methods.completeSubtask = function(subtaskIndex) {
  if (this.subtasks[subtaskIndex]) {
    this.subtasks[subtaskIndex].completed = true;
    this.subtasks[subtaskIndex].completedAt = new Date();
    return this.save();
  }
  return Promise.reject(new Error('Subtask not found'));
};

// Method to update progress
taskSchema.methods.updateProgress = function(progress) {
  this.progress = Math.max(0, Math.min(100, progress));
  
  // Auto-complete if progress is 100%
  if (this.progress === 100 && this.status !== 'completed') {
    this.status = 'completed';
    this.completedAt = new Date();
  }
  
  return this.save();
};

// Method to assign task
taskSchema.methods.assignTo = function(userId) {
  this.assignedTo = userId;
  return this.save();
};

// Method to add attachment
taskSchema.methods.addAttachment = function(name, url, type, size) {
  this.attachments.push({
    name,
    url,
    type,
    size,
    uploadedAt: new Date()
  });
  return this.save();
};

// Static method to get tasks by workspace
taskSchema.statics.getByWorkspace = function(workspaceId, options = {}) {
  const query = { workspace: workspaceId };
  
  if (options.status) {
    query.status = options.status;
  }
  
  if (options.assignedTo) {
    query.assignedTo = options.assignedTo;
  }
  
  return this.find(query)
    .populate('assignedTo', 'name avatar')
    .populate('createdBy', 'name avatar')
    .sort({ createdAt: -1 });
};

module.exports = mongoose.model('Task', taskSchema);
