import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, TrendingUp, Users, Target, Zap, ArrowRight, Infinity, DollarSign } from 'lucide-react';

export const AcceleratorHero: React.FC = () => {
  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-violet-500/30 via-cyan-500/20 to-emerald-500/30 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute top-0 left-0 w-full h-full">
          <svg className="w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="hyperloop" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
            <motion.path
              d="M10,50 Q30,20 50,50 T90,50"
              fill="none"
              stroke="url(#hyperloop)"
              strokeWidth="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </svg>
        </div>
      </div>

      <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/20 border border-violet-500/40 mb-8"
        >
          <Rocket className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-bold text-violet-400 uppercase tracking-widest">The Hyperloop Accelerator</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl sm:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
        >
          We Don't Just
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400">
            Fund Startups
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl sm:text-3xl text-white/70 mb-12 max-w-3xl mx-auto"
        >
          We manufacture them. In 30 days. With AI.
        </motion.p>

        {/* The Multiplier Equation - BIGGER */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 mb-16"
        >
          <div className="flex flex-col items-center p-8 rounded-3xl bg-white/5 border border-white/10 min-w-[180px]">
            <Users className="w-8 h-8 text-white/40 mb-3" />
            <span className="text-2xl font-bold text-white mb-1">Raw Talent</span>
            <span className="text-sm text-white/40">500 applicants/yr</span>
          </div>
          
          <ArrowRight className="w-10 h-10 text-violet-400 hidden md:block" />
          
          <div className="flex flex-col items-center p-8 rounded-3xl bg-gradient-to-br from-violet-500/30 to-cyan-500/30 border-2 border-violet-500/50 shadow-2xl shadow-violet-500/20 min-w-[200px]">
            <Zap className="w-10 h-10 text-violet-400 mb-3" />
            <span className="text-3xl font-bold text-white mb-1">Hyperloop</span>
            <span className="text-sm text-violet-400 font-bold">30-Day Sprint</span>
          </div>
          
          <ArrowRight className="w-10 h-10 text-cyan-400 hidden md:block" />
          
          <div className="flex flex-col items-center p-8 rounded-3xl bg-gradient-to-br from-cyan-500/30 to-emerald-500/30 border-2 border-emerald-500/50 shadow-2xl shadow-emerald-500/20 min-w-[200px]">
            <TrendingUp className="w-10 h-10 text-emerald-400 mb-3" />
            <span className="text-3xl font-bold text-emerald-400 mb-1">Portfolio Co</span>
            <span className="text-sm text-emerald-400 font-bold">15% Equity</span>
          </div>
        </motion.div>

        {/* Key Metrics - The Returns */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          {[
            { value: '45%', label: 'Target IRR', icon: TrendingUp, color: 'emerald' },
            { value: '6.8x', label: 'Return Multiple', icon: Target, color: 'cyan' },
            { value: '$24M', label: 'Portfolio Value', icon: DollarSign, color: 'violet' },
            { value: '8/10', label: 'Success Rate', icon: Rocket, color: 'amber' },
          ].map((metric, idx) => (
            <div key={idx} className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-${metric.color}-500/20 mb-3`}>
                <metric.icon className={`w-6 h-6 text-${metric.color}-400`} />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
              <div className="text-xs text-white/40 uppercase tracking-wider">{metric.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AcceleratorHero;
