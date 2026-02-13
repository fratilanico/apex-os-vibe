import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { GradientText } from '../ui/GradientText';
import { RotatingPunchlines } from '../ui/RotatingPunchlines';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } } };
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };

const CountdownTimer: React.FC = () => {
  // Using static values as the timer logic is secondary to layout
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-4 text-cyan-400 font-mono">
      <div className="text-center min-w-[45px] sm:min-w-[60px]"><div className="text-xl sm:text-3xl font-bold">17</div><div className="text-[8px] sm:text-[10px] uppercase tracking-wider text-white/40">Days</div></div>
      <div className="text-lg sm:text-xl">:</div>
      <div className="text-center min-w-[45px] sm:min-w-[60px]"><div className="text-xl sm:text-3xl font-bold">08</div><div className="text-[8px] sm:text-[10px] uppercase tracking-wider text-white/40">Hrs</div></div>
      <div className="text-lg sm:text-xl">:</div>
      <div className="text-center min-w-[45px] sm:min-w-[60px]"><div className="text-xl sm:text-3xl font-bold">42</div><div className="text-[8px] sm:text-[10px] uppercase tracking-wider text-white/40">Min</div></div>
      <div className="text-lg sm:text-xl">:</div>
      <div className="text-center min-w-[45px] sm:min-w-[60px]"><div className="text-xl sm:text-3xl font-bold">15</div><div className="text-[8px] sm:text-[10px] uppercase tracking-wider text-white/40">Sec</div></div>
    </div>
  );
};

export const HeroSection: React.FC = () => {
  return (
    <motion.section variants={container} initial="hidden" animate="show" className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden">
      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-6xl mx-auto px-4">
        <motion.h1 variants={item} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-sans leading-none mb-6 whitespace-nowrap">
          <GradientText from="cyan-400" to="emerald-400">Build at AI Speed</GradientText>
        </motion.h1>
        <motion.div variants={item} className="mb-8 max-w-3xl">
          <RotatingPunchlines />
          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mt-4 font-sans">Zero equity. Maximum velocity.</p>
        </motion.div>
        <motion.div variants={item} className="mb-6">
          <p className="text-xs md:text-sm text-white/40 uppercase tracking-widest mb-4">Next Webinar Launch</p>
          <CountdownTimer />
        </motion.div>
      </div>
      <motion.div variants={item} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
        <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}><ArrowDown className="w-5 h-5" /></motion.div>
      </motion.div>
    </motion.section>
  );
};