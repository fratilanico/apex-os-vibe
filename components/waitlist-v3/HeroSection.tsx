import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { GradientText } from '../ui/GradientText';
import { RotatingPunchlines } from '../ui/RotatingPunchlines';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

// Countdown timer component
const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  useEffect(() => {
    // Target: 18 days from now (approximate cohort launch)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 18);
    
    const updateTimer = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft({ days, hours, minutes, seconds });
    };
    
    // Update immediately
    updateTimer();
    
    // Update every second for smooth experience
    const interval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-4 text-cyan-400 font-mono">
      <div className="text-center min-w-[45px] sm:min-w-[60px]">
        <div className="text-xl sm:text-3xl font-bold">{timeLeft.days}</div>
        <div className="text-[8px] sm:text-[10px] uppercase tracking-wider text-white/40">Days</div>
      </div>
      <div className="text-lg sm:text-xl">:</div>
      <div className="text-center min-w-[45px] sm:min-w-[60px]">
        <div className="text-xl sm:text-3xl font-bold">{timeLeft.hours}</div>
        <div className="text-[8px] sm:text-[10px] uppercase tracking-wider text-white/40">Hrs</div>
      </div>
      <div className="text-lg sm:text-xl">:</div>
      <div className="text-center min-w-[45px] sm:min-w-[60px]">
        <div className="text-xl sm:text-3xl font-bold">{timeLeft.minutes}</div>
        <div className="text-[8px] sm:text-[10px] uppercase tracking-wider text-white/40">Min</div>
      </div>
      <div className="text-lg sm:text-xl">:</div>
      <div className="text-center min-w-[45px] sm:min-w-[60px]">
        <div className="text-xl sm:text-3xl font-bold">{timeLeft.seconds}</div>
        <div className="text-[8px] sm:text-[10px] uppercase tracking-wider text-white/40">Sec</div>
      </div>
    </div>
  );
};

export const HeroSection: React.FC = () => {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="py-16 md:py-24 text-center"
    >
      {/* Headline */}
      <motion.h1
        variants={item}
        className="text-5xl md:text-7xl lg:text-8xl font-black font-sans leading-tight mb-6"
      >
        <GradientText from="cyan-400" to="emerald-400">
          Build at AI Speed
        </GradientText>
      </motion.h1>

      {/* Rotating Punchlines */}
      <motion.div variants={item} className="mb-12">
        <RotatingPunchlines />
        <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mt-4 font-sans">
          Zero equity. Maximum velocity.
        </p>
      </motion.div>

      {/* Countdown Section */}
      <motion.div variants={item} className="mb-12">
        <p className="text-sm text-white/40 uppercase tracking-widest mb-4">
          Next Webinar Launch
        </p>
        <CountdownTimer />
        <p className="text-cyan-400/80 text-sm mt-4 max-w-md mx-auto font-semibold">
          First class starts 2nd week of March
        </p>
        <p className="text-white/30 text-sm mt-2 max-w-md mx-auto">
          Secure your spot. Limited bandwidth available for personalized onboarding.
        </p>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        variants={item}
        className="flex flex-col items-center gap-2 text-white/30"
      >
        <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </motion.section>
  );
};
