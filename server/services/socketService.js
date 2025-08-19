const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const Workspace = require('../models/Workspace');
const User = require('../models/User');

const setupSocketIO = (io) => {
  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('_id name avatar');
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id;
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.name} (${socket.userId})`);

    // Join user's workspaces
    socket.on('join-workspaces', async () => {
      try {
        const workspaces = await Workspace.find({
          $or: [
            { owner: socket.userId },
            { 'members.user': socket.userId }
          ]
        });

        workspaces.forEach(workspace => {
          socket.join(`workspace-${workspace._id}`);
        });

        socket.emit('workspaces-joined', {
          workspaces: workspaces.map(w => w._id)
        });
      } catch (error) {
        console.error('Error joining workspaces:', error);
      }
    });

    // Join specific workspace
    socket.on('join-workspace', async (workspaceId) => {
      try {
        const workspace = await Workspace.findById(workspaceId);
        
        if (workspace && workspace.isMember(socket.userId)) {
          socket.join(`workspace-${workspaceId}`);
          socket.emit('workspace-joined', { workspaceId });
        }
      } catch (error) {
        console.error('Error joining workspace:', error);
      }
    });

    // Leave workspace
    socket.on('leave-workspace', (workspaceId) => {
      socket.leave(`workspace-${workspaceId}`);
      socket.emit('workspace-left', { workspaceId });
    });

    // Send message
    socket.on('send-message', async (data) => {
      try {
        const { workspaceId, content, type = 'text', replyTo, thread, mentions, metadata } = data;

        // Verify workspace access
        const workspace = await Workspace.findById(workspaceId);
        if (!workspace || !workspace.isMember(socket.userId)) {
          socket.emit('error', { message: 'Access denied' });
          return;
        }

        // Create message
        const message = new Message({
          content,
          type,
          sender: socket.userId,
          workspace: workspaceId,
          replyTo,
          thread,
          mentions: mentions || [],
          metadata: metadata || {}
        });

        await message.save();

        // Populate message
        await message.populate('sender', 'name avatar');
        await message.populate('replyTo', 'content sender');
        await message.populate('mentions', 'name avatar');

        // Broadcast to workspace
        io.to(`workspace-${workspaceId}`).emit('new-message', message);

        // Update user's last activity
        await User.findByIdAndUpdate(socket.userId, {
          lastActivityDate: new Date()
        });

      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Typing indicator
    socket.on('typing-start', async (data) => {
      try {
        const { workspaceId } = data;
        
        // Verify workspace access
        const workspace = await Workspace.findById(workspaceId);
        if (!workspace || !workspace.isMember(socket.userId)) {
          return;
        }

        socket.to(`workspace-${workspaceId}`).emit('user-typing', {
          userId: socket.userId,
          userName: socket.user.name,
          workspaceId
        });
      } catch (error) {
        console.error('Error handling typing start:', error);
      }
    });

    socket.on('typing-stop', async (data) => {
      try {
        const { workspaceId } = data;
        
        // Verify workspace access
        const workspace = await Workspace.findById(workspaceId);
        if (!workspace || !workspace.isMember(socket.userId)) {
          return;
        }

        socket.to(`workspace-${workspaceId}`).emit('user-stopped-typing', {
          userId: socket.userId,
          workspaceId
        });
      } catch (error) {
        console.error('Error handling typing stop:', error);
      }
    });

    // Mark message as read
    socket.on('mark-read', async (data) => {
      try {
        const { messageId } = data;
        
        const message = await Message.findById(messageId);
        if (!message) {
          return;
        }

        // Verify workspace access
        const workspace = await Workspace.findById(message.workspace);
        if (!workspace || !workspace.isMember(socket.userId)) {
          return;
        }

        await message.markAsRead(socket.userId);

        // Notify other users in workspace
        socket.to(`workspace-${message.workspace}`).emit('message-read', {
          messageId,
          userId: socket.userId,
          userName: socket.user.name
        });

      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    });

    // Add reaction
    socket.on('add-reaction', async (data) => {
      try {
        const { messageId, emoji } = data;
        
        const message = await Message.findById(messageId);
        if (!message) {
          return;
        }

        // Verify workspace access
        const workspace = await Workspace.findById(message.workspace);
        if (!workspace || !workspace.isMember(socket.userId)) {
          return;
        }

        await message.addReaction(socket.userId, emoji);
        await message.populate('reactions.user', 'name avatar');

        // Broadcast to workspace
        io.to(`workspace-${message.workspace}`).emit('reaction-added', {
          messageId,
          reaction: {
            user: socket.user,
            emoji,
            createdAt: new Date()
          }
        });

      } catch (error) {
        console.error('Error adding reaction:', error);
      }
    });

    // Remove reaction
    socket.on('remove-reaction', async (data) => {
      try {
        const { messageId, emoji } = data;
        
        const message = await Message.findById(messageId);
        if (!message) {
          return;
        }

        // Verify workspace access
        const workspace = await Workspace.findById(message.workspace);
        if (!workspace || !workspace.isMember(socket.userId)) {
          return;
        }

        await message.removeReaction(socket.userId, emoji);

        // Broadcast to workspace
        io.to(`workspace-${message.workspace}`).emit('reaction-removed', {
          messageId,
          userId: socket.userId,
          emoji
        });

      } catch (error) {
        console.error('Error removing reaction:', error);
      }
    });

    // Online status
    socket.on('set-online', async () => {
      try {
        await User.findByIdAndUpdate(socket.userId, {
          lastActivityDate: new Date()
        });

        // Get user's workspaces and notify members
        const workspaces = await Workspace.find({
          $or: [
            { owner: socket.userId },
            { 'members.user': socket.userId }
          ]
        });

        workspaces.forEach(workspace => {
          socket.to(`workspace-${workspace._id}`).emit('user-online', {
            userId: socket.userId,
            userName: socket.user.name
          });
        });
      } catch (error) {
        console.error('Error setting online status:', error);
      }
    });

    // Disconnect
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.user.name} (${socket.userId})`);
      
      try {
        // Get user's workspaces and notify members
        const workspaces = await Workspace.find({
          $or: [
            { owner: socket.userId },
            { 'members.user': socket.userId }
          ]
        });

        workspaces.forEach(workspace => {
          socket.to(`workspace-${workspace._id}`).emit('user-offline', {
            userId: socket.userId,
            userName: socket.user.name
          });
        });
      } catch (error) {
        console.error('Error handling disconnect:', error);
      }
    });

    // Error handling
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  return io;
};

module.exports = { setupSocketIO };
