import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, DollarSign, Users, XCircle, TrendingDown } from 'lucide-react';

const problems = [
  {
    icon: Clock,
    stat: '18-24',
    unit: 'months',
    label: 'Average Time to Product-Market Fit',
    description: 'Traditional startups waste 2 years iterating blindly',
    color: 'rose'
  },
  {
    icon: DollarSign,
    stat: '$2.5M',
    unit: 'burned',
    label: 'Average Capital to First Revenue',
    description: 'Founders dilute 40%+ before proving traction',
    color: 'amber'
  },
  {
    icon: Users,
    stat: '92%',
    unit: 'failure rate',
    label: 'First-Time Founder Mortality',
    description: 'No systematic support, no network, no playbook',
    color: 'rose'
  }
];

const oldWayProblems = [
  'Reactive mentorship (when you remember to ask)',
  'Generic curriculum (one-size-fits-none)',
  'Demo day theater (pitch without product)',
  'Network access (here\'s a LinkedIn, good luck)'
];

export const TheProblem: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 mb-6"
        >
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span className="text-sm font-bold text-rose-400 uppercase tracking-widest">The Gap</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl font-bold text-white mb-4"
        >
          The Startup Graveyard
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-white/60 max-w-2xl mx-auto"
        >
          Current accelerators are broken. They provide theater, not velocity.
        </motion.p>
      </div>

      {/* The Old Way vs The Gap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* The Old Way */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="p-8 rounded-3xl bg-white/5 border border-white/10 opacity-60"
        >
          <div className="flex items-center gap-3 mb-6">
            <XCircle className="w-6 h-6 text-rose-400" />
            <h3 className="text-xl font-bold text-white/60">The Old Way</h3>
          </div>
          
          <ul className="space-y-4">
            {oldWayProblems.map((problem, idx) => (
              <li key={idx} className="flex items-start gap-3 text-white/40">
                <TrendingDown className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                {problem}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* The Gap */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="p-8 rounded-3xl bg-gradient-to-br from-rose-500/10 to-amber-500/10 border border-rose-500/30"
        >
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-6 h-6 text-rose-400" />
            <h3 className="text-xl font-bold text-white">The Critical Gap</h3>
          </div>
          
          <p className="text-white/80 text-lg leading-relaxed mb-6">
            Founders need <span className="text-rose-400 font-bold">systematic execution</span>, not inspiration. 
            They need <span className="text-amber-400 font-bold">AI-powered infrastructure</span>, not advice. 
            They need <span className="text-emerald-400 font-bold">proven playbooks</span>, not theory.
          </p>

          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <p className="text-sm text-white/60">
              <span className="text-rose-400 font-bold">The Result:</span> $50B+ in founder value destroyed annually 
              due to lack of systematic support infrastructure.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {problems.map((problem, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + idx * 0.1 }}
            className={`p-8 rounded-3xl bg-${problem.color}-500/5 border border-${problem.color}-500/20 backdrop-blur`}
          >
            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-${problem.color}-500/20 mb-6`}>
              <problem.icon className={`w-7 h-7 text-${problem.color}-400`} />
            </div>
            
            <div className="mb-4">
              <span className={`text-4xl sm:text-5xl font-bold text-${problem.color}-400`}>{problem.stat}</span>
              <span className={`text-sm text-${problem.color}-400/60 ml-2 uppercase font-bold`}>{problem.unit}</span>
            </div>
            
            <h4 className="text-white font-bold mb-2">{problem.label}</h4>
            <p className="text-white/50 text-sm">{problem.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TheProblem;
