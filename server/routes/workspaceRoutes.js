const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Workspace = require('../models/Workspace');
const Task = require('../models/Task');

// Get all workspaces for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      $or: [
        { owner: req.user.id },
        { 'members.user': req.user.id }
      ]
    })
    .populate('owner', 'name avatar')
    .populate('members.user', 'name avatar')
    .sort({ updatedAt: -1 });

    res.json(workspaces);
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new workspace
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, type, template, isPublic, allowInvites } = req.body;

    const workspace = new Workspace({
      name,
      description,
      type: type || 'personal',
      template: template || 'blank',
      owner: req.user.id,
      isPublic: isPublic || false,
      allowInvites: allowInvites !== false,
      members: [{
        user: req.user.id,
        role: 'owner',
        joinedAt: new Date()
      }]
    });

    await workspace.save();

    // Populate the workspace with user data
    await workspace.populate('owner', 'name avatar');
    await workspace.populate('members.user', 'name avatar');

    res.status(201).json(workspace);
  } catch (error) {
    console.error('Error creating workspace:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific workspace
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate('owner', 'name avatar')
      .populate('members.user', 'name avatar')
      .populate('tasks')
      .populate('projects');

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    // Check if user has access to this workspace
    if (!workspace.isMember(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(workspace);
  } catch (error) {
    console.error('Error fetching workspace:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update workspace
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    // Check if user is owner or admin
    if (!workspace.hasRole(req.user.id, 'owner') && !workspace.hasRole(req.user.id, 'admin')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { name, description, type, isPublic, allowInvites, settings } = req.body;

    if (name) workspace.name = name;
    if (description !== undefined) workspace.description = description;
    if (type) workspace.type = type;
    if (isPublic !== undefined) workspace.isPublic = isPublic;
    if (allowInvites !== undefined) workspace.allowInvites = allowInvites;
    if (settings) workspace.settings = { ...workspace.settings, ...settings };

    await workspace.save();

    await workspace.populate('owner', 'name avatar');
    await workspace.populate('members.user', 'name avatar');

    res.json(workspace);
  } catch (error) {
    console.error('Error updating workspace:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete workspace
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    // Only owner can delete workspace
    if (!workspace.hasRole(req.user.id, 'owner')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Delete associated tasks
    await Task.deleteMany({ workspace: workspace._id });

    await workspace.remove();

    res.json({ message: 'Workspace deleted successfully' });
  } catch (error) {
    console.error('Error deleting workspace:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add member to workspace
router.post('/:id/members', authMiddleware, async (req, res) => {
  try {
    const { userId, role } = req.body;
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    // Check if user can add members
    if (!workspace.hasRole(req.user.id, 'owner') && !workspace.hasRole(req.user.id, 'admin')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await workspace.addMember(userId, role || 'member');

    await workspace.populate('owner', 'name avatar');
    await workspace.populate('members.user', 'name avatar');

    res.json(workspace);
  } catch (error) {
    console.error('Error adding member:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove member from workspace
router.delete('/:id/members/:userId', authMiddleware, async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    // Check if user can remove members
    if (!workspace.hasRole(req.user.id, 'owner') && !workspace.hasRole(req.user.id, 'admin')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Owner cannot remove themselves
    if (req.params.userId === req.user.id && workspace.hasRole(req.user.id, 'owner')) {
      return res.status(400).json({ message: 'Owner cannot remove themselves' });
    }

    await workspace.removeMember(req.params.userId);

    await workspace.populate('owner', 'name avatar');
    await workspace.populate('members.user', 'name avatar');

    res.json(workspace);
  } catch (error) {
    console.error('Error removing member:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update member role
router.put('/:id/members/:userId', authMiddleware, async (req, res) => {
  try {
    const { role } = req.body;
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    // Only owner can change roles
    if (!workspace.hasRole(req.user.id, 'owner')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const member = workspace.members.find(m => m.user.toString() === req.params.userId);
    if (member) {
      member.role = role;
      await workspace.save();
    }

    await workspace.populate('owner', 'name avatar');
    await workspace.populate('members.user', 'name avatar');

    res.json(workspace);
  } catch (error) {
    console.error('Error updating member role:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get workspace statistics
router.get('/:id/stats', authMiddleware, async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    if (!workspace.isMember(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get task statistics
    const tasks = await Task.find({ workspace: workspace._id });
    const completedTasks = tasks.filter(task => task.status === 'completed');
    const pendingTasks = tasks.filter(task => task.status === 'pending');
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress');

    const stats = {
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      pendingTasks: pendingTasks.length,
      inProgressTasks: inProgressTasks.length,
      completionRate: tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0,
      totalXP: tasks.reduce((total, task) => total + (task.xp || 0), 0),
      memberCount: workspace.members.length,
      createdAt: workspace.createdAt,
      lastActivity: workspace.updatedAt
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching workspace stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get public workspaces
router.get('/public/list', async (req, res) => {
  try {
    const { type, limit = 20, page = 1 } = req.query;
    
    const query = { isPublic: true };
    if (type) query.type = type;

    const workspaces = await Workspace.find(query)
      .populate('owner', 'name avatar')
      .populate('members.user', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Workspace.countDocuments(query);

    res.json({
      workspaces,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching public workspaces:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
