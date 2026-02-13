import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, TrendingUp, Infinity, Target } from 'lucide-react';

export const TheHook: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-emerald-500/20 rounded-full blur-[120px] animate-pulse" />
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.path
            d="M0,50 Q25,30 50,50 T100,50"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-8"
        >
          <Zap className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-bold text-cyan-400 uppercase tracking-widest">The Hyperloop Effect</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
        >
          Beyond Linear
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-emerald-400">
            Growth
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl sm:text-2xl text-white/60 mb-12 max-w-3xl mx-auto"
        >
          We don't just fund startups. We multiply value through systematic AI orchestration.
        </motion.p>

        {/* The Multiplier Equation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8"
        >
          <div className="flex flex-col items-center p-6 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-3xl font-bold text-white mb-2">Input</span>
            <span className="text-sm text-white/40">Raw Talent</span>
          </div>
          
          <ArrowRight className="w-8 h-8 text-cyan-400 hidden sm:block" />
          
          <div className="flex flex-col items-center p-6 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/30">
            <span className="text-3xl font-bold text-cyan-400 mb-2">+</span>
            <span className="text-sm text-cyan-400 font-bold uppercase">Hyperloop</span>
          </div>
          
          <ArrowRight className="w-8 h-8 text-violet-400 hidden sm:block" />
          
          <div className="flex flex-col items-center p-6 rounded-2xl bg-gradient-to-br from-violet-500/20 to-emerald-500/20 border border-violet-500/30">
            <span className="text-3xl font-bold text-emerald-400 mb-2">Output</span>
            <span className="text-sm text-emerald-400 font-bold">×10 Multiplier</span>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-3 gap-6 mt-16 max-w-2xl mx-auto"
        >
          {[
            { value: '45%', label: 'Target IRR', icon: TrendingUp },
            { value: '6.8x', label: 'Return Multiple', icon: Target },
            { value: '∞', label: 'Scalability', icon: Infinity },
          ].map((metric, idx) => (
            <div key={idx} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 mb-3">
                <metric.icon className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{metric.value}</div>
              <div className="text-xs text-white/40 uppercase tracking-wider">{metric.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default TheHook;
