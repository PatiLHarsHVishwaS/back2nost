import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bookmark,
  Sparkles,
  Trash2,
  Compass,
  Clock,
  Heart,
  Tag,
  RefreshCw,
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const TimeCapsulePage = () => {
  const { user, refreshUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [savedPosts, setSavedPosts] = useState([]);
  const [eraBreakdown, setEraBreakdown] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedEra, setSelectedEra] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchCapsule = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedEra !== 'All') params.append('era', selectedEra);
      if (selectedCategory !== 'All') params.append('category', selectedCategory);

      const res = await api.get(`/capsule?${params.toString()}`);
      if (res.success) {
        setSavedPosts(res.savedPosts || []);
        setEraBreakdown(res.eraBreakdown || {});
      }
    } catch (err) {
      console.error('Failed to load Time Capsule:', err);
    } finally {
      setLoading(false);
    }
  }, [user, selectedEra, selectedCategory]);

  useEffect(() => {
    fetchCapsule();
  }, [fetchCapsule]);

  const handleRemove = async (postId, e) => {
    e.stopPropagation();
    try {
      const res = await api.post(`/posts/${postId}/save`);
      if (res.success && !res.isSaved) {
        toast.info('Item removed from Time Capsule');
        setSavedPosts((prev) => prev.filter((p) => p._id !== postId));
        await refreshUser();
      }
    } catch (err) {
      toast.error('Failed to remove from Time Capsule');
    }
  };

  const categories = ['All', 'Cartoons', 'Games', 'Snacks', 'Toys', 'Gadgets', 'School', 'Cars', 'Music'];
  const eras = ['All', '90s', '2000s', '2010s', '2020s'];

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4 text-center">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-retro-amber flex items-center justify-center mx-auto mb-4 shadow-glow-amber">
          <Bookmark className="w-8 h-8" />
        </div>
        <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
          MY TIME CAPSULE
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">
          Please log in to preserve your personal nostalgic collection in your own secure vault.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/login"
            className="px-6 py-2.5 rounded-xl bg-retro-amber text-slate-950 font-bold text-xs shadow-glow-amber"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="px-6 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold"
          >
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#181120] via-[#101422] to-[#1B190E] border border-retro-amber/40 p-6 sm:p-10 mb-8 shadow-glow-amber overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-retro-amber/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-retro-amber text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PERSONAL SCRAPBOOK VAULT</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-5xl text-white">
              MY TIME CAPSULE
            </h1>
            <p className="text-retro-amber font-medium text-sm sm:text-base mt-1">
              "Your personal collection of nostalgia."
            </p>
          </div>

          {/* Era Counter Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {['90s', '2000s', '2010s'].map((eraKey) => (
              <div
                key={eraKey}
                className="px-3.5 py-2 rounded-2xl bg-[#07090E]/80 border border-slate-700/80 text-center"
              >
                <div className="text-[10px] font-mono text-slate-400 uppercase">{eraKey}</div>
                <div className="font-display font-bold text-base text-retro-cyan">
                  {eraBreakdown[eraKey] || 0}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === c
                  ? 'bg-retro-amber text-slate-950 font-bold shadow-glow-amber'
                  : 'bg-[#0F131D] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Era selector */}
        <div className="flex items-center gap-1 bg-[#0F131D] p-1 rounded-xl border border-slate-800 self-end sm:self-auto">
          {eras.map((e) => (
            <button
              key={e}
              onClick={() => setSelectedEra(e)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                selectedEra === e
                  ? 'bg-retro-cyan/20 text-retro-cyan border border-retro-cyan/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Scrapbook Grid of Saved Nostalgia */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 text-retro-amber animate-spin mb-3" />
          <p className="text-sm font-mono text-slate-400">Opening Time Capsule lock...</p>
        </div>
      ) : savedPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedPosts.map((post, idx) => (
            <div
              key={post._id}
              onClick={() => navigate(`/post/${post._id}`)}
              className="polaroid-card group rounded-2xl overflow-hidden cursor-pointer flex flex-col relative"
            >
              {/* Image Frame */}
              <div className="relative aspect-video bg-black overflow-hidden">
                <img
                  src={
                    post.image ||
                    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80'
                  }
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Era ribbon */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-retro-amber/40 text-[11px] font-mono font-bold text-retro-amber">
                  {post.era}
                </div>

                {/* Remove button */}
                <button
                  onClick={(e) => handleRemove(post._id, e)}
                  title="Remove from Capsule"
                  className="absolute top-3 right-3 p-2 rounded-xl bg-black/70 hover:bg-rose-600/90 text-slate-300 hover:text-white transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Scrapbook content */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-retro-cyan uppercase tracking-wider mb-1">
                    {post.category}
                  </div>
                  <h3 className="font-display font-bold text-base text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  {post.story && (
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {post.story}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>By {post.author?.username || 'Traveler'}</span>
                  <span className="flex items-center gap-1 text-rose-400">
                    <Heart className="w-3.5 h-3.5 fill-rose-500" />
                    {post.likes?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-3xl bg-[#0F131D]/40 border border-dashed border-slate-800 max-w-xl mx-auto p-8">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-retro-amber flex items-center justify-center mx-auto mb-3">
            <Bookmark className="w-7 h-7" />
          </div>
          <h3 className="font-display font-bold text-lg text-slate-200">
            Your Time Capsule is Waiting
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            You haven't archived any memories yet. As you explore the feed, click the bookmark icon on any memory to deposit it here!
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl bg-retro-amber text-slate-950 font-bold text-xs shadow-glow-amber hover:bg-amber-400 transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Memories</span>
          </Link>
        </div>
      )}
    </div>
  );
};
