import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Target, Users, TrendingUp, ArrowUpRight } from 'lucide-react';

const marketData = {
  tam: {
    label: 'Total Addressable Market',
    value: '$350B',
    subtext: 'Global AI & Automation Economy by 2030',
    growth: '+42% CAGR',
    color: 'cyan'
  },
  sam: {
    label: 'Serviceable Addressable Market',
    value: '$45B',
    subtext: 'AI Education & Developer Tools',
    growth: '+38% CAGR',
    color: 'violet'
  },
  som: {
    label: 'Serviceable Obtainable Market',
    value: '$2.8B',
    subtext: 'Our 5-Year Target (0.8% of SAM)',
    growth: 'Realistic Capture',
    color: 'emerald'
  }
};

const marketDrivers = [
  {
    title: 'AI Adoption Surge',
    stat: '85%',
    description: 'Of enterprises will adopt AI by 2026',
    icon: TrendingUp
  },
  {
    title: 'Developer Shortage',
    stat: '4M',
    description: 'Unfilled AI/ML engineering roles globally',
    icon: Users
  },
  {
    title: 'EdTech Growth',
    stat: '$404B',
    description: 'Global EdTech market by 2025',
    icon: Target
  }
];

const competitiveLandscape = [
  { name: 'Traditional Bootcamps', strength: 'Low', weakness: 'No AI focus, outdated curriculum', threat: 'Minimal' },
  { name: 'Big Tech (Google/AWS)', strength: 'High', weakness: 'Generic, no founder support', threat: 'Medium' },
  { name: 'Other Accelerators', strength: 'Medium', weakness: 'No AI infrastructure, high fees', threat: 'Low' },
  { name: 'Online Courses', strength: 'High volume', weakness: '15% completion rate, no outcomes', threat: 'Low' }
];

export const TheMarket: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6"
        >
          <Globe className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-bold text-violet-400 uppercase tracking-widest">Market Opportunity</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl font-bold text-white mb-4"
        >
          The Size of the Prize
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-white/60 max-w-2xl mx-auto"
        >
          We're not just entering a market. We're creating a new category at the intersection of AI, education, and venture capital.
        </motion.p>
      </div>

      {/* TAM/SAM/SOM Pyramid */}
      <div className="relative">
        <div className="flex flex-col items-center space-y-4">
          {/* TAM - Largest */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-3xl p-8 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/30 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Globe className="w-32 h-32 text-cyan-500" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-cyan-400 text-sm font-bold uppercase tracking-wider">{marketData.tam.label}</span>
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold">{marketData.tam.growth}</span>
              </div>
              <div className="text-5xl sm:text-6xl font-bold text-white mb-2">{marketData.tam.value}</div>
              <p className="text-white/60">{marketData.tam.subtext}</p>
            </div>
          </motion.div>

          {/* SAM - Medium */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-2xl p-8 rounded-3xl bg-gradient-to-br from-violet-500/10 to-violet-600/5 border border-violet-500/30 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Target className="w-24 h-24 text-violet-500" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-violet-400 text-sm font-bold uppercase tracking-wider">{marketData.sam.label}</span>
                <span className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-400 text-xs font-bold">{marketData.sam.growth}</span>
              </div>
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2">{marketData.sam.value}</div>
              <p className="text-white/60">{marketData.sam.subtext}</p>
            </div>
          </motion.div>

          {/* SOM - Target */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="w-full max-w-xl p-8 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-2 border-emerald-500/40 relative overflow-hidden shadow-2xl shadow-emerald-500/10"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ArrowUpRight className="w-20 h-20 text-emerald-500" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-emerald-400 text-sm font-bold uppercase tracking-wider">{marketData.som.label}</span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">{marketData.som.growth}</span>
              </div>
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2">{marketData.som.value}</div>
              <p className="text-white/60">{marketData.som.subtext}</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Market Drivers */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-8 text-center">Why Now? Market Tailwinds</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {marketDrivers.map((driver, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + idx * 0.1 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/20 mb-4">
                <driver.icon className="w-7 h-7 text-cyan-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{driver.stat}</div>
              <h4 className="text-white font-bold mb-2">{driver.title}</h4>
              <p className="text-white/50 text-sm">{driver.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Competitive Landscape */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-8 text-center">Competitive Landscape</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-4 text-white/40 text-sm font-bold uppercase">Competitor</th>
                <th className="text-left py-4 px-4 text-white/40 text-sm font-bold uppercase">Strength</th>
                <th className="text-left py-4 px-4 text-white/40 text-sm font-bold uppercase">Weakness</th>
                <th className="text-left py-4 px-4 text-white/40 text-sm font-bold uppercase">Threat Level</th>
              </tr>
            </thead>
            <tbody>
              {competitiveLandscape.map((comp, idx) => (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + idx * 0.1 }}
                  className="border-b border-white/5"
                >
                  <td className="py-4 px-4 text-white font-bold">{comp.name}</td>
                  <td className="py-4 px-4 text-emerald-400">{comp.strength}</td>
                  <td className="py-4 px-4 text-rose-400">{comp.weakness}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      comp.threat === 'High' ? 'bg-rose-500/20 text-rose-400' :
                      comp.threat === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {comp.threat}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TheMarket;
