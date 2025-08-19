const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Message = require('../models/Message');
const Workspace = require('../models/Workspace');

// Get messages for a workspace
router.get('/workspace/:workspaceId', authMiddleware, async (req, res) => {
  try {
    const { limit = 50, before, after, thread } = req.query;
    
    // Verify workspace access
    const workspace = await Workspace.findById(req.params.workspaceId);
    if (!workspace || !workspace.isMember(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const messages = await Message.getByWorkspace(req.params.workspaceId, {
      limit: parseInt(limit),
      before: before ? new Date(before) : null,
      after: after ? new Date(after) : null,
      thread
    });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send a message
router.post('/workspace/:workspaceId', authMiddleware, async (req, res) => {
  try {
    const { content, type = 'text', replyTo, thread, mentions, metadata } = req.body;
    
    // Verify workspace access
    const workspace = await Workspace.findById(req.params.workspaceId);
    if (!workspace || !workspace.isMember(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const message = new Message({
      content,
      type,
      sender: req.user.id,
      workspace: req.params.workspaceId,
      replyTo,
      thread,
      mentions: mentions || [],
      metadata: metadata || {}
    });

    await message.save();

    // Populate the message
    await message.populate('sender', 'name avatar');
    await message.populate('replyTo', 'content sender');
    await message.populate('mentions', 'name avatar');

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific message
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate('sender', 'name avatar')
      .populate('replyTo', 'content sender')
      .populate('mentions', 'name avatar')
      .populate('readBy.user', 'name avatar')
      .populate('reactions.user', 'name avatar');

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Verify workspace access
    const workspace = await Workspace.findById(message.workspace);
    if (!workspace || !workspace.isMember(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(message);
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Edit a message
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Verify workspace access
    const workspace = await Workspace.findById(message.workspace);
    if (!workspace || !workspace.isMember(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Only sender can edit message
    if (message.sender.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    await message.edit(content);

    await message.populate('sender', 'name avatar');
    await message.populate('replyTo', 'content sender');
    await message.populate('mentions', 'name avatar');

    res.json(message);
  } catch (error) {
    console.error('Error editing message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a message
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Verify workspace access
    const workspace = await Workspace.findById(message.workspace);
    if (!workspace || !workspace.isMember(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Only sender or workspace admin/owner can delete
    const canDelete = message.sender.toString() === req.user.id ||
                     workspace.hasRole(req.user.id, 'owner') ||
                     workspace.hasRole(req.user.id, 'admin');

    if (!canDelete) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    await message.deleteMessage(req.user.id);

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark message as read
router.post('/:id/read', authMiddleware, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Verify workspace access
    const workspace = await Workspace.findById(message.workspace);
    if (!workspace || !workspace.isMember(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await message.markAsRead(req.user.id);

    res.json({ message: 'Message marked as read' });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add reaction to message
router.post('/:id/reactions', authMiddleware, async (req, res) => {
  try {
    const { emoji } = req.body;
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Verify workspace access
    const workspace = await Workspace.findById(message.workspace);
    if (!workspace || !workspace.isMember(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await message.addReaction(req.user.id, emoji);

    await message.populate('reactions.user', 'name avatar');

    res.json(message);
  } catch (error) {
    console.error('Error adding reaction:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove reaction from message
router.delete('/:id/reactions/:emoji', authMiddleware, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Verify workspace access
    const workspace = await Workspace.findById(message.workspace);
    if (!workspace || !workspace.isMember(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await message.removeReaction(req.user.id, req.params.emoji);

    await message.populate('reactions.user', 'name avatar');

    res.json(message);
  } catch (error) {
    console.error('Error removing reaction:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get unread count for workspace
router.get('/workspace/:workspaceId/unread', authMiddleware, async (req, res) => {
  try {
    // Verify workspace access
    const workspace = await Workspace.findById(req.params.workspaceId);
    if (!workspace || !workspace.isMember(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const unreadCount = await Message.getUnreadCount(req.params.workspaceId, req.user.id);

    res.json({ unreadCount });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get thread messages
router.get('/thread/:messageId', authMiddleware, async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    const messages = await Message.find({
      thread: req.params.messageId,
      isDeleted: false
    })
    .populate('sender', 'name avatar')
    .populate('replyTo', 'content sender')
    .populate('mentions', 'name avatar')
    .populate('readBy.user', 'name avatar')
    .populate('reactions.user', 'name avatar')
    .sort({ createdAt: 1 })
    .limit(parseInt(limit));

    if (messages.length === 0) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    // Verify workspace access for the first message
    const workspace = await Workspace.findById(messages[0].workspace);
    if (!workspace || !workspace.isMember(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(messages);
  } catch (error) {
    console.error('Error fetching thread messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search messages in workspace
router.get('/workspace/:workspaceId/search', authMiddleware, async (req, res) => {
  try {
    const { query, limit = 20 } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Verify workspace access
    const workspace = await Workspace.findById(req.params.workspaceId);
    if (!workspace || !workspace.isMember(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const messages = await Message.find({
      workspace: req.params.workspaceId,
      content: { $regex: query, $options: 'i' },
      isDeleted: false
    })
    .populate('sender', 'name avatar')
    .populate('replyTo', 'content sender')
    .populate('mentions', 'name avatar')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

    res.json(messages);
  } catch (error) {
    console.error('Error searching messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get message statistics for workspace
router.get('/workspace/:workspaceId/stats', authMiddleware, async (req, res) => {
  try {
    // Verify workspace access
    const workspace = await Workspace.findById(req.params.workspaceId);
    if (!workspace || !workspace.isMember(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const totalMessages = await Message.countDocuments({
      workspace: req.params.workspaceId,
      isDeleted: false
    });

    const todayMessages = await Message.countDocuments({
      workspace: req.params.workspaceId,
      createdAt: { $gte: new Date().setHours(0, 0, 0, 0) },
      isDeleted: false
    });

    const unreadCount = await Message.getUnreadCount(req.params.workspaceId, req.user.id);

    res.json({
      totalMessages,
      todayMessages,
      unreadCount
    });
  } catch (error) {
    console.error('Error fetching message stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
