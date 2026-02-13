import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, TrendingUp, Users, Target, DollarSign, Globe, Award, Briefcase,
  AlertTriangle, Lightbulb, Zap, Shield, CheckCircle2,
  BarChart3, Calculator,
  Landmark, Play, ArrowRight
} from 'lucide-react';

// Modular Component Imports
import { ExecutiveTab } from '@/components/showmethemoney/tabs/ExecutiveTab';
import { FinancialsTab } from '@/components/showmethemoney/tabs/FinancialsTab';
import { DashboardTab } from '@/components/showmethemoney/tabs/DashboardTab';
import { AnalyticsTab } from '@/components/showmethemoney/tabs/AnalyticsTab';
import { ComparablesTab } from '@/components/showmethemoney/tabs/ComparablesTab';
import { EconomicsSection } from '@/components/showmethemoney/tabs/EconomicsSection';
import { ReturnsSection } from '@/components/showmethemoney/tabs/ReturnsSection';
import { RiskSection } from '@/components/showmethemoney/tabs/RiskSection';
import { BerkusCalculator } from '@/components/showmethemoney/calculators/BerkusCalculator';
import { VCMethodCalculator } from '@/components/showmethemoney/calculators/VCMethodCalculator';
import { DynamicRiskMatrix } from '@/components/showmethemoney/risk/DynamicRiskMatrix';
import { HyperloopMultiplierEngine } from '@/components/showmethemoney/accelerator/HyperloopMultiplierEngine';
import { PricingTab } from '@/components/showmethemoney/tabs/PricingTab';

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

// 14 TABS CONFIGURATION (EXACT MATCH TO VIDEO)
const TABS: Tab[] = [
  { id: 'executive', label: 'EXECUTIVE', icon: Rocket },
  { id: 'accelerator', label: 'ACCELERATOR', icon: Zap },
  { id: 'dashboard', label: 'DASHBOARD', icon: BarChart3 },
  { id: 'financial', label: 'FINANCIAL BRAIN', icon: Calculator },
  { id: 'calculators', label: 'CALCULATORS', icon: Calculator },
  { id: 'pricing', label: 'PRICING', icon: DollarSign },
  { id: 'gtm', label: 'GTM', icon: TrendingUp },
  { id: 'market', label: 'MARKET', icon: Globe },
  { id: 'economics', label: 'ECONOMICS', icon: Award },
  { id: 'returns', label: 'RETURNS', icon: TrendingUp },
  { id: 'risk', label: 'RISK', icon: Shield },
  { id: 'pitch', label: 'PITCH', icon: Play },
  { id: 'team', label: 'TEAM', icon: Users },
  { id: 'fundraising', label: 'FUNDRAISING', icon: Landmark },
];

// PRICING DATA - 5 TIERS EACH
const pricingTiersEmerging = [
  { name: 'Explorer', price: '$0', target: 'Free Tier', features: ['Module 00', 'Basic Tools'] },
  { name: 'CodeSprint', price: '$89', target: 'Entry', features: ['Core Tracks', 'Community'] },
  { name: 'Builder Lab', price: '$149', target: 'Momentum', features: ['Mentoring', 'Live Sessions'] },
  { name: 'Founder Track', price: '$249', target: 'High-Intent', features: ['Advanced Modules', 'Launch Roadmaps'], isRecommended: true },
  { name: 'Accelerator', price: '$300', target: 'Scale', features: ['30-Day Sprint', '15% Equity'] },
];

const pricingTiersWest = [
  { name: 'Entry', price: '$299', target: 'Premium Entry', features: ['Core Tracks', 'Global Community'] },
  { name: 'Core', price: '$499', target: 'Serious Builders', features: ['Live Sessions', 'Code Reviews'] },
  { name: 'Pro', price: '$749', target: 'Premium Track', features: ['Founder Network', 'Certification'], isRecommended: true },
  { name: 'Enterprise', price: '$1299', target: 'Teams', features: ['White-label', 'API Access'] },
  { name: 'Partnership', price: '$2499', target: 'VC/Agencies', features: ['Direct Equity', 'Strategic Advisory'] },
];

