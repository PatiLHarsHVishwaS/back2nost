import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Clock,
  User as UserIcon,
  ChevronDown,
  LogOut,
  Bookmark,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [navSearch, setNavSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(navSearch.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#090C14]/90 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Main Nav Links */}
        <div className="flex items-center gap-6 sm:gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            {/* Retro Clock emblem */}
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-retro-orange via-retro-amber to-retro-cyan p-0.5 shadow-glow-amber transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-[#0E121B] rounded-[10px] flex items-center justify-center">
                <Clock className="w-5 h-5 text-retro-amber" />
              </div>
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-[11px] font-bold text-slate-300 tracking-wider">
                Backto
              </span>
              <span className="font-cartoon font-extrabold text-lg tracking-wide text-retro-amber group-hover:text-yellow-300 transition-colors">
                Nostalgia
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-2">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isActive('/')
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Home
            </Link>

            <Link
              to="/explore"
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isActive('/explore')
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Explore
            </Link>

            <Link
              to="/community"
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isActive('/community')
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Communities
            </Link>

            <Link
              to="/vault"
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isActive('/vault')
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Vault
            </Link>
          </nav>
        </div>

        {/* Center / Right: Search Bar */}
        <div className="flex-1 max-w-sm hidden sm:block">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              placeholder="Search your childhood..."
              className="w-full pl-9 pr-4 py-1.5 rounded-full bg-[#121622] border border-slate-700/80 text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-retro-amber focus:ring-1 focus:ring-retro-amber transition-all"
            />
          </form>
        </div>

        {/* Far Right: Notifications Bell & User Profile */}
        <div className="flex items-center gap-3">
          <Link
            to="/search"
            className="sm:hidden p-2 text-slate-400 hover:text-white"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </Link>

          <button
            onClick={() => navigate('/community')}
            className="p-2 text-slate-400 hover:text-slate-200 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-retro-coral rounded-full" />
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1 pr-2 bg-slate-900/90 border border-slate-700/80 rounded-full hover:border-retro-amber transition-all"
              >
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-7 h-7 rounded-full object-cover border border-slate-600"
                />
                <span className="text-xs font-semibold text-slate-200 hidden lg:inline">
                  {user.username}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#121622] border border-slate-700/80 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3.5 py-1.5 border-b border-slate-800">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-slate-100 truncate">
                        {user.username}
                      </p>
                    </div>

                    <Link
                      to={`/profile/${user.username}`}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800"
                    >
                      <UserIcon className="w-4 h-4 text-retro-cyan" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/time-capsule"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800"
                    >
                      <Bookmark className="w-4 h-4 text-retro-amber" />
                      <span>My Time Capsule</span>
                    </Link>

                    <div className="border-t border-slate-800 my-1" />

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-rose-400 hover:bg-rose-500/10 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Leave Time Machine</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1 rounded-full text-xs font-semibold text-slate-300 hover:text-white"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-3 py-1 rounded-full text-xs font-bold bg-retro-coral text-white hover:opacity-90 shadow-glow-coral transition-all"
              >
                Join
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
