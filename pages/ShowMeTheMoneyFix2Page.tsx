import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Target, 
  Shield, 
  ShieldCheck,
  Rocket, 
  BarChart3, 
  Zap, 
  ArrowRight,
  Award,
  AlertTriangle,
  Lightbulb,
  Building2,
  Landmark,
  Monitor,
  CheckCircle2,
  ChevronRight,
  Activity,
  Globe,
  Briefcase,
  Star,
  PieChart,
  Fingerprint
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { GridLoader } from '@/components/artifacts/PlayerOne/components/GridLoader';
import {
  fundingRounds,
  capTable,
  useOfFunds,
  fundingMilestones,
  exitStrategy,
  valuationRationale
} from '@/data/fundraisingStrategy';

// Financial Projection Types
interface RevenueProjection {
  month: string;
  leads: number;
  conversion: number;
  mrr: number;
  cumulative: number;
}

interface PricingTier {
  name: string;
  monthly?: number;
  lifetime?: number;
  priceLabel?: string;
  billingLabel?: string;
  features: string[];
  target: string;
  color: string;
  isRecommended?: boolean;
}

const PRICING = {
  emerging: {
    entry: 89,
    mid: 149,
    pro: 249,
    accelerator: 300,
    team: 500
  },
  west: {
    entry: 299,
    mid: 499,
    pro: 749,
    accelerator: 500,
    team: 1299
  }
};

const AVERAGE_ARPU = {
  emerging: Math.round((PRICING.emerging.entry + PRICING.emerging.mid + PRICING.emerging.pro) / 3),
  west: Math.round((PRICING.west.entry + PRICING.west.mid + PRICING.west.pro) / 3)
};

const BLENDED_ARPU = Math.round((AVERAGE_ARPU.west * 0.2) + (AVERAGE_ARPU.emerging * 0.8));
const BLENDED_ACCELERATOR_FEE = Math.round((PRICING.west.accelerator * 0.2) + (PRICING.emerging.accelerator * 0.8));

// Financial Projections (Blended ARPU + West Launch Lift)
const generateProjections = (): RevenueProjection[] => {
  const projections: RevenueProjection[] = [];
  let cumulativeRevenue = 0;

  // Market Mix Assumptions
  const baseWestRatio = 0.20; // 20% US/UK/EU at launch

  // Phase 1: Launch (Months 1-3) - Validation
  for (let i = 1; i <= 3; i++) {
    const leads = 32000;
    const conversion = i === 1 ? 0.004 : i === 2 ? 0.006 : 0.009; // 0.9% Target

    const courseMRR = Math.round(leads * conversion * BLENDED_ARPU);
    const acceleratorRevenue = i >= 3 ? 6 * BLENDED_ACCELERATOR_FEE : 0;
    const totalMRR = courseMRR + acceleratorRevenue;
    cumulativeRevenue += totalMRR;

    projections.push({
      month: `Month ${i}`,
      leads,
      conversion: Math.round(conversion * 1000) / 10,
      mrr: totalMRR,
      cumulative: cumulativeRevenue
    });
  }

  // Phase 2: Growth (Months 4-6) - Emerging Market Scale
  for (let i = 4; i <= 6; i++) {
    const conversion = 0.01 + (i - 4) * 0.005;
    const leads = 34000 + ((i - 4) * 3500);

    const courseMRR = Math.round(leads * conversion * BLENDED_ARPU);
    const acceleratorRevenue = 12 * BLENDED_ACCELERATOR_FEE;
    const totalMRR = courseMRR + acceleratorRevenue;
    cumulativeRevenue += totalMRR;

    projections.push({
      month: `Month ${i}`,
      leads,
      conversion: Math.round(conversion * 1000) / 10,
      mrr: totalMRR,
      cumulative: cumulativeRevenue
    });
  }

  // Phase 3: West Launch (Months 7-12) - Premium ARPU Lift
  for (let i = 7; i <= 12; i++) {
    const conversion = 0.025 + (i - 7) * 0.005;
    const leads = 42000 + ((i - 6) * 6500);
    const westRatio = Math.min(baseWestRatio + ((i - 7) * 0.04), 0.42);
    const blendedArpuWithWest = Math.round((AVERAGE_ARPU.west * westRatio) + (AVERAGE_ARPU.emerging * (1 - westRatio)));

    const courseMRR = Math.round(leads * conversion * blendedArpuWithWest);
    const acceleratorRevenue = 24 * BLENDED_ACCELERATOR_FEE;
    const totalMRR = courseMRR + acceleratorRevenue;
    cumulativeRevenue += totalMRR;

    projections.push({
      month: `Month ${i}`,
      leads,
      conversion: Math.round(conversion * 1000) / 10,
      mrr: totalMRR,
      cumulative: cumulativeRevenue
    });
  }

  return projections;
};

// SHADOW BRANDING STRATEGY (Regional Tiers)
const pricingTiersEmerging: PricingTier[] = [
  {
    name: 'CodeSprint',
    monthly: PRICING.emerging.entry,
    features: [
      'Module 00 + Core Builder Track',
      'Community Access (Regional)',
      'Tools Starter Pack'
    ],
    target: 'Emerging Markets Entry (RO/IN/LATAM)',
    color: 'from-orange-500 to-amber-500'
  },
  {
    name: 'Builder Lab',
    monthly: PRICING.emerging.mid,
    features: [
      'Full Core Curriculum',
      'Weekly Regional Live Sessions',
      'Peer Reviews + Builder Challenges'
    ],
    target: 'Momentum Tier (Community-Driven)',
    color: 'from-amber-500 to-yellow-500'
  },
  {
    name: 'Founder Track',
    monthly: PRICING.emerging.pro,
    features: [
      'Advanced Orchestration Modules',
      'Ship-to-Launch Roadmaps',
      'Founder Network Access'
    ],
    target: 'High-Intent Builders (Shadow Brand)',
    color: 'from-emerald-500 to-cyan-500',
    isRecommended: true
  },
  {
    name: 'Accelerator (Emerging)',
    priceLabel: `$${PRICING.emerging.accelerator}`,
    billingLabel: 'one-time join',
    features: [
      '30-Day GTM Sprint',
      '2-Week Hyper Care',
      'On-Demand Support (Negotiated)'
    ],
    target: 'Top Founders (One-Time Join)',
    color: 'from-violet-500 to-purple-500'
  },
  {
    name: 'Scale (Team)',
    priceLabel: `$${PRICING.emerging.team}+`,
    billingLabel: 'team / mo',
    features: [
      'Team Seats + Progress Dashboard',
      'B2B Enablement Toolkit',
      'Dedicated Cohort Support'
    ],
    target: 'Emerging Market B2B',
    color: 'from-cyan-500 to-blue-500'
  }
];

