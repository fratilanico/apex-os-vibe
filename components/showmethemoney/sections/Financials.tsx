import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, PieChart, Target, ArrowUpRight, BarChart3 } from 'lucide-react';

const financialProjections = [
  { year: 'Year 1', revenue: '$1.8M', ebitda: '-$200K', portfolio: '$2.4M', customers: '1,000' },
  { year: 'Year 2', revenue: '$6.2M', ebitda: '$800K', portfolio: '$12M', customers: '3,500' },
  { year: 'Year 3', revenue: '$18M', ebitda: '$4.2M', portfolio: '$45M', customers: '10,000' },
  { year: 'Year 4', revenue: '$42M', ebitda: '$12M', portfolio: '$120M', customers: '22,000' },
  { year: 'Year 5', revenue: '$85M', ebitda: '$28M', portfolio: '$280M', customers: '45,000' }
];

const keyDrivers = [
  { label: 'LTV/CAC Ratio', value: '12:1', trend: 'improving', target: '25:1' },
  { label: 'Gross Margin', value: '85%', trend: 'stable', target: '87%' },
  { label: 'Monthly Churn', value: '4.5%', trend: 'improving', target: '3%' },
  { label: 'ARPU', value: '$150', trend: 'improving', target: '$189' }
];

const unitEconomics = {
  cac: '$75',
  ltv: '$1,875',
  payback: '1.5 months',
  margin: '85%'
};

export const Financials: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6"
        >
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-bold text-emerald-400 uppercase tracking-widest">Financial Projections</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl font-bold text-white mb-4"
        >
          The J-Curve to
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            $85M ARR
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-white/60 max-w-3xl mx-auto"
        >
          Capital-efficient growth with world-class unit economics and diversified revenue streams.
        </motion.p>
      </div>

      {/* Unit Economics Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-8 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30"
      >
        <div className="flex items-center gap-3 mb-6">
          <PieChart className="w-6 h-6 text-emerald-400" />
          <h3 className="text-xl font-bold text-white">Unit Economics (Base Case)</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Object.entries(unitEconomics).map(([key, value], idx) => (
            <div key={key} className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{value}</div>
              <div className="text-xs text-white/40 uppercase tracking-wider">
                {key === 'cac' ? 'CAC' : key === 'ltv' ? 'LTV' : key === 'payback' ? 'Payback Period' : 'Gross Margin'}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-white/60">LTV/CAC Ratio</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-emerald-400">25:1</span>
              <span className="text-xs text-white/40">(SaaS Floor: 3:1)</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 5-Year Projection Table */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-8 text-center">5-Year Financial Trajectory</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-4 text-white/40 text-sm font-bold uppercase">Year</th>
                <th className="text-right py-4 px-4 text-white/40 text-sm font-bold uppercase">Revenue</th>
                <th className="text-right py-4 px-4 text-white/40 text-sm font-bold uppercase">EBITDA</th>
                <th className="text-right py-4 px-4 text-white/40 text-sm font-bold uppercase">Portfolio Value</th>
                <th className="text-right py-4 px-4 text-white/40 text-sm font-bold uppercase">Customers</th>
              </tr>
            </thead>
            <tbody>
              {financialProjections.map((row, idx) => (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 px-4 text-white font-bold">{row.year}</td>
                  <td className="py-4 px-4 text-right text-emerald-400 font-bold">{row.revenue}</td>
                  <td className="py-4 px-4 text-right text-cyan-400">{row.ebitda}</td>
                  <td className="py-4 px-4 text-right text-violet-400">{row.portfolio}</td>
                  <td className="py-4 px-4 text-right text-white/60">{row.customers}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Drivers */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-8 text-center">Key Performance Drivers</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {keyDrivers.map((driver, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10"
            >
              <div className="text-xs text-white/40 uppercase tracking-wider mb-2">{driver.label}</div>
              <div className="text-2xl font-bold text-white mb-2">{driver.value}</div>
              <div className="flex items-center gap-2 text-xs">
                <span className={driver.trend === 'improving' ? 'text-emerald-400' : 'text-amber-400'}>
                  {driver.trend === 'improving' ? '↑' : '→'} {driver.trend}
                </span>
                <span className="text-white/30">Target: {driver.target}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Revenue Mix */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-8 rounded-3xl bg-gradient-to-r from-cyan-500/5 via-violet-500/5 to-emerald-500/5 border border-white/10"
      >
        <h3 className="text-xl font-bold text-white mb-6 text-center">Revenue Diversification (Year 5)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
            <div className="text-4xl font-bold text-cyan-400 mb-2">40%</div>
            <div className="text-white font-bold mb-1">SaaS Subscriptions</div>
            <div className="text-sm text-white/50">Recurring education revenue</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-violet-500/10 border border-violet-500/20">
            <div className="text-4xl font-bold text-violet-400 mb-2">35%</div>
            <div className="text-white font-bold mb-1">Accelerator Equity</div>
            <div className="text-sm text-white/50">Portfolio company stakes</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="text-4xl font-bold text-emerald-400 mb-2">25%</div>
            <div className="text-white font-bold mb-1">Enterprise B2B</div>
            <div className="text-sm text-white/50">Team licenses & partnerships</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Financials;
