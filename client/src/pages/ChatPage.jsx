import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DiscordChat } from '../components/DiscordChat';
import { api } from '../api/client';
import { RefreshCw, MessageSquare } from 'lucide-react';

export const ChatPage = () => {
  const { communityId } = useParams();
  const navigate = useNavigate();
  const [community, setCommunity] = useState(null);
  const [allCommunities, setAllCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChat = async () => {
      setLoading(true);
      try {
        const commsRes = await api.get('/communities');
        if (commsRes.success && commsRes.communities.length > 0) {
          setAllCommunities(commsRes.communities);

          const targetId = communityId || commsRes.communities[0]._id;
          const target = commsRes.communities.find(
            (c) => c._id === targetId || c.slug === targetId
          );

          if (target) {
            setCommunity(target);
          } else {
            // Fetch directly
            const single = await api.get(`/communities/${targetId}`);
            if (single.success) setCommunity(single.community);
          }
        }
      } catch (err) {
        console.error('Error loading chat:', err);
      } finally {
        setLoading(false);
      }
    };

    loadChat();
  }, [communityId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
        <RefreshCw className="w-8 h-8 text-retro-cyan animate-spin mb-3" />
        <p className="text-sm font-mono text-slate-400">Tuning into community radio...</p>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <h2 className="text-2xl font-bold text-white">Community Chat Not Found</h2>
        <button
          onClick={() => navigate('/community')}
          className="mt-4 px-4 py-2 bg-retro-amber text-slate-950 font-bold rounded-xl text-sm"
        >
          Discover Communities
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Community Quick-Switch Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
        <span className="text-xs font-mono font-bold uppercase text-slate-500 shrink-0">
          GUILDS:
        </span>
        {allCommunities.map((c) => {
          const isCurrent = c._id === community._id;
          return (
            <button
              key={c._id}
              onClick={() => navigate(`/chat/${c._id}`)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isCurrent
                  ? 'bg-retro-amber text-slate-950 font-bold shadow-glow-amber'
                  : 'bg-slate-900/90 text-slate-300 border border-slate-800 hover:border-slate-700'
              }`}
            >
              <img src={c.image} alt={c.name} className="w-4 h-4 rounded-md object-cover" />
              <span>{c.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Discord Chat Window */}
      <DiscordChat community={community} />
    </div>
  );
};
