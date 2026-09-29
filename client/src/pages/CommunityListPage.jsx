import React, { useState, useEffect } from 'react';
import { Search, Users, Sparkles, RefreshCw } from 'lucide-react';
import { api } from '../api/client';
import { CommunityCard } from '../components/CommunityCard';

export const CommunityListPage = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCommunities = async () => {
    setLoading(true);
    try {
      const res = await api.get('/communities');
      if (res.success) {
        setCommunities(res.communities || []);
      }
    } catch (err) {
      console.error('Failed to fetch communities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  const filteredCommunities = communities.filter((c) => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(query) ||
      c.displayName.toLowerCase().includes(query) ||
      c.description.toLowerCase().includes(query)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Community Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#121727] via-[#0E1320] to-[#1C1226] border border-retro-cyan/30 p-6 sm:p-10 mb-8 shadow-glow-cyan">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-retro-cyan text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>Nostalgia Guilds & Hubs</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            COMMUNITIES
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
            Find your tribe. Join nostalgic discussions, jump into live Discord-style voice/text
            channels, and connect with people who grew up loving the exact same things.
          </p>
        </div>

        {/* Community Search */}
        <div className="mt-6 max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search communities (e.g. Cartoons, Snacks, Gaming)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#07090E]/90 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-retro-cyan focus:ring-1 focus:ring-retro-cyan transition-all"
          />
        </div>
      </div>

      {/* Grid of Communities */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 text-retro-cyan animate-spin mb-3" />
          <p className="text-sm font-mono text-slate-400">Loading communities...</p>
        </div>
      ) : filteredCommunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCommunities.map((community) => (
            <CommunityCard
              key={community._id}
              community={community}
              onMembershipChange={fetchCommunities}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#0F131D]/40 rounded-2xl border border-dashed border-slate-800">
          <p className="text-slate-300 text-sm">No communities matched your search.</p>
        </div>
      )}
    </div>
  );
};
