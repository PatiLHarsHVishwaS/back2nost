import { Message } from '../models/Message.js';
import { User } from '../models/User.js';

// Map of active online users per community: communityId -> Map(socketId -> userData)
const communityOnlineUsers = new Map();

// Map of socketId -> userId
const socketUserMap = new Map();

export const setupSocketIO = (io) => {
  io.on('connection', (socket) => {
    // console.log(`🔌 Socket connected: ${socket.id}`);

    // Join a community chatroom and channel
    socket.on('join-community', async ({ communityId, channel = 'general', user }) => {
      try {
        if (!communityId) return;

        // Join socket room for community and channel
        const roomName = `comm_${communityId}_${channel.toLowerCase()}`;
        const commRoom = `comm_${communityId}`;
        
        socket.join(roomName);
        socket.join(commRoom);

        // Track user if authenticated
        if (user && user._id) {
          socketUserMap.set(socket.id, {
            userId: user._id,
            communityId,
            channel,
            username: user.username,
            avatar: user.avatar,
          });

          if (!communityOnlineUsers.has(communityId)) {
            communityOnlineUsers.set(communityId, new Map());
          }

          const onlineMap = communityOnlineUsers.get(communityId);
          // Store by userId to deduplicate if multiple tabs
          onlineMap.set(user._id.toString(), {
            _id: user._id,
            username: user.username,
            avatar: user.avatar,
            bio: user.bio,
            onlineAt: new Date(),
          });

          // Broadcast updated online list to everyone in this community
          const onlineList = Array.from(onlineMap.values());
          io.to(commRoom).emit('user-online', {
            communityId,
            onlineUsers: onlineList,
          });
        }
      } catch (err) {
        console.error('Error in join-community:', err);
      }
    });

    // Switch channel within same community
    socket.on('switch-channel', ({ communityId, oldChannel, newChannel }) => {
      if (!communityId) return;
      if (oldChannel) {
        socket.leave(`comm_${communityId}_${oldChannel.toLowerCase()}`);
      }
      if (newChannel) {
        socket.join(`comm_${communityId}_${newChannel.toLowerCase()}`);
      }
    });

    // Leave a community
    socket.on('leave-community', ({ communityId, user }) => {
      try {
        if (!communityId) return;

        socket.leave(`comm_${communityId}`);

        if (communityOnlineUsers.has(communityId) && user && user._id) {
          const onlineMap = communityOnlineUsers.get(communityId);
          onlineMap.delete(user._id.toString());

          const onlineList = Array.from(onlineMap.values());
          io.to(`comm_${communityId}`).emit('user-offline', {
            communityId,
            userId: user._id,
            onlineUsers: onlineList,
          });
        }
      } catch (err) {
        console.error('Error in leave-community:', err);
      }
    });

    // Sending a message
    socket.on('send-message', async (data) => {
      try {
        const { communityId, channel = 'general', text, senderId } = data;

        if (!communityId || !text || !text.trim() || !senderId) {
          return;
        }

        // Persist message in MongoDB
        const newMessage = await Message.create({
          communityId,
          channel: channel.toLowerCase(),
          sender: senderId,
          text: text.trim(),
        });

        const populatedMessage = await Message.findById(newMessage._id).populate(
          'sender',
          'username avatar bio'
        );

        const roomName = `comm_${communityId}_${channel.toLowerCase()}`;
        // Broadcast to everyone in the room (including sender)
        io.to(roomName).emit('receive-message', populatedMessage);
      } catch (err) {
        console.error('Error in send-message:', err);
        socket.emit('message-error', { error: 'Failed to send message' });
      }
    });

    // Typing indicators
    socket.on('typing', ({ communityId, channel, username }) => {
      if (communityId && channel) {
        const roomName = `comm_${communityId}_${channel.toLowerCase()}`;
        socket.to(roomName).emit('user-typing', { username, channel });
      }
    });

    socket.on('stop-typing', ({ communityId, channel, username }) => {
      if (communityId && channel) {
        const roomName = `comm_${communityId}_${channel.toLowerCase()}`;
        socket.to(roomName).emit('user-stop-typing', { username, channel });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      const userInfo = socketUserMap.get(socket.id);
      if (userInfo) {
        const { communityId, userId } = userInfo;
        if (communityOnlineUsers.has(communityId)) {
          const onlineMap = communityOnlineUsers.get(communityId);
          onlineMap.delete(userId.toString());

          const onlineList = Array.from(onlineMap.values());
          io.to(`comm_${communityId}`).emit('user-offline', {
            communityId,
            userId,
            onlineUsers: onlineList,
          });
        }
        socketUserMap.delete(socket.id);
      }
    });
  });
};
