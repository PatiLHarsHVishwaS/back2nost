import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Archive, ArrowRight, Star } from 'lucide-react';

export const DaySegment = ({ segment, isTopPick, index }) => {
  const isMedia = segment.type === 'media';

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: 0.05 }}
      className="relative"
    >
      {/* Timeline connector node */}
      <div className="hidden sm:flex absolute -left-[42px] top-1 w-6 h-6 rounded-full bg-[#0F131D] border-2 border-retro-amber items-center justify-center shadow-glow-amber">
        <div className="w-2 h-2 rounded-full bg-retro-amber" />
      </div>

      <div
        className={`relative rounded-3xl p-5 sm:p-8 overflow-hidden border transition-all ${
          segment.big
            ? 'bg-gradient-to-br from-[#1B1409] via-[#0F131D] to-[#10141F] border-retro-amber/50 shadow-glow-amber'
            : 'bg-[#0F131D]/70 border-slate-800'
        }`}
      >
        {segment.big && (
          <div className="absolute top-0 right-0 w-64 h-64 bg-retro-amber/10 rounded-full blur-3xl pointer-events-none" />
        )}

        {/* Header */}
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-retro-cyan uppercase tracking-widest mb-1.5">
              <span className="text-lg leading-none">{segment.emoji}</span>
              <span>{segment.time}</span>
            </div>
            <h3 className="font-display font-black text-xl sm:text-3xl text-white leading-tight">
              {segment.heading}
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-xl">{segment.subtitle}</p>
          </div>

          {isTopPick && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-retro-amber/15 border border-retro-amber/40 text-retro-amber text-[11px] font-mono font-bold uppercase tracking-wide shrink-0">
              <Star className="w-3.5 h-3.5 fill-retro-amber" />
              Your Top Pick
            </span>
          )}
        </div>

        {/* Content */}
        {isMedia ? (
          <div className="relative z-10 flex gap-4 overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible pb-2 scrollbar-none">
            {segment.media.map((m) => (
              <div
                key={m.title}
                className="group shrink-0 w-56 sm:w-auto rounded-2xl overflow-hidden bg-[#07090E]/80 border border-slate-800 hover:border-retro-amber/50 backdrop-blur-xl transition-all hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] bg-black overflow-hidden">
                  {m.image ? (
                    <img
                      src={m.image}
                      alt={m.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#181E2E] to-[#0B0D14]">
                      <Archive className="w-8 h-8 text-slate-600" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                </div>
                <div className="p-3.5">
                  <h4 className="font-display font-bold text-sm text-slate-100">{m.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    {m.tagline}
                  </p>
                  <Link
                    to="/vault"
                    className="inline-flex items-center gap-1 mt-3 text-[11px] font-bold text-retro-amber hover:text-amber-300 transition-colors"
                  >
                    RELIVE <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative z-10 flex gap-3 overflow-x-auto sm:grid sm:grid-cols-4 sm:overflow-visible pb-1 scrollbar-none">
            {segment.items.map((item) => (
              <div
                key={item.label}
                className="shrink-0 w-32 sm:w-auto flex flex-col items-center text-center gap-2 p-4 rounded-2xl bg-[#07090E]/70 border border-slate-800 hover:border-retro-cyan/40 transition-all"
              >
                <span className="text-3xl">{item.emoji}</span>
                <span className="text-xs font-semibold text-slate-300">{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
};
