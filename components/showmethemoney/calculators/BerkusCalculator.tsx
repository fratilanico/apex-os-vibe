import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Lightbulb, Code2, Users, Target, DollarSign, Info } from 'lucide-react';

interface BerkusCategory {
  id: string;
  name: string;
  description: string;
  maxValue: number;
  currentScore: number;
  icon: React.ElementType;
  color: string;
}

const berkusCategories: BerkusCategory[] = [
  {
    id: 'sound-idea',
    name: 'Sound Idea',
    description: 'Quality of the core concept and market opportunity',
    maxValue: 500000,
    currentScore: 400000,
    icon: Lightbulb,
    color: 'cyan'
  },
  {
    id: 'prototype',
    name: 'Prototype',
    description: 'Working product with demonstrated functionality',
    maxValue: 500000,
    currentScore: 450000,
    icon: Code2,
    color: 'violet'
  },
  {
    id: 'management',
    name: 'Quality Management',
    description: 'Experienced team with execution track record',
    maxValue: 500000,
    currentScore: 425000,
    icon: Users,
    color: 'emerald'
  },
  {
    id: 'connections',
    name: 'Connections',
    description: 'Strategic relationships and partnerships',
    maxValue: 500000,
    currentScore: 350000,
    icon: Target,
    color: 'amber'
  },
  {
    id: 'market',
    name: 'Market/Sales',
    description: 'Early traction and market validation',
    maxValue: 500000,
    currentScore: 375000,
    icon: TrendingUp,
    color: 'rose'
  }
];

export const BerkusCalculator: React.FC = () => {
  const [scores, setScores] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    berkusCategories.forEach(cat => {
      initial[cat.id] = cat.currentScore;
    });
    return initial;
  });

  const totalValuation = useMemo(() => {
    return Object.values(scores).reduce((sum, score) => sum + score, 0);
  }, [scores]);

  const maxValuation = berkusCategories.reduce((sum, cat) => sum + cat.maxValue, 0);
  const progressPercentage = (totalValuation / maxValuation) * 100;

  const handleScoreChange = (id: string, value: number) => {
    setScores(prev => ({ ...prev, [id]: value }));
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Berkus Valuation Method</h3>
            <p className="text-xs text-white/40">Pre-revenue startup valuation calculator</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-cyan-400">{formatCurrency(totalValuation)}</div>
          <div className="text-xs text-white/40">Total Valuation</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-white/40 mb-2">
          <span>Valuation Range</span>
          <span>{progressPercentage.toFixed(0)}% of max ($2.5M)</span>
        </div>
        <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-cyan-500 via-violet-500 to-emerald-500 rounded-full"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {berkusCategories.map((category, idx) => {
          const Icon = category.icon;
          const score = scores[category.id] ?? 0;
          const percentage = (score / category.maxValue) * 100;
          
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur hover:bg-white/10 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-cyan-400">
                    {formatCurrency(score)}
                  </div>
                  <div className="text-xs text-white/40">of {formatCurrency(category.maxValue)}</div>
                </div>
              </div>

              <h4 className="text-white font-bold mb-1">{category.name}</h4>
              <p className="text-xs text-white/40 mb-4">{category.description}</p>

              {/* Slider */}
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max={category.maxValue}
                  step="10000"
                  value={score}
                  onChange={(e) => handleScoreChange(category.id, parseInt(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-xs">
                  <span className="text-white/30">$0</span>
                  <span className="text-cyan-400 font-bold">{percentage.toFixed(0)}%</span>
                  <span className="text-white/30">$500K</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-4 rounded-xl bg-white/5 border border-white/10"
        >
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-white/40 uppercase">Min Valuation</span>
          </div>
          <div className="text-xl font-bold text-white">$0</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-4 rounded-xl bg-white/5 border border-white/10"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-white/40 uppercase">Current</span>
          </div>
          <div className="text-xl font-bold text-cyan-400">{formatCurrency(totalValuation)}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="p-4 rounded-xl bg-white/5 border border-white/10"
        >
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-violet-400" />
            <span className="text-xs text-white/40 uppercase">Max Valuation</span>
          </div>
          <div className="text-xl font-bold text-white">$2.5M</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="p-4 rounded-xl bg-white/5 border border-white/10"
        >
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-white/40 uppercase">Method</span>
          </div>
          <div className="text-xl font-bold text-white">Berkus</div>
        </motion.div>
      </div>

      {/* APEX OS Context */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="mt-6 p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border border-cyan-500/20"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center shrink-0">
            <Lightbulb className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h4 className="text-white font-bold mb-1">APEX OS Valuation Context</h4>
            <p className="text-white/60 text-sm">
              Current Berkus valuation of <span className="text-cyan-400 font-bold">{formatCurrency(totalValuation)}</span> reflects 
              strong prototype development (90%), experienced management team (85%), and solid market positioning (75%). 
              The pre-money valuation of $6.8M in our seed round incorporates additional factors including the 32K lead pipeline 
              and proprietary agent orchestration technology.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BerkusCalculator;
