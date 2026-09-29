import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TimeMachinePortal } from '../components/TimeMachinePortal';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [selectedEra, setSelectedEra] = useState('2000s');

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center overflow-hidden">
      {/* Background: Cozy Nostalgic Bedroom with Vignette Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/hero_room.jpg"
          alt="Nostalgic Childhood Room"
          className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-[1.1] scale-102"
        />
        {/* Warm ambient lighting vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080A10] via-transparent to-[#080A10]/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_#080A10_90%)]" />
      </div>

      {/* Hanging Signs on the Right Side from the Reference */}
      <div className="hidden lg:flex flex-col gap-2.5 absolute right-8 top-28 z-20 pointer-events-none select-none">
        <div className="px-3.5 py-1.5 rounded-lg bg-[#5A3314] border-2 border-[#A86429] text-[#FFFDF7] font-cartoon font-bold text-xs shadow-lg transform rotate-2">
          SAME CARTOONS
        </div>
        <div className="px-3.5 py-1.5 rounded-lg bg-[#5A3314] border-2 border-[#A86429] text-[#FFFDF7] font-cartoon font-bold text-xs shadow-lg transform -rotate-1">
          SAME TOYS
        </div>
        <div className="px-3.5 py-1.5 rounded-lg bg-[#5A3314] border-2 border-[#A86429] text-[#FFFDF7] font-cartoon font-bold text-xs shadow-lg transform rotate-3">
          SAME FEELINGS
        </div>
      </div>

      {/* Main Center Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-8 flex flex-col items-center text-center">
        {/* 3D Cartoon Brand Typography */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-2"
        >
          <span className="cartoon-title text-4xl sm:text-6xl md:text-7xl tracking-wider leading-none">
            Back to
          </span>
          <span className="cartoon-title-gold text-5xl sm:text-7xl md:text-8xl tracking-wide -mt-1 sm:-mt-2">
            Nostalgia
          </span>
        </motion.div>

        {/* Subtitle */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-white font-cartoon text-lg sm:text-2xl mt-1 tracking-wide drop-shadow-md"
        >
          Step into your childhood again!
        </motion.h2>

        {/* Supporting Text */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-slate-300 text-xs sm:text-sm max-w-lg mt-1.5 mb-6 leading-relaxed"
        >
          Explore, share and relive the toys, cartoons, games and moments that made you,{' '}
          <strong className="text-retro-amber font-semibold">YOU</strong>.
        </motion.p>

        {/* The Steampunk Time Machine Portal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full flex justify-center"
        >
          <TimeMachinePortal
            selectedEra={selectedEra}
            onEraSelect={(era) => setSelectedEra(era)}
          />
        </motion.div>
      </div>
    </div>
  );
};
