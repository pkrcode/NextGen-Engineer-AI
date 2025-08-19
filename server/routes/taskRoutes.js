const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Task = require('../models/Task');
const Workspace = require('../models/Workspace');
const User = require('../models/User');

// Get all tasks for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { workspace, status, assignedTo, priority, type } = req.query;
    
    const query = {};
    
    // Filter by workspace
    if (workspace) {
      query.workspace = workspace;
    } else {
      // Get user's workspaces
      const userWorkspaces = await Workspace.find({
        $or: [
          { owner: req.user.id },
          { 'members.user': req.user.id }
        ]
      });
      query.workspace = { $in: userWorkspaces.map(w => w._id) };
    }
    
    // Additional filters
    if (status) query.status = status;
    if (assignedTo) query.assignedTo = assignedTo;
    if (priority) query.priority = priority;
    if (type) query.type = type;

    const tasks = await Task.find(query)
      .populate('workspace', 'name')
      .populate('assignedTo', 'name avatar')
      .populate('createdBy', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new task
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      workspace,
      assignedTo,
      dueDate,
      priority,
      type,
      difficulty,
      tags,
      category,
      estimatedHours,
      subtasks
    } = req.body;

    // Verify workspace access
    const workspaceDoc = await Workspace.findById(workspace);
    if (!workspaceDoc || !workspaceDoc.isMember(req.user.id)) {
      return res.status(403).json({ message: 'Access denied to workspace' });
    }

    const task = new Task({
      title,
      description,
      workspace,
      assignedTo,
      dueDate: dueDate ? new Date(dueDate) : null,
      priority: priority || 'medium',
      type: type || 'task',
      difficulty: difficulty || 'medium',
      tags: tags || [],
      category,
      estimatedHours,
      subtasks: subtasks || [],
      createdBy: req.user.id
    });

    await task.save();

    // Populate the task
    await task.populate('workspace', 'name');
    await task.populate('assignedTo', 'name avatar');
    await task.populate('createdBy', 'name avatar');

    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific task
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('workspace', 'name')
      .populate('assignedTo', 'name avatar')
      .populate('createdBy', 'name avatar')
      .populate('comments.user', 'name avatar')
      .populate('dependencies');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify workspace access
    const workspace = await Workspace.findById(task.workspace);
    if (!workspace || !workspace.isMember(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a task
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify workspace access and permissions
    const workspace = await Workspace.findById(task.workspace);
    if (!workspace || !workspace.isMember(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Only creator, assignee, or workspace admin/owner can edit
    const canEdit = task.createdBy.toString() === req.user.id ||
                   task.assignedTo?.toString() === req.user.id ||
                   workspace.hasRole(req.user.id, 'owner') ||
                   workspace.hasRole(req.user.id, 'admin');

    if (!canEdit) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    const {
      title,
      description,
      assignedTo,
      dueDate,
      priority,
      status,
      progress,
      tags,
      category,
      estimatedHours,
      actualHours
    } = req.body;

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;
    if (priority) task.priority = priority;
    if (status) task.status = status;
    if (progress !== undefined) task.progress = progress;
    if (tags) task.tags = tags;
    if (category !== undefined) task.category = category;
    if (estimatedHours !== undefined) task.estimatedHours = estimatedHours;
    if (actualHours !== undefined) task.actualHours = actualHours;

    await task.save();

    // Populate the task
    await task.populate('workspace', 'name');
    await task.populate('assignedTo', 'name avatar');
    await task.populate('createdBy', 'name avatar');

    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a task
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify workspace access and permissions
    const workspace = await Workspace.findById(task.workspace);
    if (!workspace || !workspace.isMember(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Only creator or workspace owner can delete
    const canDelete = task.createdBy.toString() === req.user.id ||
                     workspace.hasRole(req.user.id, 'owner');

    if (!canDelete) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    await task.remove();

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add comment to task
router.post('/:id/comments', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify workspace access
    const workspace = await Workspace.findById(task.workspace);
    if (!workspace || !workspace.isMember(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await task.addComment(req.user.id, content);

    await task.populate('comments.user', 'name avatar');

    res.json(task);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add subtask
router.post('/:id/subtasks', authMiddleware, async (req, res) => {
  try {
    const { title } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify workspace access
    const workspace = await Workspace.findById(task.workspace);
    if (!workspace || !workspace.isMember(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await task.addSubtask(title);

    res.json(task);
  } catch (error) {
    console.error('Error adding subtask:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Complete subtask
router.put('/:id/subtasks/:subtaskIndex', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify workspace access
    const workspace = await Workspace.findById(task.workspace);
    if (!workspace || !workspace.isMember(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await task.completeSubtask(parseInt(req.params.subtaskIndex));

    res.json(task);
  } catch (error) {
    console.error('Error completing subtask:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task progress
router.put('/:id/progress', authMiddleware, async (req, res) => {
  try {
    const { progress } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify workspace access
    const workspace = await Workspace.findById(task.workspace);
    if (!workspace || !workspace.isMember(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await task.updateProgress(progress);

    // If task is completed, award XP to assignee
    if (task.status === 'completed' && task.assignedTo) {
      const user = await User.findById(task.assignedTo);
      if (user) {
        await user.addXP(task.xp);
        await user.updateStreak();
      }
    }

    await task.populate('assignedTo', 'name avatar');
    await task.populate('createdBy', 'name avatar');

    res.json(task);
  } catch (error) {
    console.error('Error updating task progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Assign task
router.put('/:id/assign', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify workspace access
    const workspace = await Workspace.findById(task.workspace);
    if (!workspace || !workspace.isMember(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Verify assignee is workspace member
    if (userId && !workspace.isMember(userId)) {
      return res.status(400).json({ message: 'Assignee must be a workspace member' });
    }

    await task.assignTo(userId);

    await task.populate('assignedTo', 'name avatar');
    await task.populate('createdBy', 'name avatar');

    res.json(task);
  } catch (error) {
    console.error('Error assigning task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get tasks by workspace
router.get('/workspace/:workspaceId', authMiddleware, async (req, res) => {
  try {
    const { status, assignedTo, priority, type } = req.query;
    
    // Verify workspace access
    const workspace = await Workspace.findById(req.params.workspaceId);
    if (!workspace || !workspace.isMember(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const tasks = await Task.getByWorkspace(req.params.workspaceId, {
      status,
      assignedTo,
      priority,
      type
    });

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching workspace tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
