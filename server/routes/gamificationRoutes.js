const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const Badge = require('../models/Badge');
const Task = require('../models/Task');

// Get user's gamification profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('badges');

    const profile = {
      xp: user.xp,
      level: user.level,
      streak: user.streak,
      nextLevelXP: user.nextLevelXP,
      levelProgress: user.levelProgress,
      badges: user.badges,
      lastActivityDate: user.lastActivityDate
    };

    res.json(profile);
  } catch (error) {
    console.error('Error fetching gamification profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const { type = 'xp', limit = 50, branch, year } = req.query;
    
    const query = { isActive: true };
    
    if (branch) query.branch = branch;
    if (year) query.year = parseInt(year);

    let sortField = 'xp';
    if (type === 'streak') sortField = 'streak';
    if (type === 'level') sortField = 'level';

    const users = await User.find(query)
      .select('name avatar xp level streak branch year')
      .sort({ [sortField]: -1, name: 1 })
      .limit(parseInt(limit));

    res.json(users);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's position in leaderboard
router.get('/leaderboard/position', authMiddleware, async (req, res) => {
  try {
    const { type = 'xp' } = req.query;
    
    let sortField = 'xp';
    if (type === 'streak') sortField = 'streak';
    if (type === 'level') sortField = 'level';

    const position = await User.countDocuments({
      [sortField]: { $gt: req.user[sortField] }
    });

    res.json({ position: position + 1 });
  } catch (error) {
    console.error('Error fetching leaderboard position:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all badges
router.get('/badges', async (req, res) => {
  try {
    const { category, rarity } = req.query;
    
    const query = { isActive: true, isHidden: false };
    
    if (category) query.category = category;
    if (rarity) query.rarity = rarity;

    const badges = await Badge.find(query)
      .sort({ category: 1, rarity: 1, name: 1 });

    res.json(badges);
  } catch (error) {
    console.error('Error fetching badges:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's badges
router.get('/badges/user', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('badges');

    res.json(user.badges);
  } catch (error) {
    console.error('Error fetching user badges:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get badge details
router.get('/badges/:id', async (req, res) => {
  try {
    const badge = await Badge.findById(req.params.id);

    if (!badge) {
      return res.status(404).json({ message: 'Badge not found' });
    }

    res.json(badge);
  } catch (error) {
    console.error('Error fetching badge:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check for new badges (triggered after completing tasks/activities)
router.post('/check-badges', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const newBadges = [];

    // Get user statistics
    const completedTasks = await Task.countDocuments({
      assignedTo: req.user.id,
      status: 'completed'
    });

    const userStats = {
      xp: user.xp,
      streak: user.streak,
      completedTasks,
      workspaceCount: user.workspaces.length,
      completedRoadmaps: user.roadmapProgress.size
    };

    // Get all active badges
    const badges = await Badge.getActive();

    // Check each badge
    for (const badge of badges) {
      if (badge.checkEligibility(userStats)) {
        // Check if user already has this badge
        if (!user.badges.includes(badge._id)) {
          await user.addBadge(badge._id);
          await badge.awardToUser(req.user.id);
          newBadges.push(badge);
        }
      }
    }

    res.json({ newBadges });
  } catch (error) {
    console.error('Error checking badges:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's achievements summary
router.get('/achievements', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('badges');

    const completedTasks = await Task.countDocuments({
      assignedTo: req.user.id,
      status: 'completed'
    });

    const achievements = {
      totalXP: user.xp,
      currentLevel: user.level,
      currentStreak: user.streak,
      totalBadges: user.badges.length,
      completedTasks,
      workspaceCount: user.workspaces.length,
      completedRoadmaps: user.roadmapProgress.size,
      badges: user.badges
    };

    res.json(achievements);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's progress towards next level
router.get('/progress', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const progress = {
      currentXP: user.xp,
      currentLevel: user.level,
      nextLevelXP: user.nextLevelXP,
      levelProgress: user.levelProgress,
      xpToNextLevel: user.nextLevelXP - user.xp,
      streak: user.streak
    };

    res.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get streak statistics
router.get('/streak', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const streakStats = {
      currentStreak: user.streak,
      lastActivityDate: user.lastActivityDate,
      isActiveToday: (() => {
        const today = new Date();
        const lastActivity = new Date(user.lastActivityDate);
        return today.toDateString() === lastActivity.toDateString();
      })()
    };

    res.json(streakStats);
  } catch (error) {
    console.error('Error fetching streak stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get XP history (recent activities)
router.get('/xp-history', authMiddleware, async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    // Get recent completed tasks
    const recentTasks = await Task.find({
      assignedTo: req.user.id,
      status: 'completed'
    })
    .populate('workspace', 'name')
    .sort({ completedAt: -1 })
    .limit(parseInt(limit));

    const xpHistory = recentTasks.map(task => ({
      type: 'task_completion',
      xp: task.xp,
      description: `Completed task: ${task.title}`,
      workspace: task.workspace?.name,
      date: task.completedAt
    }));

    res.json(xpHistory);
  } catch (error) {
    console.error('Error fetching XP history:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get branch-specific leaderboard
router.get('/leaderboard/branch/:branch', async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const users = await User.find({
      branch: req.params.branch,
      isActive: true
    })
    .select('name avatar xp level streak year')
    .sort({ xp: -1, name: 1 })
    .limit(parseInt(limit));

    res.json(users);
  } catch (error) {
    console.error('Error fetching branch leaderboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get year-specific leaderboard
router.get('/leaderboard/year/:year', async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const users = await User.find({
      year: parseInt(req.params.year),
      isActive: true
    })
    .select('name avatar xp level streak branch')
    .sort({ xp: -1, name: 1 })
    .limit(parseInt(limit));

    res.json(users);
  } catch (error) {
    console.error('Error fetching year leaderboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get badge categories
router.get('/badges/categories', async (req, res) => {
  try {
    const categories = [
      'achievement',
      'milestone',
      'streak',
      'collaboration',
      'learning',
      'special'
    ];

    res.json(categories);
  } catch (error) {
    console.error('Error fetching badge categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get badge rarities
router.get('/badges/rarities', async (req, res) => {
  try {
    const rarities = [
      'common',
      'uncommon',
      'rare',
      'epic',
      'legendary'
    ];

    res.json(rarities);
  } catch (error) {
    console.error('Error fetching badge rarities:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's ranking in different categories
router.get('/rankings', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const rankings = {};

    // XP ranking
    const xpRanking = await User.countDocuments({
      xp: { $gt: user.xp },
      isActive: true
    });
    rankings.xp = xpRanking + 1;

    // Level ranking
    const levelRanking = await User.countDocuments({
      level: { $gt: user.level },
      isActive: true
    });
    rankings.level = levelRanking + 1;

    // Streak ranking
    const streakRanking = await User.countDocuments({
      streak: { $gt: user.streak },
      isActive: true
    });
    rankings.streak = streakRanking + 1;

    // Branch ranking
    const branchRanking = await User.countDocuments({
      branch: user.branch,
      xp: { $gt: user.xp },
      isActive: true
    });
    rankings.branch = branchRanking + 1;

    // Year ranking
    const yearRanking = await User.countDocuments({
      year: user.year,
      xp: { $gt: user.xp },
      isActive: true
    });
    rankings.year = yearRanking + 1;

    res.json(rankings);
  } catch (error) {
    console.error('Error fetching rankings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
