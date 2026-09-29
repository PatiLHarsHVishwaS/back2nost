import React, { useState, useRef, Suspense, lazy } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Optional Spline loader for 3D time machine scene
const Spline = lazy(() =>
  import('@splinetool/react-spline').catch(() => ({ default: () => null }))
);

export const TimeMachinePortal = ({ selectedEra, onEraSelect }) => {
  const navigate = useNavigate();
  const [splineLoaded, setSplineLoaded] = useState(false);
  const containerRef = useRef(null);

  // 3D Tilt Effect on mouse move
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg']);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const eras = [
    { id: '1990s', label: '1990s', glow: 'border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.4)] text-amber-200' },
    { id: '2000s', label: '2000s', glow: 'border-yellow-400 bg-yellow-500/20 text-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.5)]' },
    { id: '2010s', label: '2010s', glow: 'border-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.4)] text-cyan-200' },
    { id: '2020s', label: '2020s', glow: 'border-pink-500/60 shadow-[0_0_15px_rgba(236,72,153,0.4)] text-pink-200' },
  ];

  const handleEnter = () => {
    navigate(`/explore?era=${selectedEra}`);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[380px] sm:max-w-[460px] md:max-w-[620px] mx-auto select-none flex flex-col items-center"
      style={{ perspective: 1000 }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative w-full aspect-square flex items-center justify-center"
      >
        {/* Outer ambient glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/20 via-purple-600/25 to-cyan-500/20 blur-3xl opacity-80 pointer-events-none" />

        {/* Steampunk Outer Heavy Gear Ring */}
        <div className="relative w-[340px] sm:w-[480px] h-[340px] sm:h-[480px] rounded-full border-[10px] sm:border-[14px] border-[#5E3B1E] bg-[#140F1F] shadow-[0_0_60px_rgba(255,176,32,0.45),inset_0_0_50px_rgba(0,0,0,0.95)] flex items-center justify-center">
          {/* Inner brass rim with bolts */}
          <div className="absolute inset-2 sm:inset-3 rounded-full border-4 border-amber-600/60" />

          {/* Steampunk Bolts along the perimeter */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <div
              key={deg}
              className="absolute w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-gradient-to-br from-amber-200 to-amber-700 border border-black shadow-md"
              style={{
                transform: `rotate(${deg}deg) translate(0, -${160}px)`,
              }}
            />
          ))}

          {/* Glowing Vacuum Tube at Top Right */}
          <div className="absolute -top-7 right-14 sm:right-24 flex items-center gap-2">
            <div className="w-4 sm:w-5 h-9 sm:h-12 rounded-t-full bg-gradient-to-t from-cyan-500/60 to-cyan-200/80 border border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.7)]" />
            <div className="w-4 sm:w-5 h-11 sm:h-14 rounded-t-full bg-gradient-to-t from-amber-500/60 to-amber-200/80 border border-amber-400 shadow-[0_0_15px_rgba(255,176,32,0.7)]" />
          </div>

          {/* Neon Coils on the side */}
          <div className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1.5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-5 sm:w-7 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.8)]"
              />
            ))}
          </div>

          {/* Steampunk Pressure Gauge on Left */}
          <div className="absolute -left-4 sm:-left-5 top-1/3 w-10 sm:w-14 h-10 sm:h-14 rounded-full bg-[#3D2311] border-2 border-amber-500 shadow-md flex items-center justify-center">
            <div className="w-8 sm:w-11 h-8 sm:h-11 rounded-full bg-[#FFFBEB] border border-black flex items-center justify-center relative">
              <div className="w-0.5 h-3 sm:h-4 bg-rose-600 rounded-full origin-bottom rotate-45" />
              <div className="absolute w-1.5 h-1.5 bg-black rounded-full" />
            </div>
          </div>

          {/* Swirling Cosmic Vortex Background */}
          <div className="relative w-[280px] sm:w-[410px] h-[280px] sm:h-[410px] rounded-full overflow-hidden flex flex-col items-center justify-between p-4 sm:p-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900 via-purple-950 to-[#0A0612]">
            {/* Spinning Stars / Nebula Canvas / SVG Vortex */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(236,72,153,0.3)_0%,_rgba(147,51,234,0.4)_40%,_transparent_75%)]"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 opacity-40 bg-[conic-gradient(from_0deg_at_50%_50%,_rgba(0,240,255,0.5)_0deg,_transparent_60deg,_rgba(255,176,32,0.5)_180deg,_transparent_240deg,_rgba(0,240,255,0.5)_360deg)]"
            />

            {/* Top: Wooden Plaque "SELECT YOUR ERA" */}
            <div className="relative z-10 mt-2 px-5 py-1 sm:py-1.5 rounded-full bg-gradient-to-b from-[#8C5228] to-[#512D14] border-2 border-[#D98A4E] shadow-lg">
              <span className="font-cartoon font-bold text-xs sm:text-sm tracking-wider text-[#FFFDF7] drop-shadow-md">
                SELECT YOUR ERA
              </span>
            </div>

            {/* Center: The 4 Glowing Era Pills */}
            <div className="relative z-10 w-full max-w-sm flex items-center justify-center gap-1.5 sm:gap-2 my-auto">
              {eras.map((era) => {
                const isSelected = selectedEra === era.id;
                return (
                  <button
                    key={era.id}
                    onClick={() => onEraSelect(era.id)}
                    className={`flex-1 py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl border text-xs sm:text-sm font-cartoon font-extrabold transition-all duration-200 transform ${
                      isSelected
                        ? 'bg-gradient-to-b from-yellow-300 to-amber-500 text-slate-950 border-amber-200 shadow-[0_0_20px_rgba(255,200,50,0.8)] scale-108 -translate-y-1'
                        : 'bg-[#0E101B]/80 hover:bg-[#161B2B] hover:scale-102 border-slate-700/80 text-slate-300'
                    }`}
                  >
                    {era.label}
                  </button>
                );
              })}
            </div>

            {/* Bottom: Large Coral-Red "ENTER →" Button */}
            <div className="relative z-10 mb-3 sm:mb-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleEnter}
                className="px-8 sm:px-12 py-2 sm:py-3.5 rounded-full bg-gradient-to-r from-rose-500 via-retro-coral to-rose-600 text-white font-cartoon font-black text-sm sm:text-lg tracking-wider border-2 border-rose-300 shadow-[0_0_30px_rgba(255,51,102,0.8)] flex items-center gap-2 hover:brightness-110 transition-all"
              >
                <span>ENTER</span>
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
