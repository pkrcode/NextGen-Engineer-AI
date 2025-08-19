const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['achievement', 'milestone', 'streak', 'collaboration', 'learning', 'special'],
    default: 'achievement'
  },
  // Requirements
  requirements: {
    type: {
      type: String,
      enum: ['xp', 'tasks', 'streak', 'roadmap', 'workspace', 'custom'],
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    timeframe: {
      type: String,
      enum: ['once', 'daily', 'weekly', 'monthly', 'yearly'],
      default: 'once'
    },
    conditions: [{
      field: String,
      operator: {
        type: String,
        enum: ['equals', 'greater_than', 'less_than', 'contains', 'in'],
        default: 'equals'
      },
      value: mongoose.Schema.Types.Mixed
    }]
  },
  // Rewards
  rewards: {
    xp: {
      type: Number,
      default: 0
    },
    title: String,
    special: String
  },
  // Rarity
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  // Visual
  color: {
    type: String,
    default: '#3B82F6'
  },
  gradient: {
    start: String,
    end: String
  },
  // Statistics
  earnedCount: {
    type: Number,
    default: 0
  },
  // Visibility
  isActive: {
    type: Boolean,
    default: true
  },
  isHidden: {
    type: Boolean,
    default: false
  },
  // AI Integration
  aiGenerated: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
badgeSchema.index({ category: 1, rarity: 1 });
badgeSchema.index({ 'requirements.type': 1 });
badgeSchema.index({ isActive: 1, isHidden: 1 });

// Virtual for rarity color
badgeSchema.virtual('rarityColor').get(function() {
  const colors = {
    'common': '#6B7280',
    'uncommon': '#10B981',
    'rare': '#3B82F6',
    'epic': '#8B5CF6',
    'legendary': '#F59E0B'
  };
  return colors[this.rarity] || '#6B7280';
});

// Virtual for rarity multiplier
badgeSchema.virtual('rarityMultiplier').get(function() {
  const multipliers = {
    'common': 1,
    'uncommon': 1.5,
    'rare': 2,
    'epic': 3,
    'legendary': 5
  };
  return multipliers[this.rarity] || 1;
});

// Method to check if user qualifies for badge
badgeSchema.methods.checkEligibility = function(userData) {
  const { requirements } = this;
  
  switch (requirements.type) {
    case 'xp':
      return userData.xp >= requirements.value;
    
    case 'tasks':
      return userData.completedTasks >= requirements.value;
    
    case 'streak':
      return userData.streak >= requirements.value;
    
    case 'roadmap':
      return userData.completedRoadmaps >= requirements.value;
    
    case 'workspace':
      return userData.workspaceCount >= requirements.value;
    
    case 'custom':
      // Check custom conditions
      return requirements.conditions.every(condition => {
        const userValue = userData[condition.field];
        
        switch (condition.operator) {
          case 'equals':
            return userValue === condition.value;
          case 'greater_than':
            return userValue > condition.value;
          case 'less_than':
            return userValue < condition.value;
          case 'contains':
            return userValue && userValue.includes(condition.value);
          case 'in':
            return Array.isArray(condition.value) && condition.value.includes(userValue);
          default:
            return false;
        }
      });
    
    default:
      return false;
  }
};

// Method to award badge to user
badgeSchema.methods.awardToUser = function(userId) {
  this.earnedCount += 1;
  return this.save();
};

// Static method to get badges by category
badgeSchema.statics.getByCategory = function(category) {
  return this.find({ category, isActive: true, isHidden: false })
    .sort({ rarity: 1, name: 1 });
};

// Static method to get all active badges
badgeSchema.statics.getActive = function() {
  return this.find({ isActive: true })
    .sort({ category: 1, rarity: 1, name: 1 });
};

// Static method to get rare badges
badgeSchema.statics.getRare = function() {
  return this.find({ 
    isActive: true, 
    rarity: { $in: ['rare', 'epic', 'legendary'] } 
  }).sort({ rarity: -1, earnedCount: 1 });
};

module.exports = mongoose.model('Badge', badgeSchema);
