import React, { useState } from 'react';
import { Tv } from 'lucide-react';

export const CrtOverlay = () => {
  const [crtActive, setCrtActive] = useState(false);

  return (
    <>
      {crtActive && (
        <div className="fixed inset-0 crt-overlay pointer-events-none z-50 opacity-40 mix-blend-screen" />
      )}
      <button
        onClick={() => setCrtActive(!crtActive)}
        title={crtActive ? 'Disable CRT Filter' : 'Enable CRT Retro Filter'}
        className={`fixed bottom-20 md:bottom-6 left-6 z-40 p-2.5 rounded-full border text-xs flex items-center gap-1.5 transition-all shadow-xl backdrop-blur-md ${
          crtActive
            ? 'bg-retro-amber/20 border-retro-amber text-retro-amber shadow-glow-amber'
            : 'bg-[#0E131E]/80 border-slate-700/60 text-slate-400 hover:text-slate-200'
        }`}
      >
        <Tv className="w-4 h-4" />
        <span className="font-mono hidden sm:inline">{crtActive ? 'CRT: ON' : 'CRT: OFF'}</span>
      </button>
    </>
  );
};
