import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Target, BarChart3 } from 'lucide-react';

const heroMetrics = [
  {
    label: 'Blended CAC',
    value: '$510',
    subtext: '18-month average',
    icon: DollarSign,
    color: 'cyan'
  },
  {
    label: 'Customer LTV',
    value: '$2,208',
    subtext: '12mo × $224 × 82%',
    icon: Target,
    color: 'emerald'
  },
  {
    label: 'LTV/CAC Ratio',
    value: '4.3:1',
    subtext: 'Healthy >3:1',
    icon: TrendingUp,
    color: 'amber'
  }
];

const cacEvolution = [
  {
    phase: 'Organic',
    months: 'Months 1-6',
    blendedCAC: '$117',
    channels: [
      { name: 'Email', cost: '$20' },
      { name: 'Content', cost: '$180' },
      { name: 'Paid', cost: '$500' }
    ],
    color: 'cyan'
  },
  {
    phase: 'Paid',
    months: 'Months 7-12',
    blendedCAC: '$316',
    channels: [
      { name: 'Email', cost: '$60' },
      { name: 'Content', cost: '$300' },
      { name: 'Paid', cost: '$450' }
    ],
    color: 'violet'
  },
  {
    phase: 'Scale',
    months: 'Months 13-18',
    blendedCAC: '$357',
    channels: [
      { name: 'Email', cost: '$180' },
      { name: 'Content', cost: '$385' },
      { name: 'Paid', cost: '$375' }
    ],
    color: 'emerald'
  }
];

export const EconomicsSection: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
          <BarChart3 className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-bold text-emerald-400 uppercase tracking-widest">Unit Economics</span>
        </div>
        
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Economics That Scale</h2>
        <p className="text-white/60 max-w-2xl mx-auto">
          Our unit economics improve dramatically as we scale, driven by organic growth, 
          network effects, and operational leverage.
        </p>
      </motion.div>

      {/* Hero Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {heroMetrics.map((metric, idx) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`relative p-6 rounded-2xl bg-${metric.color}-500/5 border border-${metric.color}-500/20 backdrop-blur overflow-hidden group hover:bg-${metric.color}-500/10 transition-all`}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${metric.color}-500/10 rounded-full blur-3xl group-hover:bg-${metric.color}-500/20 transition-all`} />
            
            <div className="relative z-10">
              <div className={`w-12 h-12 rounded-xl bg-${metric.color}-500/20 flex items-center justify-center mb-4`}>
                <metric.icon className={`w-6 h-6 text-${metric.color}-400`} />
              </div>
              
              <div className="text-4xl font-bold text-white mb-2">{metric.value}</div>
              <div className="text-sm font-medium text-white/80 mb-1">{metric.label}</div>
              <div className="text-xs text-white/40">{metric.subtext}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CAC Evolution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/[0.02] backdrop-blur border border-white/10 rounded-3xl p-8"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">CAC Evolution by Phase</h3>
            <p className="text-sm text-white/40">Customer acquisition cost decreases as we scale</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cacEvolution.map((phase, idx) => (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              className="relative"
            >
              {idx < cacEvolution.length - 1 && (
                <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-white/20 to-white/5 z-0" />
              )}
              
              <div className={`relative z-10 p-6 rounded-2xl bg-${phase.color}-500/5 border border-${phase.color}-500/20 backdrop-blur`}>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full bg-${phase.color}-500/20 text-${phase.color}-400`}>
                    {phase.months}
                  </span>
                </div>
                
                <div className="text-3xl font-bold text-white mb-2">{phase.blendedCAC}</div>
                <div className="text-sm font-medium text-white/80 mb-4">{phase.phase} Phase</div>
                
                <div className="space-y-2">
                  {phase.channels.map((channel) => (
                    <div key={channel.name} className="flex justify-between text-xs">
                      <span className="text-white/40">{channel.name}</span>
                      <span className="text-white/60">{channel.cost}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default EconomicsSection;