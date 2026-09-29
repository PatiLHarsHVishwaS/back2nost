import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Clock, Compass, Users, MessageSquare, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const MobileNav = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { label: 'Home', path: '/', icon: Clock },
    { label: 'Explore', path: '/explore', icon: Compass },
    { label: 'Communities', path: '/community', icon: Users },
    {
      label: 'Chat',
      path: user?.joinedCommunities?.[0]?._id
        ? `/chat/${user.joinedCommunities[0]._id}`
        : '/community',
      icon: MessageSquare,
    },
    {
      label: 'Profile',
      path: user ? `/profile/${user.username}` : '/login',
      icon: UserIcon,
    },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#07090E]/95 backdrop-blur-xl border-t border-slate-800/90 px-2 py-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                active ? 'text-retro-amber font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1 rounded-lg ${
                  active ? 'bg-retro-amber/15 shadow-glow-amber' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
