import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Rocket, DollarSign, Shield, Clock, Flame, RefreshCw, Scissors } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

const newItems = [
  { icon: Bot, accent: 'cyan' as const, title: '17-Agent AI Swarm', desc: 'Replace entire dev teams with orchestrated AI agents' },
  { icon: Rocket, accent: 'emerald' as const, title: '30-Day Sprint', desc: 'From zero to deployed product in one month' },
  { icon: DollarSign, accent: 'violet' as const, title: 'GTM on Day 1', desc: 'Revenue from day one, not month six' },
  { icon: Shield, accent: 'amber' as const, title: 'Keep Your Equity', desc: 'Zero equity required. You own 100% of what you build' },
];

const oldItems = [
  { icon: Clock, title: '6-12 Month Cycles', desc: 'Traditional development timelines with constant delays' },
  { icon: Flame, title: '$500K+ Burn Rate', desc: 'Expensive teams and infrastructure before any revenue' },
  { icon: RefreshCw, title: 'Slow Feedback Loops', desc: 'Months before market validation, pivots cost millions' },
  { icon: Scissors, title: 'Equity Dilution', desc: 'Give away 20-40% of your company just to build v1' },
];

export const ComparisonSection: React.FC = () => {
  const [view, setView] = useState<'new' | 'old'>('new');

  return (
    <section className="py-16 text-center">
      <h2 className="text-3xl font-bold text-white mb-10">
        APEX Protocol vs Legacy Way
      </h2>

      {/* Toggle */}
      <div className="inline-flex mb-12 bg-white/5 rounded-2xl p-1.5">
        <button
          onClick={() => setView('new')}
          className={`px-10 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
            view === 'new'
              ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg shadow-cyan-500/25'
              : 'bg-transparent text-white/30 hover:text-white/60'
          }`}
        >
          NEW
        </button>
        <button
          onClick={() => setView('old')}
          className={`px-10 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
            view === 'old'
              ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/25'
              : 'bg-transparent text-white/20 hover:text-white/40'
          }`}
        >
          OLD
        </button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {view === 'new' ? (
          <motion.div
            key="new"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          >
            {newItems.map((item, i) => (
              <GlassCard key={item.title} accent={item.accent} delay={i * 0.1} className="p-8 text-left">
                <item.icon className="w-8 h-8 text-white/80 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </GlassCard>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="old"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          >
            {oldItems.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="bg-red-950/30 border border-red-500/20 rounded-3xl p-8 text-left backdrop-blur-sm"
              >
                <item.icon className="w-8 h-8 text-red-400 mb-4" />
                <h3 className="text-xl font-bold text-red-100 mb-2">{item.title}</h3>
                <p className="text-red-200/70 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
