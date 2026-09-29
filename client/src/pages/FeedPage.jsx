import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, RefreshCw } from 'lucide-react';
import { api } from '../api/client';
import { PostCard } from '../components/PostCard';

export const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/posts?limit=30');
      if (res.success) {
        setPosts(res.posts || []);
      }
    } catch (err) {
      console.error('Failed to load feed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      {/* Top Header Row with "+ Share a Memory" button matching reference */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-cartoon text-xl sm:text-2xl text-white">Nostalgia Feed</h1>
          <p className="text-xs text-slate-400">What everyone is reminiscing today</p>
        </div>

        <Link
          to="/create"
          className="px-5 py-2 rounded-full bg-retro-coral hover:bg-rose-600 text-white font-cartoon font-bold text-xs shadow-glow-coral flex items-center gap-1.5 transition-all hover:scale-103"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Share a Memory</span>
        </Link>
      </div>

      {/* Posts Stream */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 text-retro-amber animate-spin mb-3" />
          <p className="text-xs font-mono text-slate-400">Loading memories...</p>
        </div>
      ) : posts.length > 0 ? (
        <div>
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onPostUpdated={fetchPosts} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#121622]/40 rounded-3xl border border-dashed border-slate-800">
          <p className="text-slate-300 text-sm">No memories in the feed yet.</p>
        </div>
      )}
    </div>
  );
};
