import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Users,
  MessageSquare,
  Sparkles,
  Radio,
  FileText,
  Info,
  Check,
  PlusCircle,
  RefreshCw,
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PostCard } from '../components/PostCard';
import { DiscordChat } from '../components/DiscordChat';

export const CommunityDetailPage = () => {
  const { id } = useParams();
  const { user, isJoinedCommunity, refreshUser } = useAuth();
  const toast = useToast();

  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' | 'chat' | 'about'
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  const fetchCommunityData = useCallback(async () => {
    setLoading(true);
    try {
      const commRes = await api.get(`/communities/${id}`);
      if (commRes.success) {
        setCommunity(commRes.community);
        // fetch community posts
        const postsRes = await api.get(`/communities/${commRes.community._id}/posts`);
        if (postsRes.success) {
          setPosts(postsRes.posts || []);
        }
      }
    } catch (err) {
      console.error('Failed to load community:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCommunityData();
  }, [fetchCommunityData]);

  const joined = community && isJoinedCommunity(community._id);

  const handleJoin = async () => {
    if (!user) {
      toast.info('Please log in to join this community');
      return;
    }
    if (joining || !community) return;
    setJoining(true);

    try {
      const res = await api.post(`/communities/${community._id}/join`);
      if (res.success) {
        toast.success(res.isJoined ? `Joined ${community.name}!` : `Left ${community.name}`);
        await refreshUser();
        fetchCommunityData();
      }
    } catch (err) {
      toast.error('Failed to update membership');
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <RefreshCw className="w-8 h-8 text-retro-amber animate-spin mb-3" />
        <p className="text-sm font-mono text-slate-400">Loading community frequency...</p>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-200">Community Not Found</h2>
        <p className="text-slate-400 text-sm mt-2">
          This nostalgia frequency might not exist or was lost in time.
        </p>
        <Link
          to="/community"
          className="inline-block mt-4 px-4 py-2 bg-retro-amber text-slate-950 font-bold rounded-xl text-sm"
        >
          Back to Communities
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Banner */}
      <div className="relative h-48 sm:h-64 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
        <img
          src={community.banner || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80'}
          alt={community.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090E] via-[#07090E]/40 to-transparent" />
      </div>

      {/* Community Header Card Info */}
      <div className="relative px-4 sm:px-8 -mt-16 sm:-mt-20 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-end gap-4 sm:gap-6">
          <img
            src={community.image}
            alt={community.name}
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-[#07090E] shadow-2xl relative z-10"
          />
          <div className="pb-1">
            <h1 className="font-display font-black text-2xl sm:text-4xl text-white">
              {community.name}
            </h1>
            <p className="text-xs sm:text-sm text-retro-cyan font-semibold">
              {community.displayName}
            </p>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <strong className="text-slate-200">{community.members?.length || 0}</strong> members
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Chat Active
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 self-start md:self-end">
          <Link
            to="/create"
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-retro-amber" />
            <span>Post Here</span>
          </Link>

          <button
            onClick={handleJoin}
            disabled={joining}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              joined
                ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-rose-500/20 hover:text-rose-400'
                : 'bg-retro-amber text-slate-950 hover:bg-amber-400 shadow-glow-amber'
            }`}
          >
            {joined ? (
              <>
                <Check className="w-4 h-4" />
                <span>Joined</span>
              </>
            ) : (
              <span>+ Join Community</span>
            )}
          </button>
        </div>
      </div>

      {/* Tabs: Posts, Chat, About */}
      <div className="flex items-center gap-2 border-b border-slate-800 mb-8">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'posts'
              ? 'border-retro-amber text-retro-amber font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Posts ({posts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'chat'
              ? 'border-retro-cyan text-retro-cyan font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Live Chat</span>
          <span className="w-2 h-2 rounded-full bg-retro-cyan animate-pulse" />
        </button>

        <button
          onClick={() => setActiveTab('about')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'about'
              ? 'border-purple-400 text-purple-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>About</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'posts' && (
        <div>
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} onPostUpdated={fetchCommunityData} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 rounded-2xl bg-[#0F131D]/40 border border-dashed border-slate-800">
              <p className="text-slate-300 font-medium">No posts in this community yet.</p>
              <Link
                to="/create"
                className="inline-block mt-3 px-4 py-2 bg-retro-amber text-slate-950 font-bold rounded-xl text-xs"
              >
                Be the first to share a memory!
              </Link>
            </div>
          )}
        </div>
      )}

      {activeTab === 'chat' && (
        <div>
          <DiscordChat community={community} />
        </div>
      )}

      {activeTab === 'about' && (
        <div className="max-w-2xl bg-[#0F131D] rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="font-display font-bold text-lg text-white">About {community.name}</h3>
          <p className="text-slate-300 text-sm leading-relaxed">{community.description}</p>

          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
              Community Channels
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {community.channels?.map((chan) => (
                <div key={chan.id} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <p className="text-xs font-bold text-retro-amber">#{chan.name}</p>
                  <p className="text-[11px] text-slate-400">{chan.topic}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
