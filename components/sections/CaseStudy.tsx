import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, TrendingUp, CheckCircle2, ArrowRight, Quote, Terminal, Cpu, Rocket } from 'lucide-react';

const journeySteps = [
  {
    day: 'Day 0',
    title: 'The Newbie',
    icon: Clock,
    color: 'rose',
    items: [
      'Manual processes draining time',
      'No AI integration strategy',
      'Scattered tools, no system'
    ],
    insight: 'Everything manual. Everything slow. Stuck in the old world.'
  },
  {
    day: 'Day 15',
    title: 'The Learner',
    icon: Cpu,
    color: 'cyan',
    items: [
      'Completed Module 00 foundation',
      'Deployed first AI agent',
      'Built initial automation pipeline'
    ],
    insight: 'The shift begins. AI becomes your multiplier, not just a tool.'
  },
  {
    day: 'Day 30',
    title: 'The Visionary',
    icon: Rocket,
    color: 'emerald',
    items: [
      '6 processes running 24/7',
      '40+ hours saved every week',
      'Accelerator-ready project'
    ],
    insight: 'From consumer to creator. From employee to founder.'
  }
];

const metrics = [
  { value: '40+', label: 'Hours Saved', sublabel: 'per week', icon: Clock },
  { value: '6', label: 'Processes', sublabel: 'automated', icon: Zap },
  { value: '8', label: 'Tools', sublabel: 'mastered', icon: Terminal },
  { value: '30', label: 'Days', sublabel: 'to accelerator', icon: Rocket }
];

export const CaseStudy: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6"
        >
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-bold text-cyan-400 uppercase tracking-widest">The Proof</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl font-bold text-white mb-4"
        >
          From Newbie to Accelerator-Ready
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
            in 30 Days
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl text-white/60 max-w-2xl mx-auto"
        >
          This isn't theory. We built the system we're teaching.
        </motion.p>
      </div>

      {/* Journey Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {journeySteps.map((step, idx) => {
          const Icon = step.icon;
          const isFirst = idx === 0;
          const isLast = idx === journeySteps.length - 1;
          
          return (
            <motion.div
              key={step.day}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              className={`relative p-8 rounded-3xl border ${
                isLast 
                  ? 'bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border-emerald-500/30' 
                  : isFirst
                  ? 'bg-white/5 border-white/10'
                  : 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/30'
              }`}
            >
              {/* Day Badge */}
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-6 ${
                isLast 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : isFirst
                  ? 'bg-rose-500/20 text-rose-400'
                  : 'bg-cyan-500/20 text-cyan-400'
              }`}>
                {step.day}
              </div>

              {/* Title */}
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isLast 
                    ? 'bg-emerald-500/20' 
                    : isFirst
                    ? 'bg-rose-500/20'
                    : 'bg-cyan-500/20'
                }`}>
                  <Icon className={`w-5 h-5 ${
                    isLast 
                      ? 'text-emerald-400' 
                      : isFirst
                      ? 'text-rose-400'
                      : 'text-cyan-400'
                  }`} />
                </div>
                <h3 className="text-xl font-bold text-white">{step.title}</h3>
              </div>
              
              {/* Items */}
              <ul className="space-y-4 mb-6">
                {step.items.map((item, i) => (
                  <li key={i} className={`flex items-start gap-3 ${
                    isLast ? 'text-white/80' : 'text-white/60'
                  }`}>
                    {isLast ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    ) : isFirst ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                    )}
                    {item}
                  </li>
                ))}
              </ul>

              {/* Insight Box */}
              <div className={`p-4 rounded-xl border ${
                isLast 
                  ? 'bg-emerald-500/10 border-emerald-500/20' 
                  : isFirst
                  ? 'bg-rose-500/10 border-rose-500/20'
                  : 'bg-cyan-500/10 border-cyan-500/20'
              }`}>
                <p className={`text-sm ${
                  isLast 
                    ? 'text-emerald-400' 
                    : isFirst
                    ? 'text-rose-400/80'
                    : 'text-cyan-400'
                }`}>
                  {step.insight}
                </p>
              </div>

              {/* Connector Arrow (not on last item) */}
              {!isLast && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-6 h-6 text-cyan-500/50" />
                  </motion.div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Metrics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center"
            >
              <Icon className="w-6 h-6 text-cyan-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
              <div className="text-white/60 text-sm">{metric.label}</div>
              <div className="text-white/40 text-xs">{metric.sublabel}</div>
            </div>
          );
        })}
      </motion.div>

      {/* Quote */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.7 }}
        className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10"
      >
        <Quote className="absolute top-8 left-8 w-12 h-12 text-cyan-500/20" />
        
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="text-2xl md:text-3xl font-medium text-white leading-relaxed mb-6">
            "We built the system we're teaching. This is the path from newbie to visionary."
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
              NF
            </div>
            <div className="text-left">
              <p className="text-white font-semibold">Nicolae Fratila</p>
              <p className="text-white/50 text-sm">Founder, APEX OS</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CaseStudy;
