import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ShieldCheck, Activity, Info, ChevronRight, Zap } from 'lucide-react';

interface RiskFactor {
  id: string;
  category: 'Market' | 'Technical' | 'Financial' | 'Operational' | 'Regulatory';
  name: string;
  impact: number; // 1-10
  probability: number; // 1-10
  mitigation: string;
  owner: string;
}

const initialRisks: RiskFactor[] = [
  { id: 'market-saturation', category: 'Market', name: 'Market Saturation', impact: 8, probability: 4, mitigation: 'Focus on niche underserved markets (e.g., non-English speaking) and vertical-specific solutions instead of broad horizontal play.', owner: '@gtm-agent' },
  { id: 'platform-risk', category: 'Technical', name: 'Platform Risk (Vercel)', impact: 7, probability: 2, mitigation: 'Abstract all Vercel-specific logic behind an interface. Use open standards (Next.js, Web standards) to ensure portability. Regular drills for deploying to alternative platforms (GCP/AWS).', owner: '@devops-swarm' },
  { id: 'ai-model-dependency', category: 'Technical', name: 'AI Model Dependency', impact: 9, probability: 5, mitigation: 'Develop a model-agnostic abstraction layer. Fine-tune smaller, open-source models as a fallback. Implement a dynamic model router for cost/performance optimization.', owner: '@ai-director' },
  { id: 'customer-churn', category: 'Financial', name: 'High Customer Churn', impact: 7, probability: 6, mitigation: '30-day accelerator delivers an entire company, creating extreme lock-in. Ongoing portfolio support model ensures long-term alignment and revenue.', owner: '@retention-agent' },
  { id: 'regulatory-risk', category: 'Regulatory', name: 'AI & Data Regulation', impact: 5, probability: 5, mitigation: 'Automated compliance agent monitors global regulations (GDPR, CCPA). All data processing is designed with privacy-first principles. On-prem/regional data options available for Enterprise.', owner: '@compliance-agent' },
  { id: 'infra-cost-scaling', category: 'Financial', name: 'Infrastructure Cost Scaling', impact: 6, probability: 7, mitigation: 'Serverless-first architecture (Vercel, Supabase) minimizes fixed costs. Caching layers at edge and data layers reduce compute. Cost-optimizer agent monitors and alerts on spend anomalies.', owner: '@cost-optimizer' },
  { id: 'key-person-risk', category: 'Operational', name: 'Key Person Risk (Nico)', impact: 8, probability: 3, mitigation: 'Codify all core logic and business processes into the agent swarm. Document system architecture in the Second Brain. Implement a dead man\'s switch for core credentials via shared password vault.', owner: '@orchestrator' },
  { id: 'slow-adoption', category: 'Market', name: 'Slow User Adoption', impact: 7, probability: 4, mitigation: 'Target the 32K warm leads from InfoAcademy who have already paid for similar products. Freemium model with viral loops (e.g., shareable terminal sessions) to drive organic growth.', owner: '@growth-hacker' },
  { id: 'security-breach', category: 'Technical', name: 'Security Breach', impact: 9, probability: 2, mitigation: 'Depend on enterprise-grade security from Supabase (Auth, DB) and Vercel (Edge). Automated vulnerability scanning (Snyk) in CI/CD. Principle of least privilege for all agent interactions.', owner: '@security-monitor' },
  { id: 'failure-to-raise-fomo', category: 'Financial', name: 'Inability to Raise Follow-On', impact: 9, probability: 3, mitigation: 'Focus on strong unit economics (LTV:CAC > 5:1) from day one. Build in public to create investor FOMO. Secure a strong advisory board with deep investor connections.', owner: '@ceo' },
  { id: 'talent-acquisition', category: 'Operational', name: 'Hiring Specialized Talent', impact: 6, probability: 5, mitigation: 'Lean, agent-driven team minimizes headcount need. High-signal brand attracts top talent. Remote-first policy widens talent pool globally.', owner: '@hr-agent' },
  { id: 'burnout', category: 'Operational', name: 'Founder/Team Burnout', impact: 7, probability: 4, mitigation: 'Automate repetitive tasks via the agent swarm to allow focus on high-leverage activities. Enforce structured work sprints and regular downtime. Clear separation of roles and responsibilities.', owner: '@orchestrator' }
];

