import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, TrendingUp, Users, Target, 
  Factory, Award, DollarSign, ArrowRight, 
  BarChart3, PieChart, Sparkles,
  Building2, Percent
} from 'lucide-react';
import { MetricCard } from '../shared/MetricCard';

// Portfolio Value Multiplier Data
const portfolioCompanies = [
  { name: 'AgentFlow AI', sector: 'Automation', equity: 15, valuation: 2500000, exitMultiple: 8.5, probability: 0.85 },
  { name: 'NeuralSync', sector: 'DevTools', equity: 15, valuation: 1800000, exitMultiple: 12.0, probability: 0.75 },
  { name: 'DataWeave', sector: 'Analytics', equity: 15, valuation: 3200000, exitMultiple: 6.5, probability: 0.90 },
  { name: 'CodeMatrix', sector: 'Education', equity: 15, valuation: 1500000, exitMultiple: 15.0, probability: 0.70 },
  { name: 'CloudSwarm', sector: 'Infrastructure', equity: 15, valuation: 4100000, exitMultiple: 5.0, probability: 0.95 },
  { name: 'PromptForge', sector: 'AI Tools', equity: 15, valuation: 2200000, exitMultiple: 9.0, probability: 0.80 },
  { name: 'SynthMind', sector: 'Research', equity: 15, valuation: 2800000, exitMultiple: 7.5, probability: 0.85 },
  { name: 'AutoScale', sector: 'SaaS', equity: 15, valuation: 1900000, exitMultiple: 11.0, probability: 0.75 },
  { name: 'BrainChain', sector: 'Blockchain', equity: 15, valuation: 3500000, exitMultiple: 4.5, probability: 0.60 },
  { name: 'VisionLab', sector: 'Computer Vision', equity: 15, valuation: 2600000, exitMultiple: 8.0, probability: 0.88 },
];

const exitScenarios = [
  { type: 'Conservative', irr: 32, multiple: 4.2, timeline: '5-7 years', probability: 0.40 },
  { type: 'Base Case', irr: 45, multiple: 6.8, timeline: '4-6 years', probability: 0.45 },
  { type: 'Optimistic', irr: 68, multiple: 11.5, timeline: '3-5 years', probability: 0.15 },
];

const founderFactoryStages = [
  { stage: 'Recruitment', metric: '500+', label: 'Applications/Year', icon: Users, color: 'cyan' },
  { stage: 'Academy', metric: '200', label: 'Graduates/Year', icon: Award, color: 'violet' },
  { stage: 'Selection', metric: '10', label: 'Accelerator Spots', icon: Target, color: 'amber' },
  { stage: 'Launch', metric: '8', label: 'Companies/Year', icon: Rocket, color: 'emerald' },
];

const resourceAllocation = [
  { category: 'Technical Infrastructure', percentage: 35, amount: 350000, description: 'AWS credits, GPU clusters, dev tools' },
  { category: 'Mentorship & Network', percentage: 25, amount: 250000, description: 'Expert advisors, investor intros' },
  { category: 'Go-to-Market', percentage: 20, amount: 200000, description: 'Marketing, sales, partnerships' },
  { category: 'Legal & Compliance', percentage: 12, amount: 120000, description: 'Incorporation, IP, contracts' },
  { category: 'Operations', percentage: 8, amount: 80000, description: 'Admin, events, logistics' },
];

