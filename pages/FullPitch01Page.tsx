import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, Users, Globe, Award, Briefcase,
  AlertTriangle, Lightbulb, Zap, Shield, CheckCircle2, ChevronRight,
  BarChart3, Cpu, Layers, ArrowRight, Calculator,
  MapPin, Landmark, Database, Lock, Play, 
  Workflow, Code2, Terminal, Sparkles
} from 'lucide-react';

// Modular Component Imports
import { ExecutiveTab } from '@/components/showmethemoney/tabs/ExecutiveTab';
import { FinancialsTab } from '@/components/showmethemoney/tabs/FinancialsTab';
import { DashboardTab } from '@/components/showmethemoney/tabs/DashboardTab';
import { AnalyticsTab } from '@/components/showmethemoney/tabs/AnalyticsTab';
import { ComparablesTab } from '@/components/showmethemoney/tabs/ComparablesTab';
import { EconomicsSection } from '@/components/showmethemoney/tabs/EconomicsSection';
import { RiskSection } from '@/components/showmethemoney/tabs/RiskSection';
import { BerkusCalculator } from '@/components/showmethemoney/calculators/BerkusCalculator';
import { VCMethodCalculator } from '@/components/showmethemoney/calculators/VCMethodCalculator';
import { DynamicRiskMatrix } from '@/components/showmethemoney/risk/DynamicRiskMatrix';
import { HyperloopMultiplierEngine } from '@/components/showmethemoney/accelerator/HyperloopMultiplierEngine';

// Pitch Sections
import { TheHook } from '@/components/showmethemoney/sections/TheHook';
import { TheProblem } from '@/components/showmethemoney/sections/TheProblem';
import { TheSolution } from '@/components/showmethemoney/sections/TheSolution';
import { TheMarket } from '@/components/showmethemoney/sections/TheMarket';
import { KnowledgeHub } from '@/components/showmethemoney/sections/KnowledgeHub';
import { Financials } from '@/components/showmethemoney/sections/Financials';

// TYPES
interface Tab {
  id: string;
  label: string;
  icon: React.ElementType;
}

// 10 CONSOLIDATED TABS
const TABS: Tab[] = [
  { id: 'vision', label: 'VISION', icon: Rocket },
  { id: 'engine', label: 'THE ENGINE', icon: Zap },
  { id: 'portfolio', label: 'PORTFOLIO', icon: Layers },
  { id: 'team', label: 'TEAM TREE', icon: Network },
  { id: 'dashboard', label: 'DASHBOARD', icon: BarChart3 },
  { id: 'analytics', label: 'ANALYTICS', icon: Calculator },
  { id: 'valuation', label: 'VALUATION', icon: Calculator },
  { id: 'market', label: 'MARKET', icon: Globe },
  { id: 'gtm', label: 'GTM', icon: MapPin },
  { id: 'round', label: 'THE ROUND', icon: Landmark },
];

// DATA LOCKS (Single Source of Truth)
const PITCH_CONSTANTS = {
  leads: 32000,
  historicalLeads: 30000,
  activeUsers: 2000,
  retention: 1.4,
  m18Target: 1000,
  seedAsk: 1200000,
  preMoney: 6800000,
  m18Arr: 1480000,
  cac: 150,
  ltv: 1500,
  baseRatio: '9.8:1',
  consRatio: '6:1',
};

// PRICING DATA - 5 TIERS EACH
const PRICING_WEST = [
  { name: 'Freemium', price: '$0', target: 'Free Entry', features: ['Module 00', 'Basic Tools', 'Community'] },
  { name: 'Builder', price: '$99', target: 'Premium Entry', features: ['Core Builder Track', 'Tools Starter', 'Global Support'] },
  { name: 'Sovereign', price: '$349', target: 'Serious Builders', features: ['Full Curriculum', 'Global Live Sessions', 'Code Reviews'] },
  { name: 'Accelerator', price: '$699', target: 'High Intent', features: ['30-Day Intensive', 'Launch Playbooks', 'Investor Network'], isRecommended: true },
  { name: 'Partnership', price: '$2499', target: 'Team x5', features: ['5 Team Seats', 'Enterprise Enablement', 'Dedicated Support'] },
];

const PRICING_EMERGING = [
  { name: 'Explorer', price: '$0', target: 'Free Entry', features: ['Module 00', 'Basic Tools', 'Community'] },
  { name: 'CodeSprint', price: '$89', target: 'High Velocity', features: ['Core Tracks', 'Regional Support', 'Tools Pack'] },
  { name: 'Builder Lab', price: '$149', target: 'Momentum', features: ['Mentoring', 'Live Sessions', 'Peer Reviews'] },
  { name: 'Founder Track', price: '$249', target: 'High Intent', features: ['Advanced Modules', 'Launch Roadmaps', 'Founder Network'], isRecommended: true },
  { name: 'Accelerator', price: '$300', target: 'Top Founders', features: ['30-Day Sprint', '15% Equity Option', 'GTM Prep'] },
];

