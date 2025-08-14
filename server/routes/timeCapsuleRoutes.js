const express = require('express');
const router = express.Router();
const TimeCapsule = require('../models/TimeCapsule');
const auth = require('../middleware/authMiddleware');
const { uploadToCloudinary } = require('../services/cloudinaryService');
const multer = require('multer');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio and video files are allowed'), false);
    }
  }
});

// @route   POST /api/timecapsules
// @desc    Create a new time capsule
// @access  Private
router.post('/', auth, upload.single('media'), async (req, res) => {
  try {
    const { title, message, scheduledDate, messageType, isPublic, category, priority, deliveryMethod, tags } = req.body;
    
    let mediaUrl = null;
    
    // Handle media upload if present
    if (req.file) {
      try {
        mediaUrl = await uploadToCloudinary(req.file, messageType);
      } catch (uploadError) {
        return res.status(400).json({ message: 'Media upload failed', error: uploadError.message });
      }
    }
    
    const timeCapsule = new TimeCapsule({
      user: req.user.id,
      title,
      message,
      scheduledDate: new Date(scheduledDate),
      messageType: messageType || 'text',
      mediaUrl,
      isPublic: isPublic === 'true',
      category: category || 'personal',
      priority: priority || 'medium',
      deliveryMethod: deliveryMethod || 'app',
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    });
    
    await timeCapsule.save();
    
    res.status(201).json({
      success: true,
      data: timeCapsule,
      message: 'Time capsule created successfully! 📬'
    });
  } catch (error) {
    console.error('Error creating time capsule:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/timecapsules
// @desc    Get user's time capsules
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { delivered, category, limit, sort } = req.query;
    
    const options = {
      delivered: delivered === 'true' ? true : delivered === 'false' ? false : undefined,
      category,
      limit: parseInt(limit) || 50,
      sort: sort || 'desc'
    };
    
    const timeCapsules = await TimeCapsule.findByUser(req.user.id, options);
    
    res.json({
      success: true,
      count: timeCapsules.length,
      data: timeCapsules
    });
  } catch (error) {
    console.error('Error fetching time capsules:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/timecapsules/:id
// @desc    Get specific time capsule
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const timeCapsule = await TimeCapsule.findById(req.params.id);
    
    if (!timeCapsule) {
      return res.status(404).json({ message: 'Time capsule not found' });
    }
    
    // Check if user owns this time capsule
    if (timeCapsule.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to access this time capsule' });
    }
    
    res.json({
      success: true,
      data: timeCapsule
    });
  } catch (error) {
    console.error('Error fetching time capsule:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/timecapsules/:id
// @desc    Update time capsule
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const timeCapsule = await TimeCapsule.findById(req.params.id);
    
    if (!timeCapsule) {
      return res.status(404).json({ message: 'Time capsule not found' });
    }
    
    // Check if user owns this time capsule
    if (timeCapsule.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this time capsule' });
    }
    
    // Don't allow updates if already delivered
    if (timeCapsule.isDelivered) {
      return res.status(400).json({ message: 'Cannot update a delivered time capsule' });
    }
    
    const { title, message, scheduledDate, isPublic, category, priority, deliveryMethod, tags } = req.body;
    
    const updateFields = {};
    if (title) updateFields.title = title;
    if (message) updateFields.message = message;
    if (scheduledDate) updateFields.scheduledDate = new Date(scheduledDate);
    if (isPublic !== undefined) updateFields.isPublic = isPublic === 'true';
    if (category) updateFields.category = category;
    if (priority) updateFields.priority = priority;
    if (deliveryMethod) updateFields.deliveryMethod = deliveryMethod;
    if (tags) updateFields.tags = tags.split(',').map(tag => tag.trim());
    
    const updatedTimeCapsule = await TimeCapsule.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: updatedTimeCapsule,
      message: 'Time capsule updated successfully! ✏️'
    });
  } catch (error) {
    console.error('Error updating time capsule:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/timecapsules/:id
// @desc    Delete time capsule
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const timeCapsule = await TimeCapsule.findById(req.params.id);
    
    if (!timeCapsule) {
      return res.status(404).json({ message: 'Time capsule not found' });
    }
    
    // Check if user owns this time capsule
    if (timeCapsule.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this time capsule' });
    }
    
    await TimeCapsule.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Time capsule deleted successfully! 🗑️'
    });
  } catch (error) {
    console.error('Error deleting time capsule:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/timecapsules/public/feed
// @desc    Get public time capsules feed
// @access  Public
router.get('/public/feed', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const timeCapsules = await TimeCapsule.find({ 
      isPublic: true,
      isDelivered: true 
    })
    .populate('user', 'name')
    .sort({ deliveredAt: -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await TimeCapsule.countDocuments({ 
      isPublic: true,
      isDelivered: true 
    });
    
    res.json({
      success: true,
      data: timeCapsules,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching public feed:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/timecapsules/stats/overview
// @desc    Get user's time capsule statistics
// @access  Private
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const stats = await TimeCapsule.aggregate([
      { $match: { user: req.user.id } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          delivered: { $sum: { $cond: ['$isDelivered', 1, 0] } },
          pending: { $sum: { $cond: [{ $and: ['$isDelivered', { $lt: ['$scheduledDate', new Date()] }] }, 1, 0] } },
          upcoming: { $sum: { $cond: [{ $and: [{ $not: '$isDelivered' }, { $gte: ['$scheduledDate', new Date()] }] }, 1, 0] } }
        }
      }
    ]);
    
    const categoryStats = await TimeCapsule.aggregate([
      { $match: { user: req.user.id } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      success: true,
      data: {
        overview: stats[0] || { total: 0, delivered: 0, pending: 0, upcoming: 0 },
        categories: categoryStats
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