export const ShowMeTheMoneyFix5Page: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('executive');
  const [pricingRegion, setPricingRegion] = useState<'emerging' | 'west'>('emerging');

  return (
    <main className="relative z-10 min-h-screen bg-[#030305] text-white overflow-x-hidden font-sans">
      {/* BACKGROUND ENHANCEMENT - No longer pitch black */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-cyan-500/10 via-violet-500/5 to-transparent rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>
      
      {/* Header - EXACT REPRODUCTION FROM RECORDING */}
      <header className="relative px-4 sm:px-6 pt-12 pb-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8 backdrop-blur-md">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">🤫 TOP SECRET | APEX OS Business Plan 2026</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight mb-6 font-display">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400">
                DEPLOYING PITCH DECK CONFIGURATION
              </span>
            </h1>
            
            <p className="text-white/40 font-mono text-xs uppercase tracking-[0.4em] mb-12">
              Neural_Venture_Protocol_v4.0 // FULL_WIRE_ENGAGED
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {[
                { label: 'Seed Round', value: '$1.2M', color: 'cyan' },
                { label: 'M18 Target', value: '1,000', color: 'violet' },
                { label: 'M18 ARR', value: '$1.48M', color: 'emerald' },
                { label: 'LTV:CAC', value: '9.8:1', color: 'amber' },
              ].map((metric, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-6 rounded-[1.5rem] border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-2xl shadow-black/50"
                >
                  <div className={`text-3xl font-black text-${metric.color}-400 mb-1 font-mono tracking-tighter`}>{metric.value}</div>
                  <div className="text-[10px] text-white/30 uppercase font-black tracking-widest">{metric.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </header>

      {/* 14-TAB NAVIGATION */}
      <nav className="sticky top-0 z-50 px-4 sm:px-6 py-6 bg-[#030305]/80 backdrop-blur-3xl border-b border-white/5">
        <div className="max-w-7xl mx-auto overflow-x-auto no-scrollbar">
          <div className="flex flex-nowrap justify-start md:justify-center gap-2 min-w-max pb-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg shadow-cyan-500/20'
                    : 'bg-white/5 text-white/30 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* TAB CONTENT */}
      <div className="px-4 sm:px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {/* EXECUTIVE */}
            {activeTab === 'executive' && (
              <motion.div key="executive" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                {/* 32,000 WARM LEADS HOOK */}
                <div className="text-center max-w-5xl mx-auto pt-12 mb-24">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-8">
                    <Rocket className="w-4 h-4 text-violet-400" />
                    <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">THE HYPERLOOP ACCELERATOR</span>
                  </motion.div>
                  
                  <h2 className="text-6xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight mb-8 leading-none">
                    32,000 Warm Leads<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-emerald-400">
                      One Accelerator
                    </span>
                  </h2>
                  
                  <p className="text-white/60 text-xl md:text-2xl leading-relaxed font-medium mb-12 px-4">
                    Converting 32,000 warm leads from InfoAcademy into technical founders through AI-powered acceleration.
                  </p>

                  <div className="p-8 rounded-[3rem] border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-xl max-w-3xl mx-auto mb-16 shadow-2xl">
                    <div className="text-sm font-black uppercase tracking-[0.3em] text-cyan-400 mb-4">THE REVOLUTION</div>
                    <p className="text-white/80 leading-relaxed italic font-display">
                      "Empowering pre-existing clients to leave old tech behind. Ship any product in 10 days with your own team of autonomous AI agents. Join the revolution."
                    </p>
                    <div className="mt-6 flex items-center justify-center gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-black text-white font-mono">$0</div>
                        <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Initial CAC</div>
                      </div>
                      <div className="w-px h-8 bg-white/10" />
                      <div className="text-center">
                        <div className="text-2xl font-black text-white font-mono">1.4%</div>
                        <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Target Retention</div>
                      </div>
                    </div>
                  </div>
                </div>
                <ExecutiveTab />
              </motion.div>
            )}

            {/* ACCELERATOR */}
            {activeTab === 'accelerator' && (
              <motion.div key="accelerator" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="space-y-24">
                   <div className="text-center">
                    <h2 className="text-5xl font-black uppercase italic tracking-tighter text-white">Portfolio Multiplier Engine</h2>
                    <p className="text-white/40 text-lg uppercase tracking-widest mt-4">15% Equity Model // 45%+ IRR Target</p>
                  </div>
                  
                  {/* RESTORED PHASED PLAN */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
                    {[
                      { stage: 'Recruitment', metric: '500+', label: 'Apps/Year', icon: Users, color: 'cyan' },
                      { stage: 'Academy', metric: '200', label: 'Graduates/Year', icon: Award, color: 'violet' },
                      { stage: 'Selection', metric: '10', label: 'Accelerator Spots', icon: Target, color: 'amber' },
                      { stage: 'Launch', metric: '8', label: 'Companies/Year', icon: Rocket, color: 'emerald' },
                    ].map((step, idx) => (
                      <div key={idx} className="p-8 rounded-[2.5rem] border border-white/10 bg-white/[0.02] text-center relative group backdrop-blur-sm">
                        <div className={`w-14 h-14 rounded-2xl bg-${step.color}-500/20 border border-${step.color}-500/30 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-${step.color}-500/10`}>
                          <step.icon className={`w-7 h-7 text-${step.color}-400`} />
                        </div>
                        <div className="text-3xl font-black text-white font-mono mb-1">{step.metric}</div>
                        <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest">{step.label}</div>
                        <div className={`mt-4 text-xs font-black text-${step.color}-400 uppercase tracking-tighter`}>{step.stage}</div>
                      </div>
                    ))}
                  </div>

                  <HyperloopMultiplierEngine />
                </div>
              </motion.div>
            )}

            {/* DASHBOARD */}
            {activeTab === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="space-y-12">
                  <div className="text-center">
                    <h2 className="text-4xl font-black uppercase tracking-tight text-white italic">Executive Dashboard</h2>
                    <p className="text-cyan-400 font-mono text-[10px] uppercase tracking-[0.4em] mt-2">PROJECTED STATUS // IN PROGRESS</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { label: 'Total Revenue', value: '$1.3M', sub: '18-month cumulative', status: 'In Progress', color: 'emerald' },
                      { label: 'Current MRR', value: '$165K', sub: 'Month 18 run rate', status: 'Target', color: 'cyan' },
                      { label: 'Month 18 Users', value: '1,000', sub: 'Active subscribers', status: 'Projected', color: 'violet' },
                      { label: 'LTV:CAC', value: '9.8:1', sub: 'Base Case Strategy', status: 'Excellent', color: 'amber' },
                    ].map((metric, idx) => (
                      <div key={idx} className="p-8 rounded-[2.5rem] border border-white/10 bg-black/40 backdrop-blur-3xl relative group shadow-2xl">
                        <div className="absolute top-4 right-4">
                          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded bg-${metric.color}-500/20 text-${metric.color}-400 border border-${metric.color}-500/30`}>{metric.status}</span>
                        </div>
                        <div className={`text-4xl font-black text-${metric.color}-400 mb-2 font-mono tracking-tighter`}>{metric.value}</div>
                        <div className="text-xs text-white font-bold uppercase tracking-widest">{metric.label}</div>
                        <div className="text-[10px] text-white/30 mt-1 uppercase font-bold">{metric.sub}</div>
                      </div>
                    ))}
                  </div>
                  <DashboardTab />
                </div>
              </motion.div>
            )}

            {/* FINANCIAL BRAIN */}
            {activeTab === 'financial' && (
              <motion.div key="financial" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <FinancialsTab />
              </motion.div>
            )}

            {/* CALCULATORS */}
            {activeTab === 'calculators' && (
              <motion.div key="calculators" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">Valuation Methodology</h2>
                  <p className="text-white/40 uppercase tracking-[0.3em] text-[10px] mt-2 font-mono">Validated // Defensible // Phased Progression</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                  {/* Berkus - PRE-SEED */}
                  <div className="p-10 rounded-[3rem] border border-cyan-500/20 bg-black/40 backdrop-blur-xl relative overflow-hidden group shadow-2xl">
                    <div className="absolute top-0 right-0 p-6">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">Completed Phase</span>
                    </div>
                    <div className="mb-8">
                      <h3 className="text-2xl font-black text-white uppercase mb-2">Berkus Method</h3>
                      <p className="text-white/40 text-xs font-bold tracking-widest uppercase font-mono">Pre-Seed / Angel Valuation</p>
                    </div>
                    <div className="font-mono text-cyan-400">
                      <BerkusCalculator />
                    </div>
                    <div className="mt-8 pt-8 border-t border-white/5 text-center">
                      <div className="text-4xl font-black text-cyan-400 font-mono tracking-tighter italic">$2.50M</div>
                      <div className="text-[10px] text-white/30 uppercase font-bold tracking-[0.3em] mt-2">Locked Pre-Seed Valuation</div>
                    </div>
                  </div>

                  {/* VC Method - SEED */}
                  <div className="p-10 rounded-[3rem] border border-violet-500/30 bg-black/40 backdrop-blur-xl relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-6">
                      <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest border border-cyan-500/30 animate-pulse">Active Round</span>
                    </div>
                    <div className="mb-8">
                      <h3 className="text-2xl font-black text-white uppercase mb-2">VC Method</h3>
                      <p className="text-white/40 text-xs font-bold tracking-widest uppercase font-mono">Seed Round (Reverse-Engineered)</p>
                    </div>
                    <div className="font-mono text-violet-400">
                      <VCMethodCalculator />
                    </div>
                    <div className="mt-8 pt-8 border-t border-white/5 text-center">
                      <div className="text-4xl font-black text-violet-400 font-mono tracking-tighter italic">$6.80M</div>
                      <div className={`text-[10px] text-white/30 uppercase font-bold tracking-[0.3em] mt-2`}>Current Pre-Money Target</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PRICING - 5 TIER CAROUSEL */}
            {activeTab === 'pricing' && (
              <motion.div key="pricing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-16">
                <div className="text-center">
                  <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">Dual-Market Pricing</h2>
                  <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.4em] mt-2">5-Tier Revenue Ladder // GLOBAL_PPP_OPTIMIZED</p>
                </div>

                <div className="flex justify-center gap-4 mb-12">
                  <button onClick={() => setPricingRegion('emerging')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${pricingRegion === 'emerging' ? 'bg-cyan-500 text-white' : 'bg-white/5 text-white/40 border border-white/5'}`}>Emerging Markets</button>
                  <button onClick={() => setPricingRegion('west')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${pricingRegion === 'west' ? 'bg-violet-500 text-white' : 'bg-white/5 text-white/40 border border-white/5'}`}>West (US/UK/EU)</button>
                </div>

                <div className="flex overflow-x-auto gap-6 pb-12 no-scrollbar px-4">
                  {(pricingRegion === 'emerging' ? pricingTiersEmerging : pricingTiersWest).map((tier, idx) => (
                    <div key={idx} className={`min-w-[300px] p-10 rounded-[3rem] border border-white/10 bg-white/[0.02] backdrop-blur-3xl relative group hover:border-cyan-500/30 transition-all shadow-2xl flex flex-col`}>
                      {tier.isRecommended && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-black text-[8px] font-black px-4 py-1 rounded-full uppercase tracking-widest">Most Viral</div>
                      )}
                      <div className="text-xs font-black text-cyan-400 uppercase mb-4 tracking-widest">{tier.name}</div>
                      <div className="text-5xl font-black text-white font-mono mb-8 tracking-tighter">{tier.price}<span className="text-lg text-white/20">/mo</span></div>
                      <ul className="space-y-4 mb-12 flex-1">
                        {tier.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-3 text-[10px] font-bold uppercase text-white/60">
                            <CheckCircle2 className="w-4 h-4 text-cyan-400" /> {f}
                          </li>
                        ))}
                      </ul>
                      <div className="text-[10px] text-white/30 uppercase font-black border-t border-white/5 pt-6">{tier.target}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ECONOMICS - FIXED PIE CHART */}
            {activeTab === 'economics' && (
              <motion.div key="economics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
                  {[
                    { label: 'CAC', value: '$150', sub: 'Blended 18-month', color: 'rose' },
                    { label: 'LTV', value: '$1.5K', sub: '12-month value', color: 'emerald' },
                    { label: 'LTV:CAC BASE', value: '9.8:1', sub: 'Starting Traction', color: 'cyan' },
                    { label: 'LTV:CAC CONS.', value: '6:1', sub: 'Downside Protection', color: 'amber' },
                  ].map((metric, idx) => (
                    <div key={idx} className="p-8 rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-2xl">
                      <div className="text-4xl font-black text-white font-mono tracking-tighter mb-2">{metric.value}</div>
                      <div className="text-[10px] text-white/30 uppercase font-bold tracking-widest">{metric.label}</div>
                      <div className={`text-[8px] text-${metric.color}-400 uppercase font-black mt-1`}>{metric.sub}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                  <div className="p-12 rounded-[3rem] border border-white/5 bg-black/40 backdrop-blur-3xl min-h-[450px] relative flex flex-col items-center justify-center shadow-2xl">
                    <h3 className="text-xl font-bold text-white mb-12 uppercase tracking-widest">CAC Breakdown</h3>
                    <div className="relative w-72 h-72">
                      <div className="absolute inset-0 rounded-full border-[25px] border-white/5" />
                      <div className="absolute inset-0 rounded-full border-[25px] border-cyan-500 border-t-transparent border-l-transparent" style={{ transform: 'rotate(45deg)' }} />
                      <div className="absolute inset-0 rounded-full border-[25px] border-violet-500 border-b-transparent border-r-transparent" style={{ transform: 'rotate(-120deg)' }} />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-5xl font-black text-white font-mono">$150</div>
                        <div className="text-[10px] text-white/40 uppercase font-black tracking-widest mt-1">Total CAC</div>
                      </div>
                    </div>
                  </div>
                  <EconomicsSection />
                </div>
              </motion.div>
            )}

            {/* RISK - RESTORED MATRIX */}
            {activeTab === 'risk' && (
              <motion.div key="risk" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-16">
                <div className="text-center">
                  <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">Neural Risk Matrix</h2>
                  <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.4em] mt-2">THREAT_LEVEL_ASSESSMENT // MITIGATION_STREAMS</p>
                </div>
                <DynamicRiskMatrix />
                <RiskSection />
              </motion.div>
            )}

            {/* PITCH */}
            {activeTab === 'pitch' && (
              <motion.div key="pitch" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-32 pt-12">
                <div className="text-center mb-24">
                  <h2 className="text-5xl font-black uppercase italic tracking-tighter text-white">Full Narrative Pitch</h2>
                  <p className="text-white/40 text-lg uppercase tracking-widest mt-4">The Architectural Blueprint for EdTech Dominance</p>
                </div>
                <TheHook />
                <TheProblem />
                <TheSolution />
                <TheMarket />
                <KnowledgeHub />
                <Financials />
              </motion.div>
            )}

            {/* TEAM */}
            {activeTab === 'team' && (
              <motion.div key="team" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-16">
                <div className="text-center">
                  <h2 className="text-5xl font-black uppercase italic tracking-tighter text-white">The Recursive Tree</h2>
                  <p className="text-white/40 text-lg uppercase tracking-widest mt-2">Human leadership + AI-powered operations</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-10 rounded-[2.5rem] border border-cyan-500/30 bg-cyan-500/5 text-center backdrop-blur-xl shadow-2xl">
                    <div className="w-20 h-20 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-cyan-500/20">
                      <span className="text-2xl font-black text-cyan-400">NF</span>
                    </div>
                    <h4 className="text-2xl font-black text-white uppercase mb-1">Nicolae Fratila</h4>
                    <p className="text-cyan-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">Founder & CEO</p>
                    <p className="text-white/50 text-[11px] font-bold uppercase tracking-tighter">Built InfoAcademy to 32K customers.</p>
                  </div>
                  <div className="p-10 rounded-[2.5rem] border border-violet-500/30 bg-violet-500/5 text-center backdrop-blur-xl shadow-2xl">
                    <div className="w-20 h-20 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-violet-500/20">
                      <span className="text-2xl font-black text-violet-400">KO</span>
                    </div>
                    <h4 className="text-2xl font-black text-white uppercase mb-1">Kevin Obeegadoo</h4>
                    <p className="text-violet-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">Strategic Advisor</p>
                    <p className="text-white/50 text-[11px] font-bold uppercase tracking-tighter">Fundraising & Strategy Expert.</p>
                  </div>
                  <div className="p-10 rounded-[2.5rem] border border-emerald-500/30 bg-emerald-500/5 text-center backdrop-blur-xl shadow-2xl">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/20">
                      <Landmark className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h4 className="text-2xl font-black text-white uppercase mb-1">Investor Pool</h4>
                    <p className="text-emerald-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">Seed + Series A</p>
                    <p className="text-white/50 text-[11px] font-bold uppercase tracking-tighter">15% Targeted Allocation.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* FUNDRAISING */}
            {activeTab === 'fundraising' && (
              <motion.div key="fundraising" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="p-16 rounded-[4rem] border border-white/5 bg-black/40 backdrop-blur-3xl text-center relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px]" />
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-violet-500 to-emerald-500 text-white text-2xl font-black uppercase tracking-widest mb-12 shadow-2xl">
                      $1.2M Seed Round
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
                      <div className="p-10 rounded-3xl bg-white/[0.03] border border-white/10 shadow-xl">
                        <div className="text-4xl font-black text-white mb-2 font-mono">$6.8M</div>
                        <div className="text-xs text-white/40 uppercase tracking-[0.2em] font-bold">Pre-Money Valuation</div>
                      </div>
                      <div className="p-10 rounded-3xl bg-white/[0.03] border border-white/10 shadow-xl">
                        <div className="text-4xl font-black text-white mb-2 font-mono">15%</div>
                        <div className="text-xs text-white/40 uppercase tracking-[0.2em] font-bold">Equity Offered</div>
                      </div>
                      <div className="p-10 rounded-3xl bg-white/[0.03] border border-white/10 shadow-xl">
                        <div className="text-4xl font-black text-white mb-2 font-mono">Q1 '26</div>
                        <div className="text-xs text-white/40 uppercase tracking-[0.2em] font-bold">Target Close</div>
                      </div>
                    </div>
                    <a href="https://calendly.com/fratilanico-vibecoderacademy" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-4 px-16 py-8 rounded-[2rem] bg-white text-black text-2xl font-black uppercase tracking-widest hover:bg-cyan-400 transition-all hover:shadow-[0_0_60px_rgba(34,211,238,0.4)]">
                      Secure Call Access <ArrowRight className="w-8 h-8" />
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
};

export default ShowMeTheMoneyFix5Page;