export const FullPitch01Page: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('vision');
  const [pricingRegion, setPricingRegion] = useState<'emerging' | 'west'>('west');
  const [jarvisMsg, setJarvisMsg] = useState("");

  const fullJarvisMsg = "ACCESSING NEURAL VENTURE PROTOCOL V6.0... SYNCING 32K LEADS... WELCOME, NICOLAE. ENGINE ROOM AT 100% CAPACITY.";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullJarvisMsg.length) {
        setJarvisMsg(fullJarvisMsg.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 20);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="relative z-10 min-h-screen bg-[#030305] text-white overflow-x-hidden font-sans selection:bg-cyan-500/30">
      {/* BACKGROUND ENGINE - NO PITCH BLACK */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-cyan-500/10 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-violet-500/10 rounded-full blur-[160px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-radial-gradient(circle_at_center,transparent_0%,#030305_100%)" />
      </div>

      {/* JARVIS INTRO HANDSHAKE */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-4 pointer-events-none">
        <div className="p-4 rounded-2xl border border-cyan-500/30 bg-black/80 backdrop-blur-2xl shadow-2xl shadow-cyan-500/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center animate-pulse border border-cyan-500/40">
              <Terminal className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-[10px] font-mono text-cyan-400 font-black tracking-widest uppercase">
              {jarvisMsg}
              <span className="inline-block w-1 h-3 bg-cyan-400 ml-1 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
      
      {/* HEADER */}
      <header className="relative px-4 sm:px-6 pt-20 pb-16">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-12 backdrop-blur-xl"
          >
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em]">🤫 TOP SECRET | APEX OS PITCH DECK V6.0</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tight leading-none mb-8 font-display">
              32,000 Warm Leads<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-emerald-400">
                One Accelerator
              </span>
            </h1>
            <p className="text-white/60 text-xl md:text-3xl leading-relaxed font-medium max-w-5xl mx-auto px-4 italic">
              Converting 32,000 warm leads from InfoAcademy into technical founders through AI-powered acceleration.|
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {[
              { label: 'Seed Round', value: `$${(PITCH_CONSTANTS.seedAsk/1000000).toFixed(1)}M`, sub: 'Active', color: 'cyan' },
              { label: 'M18 Target', value: PITCH_CONSTANTS.m18Target.toLocaleString(), sub: 'Customers', color: 'violet' },
              { label: 'M18 ARR', value: `$${(PITCH_CONSTANTS.m18Arr/1000000).toFixed(2)}M`, sub: 'Base Case', color: 'emerald' },
              { label: 'LTV:CAC', value: PITCH_CONSTANTS.baseRatio, sub: 'Efficiency', color: 'amber' },
            ].map((metric, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="p-8 rounded-[2rem] border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-2xl group hover:border-cyan-500/30 transition-all"
              >
                <div className={`text-4xl font-black text-${metric.color}-400 mb-2 font-mono tracking-tighter italic uppercase`}>{metric.value}</div>
                <div className="text-xs text-white/40 uppercase font-black tracking-widest">{metric.label}</div>
                <div className="text-[9px] text-white/20 uppercase font-bold mt-1">{metric.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </header>

      {/* NAVIGATION */}
      <nav className="sticky top-0 z-50 px-4 sm:px-6 py-6 bg-[#030305]/80 backdrop-blur-3xl border-b border-white/5">
        <div className="max-w-7xl mx-auto overflow-x-auto no-scrollbar">
          <div className="flex flex-nowrap justify-start lg:justify-center gap-2 min-w-max pb-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg shadow-cyan-500/20 border-white/10'
                    : 'bg-white/5 text-white/30 hover:bg-white/10 hover:text-white border-transparent'
                }`}
              >
                <tab.icon className="w-3 h-3" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* CONTENT ENGINE */}
      <div className="px-4 sm:px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            
            {/* VISION TAB */}
            {activeTab === 'vision' && (
              <motion.div key="vision" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-32">
                <div className="p-12 sm:p-20 rounded-[4rem] border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 via-black/40 to-violet-500/5 backdrop-blur-3xl max-w-5xl mx-auto text-center shadow-3xl">
                  <div className="text-sm font-black uppercase tracking-[0.5em] text-cyan-400 mb-8 animate-pulse font-mono">SYSTEM_REVOLUTION_ACTIVE</div>
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-10 leading-tight uppercase font-display italic">
                    Leave the old ways behind.<br />
                    <span className="text-cyan-400">Join the revolution.</span>
                  </h2>
                  <p className="text-white/70 text-xl md:text-2xl leading-relaxed font-medium mb-16 max-w-3xl mx-auto">
                    Empowering 32,000 pre-existing clients to skip the outdated dev-cycle. Ship any product in 10 days with your own team of autonomous AI agents.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-8 rounded-3xl bg-black/40 border border-white/5 group hover:border-cyan-500/30 transition-all shadow-2xl">
                      <div className="text-4xl font-black text-white font-mono italic tracking-tighter">$0</div>
                      <div className="text-[10px] text-white/40 uppercase font-black tracking-widest mt-2">Initial CAC</div>
                    </div>
                    <div className="p-8 rounded-3xl bg-black/40 border border-white/5 group hover:border-violet-500/30 transition-all shadow-2xl">
                      <div className="text-4xl font-black text-white font-mono italic tracking-tighter">1.4%</div>
                      <div className="text-[10px] text-white/40 uppercase font-black tracking-widest mt-2">Activation Retention</div>
                    </div>
                    <div className="p-8 rounded-3xl bg-black/40 border border-white/5 group hover:border-emerald-500/30 transition-all shadow-2xl">
                      <div className="text-4xl font-black text-white font-mono italic tracking-tighter">10 Days</div>
                      <div className="text-[10px] text-white/40 uppercase font-black tracking-widest mt-2">Concept to MVP</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-32">
                  <TheHook />
                  <TheProblem />
                  <TheSolution />
                </div>
              </motion.div>
            )}

            {/* THE ENGINE TAB (ACCELERATOR OVERHAUL) */}
            {activeTab === 'engine' && (
              <motion.div key="engine" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-32">
                <div className="text-center">
                  <h2 className="text-6xl font-black uppercase italic tracking-tighter text-white underline decoration-violet-500/30 underline-offset-12">The Founder Factory</h2>
                  <p className="text-cyan-400 font-mono text-sm uppercase tracking-[0.5em] mt-8 font-black">PHASED_ACCELERATION_PROTOCOL_V1.0</p>
                </div>

                {/* THE PHASED SPRINT PLAN */}
                <div className="max-w-5xl mx-auto relative px-4">
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/0 via-cyan-500/40 to-cyan-500/0 hidden md:block" />
                  
                  {[
                    { title: 'Intake: Legacy Pool', icon: Users, color: 'cyan', model: 'Orchestrator V4', desc: 'Sifting through 32,000 warm leads via proprietary performance filters. Activating the 2,000 current user base.', kpi: 'Top 1% Selection' },
                    { title: 'Days 1-10: Architecture', icon: Cpu, color: 'violet', model: 'Claude 4.5 Opus', desc: '36-Agent swarm setup. Neural architecture design. System handshake. Human reviews strategy.', kpi: 'Spec Defined' },
                    { title: 'Days 11-20: Rapid Build', icon: Zap, color: 'emerald', model: 'Claude 5 Sonnet', desc: 'Agent-to-agent execution. WebContainer browser runtime build-out. 10-day sprint execution.', kpi: 'Alpha Released' },
                    { title: 'Days 21-30: GTM & Exit', icon: Rocket, color: 'amber', model: 'Gemini 3 Flash', desc: 'Validation loops back to Sonnet. First 100 customers. Pitch audit. Demo day.', kpi: 'Revenue Trigger' },
                  ].map((stage, idx) => (
                    <div key={idx} className={`flex flex-col md:flex-row items-center gap-12 mb-24 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                      <div className={`flex-1 ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                        <div className={`text-xs font-black text-${stage.color}-400 font-mono tracking-[0.3em] mb-4`}>{stage.model}</div>
                        <h3 className="text-3xl font-black text-white uppercase italic mb-4">{stage.title}</h3>
                        <p className="text-white/60 text-lg leading-relaxed font-medium mb-6">{stage.desc}</p>
                        <div className={`inline-flex px-4 py-2 rounded-xl bg-${stage.color}-500/10 border border-${stage.color}-500/20 text-${stage.color}-400 text-[10px] font-black uppercase tracking-widest`}>
                          KPI: {stage.kpi}
                        </div>
                      </div>
                      <div className={`w-24 h-24 rounded-[2rem] bg-${stage.color}-500/20 border-2 border-${stage.color}-500/40 flex items-center justify-center z-10 shrink-0 shadow-2xl shadow-${stage.color}-500/20 relative group`}>
                        <stage.icon className={`w-12 h-12 text-${stage.color}-400`} />
                        <div className="absolute inset-0 bg-white rounded-[2rem] opacity-0 group-hover:opacity-10 transition-opacity blur-xl" />
                      </div>
                      <div className="flex-1 hidden md:block" />
                    </div>
                  ))}
                </div>

                <div className="p-16 rounded-[4rem] border border-white/10 bg-white/[0.02] backdrop-blur-3xl text-center shadow-3xl">
                  <h3 className="text-3xl font-black text-white mb-8 uppercase italic tracking-widest underline decoration-cyan-500/20 underline-offset-8">The Agentic Advantage</h3>
                  <p className="text-white/50 text-xl max-w-3xl mx-auto leading-relaxed italic">
                    "We don't teach how to code. We teach how to <span className="text-cyan-400 font-bold">orchestrate</span>. By replacing human dev teams with AI swarms, our founders ship 10x faster at 1/10th the cost. This is the only way to remain on the <span className="text-emerald-400">bleeding edge</span>."
                  </p>
                </div>
              </motion.div>
            )}

            {/* PORTFOLIO TAB */}
            {activeTab === 'portfolio' && (
              <motion.div key="portfolio" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-32">
                <div className="text-center">
                  <h2 className="text-6xl font-black uppercase italic tracking-tighter text-white leading-none">Portfolio Value<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Multiplier Engine</span></h2>
                  <p className="text-white/40 text-xl uppercase tracking-widest mt-6">15% Equity // 45%+ IRR Target // Systematic Value Capture</p>
                </div>
                
                <div className="p-8 rounded-[3rem] border border-amber-500/20 bg-amber-500/5 backdrop-blur-xl max-w-4xl mx-auto text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8">
                    <AlertTriangle className="w-8 h-8 text-amber-400 opacity-20" />
                  </div>
                  <div className="text-xs font-black text-amber-400 uppercase tracking-[0.4em] mb-4 font-mono">LEGAL_DISCLAIMER_V1</div>
                  <p className="text-white/60 text-sm leading-relaxed uppercase font-bold tracking-tight px-12">
                    Hypothetical Scenarios: These projections represent potential outcomes based on market analysis. No portfolio companies currently exist. This demonstrates the 15% equity model's potential returns across diverse AI sectors.
                  </p>
                </div>

                <HyperloopMultiplierEngine />
              </motion.div>
            )}

            {/* TEAM TREE TAB (DOCKER REDESIGN) */}
            {activeTab === 'team' && (
              <motion.div key="team" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-32">
                <div className="text-center">
                  <h2 className="text-6xl font-black uppercase italic tracking-tighter text-white leading-none">The Engine Room</h2>
                  <p className="text-cyan-400 font-mono text-xs uppercase tracking-[0.5em] mt-6 font-black">HYBRID_HUMAN_AI_CLUSTER_V6.0</p>
                </div>

                {/* BOARD LAYER */}
                <div className="flex flex-col items-center gap-12 relative max-w-7xl mx-auto">
                  <motion.div 
                    initial={{ scale: 0.9 }}
                    whileHover={{ scale: 1.02 }}
                    className="p-12 rounded-[4rem] border-2 border-cyan-500/40 bg-gradient-to-br from-cyan-500/10 via-black/60 to-transparent backdrop-blur-3xl text-center shadow-3xl relative z-10 w-full max-w-3xl"
                  >
                    <div className="flex justify-between items-start mb-8">
                      <div className="text-left">
                        <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest font-mono">NODE_TYPE: STRATEGIC_ROOT</span>
                        <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter mt-2">Nicolae Fratila</h3>
                        <p className="text-white/40 text-xs font-black uppercase tracking-[0.2em] mt-1">Founder // Acting CTO // Acting CPO</p>
                      </div>
                      <div className="w-20 h-20 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shadow-2xl">
                        <span className="text-2xl font-black text-white">NF</span>
                      </div>
                    </div>
                    <div className="p-6 rounded-3xl bg-black/40 border border-white/5 text-left mb-8">
                      <p className="text-white/60 text-sm leading-relaxed font-medium uppercase italic">
                        "FLAWLESS EXECUTION REQUIRES A SOVEREIGN SYSTEM. I PROVIDE THE VISION, DIRECTION, AND RISK-TAKING. THE SWARM EXECUTES."
                      </p>
                    </div>
                    <div className="flex justify-between items-center px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Sovereignty Status: 100%</span>
                      </div>
                      <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">Equity: 80% Locked</div>
                    </div>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                    {[
                      { name: 'Strategic Advisor', role: 'Strategic Board', status: 'ACTIVE', color: 'violet', initials: 'SA', d: 'Kevin Obeegadoo. Fundraising & Global Expansion Strategy.' },
                      { name: 'Chief Tech Officer', role: 'Strategic Board', status: 'HIRING', color: 'slate', initials: 'CTO', d: 'Target: AI Infrastructure Visionary. 5-7% Strategic Pool.' },
                      { name: 'Chief Product Officer', role: 'Strategic Board', status: 'HIRING', color: 'slate', initials: 'CPO', d: 'Target: UX/Sovereignty Architect. 5-7% Strategic Pool.' },
                    ].map((member, idx) => (
                      <div key={idx} className={`p-10 rounded-[3rem] border ${member.status === 'ACTIVE' ? 'border-violet-500/30 bg-violet-500/5 shadow-2xl' : 'border-white/5 bg-white/[0.02] opacity-40'} text-center backdrop-blur-xl relative group transition-all hover:border-violet-400/50`}>
                        <div className={`w-16 h-16 rounded-2xl bg-${member.color}-500/20 border border-${member.color}-500/30 flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110 shadow-xl`}>
                          <span className={`text-xl font-black text-${member.color}-400`}>{member.initials}</span>
                        </div>
                        <h4 className="text-xl font-black text-white uppercase mb-1 italic tracking-tight">{member.name}</h4>
                        <p className={`text-${member.color}-400 text-[9px] font-black uppercase tracking-[0.2em] mb-6 font-mono`}>{member.role}</p>
                        <p className="text-white/40 text-[10px] font-bold uppercase leading-relaxed mb-6">{member.d}</p>
                        <div className="text-[8px] text-white/20 uppercase font-black border-t border-white/5 pt-4">Board Allocation Pool</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* INTELLIGENCE SWARM */}
                <div className="p-16 rounded-[5rem] border border-white/10 bg-black/40 backdrop-blur-3xl shadow-3xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-radial-gradient(circle_at_top,rgba(34,211,238,0.05),transparent)" />
                  <div className="text-center mb-24 relative z-10">
                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter leading-none mb-4 italic">The Engine Hub</h3>
                    <p className="text-white/30 font-mono text-[10px] uppercase tracking-[0.4em] font-black underline decoration-cyan-500/30 underline-offset-8">36 AGENT SWARM // HIERARCHICAL_VALIDATION_MATRIX</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
                    {/* COMMAND LAYER */}
                    <div className="space-y-8 relative">
                      <div className="flex items-center gap-4 mb-12 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 backdrop-blur-md">
                        <div className="w-14 h-14 rounded-[1.2rem] bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shadow-2xl shadow-rose-500/20">
                          <Crown className="w-7 h-7 text-rose-400" />
                        </div>
                        <div>
                          <h4 className="text-white font-black uppercase tracking-widest text-lg italic leading-none">Command</h4>
                          <p className="text-rose-400 text-[8px] font-mono font-black uppercase tracking-[0.2em] mt-1">Tier 01 // Claude 4.5 Opus</p>
                        </div>
                      </div>
                      {['Strategic Growth Ops', 'Architectural Integrity', 'Security Matrix Root', 'Economic Optimization'].map((dept, i) => (
                        <motion.div 
                          key={i} 
                          whileHover={{ x: 10 }}
                          className="p-8 rounded-[2.5rem] border border-rose-500/20 bg-black/60 shadow-2xl relative group overflow-hidden hover:border-rose-400 transition-all border-l-4 border-l-rose-500"
                        >
                          <div className="text-white font-black text-xs uppercase tracking-widest relative z-10 italic">{dept}</div>
                          <div className="text-[8px] text-rose-400/40 font-mono mt-2 uppercase tracking-widest">Active_Decision_Node</div>
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-5 group-hover:opacity-20 transition-opacity"><Cpu className="w-8 h-8 text-rose-400" /></div>
                        </motion.div>
                      ))}
                    </div>

                    {/* MANAGEMENT LAYER */}
                    <div className="space-y-8 lg:mt-16 relative">
                      <div className="flex items-center gap-4 mb-12 p-4 rounded-2xl bg-violet-500/10 border border-violet-500/20 backdrop-blur-md">
                        <div className="w-14 h-14 rounded-[1.2rem] bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shadow-2xl shadow-violet-500/20">
                          <Brain className="w-7 h-7 text-violet-400" />
                        </div>
                        <div>
                          <h4 className="text-white font-black uppercase tracking-widest text-lg italic leading-none">Management</h4>
                          <p className="text-violet-400 text-[8px] font-mono font-black uppercase tracking-[0.2em] mt-1">Tier 02 // Claude 5 Sonnet</p>
                        </div>
                      </div>
                      {['Spec Translation', 'Quality Gatekeeping', 'Validation Feedback', 'Cross-Node Sync'].map((dept, i) => (
                        <motion.div 
                          key={i} 
                          whileHover={{ x: 10 }}
                          className="p-8 rounded-[2.5rem] border border-violet-500/20 bg-black/60 shadow-2xl relative group overflow-hidden hover:border-violet-400 transition-all border-l-4 border-l-violet-500"
                        >
                          <div className="text-white font-black text-xs uppercase tracking-widest relative z-10 italic">{dept}</div>
                          <div className="text-[8px] text-violet-400/40 font-mono mt-2 uppercase tracking-widest">Protocol_Validation_Gate</div>
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-5 group-hover:opacity-20 transition-opacity"><Workflow className="w-8 h-8 text-violet-400" /></div>
                        </motion.div>
                      ))}
                    </div>

                    {/* EXECUTION LAYER */}
                    <div className="space-y-8 lg:mt-32 relative">
                      <div className="flex items-center gap-4 mb-12 p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-md">
                        <div className="w-14 h-14 rounded-[1.2rem] bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shadow-2xl shadow-cyan-500/20">
                          <ZapIcon className="w-7 h-7 text-cyan-400" />
                        </div>
                        <div>
                          <h4 className="text-white font-black uppercase tracking-widest text-lg italic leading-none">Execution</h4>
                          <p className="text-cyan-400 text-[8px] font-mono font-black uppercase tracking-[0.2em] mt-1">Tier 03 // Gemini 3 Flash</p>
                        </div>
                      </div>
                      {['Component Prototyping', 'High-Velocity Coding', 'Autonomous DevOps', 'Lead Scraping Swarm'].map((dept, i) => (
                        <motion.div 
                          key={i} 
                          whileHover={{ x: 10 }}
                          className="p-8 rounded-[2.5rem] border border-cyan-500/20 bg-black/60 shadow-2xl relative group overflow-hidden hover:border-cyan-400 transition-all border-l-4 border-l-cyan-500"
                        >
                          <div className="text-white font-black text-xs uppercase tracking-widest relative z-10 italic">{dept}</div>
                          <div className="text-[8px] text-cyan-400/40 font-mono mt-2 uppercase tracking-widest">High_Throughput_Builder</div>
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-5 group-hover:opacity-20 transition-opacity"><Code2 className="w-8 h-8 text-cyan-400" /></div>
                        </motion.div>
                      ))}
                    </div>

                    {/* VALIDATION LOOPS */}
                    <div className="absolute inset-0 pointer-events-none hidden lg:block opacity-40">
                      <svg className="w-full h-full" viewBox="0 0 1000 600">
                        <motion.path d="M 750 450 Q 800 350 666 350" stroke="#22d3ee" strokeWidth="2" fill="none" strokeDasharray="10 5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} />
                        <motion.path d="M 500 300 Q 400 250 333 250" stroke="#a78bfa" strokeWidth="2" fill="none" strokeDasharray="10 5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ repeat: Infinity, duration: 3, ease: "linear", delay: 1.5 }} />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* DASHBOARD TAB */}
            {activeTab === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="space-y-16 text-center">
                  <h2 className="text-5xl font-black uppercase italic tracking-tighter text-white">Projected Trajectory</h2>
                  <p className="text-cyan-400 font-mono text-[10px] uppercase tracking-[0.5em] mt-4 font-black underline decoration-cyan-500/30 underline-offset-8">REAL_TIME_MONITORING // STATUS: IN_PROGRESS</p>
                  <DashboardTab />
                </div>
              </motion.div>
            )}

            {/* ANALYTICS TAB */}
            {activeTab === 'analytics' && (
              <motion.div key="analytics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="space-y-12">
                  <div className="text-center">
                    <h2 className="text-5xl font-black uppercase italic tracking-tighter text-white">Financial Simulator</h2>
                    <p className="text-white/40 font-mono text-xs uppercase tracking-[0.5em] mt-4">1.4% RETENTION_BASE // JETBRAINS_MONO_DATA</p>
                  </div>
                  <AnalyticsTab />
                </div>
              </motion.div>
            )}

            {/* VALUATION TAB */}
            {activeTab === 'valuation' && (
              <motion.div key="valuation" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-24">
                <div className="text-center">
                  <h2 className="text-5xl font-black uppercase italic tracking-tighter text-white underline decoration-white/10 underline-offset-12">Valuation Logic Bridge</h2>
                  <p className="text-white/40 font-mono text-xs uppercase tracking-[0.5em] mt-8">STRICT_DATA_ENFORCEMENT // JETBRAINS_MONO</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto font-mono">
                  <div className="p-12 rounded-[4rem] border border-cyan-500/20 bg-white/[0.02] shadow-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10"><span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">COMPLETED</span></div>
                    <h3 className="text-3xl font-black text-white uppercase italic mb-8 underline decoration-cyan-500/50">Berkus Method</h3>
                    <p className="text-cyan-400 text-xs mb-12 uppercase font-black tracking-widest">Pre-Seed / Angel Valuation Benchmark</p>
                    <BerkusCalculator />
                    <div className="mt-12 pt-12 border-t border-white/5 text-center">
                      <div className="text-6xl font-black text-cyan-400 tracking-tighter italic font-mono">$2.50M</div>
                      <div className="text-[10px] text-white/30 uppercase font-black tracking-[0.4em] mt-4 italic">PHASE_01_LOCKED_VALUE</div>
                    </div>
                  </div>

                  <div className="p-12 rounded-[4rem] border border-violet-500/20 bg-white/[0.02] shadow-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10"><span className="px-4 py-1.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest border border-cyan-500/30 animate-pulse">ACTIVE_ROUND</span></div>
                    <h3 className="text-3xl font-black text-white uppercase italic mb-8 underline decoration-violet-500/50">VC Method</h3>
                    <p className="text-violet-400 text-xs mb-12 uppercase font-black tracking-widest">Seed Round Target // Enterprise Capability</p>
                    <VCMethodCalculator />
                    <div className="mt-12 pt-12 border-t border-white/5 text-center">
                      <div className="text-6xl font-black text-violet-400 tracking-tighter italic font-mono">$6.80M</div>
                      <div className="text-[10px] text-white/30 uppercase font-black tracking-[0.4em] mt-4 italic">PHASE_02_TARGET_VALUE</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* MARKET TAB */}
            {activeTab === 'market' && (
              <motion.div key="market" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-32">
                <div className="text-center">
                  <h2 className="text-6xl font-black uppercase italic tracking-tighter text-white underline decoration-violet-500/20 underline-offset-8">Market Capture Intel</h2>
                  <p className="text-white/40 font-mono text-xs uppercase tracking-[0.5em] mt-6 font-black">TAM $36.2B // STRATEGIC_INTERCEPT_V4</p>
                </div>

                <div className="p-16 rounded-[5rem] border border-white/10 bg-black/40 backdrop-blur-3xl shadow-3xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-radial-gradient(circle_at_center,rgba(34,211,238,0.05),transparent)" />
                  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-12">
                      {[
                        { label: 'TAM', value: '$36.2B', desc: 'Global EdTech & AI Skills market. Horizontal orchestration is the standard.', color: 'cyan' },
                        { label: 'SAM', value: '$8.4B', desc: 'High-intent technical builders. 1.5B population pool India + RO.', color: 'violet' },
                        { label: 'SOM', value: '$89M', desc: 'Year 5 target via systematic InfoAcademy conversion.', color: 'emerald' },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-6 group">
                          <div className={`w-1 h-16 bg-${item.color}-500 group-hover:scale-y-110 transition-transform shadow-[0_0_10px_rgba(34,211,238,0.5)]`} />
                          <div>
                            <div className={`text-5xl font-black text-${item.color}-400 font-mono italic tracking-tighter`}>{item.value}</div>
                            <div className="text-[10px] text-white font-black uppercase tracking-widest mt-1 italic underline decoration-white/10">{item.label}</div>
                            <p className="text-white/40 text-[11px] font-bold mt-4 uppercase leading-relaxed max-w-sm tracking-tight">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="relative aspect-square rounded-full border border-white/5 bg-white/[0.02] p-12 flex items-center justify-center group shadow-inner">
                      <div className="absolute inset-0 rounded-full border border-cyan-500/10 animate-ping opacity-20" />
                      <div className="absolute inset-12 rounded-full border border-violet-500/10 animate-pulse opacity-20" />
                      <div className="text-center relative z-10">
                        <Globe className="w-48 h-48 text-white/5 mx-auto mb-8 animate-spin-slow" />
                        <motion.div 
                          initial={{ scale: 1 }}
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 4 }}
                          className="p-10 rounded-[3rem] border-2 border-cyan-500/40 bg-black/60 backdrop-blur-3xl shadow-3xl cursor-pointer hover:border-cyan-400 transition-all"
                        >
                          <div className="flex items-center justify-center gap-3 mb-4">
                            <MapPin className="w-6 h-6 text-cyan-400 animate-bounce" />
                            <div className="text-3xl font-black text-white uppercase italic tracking-tighter">Romania</div>
                          </div>
                          <div className="text-5xl font-black text-cyan-400 font-mono my-3 tracking-tighter italic font-mono">2,000</div>
                          <div className="text-xs text-white/40 font-black uppercase tracking-widest">Active Core Customers</div>
                          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
                            <div className="text-center">
                              <div className="text-lg font-black text-white font-mono">32K</div>
                              <div className="text-[8px] text-white/20 uppercase font-bold">Legacy Pool</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-black text-emerald-400 font-mono">1.4%</div>
                              <div className="text-[8px] text-white/20 uppercase font-bold">Retention</div>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
                <ComparablesTab />
              </motion.div>
            )}

            {/* GTM TAB */}
            {activeTab === 'gtm' && (
              <motion.div key="gtm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-24">
                <div className="text-center">
                  <h2 className="text-6xl font-black uppercase italic tracking-tighter text-white underline decoration-emerald-500/20 underline-offset-12">Expansion Protocol</h2>
                  <p className="text-white/40 font-mono text-xs uppercase tracking-[0.5em] mt-8 font-black">PHASED_GLOBAL_ROLLOUT // GTM_V6</p>
                </div>
                <div className="space-y-12">
                  {[
                    { phase: 'Phase 1: Activation', target: 'RO & Legacy Base', color: 'cyan', status: 'IN PROGRESS', metrics: { rev: '$444K', users: '165' }, items: ['Direct Email Activation of 32K List', 'Shadow Brand ROI Case Studies'] },
                    { phase: 'Phase 2: Expansion', target: 'Indian Market Scale', color: 'violet', status: 'PLANNED', metrics: { rev: '$943K', users: '351' }, items: ['Regional Strategic Partnerships', 'Localized PPP Pricing'] },
                    { phase: 'Phase 3: Dominance', target: 'Premium West Launch', color: 'emerald', status: 'PLANNED', metrics: { rev: '$1.48M', users: '551' }, items: ['Global Accreditation Engine', 'Enterprise Team Licenses'] },
                  ].map((p, i) => (
                    <div key={i} className={`p-16 rounded-[4rem] border-2 border-${p.color}-500/20 bg-gradient-to-br from-${p.color}-500/10 via-black/40 to-transparent relative shadow-3xl group`}>
                      <div className="flex flex-col lg:flex-row justify-between gap-16 relative z-10">
                        <div className="space-y-8">
                          <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter">{p.phase}</h3>
                          <p className={`text-${p.color}-400 font-mono text-sm uppercase font-black tracking-[0.4em]`}>{p.target}</p>
                          <div className="grid grid-cols-1 gap-4 pt-4">
                            {p.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-6"><div className={`w-1.5 h-1.5 rounded-full bg-${p.color}-500`} /><span className="text-sm font-black uppercase text-white/60 tracking-widest">{item}</span></div>
                            ))}
                          </div>
                        </div>
                        <div className="text-right flex flex-col justify-center items-end gap-8 bg-black/40 p-10 rounded-[3rem] border border-white/5 shadow-inner">
                          <div className={`text-6xl font-black text-${p.color}-400 font-mono italic tracking-tighter`}>{p.metrics.rev}</div>
                          <div className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em] mt-2 italic">ARR_TARGET</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* THE ROUND TAB */}
            {activeTab === 'round' && (
              <motion.div key="round" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-32">
                <div className="text-center">
                  <h2 className="text-6xl font-black uppercase italic tracking-tighter text-white leading-none">The Round</h2>
                  <p className="text-white/40 font-mono text-xs uppercase tracking-[0.5em] mt-6 font-black">$1.2M SEED // 15% EQUITY OFFERED</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto items-stretch">
                  <div className="p-16 rounded-[4rem] border-2 border-violet-500/40 bg-violet-500/5 backdrop-blur-3xl shadow-3xl text-center relative overflow-hidden flex flex-col justify-center">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
                    <div className="relative z-10">
                      <div className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-violet-500 to-emerald-500 text-white text-2xl font-black uppercase tracking-widest mb-16 shadow-2xl">
                        $1.2M SEED_ROUND
                      </div>
                      <div className="space-y-8 mb-16">
                        {[
                          { label: 'Accelerator Build-out', amount: '$420K', color: 'cyan', p: 35 },
                          { label: 'Platform Eng & AI Swarm', amount: '$360K', color: 'violet', p: 30 },
                          { label: 'Strategic GTM & Growth', amount: '$240K', color: 'emerald', p: 20 },
                          { label: 'Operational Reserve', amount: '$180K', color: 'amber', p: 15 },
                        ].map((item, i) => (
                          <div key={i} className="text-left">
                            <div className="flex justify-between items-end mb-2">
                              <span className="text-[10px] font-black uppercase tracking-widest text-white/40 font-mono italic">{item.label}</span>
                              <span className={`text-2xl font-black text-${item.color}-400 font-mono italic tracking-tighter underline underline-offset-4 decoration-${item.color}-500/20`}>{item.amount}</span>
                            </div>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${item.p}%` }} transition={{ duration: 1.5, delay: i * 0.1 }} className={`h-full bg-${item.color}-500 shadow-lg shadow-${item.color}-500/30`} />
                            </div>
                          </div>
                        ))}
                      </div>
                      <motion.a whileHover={{ scale: 1.05 }} href="https://calendly.com/fratilanico-vibecoderacademy" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-6 px-20 py-10 rounded-[3rem] bg-white text-black text-3xl font-black uppercase tracking-widest shadow-2xl hover:bg-cyan-400 transition-all hover:shadow-cyan-500/40">
                        SECURE_ACCESS <ArrowRight className="w-10 h-10" />
                      </motion.a>
                    </div>
                  </div>

                  <div className="p-16 rounded-[4rem] border border-white/10 bg-white/[0.02] backdrop-blur-3xl shadow-3xl flex flex-col items-center justify-center min-h-[700px]">
                    <h3 className="text-3xl font-black text-white mb-20 uppercase italic tracking-widest text-center underline decoration-cyan-500/20 underline-offset-12">Blended CAC Logic</h3>
                    <div className="relative w-80 h-80">
                      <div className="absolute inset-0 rounded-full border-[40px] border-white/5" />
                      <div className="absolute inset-0 rounded-full border-[40px] border-cyan-500 border-t-transparent border-l-transparent" style={{ transform: 'rotate(45deg)' }} />
                      <div className="absolute inset-0 rounded-full border-[40px] border-violet-500 border-b-transparent border-r-transparent" style={{ transform: 'rotate(-120deg)' }} />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-7xl font-black text-white font-mono tracking-tighter italic shadow-2xl shadow-cyan-500/20">$150</div>
                        <div className="text-[10px] text-white/40 uppercase font-black tracking-[0.5em] mt-4 italic">AVG_CAC_SCALE</div>
                      </div>
                    </div>
                    <div className="mt-20 grid grid-cols-2 gap-16 w-full text-center">
                      <div>
                        <div className="text-4xl font-black text-cyan-400 font-mono italic tracking-tighter">9.8:1</div>
                        <div className="text-[8px] text-white/20 uppercase font-bold mt-2">Base Case Ratio</div>
                      </div>
                      <div>
                        <div className="text-4xl font-black text-violet-400 font-mono italic tracking-tighter">6:1</div>
                        <div className="text-[8px] text-white/20 uppercase font-bold mt-2">Cons. Case Ratio</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* RISK & MOAT TAB */}
            {activeTab === 'risk' && (
              <motion.div key="risk" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-32">
                <div className="text-center">
                  <h2 className="text-6xl font-black uppercase italic tracking-tighter text-white">Risk Matrix</h2>
                  <p className="text-white/40 font-mono text-xs uppercase tracking-[0.5em] mt-6">THREAT_VECTOR_ASSESSMENT // DEFENSIBILITY_IP</p>
                </div>
                <DynamicRiskMatrix />
                <RiskSection />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* PRICING SECTION - DUAL MARKET 5-TIER CAROUSEL (PRESENTATION VIBES) */}
      {activeTab === 'economics' && (
        <motion.div key="economics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="px-4 sm:px-6 py-32 border-t border-white/5 bg-black/40 backdrop-blur-3xl mt-32">
          <div className="max-w-7xl mx-auto space-y-32">
            <div className="text-center">
              <h2 className="text-6xl font-black uppercase italic tracking-tighter text-white underline decoration-cyan-500/30 underline-offset-12 decoration-4 mb-24 leading-none">Global Revenue<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">Calibration Engine</span></h2>
            </div>

            <div className="space-y-32">
              <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-20 bg-white/[0.02] p-10 rounded-[3rem] border border-white/10">
                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 rounded-[2rem] bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shadow-2xl shadow-cyan-500/20 animate-pulse"><Globe className="w-10 h-10 text-cyan-400" /></div>
                  <div>
                    <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">Dual-Market Flow</h3>
                    <p className="text-white/40 text-sm font-black uppercase tracking-[0.4em] font-mono italic mt-2">SYSTEM_PPP_ENABLED // RO_IN_US_UK_EU</p>
                  </div>
                </div>
                <div className="flex p-3 rounded-3xl bg-black/60 border border-white/10 backdrop-blur-3xl shadow-inner">
                  <button onClick={() => setPricingRegion('emerging')} className={`px-12 py-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${pricingRegion === 'emerging' ? 'bg-cyan-500 text-black shadow-2xl shadow-cyan-500/40 scale-105' : 'text-white/30 hover:text-white/60'}`}>Emerging Markets</button>
                  <button onClick={() => setPricingRegion('west')} className={`px-12 py-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${pricingRegion === 'west' ? 'bg-violet-500 text-white shadow-2xl shadow-violet-500/40 scale-105' : 'text-white/30 hover:text-white/60'}`}>West (US/UK/EU)</button>
                </div>
              </div>

              <div className="flex overflow-x-auto gap-8 pb-20 no-scrollbar snap-x snap-mandatory px-4">
                {(pricingRegion === 'emerging' ? PRICING_EMERGING : PRICING_WEST).map((tier, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, scale: 0.9, x: 20 }} 
                    whileInView={{ opacity: 1, scale: 1, x: 0 }} 
                    transition={{ delay: idx * 0.1, duration: 0.5 }} 
                    className={`min-w-[360px] p-16 rounded-[5rem] border-2 ${tier.isRecommended ? 'border-cyan-500/50 bg-cyan-500/10 shadow-3xl shadow-cyan-500/20 scale-[1.05] z-10' : 'border-white/10 bg-white/[0.03]'} flex flex-col snap-center relative group backdrop-blur-3xl hover:border-white/30 transition-all`}
                  >
                    {tier.isRecommended && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-black px-10 py-3 rounded-full uppercase tracking-[0.3em] shadow-2xl shadow-white/30 italic">
                        Most Viral Tier
                      </div>
                    )}
                    <div className="text-xs font-black text-white/40 uppercase mb-8 tracking-[0.4em] font-mono italic border-b border-white/5 pb-4">{tier.target}</div>
                    <div className="text-3xl font-black text-white uppercase mb-6 tracking-tighter italic font-display">{tier.name}</div>
                    <div className="text-7xl font-black text-white font-mono mb-16 tracking-tighter italic underline decoration-cyan-500/20 underline-offset-12 decoration-8">{tier.price}<span className="text-2xl text-white/20 font-black">/mo</span></div>
                    <ul className="space-y-8 flex-1 mb-20">
                      {tier.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-6 text-sm font-black uppercase text-white/60 tracking-widest leading-none group-hover:text-white transition-colors">
                          <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_12px_#22d3ee] animate-pulse" /> {f}
                        </li>
                      ))}
                    </ul>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-8 rounded-[2.5rem] text-sm font-black uppercase tracking-[0.4em] transition-all shadow-2xl ${tier.isRecommended ? 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-cyan-500/30' : 'bg-white/5 text-white border border-white/10 hover:bg-white/10 shadow-black/50'}`}
                    >
                      Deploy Integration
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="p-20 rounded-[5rem] border border-white/5 bg-black/20 shadow-inner">
              <h3 className="text-3xl font-black text-white mb-16 uppercase italic text-center underline decoration-violet-500/20 underline-offset-12">Dynamic Scenario Modeling</h3>
              <EconomicsSection />
            </div>
          </div>
        </motion.div>
      )}

      {/* FOOTER CALL TO ACTION */}
      <footer className="relative border-t border-white/5 py-40 px-4 sm:px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent shadow-[0_0_20px_#22d3ee]" />
        <div className="max-w-5xl mx-auto text-center space-y-16 relative z-10">
          <h2 className="text-6xl sm:text-8xl lg:text-9xl font-black uppercase italic tracking-tighter text-white leading-none">Ready to <span className="text-cyan-400 underline decoration-cyan-500/30 underline-offset-16 decoration-8">Manufacture</span> Unicorns?</h2>
          <p className="text-white/40 text-2xl font-medium leading-relaxed max-w-3xl mx-auto italic uppercase tracking-tight">
            "flawless execution requires a sovereign system. apEx os is the only manufacturing plant for the neural era."
          </p>
          <motion.a 
            whileHover={{ scale: 1.05, boxShadow: "0 0 120px rgba(34,211,238,0.4)" }}
            whileTap={{ scale: 0.95 }}
            href="https://calendly.com/fratilanico-vibecoderacademy" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-8 px-24 py-12 rounded-[3rem] bg-white text-black text-4xl font-black uppercase tracking-[0.1em] transition-all shadow-[0_0_80px_rgba(255,255,255,0.3)] hover:bg-cyan-400"
          >
            SECURE_INTRO <ArrowRight className="w-14 h-14" />
          </motion.a>
          <div className="pt-20 text-white/10 font-mono text-[10px] uppercase tracking-[0.6em] font-black">2026_APEX_OS_SOVEREIGNTY_PROTOCOL // ALL_RIGHTS_RESERVED // KERNEL_LOCK_ACTIVE</div>
        </div>
      </footer>
    </main>
  );
};

// Additional Icons Needed for Team Tree
const Crown = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>
);

const Brain = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.54Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.54Z"/></svg>
);

const ZapIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.71V21l5.19-2.81a2 2 0 0 1 1.81 0L16.19 21 20 17.71a2 2 0 0 0 .81-1.62v-9.01a2 2 0 0 0-1.19-1.83L12 2.35 4.38 5.25A2 2 0 0 0 3.19 7.08v7.63a2 2 0 0 0 .81 1.62Z"/><path d="M12 7v10"/><path d="M8 12h8"/></svg>
);

export default FullPitch01Page;
