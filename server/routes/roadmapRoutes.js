const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Roadmap = require('../models/Roadmap');
const User = require('../models/User');

// Get all roadmaps (public and user's custom ones)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { domain, level, isCustom } = req.query;
    
    const query = {};
    
    if (domain) query.domain = domain;
    if (level) query.level = level;
    if (isCustom !== undefined) {
      query.isCustom = isCustom === 'true';
      if (isCustom === 'true') {
        query.createdBy = req.user.id;
      }
    } else {
      // Get public roadmaps and user's custom ones
      query.$or = [
        { isPublic: true },
        { createdBy: req.user.id }
      ];
    }

    const roadmaps = await Roadmap.find(query)
      .populate('createdBy', 'name avatar')
      .sort({ isFeatured: -1, usageCount: -1, createdAt: -1 });

    res.json(roadmaps);
  } catch (error) {
    console.error('Error fetching roadmaps:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get featured roadmaps
router.get('/featured', async (req, res) => {
  try {
    const roadmaps = await Roadmap.getFeatured();
    res.json(roadmaps);
  } catch (error) {
    console.error('Error fetching featured roadmaps:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get roadmaps by domain
router.get('/domain/:domain', async (req, res) => {
  try {
    const { level } = req.query;
    const roadmaps = await Roadmap.getByDomain(req.params.domain, { level });
    res.json(roadmaps);
  } catch (error) {
    console.error('Error fetching roadmaps by domain:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific roadmap
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id)
      .populate('createdBy', 'name avatar');

    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    // Check if user has access (public or owner)
    if (!roadmap.isPublic && roadmap.createdBy?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(roadmap);
  } catch (error) {
    console.error('Error fetching roadmap:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a custom roadmap
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      domain,
      level,
      estimatedDuration,
      milestones,
      prerequisites,
      outcomes,
      tags
    } = req.body;

    const roadmap = new Roadmap({
      title,
      description,
      domain,
      level: level || 'beginner',
      estimatedDuration: estimatedDuration || 12,
      milestones: milestones || [],
      prerequisites: prerequisites || [],
      outcomes: outcomes || [],
      tags: tags || [],
      isCustom: true,
      isPublic: false,
      createdBy: req.user.id
    });

    await roadmap.save();

    await roadmap.populate('createdBy', 'name avatar');

    res.status(201).json(roadmap);
  } catch (error) {
    console.error('Error creating roadmap:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a roadmap (only custom ones)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);

    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    // Only creator can update custom roadmaps
    if (!roadmap.isCustom || roadmap.createdBy?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const {
      title,
      description,
      domain,
      level,
      estimatedDuration,
      milestones,
      prerequisites,
      outcomes,
      tags,
      isPublic
    } = req.body;

    if (title) roadmap.title = title;
    if (description !== undefined) roadmap.description = description;
    if (domain) roadmap.domain = domain;
    if (level) roadmap.level = level;
    if (estimatedDuration) roadmap.estimatedDuration = estimatedDuration;
    if (milestones) roadmap.milestones = milestones;
    if (prerequisites) roadmap.prerequisites = prerequisites;
    if (outcomes) roadmap.outcomes = outcomes;
    if (tags) roadmap.tags = tags;
    if (isPublic !== undefined) roadmap.isPublic = isPublic;

    await roadmap.save();

    await roadmap.populate('createdBy', 'name avatar');

    res.json(roadmap);
  } catch (error) {
    console.error('Error updating roadmap:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a roadmap (only custom ones)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);

    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    // Only creator can delete custom roadmaps
    if (!roadmap.isCustom || roadmap.createdBy?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await roadmap.remove();

    res.json({ message: 'Roadmap deleted successfully' });
  } catch (error) {
    console.error('Error deleting roadmap:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start a roadmap (set as active roadmap for user)
router.post('/:id/start', authMiddleware, async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);

    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    // Check if user has access
    if (!roadmap.isPublic && roadmap.createdBy?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(req.user.id);
    user.activeRoadmap = roadmap._id;
    
    // Initialize progress tracking
    user.roadmapProgress.set(roadmap._id.toString(), 0);
    
    await user.save();

    // Increment usage count
    roadmap.usageCount += 1;
    await roadmap.save();

    res.json({ message: 'Roadmap started successfully', roadmap });
  } catch (error) {
    console.error('Error starting roadmap:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Complete a milestone
router.post('/:id/milestones/:milestoneIndex/complete', authMiddleware, async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);

    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    // Check if user has access
    if (!roadmap.isPublic && roadmap.createdBy?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const milestoneIndex = parseInt(req.params.milestoneIndex);
    
    if (milestoneIndex < 0 || milestoneIndex >= roadmap.milestones.length) {
      return res.status(400).json({ message: 'Invalid milestone index' });
    }

    await roadmap.completeMilestone(milestoneIndex);

    // Update user progress
    const user = await User.findById(req.user.id);
    const progress = roadmap.completionPercentage;
    user.roadmapProgress.set(roadmap._id.toString(), progress);
    
    // Award XP for milestone completion
    const milestone = roadmap.milestones[milestoneIndex];
    const totalMilestoneXP = milestone.tasks.reduce((total, task) => total + task.xp, 0);
    await user.addXP(totalMilestoneXP);
    
    await user.save();

    res.json({ message: 'Milestone completed successfully', roadmap });
  } catch (error) {
    console.error('Error completing milestone:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add milestone to roadmap
router.post('/:id/milestones', authMiddleware, async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);

    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    // Only creator can add milestones to custom roadmaps
    if (!roadmap.isCustom || roadmap.createdBy?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const milestoneData = req.body;
    await roadmap.addMilestone(milestoneData);

    await roadmap.populate('createdBy', 'name avatar');

    res.json(roadmap);
  } catch (error) {
    console.error('Error adding milestone:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update milestone
router.put('/:id/milestones/:milestoneIndex', authMiddleware, async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);

    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    // Only creator can update custom roadmaps
    if (!roadmap.isCustom || roadmap.createdBy?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const milestoneIndex = parseInt(req.params.milestoneIndex);
    
    if (milestoneIndex < 0 || milestoneIndex >= roadmap.milestones.length) {
      return res.status(400).json({ message: 'Invalid milestone index' });
    }

    await roadmap.updateMilestone(milestoneIndex, req.body);

    await roadmap.populate('createdBy', 'name avatar');

    res.json(roadmap);
  } catch (error) {
    console.error('Error updating milestone:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add resource to milestone
router.post('/:id/milestones/:milestoneIndex/resources', authMiddleware, async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);

    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    // Only creator can add resources to custom roadmaps
    if (!roadmap.isCustom || roadmap.createdBy?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const milestoneIndex = parseInt(req.params.milestoneIndex);
    
    if (milestoneIndex < 0 || milestoneIndex >= roadmap.milestones.length) {
      return res.status(400).json({ message: 'Invalid milestone index' });
    }

    await roadmap.addResource(milestoneIndex, req.body);

    await roadmap.populate('createdBy', 'name avatar');

    res.json(roadmap);
  } catch (error) {
    console.error('Error adding resource:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add task to milestone
router.post('/:id/milestones/:milestoneIndex/tasks', authMiddleware, async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);

    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    // Only creator can add tasks to custom roadmaps
    if (!roadmap.isCustom || roadmap.createdBy?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const milestoneIndex = parseInt(req.params.milestoneIndex);
    
    if (milestoneIndex < 0 || milestoneIndex >= roadmap.milestones.length) {
      return res.status(400).json({ message: 'Invalid milestone index' });
    }

    await roadmap.addTask(milestoneIndex, req.body);

    await roadmap.populate('createdBy', 'name avatar');

    res.json(roadmap);
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's roadmap progress
router.get('/progress/:roadmapId', authMiddleware, async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.roadmapId);

    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    const user = await User.findById(req.user.id);
    const progress = user.roadmapProgress.get(roadmap._id.toString()) || 0;

    res.json({
      roadmap,
      progress,
      isActive: user.activeRoadmap?.toString() === roadmap._id.toString()
    });
  } catch (error) {
    console.error('Error fetching roadmap progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get available domains
router.get('/domains/list', async (req, res) => {
  try {
    const domains = [
      'AI/ML', 'Web Development', 'Mobile Development', 'Data Science', 
      'Cybersecurity', 'Cloud Computing', 'DevOps', 'Blockchain', 'IoT', 
      'Game Development', 'UI/UX', 'Software Engineering', 'Civil', 
      'Mechanical', 'Electrical', 'Chemical', 'Biomedical', 'Aerospace'
    ];

    res.json(domains);
  } catch (error) {
    console.error('Error fetching domains:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
