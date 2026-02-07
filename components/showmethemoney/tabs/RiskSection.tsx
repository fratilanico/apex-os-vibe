import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingDown, Activity, TrendingUp } from 'lucide-react';

const scenarios = [
  {
    name: 'Bear Case',
    icon: TrendingDown,
    color: 'rose',
    assumptions: {
      conversion: '1.5%',
      churn: '6.0%',
      arpu: '$180'
    },
    results: {
      m18MRR: '$95K',
      cashLeft: '$650K'
    }
  },
  {
    name: 'Base Case',
    icon: Activity,
    color: 'cyan',
    recommended: true,
    assumptions: {
      conversion: '2.0%',
      churn: '4.5%',
      arpu: '$224'
    },
    results: {
      m18MRR: '$165K',
      cashLeft: '$1.12M'
    }
  },
  {
    name: 'Bull Case',
    icon: TrendingUp,
    color: 'emerald',
    assumptions: {
      conversion: '3.5%',
      churn: '3.0%',
      arpu: '$275'
    },
    results: {
      m18MRR: '$285K',
      cashLeft: '$1.85M'
    }
  }
];

export const RiskSection: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-bold text-amber-400 uppercase tracking-widest">Risk Analysis</span>
        </div>
        
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Sensitivity Analysis</h2>
        <p className="text-white/60 max-w-2xl mx-auto">
          We model multiple scenarios to ensure resilience across market conditions. 
          Even in bear cases, we maintain healthy unit economics.
        </p>
      </motion.div>

      {/* Scenarios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scenarios.map((scenario, idx) => (
          <motion.div
            key={scenario.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`relative p-6 rounded-3xl backdrop-blur border-2 transition-all ${
              scenario.recommended
                ? `bg-${scenario.color}-500/10 border-${scenario.color}-500/40 shadow-[0_0_50px_rgba(6,182,212,0.15)]`
                : `bg-white/[0.02] border-${scenario.color}-500/30 hover:border-${scenario.color}-500/50`
            }`}
          >
            {scenario.recommended && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-cyan-500 text-black text-xs font-black uppercase tracking-widest">
                Most Likely
              </div>
            )}
            
            <div className="text-center mb-6">
              <div className={`inline-flex w-14 h-14 rounded-2xl bg-${scenario.color}-500/20 items-center justify-center mb-4`}>
                <scenario.icon className={`w-7 h-7 text-${scenario.color}-400`} />
              </div>
              <h3 className="text-xl font-bold text-white">{scenario.name}</h3>
            </div>

            <div className="space-y-4 mb-6">
              <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Assumptions</div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Conversion</span>
                  <span className={`text-${scenario.color}-400 font-bold`}>{scenario.assumptions.conversion}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Churn</span>
                  <span className={`text-${scenario.color}-400 font-bold`}>{scenario.assumptions.churn}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">ARPU</span>
                  <span className={`text-${scenario.color}-400 font-bold`}>{scenario.assumptions.arpu}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <div className="text-xs text-white/40 uppercase tracking-wider mb-3">Results (M18)</div>
              
              <div className="space-y-3">
                <div className={`p-3 rounded-xl bg-${scenario.color}-500/5 border border-${scenario.color}-500/20`}>
                  <div className="text-xs text-white/40 mb-1">MRR</div>
                  <div className={`text-xl font-bold text-${scenario.color}-400`}>{scenario.results.m18MRR}</div>
                </div>
                
                <div className={`p-3 rounded-xl bg-${scenario.color}-500/5 border border-${scenario.color}-500/20`}>
                  <div className="text-xs text-white/40 mb-1">Cash Remaining</div>
                  <div className={`text-xl font-bold text-${scenario.color}-400`}>{scenario.results.cashLeft}</div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Risk Mitigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-amber-500/10 to-rose-500/10 border border-amber-500/20 rounded-2xl p-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-2">Risk Mitigation</h4>
            <p className="text-white/60">
              Even in our bear case scenario with <span className="text-rose-400 font-bold">1.5% conversion</span> and 
              <span className="text-rose-400 font-bold">6% churn</span>, we maintain <span className="text-emerald-400 font-bold">positive cash flow</span> by Month 16 
              with <span className="text-emerald-400 font-bold">$650K remaining</span> in the bank. Our diversified acquisition strategy 
              and low fixed costs provide resilience against market volatility.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RiskSection;