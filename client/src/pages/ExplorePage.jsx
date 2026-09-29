import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, Wand2, Clock } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { personalities, dayTimeline2000s, memoryMoments } from '../data/dayInLifeData';
import { DaySegment } from '../components/DaySegment';

const eraData = {
  '1990s': { title: '1990s Era', subtitle: 'Relive the golden 90s!' },
  '2000s': { title: '2000s Era', subtitle: 'Relive the golden 2000s!' },
  '2010s': { title: '2010s Era', subtitle: 'Relive the 2010s!' },
  '2020s': { title: '2020s Era', subtitle: 'Relive the 2020s!' },
};

export const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();

  const rawEra = searchParams.get('era');
  const currentEra = eraData[rawEra] ? rawEra : '2000s';

  const [selectedPersonality, setSelectedPersonality] = useState('cartoon');
  const [remembered, setRemembered] = useState(false);

  const activePersonality = personalities.find((p) => p.id === selectedPersonality) || personalities[0];
  const topCategory = activePersonality.priority[0];

  const memoryMoment = useMemo(
    () => memoryMoments[Math.floor(Math.random() * memoryMoments.length)],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedPersonality]
  );

  const handleEraChange = (era) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('era', era);
    setSearchParams(newParams);
  };

  const handleRemember = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    confetti({
      particleCount: 60,
      spread: 65,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      },
      colors: ['#FFB020', '#FF5E1E', '#00F0FF', '#FF007F'],
    });
    setRemembered(true);
    toast.success("You're not alone — thousands remember this too! ✨");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 2000s Era Panoramic Header Banner */}
      <div className="relative w-full rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl mb-8 bg-[#121622]">
        <img
          src="/assets/banner_2000s.jpg"
          alt="2000s Era Banner"
          className="w-full h-44 sm:h-64 object-cover object-center filter brightness-[0.7] contrast-[1.05]"
        />

        {/* Ambient Dark Overlay with Centered Titles */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0D14]/80 via-[#0B0D14]/50 to-[#0B0D14]/80 flex flex-col items-center justify-center text-center p-4">
          <h1 className="font-cartoon text-3xl sm:text-5xl text-[#FFFDF7] drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
            {eraData[currentEra].title}
          </h1>
          <p className="text-retro-amber font-cartoon text-sm sm:text-xl mt-1 tracking-wide drop-shadow-md">
            {eraData[currentEra].subtitle}
          </p>
        </div>
      </div>

      {/* ============ SECTION 1 — CHILDHOOD INTRO ============ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl mx-auto mb-10"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-retro-amber text-xs font-mono font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Childhood Replay</span>
        </div>
        <h2 className="font-display font-black text-2xl sm:text-4xl text-white">
          YOUR {currentEra} CHILDHOOD
        </h2>
        <p className="text-slate-400 text-sm sm:text-base mt-3">
          Before smartphones. Before endless scrolling. Just school, cartoons, games and memories.
        </p>
      </motion.div>

      {/* Personality Selector */}
      <div className="mb-14">
        <h3 className="text-center font-display font-bold text-lg sm:text-2xl text-slate-100 mb-6">
          What kind of {currentEra} kid were you?
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {personalities.map((p) => {
            const isSelected = selectedPersonality === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPersonality(p.id)}
                className={`flex flex-col items-center text-center gap-2 p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#1C2333] border-retro-amber shadow-glow-amber scale-[1.03]'
                    : 'bg-[#0F131D] border-slate-800 hover:border-slate-700 hover:bg-[#151B2A]'
                }`}
              >
                <span className="text-3xl sm:text-4xl">{p.emoji}</span>
                <span
                  className={`text-[11px] sm:text-xs font-bold tracking-tight ${
                    isSelected ? 'text-retro-amber' : 'text-slate-300'
                  }`}
                >
                  {p.label}
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-500 leading-snug">
                  {p.tagline}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {currentEra === '2000s' ? (
        <>
          {/* ============ SECTION 2 — A DAY IN THE LIFE ============ */}
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-retro-cyan/30 text-retro-cyan text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <Clock className="w-3.5 h-3.5" />
              <span>A Day In The Life</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-white">
              A DAY IN THE LIFE OF A 2000s KID
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">Let's rewind a normal day...</p>
          </div>

          <div className="relative pl-0 sm:pl-10 space-y-8 sm:space-y-10 mb-16">
            <div className="hidden sm:block absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-retro-amber/60 via-slate-700 to-transparent" />
            {dayTimeline2000s.map((segment, idx) => (
              <DaySegment
                key={segment.id}
                segment={segment}
                index={idx}
                isTopPick={segment.category === topCategory}
              />
            ))}
          </div>

          {/* ============ SECTION 3 — MEMORY MOMENT ============ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl bg-gradient-to-br from-[#181120] via-[#101422] to-[#1B190E] border border-retro-amber/40 p-8 sm:p-12 text-center overflow-hidden mb-16"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-retro-amber/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-xl mx-auto">
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
                DO YOU REMEMBER THIS?
              </h2>
              <p className="text-slate-200 text-sm sm:text-lg mt-4 italic leading-relaxed">
                "{memoryMoment}"
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 mt-7">
                <button
                  onClick={handleRemember}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                    remembered
                      ? 'bg-rose-500/20 border border-rose-500/50 text-rose-300'
                      : 'bg-[#07090E] border border-slate-700 text-slate-200 hover:border-rose-400/60 hover:text-rose-300'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${remembered ? 'fill-rose-400 text-rose-400' : ''}`} />
                  {remembered ? 'You Remember This!' : 'I Remember This'}
                </button>
                <Link
                  to="/create"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-retro-amber via-retro-orange to-retro-pink text-slate-950 font-bold text-xs shadow-glow-amber hover:opacity-95 transition-all"
                >
                  <Wand2 className="w-4 h-4" />
                  Share Your Memory
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      ) : (
        <div className="text-center py-16 rounded-3xl bg-[#0F131D]/40 border border-dashed border-slate-800 max-w-xl mx-auto p-8 mb-16">
          <Sparkles className="w-8 h-8 text-retro-amber mx-auto mb-3" />
          <h3 className="font-display font-bold text-lg text-slate-200">
            The {currentEra} journey is on its way
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            We're still gathering nostalgic memories for this era. The 2000s experience is the most
            complete right now — hop back to relive it!
          </p>
          <button
            onClick={() => handleEraChange('2000s')}
            className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl bg-retro-amber text-slate-950 font-bold text-xs shadow-glow-amber hover:bg-amber-400 transition-all"
          >
            Explore the 2000s
          </button>
        </div>
      )}

      {/* ============ SECTION 5 — ERA SWITCH ============ */}
      <div className="text-center mb-4">
        <h3 className="font-display font-bold text-lg sm:text-xl text-slate-100 mb-4">
          Want to travel to another era?
        </h3>
        <div className="flex items-center justify-center gap-2">
          {Object.keys(eraData).map((era) => (
            <button
              key={era}
              onClick={() => handleEraChange(era)}
              className={`px-5 py-2.5 rounded-xl text-sm font-mono font-bold transition-all ${
                currentEra === era
                  ? 'bg-retro-amber text-slate-950 shadow-glow-amber'
                  : 'bg-[#0F131D] text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              {era}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
