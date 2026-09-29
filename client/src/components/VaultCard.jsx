import React from 'react';
import { Play, Gamepad2, ExternalLink, Archive } from 'lucide-react';

const categoryAccent = {
  Movies: 'text-retro-coral border-retro-coral/40 bg-retro-coral/10',
  'TV Serials': 'text-retro-cyan border-retro-cyan/40 bg-retro-cyan/10',
  Cartoons: 'text-retro-amber border-retro-amber/40 bg-retro-amber/10',
  Games: 'text-retro-purple border-retro-purple/40 bg-retro-purple/10',
};

export const VaultCard = ({ item }) => {
  const isGame = item.category === 'Games';
  const accent = categoryAccent[item.category] || 'text-retro-amber border-retro-amber/40 bg-retro-amber/10';

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative rounded-2xl overflow-hidden flex flex-col bg-[#0F131D]/80 border border-slate-800 hover:border-retro-amber/50 backdrop-blur-xl shadow-retro-card transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-amber"
    >
      {/* Image / Placeholder */}
      <div className="relative aspect-[4/3] bg-black overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#181E2E] to-[#0B0D14]">
            <Archive className="w-9 h-9 text-slate-600" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-600">
              Vault Archive
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

        {/* Era badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-retro-amber/40 text-[11px] font-mono font-bold text-retro-amber">
          {item.era}
        </div>

        {/* External link indicator */}
        <div className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-slate-700/80 text-slate-300 group-hover:text-retro-cyan group-hover:border-retro-cyan/40 transition-colors">
          <ExternalLink className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <span
            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${accent}`}
          >
            {item.category}
          </span>
          <h3 className="font-display font-bold text-base sm:text-lg text-slate-100 mt-2 group-hover:text-amber-300 transition-colors line-clamp-1">
            {item.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
            {item.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-retro-amber via-retro-orange to-retro-pink text-slate-950 font-bold text-[11px] shadow-glow-amber group-hover:opacity-95 transition-all">
            {isGame ? <Gamepad2 className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isGame ? 'VIEW / PLAY' : 'WATCH NOW'}</span>
          </span>
          <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
            External Link <ExternalLink className="w-3 h-3" />
          </span>
        </div>
      </div>
    </a>
  );
};
