import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, TrendingUp, Users, Target, DollarSign, Globe, Award, Briefcase,
  AlertTriangle, Lightbulb, Zap, Shield, CheckCircle2, ChevronRight, Activity,
  BarChart3, PieChart, Cpu, GitBranch, Layers, ArrowRight, Calculator,
  RefreshCw, MapPin, Building2, Landmark, Star, Fingerprint, Network,
  Workflow, Database, Lock, Code2, Play, Terminal, Sparkles, TrendingUpIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, BarChart, Bar, Cell
} from 'recharts';

// TYPES
interface Tab {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface FinancialMetric {
  month: string;
  users: number;
  newUsers: number;
  mrr: number;
  cumulativeRevenue: number;
  arpu: number;
}

// CONSERVATIVE DATA MODEL (Single Source of Truth)
const GROWTH_CURVE = [
  { month: 1, newUsers: 30 },
  { month: 2, newUsers: 35 },
  { month: 3, newUsers: 40 },
  { month: 4, newUsers: 45 },
  { month: 5, newUsers: 50 },
  { month: 6, newUsers: 55 },
  { month: 7, newUsers: 60 },
  { month: 8, newUsers: 65 },
  { month: 9, newUsers: 70 },
  { month: 10, newUsers: 75 },
  { month: 11, newUsers: 80 },
  { month: 12, newUsers: 85 },
  { month: 13, newUsers: 60 },
  { month: 14, newUsers: 55 },
  { month: 15, newUsers: 50 },
  { month: 16, newUsers: 50 },
  { month: 17, newUsers: 45 },
  { month: 18, newUsers: 50 },
];

const ARPU_PHASES = [
  { startMonth: 1, endMonth: 6, arpu: 149 },
  { startMonth: 7, endMonth: 12, arpu: 162 },
  { startMonth: 13, endMonth: 18, arpu: 179 },
];

// Generate financial projections
const generateProjections = (): FinancialMetric[] => {
  const projections: FinancialMetric[] = [];
  let cumulativeUsers = 0;
  let cumulativeRevenue = 0;
  
  GROWTH_CURVE.forEach((growth) => {
    cumulativeUsers += growth.newUsers;
    const arpuPhase = ARPU_PHASES.find(p => growth.month >= p.startMonth && growth.month <= p.endMonth);
    const arpu = arpuPhase?.arpu || 162;
    const mrr = cumulativeUsers * arpu;
    cumulativeRevenue += mrr;
    
    projections.push({
      month: `M${growth.month}`,
      users: cumulativeUsers,
      newUsers: growth.newUsers,
      mrr,
      cumulativeRevenue,
      arpu,
    });
  });
  
  return projections;
};

const PROJECTIONS = generateProjections();
const YEAR1_REVENUE = PROJECTIONS[11]?.cumulativeRevenue ?? 0;
const MONTH18_USERS = PROJECTIONS[17]?.users ?? 0;
const MONTH12_MRR = PROJECTIONS[11]?.mrr ?? 0;

// TABS CONFIGURATION (14 tabs)
const TABS: Tab[] = [
  { id: 'executive', label: 'EXECUTIVE', icon: Rocket },
  { id: 'accelerator', label: 'ACCELERATOR', icon: Zap },
  { id: 'dashboard', label: 'DASHBOARD', icon: BarChart3 },
  { id: 'financial', label: 'FINANCIAL BRAIN', icon: Calculator },
  { id: 'pricing', label: 'PRICING', icon: DollarSign },
  { id: 'gtm', label: 'GTM', icon: MapPin },
  { id: 'market', label: 'MARKET', icon: Globe },
  { id: 'economics', label: 'ECONOMICS', icon: TrendingUp },
  { id: 'returns', label: 'RETURNS', icon: Award },
  { id: 'risk', label: 'RISK', icon: AlertTriangle },
  { id: 'roi-investor', label: 'ROI: INVESTOR', icon: Briefcase },
  { id: 'roi-accelerator', label: 'ROI: ACCELERATOR', icon: Layers },
  { id: 'fundraising', label: 'FUNDRAISING', icon: Landmark },
  { id: 'team', label: 'TEAM', icon: Users },
];

// VALUE PROPS
const VALUE_PROPS = [
  { icon: Target, title: 'The Problem', desc: '$200K+/year dev team costs price out 99% of founders', color: 'rose' },
  { icon: Zap, title: 'The Solution', desc: 'AI agent orchestration training + accelerator pipeline', color: 'cyan' },
  { icon: TrendingUp, title: 'The Market', desc: '32K InfoAcademy leads, 30% retention target, 40% YoY growth', color: 'emerald' },
  { icon: Shield, title: 'The Moat', desc: 'First-mover advantage, proprietary curriculum, 15% equity model', color: 'violet' },
];

// PRICING TIERS
const PRICING_TIERS = {
  emerging: [
    { name: 'CodeSprint', price: 89, features: ['Module 00 + Core Track', 'Community Access', 'Tools Starter'], color: 'from-orange-500 to-amber-500' },
    { name: 'Builder Lab', price: 149, features: ['Full Core Curriculum', 'Weekly Live Sessions', 'Peer Reviews'], color: 'from-amber-500 to-yellow-500', recommended: true },
    { name: 'Founder Track', price: 249, features: ['Advanced Orchestration', 'Ship-to-Launch Roadmaps', 'Founder Network'], color: 'from-emerald-500 to-cyan-500' },
  ],
  west: [
    { name: 'Entry', price: 299, features: ['Module 00 + Core Track', 'Global Community', 'Tools Starter'], color: 'from-slate-500 to-slate-600' },
    { name: 'Core', price: 499, features: ['Full Curriculum', 'Global Live Sessions', 'Code Reviews'], color: 'from-cyan-500 to-violet-500', recommended: true },
    { name: 'Pro', price: 749, features: ['Advanced Orchestration', 'Founder Network', 'Launch Playbooks'], color: 'from-violet-500 to-fuchsia-500' },
  ]
};

// TEAM STRUCTURE - TREE ROOT PROTOCOL v4.0
const TEAM_STRUCTURE = {
  root: { name: 'Nicolae Fratila', role: 'Founder/CEO', equity: 80, animation: 'MAXIMUM' },
  leftBranch: { name: 'Kevin Obeegadoo', role: 'Strategic Advisor', equity: 5, animation: 'MEDIUM' },
  rightBranch: { name: 'Investor Pool', role: 'Seed + Series A', equity: 15, animation: 'STANDARD' },
  orchestrator: { name: 'APEX OS Orchestrator', role: 'AI Command Center', stats: { uptime: '99.99%', tasks: '14,200+', agents: 36, latency: '<100ms' } },
  departments: [
    { name: 'Lead Generation', icon: Target, agents: 4 },
    { name: 'Marketing', icon: Globe, agents: 5 },
    { name: 'Sales', icon: DollarSign, agents: 3 },
    { name: 'B2B Partners', icon: Building2, agents: 2 },
    { name: 'Community', icon: Users, agents: 4 },
    { name: 'Curriculum', icon: BookOpen, agents: 6 },
    { name: 'Product', icon: Lightbulb, agents: 5 },
    { name: 'Platform', icon: Cpu, agents: 4 },
    { name: 'Data/Analytics', icon: BarChart3, agents: 3 },
    { name: 'Support', icon: Shield, agents: 4 },
    { name: 'Infrastructure', icon: Database, agents: 6 },
    { name: 'Security', icon: Lock, agents: 4 },
    { name: 'Compliance', icon: CheckCircle2, agents: 2 },
    { name: 'Finance', icon: DollarSign, agents: 3 },
    { name: 'Legal', icon: Briefcase, agents: 2 },
  ]
};

// Import BookOpen icon
import { BookOpen } from 'lucide-react';

// RISK MATRIX
const RISKS = [
  { category: 'Technical', risk: 'AI Tool Obsolescence', probability: 'High', impact: 'Medium', mitigation: 'Curriculum updates quarterly, focus on principles not tools' },
  { category: 'Market', risk: 'Low Lead Conversion', probability: 'Medium', impact: 'High', mitigation: 'A/B test pricing, payment plans, extended trials' },
  { category: 'Competitive', risk: 'Curriculum Copying', probability: 'High', impact: 'Medium', mitigation: 'Continuous innovation, community network effects' },
  { category: 'Operational', risk: 'Team Scaling', probability: 'Low', impact: 'Medium', mitigation: 'AI-first operations, automated workflows' },
];

// HYPERLOOP PORTFOLIO (Hypothetical)
const HYPERLOOP_PORTFOLIO = [
  { name: 'AutoDocs AI', sector: 'Legal Tech', valuation: 2500000, equity: 15, potential: '10x' },
  { name: 'CodeSprint Pro', sector: 'Dev Tools', valuation: 1800000, equity: 15, potential: '8x' },
  { name: 'MediSync', sector: 'Health Tech', valuation: 3200000, equity: 15, potential: '12x' },
  { name: 'FinFlow', sector: 'Fintech', valuation: 2100000, equity: 15, potential: '9x' },
  { name: 'EduBotX', sector: 'EdTech', valuation: 1500000, equity: 15, potential: '7x' },
  { name: 'CloudSync', sector: 'SaaS', valuation: 2800000, equity: 15, potential: '11x' },
];

// MILESTONES
const MILESTONES = [
  { phase: 'Early Traction', month: 'M1-M3', status: 'In Progress', progress: 65 },
  { phase: 'Product-Market Fit', month: 'M4-M6', status: 'In Progress', progress: 35 },
  { phase: 'Cash Flow Positive', month: 'M7-M12', status: 'Planned', progress: 0 },
  { phase: 'Series A Ready', month: 'M13-M18', status: 'Planned', progress: 0 },
];

// USE OF FUNDS
const USE_OF_FUNDS = [
  { category: 'Accelerator Build', amount: 480000, percentage: 40, color: 'cyan' },
  { category: 'Platform Development', amount: 360000, percentage: 30, color: 'violet' },
  { category: 'Team Expansion', amount: 240000, percentage: 20, color: 'emerald' },
  { category: 'Operations', amount: 120000, percentage: 10, color: 'amber' },
];

export const ShowMeTheMoneyFix4Page: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('executive');
  const [pricingRegion, setPricingRegion] = useState<'emerging' | 'west'>('emerging');
  const [financialAssumptions, setFinancialAssumptions] = useState({
    conversionRate: 2.0,
    arpu: 162,
    churn: 4.5,
    marketing: 9500,
  });

