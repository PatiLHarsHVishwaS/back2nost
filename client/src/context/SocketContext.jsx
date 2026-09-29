import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState({}); // channel -> Set of usernames
  const activeCommunityRef = useRef(null);

  useEffect(() => {
    // In development with Vite proxy, connecting to origin or window.location.origin
    const socketInstance = io(window.location.origin, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      // console.log('⚡ Socket connected to Time Machine:', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      // console.log('❌ Socket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('user-online', ({ communityId, onlineUsers: list }) => {
      if (activeCommunityRef.current === communityId) {
        setOnlineUsers(list || []);
      }
    });

    socketInstance.on('user-offline', ({ communityId, onlineUsers: list }) => {
      if (activeCommunityRef.current === communityId) {
        setOnlineUsers(list || []);
      }
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const joinCommunity = useCallback(
    (communityId, channel = 'general') => {
      if (!socket || !communityId) return;
      activeCommunityRef.current = communityId;
      socket.emit('join-community', {
        communityId,
        channel,
        user: user
          ? {
              _id: user._id,
              username: user.username,
              avatar: user.avatar,
              bio: user.bio,
            }
          : null,
      });
    },
    [socket, user]
  );

  const switchChannel = useCallback(
    (communityId, oldChannel, newChannel) => {
      if (!socket || !communityId) return;
      socket.emit('switch-channel', { communityId, oldChannel, newChannel });
    },
    [socket]
  );

  const leaveCommunity = useCallback(
    (communityId) => {
      if (!socket || !communityId) return;
      if (activeCommunityRef.current === communityId) {
        activeCommunityRef.current = null;
        setOnlineUsers([]);
      }
      socket.emit('leave-community', {
        communityId,
        user: user ? { _id: user._id, username: user.username } : null,
      });
    },
    [socket, user]
  );

  const sendMessage = useCallback(
    (communityId, channel, text) => {
      if (!socket || !user) return;
      socket.emit('send-message', {
        communityId,
        channel,
        text,
        senderId: user._id,
      });
    },
    [socket, user]
  );

  const emitTyping = useCallback(
    (communityId, channel) => {
      if (!socket || !user) return;
      socket.emit('typing', { communityId, channel, username: user.username });
    },
    [socket, user]
  );

  const emitStopTyping = useCallback(
    (communityId, channel) => {
      if (!socket || !user) return;
      socket.emit('stop-typing', { communityId, channel, username: user.username });
    },
    [socket, user]
  );

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        onlineUsers,
        joinCommunity,
        switchChannel,
        leaveCommunity,
        sendMessage,
        emitTyping,
        emitStopTyping,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
