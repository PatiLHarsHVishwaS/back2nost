import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, MessageSquare, Radio, ArrowRight, Check } from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const CommunityCard = ({ community, onMembershipChange }) => {
  const { user, isJoinedCommunity, refreshUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const isJoined = isJoinedCommunity(community._id);
  const [joined, setJoined] = useState(isJoined);
  const [membersCount, setMembersCount] = useState(community.members?.length || 0);
  const [loading, setLoading] = useState(false);

  const handleJoinToggle = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.info('Please log in to join communities');
      navigate('/login');
      return;
    }

    if (loading) return;
    setLoading(true);

    // Optimistic toggle
    const prevJoined = joined;
    const prevCount = membersCount;
    setJoined(!prevJoined);
    setMembersCount(prevJoined ? prevCount - 1 : prevCount + 1);

    try {
      const res = await api.post(`/communities/${community._id}/join`);
      if (res.success) {
        setJoined(res.isJoined);
        setMembersCount(res.membersCount);
        if (res.isJoined) {
          toast.success(`Welcome to ${community.name}! 🎉`);
        } else {
          toast.info(`Left ${community.name}`);
        }
        await refreshUser();
        if (onMembershipChange) onMembershipChange();
      }
    } catch (err) {
      setJoined(prevJoined);
      setMembersCount(prevCount);
      toast.error('Failed to update membership');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={() => navigate(`/community/${community._id || community.slug}`)}
      className="group relative rounded-2xl bg-[#0F131D]/80 border border-slate-800/80 hover:border-retro-amber/40 backdrop-blur-xl shadow-retro-card transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer flex flex-col"
    >
      {/* Banner */}
      <div className="h-24 w-full bg-slate-800 relative overflow-hidden">
        <img
          src={community.banner || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80'}
          alt={community.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F131D] via-transparent to-transparent" />
      </div>

      {/* Community Icon & Name */}
      <div className="p-4 sm:p-5 pt-0 relative flex-1 flex flex-col">
        <div className="flex items-end justify-between -mt-8 mb-3">
          <div className="relative">
            <img
              src={community.image}
              alt={community.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-[#0F131D] shadow-lg group-hover:border-retro-amber transition-colors"
            />
          </div>

          {/* Join / Leave Button */}
          <button
            onClick={handleJoinToggle}
            disabled={loading}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              joined
                ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/40'
                : 'bg-retro-amber text-slate-950 hover:bg-amber-400 shadow-glow-amber'
            }`}
          >
            {joined ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Joined</span>
              </>
            ) : (
              <span>+ Join</span>
            )}
          </button>
        </div>

        <div>
          <h4 className="font-display font-bold text-base text-slate-100 group-hover:text-amber-300 transition-colors">
            {community.name}
          </h4>
          <p className="text-xs text-retro-cyan font-medium -mt-0.5">
            {community.displayName}
          </p>
        </div>

        <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed flex-1">
          {community.description}
        </p>

        {/* Stats footer: Member count, channels & chat link */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span>{membersCount} travelers</span>
            </span>
            <span className="flex items-center gap-1 font-mono text-slate-500">
              #{community.channels?.length || 4} channels
            </span>
          </div>

          <Link
            to={`/chat/${community._id || community.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-retro-amber hover:text-amber-300 font-semibold transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
