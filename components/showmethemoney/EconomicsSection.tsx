import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Target, DollarSign, ArrowRight, Zap, BarChart3, PieChart } from 'lucide-react';

// Economics data from Master Plan
const heroMetrics = [
  {
    label: 'Customer LTV',
    value: '$2,208',
    subtext: '24-month value',
    icon: DollarSign,
    color: 'cyan',
    trend: '+47% vs industry'
  },
  {
    label: 'Blended CAC',
    value: '$510',
    subtext: 'Emerging + West',
    icon: Users,
    color: 'emerald',
    trend: '-23% vs target'
  },
  {
    label: 'LTV:CAC Ratio',
    value: '4.3:1',
    subtext: 'Best-in-class',
    icon: Target,
    color: 'amber',
    trend: 'Healthy'
  }
];

const cacEvolution = [
  {
    phase: 'Launch Phase',
    months: 'M1-M6',
    cac: '$890',
    description: 'High initial acquisition costs as we establish product-market fit',
    channels: ['Paid Social', 'Content Marketing', 'Referrals'],
    color: 'rose'
  },
  {
    phase: 'Growth Phase',
    months: 'M7-M12',
    cac: '$425',
    description: 'Optimized funnels and word-of-mouth reduce acquisition costs',
    channels: ['Organic Search', 'Partnerships', 'Email'],
    color: 'amber'
  },
  {
    phase: 'Scale Phase',
    months: 'M13-M18',
    cac: '$215',
    description: 'Brand recognition and network effects drive CAC to minimum',
    channels: ['Viral Loop', 'Enterprise', 'Community'],
    color: 'emerald'
  }
];

const channelBreakdown = [
  { name: 'Organic Search', percentage: 35, color: '#06b6d4' },
  { name: 'Paid Social', percentage: 25, color: '#8b5cf6' },
  { name: 'Referrals', percentage: 20, color: '#10b981' },
  { name: 'Content', percentage: 12, color: '#f59e0b' },
  { name: 'Partnerships', percentage: 8, color: '#ec4899' }
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
            {/* Glow effect */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${metric.color}-500/10 rounded-full blur-3xl group-hover:bg-${metric.color}-500/20 transition-all`} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-${metric.color}-500/20 flex items-center justify-center`}>
                  <metric.icon className={`w-6 h-6 text-${metric.color}-400`} />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full bg-${metric.color}-500/20 text-${metric.color}-400`}>
                  {metric.trend}
                </span>
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
              {/* Connector line */}
              {idx < cacEvolution.length - 1 && (
                <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-white/20 to-white/5 z-0" />
              )}
              
              <div className={`relative z-10 p-6 rounded-2xl bg-${phase.color}-500/5 border border-${phase.color}-500/20 backdrop-blur`}>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full bg-${phase.color}-500/20 text-${phase.color}-400`}>
                    {phase.months}
                  </span>
                  <ArrowRight className="w-4 h-4 text-white/20" />
                </div>
                
                <div className="text-3xl font-bold text-white mb-2">{phase.cac}</div>
                <div className="text-sm font-medium text-white/80 mb-3">{phase.phase}</div>
                <p className="text-xs text-white/40 mb-4">{phase.description}</p>
                
                <div className="space-y-2">
                  <div className="text-xs text-white/30 uppercase tracking-wider">Top Channels</div>
                  <div className="flex flex-wrap gap-2">
                    {phase.channels.map((channel) => (
                      <span key={channel} className="text-xs px-2 py-1 rounded-full bg-white/5 text-white/60">
                        {channel}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Channel Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/[0.02] backdrop-blur border border-white/10 rounded-3xl p-8"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
            <PieChart className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Channel Mix</h3>
            <p className="text-sm text-white/40">Diversified acquisition strategy</p>
          </div>
        </div>

        <div className="space-y-4">
          {channelBreakdown.map((channel, idx) => (
            <motion.div
              key={channel.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + idx * 0.05 }}
              className="flex items-center gap-4"
            >
              <div className="w-32 text-sm text-white/60">{channel.name}</div>
              <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${channel.percentage}%` }}
                  transition={{ delay: 0.8 + idx * 0.05, duration: 0.5 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: channel.color }}
                />
              </div>
              <div className="w-12 text-right text-sm font-bold text-white">{channel.percentage}%</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Key Insight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-2xl p-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-2">Key Insight</h4>
            <p className="text-white/60">
              Our CAC decreases by <span className="text-emerald-400 font-bold">76%</span> from Launch to Scale phase, 
              while LTV increases by <span className="text-cyan-400 font-bold">40%</span> through product improvements 
              and upsells. This creates a powerful <span className="text-amber-400 font-bold">4.3x LTV:CAC ratio</span> at scale, 
              well above the 3x benchmark for SaaS businesses.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EconomicsSection;