import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Calculator, TrendingUp, Users, Target, DollarSign } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface FinancialAssumptions {
  conversionRate: number;
  blendedARPU: number;
  monthlyChurn: number;
  marketingBase: number;
}

interface MonthlyProjection {
  month: number;
  monthLabel: string;
  newCustomers: number;
  churn: number;
  netNew: number;
  totalCustomers: number;
  mrr: number;
  monthlyRevenue: number;
  cumulativeRevenue: number;
  totalExpenses: number;
  netCashFlow: number;
  cumulativeCash: number;
}

const EMAIL_LIST_SIZE = 32000;
const INITIAL_CUSTOMERS = 50;
const INITIAL_CASH = 1200000;

export const FinancialBrain: React.FC = () => {
  const [assumptions, setAssumptions] = useState<FinancialAssumptions>({
    conversionRate: 0.02,
    blendedARPU: 224,
    monthlyChurn: 0.045,
    marketingBase: 9500
  });

  // Calculate dynamic model based on assumptions
  const dynamicModel = useMemo(() => {
    let customers = INITIAL_CUSTOMERS;
    let cumulativeRevenue = 0;
    let cumulativeCash = INITIAL_CASH;
    const model: MonthlyProjection[] = [];

    for (let month = 1; month <= 18; month++) {
      // Calculate new customers based on conversion rate and marketing spend
      const marketingMultiplier = 1 + (month * 0.05); // Marketing efficiency improves over time
      const newCustomers = Math.round(
        (EMAIL_LIST_SIZE * assumptions.conversionRate / 6) * marketingMultiplier
      );
      
      // Calculate churn
      const churned = Math.round(customers * assumptions.monthlyChurn);
      
      // Update customer count
      customers = customers + newCustomers - churned;
      
      // Calculate MRR and revenue
      const mrr = customers * assumptions.blendedARPU;
      const monthlyRevenue = mrr;
      cumulativeRevenue += monthlyRevenue;
      
      // Calculate expenses (ramp up over time)
      const totalExpenses = month <= 6 ? 46500 : month <= 12 ? 79500 : 101500;
      
      // Calculate cash flow
      const netCashFlow = monthlyRevenue - totalExpenses;
      cumulativeCash += netCashFlow;

      model.push({
        month,
        monthLabel: `M${month}`,
        newCustomers,
        churn: churned,
        netNew: newCustomers - churned,
        totalCustomers: customers,
        mrr,
        monthlyRevenue,
        cumulativeRevenue,
        totalExpenses,
        netCashFlow,
        cumulativeCash
      });
    }

    return model;
  }, [assumptions]);

  const m18 = dynamicModel[17];

  const handleReset = () => {
    setAssumptions({
      conversionRate: 0.02,
      blendedARPU: 224,
      monthlyChurn: 0.045,
      marketingBase: 9500
    });
  };

  const sliders = [
    {
      id: 'conversionRate',
      label: 'Conversion Rate',
      value: assumptions.conversionRate,
      min: 0.005,
      max: 0.05,
      step: 0.001,
      format: (v: number) => `${(v * 100).toFixed(1)}%`,
      icon: Target,
      color: 'cyan'
    },
    {
      id: 'blendedARPU',
      label: 'Blended ARPU',
      value: assumptions.blendedARPU,
      min: 100,
      max: 400,
      step: 10,
      format: (v: number) => `$${v}`,
      icon: DollarSign,
      color: 'emerald'
    },
    {
      id: 'monthlyChurn',
      label: 'Monthly Churn',
      value: assumptions.monthlyChurn,
      min: 0.01,
      max: 0.10,
      step: 0.005,
      format: (v: number) => `${(v * 100).toFixed(1)}%`,
      icon: Users,
      color: 'amber'
    },
    {
      id: 'marketingBase',
      label: 'Marketing/mo',
      value: assumptions.marketingBase,
      min: 5000,
      max: 40000,
      step: 1000,
      format: (v: number) => `$${(v / 1000).toFixed(0)}K`,
      icon: TrendingUp,
      color: 'violet'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/[0.02] backdrop-blur border border-white/10 rounded-3xl p-6 lg:p-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
            <Calculator className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Financial Brain</h3>
            <p className="text-sm text-white/40">Interactive 18-month projections</p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 
                     border border-white/10 hover:border-white/20 transition-all text-sm text-white/60"
        >
          <RefreshCw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {sliders.map((slider) => (
          <motion.div
            key={slider.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/40 rounded-2xl p-4 border border-white/5"
          >
            <div className="flex items-center gap-2 mb-3">
              <slider.icon className={`w-4 h-4 text-${slider.color}-400`} />
              <span className="text-xs font-bold text-white/60 uppercase tracking-wider">
                {slider.label}
              </span>
            </div>
            
            <div className="text-2xl font-bold text-white mb-3">
              {slider.format(slider.value)}
            </div>

            <input
              type="range"
              min={slider.min}
              max={slider.max}
              step={slider.step}
              value={slider.value}
              onChange={(e) => setAssumptions(prev => ({
                ...prev,
                [slider.id]: parseFloat(e.target.value)
              }))}
              className={`w-full h-2 rounded-lg appearance-none cursor-pointer
                bg-white/10 accent-${slider.color}-500
                hover:accent-${slider.color}-400 transition-all`}
              style={{
                background: `linear-gradient(to right, var(--${slider.color}-500) 0%, var(--${slider.color}-500) ${((slider.value - slider.min) / (slider.max - slider.min)) * 100}%, rgba(255,255,255,0.1) ${((slider.value - slider.min) / (slider.max - slider.min)) * 100}%, rgba(255,255,255,0.1) 100%)`
              }}
            />
            
            <div className="flex justify-between text-xs text-white/30 mt-2">
              <span>{slider.format(slider.min)}</span>
              <span>{slider.format(slider.max)}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Results Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'MRR (M18)', value: `$${(m18.mrr / 1000).toFixed(0)}K`, color: 'cyan' },
          { label: 'Customers', value: m18.totalCustomers.toLocaleString(), color: 'emerald' },
          { label: 'Revenue', value: `$${(m18.cumulativeRevenue / 1000000).toFixed(2)}M`, color: 'violet' },
          { label: 'Cash', value: `$${(m18.cumulativeCash / 1000000).toFixed(2)}M`, color: 'amber' }
        ].map((stat) => (
          <div key={stat.label} className="text-center p-4 rounded-xl bg-white/5 border border-white/5">
            <div className={`text-2xl font-bold text-${stat.color}-400 mb-1`}>{stat.value}</div>
            <div className="text-xs text-white/40 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dynamicModel} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="monthLabel" 
              stroke="rgba(255,255,255,0.3)"
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.3)"
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.9)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '12px'
              }}
              formatter={(value: number) => [`$${(value / 1000).toFixed(0)}K`, 'MRR']}
            />
            <ReferenceLine 
              y={0} 
              stroke="rgba(255,255,255,0.1)" 
              strokeDasharray="3 3"
              label={{ value: 'Break-even', fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
            />
            <Area
              type="monotone"
              dataKey="mrr"
              stroke="#06b6d4"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#mrrGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="text-center text-xs text-white/30 mt-4">
        Adjust sliders above to see real-time impact on 18-month projections
      </div>
    </motion.div>
  );
};

export default FinancialBrain;