const pricingTiersWest: PricingTier[] = [
  {
    name: 'Entry',
    monthly: PRICING.west.entry,
    features: [
      'Module 00 + Core Builder Track',
      'Global Community Access',
      'Tools Starter Pack'
    ],
    target: 'Premium Entry (US/UK/EU)',
    color: 'from-slate-500 to-slate-600'
  },
  {
    name: 'Core',
    monthly: PRICING.west.mid,
    features: [
      'Full Core Curriculum',
      'Global Live Sessions',
      'Code Reviews + Office Hours'
    ],
    target: 'Serious Builders',
    color: 'from-cyan-500 to-violet-500'
  },
  {
    name: 'Pro',
    monthly: PRICING.west.pro,
    features: [
      'Advanced Orchestration',
      'Founder Network + Certification',
      'Launch Playbooks + Reviews'
    ],
    target: 'Premium Track (High ARPU)',
    color: 'from-violet-500 to-fuchsia-500',
    isRecommended: true
  },
  {
    name: 'Accelerator (West)',
    priceLabel: `$${PRICING.west.accelerator}`,
    billingLabel: 'one-time join',
    features: [
      '30-Day GTM Sprint',
      '2-Week Hyper Care',
      'On-Demand Support (Negotiated)'
    ],
    target: 'Top Founders (One-Time Join)',
    color: 'from-emerald-500 to-cyan-500'
  },
  {
    name: 'Scale (Team)',
    priceLabel: `$${PRICING.west.team}+`,
    billingLabel: 'team / mo',
    features: [
      'Team Seats + KPI Dashboards',
      'Enterprise Enablement',
      'Dedicated B2B Partnership Support'
    ],
    target: 'B2B Scale-Up Tier',
    color: 'from-amber-500 to-orange-500'
  }
];

// Value Proposition Analysis
const valueProps = [
  {
    icon: Target,
    title: 'The Problem',
    description: 'Everyone wants to be a builder but doesn\'t know where to start. Expensive dev teams ($200K+/year) are barriers to entry.',
    color: 'rose'
  },
  {
    icon: Zap,
    title: 'The Solution',
    description: 'APEX OS Academy teaches founders to orchestrate AI agents. Remove the need for expensive dev teams.',
    color: 'cyan'
  },
  {
    icon: TrendingUp,
    title: 'The Market',
    description: '32,000 InfoAcademy students ready to learn. 30% retention target. AI coding market growing 40% YoY.',
    color: 'emerald'
  },
  {
    icon: Shield,
    title: 'Moat',
    description: 'First-mover in AI orchestration. Proprietary curriculum. Gamified learning with 3D environment.',
    color: 'violet'
  }
];

// Go-to-Market Strategy
const gtmStrategy = [
  {
    phase: 'Phase 1: Launch (Month 1-3)',
    focus: 'Convert existing 32K InfoAcademy leads',
    tactics: [
      'Email sequence to 32K leads with free Module 00',
      'Launch webinar series: "Build Your First AI Agent"',
      'Early bird pricing for first 100 adopters',
      'Partner with micro-influencers in founder space'
    ],
    target: '1,000 paying customers (3% conversion)'
  },
  {
    phase: 'Phase 2: Growth (Month 4-6)',
    focus: 'Referral & organic growth (Emerging Markets)',
    tactics: [
      'Implement referral program (1 month free)',
      'Launch affiliate program (30% commission)',
      'Case study content from successful students',
      'YouTube tutorial series (2x/week)'
    ],
    target: '3,000 paying customers'
  },
  {
    phase: 'Phase 3: West Launch (Month 7-12)',
    focus: 'Premium market entry (US/UK/EU) with ARPU lift',
    tactics: [
      'Premium brand positioning + new pricing page',
      'West-focused webinars with founder partners',
      'Targeted paid acquisition tests',
      'Conference and PR push (Web Summit, etc.)'
    ],
    target: '5,000 paying customers, +35% blended ARPU'
  },
  {
    phase: 'Phase 4: Scale (Month 13+)',
    focus: 'Enterprise & team expansion',
    tactics: [
      'Launch Team/Agency tier',
      'B2B outreach to accelerators & incubators',
      'Corporate training partnerships',
      'Enterprise sales team (2 reps)',
      'International expansion (Global Rollout)'
    ],
    target: '10,000+ paying customers'
  }
];

const acceleratorPlanExtended = [
  {
    title: 'Stage 1: Selective Intake',
    icon: Users,
    color: 'cyan',
    description: 'We filter the top 1% of performers from our global academy. Only founders who have shipped their first AI-orchestrated MVP are considered.',
    details: [
      'Performance-based whitelist',
      'Technical proficiency assessment',
      'Market opportunity review',
      'Founder commitment interview'
    ]
  },
  {
    title: 'Stage 2: 30-Day Build Sprint',
    icon: Zap,
    color: 'violet',
    description: 'A hyper-intensive execution phase where we compress months of development into 30 days using APEX OS proprietary playbooks.',
    details: [
      'Daily architectural reviews',
      'Advanced agent orchestration design',
      'Direct access to senior engineering leads',
      'Scale-ready infrastructure setup'
    ]
  },
  {
    title: 'Stage 3: GTM & Demo Day',
    icon: Rocket,
    color: 'emerald',
    description: 'We validate the product with real users and prepare the founders for their first institutional or angel investment round.',
    details: [
      'Initial 100 customer acquisition',
      'Pitch deck & financial model audit',
      'Private demo day with selected angels',
      'Direct intro to seed-stage VCs'
    ]
  },
  {
    title: 'Stage 4: Post-Launch Support',
    icon: Shield,
    color: 'amber',
    description: '2 weeks of hyper-care followed by ongoing on-demand support to ensure the startup scales without technical debt.',
    details: [
      'Performance monitoring & scaling',
      'Talent recruitment assistance',
      'Continuous architectural guidance',
      'Follow-on round support'
    ]
  }
];

const risks = [
  {
    risk: 'Low conversion from 32K leads',
    probability: 'Medium',
    impact: 'High',
    mitigation: 'A/B test pricing, offer payment plans, extended free trials'
  },
  {
    risk: 'AI tools become obsolete quickly',
    probability: 'High',
    impact: 'Medium',
    mitigation: 'Curriculum updates included, focus on principles not tools'
  },
  {
    risk: 'Competitors copy curriculum',
    probability: 'High',
    impact: 'Medium',
    mitigation: 'Continuous innovation (game environment), community network effects'
  }
];

