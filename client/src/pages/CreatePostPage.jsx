import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  Image as ImageIcon,
  Sparkles,
  PlusCircle,
  X,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const CreatePostPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [category, setCategory] = useState('Cartoons');
  const [era, setEra] = useState('2000s');
  const [community, setCommunity] = useState('');
  const [communities, setCommunities] = useState([]);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Cartoons',
    'Games',
    'Snacks',
    'Toys',
    'Movies',
    'Music',
    'Clothes',
    'School',
    'Gadgets',
    'Cars',
    'Comics',
  ];

  const eras = ['90s', '2000s', '2010s', '2020s'];

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const res = await api.get('/communities');
        if (res.success) {
          setCommunities(res.communities || []);
        }
      } catch (err) {
        console.error('Failed to load communities:', err);
      }
    };
    fetchCommunities();
  }, []);

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setImageUrlInput('');
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview('');
    setImageUrlInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.info('Please log in to share your nostalgia memory');
      navigate('/login');
      return;
    }

    if (!title.trim()) {
      toast.error('Please enter a memory title');
      return;
    }

    setIsSubmitting(true);
    let finalImageUrl = imageUrlInput.trim();

    try {
      // 1. If file was picked, upload it first
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        const uploadRes = await api.post('/upload', formData);
        if (uploadRes.success && uploadRes.url) {
          finalImageUrl = uploadRes.url;
        }
      }

      // 2. Create post
      const postPayload = {
        title: title.trim(),
        story: story.trim(),
        category,
        era,
        community: community || null,
        image: finalImageUrl,
      };

      const res = await api.post('/posts', postPayload);

      if (res.success && res.post) {
        toast.success('Your memory is now etched in time! 🚀✨');
        navigate(`/post/${res.post._id}`);
      }
    } catch (err) {
      console.error('Failed to publish memory:', err);
      toast.error(err.data?.message || err.message || 'Failed to post memory');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-retro-amber text-xs font-mono font-bold uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>TIME CAPSULE ARCHIVE</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-white">
          Share a Nostalgia Memory
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Unearth a forgotten treasure from your childhood. Inspire thousands of travelers.
        </p>
      </div>

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl bg-[#0F131D] border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6"
      >
        {/* Title */}
        <div>
          <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-2">
            Memory Title <span className="text-retro-amber">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Coming home at 4:30 PM just to watch Doraemon..."
            className="w-full px-4 py-3 rounded-xl bg-[#07090E] border border-slate-700/80 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-retro-amber transition-all"
          />
        </div>

        {/* Story */}
        <div>
          <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-2">
            Story / Details <span className="text-slate-500 font-normal">(Optional)</span>
          </label>
          <textarea
            rows={4}
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="Share the sights, sounds, colony stories, friends, or feelings you remember..."
            className="w-full px-4 py-3 rounded-xl bg-[#07090E] border border-slate-700/80 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-retro-amber transition-all resize-y"
          />
        </div>

        {/* Era & Category Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Era */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-2">
              Era <span className="text-retro-amber">*</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#07090E] rounded-xl border border-slate-700/80">
              {eras.map((e) => (
                <button
                  type="button"
                  key={e}
                  onClick={() => setEra(e)}
                  className={`py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                    era === e
                      ? 'bg-retro-amber text-slate-950 shadow-glow-amber'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-2">
              Category <span className="text-retro-amber">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090E] border border-slate-700/80 text-sm text-slate-100 focus:outline-none focus:border-retro-amber transition-all"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Community Link */}
        <div>
          <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-2">
            Target Community <span className="text-slate-500 font-normal">(Optional)</span>
          </label>
          <select
            value={community}
            onChange={(e) => setCommunity(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090E] border border-slate-700/80 text-sm text-slate-100 focus:outline-none focus:border-retro-amber transition-all"
          >
            <option value="">None (General Nostalgia Feed)</option>
            {communities.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} — {c.displayName}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload or URL */}
        <div>
          <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-2">
            Nostalgic Image <span className="text-slate-500 font-normal">(Optional)</span>
          </label>

          {imagePreview || imageUrlInput ? (
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-black aspect-video max-h-64">
              <img
                src={imagePreview || imageUrlInput}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 hover:bg-rose-600 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 hover:border-retro-amber/60 rounded-2xl cursor-pointer bg-[#07090E]/60 transition-colors group">
                <Upload className="w-8 h-8 text-slate-500 group-hover:text-retro-amber transition-colors mb-2" />
                <span className="text-xs font-semibold text-slate-300 group-hover:text-white">
                  Click to upload image file
                </span>
                <span className="text-[10px] text-slate-500 mt-1">PNG, JPG, WEBP up to 10MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </label>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 uppercase font-mono">Or image URL:</span>
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-3 py-1.5 rounded-lg bg-[#07090E] border border-slate-700/80 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-retro-amber"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-retro-amber via-retro-orange to-retro-pink text-slate-950 font-display font-bold text-sm tracking-wide shadow-glow-amber hover:opacity-95 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {isSubmitting ? (
              <span>Broadcasting to Timeline...</span>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Post Memory</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
