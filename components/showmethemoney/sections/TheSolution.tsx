import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Network, Rocket, Shield, Zap, Globe, Database, Code } from 'lucide-react';

const ecosystemComponents = [
  {
    icon: Cpu,
    title: 'AI Orchestration Core',
    description: '36-agent swarm handling infrastructure, security, and intelligence',
    color: 'cyan',
    metrics: ['99.9% Uptime', '<100ms Latency', 'Auto-scaling']
  },
  {
    icon: Network,
    title: 'Talent Pipeline',
    description: 'Systematic conversion from learner to founder to portfolio company',
    color: 'violet',
    metrics: ['500+ Applications/yr', '200 Graduates', '10 Accelerator Spots']
  },
  {
    icon: Rocket,
    title: 'Hyperloop Accelerator',
    description: '30-day sprint compressing 18 months of work into 4 weeks',
    color: 'emerald',
    metrics: ['45% IRR Target', '6.8x Multiple', '15% Equity']
  },
  {
    icon: Shield,
    title: 'Enterprise Moat',
    description: 'B2B network effects and proprietary data flywheel',
    color: 'amber',
    metrics: ['32K Lead Pipeline', '85% Gross Margin', '12:1 LTV/CAC']
  }
];

const techStack = [
  { name: 'Agent Swarm', icon: Zap, items: ['36 Autonomous Agents', 'Recursive Coordination', 'Self-Healing'] },
  { name: 'Infrastructure', icon: Database, items: ['Serverless Architecture', 'Global CDN', 'Multi-Region'] },
  { name: 'AI Stack', icon: Cpu, items: ['Gemini Pro', 'Custom Models', 'RAG Pipeline'] },
  { name: 'Integration', icon: Code, items: ['200+ APIs', 'Webhook Mesh', 'Event-Driven'] }
];

export const TheSolution: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6"
        >
          <Globe className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-bold text-emerald-400 uppercase tracking-widest">The Ecosystem</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl font-bold text-white mb-4"
        >
          An Integrated System
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
            Designed for Velocity
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-white/60 max-w-3xl mx-auto"
        >
          Not just an accelerator. A complete operating system for the neural era.
        </motion.p>
      </div>

      {/* Central Hub Visualization */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="relative p-12 rounded-3xl bg-gradient-to-br from-cyan-500/5 via-violet-500/5 to-emerald-500/5 border border-white/10"
      >
        {/* Center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center z-10 shadow-2xl shadow-cyan-500/20">
          <Rocket className="w-12 h-12 text-white" />
        </div>

        {/* Orbiting Components */}
        <div className="grid grid-cols-2 gap-8">
          {ecosystemComponents.map((component, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              className={`p-6 rounded-2xl bg-${component.color}-500/5 border border-${component.color}-500/20 backdrop-blur ${idx >= 2 ? 'mt-32' : ''}`}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-${component.color}-500/20 mb-4`}>
                <component.icon className={`w-6 h-6 text-${component.color}-400`} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{component.title}</h3>
              <p className="text-white/60 text-sm mb-4">{component.description}</p>
              <div className="flex flex-wrap gap-2">
                {component.metrics.map((metric, midx) => (
                  <span key={midx} className={`px-2 py-1 rounded bg-${component.color}-500/10 text-${component.color}-400 text-xs font-medium`}>
                    {metric}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <motion.path
            d="M 50% 50% L 25% 25%"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            strokeDasharray="5,5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />
        </svg>
      </motion.div>

      {/* Tech Stack */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-8 text-center">Technical Infrastructure</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {techStack.map((stack, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + idx * 0.1 }}
              className="p-4 rounded-2xl bg-white/5 border border-white/10"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 mb-3">
                <stack.icon className="w-5 h-5 text-cyan-400" />
              </div>
              <h4 className="text-white font-bold mb-3">{stack.name}</h4>
              <ul className="space-y-1">
                {stack.items.map((item, iidx) => (
                  <li key={iidx} className="text-xs text-white/50">{item}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TheSolution;
