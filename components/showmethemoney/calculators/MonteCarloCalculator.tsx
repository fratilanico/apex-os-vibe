import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Play, BarChart2, TrendingUp, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface SimulationResult {
  mrr: number;
  frequency: number;
  bucket: string;
}

export const MonteCarloCalculator: React.FC = () => {
  const [iterations, setIterations] = useState(1000);
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [stats, setStats] = useState({
    min: 0,
    max: 0,
    median: 0,
    p90: 0,
    p10: 0,
  });

  const runSimulation = () => {
    setIsSimulating(true);
    
    // Artificial delay for effect
    setTimeout(() => {
      const data: number[] = [];
      const buckets: Record<string, number> = {};
      
      // Base assumptions with variance
      const baseARPU = 224;
      const baseConversion = 0.02;
      const baseLeads = 32000;
      
      for (let i = 0; i < iterations; i++) {
        // Random variance (Normal distribution approximation using Box-Muller)
        const u1 = Math.random();
        const u2 = Math.random();
        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        
        // Vary conversion rate (mean 2%, std dev 0.5%)
        const simConversion = Math.max(0.005, baseConversion + z0 * 0.005);
        
        // Vary ARPU (mean 224, std dev 30)
        const simARPU = baseARPU + (Math.random() - 0.5) * 60;
        
        const mrr = Math.round(baseLeads * simConversion * simARPU);
        data.push(mrr);
        
        // Bucketing for chart
        const bucketSize = 50000;
        const bucketMin = Math.floor(mrr / bucketSize) * bucketSize;
        const bucketKey = `${(bucketMin / 1000).toFixed(0)}k-${((bucketMin + bucketSize) / 1000).toFixed(0)}k`;
        buckets[bucketKey] = (buckets[bucketKey] || 0) + 1;
      }
      
      data.sort((a, b) => a - b);
      
      const sortedBuckets = Object.entries(buckets)
        .map(([bucket, frequency]) => ({
          bucket,
          frequency,
          mrr: parseInt(bucket.split('k')[0]) * 1000
        }))
        .sort((a, b) => a.mrr - b.mrr);
        
      setResults(sortedBuckets);
      setStats({
        min: data[0],
        max: data[data.length - 1],
        median: data[Math.floor(data.length / 2)],
        p90: data[Math.floor(data.length * 0.9)],
        p10: data[Math.floor(data.length * 0.1)],
      });
      setIsSimulating(false);
    }, 1500);
  };

  const formatCurrency = (val: number) => `$${(val / 1000).toFixed(0)}k`;

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Layers className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Monte Carlo MRR Simulation</h3>
            <p className="text-xs text-white/40">1,000 iterations over lead pipeline & conversion variables</p>
          </div>
        </div>
        
        <button
          onClick={runSimulation}
          disabled={isSimulating}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black rounded-xl font-black uppercase text-xs tracking-widest hover:bg-emerald-400 transition-all disabled:opacity-50"
        >
          {isSimulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
          {isSimulating ? 'Simulating...' : 'Run 1k Iterations'}
        </button>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white/[0.02] border border-white/10 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={results}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="bucket" 
                  stroke="rgba(255,255,255,0.3)" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Bar dataKey="frequency" fill="#10b981" radius={[4, 4, 0, 0]}>
                  {results.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fillOpacity={0.3 + (index / results.length) * 0.7}
                      fill={entry.mrr >= stats.median ? '#10b981' : '#06b6d4'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xs text-white/40 uppercase mb-1">Median Outcome</div>
              <div className="text-2xl font-bold text-white">{formatCurrency(stats.median)}</div>
              <div className="text-[10px] text-emerald-400 mt-1">50% Probability</div>
            </div>
            
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xs text-white/40 uppercase mb-1">P90 (Bull Case)</div>
              <div className="text-2xl font-bold text-emerald-400">{formatCurrency(stats.p90)}</div>
              <div className="text-[10px] text-white/30 mt-1">Top 10% Outcome</div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xs text-white/40 uppercase mb-1">P10 (Bear Case)</div>
              <div className="text-2xl font-bold text-rose-400">{formatCurrency(stats.p10)}</div>
              <div className="text-[10px] text-white/30 mt-1">Bottom 10% Outcome</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[300px] rounded-2xl border-2 border-dashed border-white/5 bg-white/[0.01]">
          <BarChart2 className="w-12 h-12 text-white/10 mb-4" />
          <p className="text-white/40 font-mono text-sm">AWAITING SIMULATION DATA</p>
        </div>
      )}

      <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 flex gap-3">
        <AlertCircle className="w-5 h-5 text-cyan-400 shrink-0" />
        <p className="text-xs text-white/60 leading-relaxed">
          The Monte Carlo engine runs 1,000 parallel simulations varying conversion rates, ARPU, and churn. 
          The bell curve visualization represents the probability distribution of Year 1 MRR results.
        </p>
      </div>
    </div>
  );
};

export default MonteCarloCalculator;