export const ShowMeTheMoneyPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('executive');
  const [isLoading, setIsLoading] = useState(true);
  const projections = generateProjections();

  useEffect(() => {
    // Rapid ignition for high-performance vibes
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const totalYear1Revenue = projections[projections.length - 1]?.cumulative ?? 0;
  const month12Mrr = projections[11]?.mrr ?? 0;
  const maxMrr = Math.max(...projections.map(p => p.mrr), 1);

  return (
    <>
      <GridLoader isLoading={isLoading} onLoadingComplete={() => setIsLoading(false)} />
      <main className={`relative z-10 px-4 sm:px-6 max-w-7xl mx-auto pb-16 overflow-x-hidden transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
      {/* Secret Header */}
      <section className="relative text-center max-w-4xl mx-auto pt-8 pb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 mb-6"
        >
          <span className="text-sm font-bold text-emerald-400 uppercase tracking-widest">🤫 TOP SECRET</span>
          <span className="text-white/60 text-sm">| APEX OS Business Plan 2026</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 uppercase">
            DEPLOYING PITCH DECK CONFIGURATION
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-white/60 mb-8 max-w-3xl mx-auto px-2"
        >
          Neural_Venture_Protocol_v4.0 // FULL_WIRE_ENGAGED
        </motion.p>

        {/* Key Metrics Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto"
        >
          {[
            { 
              label: 'Year 1 Revenue', 
              value: totalYear1Revenue >= 1000000 
                ? `$${(totalYear1Revenue / 1000000).toFixed(1)}M` 
                : `$${(totalYear1Revenue / 1000).toFixed(0)}K`, 
              color: 'emerald' 
            },
            { label: 'Target Users', value: '1,000 (M18)', color: 'cyan' },
            { label: 'Avg MRR (Mo 12)', value: `$${(month12Mrr / 1000).toFixed(0)}K`, color: 'violet' },
            { label: 'LTV:CAC Ratio', value: '8:1', color: 'amber' }
          ].map((metric, idx) => (
            <div key={idx} className="p-3 sm:p-4 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-md">
              <div className={`text-xl sm:text-2xl font-bold text-${metric.color}-400`}>{metric.value}</div>
              <div className="text-[10px] text-white/40 mt-1 uppercase font-medium tracking-widest">{metric.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ACCELERATOR HERO - THE MAIN DISH */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <div className="inline-flex w-24 h-24 rounded-[2.5rem] bg-violet-500/20 border border-violet-500/30 items-center justify-center mb-8 shadow-2xl shadow-violet-500/30">
            <Rocket className="w-12 h-12 text-violet-400" />
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6">
            APEX Accelerator
          </h1>
          <p className="text-violet-400 font-mono text-lg uppercase tracking-[0.3em] font-bold mb-4">
            Neural_Venture_Protocol_v1.0
          </p>
          <p className="text-white/60 text-xl max-w-3xl mx-auto px-4">
            We don't just teach; we accelerate. 15% equity model for 
            AI-first startup portfolio building.
          </p>
        </div>

        {/* 30-Day Sprint Visual */}
        <div className="relative max-w-5xl mx-auto px-4">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/0 via-violet-500/40 to-violet-500/0 hidden md:block" />
          
          {acceleratorPlanExtended.map((stage, idx) => (
            <div key={idx} className="flex items-center gap-8 mb-12">
              <div className="flex-1 text-right hidden md:block">
                <h3 className="text-2xl font-bold text-white">{stage.title}</h3>
                <p className="text-white/60 text-sm">{stage.description}</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-violet-500/20 border border-violet-500/40 flex items-center justify-center z-10 shrink-0">
                <stage.icon className="w-8 h-8 text-violet-400" />
              </div>
              <div className="flex-1 text-left">
                <div className="md:hidden">
                  <h3 className="text-xl font-bold text-white mb-1">{stage.title}</h3>
                  <p className="text-white/60 text-sm mb-4">{stage.description}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {stage.details.map((detail, didx) => (
                    <div key={didx} className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/5">
                      <CheckCircle2 className={`w-3 h-3 text-violet-400 shrink-0`} />
                      <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a 
            href="https://calendly.com/fratilanico-vibecoderacademy" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-12 py-6 rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white text-xl font-bold uppercase tracking-widest hover:shadow-[0_0_40px_rgba(139,92,246,0.4)] transition-all"
          >
            Apply to Accelerator
            <ArrowRight className="w-6 h-6" />
          </a>
          <p className="text-white/40 text-sm mt-4">15% Equity Model • 30-Day Sprint • Global Network</p>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="mb-12 sticky top-4 z-50">
        <div className="flex flex-wrap justify-center gap-2 p-2 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-2xl max-w-fit mx-auto shadow-2xl">
          {[
            { id: 'executive', label: 'Executive', mobileLabel: 'Exec' },
            { id: 'pricing', label: 'Pricing', mobileLabel: 'Price' },
            { id: 'financials', label: 'Financials', mobileLabel: 'Finance' },
            { id: 'gtm', label: 'Go-To-Market', mobileLabel: 'GTM' },
            { id: 'fundraising', label: 'Fundraising', mobileLabel: 'Fund' },
            { id: 'team', label: 'The Swarm', mobileLabel: 'Team' },
            { id: 'risks', label: 'Risks', mobileLabel: 'Risk' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-3 sm:px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                activeSection === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg shadow-cyan-500/20'
                  : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="hidden md:inline">{tab.label}</span>
              <span className="md:hidden">{tab.mobileLabel}</span>
            </button>
          ))}
        </div>
      </section>

      <AnimatePresence mode="wait">
        {/* EXECUTIVE SUMMARY */}
        {activeSection === 'executive' && (
          <motion.section
            key="executive"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 ">Executive Summary</h2>
              <p className="text-white/60 px-2 font-mono text-xs uppercase tracking-widest">Sovereign Growth Protocol // 2026_STRATEGY</p>
            </div>

            {/* MARKET SEGMENTATION & SHADOW BRANDING */}
            <div className="p-4 sm:p-8 rounded-[2.5rem] border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-transparent backdrop-blur-md">
              <div className="flex items-center gap-4 mb-8">
                <div className="inline-flex w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 items-center justify-center shrink-0">
                  <Shield className="w-7 h-7 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white ">Shadow Branding Protocol</h3>
                  <p className="text-cyan-400 text-xs font-mono uppercase font-bold tracking-widest">Brand_Protection_Systems_Active</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-5">
                  <h4 className="text-white font-bold flex items-center gap-3 uppercase text-sm tracking-widest">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    Premium Tier (Global Brand)
                  </h4>
                  <div className="p-6 rounded-3xl bg-black/40 border border-white/10 hover:border-cyan-500/30 transition-colors">
                    <div className="text-lg font-bold text-white mb-2 ">APEX OS Academy</div>
                    <div className="text-[10px] text-white/40 mb-4 uppercase font-bold tracking-widest">Target: USA, UK, Western Europe</div>
                    <ul className="text-xs text-white/70 space-y-3 font-mono uppercase font-bold">
                      <li className="flex items-center gap-2"><div className="w-1 h-1 bg-cyan-400 rounded-full" /> $299–$749/mo (Premium Ladder)</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 bg-cyan-400 rounded-full" /> Global Job Board Certification</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 bg-cyan-400 rounded-full" /> Direct Strategic Consultation</li>
                    </ul>
                  </div>
                  <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">
                    * GOLD STANDARD. NEVER DISCOUNTED.
                  </p>
                </div>

                <div className="space-y-5">
                  <h4 className="text-orange-400 font-bold flex items-center gap-3 uppercase text-sm tracking-widest">
                    <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                    Beta Tier (Shadow Brand)
                  </h4>
                  <div className="p-6 rounded-3xl bg-black/40 border border-orange-500/20 hover:border-orange-500/40 transition-colors">
                    <div className="text-lg font-bold text-orange-400 mb-2 ">Builder Lab / CodeSprint</div>
                    <div className="text-[10px] text-white/40 mb-4 uppercase font-bold tracking-widest">Target: Romania, India, LATAM</div>
                    <ul className="text-xs text-white/70 space-y-3 font-mono uppercase font-bold">
                      <li className="flex items-center gap-2"><div className="w-1 h-1 bg-orange-400 rounded-full" /> $89–$249/mo (PPP Adjusted)</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 bg-orange-400 rounded-full" /> Identical Curriculum, Hidden Origin</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 bg-orange-400 rounded-full" /> Community-Led Sovereign Support</li>
                    </ul>
                  </div>
                  <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">
                    * MASSIVE VOLUME. BRAND INTEGRITY PRESERVED.
                  </p>
                </div>
              </div>
            </div>

            {/* Value Proposition Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {valueProps.map((prop, idx) => (
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
                  <h3 className="text-lg font-bold text-white mb-2 ">{prop.title}</h3>
                  <p className="text-white/50 text-[11px] leading-relaxed uppercase font-bold tracking-tight">{prop.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Pricing Strategy Optimization */}
            <div className="p-6 sm:p-10 rounded-[2.5rem] border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="inline-flex w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 items-center justify-center shrink-0 shadow-2xl shadow-amber-500/20">
                  <Lightbulb className="w-7 h-7 text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl sm:text-3xl font-bold text-white mb-4 ">Strategic Positioning Matrix</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-6">
                    <div className="space-y-4">
                      <h4 className="text-red-400 font-bold mb-2 text-sm uppercase tracking-widest border-b border-red-500/20 pb-2">❌ DEPRECATED_STRATEGY</h4>
                      <ul className="text-white/60 text-xs space-y-3 font-mono uppercase font-bold">
                        <li className="flex items-start gap-2"><span className="text-red-500">✕</span> Only 2 tiers: $200/mo or $997 lifetime</li>
                        <li className="flex items-start gap-2"><span className="text-red-500">✕</span> Zero lead-capture for 32K funnel</li>
                        <li className="flex items-start gap-2"><span className="text-red-500">✕</span> No middle ground for early validation</li>
                        <li className="flex items-start gap-2"><span className="text-red-500">✕</span> Missing B2B/Team revenue capture</li>
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

            {/* Key Assumptions */}
            <div className="p-6 sm:p-8 rounded-[2rem] border border-white/10 bg-white/[0.02] backdrop-blur-xl">
              <h3 className="text-sm font-bold text-white/40 mb-6 uppercase tracking-[0.3em] text-center">Key Business Assumptions</h3>
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                {[
                  { label: 'Market Pool', value: '32,000 Leads', icon: Users },
                  { label: 'Target Conv.', value: '1.2% Target', icon: Target },
                  { label: 'Blended ARPU', value: `$${BLENDED_ARPU}`, icon: DollarSign },
                  { label: 'Retention', value: '30% Ret.', icon: Shield },
                  { label: 'CAC (Blended)', value: '$100 avg.', icon: TrendingUp },
                  { label: 'LTV (Year 1)', value: '$1,200', icon: Award }
                ].map((assumption, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-cyan-500/20 transition-all">
                    <assumption.icon className="w-5 h-5 text-cyan-400 mb-2" />
                    <div className="text-white font-bold text-xs  mb-1">{assumption.value}</div>
                    <div className="text-[8px] text-white/30 uppercase font-bold tracking-widest">{assumption.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* PRICING STRATEGY */}
        {activeSection === 'pricing' && (
          <motion.section
            key="pricing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 ">Pricing Strategy</h2>
              <p className="text-white/60 px-2 font-mono text-xs uppercase tracking-widest">5-Tier Revenue Ladder // GLOBAL_PPP_OPTIMIZED</p>
            </div>

            {/* Pricing Cards - Emerging Markets */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 border-b border-orange-500/20 pb-4">
                <Globe className="text-orange-400 w-6 h-6" />
                <div>
                  <h3 className="text-xl font-bold text-white ">Emerging Markets Strategy</h3>
                  <p className="text-orange-400 text-[10px] font-mono uppercase font-bold tracking-widest">SHADOW_BRANDING_ENABLED // RO_IN_LATAM</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {pricingTiersEmerging.map((tier, idx) => (
                  <motion.div
                    key={`emerging-${idx}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className={`p-6 rounded-3xl border border-white/10 bg-white/[0.02] hover:border-orange-500/40 transition-all ${
                      tier.isRecommended ? 'ring-2 ring-emerald-500/50 scale-[1.02] bg-white/[0.04]' : ''
                    }`}
                  >
                    <div className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-bold bg-gradient-to-r ${tier.color} text-white mb-6 uppercase tracking-widest`}>
                      {tier.name}
                    </div>

                    <div className="mb-6">
                      <div className="text-3xl font-bold text-white tracking-tight">
                        {tier.priceLabel ?? (tier.monthly ? `$${tier.monthly}` : 'FREE')}
                        <span className="text-xs text-white/40 uppercase font-bold tracking-widest ml-1">
                          {tier.billingLabel ?? (tier.monthly ? '/mo' : '')}
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8 min-h-[140px]">
                      {tier.features.map((feature, fidx) => (
                        <li key={fidx} className="flex items-start gap-2 text-[10px] text-white/60 font-bold ">
                          <CheckCircle2 className="text-emerald-400 w-3 h-3 shrink-0 mt-0.5" />
                          <span className="leading-tight">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-4 border-t border-white/5">
                      <p className="text-[8px] text-white/30 uppercase font-bold tracking-widest">{tier.target}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Pricing Cards - West */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 border-b border-cyan-500/20 pb-4">
                <Star className="text-cyan-400 w-6 h-6" />
                <div>
                  <h3 className="text-xl font-bold text-white ">Premium West Strategy</h3>
                  <p className="text-cyan-400 text-[10px] font-mono uppercase font-bold tracking-widest">APEX_OS_CORE_BRAND // US_UK_EU</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {pricingTiersWest.map((tier, idx) => (
                  <motion.div
                    key={`west-${idx}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className={`p-6 rounded-3xl border border-white/10 bg-white/[0.02] hover:border-cyan-500/40 transition-all ${
                      tier.isRecommended ? 'ring-2 ring-violet-500/50 scale-[1.02] bg-white/[0.04]' : ''
                    }`}
                  >
                    <div className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-bold bg-gradient-to-r ${tier.color} text-white mb-6 uppercase tracking-widest`}>
                      {tier.name}
                    </div>

                    <div className="mb-6">
                      <div className="text-3xl font-bold text-white tracking-tight">
                        {tier.priceLabel ?? (tier.monthly ? `$${tier.monthly}` : 'FREE')}
                        <span className="text-xs text-white/40 uppercase font-bold tracking-widest ml-1">
                          {tier.billingLabel ?? (tier.monthly ? '/mo' : '')}
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8 min-h-[140px]">
                      {tier.features.map((feature, fidx) => (
                        <li key={fidx} className="flex items-start gap-2 text-[10px] text-white/60 font-bold ">
                          <CheckCircle2 className="text-emerald-400 w-3 h-3 shrink-0 mt-0.5" />
                          <span className="leading-tight">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-4 border-t border-white/5">
                      <p className="text-[8px] text-white/30 uppercase font-bold tracking-widest">{tier.target}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* FINANCIAL PROJECTIONS */}
        {activeSection === 'financials' && (
          <motion.section
            key="financials"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 ">Financial Projections</h2>
              <p className="text-white/60 px-2 font-mono text-xs uppercase tracking-widest">12-Month Forecast // GROWTH_CURVE_MODEL</p>
            </div>

            {/* Revenue Chart */}
            <div className="p-8 rounded-[2.5rem] border border-white/10 bg-black/40 backdrop-blur-md">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-lg font-bold text-white uppercase tracking-widest">Monthly Recurring Revenue (MRR)</h3>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-cyan-500" />
                    <span className="text-[10px] text-white/40 uppercase font-bold">Base Revenue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-violet-500" />
                    <span className="text-[10px] text-white/40 uppercase font-bold">Accelerator Fees</span>
                  </div>
                </div>
              </div>
              <div className="h-64 sm:h-80 flex items-end gap-2 sm:gap-4 px-4">
                {projections.map((p, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center min-w-0 group relative">
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 backdrop-blur-md px-2 py-1 rounded text-[10px] font-mono text-white z-10">
                      ${(p.mrr / 1000).toFixed(1)}K
                    </div>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(p.mrr / maxMrr) * 100}%` }}
                      transition={{ delay: idx * 0.05, type: 'spring', stiffness: 50 }}
                      className="w-full bg-gradient-to-t from-cyan-500 via-violet-500 to-purple-500 rounded-t-lg min-h-[4px] shadow-lg shadow-violet-500/10 group-hover:from-cyan-400 group-hover:to-purple-400 transition-all"
                    />
                    <div className="text-[10px] text-white/40 mt-4 font-bold uppercase ">{p.month.replace('Month ', 'M')}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Unit Economics Deep Dive */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'CAC', value: '$100', sub: 'Target Acquisition', icon: Target, color: 'cyan' },
                { label: 'LTV', value: '$1,200', sub: '12-Month Median', icon: Award, color: 'emerald' },
                { label: 'Margin', value: '85%', sub: 'Gross Profitability', icon: TrendingUp, color: 'violet' },
                { label: 'Payback', value: '3 Months', sub: 'Conservative ROI', icon: Zap, color: 'amber' }
              ].map((stat, i) => (
                <div key={i} className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-md hover:border-white/20 transition-all">
                  <stat.icon className={`w-6 h-6 text-${stat.color}-400 mb-4`} />
                  <div className="text-3xl font-bold text-white tracking-tight mb-1">{stat.value}</div>
                  <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest">{stat.label}</div>
                  <div className="text-[8px] text-white/20 uppercase font-bold mt-2 tracking-widest">{stat.sub}</div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* GO-TO-MARKET */}
        {activeSection === 'gtm' && (
          <motion.section
            key="gtm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 ">Go-To-Market Strategy</h2>
              <p className="text-white/60 px-2 font-mono text-xs uppercase tracking-widest">Execution Roadmap // GTM_PROTOCOL_ACTIVE</p>
            </div>

            <div className="space-y-6">
              {gtmStrategy.map((phase, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-8 rounded-[2rem] border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white ">{phase.phase}</h3>
                      <p className="text-cyan-400 text-[10px] font-mono uppercase font-bold tracking-widest mt-1">{phase.focus}</p>
                    </div>
                    <div className="px-4 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 shrink-0">
                      <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">{phase.target}</span>
                    </div>
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {phase.tactics.map((tactic, tidx) => (
                      <li key={tidx} className="flex items-start gap-3 text-[11px] text-white/60 font-mono uppercase font-bold tracking-tight">
                        <ChevronRight className="text-cyan-400 w-4 h-4 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{tactic}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* B2B SCALE-UP SECTION */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-10 sm:p-16 rounded-[3rem] border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-black/40 to-transparent relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Users className="w-32 h-32 text-emerald-500" />
              </div>
              <div className="relative z-10">
                <h3 className="text-3xl sm:text-5xl font-bold text-white mb-6  leading-none">B2B Scale-Up <br/><span className="text-emerald-400">& Partnerships</span></h3>
                <p className="text-white/70 text-xl mb-10 leading-relaxed  font-medium max-w-3xl">
                  Turn accelerators, agencies, and mid-market teams into repeatable revenue. Leveraging our <span className="text-emerald-400 font-bold">Sovereign B2B Database</span> to scale beyond individual builders.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-xs font-mono font-bold uppercase">
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all">
                    <div className="inline-flex w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 items-center justify-center mb-4">
                      <Building2 className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h4 className="text-emerald-400 font-bold mb-2 text-sm tracking-widest">Partner Bundles</h4>
                    <p className="text-white/40 leading-relaxed tracking-wider">Custom curriculum access for accelerators and startup incubators.</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all">
                    <div className="inline-flex w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 items-center justify-center mb-4">
                      <Users className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h4 className="text-cyan-400 font-bold mb-2 text-sm tracking-widest">Team Enablement</h4>
                    <p className="text-white/40 leading-relaxed tracking-wider">Onboarding + KPI dashboards for dev leads and engineering managers.</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-violet-500/30 transition-all">
                    <div className="inline-flex w-12 h-12 rounded-2xl bg-violet-500/20 border border-violet-500/30 items-center justify-center mb-4">
                      <Landmark className="w-6 h-6 text-violet-400" />
                    </div>
                    <h4 className="text-violet-400 font-bold mb-2 text-sm tracking-widest">Enterprise Pilots</h4>
                    <p className="text-white/40 leading-relaxed tracking-wider">Direct workforce training for large-scale AI orchestration shifts.</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <a
                    href="https://calendly.com/fratilanico-vibecoderacademy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 rounded-[1.5rem] bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-all shadow-2xl shadow-emerald-500/40 uppercase tracking-widest text-sm"
                  >
                    Book B2B Strategy Session
                    <ArrowRight className="w-6 h-6" />
                  </a>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Calendly_Intake_Active</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.section>
        )}

        {/* FUNDRAISING STRATEGY */}
        {activeSection === 'fundraising' && (
          <motion.section
            key="fundraising"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 ">Fundraising Strategy</h2>
              <p className="text-white/60 px-2 font-mono text-xs uppercase tracking-widest">$1.2M Seed Round // $6.8M Pre-Money Val</p>
            </div>

            {/* Rounds Waterfall */}
            <div className="space-y-6">
              {fundingRounds.map((round, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`p-8 rounded-[2rem] border ${round.status === 'active' ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-white/10 bg-white/[0.03]'} font-mono relative overflow-hidden`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className={`w-4 h-4 rounded-full shrink-0 ${
                        round.status === 'completed' ? 'bg-emerald-400' :
                        round.status === 'active' ? 'bg-amber-400 animate-pulse' :
                        'bg-white/20'
                      } shadow-[0_0_15px_rgba(0,0,0,0.5)]`} />
                      <h4 className="text-xl font-bold text-white ">{round.stage}</h4>
                    </div>
                    <div className="text-2xl font-bold text-emerald-400 italic tracking-tight">${(round.amount / 1000000).toFixed(1)}M</div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-[10px] uppercase font-bold tracking-widest relative z-10">
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                      <div className="text-white/30 mb-1">Equity Stake</div>
                      <div className="text-white text-lg font-bold">{round.equityPercent}%</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                      <div className="text-white/30 mb-1">Pre-Money</div>
                      <div className="text-white text-lg font-bold">${(round.preMoneyValuation / 1000000).toFixed(1)}M</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                      <div className="text-white/30 mb-1">Post-Money</div>
                      <div className="text-white text-lg font-bold">${(round.postMoneyValuation / 1000000).toFixed(1)}M</div>
                    </div>
                  </div>
                  <div className="mt-6 text-[9px] text-white/40 uppercase font-bold tracking-widest flex items-center gap-2">
                    <Activity className="w-3 h-3" />
                    Timeline: {round.timing}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Cap Table Evolution */}
            <div className="p-10 rounded-[3rem] border border-white/10 bg-white/[0.02] backdrop-blur-xl">
              <div className="flex items-center gap-4 mb-10">
                <PieChart className="text-cyan-400 w-6 h-6" />
                <h3 className="text-xl font-bold text-white ">Cap Table Evolution</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(['postSeed', 'postSeriesA'] as const).map((stage) => (
                  <div key={stage} className="p-6 rounded-3xl bg-black/40 border border-white/5">
                    <h4 className="text-cyan-400 font-bold uppercase tracking-widest text-xs mb-6 border-b border-white/10 pb-2">
                      {stage === 'postSeed' ? 'Post-Seed' : 'Post-Series A'}
                    </h4>
                    <div className="space-y-4">
                      {capTable[stage].map((s, idx) => (
                        <div key={idx} className="flex justify-between items-center text-[10px] font-mono">
                          <span className="text-white/60 uppercase">{s.name}</span>
                          <span className="text-white font-bold">{s.equityPercent}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-violet-500/20 to-transparent border border-violet-500/30">
                  <h4 className="text-violet-400 font-bold uppercase tracking-widest text-xs mb-6 border-b border-white/10 pb-2">Founder Control</h4>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-[10px] uppercase font-bold mb-2">
                        <span className="text-white/40">Post-Seed</span>
                        <span className="text-emerald-400 italic">72.25%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[72.25%]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] uppercase font-bold mb-2">
                        <span className="text-white/40">Post-Series A</span>
                        <span className="text-emerald-400 italic">59.26%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[59.26%]" />
                      </div>
                    </div>
                    <p className="text-[9px] text-white/30 uppercase font-bold leading-relaxed">Majority control maintained through Series A, preserving architectural vision.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Use of Funds Visualization */}
            <div className="p-10 rounded-[3rem] border border-cyan-500/20 bg-white/[0.02] backdrop-blur-xl">
              <h3 className="text-xl font-bold text-white mb-10 ">Use of Funds ($1.2M Seed Round)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {useOfFunds.seedRound.map((cat, i) => (
                  <div key={i} className="space-y-4">
                    <div className="flex justify-between items-end">
                      <h4 className="text-sm font-bold text-white uppercase tracking-widest">{cat.category}</h4>
                      <span className="text-cyan-400 font-mono font-bold italic">${(cat.amount / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${cat.percentage}%` }}
                        className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full"
                      />
                    </div>
                    <p className="text-[9px] text-white/40 uppercase font-bold tracking-tight leading-relaxed">{cat.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Funding Milestones */}
            <div className="p-10 rounded-[3rem] border border-white/10 bg-white/[0.02]">
              <h3 className="text-xl font-bold text-white mb-10 ">Funding Milestones & Triggers</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {fundingMilestones.slice(0, 3).map((milestone, idx) => (
                  <div key={idx} className="p-6 rounded-3xl bg-black/40 border border-white/5 flex flex-col h-full group hover:border-cyan-500/30 transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-white font-bold italic">
                        {idx + 1}
                      </div>
                      <h4 className="text-white font-bold uppercase text-xs tracking-widest">{milestone.round}</h4>
                    </div>
                    <div className="flex-1 space-y-4">
                      {milestone.milestones.slice(0, 3).map((m, midx) => (
                        <div key={midx} className="p-3 rounded-xl bg-white/5 border border-white/5">
                          <div className="text-[8px] text-white/30 uppercase font-bold mb-1">{m.metric}</div>
                          <div className="text-emerald-400 font-mono font-bold text-xs">{m.target}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/5">
                      <p className="text-[8px] text-cyan-400 font-mono uppercase font-bold mb-1">Trigger:</p>
                      <p className="text-[9px] text-white/40 uppercase leading-relaxed font-bold">{milestone.nextRoundTrigger}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Valuation Rationale */}
            <div className="p-10 rounded-[3rem] border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-transparent shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-10 ">Valuation Rationale</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <h4 className="text-cyan-400 font-bold mb-6 text-sm uppercase tracking-widest border-b border-white/5 pb-2 italic">Key Metrics Justifying $6.8M Pre-Money</h4>
                  <div className="space-y-4">
                    {valuationRationale.currentMetrics.slice(0, 4).map((metric, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-cyan-500/30 transition-all">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 shrink-0 animate-pulse" />
                        <div className="min-w-0">
                          <div className="text-white font-bold text-xs  mb-1">{metric.metric}</div>
                          <div className="text-emerald-400 font-mono font-bold text-sm mb-1">{metric.value}</div>
                          <div className="text-[10px] text-white/40 uppercase font-bold tracking-tight">{metric.impact}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-cyan-400 font-bold mb-6 text-sm uppercase tracking-widest border-b border-white/5 pb-2 italic">Comparable Valuations</h4>
                  <div className="space-y-3">
                    {valuationRationale.comparables.slice(0, 4).map((comp, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-black/40 transition-all group">
                        <div className="min-w-0">
                          <div className="text-white font-bold text-[10px] uppercase tracking-widest group-hover:text-cyan-400 transition-colors">{comp.company}</div>
                          <div className="text-[8px] text-white/30 uppercase font-bold mt-1 tracking-widest">{comp.relevance}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-emerald-400 font-mono font-bold text-sm italic">{comp.valuation}</div>
                          <div className="text-[8px] text-white/20 uppercase font-bold">{comp.multiple}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Exit Strategy */}
            <div className="p-10 rounded-[3rem] border border-violet-500/30 bg-black/40 backdrop-blur-xl relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Landmark className="w-32 h-32 text-violet-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-10 ">Exit Strategy</h3>
              <div className="mb-10 p-6 rounded-3xl bg-white/5 border border-white/5 flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-violet-500/20 flex items-center justify-center border border-violet-500/30 shadow-2xl">
                  <Building2 className="w-8 h-8 text-violet-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold uppercase tracking-widest text-base mb-1">Primary Path: Strategic Acquisition</h4>
                  <p className="text-white/40 text-xs uppercase font-bold tracking-wider">Most likely exit via acquisition by EdTech giant or cloud/AI platform (Expected Year 4-6)</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {exitStrategy.scenarios.slice(0, 2).map((scenario, idx) => (
                  <div key={idx} className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-violet-500/30 transition-all">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-white font-bold  text-sm">{scenario.type}</h4>
                      <span className={`px-3 py-1 rounded-xl text-[8px] font-bold uppercase tracking-widest ${
                        scenario.probability === 'High' ? 'bg-emerald-500/20 text-emerald-400' :
                        scenario.probability === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-white/10 text-white/50'
                      }`}>
                        {scenario.probability} PROB
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-emerald-400 tracking-tight mb-4">
                      ${(scenario.valuationRange.min / 1000000).toFixed(0)}M - ${(scenario.valuationRange.max / 1000000).toFixed(0)}M
                    </div>
                    <p className="text-[10px] text-white/40 mb-6 uppercase leading-relaxed font-bold">{scenario.rationale}</p>
                    <div className="space-y-2 pt-4 border-t border-white/5">
                      {scenario.potentialAcquirers.slice(0, 3).map((acquirer, aidx) => (
                        <div key={aidx} className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest">
                          <span className="text-white/60">{acquirer.name}</span>
                          <span className="text-white/20">${(acquirer.estimatedOffer / 1000000).toFixed(0)}M</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-6 rounded-3xl bg-amber-500/5 border border-amber-500/20 flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30 shrink-0 shadow-xl shadow-amber-500/10">
                  <Landmark className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-1">Secondary Path: IPO Readiness (2029-2031)</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {exitStrategy.ipoReadiness.requirements.slice(0, 4).map((req, idx) => (
                      <span key={idx} className="px-2 py-1 rounded-lg bg-black/40 text-white/30 text-[8px] font-mono uppercase font-bold tracking-widest border border-white/5">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* TEAM / TREE ROOT PROTOCOL v4.0 */}
        {activeSection === 'team' && (
          <motion.section
            key="team"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-16"
          >
            {/* HIERARCHY HEADER */}
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">The Tree Root Protocol v4.0</h2>
              <p className="text-white/40 px-2 font-mono text-xs uppercase tracking-widest">Organizational_Architecture // AGENTIC_FIRST</p>
            </div>

            {/* ROOT NODE: HUMAN LEADERSHIP - 3 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Nicolae Fratila */}
              <div className="p-8 rounded-[2.5rem] border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-transparent relative overflow-hidden shadow-2xl group hover:border-cyan-500/50 transition-all">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Briefcase className="w-24 h-24 text-cyan-500" />
                </div>
                <div className="flex flex-col items-center text-center relative z-10">
                  <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-r from-cyan-500 to-cyan-400 p-[2px] shadow-2xl mb-6">
                    <div className="w-full h-full rounded-[1.9rem] bg-zinc-900 flex items-center justify-center font-bold text-white text-3xl">FN</div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1 tracking-tight">Nicolae Fratila</h3>
                  <p className="text-cyan-400 font-mono text-xs uppercase tracking-[0.2em] font-bold mb-4">Founder/CEO</p>
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mb-4" />
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-white/60 text-xs uppercase tracking-widest">Equity</span>
                    <span className="px-2 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs font-bold">80%</span>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed italic">
                    "We are not building software; we are manufacturing technical founders."
                  </p>
                </div>
              </div>

              {/* Kevin Obeegadoo */}
              <div className="p-8 rounded-[2.5rem] border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-transparent relative overflow-hidden shadow-2xl group hover:border-violet-500/50 transition-all">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Globe className="w-24 h-24 text-violet-500" />
                </div>
                <div className="flex flex-col items-center text-center relative z-10">
                  <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-r from-violet-500 to-violet-400 p-[2px] shadow-2xl mb-6">
                    <div className="w-full h-full rounded-[1.9rem] bg-zinc-900 flex items-center justify-center font-bold text-white text-3xl">KO</div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1 tracking-tight">Kevin Obeegadoo</h3>
                  <p className="text-violet-400 font-mono text-xs uppercase tracking-[0.2em] font-bold mb-4">Strategic Advisor</p>
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent mb-4" />
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-white/60 text-xs uppercase tracking-widest">Equity</span>
                    <span className="px-2 py-1 rounded-lg bg-violet-500/20 text-violet-400 text-xs font-bold">5%</span>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed">
                    Legal, Business Fundraising, & Market Expansion Strategy
                  </p>
                </div>
              </div>

              {/* Investor Pool */}
              <div className="p-8 rounded-[2.5rem] border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-transparent relative overflow-hidden shadow-2xl group hover:border-emerald-500/50 transition-all">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <DollarSign className="w-24 h-24 text-emerald-500" />
                </div>
                <div className="flex flex-col items-center text-center relative z-10">
                  <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-r from-emerald-500 to-emerald-400 p-[2px] shadow-2xl mb-6">
                    <div className="w-full h-full rounded-[1.9rem] bg-zinc-900 flex items-center justify-center font-bold text-white text-3xl">IP</div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1 tracking-tight">Investor Pool</h3>
                  <p className="text-emerald-400 font-mono text-xs uppercase tracking-[0.2em] font-bold mb-4">Seed + Series A</p>
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent mb-4" />
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-white/60 text-xs uppercase tracking-widest">Equity</span>
                    <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold">15%</span>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed">
                    Capital Injection & Network Scaling Infrastructure
                  </p>
                </div>
              </div>
            </div>

            {/* THE TRUNK: ORCHESTRATOR - Center Piece */}
            <div className="max-w-3xl mx-auto">
              <div className="p-10 rounded-[2.5rem] border border-white/20 bg-gradient-to-b from-white/[0.05] to-transparent relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-violet-500/5 to-emerald-500/5 pointer-events-none" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-cyan-500/50 to-transparent" />
                
                <div className="text-center relative z-10 pt-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500 via-violet-500 to-emerald-500 p-[2px] mb-6 shadow-2xl shadow-cyan-500/20">
                    <div className="w-full h-full rounded-[1.4rem] bg-zinc-900 flex items-center justify-center">
                      <Activity className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">APEX OS Orchestrator</h3>
                  <p className="text-white/40 font-mono text-xs uppercase tracking-[0.3em] font-bold mb-8">Neural_Command_Center // THE_TRUNK</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="text-2xl font-bold text-cyan-400 mb-1">99.99%</div>
                      <div className="text-[9px] text-white/30 uppercase font-bold tracking-widest">Uptime</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="text-2xl font-bold text-violet-400 mb-1">14,200+</div>
                      <div className="text-[9px] text-white/30 uppercase font-bold tracking-widest">Tasks/Day</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="text-2xl font-bold text-emerald-400 mb-1">36</div>
                      <div className="text-[9px] text-white/30 uppercase font-bold tracking-widest">Agents Active</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="text-2xl font-bold text-amber-400 mb-1">&lt;100ms</div>
                      <div className="text-[9px] text-white/30 uppercase font-bold tracking-widest">Latency</div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-t from-white/20 to-transparent" />
              </div>
            </div>

            {/* THE LEAVES: DEPARTMENTAL AGENTS - 10 Cards in 2 Rows */}
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">The Leaves</h3>
              <p className="text-white/40 px-2 font-mono text-xs uppercase tracking-widest">Departmental_Agents // 10_DEPARTMENTS</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {/* Row 1 */}
              <div className="p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/10 hover:border-cyan-500/30 transition-all group">
                <div className="inline-flex w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Building2 className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="text-white font-bold text-sm mb-1 uppercase tracking-wider">Infra-Architect</div>
                <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-3">System Design</div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] text-emerald-400 font-bold uppercase">Connected</span>
                </div>
              </div>

              <div className="p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/10 hover:border-rose-500/30 transition-all group">
                <div className="inline-flex w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6 text-rose-400" />
                </div>
                <div className="text-white font-bold text-sm mb-1 uppercase tracking-wider">Security-Monitor</div>
                <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-3">Threat Detection</div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] text-emerald-400 font-bold uppercase">Connected</span>
                </div>
              </div>

              <div className="p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/10 hover:border-emerald-500/30 transition-all group">
                <div className="inline-flex w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Landmark className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="text-white font-bold text-sm mb-1 uppercase tracking-wider">Compliance-Guard</div>
                <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-3">Policy Engine</div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] text-emerald-400 font-bold uppercase">Connected</span>
                </div>
              </div>

              <div className="p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/10 hover:border-violet-500/30 transition-all group">
                <div className="inline-flex w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Rocket className="w-6 h-6 text-violet-400" />
                </div>
                <div className="text-white font-bold text-sm mb-1 uppercase tracking-wider">Deploy-Automation</div>
                <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-3">CI/CD Pipeline</div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] text-emerald-400 font-bold uppercase">Connected</span>
                </div>
              </div>

              <div className="p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/10 hover:border-amber-500/30 transition-all group">
                <div className="inline-flex w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <AlertTriangle className="w-6 h-6 text-amber-400" />
                </div>
                <div className="text-white font-bold text-sm mb-1 uppercase tracking-wider">Incident-Response</div>
                <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-3">Crisis Management</div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] text-emerald-400 font-bold uppercase">Connected</span>
                </div>
              </div>

              {/* Row 2 */}
              <div className="p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/10 hover:border-emerald-500/30 transition-all group">
                <div className="inline-flex w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <DollarSign className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="text-white font-bold text-sm mb-1 uppercase tracking-wider">Cost-Optimizer</div>
                <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-3">Resource Efficiency</div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] text-emerald-400 font-bold uppercase">Connected</span>
                </div>
              </div>

              <div className="p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/10 hover:border-cyan-500/30 transition-all group">
                <div className="inline-flex w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Lightbulb className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="text-white font-bold text-sm mb-1 uppercase tracking-wider">Intel-Architect</div>
                <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-3">Strategy & Research</div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] text-emerald-400 font-bold uppercase">Connected</span>
                </div>
              </div>

              <div className="p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/10 hover:border-violet-500/30 transition-all group">
                <div className="inline-flex w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Monitor className="w-6 h-6 text-violet-400" />
                </div>
                <div className="text-white font-bold text-sm mb-1 uppercase tracking-wider">Brain-Monitor</div>
                <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-3">System Health</div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] text-emerald-400 font-bold uppercase">Connected</span>
                </div>
              </div>

              <div className="p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/10 hover:border-blue-500/30 transition-all group">
                <div className="inline-flex w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-white font-bold text-sm mb-1 uppercase tracking-wider">Knowledge-Monitor</div>
                <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-3">Documentation</div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] text-emerald-400 font-bold uppercase">Connected</span>
                </div>
              </div>

              <div className="p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/10 hover:border-fuchsia-500/30 transition-all group">
                <div className="inline-flex w-12 h-12 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/20 items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Award className="w-6 h-6 text-fuchsia-400" />
                </div>
                <div className="text-white font-bold text-sm mb-1 uppercase tracking-wider">Curriculum-Meta</div>
                <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-3">Learning Systems</div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] text-emerald-400 font-bold uppercase">Connected</span>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* RISKS */}
        {activeSection === 'risks' && (
          <motion.section
            key="risks"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-5xl font-bold text-white mb-2 ">Risk_Mitigation_Matrix</h2>
              <p className="text-white/60 px-2 font-mono text-xs uppercase tracking-widest">Sovereign Resilience // FAILSAFE_PROTOCOLS</p>
            </div>

            {/* Visual Risk Map */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative aspect-square max-w-md mx-auto w-full border border-white/10 rounded-full flex items-center justify-center p-8 bg-white/[0.01]">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-violet-500/5 rounded-full" />
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                  <div className="border-r border-b border-white/5 flex items-center justify-center text-[10px] text-white/20 uppercase font-mono">High Impact</div>
                  <div className="border-b border-white/5 flex items-center justify-center text-[10px] text-white/20 uppercase font-mono">Strategic</div>
                  <div className="border-r border-white/5 flex items-center justify-center text-[10px] text-white/20 uppercase font-mono">Operational</div>
                  <div className="flex items-center justify-center text-[10px] text-white/20 uppercase font-mono">Financial</div>
                </div>
                
                {/* Risk Nodes */}
                {[
                  { n: 'Conversion', x: '20%', y: '30%', c: 'cyan' },
                  { n: 'Competition', x: '70%', y: '25%', c: 'violet' },
                  { n: 'Tech Debt', x: '40%', y: '60%', c: 'emerald' },
                  { n: 'Market Fit', x: '65%', y: '75%', c: 'orange' }
                ].map((node, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.2 }}
                    className="absolute p-3 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md shadow-2xl group cursor-help"
                    style={{ left: node.x, top: node.y }}
                  >
                    <div className={`w-2 h-2 rounded-full bg-${node.c}-500 mb-1 group-hover:scale-150 transition-transform`} />
                    <span className="text-[8px] font-bold text-white uppercase tracking-tighter">{node.n}</span>
                  </motion.div>
                ))}
                <div className="text-white font-mono text-[10px] uppercase tracking-widest opacity-40">Resilience_Grid_v1</div>
              </div>

              <div className="space-y-6">
                {risks.map((risk, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-6 rounded-3xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                          <AlertTriangle className="w-5 h-5 text-amber-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">{risk.risk}</h3>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">{risk.probability} PROB</span>
                        <span className="text-[10px] text-red-400 uppercase font-bold tracking-widest">{risk.impact} IMPACT</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                      <p className="text-white/70 text-xs font-mono uppercase font-bold leading-relaxed">
                        <span className="text-emerald-400 font-bold mr-2 tracking-widest italic">Mitigation:</span> {risk.mitigation}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Strategic Moat Depth */}
            <div className="p-12 rounded-[3.5rem] border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-black to-transparent shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5">
                <ShieldCheck className="w-64 h-64 text-cyan-500" />
              </div>
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl sm:text-5xl font-bold text-white mb-8 leading-none italic">The_Technical<br/><span className="text-cyan-400">Handshake Moat</span></h3>
                  <p className="text-white/60 text-lg leading-relaxed mb-8 uppercase font-bold tracking-tight">
                    Our greatest defense is the integration of human founders with <span className="text-white">proprietary agentic workflows</span>. Competitors can copy the curriculum, but they cannot replicate the <span className="text-cyan-400">Handshake Command Center</span>.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="text-white font-bold text-xs uppercase mb-1 tracking-widest">Network Lock</div>
                      <p className="text-[10px] text-white/40 uppercase leading-relaxed font-bold">Closed-loop founder community with shared technical IP.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="text-white font-bold text-xs uppercase mb-1 tracking-widest">Compute Moat</div>
                      <p className="text-[10px] text-white/40 uppercase leading-relaxed font-bold">Direct integration with private high-throughput inference pools.</p>
                    </div>
                  </div>
                </div>
                <div className="p-10 rounded-[3rem] bg-black/60 border border-white/10 backdrop-blur-3xl text-center shadow-2xl">
                  <Fingerprint className="w-20 h-20 text-cyan-400 mx-auto mb-8 animate-pulse" />
                  <div className="text-4xl font-bold text-white mb-2 tracking-tighter uppercase italic">Uncopiable_Sovereignty</div>
                  <p className="text-white/40 text-[10px] font-mono uppercase tracking-[0.3em] mb-8 font-bold">Protocol_Alpha_Secured</p>
                  <button className="px-10 py-5 rounded-[1.5rem] bg-cyan-500 text-white font-bold uppercase tracking-widest text-xs hover:bg-cyan-600 transition-all shadow-2xl shadow-cyan-500/40 flex items-center gap-3 mx-auto">
                    Verify Resilience
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Footer CTA */}
      <section className="text-center py-20 border-t border-white/10 mt-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
        <h2 className="text-2xl sm:text-4xl font-bold text-white mb-6 ">Ready to Initialize Protocol?</h2>
        <p className="text-white/60 mb-10 max-w-2xl mx-auto px-4 font-mono text-xs uppercase tracking-widest leading-loose font-bold">
          This business plan represents a multi-million dollar opportunity. The infrastructure is built,
          the curriculum is validated, and 32,000 sovereign leads are awaiting handshake.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6 px-4 font-bold uppercase tracking-widest text-sm">
          <Link
            to="/academy"
            className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-[1.5rem] bg-gradient-to-r from-cyan-500 to-violet-500 text-white hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] transition-all active:scale-95"
          >
            <Rocket className="w-5 h-5" />
            Launch Academy
          </Link>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-[1.5rem] bg-white/5 text-white hover:bg-white/10 transition-all border border-white/10 backdrop-blur-xl active:scale-95"
          >
            <BarChart3 className="w-5 h-5" />
            Print Strategy
          </button>
        </div>
      </section>
    </main>
    </>
  );
};

export default ShowMeTheMoneyPage;
