import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Clock,
  ArrowLeft,
  Send,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [saved, setSaved] = useState(false);

  const fetchPost = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/posts/${id}`);
      if (res.success && res.post) {
        setPost(res.post);
        setLikesCount(res.post.likes?.length || 0);
        if (user) {
          setLiked(res.post.likes?.some((u) => (u._id || u) === user._id));
          setSaved(user.savedPosts?.some((p) => (p._id || p) === res.post._id));
        }
      }
    } catch (err) {
      console.error('Failed to fetch post:', err);
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleLike = async () => {
    if (!user) {
      toast.info('Please log in to like this post');
      navigate('/login');
      return;
    }
    const prevLiked = liked;
    const prevCount = likesCount;
    setLiked(!prevLiked);
    setLikesCount(prevLiked ? prevCount - 1 : prevCount + 1);

    try {
      const res = await api.post(`/posts/${id}/like`);
      if (res.success) {
        setLiked(res.isLiked);
        setLikesCount(res.likesCount);
      }
    } catch (err) {
      setLiked(prevLiked);
      setLikesCount(prevCount);
      toast.error('Failed to like post');
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast.info('Please log in to save to your Time Capsule');
      navigate('/login');
      return;
    }
    const prevSaved = saved;
    setSaved(!prevSaved);

    try {
      const res = await api.post(`/posts/${id}/save`);
      if (res.success) {
        setSaved(res.isSaved);
        toast.success(res.isSaved ? 'Saved to Time Capsule! 🕰️' : 'Removed from Time Capsule');
      }
    } catch (err) {
      setSaved(prevSaved);
      toast.error('Failed to update Time Capsule');
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Link copied to clipboard! 📋');
    });
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.info('Please log in to comment');
      navigate('/login');
      return;
    }
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await api.post(`/posts/${id}/comments`, { text: commentText.trim() });
      if (res.success) {
        setPost((prev) => ({
          ...prev,
          comments: [res.comment, ...(prev.comments || [])],
        }));
        setCommentText('');
        toast.success('Comment added to memory thread!');
      }
    } catch (err) {
      toast.error('Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <RefreshCw className="w-8 h-8 text-retro-amber animate-spin mb-3" />
        <p className="text-sm font-mono text-slate-400">Loading nostalgic record...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <h2 className="text-2xl font-bold text-white">Post Not Found</h2>
        <button
          onClick={() => navigate('/explore')}
          className="mt-4 px-4 py-2 bg-retro-amber text-slate-950 font-bold rounded-xl text-sm"
        >
          Return to Explore
        </button>
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-retro-amber transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Timeline</span>
      </button>

      {/* Main Post Container */}
      <article className="rounded-3xl bg-[#0F131D] border border-slate-800 shadow-2xl overflow-hidden mb-8">
        {/* Post Image */}
        {post.image && (
          <div className="w-full max-h-[500px] bg-[#07090E] overflow-hidden flex items-center justify-center">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full max-h-[500px] object-cover"
            />
          </div>
        )}

        {/* Content details */}
        <div className="p-6 sm:p-8">
          {/* Metadata badges */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-retro-amber/20 text-retro-amber border border-retro-amber/30">
              {post.era} ERA
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              {post.category}
            </span>
            {post.community && (
              <Link
                to={`/community/${post.community._id || post.community.slug}`}
                className="px-3 py-1 rounded-full text-xs font-semibold text-retro-cyan hover:underline bg-cyan-950/40 border border-cyan-800/40"
              >
                {post.community.name}
              </Link>
            )}
          </div>

          <h1 className="font-display font-black text-2xl sm:text-4xl text-white leading-tight mb-4">
            {post.title}
          </h1>

          {/* Author info */}
          <div className="flex items-center gap-3 pb-6 border-b border-slate-800 mb-6">
            <Link to={`/profile/${post.author?.username}`}>
              <img
                src={
                  post.author?.avatar ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'
                }
                alt={post.author?.username}
                className="w-11 h-11 rounded-2xl object-cover border border-slate-700 hover:border-retro-amber transition-colors"
              />
            </Link>
            <div>
              <Link
                to={`/profile/${post.author?.username}`}
                className="font-bold text-sm text-slate-100 hover:text-retro-amber transition-colors"
              >
                {post.author?.username || 'Time Traveler'}
              </Link>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span>{formattedDate}</span>
                {post.author?.bio && (
                  <>
                    <span>•</span>
                    <span className="truncate max-w-xs">{post.author.bio}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Story Body */}
          {post.story && (
            <div className="text-slate-200 text-base sm:text-lg leading-relaxed whitespace-pre-line mb-8">
              {post.story}
            </div>
          )}

          {/* Actions Bar */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-800">
            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  liked
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    : 'text-slate-400 hover:text-rose-400 bg-slate-900 border border-slate-800'
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{likesCount} Likes</span>
              </button>

              <button
                onClick={handleSave}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  saved
                    ? 'bg-retro-amber/20 text-retro-amber border border-retro-amber/40 shadow-glow-amber'
                    : 'text-slate-400 hover:text-retro-amber bg-slate-900 border border-slate-800'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${saved ? 'fill-retro-amber text-retro-amber' : ''}`} />
                <span>{saved ? 'In Capsule' : 'Save to Capsule'}</span>
              </button>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </article>

      {/* ========================================================
          Comments Section
          ======================================================== */}
      <section className="rounded-3xl bg-[#0F131D] border border-slate-800 p-6 sm:p-8">
        <h3 className="font-display font-bold text-lg text-white mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-retro-amber" />
          <span>Comments ({post.comments?.length || 0})</span>
        </h3>

        {/* Add comment form */}
        <form onSubmit={handleAddComment} className="mb-8">
          <div className="flex gap-3">
            <textarea
              rows={2}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={user ? 'Add to this memory discussion...' : 'Log in to add your memory comment...'}
              disabled={!user}
              className="w-full px-4 py-3 rounded-2xl bg-[#07090E] border border-slate-700/80 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-retro-amber transition-all resize-none"
            />
          </div>
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={!commentText.trim() || submittingComment || !user}
              className="px-5 py-2.5 rounded-xl bg-retro-amber text-slate-950 font-bold text-xs hover:bg-amber-400 disabled:opacity-40 transition-all flex items-center gap-1.5 shadow-glow-amber"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post Comment</span>
            </button>
          </div>
        </form>

        {/* Comments stream */}
        <div className="space-y-4">
          {post.comments?.length > 0 ? (
            post.comments.map((comment) => (
              <div
                key={comment._id}
                className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 flex items-start gap-3"
              >
                <img
                  src={
                    comment.author?.avatar ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'
                  }
                  alt={comment.author?.username}
                  className="w-8 h-8 rounded-xl object-cover border border-slate-700 shrink-0 mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-200">
                      {comment.author?.username || 'Time Traveler'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                    {comment.text}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 text-center py-6">
              No comments yet. Share what you remember about this!
            </p>
          )}
        </div>
      </section>
    </div>
  );
};