  const maxMrr = Math.max(...PROJECTIONS.map(p => p.mrr), 1);

  // Recalculate projections based on assumptions
  const dynamicProjections = useMemo(() => {
    let users = 50;
    let cumulativeRevenue = 0;
    return PROJECTIONS.map((p, idx) => {
      const newUsers = Math.round((32000 * (financialAssumptions.conversionRate / 100) / 6) * (1 + idx * 0.05));
      const churned = Math.round(users * (financialAssumptions.churn / 100));
      users = users + newUsers - churned;
      const mrr = users * financialAssumptions.arpu;
      cumulativeRevenue += mrr;
      return {
        ...p,
        users,
        mrr,
        cumulativeRevenue,
      };
    });
  }, [financialAssumptions]);

  return (
    <main className="relative z-10 min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
      
      {/* Header */}
      <header className="relative px-4 sm:px-6 pt-8 pb-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-500/30 mb-6">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Neural_Venture_Protocol_v4.0</span>
              <span className="text-white/40 text-xs">|</span>
              <span className="text-white/60 text-xs">FULL_WIRE_ENGAGED</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase italic tracking-tighter mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-emerald-400">
                Show Me The Fix 4
              </span>
            </h1>
            
            <p className="text-white/60 text-sm uppercase tracking-[0.3em] font-bold mb-8">
              Accelerator-First // 15% Equity Model // Conservative Growth
            </p>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
              {[
                { label: 'Year 1 Revenue', value: `$${(YEAR1_REVENUE / 1000).toFixed(0)}K`, color: 'cyan' },
                { label: 'Target Users (M18)', value: MONTH18_USERS.toLocaleString(), color: 'violet' },
                { label: 'Month 12 MRR', value: `$${(MONTH12_MRR / 1000).toFixed(0)}K`, color: 'emerald' },
                { label: 'LTV:CAC Ratio', value: '6:1 / 9:1', color: 'amber' },
              ].map((metric, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md"
                >
                  <div className={`text-2xl font-black text-${metric.color}-400`}>{metric.value}</div>
                  <div className="text-[10px] text-white/40 mt-1 uppercase font-bold tracking-widest">{metric.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="sticky top-0 z-50 px-4 sm:px-6 py-4 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg shadow-cyan-500/20'
                    : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Tab Content */}
      <div className="px-4 sm:px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {/* EXECUTIVE TAB */}
            {activeTab === 'executive' && (
              <motion.section
                key="executive"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-16"
              >
                {/* HYPERLOOP ACCELERATOR HERO */}
                <div className="relative p-8 sm:p-12 rounded-[2.5rem] border border-violet-500/30 bg-gradient-to-br from-violet-500/10 via-cyan-500/5 to-emerald-500/10 overflow-hidden">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/20 rounded-full blur-[150px]" />
                  <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-[150px]" />
                  
                  <div className="relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/20 border border-violet-500/30 mb-6">
                      <Rocket className="w-4 h-4 text-violet-400" />
                      <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">Hyperloop Accelerator</span>
                    </div>
                    
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase italic tracking-tighter mb-4">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400">
                        30-Day Acceleration
                      </span>
                    </h2>
                    
                    <p className="text-white/60 text-lg max-w-3xl mx-auto mb-8">
                      Converting InfoAcademy's 32,000 builders into AI-orchestrated startup founders through intensive 30-day sprints with 15% equity model
                    </p>

                    {/* 4-Phase Pipeline */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                      {[
                        { stage: 'Selective Intake', icon: Target, color: 'cyan', desc: 'Top 1% from academy' },
                        { stage: '30-Day Sprint', icon: Zap, color: 'violet', desc: 'Hyper-intensive build' },
                        { stage: 'GTM & Demo Day', icon: Rocket, color: 'amber', desc: 'Validate & fundraise' },
                        { stage: 'Post-Launch', icon: Shield, color: 'emerald', desc: '2-week hyper-care' },
                      ].map((phase, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur"
                        >
                          <phase.icon className={`w-8 h-8 text-${phase.color}-400 mx-auto mb-2`} />
                          <div className="text-sm font-bold text-white">{phase.stage}</div>
                          <div className="text-[10px] text-white/40 uppercase tracking-wider">{phase.desc}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* INFOACADEMY ADVANTAGE */}
                <div className="p-8 sm:p-12 rounded-[2.5rem] border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-transparent">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                      <Lightbulb className="w-7 h-7 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">InfoAcademy Core Advantage</h3>
                      <p className="text-cyan-400 text-xs uppercase tracking-widest">Oldest IT Academy in Romania</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Email List', value: '32,000', icon: Users },
                      { label: 'Completion Rate', value: '68%', icon: CheckCircle2 },
                      { label: 'NPS Score', value: '72', icon: Star },
                      { label: 'Countries', value: '12', icon: Globe },
                    ].map((stat, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                        <stat.icon className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                        <div className="text-2xl font-black text-white">{stat.value}</div>
                        <div className="text-[10px] text-white/40 uppercase tracking-widest">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* MINI DASHBOARD */}
                <div className="p-8 rounded-[2.5rem] border border-white/10 bg-white/[0.02]">
                  <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest">Executive Dashboard</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Year 1 Revenue', value: `$${(YEAR1_REVENUE / 1000).toFixed(0)}K`, sub: 'Conservative', color: 'cyan' },
                      { label: 'Month 12 MRR', value: `$${(MONTH12_MRR / 1000).toFixed(0)}K`, sub: 'Projected', color: 'emerald' },
                      { label: 'Users (M18)', value: MONTH18_USERS.toLocaleString(), sub: 'Target', color: 'violet' },
                      { label: 'LTV:CAC', value: '6:1 / 9:1', sub: 'Conservative/Base', color: 'amber' },
                    ].map((metric, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center">
                        <div className={`text-2xl font-black text-${metric.color}-400 mb-1`}>{metric.value}</div>
                        <div className="text-xs text-white/60 uppercase font-bold">{metric.label}</div>
                        <div className="text-[10px] text-white/30 mt-1">{metric.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SHADOW BRANDING */}
                <div className="p-8 sm:p-12 rounded-[2.5rem] border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-transparent">
                  <div className="flex items-center gap-4 mb-8">
                    <Shield className="w-8 h-8 text-cyan-400" />
                    <div>
                      <h3 className="text-2xl font-bold text-white">Shadow Branding Protocol</h3>
                      <p className="text-cyan-400 text-xs uppercase tracking-widest">Brand_Protection_Systems_Active</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-5">
                      <h4 className="text-white font-bold flex items-center gap-3 uppercase text-sm tracking-widest">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        Premium Tier (Global Brand)
                      </h4>
                      <div className="p-6 rounded-3xl bg-black/40 border border-white/10">
                        <div className="text-lg font-bold text-white mb-2">APEX OS Academy</div>
                        <div className="text-[10px] text-white/40 mb-4 uppercase font-bold tracking-widest">Target: USA, UK, Western Europe</div>
                        <ul className="text-xs text-white/70 space-y-3 font-mono uppercase font-bold">
                          <li className="flex items-center gap-2"><div className="w-1 h-1 bg-cyan-400 rounded-full" /> $299–$749/mo (Premium Ladder)</li>
                          <li className="flex items-center gap-2"><div className="w-1 h-1 bg-cyan-400 rounded-full" /> Global Job Board Certification</li>
                          <li className="flex items-center gap-2"><div className="w-1 h-1 bg-cyan-400 rounded-full" /> Direct Strategic Consultation</li>
                        </ul>
                      </div>
                      <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">* GOLD STANDARD. NEVER DISCOUNTED.</p>
                    </div>

                    <div className="space-y-5">
                      <h4 className="text-orange-400 font-bold flex items-center gap-3 uppercase text-sm tracking-widest">
                        <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                        Beta Tier (Shadow Brand)
                      </h4>
                      <div className="p-6 rounded-3xl bg-black/40 border border-orange-500/20">
                        <div className="text-lg font-bold text-orange-400 mb-2">Builder Lab / CodeSprint</div>
                        <div className="text-[10px] text-white/40 mb-4 uppercase font-bold tracking-widest">Target: Romania, India, LATAM</div>
                        <ul className="text-xs text-white/70 space-y-3 font-mono uppercase font-bold">
                          <li className="flex items-center gap-2"><div className="w-1 h-1 bg-orange-400 rounded-full" /> $89–$249/mo (PPP Adjusted)</li>
                          <li className="flex items-center gap-2"><div className="w-1 h-1 bg-orange-400 rounded-full" /> Identical Curriculum, Hidden Origin</li>
                          <li className="flex items-center gap-2"><div className="w-1 h-1 bg-orange-400 rounded-full" /> Community-Led Sovereign Support</li>
                        </ul>
                      </div>
                      <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">* MASSIVE VOLUME. BRAND INTEGRITY PRESERVED.</p>
                    </div>
                  </div>
                </div>

                {/* VALUE PROPOSITION GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {VALUE_PROPS.map((prop, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-6 rounded-3xl border border-white/10 bg-white/[0.02] hover:border-cyan-500/30 transition-all hover:bg-white/[0.04]"
                    >
                      <div className={`inline-flex w-12 h-12 rounded-2xl bg-${prop.color}-500/20 border border-${prop.color}-500/30 items-center justify-center mb-5`}>
                        <prop.icon className={`w-6 h-6 text-${prop.color}-400`} />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{prop.title}</h3>
                      <p className="text-white/50 text-[11px] leading-relaxed uppercase font-bold tracking-tight">{prop.desc}</p>
                    </motion.div>
                  ))}
                </div>

                {/* STRATEGIC POSITIONING MATRIX */}
                <div className="p-6 sm:p-10 rounded-[2.5rem] border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent">
                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    <div className="inline-flex w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 items-center justify-center shrink-0 shadow-2xl shadow-amber-500/20">
                      <Lightbulb className="w-7 h-7 text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl sm:text-3xl font-bold text-white mb-4">Strategic Positioning Matrix</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-6">
                        <div className="space-y-4">
                          <h4 className="text-rose-400 font-bold mb-2 text-sm uppercase tracking-widest border-b border-rose-500/20 pb-2">❌ DEPRECATED_STRATEGY</h4>
                          <ul className="text-white/60 text-xs space-y-3 font-mono uppercase font-bold">
                            <li className="flex items-start gap-2"><span className="text-rose-500">✕</span> Only 2 tiers: $200/mo or $997 lifetime</li>
                            <li className="flex items-start gap-2"><span className="text-rose-500">✕</span> Zero lead-capture for 32K funnel</li>
                            <li className="flex items-start gap-2"><span className="text-rose-500">✕</span> No middle ground for validation</li>
                            <li className="flex items-start gap-2"><span className="text-rose-500">✕</span> Missing B2B/Team revenue capture</li>
                          </ul>
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-emerald-400 font-bold mb-2 text-sm uppercase tracking-widest border-b border-emerald-500/20 pb-2">✅ SOVEREIGN_STRATEGY_2026</h4>
                          <ul className="text-white/60 text-xs space-y-3 font-mono uppercase font-bold">
                            <li className="flex items-start gap-2"><span className="text-emerald-500">✓</span> 5-Tier regional revenue ladder</li>
                            <li className="flex items-start gap-2"><span className="text-emerald-500">✓</span> $89 shadow-brand entry protocol</li>
                            <li className="flex items-start gap-2"><span className="text-emerald-500">✓</span> $1299+ Enterprise/Team B2B scale</li>
                            <li className="flex items-start gap-2"><span className="text-emerald-500">✓</span> High-ticket equity accelerator backend</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* KEY ASSUMPTIONS */}
                <div className="p-6 sm:p-8 rounded-[2rem] border border-white/10 bg-white/[0.02] backdrop-blur-xl">
                  <h3 className="text-sm font-bold text-white/40 mb-6 uppercase tracking-[0.3em] text-center">Key Business Assumptions</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                    {[
                      { label: 'Market Pool', value: '32,000 Leads', icon: Users },
                      { label: 'Target Conv.', value: '1.2% Target', icon: Target },
                      { label: 'Blended ARPU', value: '$162', icon: DollarSign },
                      { label: 'Retention', value: '30% Ret.', icon: Shield },
                      { label: 'CAC (Blended)', value: '$100 avg.', icon: TrendingUp },
                      { label: 'LTV (Year 1)', value: '$1,200', icon: Award },
                    ].map((assumption, idx) => (
                      <div key={idx} className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-cyan-500/20 transition-all">
                        <assumption.icon className="w-5 h-5 text-cyan-400 mb-2" />
                        <div className="text-white font-bold text-xs mb-1">{assumption.value}</div>
                        <div className="text-[8px] text-white/30 uppercase font-bold tracking-widest">{assumption.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.section>
            )}

            {/* ACCELERATOR ENGINE TAB */}
            {activeTab === 'accelerator' && (
              <motion.section
                key="accelerator"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="text-center">
                  <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tighter mb-4">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
                      Hyperloop Multiplier Engine
                    </span>
                  </h2>
                  <p className="text-white/60 text-sm uppercase tracking-widest">
                    15% Equity Model // Portfolio Multiplier // Hypothetical Scenarios
                  </p>
                </div>

                {/* Portfolio Value Summary */}
                <div className="p-8 rounded-[2.5rem] border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-transparent">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div>
                      <div className="text-3xl font-black text-cyan-400">10</div>
                      <div className="text-[10px] text-white/40 uppercase tracking-widest">Portfolio Companies</div>
                    </div>
                    <div>
                      <div className="text-3xl font-black text-violet-400">15%</div>
                      <div className="text-[10px] text-white/40 uppercase tracking-widest">Avg Equity Stake</div>
                    </div>
                    <div>
                      <div className="text-3xl font-black text-emerald-400">$18.9M</div>
                      <div className="text-[10px] text-white/40 uppercase tracking-widest">Combined Valuation</div>
                    </div>
                    <div>
                      <div className="text-3xl font-black text-amber-400">9.3x</div>
                      <div className="text-[10px] text-white/40 uppercase tracking-widest">Avg Multiple</div>
                    </div>
                  </div>
                </div>

                {/* Hypothetical Disclaimer */}
                <div className="p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-amber-400 font-bold text-sm uppercase tracking-widest mb-1">Hypothetical Scenarios</div>
                      <p className="text-sm text-white/60">
                        These projections represent potential outcomes based on market analysis. No portfolio companies currently exist. This demonstrates the 15% equity model's potential returns across diverse sectors.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Portfolio Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {HYPERLOOP_PORTFOLIO.map((company, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-cyan-500/30 transition-all"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">{company.name}</h3>
                        <span className="text-[10px] text-white/40 uppercase">{company.sector}</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-white/40">Valuation</span>
                          <span className="text-cyan-400 font-bold">${(company.valuation / 1000000).toFixed(1)}M</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/40">Equity</span>
                          <span className="text-violet-400 font-bold">{company.equity}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/40">Potential</span>
                          <span className="text-emerald-400 font-bold">{company.potential}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* ROI Modules */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-8 rounded-[2.5rem] border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-transparent">
                    <div className="flex items-center gap-3 mb-4">
                      <Briefcase className="w-8 h-8 text-cyan-400" />
                      <div>
                        <h3 className="text-xl font-bold text-white">Investor ROI</h3>
                        <p className="text-cyan-400 text-xs uppercase tracking-widest">Seed Round Returns</p>
                      </div>
                    </div>
                    <p className="text-white/60 text-sm mb-4">
                      Projected returns for seed investors based on $1.2M raise at $6.8M pre-money valuation.
                    </p>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/40">Conservative (6:1)</span>
                        <span className="text-emerald-400 font-bold">2.5x MOIC</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/40">Base (9:1)</span>
                        <span className="text-cyan-400 font-bold">5.8x MOIC</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 rounded-[2.5rem] border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-transparent">
                    <div className="flex items-center gap-3 mb-4">
                      <Layers className="w-8 h-8 text-violet-400" />
                      <div>
                        <h3 className="text-xl font-bold text-white">Accelerator ROI</h3>
                        <p className="text-violet-400 text-xs uppercase tracking-widest">Cohort Returns</p>
                      </div>
                    </div>
                    <p className="text-white/60 text-sm mb-4">
                      Returns from accelerator cohorts through 15% equity stakes in portfolio companies.
                    </p>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/40">Conservative</span>
                        <span className="text-emerald-400 font-bold">7x Avg Multiple</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/40">Base</span>
                        <span className="text-violet-400 font-bold">9.3x Avg Multiple</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}

            {/* DASHBOARD TAB */}
            {activeTab === 'dashboard' && (
              <motion.section
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="text-center">
                  <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tighter mb-4">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">
                      Executive Dashboard
                    </span>
                  </h2>
                  <p className="text-white/60 text-sm uppercase tracking-widest">
                    Real-Time Metrics // All In Progress
                  </p>
                </div>

                {/* Top Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Revenue', value: `$${(YEAR1_REVENUE / 1000).toFixed(0)}K`, color: 'cyan' },
                    { label: 'Current MRR', value: `$${(MONTH12_MRR / 1000).toFixed(0)}K`, color: 'emerald' },
                    { label: 'Total Customers', value: MONTH18_USERS.toLocaleString(), color: 'violet' },
                    { label: 'Cash Runway', value: '18 Months', color: 'amber' },
                  ].map((stat, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] text-center"
                    >
                      <div className={`text-3xl font-black text-${stat.color}-400 mb-1`}>{stat.value}</div>
                      <div className="text-xs text-white/60 uppercase font-bold">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Financial Trajectory Chart */}
                <div className="p-8 rounded-[2.5rem] border border-white/10 bg-black/40 backdrop-blur-md">
                  <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest">Financial Trajectory</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={PROJECTIONS} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                        <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                        <Tooltip
                          contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px' }}
                          formatter={(value: number) => [`$${(value / 1000).toFixed(0)}K`, 'MRR']}
                        />
                        <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" label={{ value: 'Break-even', fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                        <Area type="monotone" dataKey="mrr" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#mrrGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Milestones - All In Progress */}
                <div className="p-8 rounded-[2.5rem] border border-white/10 bg-white/[0.02]">
                  <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest">Milestones — All In Progress</h3>
                  <div className="space-y-4">
                    {MILESTONES.map((milestone, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-black/40 border border-white/5">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="text-white font-bold">{milestone.phase}</div>
                            <div className="text-[10px] text-white/40 uppercase tracking-widest">{milestone.month}</div>
                          </div>
                          <div className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30">
                            <span className="text-cyan-400 text-xs font-bold uppercase">{milestone.status}</span>
                          </div>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full" style={{ width: `${milestone.progress}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.section>
            )}

            {/* FINANCIAL BRAIN TAB */}
            {activeTab === 'financial' && (
              <motion.section
                key="financial"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="text-center">
                  <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tighter mb-4">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">
                      Financial Brain
                    </span>
                  </h2>
                  <p className="text-white/60 text-sm uppercase tracking-widest">
                    Interactive 18-Month Projections
                  </p>
                </div>

                {/* Interactive Sliders */}
                <div className="p-8 rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { id: 'conversionRate', label: 'Conversion Rate', value: financialAssumptions.conversionRate, min: 0.5, max: 5.0, step: 0.1, format: (v: number) => `${v}%`, color: 'cyan' },
                      { id: 'arpu', label: 'Blended ARPU', value: financialAssumptions.arpu, min: 100, max: 400, step: 10, format: (v: number) => `$${v}`, color: 'emerald' },
                      { id: 'churn', label: 'Monthly Churn', value: financialAssumptions.churn, min: 1.0, max: 10.0, step: 0.5, format: (v: number) => `${v}%`, color: 'amber' },
                      { id: 'marketing', label: 'Marketing/mo', value: financialAssumptions.marketing, min: 5000, max: 40000, step: 1000, format: (v: number) => `$${(v / 1000).toFixed(0)}K`, color: 'violet' },
                    ].map((slider) => (
                      <div key={slider.id} className="p-4 rounded-2xl bg-black/40 border border-white/5">
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`w-2 h-2 rounded-full bg-${slider.color}-400`} />
                          <span className="text-xs font-bold text-white/60 uppercase tracking-wider">{slider.label}</span>
                        </div>
                        <div className="text-2xl font-bold text-white mb-3">{slider.format(slider.value)}</div>
                        <input
                          type="range"
                          min={slider.min}
                          max={slider.max}
                          step={slider.step}
                          value={slider.value}
                          onChange={(e) => setFinancialAssumptions(prev => ({ ...prev, [slider.id]: parseFloat(e.target.value) }))}
                          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-white/30 mt-2">
                          <span>{slider.format(slider.min)}</span>
                          <span>{slider.format(slider.max)}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setFinancialAssumptions({ conversionRate: 2.0, arpu: 162, churn: 4.5, marketing: 9500 })}
                    className="mt-6 flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white/60 mx-auto"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset to Conservative
                  </button>
                </div>

                {/* Dynamic Results */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'MRR (M18)', value: `$${(dynamicProjections[17]?.mrr / 1000).toFixed(0)}K`, color: 'cyan' },
                    { label: 'Customers', value: dynamicProjections[17]?.users.toLocaleString(), color: 'emerald' },
                    { label: 'Revenue', value: `$${(dynamicProjections[17]?.cumulativeRevenue / 1000000).toFixed(2)}M`, color: 'violet' },
                    { label: 'Cash', value: `$1.2M`, color: 'amber' },
                  ].map((stat, idx) => (
                    <div key={idx} className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] text-center">
                      <div className={`text-3xl font-black text-${stat.color}-400 mb-1`}>{stat.value}</div>
                      <div className="text-xs text-white/60 uppercase font-bold">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Dynamic Chart */}
                <div className="p-8 rounded-[2.5rem] border border-white/10 bg-black/40 backdrop-blur-md">
                  <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest">Dynamic Projection</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dynamicProjections} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="dynamicGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                        <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                        <Tooltip
                          contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px' }}
                          formatter={(value: number) => [`$${(value / 1000).toFixed(0)}K`, 'MRR']}
                        />
                        <Area type="monotone" dataKey="mrr" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#dynamicGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.section>
            )}

            {/* PRICING TAB */}
            {activeTab === 'pricing' && (
              <motion.section
                key="pricing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="text-center">
                  <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tighter mb-4">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                      Pricing Strategy
                    </span>
                  </h2>
                  <p className="text-white/60 text-sm uppercase tracking-widest">
                    Dual Market // PPP Optimized // A/B Strategy
                  </p>
                </div>

                {/* Region Toggle */}
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setPricingRegion('emerging')}
                    className={`px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${
                      pricingRegion === 'emerging'
                        ? 'bg-orange-500 text-white'
                        : 'bg-white/5 text-white/40 hover:bg-white/10'
                    }`}
                  >
                    Emerging Markets
                  </button>
                  <button
                    onClick={() => setPricingRegion('west')}
                    className={`px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${
                      pricingRegion === 'west'
                        ? 'bg-cyan-500 text-white'
                        : 'bg-white/5 text-white/40 hover:bg-white/10'
                    }`}
                  >
                    West (US/UK/EU)
                  </button>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {PRICING_TIERS[pricingRegion].map((tier, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`p-8 rounded-3xl border ${tier.recommended ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 bg-white/[0.02]'} relative`}
                    >
                      {tier.recommended && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest">
                          Recommended
                        </div>
                      )}
                      <div className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-bold bg-gradient-to-r ${tier.color} text-white mb-6 uppercase tracking-widest`}>
                        {tier.name}
                      </div>
                      <div className="text-4xl font-black text-white mb-6">
                        ${tier.price}
                        <span className="text-lg text-white/40">/mo</span>
                      </div>
                      <ul className="space-y-3">
                        {tier.features.map((feature, fidx) => (
                          <li key={fidx} className="flex items-center gap-2 text-sm text-white/60">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>

                {/* A/B Strategy */}
                <div className="p-8 rounded-[2.5rem] border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-transparent">
                  <h3 className="text-xl font-bold text-white mb-6">A/B Testing Strategy</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                      <div className="text-cyan-400 font-bold text-sm mb-2">M2 Gate</div>
                      <p className="text-white/60 text-xs">Test PPP entry pricing vs premium positioning</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                      <div className="text-violet-400 font-bold text-sm mb-2">M4 Gate</div>
                      <p className="text-white/60 text-xs">Evaluate conversion lift vs ARPU optimization</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                      <div className="text-emerald-400 font-bold text-sm mb-2">M6 Gate</div>
                      <p className="text-white/60 text-xs">Finalize pricing ladder for scale phase</p>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}

            {/* GTM TAB */}
            {activeTab === 'gtm' && (
              <motion.section
                key="gtm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="text-center">
                  <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tighter mb-4">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                      Go-To-Market Strategy
                    </span>
                  </h2>
                  <p className="text-white/60 text-sm uppercase tracking-widest">
                    Phased Expansion // InfoAcademy Advantage
                  </p>
                </div>

                {/* Phase 1: Romania */}
                <div className="p-8 rounded-[2.5rem] border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-transparent">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white">Phase 1: Romania</h3>
                      <p className="text-cyan-400 text-xs uppercase tracking-widest">M1–M6 // Foundation</p>
                    </div>
                    <div className="px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/30">
                      <span className="text-cyan-400 text-xs font-bold uppercase">In Progress</span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full" style={{ width: '65%' }} />
                  </div>
                  <ul className="space-y-2 text-sm text-white/60">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Leverage 32K InfoAcademy email list</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> $89 entry pricing (PPP adjusted)</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Community-led support model</li>
                  </ul>
                </div>

                {/* Phase 2: India */}
                <div className="p-8 rounded-[2.5rem] border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-transparent">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white">Phase 2: India</h3>
                      <p className="text-violet-400 text-xs uppercase tracking-widest">M7–M12 // Scale</p>
                    </div>
                    <div className="px-4 py-2 rounded-full bg-violet-500/20 border border-violet-500/30">
                      <span className="text-violet-400 text-xs font-bold uppercase">Planned</span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full" style={{ width: '0%' }} />
                  </div>
                  <ul className="space-y-2 text-sm text-white/60">
                    <li className="flex items-center gap-2"><div className="w-4 h-4 rounded-full border border-white/20" /> Partner with local accelerators</li>
                    <li className="flex items-center gap-2"><div className="w-4 h-4 rounded-full border border-white/20" /> Regional live sessions</li>
                    <li className="flex items-center gap-2"><div className="w-4 h-4 rounded-full border border-white/20" /> Hindi curriculum localization</li>
                  </ul>
                </div>

                {/* Phase 3: West */}
                <div className="p-8 rounded-[2.5rem] border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-transparent">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white">Phase 3: West</h3>
                      <p className="text-emerald-400 text-xs uppercase tracking-widest">M13–M18 // Premium</p>
                    </div>
                    <div className="px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                      <span className="text-emerald-400 text-xs font-bold uppercase">Planned</span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" style={{ width: '0%' }} />
                  </div>
                  <ul className="space-y-2 text-sm text-white/60">
                    <li className="flex items-center gap-2"><div className="w-4 h-4 rounded-full border border-white/20" /> $299–$749 premium pricing</li>
                    <li className="flex items-center gap-2"><div className="w-4 h-4 rounded-full border border-white/20" /> Global job board certification</li>
                    <li className="flex items-center gap-2"><div className="w-4 h-4 rounded-full border border-white/20" /> Direct strategic consultation</li>
                  </ul>
                </div>
              </motion.section>
            )}

            {/* MARKET TAB */}
            {activeTab === 'market' && (
              <motion.section
                key="market"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="text-center">
                  <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tighter mb-4">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                      Market Landscape
                    </span>
                  </h2>
                  <p className="text-white/60 text-sm uppercase tracking-widest">
                    TAM/SAM/SOM Analysis // Competitive Positioning
                  </p>
                </div>

                {/* TAM/SAM/SOM */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: 'TAM', value: '$36.2B', desc: 'Global AI skills education + accelerator', color: 'cyan' },
                    { label: 'SAM', value: '$8.4B', desc: 'English + Romanian + EU markets', color: 'violet' },
                    { label: 'SOM', value: '$89M', desc: '32K leads at conservative conversion', color: 'emerald' },
                  ].map((market, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] text-center"
                    >
                      <div className={`text-4xl font-black text-${market.color}-400 mb-2`}>{market.value}</div>
                      <div className="text-lg font-bold text-white mb-2">{market.label}</div>
                      <div className="text-xs text-white/40 uppercase tracking-widest">{market.desc}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Quadrant */}
                <div className="p-8 rounded-[2.5rem] border border-white/10 bg-white/[0.02]">
                  <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest text-center">Competitive Quadrant</h3>
                  <div className="relative h-96">
                    {/* Y-axis label */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-white/40 uppercase tracking-widest">ARPU →</div>
                    
                    {/* X-axis label */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs text-white/40 uppercase tracking-widest">Scale →</div>
                    
                    {/* Quadrants */}
                    <div className="absolute inset-8 grid grid-cols-2 grid-rows-2 gap-2">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-center items-center">
                        <div className="text-sm font-bold text-white mb-1">AI Bootcamps</div>
                        <div className="text-[10px] text-white/40">High ARPU, Low Scale</div>
                      </div>
                      <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex flex-col justify-center items-center relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-4 h-4 rounded-full bg-cyan-400 animate-pulse" />
                        </div>
                        <div className="text-sm font-bold text-cyan-400 mb-1">APEX OS</div>
                        <div className="text-[10px] text-white/40">High ARPU, High Scale</div>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-center items-center">
                        <div className="text-sm font-bold text-white mb-1">Mass Courses</div>
                        <div className="text-[10px] text-white/40">Low ARPU, Low Scale</div>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-center items-center">
                        <div className="text-sm font-bold text-white mb-1">Traditional Accelerators</div>
                        <div className="text-[10px] text-white/40">Low ARPU, High Scale</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}

            {/* ECONOMICS TAB */}
            {activeTab === 'economics' && (
              <motion.section
                key="economics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="text-center">
                  <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tighter mb-4">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                      Unit Economics
                    </span>
                  </h2>
                  <p className="text-white/60 text-sm uppercase tracking-widest">
                    Explicit Labeling // Conservative vs Base
                  </p>
                </div>

                {/* LTV:CAC Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-8 rounded-[2.5rem] border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-transparent">
                    <div className="flex items-center gap-3 mb-4">
                      <Shield className="w-8 h-8 text-emerald-400" />
                      <div>
                        <h3 className="text-xl font-bold text-white">Conservative Case</h3>
                        <p className="text-emerald-400 text-xs uppercase tracking-widest">6:1 LTV:CAC</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/40">LTV (12-month)</span>
                        <span className="text-emerald-400 font-bold">$600</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/40">CAC (Blended)</span>
                        <span className="text-emerald-400 font-bold">$100</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/40">Payback Period</span>
                        <span className="text-emerald-400 font-bold">2 months</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 rounded-[2.5rem] border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-transparent">
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingUp className="w-8 h-8 text-cyan-400" />
                      <div>
                        <h3 className="text-xl font-bold text-white">Base Case</h3>
                        <p className="text-cyan-400 text-xs uppercase tracking-widest">9:1 LTV:CAC</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/40">LTV (12-month)</span>
                        <span className="text-cyan-400 font-bold">$900</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/40">CAC (Blended)</span>
                        <span className="text-cyan-400 font-bold">$100</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/40">Payback Period</span>
                        <span className="text-cyan-400 font-bold">1.3 months</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CAC by Phase */}
                <div className="p-8 rounded-[2.5rem] border border-white/10 bg-white/[0.02]">
                  <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest">CAC by Phase</h3>
                  <div className="space-y-4">
                    {[
                      { phase: 'M1-M6 (InfoAcademy)', cac: '$45', channel: 'Email list, organic' },
                      { phase: 'M7-M12 (Referral)', cac: '$85', channel: 'Word-of-mouth, community' },
                      { phase: 'M13-M18 (Paid)', cac: '$170', channel: 'Targeted ads, partnerships' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5">
                        <div>
                          <div className="text-white font-bold">{item.phase}</div>
                          <div className="text-[10px] text-white/40 uppercase tracking-widest">{item.channel}</div>
                        </div>
                        <div className="text-2xl font-black text-cyan-400">{item.cac}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.section>
            )}

            {/* RETURNS TAB */}
            {activeTab === 'returns' && (
              <motion.section
                key="returns"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="text-center">
                  <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tighter mb-4">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                      Investment Returns
                    </span>
                  </h2>
                  <p className="text-white/60 text-sm uppercase tracking-widest">
                    Hypothetical Scenarios // Conservative / Base / Upside
                  </p>
                </div>

                {/* Hypothetical Disclaimer */}
                <div className="p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-amber-400 font-bold text-sm uppercase tracking-widest mb-1">Hypothetical Scenarios</div>
                      <p className="text-sm text-white/60">
                        These projections are based on market analysis and comparable exits. Actual returns may vary significantly.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Scenarios */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Conservative', exit: '$15M', moic: '2.5x', irr: '38%', color: 'emerald' },
                    { label: 'Base', exit: '$35M', moic: '5.8x', irr: '68%', color: 'cyan' },
                    { label: 'Upside', exit: '$75M', moic: '12.5x', irr: '98%', color: 'violet' },
                  ].map((scenario, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`p-8 rounded-3xl border border-${scenario.color}-500/30 bg-gradient-to-br from-${scenario.color}-500/10 to-transparent`}
                    >
                      <div className={`text-${scenario.color}-400 text-xs uppercase tracking-widest mb-4`}>{scenario.label}</div>
                      <div className="text-4xl font-black text-white mb-2">{scenario.exit}</div>
                      <div className="text-sm text-white/40 mb-4">Year 5 Exit</div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/40">MOIC</span>
                          <span className={`text-${scenario.color}-400 font-bold`}>{scenario.moic}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/40">IRR</span>
                          <span className={`text-${scenario.color}-400 font-bold`}>{scenario.irr}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* RISK TAB */}
            {activeTab === 'risk' && (
              <motion.section
                key="risk"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="text-center">
                  <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tighter mb-4">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400">
                      Risk Assessment
                    </span>
                  </h2>
                  <p className="text-white/60 text-sm uppercase tracking-widest">
                    Identified // Mitigated // Monitored
                  </p>
                </div>

                {/* Risk Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {RISKS.map((risk, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">{risk.category}</div>
                          <h3 className="text-lg font-bold text-white">{risk.risk}</h3>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold ${risk.impact === 'High' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
                          {risk.probability} Prob
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                        <div className="text-[10px] text-emerald-400 uppercase tracking-widest mb-1">Mitigation</div>
                        <p className="text-sm text-white/60">{risk.mitigation}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Visual Risk Map */}
                <div className="p-8 rounded-[2.5rem] border border-white/10 bg-white/[0.02]">
                  <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest text-center">Risk Visualization</h3>
                  <div className="relative h-64 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 rounded-full border border-white/10 flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full border border-white/10 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                            <Shield className="w-8 h-8 text-cyan-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                    {RISKS.map((risk, idx) => (
                      <div
                        key={idx}
                        className="absolute px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white"
                        style={{
                          top: `${20 + idx * 15}%`,
                          left: idx % 2 === 0 ? '10%' : '70%',
                        }}
                      >
                        {risk.risk}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.section>
            )}

            {/* ROI: INVESTOR TAB */}
            {activeTab === 'roi-investor' && (
              <motion.section
                key="roi-investor"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="text-center">
                  <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tighter mb-4">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                      Investor ROI
                    </span>
                  </h2>
                  <p className="text-white/60 text-sm uppercase tracking-widest">
                    Seed Round Returns // Conservative vs Base
                  </p>
                </div>

                <div className="p-8 rounded-[2.5rem] border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-transparent">
                  <div className="flex items-center gap-4 mb-6">
                    <Briefcase className="w-8 h-8 text-cyan-400" />
                    <div>
                      <h3 className="text-xl font-bold text-white">Seed Investment Scenario</h3>
                      <p className="text-cyan-400 text-xs uppercase tracking-widest">$1.2M at $6.8M Pre-Money</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-black/40 border border-white/5">
                      <div className="text-emerald-400 text-xs uppercase tracking-widest mb-2">Conservative (6:1)</div>
                      <div className="text-3xl font-black text-white mb-1">2.5x MOIC</div>
                      <div className="text-sm text-white/40">$3.0M return on $1.2M</div>
                    </div>
                    <div className="p-6 rounded-2xl bg-black/40 border border-white/5">
                      <div className="text-cyan-400 text-xs uppercase tracking-widest mb-2">Base (9:1)</div>
                      <div className="text-3xl font-black text-white mb-1">5.8x MOIC</div>
                      <div className="text-sm text-white/40">$7.0M return on $1.2M</div>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}

            {/* ROI: ACCELERATOR TAB */}
            {activeTab === 'roi-accelerator' && (
              <motion.section
                key="roi-accelerator"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="text-center">
                  <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tighter mb-4">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                      Accelerator ROI
                    </span>
                  </h2>
                  <p className="text-white/60 text-sm uppercase tracking-widest">
                    Cohort Returns // 15% Equity Model
                  </p>
                </div>

                <div className="p-8 rounded-[2.5rem] border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-transparent">
                  <div className="flex items-center gap-4 mb-6">
                    <Layers className="w-8 h-8 text-violet-400" />
                    <div>
                      <h3 className="text-xl font-bold text-white">Accelerator Cohort Economics</h3>
                      <p className="text-violet-400 text-xs uppercase tracking-widest">Portfolio Company Returns</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-black/40 border border-white/5">
                      <div className="text-emerald-400 text-xs uppercase tracking-widest mb-2">Conservative</div>
                      <div className="text-3xl font-black text-white mb-1">7x Multiple</div>
                      <div className="text-sm text-white/40">Avg portfolio exit</div>
                    </div>
                    <div className="p-6 rounded-2xl bg-black/40 border border-white/5">
                      <div className="text-violet-400 text-xs uppercase tracking-widest mb-2">Base</div>
                      <div className="text-3xl font-black text-white mb-1">9.3x Multiple</div>
                      <div className="text-sm text-white/40">Avg portfolio exit</div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-white/60">
                        These are hypothetical portfolio returns. Actual results depend on cohort selection, market conditions, and exit timing.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}

            {/* FUNDRAISING TAB */}
            {activeTab === 'fundraising' && (
              <motion.section
                key="fundraising"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="text-center">
                  <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tighter mb-4">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                      The Ask
                    </span>
                  </h2>
                  <p className="text-white/60 text-sm uppercase tracking-widest">
                    Fundraising Round // Use of Funds
                  </p>
                </div>

                {/* Funding Details */}
                <div className="p-8 sm:p-12 rounded-[3rem] border-2 border-violet-500/40 bg-gradient-to-br from-violet-500/20 via-cyan-500/10 to-emerald-500/20 relative overflow-hidden">
                  <div className="relative z-10 text-center">
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-violet-500 to-emerald-500 text-white text-xl font-black uppercase tracking-widest mb-8 shadow-2xl">
                      $1.2M Seed Round
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8">
                      <div className="p-6 rounded-2xl bg-black/40 border border-white/10">
                        <div className="text-3xl font-black text-white mb-1">$6.8M</div>
                        <div className="text-xs text-white/40 uppercase tracking-widest">Pre-Money</div>
                      </div>
                      <div className="p-6 rounded-2xl bg-black/40 border border-white/10">
                        <div className="text-3xl font-black text-white mb-1">15%</div>
                        <div className="text-xs text-white/40 uppercase tracking-widest">Equity</div>
                      </div>
                      <div className="p-6 rounded-2xl bg-black/40 border border-white/10">
                        <div className="text-3xl font-black text-white mb-1">Q1 2026</div>
                        <div className="text-xs text-white/40 uppercase tracking-widest">Close Target</div>
                      </div>
                    </div>

                    <a 
                      href="https://calendly.com/fratilanico-vibecoderacademy" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-12 py-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-violet-500 to-emerald-500 text-white text-xl font-bold uppercase tracking-widest hover:shadow-[0_0_40px_rgba(139,92,246,0.4)] transition-all"
                    >
                      Schedule Investor Call
                      <ArrowRight className="w-6 h-6" />
                    </a>
                  </div>
                </div>

                {/* Use of Funds */}
                <div className="p-8 rounded-[2.5rem] border border-white/10 bg-white/[0.02]">
                  <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest">Use of Funds</h3>
                  <div className="space-y-4">
                    {USE_OF_FUNDS.map((item, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-black/40 border border-white/5">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-white font-bold">{item.category}</div>
                          <div className={`text-${item.color}-400 font-bold`}>${(item.amount / 1000).toFixed(0)}K</div>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full bg-${item.color}-500 rounded-full`} style={{ width: `${item.percentage}%` }} />
                        </div>
                        <div className="text-[10px] text-white/40 mt-1">{item.percentage}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.section>
            )}

            {/* TEAM TAB */}
            {activeTab === 'team' && (
              <motion.section
                key="team"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="text-center">
                  <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tighter mb-4">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                      Tree Root Protocol v4.0
                    </span>
                  </h2>
                  <p className="text-white/60 text-sm uppercase tracking-widest">
                    Hierarchical Agent Swarm Structure
                  </p>
                </div>

                {/* Root Node */}
                <div className="flex justify-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-transparent text-center max-w-md"
                  >
                    <div className="w-20 h-20 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-4">
                      <Fingerprint className="w-10 h-10 text-violet-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{TEAM_STRUCTURE.root.name}</h3>
                    <p className="text-violet-400 text-sm uppercase tracking-widest">{TEAM_STRUCTURE.root.role}</p>
                    <div className="mt-4 inline-flex px-4 py-2 rounded-full bg-violet-500/20 border border-violet-500/30">
                      <span className="text-violet-400 font-bold">{TEAM_STRUCTURE.root.equity}% Equity</span>
                    </div>
                    <div className="mt-2 text-[10px] text-white/40 uppercase tracking-widest">
                      Animation: {TEAM_STRUCTURE.root.animation}
                    </div>
                  </motion.div>
                </div>

                {/* Branches */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] text-center"
                  >
                    <h4 className="text-lg font-bold text-white">{TEAM_STRUCTURE.leftBranch.name}</h4>
                    <p className="text-white/50 text-xs">{TEAM_STRUCTURE.leftBranch.role}</p>
                    <div className="mt-3 text-cyan-400 font-bold">{TEAM_STRUCTURE.leftBranch.equity}% Equity</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] text-center"
                  >
                    <h4 className="text-lg font-bold text-white">{TEAM_STRUCTURE.rightBranch.name}</h4>
                    <p className="text-white/50 text-xs">{TEAM_STRUCTURE.rightBranch.role}</p>
                    <div className="mt-3 text-emerald-400 font-bold">{TEAM_STRUCTURE.rightBranch.equity}% Equity</div>
                  </motion.div>
                </div>

                {/* Orchestrator */}
                <div className="flex justify-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-8 rounded-3xl border-2 border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-transparent text-center max-w-lg"
                  >
                    <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4">
                      <Cpu className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{TEAM_STRUCTURE.orchestrator.name}</h3>
                    <p className="text-cyan-400 text-xs uppercase tracking-widest">{TEAM_STRUCTURE.orchestrator.role}</p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      {Object.entries(TEAM_STRUCTURE.orchestrator.stats).map(([key, value]) => (
                        <div key={key} className="p-2 rounded-xl bg-black/40 border border-white/5">
                          <div className="text-lg font-bold text-white">{value}</div>
                          <div className="text-[8px] text-white/40 uppercase tracking-widest">{key}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Departments Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {TEAM_STRUCTURE.departments.map((dept, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + idx * 0.05 }}
                      className="p-4 rounded-xl border border-white/5 bg-white/[0.02] text-center hover:border-cyan-500/30 transition-all"
                    >
                      <dept.icon className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                      <div className="text-[10px] text-white/60 uppercase tracking-wider">{dept.name}</div>
                      <div className="text-[8px] text-white/30 mt-1">{dept.agents} agents</div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
};

export default ShowMeTheMoneyFix4Page;