export const DynamicRiskMatrix: React.FC = () => {
  const [selectedRisk, setSelectedRisk] = useState<RiskFactor | null>(null);

  const getRiskColor = (impact: number, prob: number) => {
    const score = impact * prob;
    if (score >= 50) return 'rose';
    if (score >= 25) return 'amber';
    return 'emerald';
  };

  return (
    <div className="w-full space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Dynamic Risk Matrix</h3>
            <p className="text-xs text-white/40">Real-time threat assessment & automated mitigation mapping</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Matrix Visualization */}
        <div className="relative p-6 rounded-3xl bg-white/[0.02] border border-white/10 aspect-square lg:aspect-auto lg:h-[400px]">
          <div className="absolute left-12 top-6 bottom-12 w-px bg-white/10" />
          <div className="absolute left-12 bottom-12 right-6 h-px bg-white/10" />
          
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Impact</div>
          <div className="absolute left-1/2 -bottom-4 -translate-x-1/2 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Probability</div>

          {/* Grid Cells */}
          <div className="absolute left-12 top-6 right-6 bottom-12 grid grid-cols-5 grid-rows-5 gap-1">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} className="border border-white/[0.03] rounded-sm bg-white/[0.01]" />
            ))}
          </div>

          {/* Risk Points */}
          <div className="absolute left-12 top-6 right-6 bottom-12">
            {initialRisks.map((risk) => {
              const color = getRiskColor(risk.impact, risk.probability);
              return (
                <motion.button
                  key={risk.id}
                  onClick={() => setSelectedRisk(risk)}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    left: `${(risk.probability / 10) * 100}%`,
                    bottom: `${(risk.impact / 10) * 100}%`
                  }}
                  whileHover={{ scale: 1.2, zIndex: 10 }}
                  className={`absolute -translate-x-1/2 translate-y-1/2 w-4 h-4 rounded-full bg-${color}-500 shadow-[0_0_15px_rgba(0,0,0,0.5)] border-2 border-white flex items-center justify-center group`}
                >
                  <div className={`absolute inset-0 rounded-full bg-${color}-500 animate-ping opacity-20`} />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-black/80 border border-white/10 text-[8px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {risk.name}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Risk Details / Sidebar */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {selectedRisk ? (
              <motion.div
                key={selectedRisk.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`p-6 rounded-2xl bg-${getRiskColor(selectedRisk.impact, selectedRisk.probability)}-500/10 border border-${getRiskColor(selectedRisk.impact, selectedRisk.probability)}-500/20 h-full`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1 block">{selectedRisk.category}</span>
                    <h4 className="text-xl font-bold text-white">{selectedRisk.name}</h4>
                  </div>
                  <div className={`px-3 py-1 rounded-full bg-${getRiskColor(selectedRisk.impact, selectedRisk.probability)}-500/20 text-${getRiskColor(selectedRisk.impact, selectedRisk.probability)}-400 text-xs font-bold`}>
                    Score: {selectedRisk.impact * selectedRisk.probability}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-white/60 uppercase">Mitigation Strategy</span>
                    </div>
                    <p className="text-sm text-white/80 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                      {selectedRisk.mitigation}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-bold text-white/60 uppercase">System Owner</span>
                    </div>
                    <span className="text-xs font-mono text-cyan-400">{selectedRisk.owner}</span>
                  </div>

                  <button 
                    onClick={() => setSelectedRisk(null)}
                    className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 text-xs font-bold transition-all border border-white/5"
                  >
                    Clear Selection
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-12 text-center rounded-2xl border-2 border-dashed border-white/5">
                <Info className="w-12 h-12 text-white/10 mb-4" />
                <p className="text-white/40 text-sm font-mono uppercase tracking-widest">Select a risk factor to view mitigation mapping</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Summary Table */}
      <div className="rounded-2xl border border-white/10 overflow-hidden bg-white/[0.01]">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="px-4 py-3 font-bold text-white/40 uppercase">Risk Factor</th>
              <th className="px-4 py-3 font-bold text-white/40 uppercase">Impact</th>
              <th className="px-4 py-3 font-bold text-white/40 uppercase">Prob.</th>
              <th className="px-4 py-3 font-bold text-white/40 uppercase">Status</th>
              <th className="px-4 py-3 text-right font-bold text-white/40 uppercase">Action</th>
            </tr>
          </thead>
          <tbody>
            {initialRisks.map((risk) => (
              <tr key={risk.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-all group">
                <td className="px-4 py-3 font-bold text-white">{risk.name}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className={`w-1 h-3 rounded-full ${i < risk.impact ? 'bg-rose-500' : 'bg-white/10'}`} />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className={`w-1 h-3 rounded-full ${i < risk.probability ? 'bg-amber-500' : 'bg-white/10'}`} />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Zap className="w-3 h-3 fill-current" />
                    MITIGATED
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button 
                    onClick={() => setSelectedRisk(risk)}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/40 group-hover:text-white transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DynamicRiskMatrix;
