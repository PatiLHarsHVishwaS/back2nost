import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Tv,
  Gamepad2,
  Cookie,
  Smile,
  Film,
  Headphones,
  Shirt,
  Briefcase,
  Smartphone,
  Car,
  BookOpen,
  Heart,
  MessageCircle,
  Bookmark,
  RefreshCw,
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const currentEra = searchParams.get('era') || '2000s';
  const currentCategory = searchParams.get('category') || 'All';
  const currentSort = searchParams.get('sort') || 'trending';

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'All', label: 'All', icon: Sparkles },
    { id: 'Cartoons', label: 'Cartoons', icon: Tv },
    { id: 'Games', label: 'Games', icon: Gamepad2 },
    { id: 'Snacks', label: 'Snacks', icon: Cookie },
    { id: 'Toys', label: 'Toys', icon: Smile },
    { id: 'Movies', label: 'Movies', icon: Film },
    { id: 'Music', label: 'Music', icon: Headphones },
    { id: 'Clothes', label: 'Clothes', icon: Shirt },
    { id: 'School', label: 'School', icon: Briefcase },
    { id: 'Gadgets', label: 'Gadgets', icon: Smartphone },
    { id: 'Cars', label: 'Cars', icon: Car },
    { id: 'Comics', label: 'Comics', icon: BookOpen },
  ];

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (currentEra && currentEra.toLowerCase() !== 'all') params.append('era', currentEra);
      if (currentCategory && currentCategory !== 'All') params.append('category', currentCategory);
      if (currentSort) params.append('sort', currentSort);

      const res = await api.get(`/posts?${params.toString()}`);
      if (res.success) {
        setPosts(res.posts || []);
      }
    } catch (err) {
      console.error('Failed to load explore posts:', err);
    } finally {
      setLoading(false);
    }
  }, [currentEra, currentCategory, currentSort]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCategoryChange = (catId) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('category', catId);
    setSearchParams(newParams);
  };

  const handleSortChange = (sortType) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', sortType);
    setSearchParams(newParams);
  };

  const handleLike = async (post, e) => {
    e.stopPropagation();
    if (!user) {
      toast.info('Please log in to like memories');
      navigate('/login');
      return;
    }
    try {
      const res = await api.post(`/posts/${post._id}/like`);
      if (res.success) {
        setPosts((prev) =>
          prev.map((p) =>
            p._id === post._id
              ? {
                  ...p,
                  likes: res.isLiked
                    ? [...(p.likes || []), user._id]
                    : (p.likes || []).filter((id) => (id._id || id) !== user._id),
                }
              : p
          )
        );
      }
    } catch (err) {
      toast.error('Failed to like post');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 2000s Era Panoramic Header Banner */}
      <div className="relative w-full rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl mb-8 bg-[#121622]">
        <img
          src="/assets/banner_2000s.jpg"
          alt="2000s Era Banner"
          className="w-full h-44 sm:h-64 object-cover object-center filter brightness-[0.7] contrast-[1.05]"
        />

        {/* Ambient Dark Overlay with Centered Titles */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0D14]/80 via-[#0B0D14]/50 to-[#0B0D14]/80 flex flex-col items-center justify-center text-center p-4">
          <h1 className="font-cartoon text-3xl sm:text-5xl text-[#FFFDF7] drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
            {currentEra === '90s' ? '1990s' : currentEra} Era
          </h1>
          <p className="text-retro-amber font-cartoon text-sm sm:text-xl mt-1 tracking-wide drop-shadow-md">
            Relive the golden {currentEra}!
          </p>
        </div>
      </div>

      {/* Categories Grid (2 rows of rounded squares matching reference) */}
      <div className="mb-8">
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2.5 sm:gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = currentCategory.toLowerCase() === cat.id.toLowerCase();
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200 group ${
                  isSelected
                    ? 'bg-[#1C2333] border-retro-amber shadow-glow-amber scale-103'
                    : 'bg-[#10141F] border-slate-800 hover:border-slate-700 hover:bg-[#151B2A]'
                }`}
              >
                <div
                  className={`p-2 rounded-xl mb-1.5 transition-colors ${
                    isSelected ? 'text-retro-amber' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-[11px] font-semibold tracking-tight ${
                    isSelected ? 'text-retro-amber font-bold' : 'text-slate-300'
                  }`}
                >
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabs: Trending, Latest, Most Liked */}
      <div className="flex items-center gap-6 border-b border-slate-800/80 mb-6 pb-2">
        <button
          onClick={() => handleSortChange('trending')}
          className={`text-sm font-bold transition-all relative pb-2 ${
            currentSort === 'trending'
              ? 'text-emerald-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Trending
        </button>

        <button
          onClick={() => handleSortChange('latest')}
          className={`text-sm font-bold transition-all relative pb-2 ${
            currentSort === 'latest'
              ? 'text-emerald-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Latest
        </button>

        <button
          onClick={() => handleSortChange('loved')}
          className={`text-sm font-bold transition-all relative pb-2 ${
            currentSort === 'loved'
              ? 'text-emerald-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Most Liked
        </button>
      </div>

      {/* Grid of Nostalgia Cards matching reference */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 text-retro-amber animate-spin mb-3" />
          <p className="text-xs font-mono text-slate-400">Loading nostalgic memories...</p>
        </div>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {posts.map((post) => {
            const isLiked = user && post.likes?.some((id) => (id._id || id) === user._id);
            return (
              <div
                key={post._id}
                onClick={() => navigate(`/post/${post._id}`)}
                className="group rounded-2xl overflow-hidden cursor-pointer flex flex-col bg-[#FDF8EE] text-slate-900 border border-[#E8DCBF] shadow-lg transition-transform hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] bg-black overflow-hidden">
                  <img
                    src={post.image || '/assets/hero_room.jpg'}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Body */}
                <div className="p-3.5 flex flex-col justify-between flex-1">
                  <h3 className="font-cartoon font-bold text-sm sm:text-base text-slate-900 line-clamp-1">
                    {post.title}
                  </h3>

                  {/* Likes and Comments Counters */}
                  <div className="flex items-center gap-3 mt-3 text-xs text-slate-600 font-semibold">
                    <button
                      onClick={(e) => handleLike(post, e)}
                      className="flex items-center gap-1 hover:text-rose-600 transition-colors"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-500'
                        }`}
                      />
                      <span>{post.likes?.length || 0}</span>
                    </button>

                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5 text-slate-500" />
                      <span>{post.comments?.length || 0}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#121622]/40 rounded-3xl border border-dashed border-slate-800">
          <p className="text-slate-300 font-semibold text-sm">No memories found in this selection.</p>
        </div>
      )}
    </div>
  );
};
