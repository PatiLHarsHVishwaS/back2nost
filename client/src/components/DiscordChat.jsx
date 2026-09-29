import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Hash,
  Send,
  Users,
  Smile,
  Circle,
  Radio,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useToast } from '../context/ToastContext';
import { api } from '../api/client';

export const DiscordChat = ({ community, initialChannel = 'general' }) => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const {
    socket,
    isConnected,
    onlineUsers,
    joinCommunity,
    switchChannel,
    sendMessage,
    emitTyping,
    emitStopTyping,
  } = useSocket();

  const [activeChannel, setActiveChannel] = useState(initialChannel);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [typingUsers, setTypingUsers] = useState([]);
  const [showMembersSidebar, setShowMembersSidebar] = useState(true);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const channels = community.channels && community.channels.length > 0
    ? community.channels
    : [
        { id: 'general', name: 'general', topic: 'General nostalgia discussion' },
        { id: 'memes', name: 'memes', topic: 'Nostalgic memes & funny memories' },
        { id: 'memories', name: 'memories', topic: 'Deep childhood flashbacks' },
      ];

  // 1. Join community socket room on mount or community change
  useEffect(() => {
    if (!community?._id) return;
    joinCommunity(community._id, activeChannel);
  }, [community?._id, activeChannel, joinCommunity]);

  // 2. Fetch initial messages for active channel
  useEffect(() => {
    let isMounted = true;
    const fetchHistory = async () => {
      setLoadingMessages(true);
      try {
        const res = await api.get(`/messages/${community._id}/${activeChannel}`);
        if (isMounted && res.success) {
          setMessages(res.messages || []);
        }
      } catch (err) {
        console.error('Failed to load message history:', err);
      } finally {
        if (isMounted) setLoadingMessages(false);
      }
    };

    fetchHistory();
    return () => {
      isMounted = false;
    };
  }, [community?._id, activeChannel]);

  // 3. Listen for incoming live Socket.IO messages & typing indicators
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (newMsg) => {
      // If message belongs to active community & active channel
      if (
        newMsg.communityId?.toString() === community._id?.toString() &&
        newMsg.channel?.toLowerCase() === activeChannel.toLowerCase()
      ) {
        setMessages((prev) => [...prev, newMsg]);
      }
    };

    const handleUserTyping = ({ username, channel }) => {
      if (channel === activeChannel && username !== user?.username) {
        setTypingUsers((prev) => Array.from(new Set([...prev, username])));
      }
    };

    const handleUserStopTyping = ({ username, channel }) => {
      if (channel === activeChannel) {
        setTypingUsers((prev) => prev.filter((u) => u !== username));
      }
    };

    socket.on('receive-message', handleReceiveMessage);
    socket.on('user-typing', handleUserTyping);
    socket.on('user-stop-typing', handleUserStopTyping);

    return () => {
      socket.off('receive-message', handleReceiveMessage);
      socket.off('user-typing', handleUserTyping);
      socket.off('user-stop-typing', handleUserStopTyping);
    };
  }, [socket, community?._id, activeChannel, user?.username]);

  // 4. Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  // Handle switching channel
  const handleChannelSelect = (channelId) => {
    if (channelId === activeChannel) return;
    switchChannel(community._id, activeChannel, channelId);
    setActiveChannel(channelId);
  };

  // Handle typing debounce
  const handleInputChange = (e) => {
    setInputText(e.target.value);
    if (!user) return;

    emitTyping(community._id, activeChannel);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      emitStopTyping(community._id, activeChannel);
    }, 1500);
  };

  // Handle send message
  const handleSend = (e) => {
    e.preventDefault();
    if (!user) {
      toast.info('Please log in to chat with the community');
      navigate('/login');
      return;
    }

    if (!inputText.trim()) return;

    emitStopTyping(community._id, activeChannel);
    sendMessage(community._id, activeChannel, inputText.trim());
    setInputText('');
  };

  const activeTopic = channels.find((c) => c.id === activeChannel)?.topic || 'Nostalgia discussion';

  return (
    <div className="flex h-[750px] w-full rounded-2xl bg-[#090C14] border border-slate-800 shadow-2xl overflow-hidden">
      {/* ========================================================
          LEFT: Community Name & Channels List
          ======================================================== */}
      <aside className="w-60 sm:w-64 bg-[#0B0E17] border-r border-slate-800/90 flex flex-col shrink-0">
        {/* Community Title Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 truncate">
            <img
              src={community.image}
              alt={community.name}
              className="w-7 h-7 rounded-lg object-cover border border-slate-700 shrink-0"
            />
            <span className="font-display font-bold text-sm text-slate-100 truncate">
              {community.name}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0" title={isConnected ? 'Live WebSocket Connected' : 'Connecting...'}>
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          </div>
        </div>

        {/* Text Channels List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="px-2 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
            Text Channels
          </div>
          {channels.map((chan) => {
            const isSelected = chan.id.toLowerCase() === activeChannel.toLowerCase();
            return (
              <button
                key={chan.id}
                onClick={() => handleChannelSelect(chan.id)}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-left group ${
                  isSelected
                    ? 'bg-retro-amber/15 text-retro-amber border border-retro-amber/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Hash
                  className={`w-4 h-4 shrink-0 ${
                    isSelected ? 'text-retro-amber' : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                />
                <span className="truncate">{chan.name}</span>
              </button>
            );
          })}
        </div>

        {/* Current User Bottom Bar */}
        {user ? (
          <div className="p-3 border-t border-slate-800/90 bg-[#07090E] flex items-center gap-2.5">
            <div className="relative shrink-0">
              <img
                src={user.avatar}
                alt={user.username}
                className="w-8 h-8 rounded-lg object-cover border border-slate-700"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#07090E]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-200 truncate">{user.username}</p>
              <p className="text-[10px] text-emerald-400 font-mono">Online</p>
            </div>
          </div>
        ) : (
          <div className="p-3 border-t border-slate-800 text-center">
            <button
              onClick={() => navigate('/login')}
              className="w-full py-1.5 rounded-lg bg-retro-amber/20 border border-retro-amber/40 text-retro-amber text-xs font-bold hover:bg-retro-amber hover:text-slate-950 transition-colors"
            >
              Sign In to Chat
            </button>
          </div>
        )}
      </aside>

      {/* ========================================================
          CENTER: Messages & Input
          ======================================================== */}
      <section className="flex-1 flex flex-col min-w-0 bg-[#07090E] relative">
        {/* Channel Top Header */}
        <div className="h-14 px-4 sm:px-6 border-b border-slate-800/90 flex items-center justify-between shrink-0 bg-[#090C14]/90 backdrop-blur-md">
          <div className="flex items-center gap-2 min-w-0">
            <Hash className="w-5 h-5 text-retro-amber shrink-0" />
            <span className="font-display font-bold text-sm text-slate-100 truncate">
              {activeChannel}
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-xs text-slate-400 truncate hidden sm:inline">
              {activeTopic}
            </span>
          </div>

          <button
            onClick={() => setShowMembersSidebar(!showMembersSidebar)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Toggle Members List"
          >
            <Users className="w-4 h-4" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Welcome Message banner for the channel */}
          <div className="pb-4 mb-4 border-b border-slate-800/60">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-retro-amber/20 to-retro-cyan/20 border border-amber-500/30 flex items-center justify-center mb-2">
              <Hash className="w-6 h-6 text-retro-amber" />
            </div>
            <h3 className="font-display font-black text-xl text-white">
              Welcome to #{activeChannel}!
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              This is the start of the #{activeChannel} channel in {community.name}. Reminisce freely!
            </p>
          </div>

          {loadingMessages ? (
            <div className="text-center py-10 font-mono text-xs text-slate-500">
              Fetching time capsule transmissions...
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-500">
              No messages yet in this channel. Send the first hello! 💬
            </div>
          ) : (
            messages.map((msg, idx) => {
              const sender = msg.sender || {};
              const isMe = user && sender._id === user._id;
              const formattedTime = new Date(msg.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={msg._id || idx}
                  className="flex items-start gap-3 group hover:bg-slate-900/40 p-1.5 -mx-1.5 rounded-xl transition-colors"
                >
                  <img
                    src={
                      sender.avatar ||
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'
                    }
                    alt={sender.username}
                    className="w-9 h-9 rounded-xl object-cover border border-slate-700 shrink-0 mt-0.5"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-slate-200">
                        {sender.username || 'Traveler'}
                      </span>
                      {isMe && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-retro-amber text-[9px] font-mono">
                          YOU
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500 font-mono">
                        {formattedTime}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 mt-0.5 leading-relaxed break-words">
                      {msg.text}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className="px-6 py-1 text-[11px] text-retro-cyan font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-retro-cyan animate-ping" />
            <span>
              {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
            </span>
          </div>
        )}

        {/* Message Input Bottom Bar */}
        <div className="p-4 bg-[#090C14] border-t border-slate-800/90">
          <form onSubmit={handleSend} className="relative flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder={`Message #${activeChannel}...`}
              className="w-full px-4 py-3 rounded-xl bg-[#0F131D] border border-slate-700/80 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-retro-amber focus:ring-1 focus:ring-retro-amber transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 py-3 rounded-xl bg-retro-amber text-slate-950 font-bold hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed shadow-glow-amber transition-all shrink-0 flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>

      {/* ========================================================
          RIGHT: Online Users Panel
          ======================================================== */}
      {showMembersSidebar && (
        <aside className="w-56 sm:w-60 bg-[#0B0E17] border-l border-slate-800/90 p-4 hidden md:flex flex-col shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Online Travelers ({onlineUsers.length})</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {onlineUsers.length === 0 ? (
              <p className="text-[11px] text-slate-500 italic">
                Only active authenticated users connected via live socket appear here.
              </p>
            ) : (
              onlineUsers.map((u) => (
                <div
                  key={u._id}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-800/50 transition-colors"
                >
                  <div className="relative shrink-0">
                    <img
                      src={u.avatar}
                      alt={u.username}
                      className="w-7 h-7 rounded-lg object-cover border border-slate-700"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full border border-[#0B0E17]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-200 truncate">
                      {u.username}
                    </p>
                    {u.bio && (
                      <p className="text-[10px] text-slate-400 truncate">{u.bio}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>
      )}
    </div>
  );
};
