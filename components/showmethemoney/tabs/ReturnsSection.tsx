import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Percent, Building2 } from 'lucide-react';

const exitScenarios = [
  {
    name: 'Conservative',
    exitValue: '$15M',
    exitYear: 'Year 5',
    moic: '2.5x',
    irr: '38%',
    proceeds: '$3.75M',
    color: 'rose',
    description: 'Early acquisition by edtech consolidator'
  },
  {
    name: 'Base Case',
    exitValue: '$35M',
    exitYear: 'Year 5',
    moic: '5.8x',
    irr: '68%',
    proceeds: '$8.75M',
    color: 'cyan',
    description: 'Strategic acquisition by major tech player',
    recommended: true
  },
  {
    name: 'Optimistic',
    exitValue: '$75M',
    exitYear: 'Year 5',
    moic: '12.5x',
    irr: '98%',
    proceeds: '$18.75M',
    color: 'emerald',
    description: 'IPO or major strategic exit'
  }
];

export const ReturnsSection: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-bold text-cyan-400 uppercase tracking-widest">Investor Returns</span>
        </div>
        
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Return Scenarios</h2>
        <p className="text-white/60 max-w-2xl mx-auto">
          Multiple paths to liquidity with attractive risk-adjusted returns 
          across all scenarios.
        </p>
      </motion.div>

      {/* Exit Scenarios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {exitScenarios.map((scenario, idx) => (
          <motion.div
            key={scenario.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`relative p-8 rounded-3xl backdrop-blur border-2 transition-all ${
              scenario.recommended
                ? `bg-${scenario.color}-500/10 border-${scenario.color}-500/40 shadow-[0_0_50px_rgba(6,182,212,0.15)]`
                : `bg-white/[0.02] border-white/10 hover:border-${scenario.color}-500/30`
            }`}
          >
            {scenario.recommended && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-cyan-500 text-black text-xs font-black uppercase tracking-widest">
                Recommended
              </div>
            )}
            
            <div className="text-center mb-6">
              <div className={`inline-flex w-16 h-16 rounded-2xl bg-${scenario.color}-500/20 items-center justify-center mb-4`}>
                <Building2 className={`w-8 h-8 text-${scenario.color}-400`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{scenario.name}</h3>
              <p className="text-xs text-white/40">{scenario.description}</p>
            </div>

            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-white mb-1">{scenario.exitValue}</div>
              <div className="text-sm text-white/60">Exit Value ({scenario.exitYear})</div>
            </div>

            <div className="space-y-4">
              <div className={`p-4 rounded-xl bg-${scenario.color}-500/5 border border-${scenario.color}-500/20`}>
                <div className="flex items-center gap-2 mb-1">
                  <Percent className={`w-4 h-4 text-${scenario.color}-400`} />
                  <span className="text-xs text-white/40 uppercase">MOIC</span>
                </div>
                <div className={`text-2xl font-bold text-${scenario.color}-400`}>{scenario.moic}</div>
              </div>

              <div className={`p-4 rounded-xl bg-${scenario.color}-500/5 border border-${scenario.color}-500/20`}>
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className={`w-4 h-4 text-${scenario.color}-400`} />
                  <span className="text-xs text-white/40 uppercase">IRR</span>
                </div>
                <div className={`text-2xl font-bold text-${scenario.color}-400`}>{scenario.irr}</div>
              </div>

              <div className={`p-4 rounded-xl bg-${scenario.color}-500/5 border border-${scenario.color}-500/20`}>
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className={`w-4 h-4 text-${scenario.color}-400`} />
                  <span className="text-xs text-white/40 uppercase">Proceeds</span>
                </div>
                <div className={`text-2xl font-bold text-${scenario.color}-400`}>{scenario.proceeds}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Key Insight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-2xl p-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-2">Investment Thesis</h4>
            <p className="text-white/60">
              Even in our conservative scenario, investors achieve a <span className="text-cyan-400 font-bold">2.5x MOIC</span> with 
              <span className="text-cyan-400 font-bold">38% IRR</span>. Our base case projects a <span className="text-emerald-400 font-bold">5.8x return</span>, 
              significantly outperforming traditional venture benchmarks.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReturnsSection;