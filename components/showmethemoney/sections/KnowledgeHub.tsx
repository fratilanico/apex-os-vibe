import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Brain, GraduationCap, Users, Target, Zap, Award, TrendingUp } from 'lucide-react';

const knowledgePillars = [
  {
    icon: Brain,
    title: 'AI Orchestration Mastery',
    description: 'Not just using AI tools—mastering the art of coordinating multiple AI agents for complex outcomes',
    modules: 6,
    hours: 120,
    color: 'cyan'
  },
  {
    icon: Zap,
    title: 'Velocity Engineering',
    description: 'Systems and frameworks for shipping product in days, not months',
    modules: 4,
    hours: 80,
    color: 'violet'
  },
  {
    icon: Target,
    title: 'Go-to-Market Science',
    description: 'Data-driven customer acquisition and retention strategies',
    modules: 3,
    hours: 60,
    color: 'emerald'
  },
  {
    icon: Award,
    title: 'Founder Excellence',
    description: 'Leadership, fundraising, and scaling frameworks from top operators',
    modules: 3,
    hours: 40,
    color: 'amber'
  }
];

const talentMetrics = [
  { label: 'Applications/Year', value: '500+', icon: Users },
  { label: 'Acceptance Rate', value: '4%', icon: Target },
  { label: 'Graduation Rate', value: '85%', icon: GraduationCap },
  { label: 'Placement in Accelerator', value: '5%', icon: Award }
];

const ipAssets = [
  { name: 'Agent Orchestration Framework', type: 'Proprietary Tech', value: 'High' },
  { name: 'Curriculum Database', type: 'Content IP', value: 'Medium' },
  { name: 'Assessment Algorithms', type: 'Data Science', value: 'High' },
  { name: 'Network Effects', type: 'Platform Moat', value: 'Very High' }
];

export const KnowledgeHub: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6"
        >
          <Brain className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-bold text-amber-400 uppercase tracking-widest">Talent Pipeline</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl font-bold text-white mb-4"
        >
          Knowledge Hub &
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-cyan-400">
            IP Engine
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-white/60 max-w-3xl mx-auto"
        >
          We've evolved beyond "courses." This is a systematic talent factory producing AI-native founders.
        </motion.p>
      </div>

      {/* Talent Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {talentMetrics.map((metric, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + idx * 0.1 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/20 mb-4">
              <metric.icon className="w-6 h-6 text-amber-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
            <div className="text-xs text-white/40 uppercase tracking-wider">{metric.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Knowledge Pillars */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-8 text-center">Curriculum Architecture</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {knowledgePillars.map((pillar, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              className={`p-6 rounded-2xl bg-${pillar.color}-500/5 border border-${pillar.color}-500/20 backdrop-blur`}
            >
              <div className="flex items-start gap-4">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-${pillar.color}-500/20 shrink-0`}>
                  <pillar.icon className={`w-6 h-6 text-${pillar.color}-400`} />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-bold mb-2">{pillar.title}</h4>
                  <p className="text-white/60 text-sm mb-4">{pillar.description}</p>
                  <div className="flex gap-4 text-xs">
                    <span className={`px-2 py-1 rounded bg-${pillar.color}-500/10 text-${pillar.color}-400`}>
                      {pillar.modules} Modules
                    </span>
                    <span className={`px-2 py-1 rounded bg-${pillar.color}-500/10 text-${pillar.color}-400`}>
                      {pillar.hours} Hours
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* IP Assets */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-8 text-center">Intellectual Property Portfolio</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-4 text-white/40 text-sm font-bold uppercase">Asset</th>
                <th className="text-left py-4 px-4 text-white/40 text-sm font-bold uppercase">Type</th>
                <th className="text-left py-4 px-4 text-white/40 text-sm font-bold uppercase">Strategic Value</th>
              </tr>
            </thead>
            <tbody>
              {ipAssets.map((asset, idx) => (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  className="border-b border-white/5"
                >
                  <td className="py-4 px-4 text-white font-bold">{asset.name}</td>
                  <td className="py-4 px-4 text-cyan-400">{asset.type}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      asset.value === 'Very High' ? 'bg-emerald-500/20 text-emerald-400' :
                      asset.value === 'High' ? 'bg-cyan-500/20 text-cyan-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>
                      {asset.value}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* The Pipeline Flow */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-cyan-500/10 to-emerald-500/10 border border-white/10"
      >
        <h3 className="text-xl font-bold text-white mb-6 text-center">The Talent → Founder → Portfolio Pipeline</h3>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {[
            { stage: 'Application', count: '500', color: 'amber' },
            { stage: 'Admission', count: '20', color: 'cyan' },
            { stage: 'Graduation', count: '17', color: 'violet' },
            { stage: 'Accelerator', count: '1', color: 'emerald' },
            { stage: 'Portfolio', count: '1', color: 'emerald' }
          ].map((step, idx) => (
            <React.Fragment key={idx}>
              <div className={`flex flex-col items-center p-4 rounded-2xl bg-${step.color}-500/10 border border-${step.color}-500/30 min-w-[100px]`}>
                <div className={`text-2xl font-bold text-${step.color}-400 mb-1`}>{step.count}</div>
                <div className="text-xs text-white/60 uppercase tracking-wider">{step.stage}</div>
              </div>
              {idx < 4 && (
                <div className="hidden md:block w-8 h-px bg-gradient-to-r from-white/20 to-white/20" />
              )}
            </React.Fragment>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default KnowledgeHub;
