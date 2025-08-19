const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  // Sender
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Workspace context
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true
  },
  // Message type
  type: {
    type: String,
    enum: ['text', 'image', 'file', 'task', 'system', 'reaction'],
    default: 'text'
  },
  // Message metadata
  metadata: {
    fileName: String,
    fileSize: Number,
    fileType: String,
    fileUrl: String,
    imageUrl: String,
    thumbnailUrl: String,
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    },
    reaction: String
  },
  // Message status
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent'
  },
  // Read receipts
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Replies
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  // Thread
  thread: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  // Reactions
  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    emoji: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Mentions
  mentions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // AI Integration
  aiGenerated: {
    type: Boolean,
    default: false
  },
  aiContext: {
    type: String,
    enum: ['task-suggestion', 'resource-recommendation', 'motivation', 'reminder', 'other'],
    default: 'other'
  },
  // Moderation
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: Date,
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
messageSchema.index({ workspace: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ thread: 1, createdAt: 1 });
messageSchema.index({ 'mentions': 1 });

// Virtual for reaction count
messageSchema.virtual('reactionCount').get(function() {
  return this.reactions.length;
});

// Virtual for read count
messageSchema.virtual('readCount').get(function() {
  return this.readBy.length;
});

// Method to mark as read
messageSchema.methods.markAsRead = function(userId) {
  const existingRead = this.readBy.find(read => read.user.toString() === userId.toString());
  
  if (!existingRead) {
    this.readBy.push({
      user: userId,
      readAt: new Date()
    });
    this.status = 'read';
    return this.save();
  }
  
  return Promise.resolve(this);
};

// Method to add reaction
messageSchema.methods.addReaction = function(userId, emoji) {
  const existingReaction = this.reactions.find(
    reaction => reaction.user.toString() === userId.toString() && reaction.emoji === emoji
  );
  
  if (!existingReaction) {
    this.reactions.push({
      user: userId,
      emoji: emoji,
      createdAt: new Date()
    });
    return this.save();
  }
  
  return Promise.resolve(this);
};

// Method to remove reaction
messageSchema.methods.removeReaction = function(userId, emoji) {
  this.reactions = this.reactions.filter(
    reaction => !(reaction.user.toString() === userId.toString() && reaction.emoji === emoji)
  );
  return this.save();
};

// Method to edit message
messageSchema.methods.edit = function(newContent) {
  this.content = newContent;
  this.isEdited = true;
  this.editedAt = new Date();
  return this.save();
};

// Method to delete message
messageSchema.methods.deleteMessage = function(userId) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.deletedBy = userId;
  return this.save();
};

// Method to get reaction summary
messageSchema.methods.getReactionSummary = function() {
  const summary = {};
  this.reactions.forEach(reaction => {
    if (!summary[reaction.emoji]) {
      summary[reaction.emoji] = [];
    }
    summary[reaction.emoji].push(reaction.user);
  });
  return summary;
};

// Static method to get messages by workspace
messageSchema.statics.getByWorkspace = function(workspaceId, options = {}) {
  const query = { 
    workspace: workspaceId, 
    isDeleted: false 
  };
  
  if (options.thread) {
    query.thread = options.thread;
  }
  
  if (options.before) {
    query.createdAt = { $lt: options.before };
  }
  
  if (options.after) {
    query.createdAt = { $gt: options.after };
  }
  
  return this.find(query)
    .populate('sender', 'name avatar')
    .populate('replyTo', 'content sender')
    .populate('mentions', 'name avatar')
    .populate('readBy.user', 'name avatar')
    .populate('reactions.user', 'name avatar')
    .sort({ createdAt: -1 })
    .limit(options.limit || 50);
};

// Static method to get unread count for user
messageSchema.statics.getUnreadCount = function(workspaceId, userId) {
  return this.countDocuments({
    workspace: workspaceId,
    sender: { $ne: userId },
    'readBy.user': { $ne: userId },
    isDeleted: false
  });
};

module.exports = mongoose.model('Message', messageSchema);
