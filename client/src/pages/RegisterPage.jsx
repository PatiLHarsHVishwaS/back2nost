import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, Lock, Mail, User, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [eraPreference, setEraPreference] = useState('2000s');
  const [bio, setBio] = useState('Born in the right era ❤️');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const eras = ['90s', '2000s', '2010s', '2020s'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) return;
    setLoading(true);

    const res = await register({
      username,
      email,
      password,
      eraPreference,
      bio,
    });
    setLoading(false);
    if (res.success) {
      navigate('/explore');
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-retro-cyan/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-retro-cyan shadow-glow-cyan mb-3">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white">
            Join Backto Nostalgia
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Pick your childhood era and start your time journey.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-[#0F131D]/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. Utkarsh"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#07090E] border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-retro-cyan transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="traveler@nostalgia.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#07090E] border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-retro-cyan transition-all"
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
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#07090E] border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-retro-cyan transition-all"
                />
              </div>
            </div>

            {/* Favorite Era */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-1.5">
                Your Childhood Era
              </label>
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#07090E] rounded-xl border border-slate-700/80">
                {eras.map((e) => (
                  <button
                    type="button"
                    key={e}
                    onClick={() => setEraPreference(e)}
                    className={`py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                      eraPreference === e
                        ? 'bg-retro-cyan text-slate-950 shadow-glow-cyan'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-retro-cyan to-blue-500 text-slate-950 font-bold text-sm tracking-wide shadow-glow-cyan hover:opacity-95 transition-all disabled:opacity-50"
            >
              {loading ? 'Creating Passport...' : 'Register & Enter'}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-retro-cyan font-bold hover:underline">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