export const HyperloopMultiplierEngine: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState(1);
  const [investmentAmount, setInvestmentAmount] = useState(100000);

  const totalPortfolioValue = portfolioCompanies.reduce((sum, co) => 
    sum + (co.valuation * co.exitMultiple * co.equity / 100 * co.probability), 0
  );

  const totalInvestment = portfolioCompanies.reduce((sum, co) => 
    sum + (co.valuation * 0.15), 0
  );

  const portfolioMultiple = totalPortfolioValue / totalInvestment;
  const irr = exitScenarios[selectedScenario]?.irr ?? 45;

  return (
    <div className="space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
          <Rocket className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-bold text-violet-400 uppercase tracking-widest">Hyperloop Multiplier Engine</span>
        </div>
        
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Portfolio Value Multiplier
        </h2>
        <p className="text-white/60 max-w-2xl mx-auto">
          Our accelerator doesn't just incubate startups—it manufactures unicorns. 
          15% equity model with 45%+ IRR target through systematic value creation.
        </p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          value={`${portfolioMultiple.toFixed(1)}x`}
          label="Portfolio Multiple"
          sublabel="Projected return on investment"
          icon={<TrendingUp className="w-6 h-6" />}
          color="violet"
        />
        <MetricCard
          value={`${irr}%`}
          label="Target IRR"
          sublabel="Internal rate of return"
          icon={<Percent className="w-6 h-6" />}
          color="emerald"
        />
        <MetricCard
          value="$24.1M"
          label="Portfolio Value"
          sublabel="Current 10-company portfolio"
          icon={<DollarSign className="w-6 h-6" />}
          color="amber"
        />
        <MetricCard
          value="8/10"
          label="Success Rate"
          sublabel="Companies reaching Series A"
          icon={<Target className="w-6 h-6" />}
          color="cyan"
        />
      </div>

      {/* Portfolio Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/[0.02] backdrop-blur border border-white/10 rounded-3xl p-8"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Portfolio Company Projections</h3>
              <p className="text-sm text-white/40">10 companies × 15% equity × exit scenarios</p>
            </div>
          </div>
          <div className="flex gap-2">
            {exitScenarios.map((scenario, idx) => (
              <button
                key={scenario.type}
                onClick={() => setSelectedScenario(idx)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedScenario === idx
                    ? 'bg-violet-500 text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {scenario.type}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {portfolioCompanies.map((company, idx) => {
            const exitValue = company.valuation * company.exitMultiple;
            const ourReturn = exitValue * company.equity / 100;
            const multiple = exitValue / company.valuation;
            
            return (
              <motion.div
                key={company.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + idx * 0.05 }}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-violet-400" />
                  </div>
                  <span className="text-xs text-white/40">{company.sector}</span>
                </div>
                <div className="text-sm font-bold text-white mb-1">{company.name}</div>
                <div className="text-xs text-white/60 mb-2">
                  Entry: ${(company.valuation / 1000000).toFixed(1)}M
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-400">{multiple.toFixed(1)}x</span>
                  <span className="text-xs text-white/40">
                    ${(ourReturn / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${company.probability * 100}%` }}
                    transition={{ delay: 0.5 + idx * 0.05, duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-violet-400 to-emerald-400 rounded-full"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Exit Scenario Details */}
        <div className="mt-8 p-6 rounded-2xl bg-violet-500/5 border border-violet-500/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-white/40 mb-1">Exit Timeline</div>
              <div className="text-xl font-bold text-white">{exitScenarios[selectedScenario]?.timeline ?? '4-6 years'}</div>
            </div>
            <div>
              <div className="text-sm text-white/40 mb-1">Return Multiple</div>
              <div className="text-xl font-bold text-emerald-400">{exitScenarios[selectedScenario]?.multiple ?? 6.8}x</div>
            </div>
            <div>
              <div className="text-sm text-white/40 mb-1">Probability</div>
              <div className="text-xl font-bold text-violet-400">
                {((exitScenarios[selectedScenario]?.probability ?? 0.45) * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Founder Factory Production Line */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/[0.02] backdrop-blur border border-white/10 rounded-3xl p-8"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <Factory className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Founder Factory Production Line</h3>
            <p className="text-sm text-white/40">Systematic conversion from applicant to funded founder</p>
          </div>
        </div>

        <div className="relative">
          {/* Production Line */}
          <div className="absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-violet-500 to-emerald-500 rounded-full hidden md:block" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {founderFactoryStages.map((stage, idx) => (
              <motion.div
                key={stage.stage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="relative"
              >
                <div className={`p-6 rounded-2xl bg-${stage.color}-500/5 border border-${stage.color}-500/20 backdrop-blur`}>
                  <div className={`w-12 h-12 rounded-xl bg-${stage.color}-500/20 flex items-center justify-center mb-4`}>
                    <stage.icon className={`w-6 h-6 text-${stage.color}-400`} />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stage.metric}</div>
                  <div className="text-sm font-medium text-white/80 mb-1">{stage.stage}</div>
                  <div className="text-xs text-white/40">{stage.label}</div>
                </div>
                
                {idx < founderFactoryStages.length - 1 && (
                  <div className="hidden md:flex absolute top-12 left-full w-full items-center justify-center z-10">
                    <ArrowRight className="w-6 h-6 text-white/20" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Resource Allocation & ROI Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Resource Allocation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/[0.02] backdrop-blur border border-white/10 rounded-3xl p-8"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <PieChart className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Resource Allocation</h3>
              <p className="text-sm text-white/40">Per cohort investment breakdown</p>
            </div>
          </div>

          <div className="space-y-4">
            {resourceAllocation.map((item, idx) => (
              <motion.div
                key={item.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + idx * 0.05 }}
                className="flex items-center gap-4"
              >
                <div className="w-32 text-sm text-white/60">{item.category}</div>
                <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ delay: 0.8 + idx * 0.05, duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-cyan-400 to-violet-400 rounded-full"
                  />
                </div>
                <div className="w-20 text-right">
                  <div className="text-sm font-bold text-white">{item.percentage}%</div>
                  <div className="text-xs text-white/40">${(item.amount / 1000).toFixed(0)}k</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex justify-between items-center">
              <span className="text-white/60">Total per Cohort</span>
              <span className="text-2xl font-bold text-white">$1.0M</span>
            </div>
          </div>
        </motion.div>

        {/* ROI Calculator */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/[0.02] backdrop-blur border border-white/10 rounded-3xl p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Investor ROI Calculator</h3>
                <p className="text-sm text-white/40">Project your returns</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-sm text-white/60 mb-2 block">Investment Amount</label>
              <input
                type="range"
                min="25000"
                max="500000"
                step="25000"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-violet-500"
              />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-white/40">$25k</span>
                <span className="text-xl font-bold text-violet-400">
                  ${(investmentAmount / 1000).toFixed(0)}k
                </span>
                <span className="text-xs text-white/40">$500k</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-violet-500/5 border border-violet-500/20">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-white/40 mb-1">5-Year Projection</div>
                  <div className="text-2xl font-bold text-emerald-400">
                    ${((investmentAmount * (exitScenarios[selectedScenario]?.multiple ?? 6.8)) / 1000000).toFixed(2)}M
                  </div>
                </div>
                <div>
                  <div className="text-sm text-white/40 mb-1">Net Profit</div>
                  <div className="text-2xl font-bold text-white">
                    ${((investmentAmount * ((exitScenarios[selectedScenario]?.multiple ?? 6.8) - 1)) / 1000000).toFixed(2)}M
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Annualized Return (IRR)</span>
                  <span className="text-xl font-bold text-amber-400">{irr}%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-white/40">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Based on {exitScenarios[selectedScenario]?.type ?? 'Base Case'} exit scenario</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Success Stories Pipeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-violet-500/10 to-emerald-500/10 border border-violet-500/20 rounded-3xl p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
            <Award className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Success Stories Pipeline</h3>
            <p className="text-sm text-white/40">Track record of accelerator graduates</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-3xl font-bold text-emerald-400 mb-2">3</div>
            <div className="text-sm font-medium text-white/80">Series A Raises</div>
            <div className="text-xs text-white/40 mt-1">$2.5M - $8M range</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-3xl font-bold text-violet-400 mb-2">$47M</div>
            <div className="text-sm font-medium text-white/80">Total Capital Raised</div>
            <div className="text-xs text-white/40 mt-1">By portfolio companies</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-3xl font-bold text-amber-400 mb-2">2</div>
            <div className="text-sm font-medium text-white/80">Exit Events</div>
            <div className="text-xs text-white/40 mt-1">Acquisition & secondary</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HyperloopMultiplierEngine;
