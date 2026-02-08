import React from 'react';
import { motion } from 'framer-motion';
import { Users, Zap, Calendar, Bot } from 'lucide-react';
import { GradientText } from '../ui/GradientText';
import { StatCard } from '../ui/StatCard';

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

export const HeroSection: React.FC = () => {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="py-24 md:py-32 text-center"
    >
      {/* Badge */}
      <motion.div variants={item} className="flex justify-center mb-8">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-cyan-400 font-bold tracking-widest uppercase">
            Direct Handshake Active — Sovereign Tier
          </span>
        </div>
      </motion.div>

      {/* Headline */}
      <motion.h1
        variants={item}
        className="text-5xl md:text-7xl lg:text-8xl font-black font-sans leading-tight mb-6"
      >
        <GradientText from="cyan-400" to="emerald-400">
          Build at AI Speed
        </GradientText>
      </motion.h1>

      {/* Subhead */}
      <motion.p
        variants={item}
        className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-16 font-sans"
      >
        Join 1,000 founders shipping products in 30 days.
        <br className="hidden sm:block" />
        Zero equity. Maximum velocity.
      </motion.p>

      {/* Stat Cards */}
      <motion.div
        variants={container}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto"
      >
        <StatCard icon={Users} number="2,847+" label="Neural Syncs" accent="cyan" delay={0} />
        <StatCard icon={Zap} number="153" label="Bandwidth Available" accent="emerald" delay={0.1} />
        <StatCard icon={Calendar} number="30" label="Days to Launch" accent="amber" delay={0.2} />
        <StatCard icon={Bot} number="17" label="Active Swarm" accent="violet" delay={0.3} />
      </motion.div>
    </motion.section>
  );
};
