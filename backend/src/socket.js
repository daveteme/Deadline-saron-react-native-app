// File: socket.js
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Conversation = require('./models/Conversation');

let io;

// Initialize socket.io with the HTTP server
exports.initSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication required'));
      }
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new Error('User not found'));
      }
      
      // Attach user data to socket
      socket.user = user;
      next();
    } catch (error) {
      return next(new Error('Authentication error: ' + error.message));
    }
  });

  // Connection handler
  io.on('connection', async (socket) => {
    const userId = socket.user._id;
    console.log(`User connected: ${userId}`);
    
    // Update user's online status
    await User.findByIdAndUpdate(userId, { 
      is_online: true,
      last_active: new Date() 
    });
    
    // Join user's personal room for direct notifications
    socket.join(`user_${userId}`);
    
    // Join rooms for all conversations user is part of
    try {
      const conversations = await Conversation.find({
        'participants.user_id': userId
      });
      
      conversations.forEach(conversation => {
        socket.join(`conversation_${conversation._id}`);
      });
      
      console.log(`User ${userId} joined ${conversations.length} conversation rooms`);
    } catch (error) {
      console.error('Error joining conversation rooms:', error);
    }
    
    // Handle messaging events
    socket.on('send_message', async (data) => {
      try {
        const { conversationId, content, attachments = [] } = data;
        
        // Check if conversation exists and user is a participant
        const conversation = await Conversation.findById(conversationId);
        
        if (!conversation) {
          return socket.emit('error', { message: 'Conversation not found' });
        }
        
        const isParticipant = conversation.participants.some(
          p => p.user_id.toString() === userId.toString()
        );
        
        if (!isParticipant) {
          return socket.emit('error', { message: 'You are not a participant in this conversation' });
        }
        
        // At this point, the messagingController.sendMessage would handle the actual message
        // creation and notifications. This is just the socket-specific part.
        
        // When a message is successfully created in the controller, it will emit
        // a 'new_message' event to all participants in the conversation.
      } catch (error) {
        console.error('Error sending message via socket:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });
    
    socket.on('typing', (data) => {
      const { conversationId } = data;
      
      // Broadcast typing indicator to all participants except sender
      socket.to(`conversation_${conversationId}`).emit('user_typing', {
        conversation_id: conversationId,
        user_id: userId,
        user_name: `${socket.user.first_name} ${socket.user.last_name}`
      });
    });
    
    socket.on('stopped_typing', (data) => {
      const { conversationId } = data;
      
      // Broadcast stopped typing indicator to all participants except sender
      socket.to(`conversation_${conversationId}`).emit('user_stopped_typing', {
        conversation_id: conversationId,
        user_id: userId
      });
    });
    
    socket.on('join_conversation', async (data) => {
      const { conversationId } = data;
      
      try {
        // Check if user is a participant
        const conversation = await Conversation.findOne({
          _id: conversationId,
          'participants.user_id': userId
        });
        
        if (conversation) {
          socket.join(`conversation_${conversationId}`);
          console.log(`User ${userId} joined conversation ${conversationId}`);
        } else {
          socket.emit('error', { message: 'Cannot join conversation - not a participant' });
        }
      } catch (error) {
        console.error('Error joining conversation room:', error);
        socket.emit('error', { message: 'Failed to join conversation room' });
      }
    });
    
    socket.on('leave_conversation', (data) => {
      const { conversationId } = data;
      socket.leave(`conversation_${conversationId}`);
      console.log(`User ${userId} left conversation ${conversationId}`);
    });
    
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${userId}`);
      
      // Update user's online status
      await User.findByIdAndUpdate(userId, { 
        is_online: false,
        last_active: new Date() 
      });
      
      // Broadcast to all conversations that user is offline
      const conversations = await Conversation.find({
        'participants.user_id': userId
      });
      
      conversations.forEach(conversation => {
        io.to(`conversation_${conversation._id}`).emit('user_offline', {
          user_id: userId
        });
      });
    });
  });

  return io;
};

// Get the io instance
exports.getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};