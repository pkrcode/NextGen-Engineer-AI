const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['personal', 'team', 'study', 'project'],
    default: 'personal'
  },
  // Ownership and Members
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'member', 'viewer'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Workspace Settings
  isPublic: {
    type: Boolean,
    default: false
  },
  allowInvites: {
    type: Boolean,
    default: true
  },
  // Content
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  // Templates
  template: {
    type: String,
    enum: ['blank', 'study-group', 'project-team', 'research', 'hackathon'],
    default: 'blank'
  },
  // Analytics
  stats: {
    totalTasks: {
      type: Number,
      default: 0
    },
    completedTasks: {
      type: Number,
      default: 0
    },
    totalXP: {
      type: Number,
      default: 0
    }
  },
  // Settings
  settings: {
    autoAssignTasks: {
      type: Boolean,
      default: false
    },
    requireApproval: {
      type: Boolean,
      default: false
    },
    notifications: {
      taskUpdates: {
        type: Boolean,
        default: true
      },
      memberActivity: {
        type: Boolean,
        default: true
      }
    }
  }
}, {
  timestamps: true
});

// Indexes
workspaceSchema.index({ owner: 1 });
workspaceSchema.index({ 'members.user': 1 });
workspaceSchema.index({ type: 1, isPublic: 1 });

// Virtual for completion percentage
workspaceSchema.virtual('completionPercentage').get(function() {
  if (this.stats.totalTasks === 0) return 0;
  return Math.round((this.stats.completedTasks / this.stats.totalTasks) * 100);
});

// Virtual for member count
workspaceSchema.virtual('memberCount').get(function() {
  return this.members.length;
});

// Method to add member
workspaceSchema.methods.addMember = function(userId, role = 'member') {
  const existingMember = this.members.find(member => member.user.toString() === userId.toString());
  
  if (existingMember) {
    existingMember.role = role;
  } else {
    this.members.push({
      user: userId,
      role: role,
      joinedAt: new Date()
    });
  }
  
  return this.save();
};

// Method to remove member
workspaceSchema.methods.removeMember = function(userId) {
  this.members = this.members.filter(member => member.user.toString() !== userId.toString());
  return this.save();
};

// Method to check if user is member
workspaceSchema.methods.isMember = function(userId) {
  return this.members.some(member => member.user.toString() === userId.toString());
};

// Method to check if user has role
workspaceSchema.methods.hasRole = function(userId, role) {
  const member = this.members.find(member => member.user.toString() === userId.toString());
  return member && member.role === role;
};

// Method to update stats
workspaceSchema.methods.updateStats = function() {
  // This would be called after task operations
  return this.populate('tasks').then(() => {
    this.stats.totalTasks = this.tasks.length;
    this.stats.completedTasks = this.tasks.filter(task => task.status === 'completed').length;
    this.stats.totalXP = this.tasks.reduce((total, task) => total + (task.xp || 0), 0);
    return this.save();
  });
};

module.exports = mongoose.model('Workspace', workspaceSchema);
