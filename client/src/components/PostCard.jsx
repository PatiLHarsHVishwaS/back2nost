import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal } from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const PostCard = ({ post, onPostUpdated }) => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const isInitiallyLiked = user && post.likes?.some((id) => (id._id || id) === user._id);
  const isInitiallySaved = user && user.savedPosts?.some((id) => (id._id || id) === post._id);

  const [liked, setLiked] = useState(isInitiallyLiked);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [saved, setSaved] = useState(isInitiallySaved);
  const [isLiking, setIsLiking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.info('Please log in to like memories');
      navigate('/login');
      return;
    }
    if (isLiking) return;

    const previousLiked = liked;
    const previousCount = likesCount;
    setLiked(!previousLiked);
    setLikesCount(previousLiked ? previousCount - 1 : previousCount + 1);
    setIsLiking(true);

    try {
      const res = await api.post(`/posts/${post._id}/like`);
      if (res.success) {
        setLiked(res.isLiked);
        setLikesCount(res.likesCount);
        if (onPostUpdated) onPostUpdated();
      }
    } catch (err) {
      setLiked(previousLiked);
      setLikesCount(previousCount);
      toast.error('Failed to like post');
    } finally {
      setIsLiking(false);
    }
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.info('Please log in to save to your Time Capsule');
      navigate('/login');
      return;
    }
    if (isSaving) return;

    const previousSaved = saved;
    setSaved(!previousSaved);
    setIsSaving(true);

    try {
      const res = await api.post(`/posts/${post._id}/save`);
      if (res.success) {
        setSaved(res.isSaved);
        toast.success(res.isSaved ? 'Saved to your Time Capsule! 🕰️' : 'Removed from Time Capsule');
        if (onPostUpdated) onPostUpdated();
      }
    } catch (err) {
      setSaved(previousSaved);
      toast.error('Failed to update Time Capsule');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/post/${post._id}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Link copied to clipboard! 📋');
    });
  };

  return (
    <article
      onClick={() => navigate(`/post/${post._id}`)}
      className="rounded-2xl bg-[#121622] border border-slate-800/80 hover:border-slate-700/90 shadow-xl transition-all p-4 sm:p-5 cursor-pointer mb-4"
    >
      {/* Top Header: Avatar, Username, Time */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <Link
            to={`/profile/${post.author?.username || 'traveler'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={
                post.author?.avatar ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'
              }
              alt={post.author?.username}
              className="w-9 h-9 rounded-full object-cover border border-slate-700"
            />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <Link
                to={`/profile/${post.author?.username || 'traveler'}`}
                onClick={(e) => e.stopPropagation()}
                className="font-bold text-xs sm:text-sm text-slate-100 hover:underline"
              >
                {post.author?.username || 'Traveler'}
              </Link>
              <span className="text-[11px] text-slate-500 font-medium">• 2 days ago</span>
            </div>
          </div>
        </div>

        <button
          onClick={(e) => e.stopPropagation()}
          className="text-slate-500 hover:text-slate-300 p-1"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Post Title */}
      <h3 className="font-cartoon font-bold text-base sm:text-lg text-slate-100 mb-3">
        {post.title}
      </h3>

      {/* Media & Story Layout matching reference */}
      <div className="space-y-3">
        {post.image && (
          <div className="rounded-xl overflow-hidden bg-black aspect-video max-h-96">
            <img
              src={post.image}
              alt={post.title}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {post.story && (
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {post.story}
          </p>
        )}

        {/* Tags */}
        <div className="flex items-center gap-2 pt-1">
          <span className="px-2.5 py-0.5 rounded-md bg-slate-800/80 text-[11px] font-medium text-slate-300">
            #{post.category || 'Nostalgia'}
          </span>
          <span className="px-2.5 py-0.5 rounded-md bg-slate-800/80 text-[11px] font-medium text-slate-300">
            #{post.era || '2000s'}
          </span>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-800/60 text-xs text-slate-400 font-semibold">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 transition-colors ${
              liked ? 'text-rose-500' : 'hover:text-rose-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{likesCount}</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/post/${post._id}`);
            }}
            className="flex items-center gap-1.5 hover:text-slate-200 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{post.comments?.length || 0}</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 transition-colors ${
              saved ? 'text-retro-amber' : 'hover:text-retro-amber'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-retro-amber text-retro-amber' : ''}`} />
            <span>Save</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 hover:text-slate-200 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </article>
  );
};
