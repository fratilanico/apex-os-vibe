import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, DollarSign, 
  ArrowRight, Percent, Building2, Sparkles,
  LineChart, BarChart3
} from 'lucide-react';

interface VCCalculation {
  projectedExit: number;
  targetIRR: number;
  yearsToExit: number;
  dilutionRate: number;
  postMoneyValuation: number;
  preMoneyValuation: number;
  investmentAmount: number;
  equityStake: number;
}

interface CalculationResults {
  calculatedPostMoney: number;
  calculatedPreMoney: number;
  impliedEquity: number;
  returnMultiple: number;
  investorReturn: number;
  comparableValuation: number;
  arrrMultiple: number;
}

const VC_METHOD_DEFAULTS: VCCalculation = {
  projectedExit: 150000000,
  targetIRR: 0.20,
  yearsToExit: 5,
  dilutionRate: 0.15,
  postMoneyValuation: 8000000,
  preMoneyValuation: 6800000,
  investmentAmount: 1200000,
  equityStake: 0.15
};

export const VCMethodCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<VCCalculation>(VC_METHOD_DEFAULTS);

  const calculations: CalculationResults = useMemo(() => {
    const { projectedExit, targetIRR, yearsToExit, dilutionRate, investmentAmount } = inputs;
    
    // VC Method Formula
    const denominator = Math.pow(1 + targetIRR, yearsToExit) * (1 - dilutionRate);
    const calculatedPostMoney = projectedExit / denominator;
    const calculatedPreMoney = calculatedPostMoney - investmentAmount;
    const impliedEquity = (investmentAmount / calculatedPostMoney) * 100;
    
    // Return multiples
    const returnMultiple = projectedExit / calculatedPostMoney;
    const investorReturn = investmentAmount * returnMultiple;
    
    // Market comparables
    const arrrMultiple = 8.5;
    const projectedARR = 1800000;
    const comparableValuation = projectedARR * arrrMultiple;
    
    return {
      calculatedPostMoney,
      calculatedPreMoney,
      impliedEquity,
      returnMultiple,
      investorReturn,
      comparableValuation,
      arrrMultiple
    };
  }, [inputs]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  const handleInputChange = (field: keyof VCCalculation, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
            <LineChart className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">VC Method Calculator</h3>
            <p className="text-xs text-white/40">Reverse-engineer valuation from exit scenarios</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-violet-400">
            {formatCurrency(calculations.calculatedPreMoney)}
          </div>
          <div className="text-xs text-white/40">Implied Pre-Money</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inputs Section */}
        <div className="space-y-6">
          <h4 className="text-sm font-bold text-white/60 uppercase tracking-wider">Exit Assumptions</h4>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-white/60">Projected Exit Value</label>
                <span className="text-sm font-bold text-violet-400">{formatCurrency(inputs.projectedExit)}</span>
              </div>
              <input
                type="range"
                min="50000000"
                max="500000000"
                step="10000000"
                value={inputs.projectedExit}
                onChange={(e) => handleInputChange('projectedExit', Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-violet-500"
              />
              <div className="flex justify-between text-xs text-white/30 mt-1">
                <span>$50M</span>
                <span>$500M</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-white/60">Target IRR</label>
                <span className="text-sm font-bold text-emerald-400">{(inputs.targetIRR * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.50"
                step="0.05"
                value={inputs.targetIRR}
                onChange={(e) => handleInputChange('targetIRR', Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-white/30 mt-1">
                <span>10%</span>
                <span>50%</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-white/60">Years to Exit</label>
                <span className="text-sm font-bold text-cyan-400">{inputs.yearsToExit} years</span>
              </div>
              <input
                type="range"
                min="3"
                max="10"
                step="1"
                value={inputs.yearsToExit}
                onChange={(e) => handleInputChange('yearsToExit', Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-xs text-white/30 mt-1">
                <span>3 yrs</span>
                <span>10 yrs</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-white/60">Future Dilution</label>
                <span className="text-sm font-bold text-amber-400">{(inputs.dilutionRate * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.50"
                step="0.05"
                value={inputs.dilutionRate}
                onChange={(e) => handleInputChange('dilutionRate', Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-xs text-white/30 mt-1">
                <span>0%</span>
                <span>50%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <h4 className="text-sm font-bold text-white/60 uppercase tracking-wider">Calculated Valuation</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-2xl bg-violet-500/5 border border-violet-500/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-violet-400" />
                <span className="text-xs text-white/40 uppercase">Post-Money</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {formatCurrency(calculations.calculatedPostMoney)}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-white/40 uppercase">Pre-Money</span>
              </div>
              <div className="text-2xl font-bold text-emerald-400">
                {formatCurrency(calculations.calculatedPreMoney)}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <Percent className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-white/40 uppercase">Equity Stake</span>
              </div>
              <div className="text-2xl font-bold text-cyan-400">
                {calculations.impliedEquity.toFixed(1)}%
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <ArrowRight className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-white/40 uppercase">Return Multiple</span>
              </div>
              <div className="text-2xl font-bold text-amber-400">
                {calculations.returnMultiple.toFixed(1)}x
              </div>
            </motion.div>
          </div>

          {/* Investor Return Projection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-2xl bg-gradient-to-r from-violet-500/10 to-emerald-500/10 border border-violet-500/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-bold text-white">Investor Return Projection</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60">Initial Investment</span>
                <span className="text-lg font-bold text-white">{formatCurrency(inputs.investmentAmount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60">Projected Return</span>
                <span className="text-lg font-bold text-emerald-400">{formatCurrency(calculations.investorReturn)}</span>
              </div>
              <div className="h-px bg-white/10 my-3" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60">Net Profit</span>
                <span className="text-xl font-bold text-emerald-400">
                  {formatCurrency(calculations.investorReturn - inputs.investmentAmount)}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Comparable Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-6 rounded-2xl bg-white/5 border border-white/10"
      >
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <h4 className="text-sm font-bold text-white">Market Comparable Analysis</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="text-xs text-white/40 mb-2">EdTech ARR Multiple</div>
            <div className="text-2xl font-bold text-cyan-400">{calculations.arrrMultiple}x</div>
            <div className="text-xs text-white/30 mt-1">Industry Average</div>
          </div>
          
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="text-xs text-white/40 mb-2">Projected Year 1 ARR</div>
            <div className="text-2xl font-bold text-violet-400">$1.8M</div>
            <div className="text-xs text-white/30 mt-1">Based on 1,000 customers</div>
          </div>
          
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="text-xs text-white/40 mb-2">Comparable Valuation</div>
            <div className="text-2xl font-bold text-emerald-400">{formatCurrency(calculations.comparableValuation)}</div>
            <div className="text-xs text-white/30 mt-1">Using market multiples</div>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-white font-bold mb-1">APEX OS Valuation Context</h5>
              <p className="text-sm text-white/60">
                Our current seed round pre-money valuation of <span className="text-cyan-400 font-bold">$6.8M</span> aligns with 
                both VC Method calculations and market comparables. The 15% equity stake provides investors with a 
                <span className="text-emerald-400 font-bold"> {calculations.returnMultiple.toFixed(1)}x return multiple</span> at a 
                $150M exit, representing a <span className="text-violet-400 font-bold">{(inputs.targetIRR * 100).toFixed(0)}% IRR</span> over {inputs.yearsToExit} years.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VCMethodCalculator;
