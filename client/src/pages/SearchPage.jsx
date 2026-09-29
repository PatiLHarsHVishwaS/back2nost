import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Compass, Users, User, Clock, RefreshCw } from 'lucide-react';
import { api } from '../api/client';
import { PostCard } from '../components/PostCard';
import { CommunityCard } from '../components/CommunityCard';

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [query, setQuery] = useState(queryParam);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'posts' | 'communities' | 'users'
  const [loading, setLoading] = useState(false);

  const [results, setResults] = useState({
    posts: [],
    communities: [],
    users: [],
  });

  const performSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setResults({ posts: [], communities: [], users: [] });
      return;
    }

    setLoading(true);
    try {
      const [postsRes, commsRes, usersRes] = await Promise.all([
        api.get(`/posts?search=${encodeURIComponent(searchTerm)}`),
        api.get(`/communities?search=${encodeURIComponent(searchTerm)}`),
        api.get(`/users?search=${encodeURIComponent(searchTerm)}`),
      ]);

      setResults({
        posts: postsRes.posts || [],
        communities: commsRes.communities || [],
        users: usersRes.users || [],
      });
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryParam) {
      performSearch(queryParam);
    }
  }, [queryParam]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
      performSearch(query.trim());
    }
  };

  const totalResults =
    results.posts.length + results.communities.length + results.users.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Header */}
      <div className="max-w-3xl mx-auto mb-8">
        <h1 className="font-display font-black text-2xl sm:text-4xl text-white text-center mb-4">
          Search The Time Machine
        </h1>
        <form onSubmit={handleSubmit} className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search nostalgia posts, communities, users (e.g. Doraemon, Beyblade, Rohan)..."
            className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-[#0F131D] border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-retro-amber focus:ring-1 focus:ring-retro-amber shadow-2xl transition-all"
          />
          <button
            type="submit"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-retro-amber text-slate-950 font-bold text-xs shadow-glow-amber hover:bg-amber-400 transition-colors"
          >
            Search
          </button>
        </form>

        {/* Quick sample chips */}
        <div className="flex items-center justify-center gap-2 mt-3 text-xs text-slate-400 flex-wrap">
          <span>Popular:</span>
          {['Doraemon', 'Road Rash', 'Cadbury Bytes', 'Nokia', 'Beyblade', 'Maruti 800'].map(
            (sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => {
                  setQuery(sample);
                  setSearchParams({ q: sample });
                  performSearch(sample);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
              >
                {sample}
              </button>
            )
          )}
        </div>
      </div>

      {/* Tabs */}
      {queryParam && (
        <div className="flex items-center justify-center gap-2 border-b border-slate-800 mb-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'all'
                ? 'border-retro-amber text-retro-amber'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            All Results ({totalResults})
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'posts'
                ? 'border-retro-amber text-retro-amber'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Posts ({results.posts.length})
          </button>
          <button
            onClick={() => setActiveTab('communities')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'communities'
                ? 'border-retro-amber text-retro-amber'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Communities ({results.communities.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'users'
                ? 'border-retro-amber text-retro-amber'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Travelers ({results.users.length})
          </button>
        </div>
      )}

      {/* Results Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 text-retro-amber animate-spin mb-3" />
          <p className="text-sm font-mono text-slate-400">Searching space-time continuum...</p>
        </div>
      ) : queryParam ? (
        <div className="space-y-12">
          {/* Communities section */}
          {(activeTab === 'all' || activeTab === 'communities') &&
            results.communities.length > 0 && (
              <div>
                <h3 className="font-display font-bold text-lg text-white mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-retro-cyan" />
                  <span>Communities ({results.communities.length})</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {results.communities.map((c) => (
                    <CommunityCard key={c._id} community={c} />
                  ))}
                </div>
              </div>
            )}

          {/* Users section */}
          {(activeTab === 'all' || activeTab === 'users') && results.users.length > 0 && (
            <div>
              <h3 className="font-display font-bold text-lg text-white mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-retro-amber" />
                <span>Travelers ({results.users.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.users.map((u) => (
                  <Link
                    key={u._id}
                    to={`/profile/${u.username}`}
                    className="p-4 rounded-2xl bg-[#0F131D] border border-slate-800 hover:border-retro-amber/40 flex items-center gap-3 transition-colors"
                  >
                    <img
                      src={u.avatar}
                      alt={u.username}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-slate-200">{u.username}</p>
                      <p className="text-xs text-slate-400 truncate">{u.bio}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Posts section */}
          {(activeTab === 'all' || activeTab === 'posts') && results.posts.length > 0 && (
            <div>
              <h3 className="font-display font-bold text-lg text-white mb-4 flex items-center gap-2">
                <Compass className="w-4 h-4 text-retro-amber" />
                <span>Nostalgia Posts ({results.posts.length})</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.posts.map((p) => (
                  <PostCard key={p._id} post={p} />
                ))}
              </div>
            </div>
          )}

          {totalResults === 0 && (
            <div className="text-center py-20 bg-[#0F131D]/40 rounded-3xl border border-dashed border-slate-800">
              <p className="text-base text-slate-300">No time records found for "{queryParam}".</p>
              <p className="text-xs text-slate-500 mt-1">
                Try searching for another cartoon, candy, toy or game!
              </p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
