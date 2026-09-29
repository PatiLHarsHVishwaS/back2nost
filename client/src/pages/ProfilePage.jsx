import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  User as UserIcon,
  Heart,
  Bookmark,
  MessageCircle,
  Users,
  Clock,
  Sparkles,
  Edit3,
  RefreshCw,
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { PostCard } from '../components/PostCard';
import { CommunityCard } from '../components/CommunityCard';

export const ProfilePage = () => {
  const { username } = useParams();
  const { user: currentUser, updateProfile } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' | 'saved' | 'comments' | 'communities'
  const [loading, setLoading] = useState(true);

  // Edit bio state
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editBioText, setEditBioText] = useState('');

  const isMe = currentUser && currentUser.username?.toLowerCase() === username?.toLowerCase();

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/users/profile/${username}`);
      if (res.success) {
        setProfileData(res.profile);
        setPosts(res.posts || []);
        setSavedPosts(res.savedPosts || []);
        setComments(res.comments || []);
        setEditBioText(res.profile.bio || '');
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSaveBio = async () => {
    await updateProfile({ bio: editBioText.trim() });
    setIsEditingBio(false);
    fetchProfile();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <RefreshCw className="w-8 h-8 text-retro-amber animate-spin mb-3" />
        <p className="text-sm font-mono text-slate-400">Loading traveler records...</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <h2 className="text-2xl font-bold text-white">Traveler Not Found</h2>
        <Link
          to="/"
          className="inline-block mt-4 px-4 py-2 bg-retro-amber text-slate-950 font-bold rounded-xl text-sm"
        >
          Return to Portal
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header Card */}
      <div className="rounded-3xl bg-[#0F131D] border border-slate-800 p-6 sm:p-10 mb-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-retro-amber/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 text-center md:text-left">
          {/* Avatar with Era Ring */}
          <div className="relative">
            <img
              src={
                profileData.avatar ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
              }
              alt={profileData.username}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-[#07090E] shadow-glow-amber"
            />
            <span className="absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-full bg-retro-amber text-slate-950 text-[10px] font-mono font-bold shadow-md">
              {profileData.eraPreference || '2000s'}
            </span>
          </div>

          {/* User Details */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h1 className="font-display font-black text-2xl sm:text-4xl text-white">
                  {profileData.username}
                </h1>
                <p className="text-xs text-retro-cyan font-mono mt-0.5">
                  TIME TRAVELER SINCE {new Date(profileData.createdAt).getFullYear()}
                </p>
              </div>

              {isMe && !isEditingBio && (
                <button
                  onClick={() => setIsEditingBio(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-retro-amber text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors self-center md:self-auto"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Bio</span>
                </button>
              )}
            </div>

            {/* Bio */}
            {isEditingBio ? (
              <div className="mt-3 space-y-2">
                <textarea
                  value={editBioText}
                  onChange={(e) => setEditBioText(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#07090E] border border-retro-amber text-xs text-slate-200"
                  rows={2}
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setIsEditingBio(false)}
                    className="px-3 py-1 rounded-lg text-xs text-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveBio}
                    className="px-3 py-1 rounded-lg bg-retro-amber text-slate-950 font-bold text-xs"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-300 mt-2 leading-relaxed italic">
                "{profileData.bio || 'Born in the right era ❤️'}"
              </p>
            )}

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
              <div className="text-center md:text-left">
                <span className="block text-xl sm:text-2xl font-display font-black text-white">
                  {profileData.stats?.postsCount || 0}
                </span>
                <span className="text-[11px] font-mono text-slate-400 uppercase">Posts</span>
              </div>
              <div className="text-center md:text-left">
                <span className="block text-xl sm:text-2xl font-display font-black text-retro-amber">
                  {profileData.stats?.likesCount || 0}
                </span>
                <span className="text-[11px] font-mono text-slate-400 uppercase">Likes</span>
              </div>
              <div className="text-center md:text-left">
                <span className="block text-xl sm:text-2xl font-display font-black text-retro-cyan">
                  {profileData.stats?.savedCount || 0}
                </span>
                <span className="text-[11px] font-mono text-slate-400 uppercase">Saved</span>
              </div>
              <div className="text-center md:text-left">
                <span className="block text-xl sm:text-2xl font-display font-black text-purple-400">
                  {profileData.stats?.communitiesCount || 0}
                </span>
                <span className="text-[11px] font-mono text-slate-400 uppercase">Guilds</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 mb-8 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('posts')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'posts'
              ? 'border-retro-amber text-retro-amber font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          My Posts ({posts.length})
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'saved'
              ? 'border-retro-amber text-retro-amber font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Saved ({savedPosts.length})
        </button>

        <button
          onClick={() => setActiveTab('comments')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'comments'
              ? 'border-retro-amber text-retro-amber font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Comments ({comments.length})
        </button>

        <button
          onClick={() => setActiveTab('communities')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'communities'
              ? 'border-retro-amber text-retro-amber font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Communities ({profileData.joinedCommunities?.length || 0})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'posts' && (
        <div>
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} onPostUpdated={fetchProfile} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#0F131D]/40 rounded-2xl border border-dashed border-slate-800">
              <p className="text-slate-400 text-sm">No memories shared yet.</p>
              {isMe && (
                <Link
                  to="/create"
                  className="inline-block mt-3 px-4 py-2 bg-retro-amber text-slate-950 font-bold rounded-xl text-xs"
                >
                  Share your first memory
                </Link>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'saved' && (
        <div>
          {savedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedPosts.map((post) => (
                <PostCard key={post._id} post={post} onPostUpdated={fetchProfile} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#0F131D]/40 rounded-2xl border border-dashed border-slate-800">
              <p className="text-slate-400 text-sm">No saved memories in Time Capsule.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'comments' && (
        <div className="space-y-3 max-w-3xl">
          {comments.length > 0 ? (
            comments.map((c) => (
              <div key={c._id} className="p-4 rounded-2xl bg-[#0F131D] border border-slate-800">
                <div className="text-xs text-slate-400 mb-1">
                  Commented on{' '}
                  <Link
                    to={`/post/${c.post?._id}`}
                    className="text-retro-amber font-semibold hover:underline"
                  >
                    "{c.post?.title || 'a memory'}"
                  </Link>
                </div>
                <p className="text-sm text-slate-200">{c.text}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-[#0F131D]/40 rounded-2xl border border-dashed border-slate-800">
              <p className="text-slate-400 text-sm">No comments yet.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'communities' && (
        <div>
          {profileData.joinedCommunities?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {profileData.joinedCommunities.map((c) => (
                <CommunityCard key={c._id} community={c} onMembershipChange={fetchProfile} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#0F131D]/40 rounded-2xl border border-dashed border-slate-800">
              <p className="text-slate-400 text-sm">Not joined to any communities yet.</p>
              <Link
                to="/community"
                className="inline-block mt-3 px-4 py-2 bg-retro-cyan text-slate-950 font-bold rounded-xl text-xs"
              >
                Explore Communities
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
