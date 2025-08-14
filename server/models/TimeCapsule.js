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
    trim: true,
    maxlength: 100
  },
  message: {
    type: String,
    required: true,
    maxlength: 5000
  },
  messageType: {
    type: String,
    enum: ['text', 'voice', 'video'],
    default: 'text'
  },
  mediaUrl: {
    type: String,
    default: null
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  isDelivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: {
    type: Date,
    default: null
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  aiEnhanced: {
    type: Boolean,
    default: false
  },
  aiSuggestions: {
    type: [String],
    default: []
  },
  tags: {
    type: [String],
    default: []
  },
  category: {
    type: String,
    enum: ['personal', 'career', 'health', 'relationships', 'goals', 'reflection', 'other'],
    default: 'personal'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  deliveryMethod: {
    type: String,
    enum: ['email', 'app', 'both'],
    default: 'app'
  },
  emailSent: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient querying
timeCapsuleSchema.index({ user: 1, scheduledDate: 1 });
timeCapsuleSchema.index({ scheduledDate: 1, isDelivered: 1 });
timeCapsuleSchema.index({ isPublic: 1, createdAt: -1 });

// Virtual for time until delivery
timeCapsuleSchema.virtual('timeUntilDelivery').get(function() {
  if (this.isDelivered) return 0;
  return Math.max(0, this.scheduledDate.getTime() - Date.now());
});

// Virtual for delivery status
timeCapsuleSchema.virtual('deliveryStatus').get(function() {
  if (this.isDelivered) return 'delivered';
  if (this.scheduledDate < new Date()) return 'overdue';
  return 'pending';
});

// Pre-save middleware to update updatedAt
timeCapsuleSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Method to mark as delivered
timeCapsuleSchema.methods.markAsDelivered = function() {
  this.isDelivered = true;
  this.deliveredAt = new Date();
  return this.save();
};

// Static method to find pending deliveries
timeCapsuleSchema.statics.findPendingDeliveries = function() {
  return this.find({
    scheduledDate: { $lte: new Date() },
    isDelivered: false
  }).populate('user', 'email name');
};

// Static method to find user's time capsules
timeCapsuleSchema.statics.findByUser = function(userId, options = {}) {
  const query = { user: userId };
  
  if (options.delivered !== undefined) {
    query.isDelivered = options.delivered;
  }
  
  if (options.category) {
    query.category = options.category;
  }
  
  return this.find(query)
    .sort({ scheduledDate: options.sort === 'asc' ? 1 : -1 })
    .limit(options.limit || 50);
};

module.exports = mongoose.model('TimeCapsule', timeCapsuleSchema);
