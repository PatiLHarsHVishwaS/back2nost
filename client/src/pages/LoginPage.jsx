import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, Lock, Mail, User, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) return;
    setLoading(true);

    const res = await login(identifier, password);
    setLoading(false);
    if (res.success) {
      navigate('/explore');
    }
  };

  const handleQuickDemoLogin = async (demoUsername) => {
    setIdentifier(demoUsername);
    setPassword('password123');
    setLoading(true);
    const res = await login(demoUsername, 'password123');
    setLoading(false);
    if (res.success) {
      navigate('/explore');
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-retro-amber/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Card Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-retro-amber shadow-glow-amber mb-3">
            <Clock className="w-7 h-7" />
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white">
            Enter The Time Machine
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Access your childhood memories and community guilds.
          </p>
        </div>

        {/* Login Form Container */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0F131D]/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-1.5">
                Username or Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. Rohan or rohan@nostalgia.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#07090E] border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-retro-amber transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#07090E] border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-retro-amber transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-retro-amber to-retro-orange text-slate-950 font-bold text-sm tracking-wide shadow-glow-amber hover:opacity-95 transition-all disabled:opacity-50"
            >
              {loading ? 'Powering Up...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo One-Click Logins for Hackathon Judges */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <p className="text-[11px] font-mono text-slate-400 uppercase text-center mb-2.5">
              ⚡ Quick 1-Click Demo Accounts:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Rohan')}
                className="py-2 px-3 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-retro-amber text-xs text-slate-200 font-semibold transition-all hover:bg-slate-800 text-center"
              >
                👦 Rohan (2000s)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Sneha')}
                className="py-2 px-3 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-retro-cyan text-xs text-slate-200 font-semibold transition-all hover:bg-slate-800 text-center"
              >
                👧 Sneha (2000s)
              </button>
            </div>
            <p className="text-[10px] text-slate-500 text-center mt-2">
              Tip: Open another browser window to test real-time chat between Rohan & Sneha!
            </p>
          </div>

          {/* Footer link */}
          <div className="mt-6 text-center text-xs text-slate-400">
            New time traveler?{' '}
            <Link to="/register" className="text-retro-amber font-bold hover:underline">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
