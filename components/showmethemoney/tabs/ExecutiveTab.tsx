import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Rocket, TrendingUp, Target, Users, ArrowRight,
  DollarSign, Globe, Award, Briefcase,
  Cpu, Shield, Clock, AlertTriangle, CheckCircle2,
  Zap, Lightbulb, TrendingUp as TrendingUpIcon
} from 'lucide-react';
import { MetricCard } from '../shared/MetricCard';

export const ExecutiveTab: React.FC = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  // Typewriter effect
  const [displayedSubtitle, setDisplayedSubtitle] = useState('');
  const subtitle = "Converting 32,000 warm leads from InfoAcademy into technical founders through AI-powered acceleration.";
  
  useEffect(() => {
    if (!isInView) return;
    let index = 0;
    const timer = setInterval(() => {
      if (index <= subtitle.length) {
        setDisplayedSubtitle(subtitle.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [isInView]);

  // REAL METRICS - Only verified data
  const realMetrics = [
    {
      value: 32,
      suffix: 'K',
      label: 'Warm Leads',
      sublabel: 'InfoAcademy customers',
      color: 'cyan' as const,
      icon: <Users className="w-5 h-5" />,
    },
    {
      value: 501,
      prefix: '$',
      suffix: 'K',
      label: 'Year 1 Revenue',
      sublabel: 'Projected from leads',
      color: 'emerald' as const,
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      value: 9.8,
      suffix: ':1',
      label: 'LTV:CAC Ratio',
      sublabel: 'Best-in-class economics',
      color: 'amber' as const,
      icon: <Target className="w-5 h-5" />,
    },
    {
      value: 1.2,
      prefix: '$',
      suffix: 'M',
      label: 'Seed Round',
      sublabel: 'Currently raising',
      color: 'violet' as const,
      icon: <Briefcase className="w-5 h-5" />,
    },
  ];

  // HYPOTHETICAL PORTFOLIO - Clearly marked as projections
  const hypotheticalPortfolio = [
    { name: 'Example: AI Automation Co', sector: 'Automation', projection: '8.5x', timeline: 'Year 3-5 Exit' },
    { name: 'Example: DevTools Startup', sector: 'Developer Tools', projection: '12x', timeline: 'Year 4-6 Exit' },
    { name: 'Example: Analytics Platform', sector: 'Data Analytics', projection: '6.5x', timeline: 'Year 3-5 Exit' },
    { name: 'Example: EdTech Venture', sector: 'Education', projection: '15x', timeline: 'Year 5-7 Exit' },
  ];

  // THE ACCELERATOR PHASES
  const acceleratorPhases = [
    { 
      phase: 'Intake', 
      duration: 'Days 1-3', 
      action: 'Select from warm lead pipeline',
      output: 'Cohort Selected',
      color: 'cyan'
    },
    { 
      phase: 'Build Sprint', 
      duration: 'Days 4-20', 
      action: '36-Agent swarm orchestration',
      output: 'MVP + GTM Strategy',
      color: 'violet'
    },
    { 
      phase: 'Launch', 
      duration: 'Days 21-30', 
      action: 'Ship to market + first customers',
      output: 'Revenue + Traction',
      color: 'amber'
    },
    { 
      phase: 'Portfolio', 
      duration: 'Ongoing', 
      action: '15% equity + active support',
      output: 'Series A Ready',
      color: 'emerald'
    },
  ];

  // ENGINE COMPONENTS
  const engineComponents = [
    { title: '32K Warm Leads', desc: 'InfoAcademy customers who paid for courses', icon: Users, color: 'cyan' },
    { title: '36-Agent Swarm', desc: 'Autonomous infrastructure orchestration', icon: Cpu, color: 'violet' },
    { title: 'WebContainer Moat', desc: 'Browser-native runtime - proprietary tech', icon: Shield, color: 'emerald' },
    { title: 'Aligned Incentives', desc: '15% equity - we win when founders win', icon: Briefcase, color: 'amber' },
  ];

  return (
    <div ref={containerRef} className="space-y-16">
      
      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1: THE HOOK - Real Assets & Opportunity
          ═══════════════════════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center relative min-h-[70vh] flex flex-col items-center justify-center"
      >
        {/* Background Glow */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-violet-500/20 via-cyan-500/20 to-emerald-500/20 rounded-full blur-[150px]" />
        </div>
        
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 mb-8 relative z-10"
        >
          <Rocket className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-bold text-violet-400 uppercase tracking-widest">
            The Hyperloop Accelerator
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight relative z-10"
        >
          32,000 Warm Leads
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-emerald-400">
            One Accelerator
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-xl sm:text-2xl text-white/60 max-w-3xl mx-auto mb-12 h-16 relative z-10"
        >
          {displayedSubtitle}
          <span className="animate-pulse text-violet-400">|</span>
        </motion.p>

        {/* Key Metrics - REAL DATA ONLY */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto relative z-10">
          {realMetrics.map((metric, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7 + idx * 0.1 }}
            >
              <MetricCard {...metric} />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2: THE ASSET - InfoAcademy Foundation
          ═══════════════════════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1.0 }}
        className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-violet-500/10 border border-cyan-500/30"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 mb-4">
              <Lightbulb className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-cyan-400 uppercase">Our Foundation</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">InfoAcademy: 32,000 Strong</h2>
            
            <p className="text-white/60 text-lg mb-6">
              We've already built InfoAcademy with <span className="text-cyan-400 font-bold">32,000 paying customers</span>. 
              These aren't cold leads—they're warm prospects who trust us, have learned from us, and are ready to build.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Paying Customers', value: '32,000+', icon: Users },
                { label: 'Course Completion', value: '68%', icon: Award },
                { label: 'NPS Score', value: '72', icon: TrendingUpIcon },
                { label: 'Countries', value: '12', icon: Globe },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <item.icon className="w-5 h-5 text-cyan-400 mb-2" />
                  <div className="text-2xl font-bold text-white">{item.value}</div>
                  <div className="text-xs text-white/40">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-black/40 border border-white/10">
            <h3 className="text-white font-bold mb-4">Why This Matters</h3>
            
            <div className="space-y-4">
              {[
                { title: 'Zero CAC', desc: 'We already paid to acquire these customers through InfoAcademy' },
                { title: 'Pre-Qualified', desc: 'They paid for courses = they have intent & capability' },
                { title: 'Trust Established', desc: 'They know us, our teaching style, our results' },
                { title: 'Ready to Build', desc: 'They have skills, now they need acceleration' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-white font-bold text-sm">{item.title}</h4>
                    <p className="text-white/50 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3: THE PROBLEM & SOLUTION
          ═══════════════════════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* The Problem */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-rose-500/10 to-amber-500/10 border border-rose-500/30">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 mb-4">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-bold text-rose-400 uppercase">The Gap</span>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">From Learner to Founder</h2>
          
          <p className="text-white/60 mb-6">
            Our 32,000 customers learned AI skills, but <span className="text-rose-400 font-bold">92% never start a company</span>. 
            They lack: systematic support, infrastructure, and velocity.
          </p>

          <div className="space-y-3">
            {[
              { label: 'Have Skills', value: '32,000', icon: CheckCircle2, color: 'emerald' },
              { label: 'Start Companies', value: '~2,500', icon: Users, color: 'amber' },
              { label: 'Succeed (8%)', value: '~200', icon: TrendingUpIcon, color: 'rose' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div className="flex items-center gap-3">
                  <item.icon className={`w-4 h-4 text-${item.color}-400`} />
                  <span className="text-white/60 text-sm">{item.label}</span>
                </div>
                <span className={`text-${item.color}-400 font-bold`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* The Solution */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-4">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400 uppercase">The Solution</span>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">The Hyperloop Bridge</h2>
          
          <p className="text-white/60 mb-6">
            We take the 32,000 who have skills and <span className="text-emerald-400 font-bold">bridge them to founder success</span> 
            through 30-day AI-powered acceleration.
          </p>

          <div className="space-y-3">
            {[
              { label: 'Intake', value: '500/year', desc: 'From 32K warm leads' },
              { label: 'Accelerator', value: '10/cohort', desc: '30-day sprint' },
              { label: 'Portfolio', value: '8/year', desc: '15% equity each' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div>
                  <span className="text-white font-bold text-sm">{item.label}</span>
                  <p className="text-white/40 text-xs">{item.desc}</p>
                </div>
                <span className="text-emerald-400 font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 4: THE ACCELERATOR - How It Works
          ═══════════════════════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1.4 }}
        className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-violet-500/10 via-cyan-500/5 to-emerald-500/10 border border-violet-500/30"
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/20 border border-violet-500/30 mb-4">
            <Rocket className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-bold text-violet-400 uppercase tracking-widest">The Engine</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">30-Day Sprint</h2>
          <p className="text-white/60">From warm lead to revenue-generating startup</p>
        </div>

        {/* The 4 Phases */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {acceleratorPhases.map((phase, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.6 + idx * 0.1 }}
              className={`p-6 rounded-2xl bg-${phase.color}-500/10 border border-${phase.color}-500/30 relative overflow-hidden`}
            >
              <div className={`absolute top-0 right-0 w-20 h-20 bg-${phase.color}-500/10 rounded-full blur-2xl`} />
              <div className="relative z-10">
                <div className={`text-xs font-bold text-${phase.color}-400 uppercase tracking-wider mb-2`}>{phase.duration}</div>
                <h3 className="text-xl font-bold text-white mb-2">{phase.phase}</h3>
                <p className="text-white/60 text-sm mb-3">{phase.action}</p>
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded bg-${phase.color}-500/20 text-${phase.color}-400 text-xs font-bold`}>
                  {phase.output}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Engine Components */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {engineComponents.map((component, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 2.0 + idx * 0.1 }}
              className="p-4 rounded-xl bg-white/5 border border-white/10 text-center hover:bg-white/[0.07] transition-all"
            >
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-${component.color}-500/20 mb-3`}>
                <component.icon className={`w-5 h-5 text-${component.color}-400`} />
              </div>
              <h4 className="text-white font-bold text-sm mb-1">{component.title}</h4>
              <p className="text-white/40 text-xs">{component.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 5: HYPOTHETICAL PORTFOLIO - Clearly Marked
          ═══════════════════════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 2.2 }}
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-2xl font-bold text-white">Projected Portfolio</h2>
            <p className="text-white/60 text-sm">Hypothetical returns based on 15% equity model</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-amber-400 uppercase font-bold px-2 py-1 rounded bg-amber-500/20 border border-amber-500/30">
              Projections Only
            </span>
          </div>
        </div>

        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <p className="text-amber-400/80 text-sm">
            <strong>Disclaimer:</strong> These are hypothetical examples showing potential returns 
            if we successfully accelerate companies to exit. No portfolio companies exist yet. 
            This illustrates the 15% equity model's potential at various exit multiples.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hypotheticalPortfolio.map((company, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 2.4 + idx * 0.1 }}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 border-dashed"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-white/60 font-bold italic">{company.name}</h3>
                  <span className="text-xs text-white/40">{company.sector}</span>
                </div>
                <span className="text-xl font-bold text-amber-400">{company.projection}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Clock className="w-3 h-3 text-white/40" />
                <span className="text-white/40">{company.timeline}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 6: THE ASK - Funding
          ═══════════════════════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 2.6 }}
        className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-violet-500/20 via-cyan-500/10 to-emerald-500/20 border-2 border-violet-500/40"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/30 border border-violet-500/50 mb-4">
              <Briefcase className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-bold text-violet-400 uppercase">The Ask</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">$1.2M Seed</h2>
            
            <p className="text-white/60 text-lg mb-6">
              To build the Hyperloop Accelerator and convert our 32,000 warm leads into 
              the next generation of AI-native founders.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Pre-Money', value: '$6.8M' },
                { label: 'Equity', value: '15%' },
                { label: 'Close', value: 'Q1 2026' },
              ].map((item, idx) => (
                <div key={idx} className="text-center p-3 rounded-xl bg-white/5">
                  <div className="text-white font-bold">{item.value}</div>
                  <div className="text-xs text-white/40">{item.label}</div>
                </div>
              ))}
            </div>

            <motion.a
              href="https://calendly.com/fratilanico-vibecoderacademy"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-violet-500 to-emerald-500 text-white font-bold text-lg shadow-lg shadow-violet-500/25"
            >
              Join the Hyperloop
              <ArrowRight className="w-5 h-5" />
            </motion.a>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-bold">Use of Funds</h3>
            {[
              { category: 'Accelerator Build', percentage: 40, amount: '$480K', color: 'cyan' },
              { category: 'Platform Development', percentage: 30, amount: '$360K', color: 'violet' },
              { category: 'Team Expansion', percentage: 20, amount: '$240K', color: 'emerald' },
              { category: 'Operations', percentage: 10, amount: '$120K', color: 'amber' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">{item.category}</span>
                  <span className={`text-${item.color}-400 font-bold`}>{item.amount}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${item.percentage}%` } : {}}
                    transition={{ delay: 2.8 + idx * 0.1, duration: 0.8 }}
                    className={`h-full bg-${item.color}-500 rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 6: TEAM & ORGANIZATION - Docker-Style Compartments
          ═══════════════════════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 3.0 }}
        className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 relative overflow-hidden"
      >
        {/* Background Network Grid */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(6,182,212,0.1)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="text-center mb-12 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-4">
            <Users className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-bold text-cyan-400 uppercase tracking-widest">Leadership & Operations</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">The Recursive Tree</h2>
          <p className="text-white/60">Human leadership + AI-powered operations</p>
        </div>

        {/* ROOT NODES - Human Leadership */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative z-10">
          {/* Nicolae */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 3.2 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/30 backdrop-blur-sm hover:border-cyan-500/50 transition-all group"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold shadow-lg shadow-cyan-500/20">
              NF
            </div>
            <h3 className="text-white font-bold text-lg text-center mb-1">Nicolae Fratila</h3>
            <p className="text-cyan-400 text-sm text-center mb-3">Founder & CEO</p>
            <div className="flex justify-center mb-3">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-bold">80% Equity</span>
            </div>
            <p className="text-white/50 text-xs text-center leading-relaxed">
              Built InfoAcademy to 32K paying customers. Full-stack architect with AI orchestration expertise.
            </p>
          </motion.div>

          {/* Kevin */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 3.3 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-violet-500/10 to-transparent border border-violet-500/30 backdrop-blur-sm hover:border-violet-500/50 transition-all group"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold shadow-lg shadow-violet-500/20">
              KO
            </div>
            <h3 className="text-white font-bold text-lg text-center mb-1">Kevin Obeegadoo</h3>
            <p className="text-violet-400 text-sm text-center mb-3">Strategic Advisor</p>
            <div className="flex justify-center mb-3">
              <span className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-400 text-sm font-bold">5% Equity</span>
            </div>
            <p className="text-white/50 text-xs text-center leading-relaxed">
              Fundraising strategy, business development, and investor network access.
            </p>
          </motion.div>

          {/* Investor Pool */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 3.4 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/30 backdrop-blur-sm hover:border-emerald-500/50 transition-all group"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-emerald-500/20">
              <DollarSign className="w-8 h-8" />
            </div>
            <h3 className="text-white font-bold text-lg text-center mb-1">Investor Pool</h3>
            <p className="text-emerald-400 text-sm text-center mb-3">Seed + Series A</p>
            <div className="flex justify-center mb-3">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-bold">15% Equity</span>
            </div>
            <p className="text-white/50 text-xs text-center leading-relaxed">
              Capital injection and network scaling for global expansion.
            </p>
          </motion.div>
        </div>

        {/* CENTRAL ORCHESTRATOR */}
        <div className="flex justify-center mb-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 3.5 }}
            className="p-8 rounded-3xl bg-gradient-to-br from-amber-500/20 via-violet-500/10 to-cyan-500/20 border-2 border-amber-500/40 backdrop-blur-md max-w-2xl w-full text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-violet-500/5 to-amber-500/5" />
            <div className="relative z-10">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500 via-violet-500 to-amber-500 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-violet-500/30">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">APEX Orchestrator</h3>
              <p className="text-amber-400 text-sm mb-4">AI-Powered Coordination Layer</p>
              <p className="text-white/60 text-sm max-w-md mx-auto">
                Central hub managing autonomous operations across all departments. 
                Enables scaling without proportional headcount growth.
              </p>
            </div>
          </motion.div>
        </div>

        {/* DOCKER-STYLE DEPARTMENT CONTAINERS */}
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-xs text-white/40 uppercase tracking-wider">AI-Powered Operations</span>
            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs">36 Agents // 6 Departments</span>
          </div>

          {/* Network Container */}
            <div className="relative">
              {/* Connection Lines SVG */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-0"
                style={{ top: '-20px', height: 'calc(100% + 40px)' }}
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              {/* Central hub to departments */}
              <motion.path
                d="M 50 0 L 16.66 100"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : {}}
                transition={{ delay: 3.6, duration: 0.8 }}
              />
              <motion.path
                d="M 50 0 L 33.33 100"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : {}}
                transition={{ delay: 3.7, duration: 0.8 }}
              />
              <motion.path
                d="M 50 0 L 50 100"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : {}}
                transition={{ delay: 3.8, duration: 0.8 }}
              />
              <motion.path
                d="M 50 0 L 66.66 100"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : {}}
                transition={{ delay: 3.9, duration: 0.8 }}
              />
              <motion.path
                d="M 50 0 L 83.33 100"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : {}}
                transition={{ delay: 4.0, duration: 0.8 }}
              />
            </svg>

            {/* Department Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative z-10">
              {[
                { 
                  name: 'Infrastructure', 
                  count: 8, 
                  color: 'cyan',
                  icon: '🔧',
                  functions: ['Cloud Architecture', 'DevOps', 'System Scaling']
                },
                { 
                  name: 'Security', 
                  count: 6, 
                  color: 'rose',
                  icon: '🛡️',
                  functions: ['Threat Detection', 'Compliance', 'Data Protection']
                },
                { 
                  name: 'Intelligence', 
                  count: 7, 
                  color: 'violet',
                  icon: '🧠',
                  functions: ['AI Research', 'Pattern Recognition', 'Analytics']
                },
                { 
                  name: 'Operations', 
                  count: 5, 
                  color: 'amber',
                  icon: '⚙️',
                  functions: ['Process Automation', 'Cost Optimization', 'Monitoring']
                },
                { 
                  name: 'Curriculum', 
                  count: 5, 
                  color: 'emerald',
                  icon: '📚',
                  functions: ['Content Creation', 'Learning Design', 'Assessments']
                },
                { 
                  name: 'Growth', 
                  count: 5, 
                  color: 'blue',
                  icon: '📈',
                  functions: ['Lead Generation', 'Conversion', 'Retention']
                },
              ].map((dept, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 3.6 + idx * 0.1 }}
                  className={`p-4 rounded-xl bg-${dept.color}-500/5 border border-${dept.color}-500/30 backdrop-blur-sm hover:bg-${dept.color}-500/10 hover:border-${dept.color}-500/50 transition-all group cursor-pointer`}
                >
                  <div className="text-2xl mb-2 text-center">{dept.icon}</div>
                  <div className={`text-2xl font-bold text-${dept.color}-400 text-center mb-1`}>{dept.count}</div>
                  <div className="text-white text-xs font-bold text-center mb-2">{dept.name}</div>
                  <div className="space-y-1">
                    {dept.functions.map((func, fidx) => (
                      <div key={fidx} className="text-white/40 text-xs text-center">{func}</div>
                    ))}
                  </div>
                  <div className={`mt-3 h-1 bg-${dept.color}-500/20 rounded-full overflow-hidden`}>
                    <div className={`h-full bg-${dept.color}-500 rounded-full`} style={{ width: `${(dept.count / 8) * 100}%` }} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 4.2 }}
          className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10 relative z-10"
        >
          <p className="text-white/40 text-xs text-center">
            <strong className="text-white/60">Note:</strong> The 36-agent swarm represents our 
            <span className="text-cyan-400"> architectural vision</span> for AI-powered operations. 
            Core automation systems currently deployed. Full swarm activation is a 
            <span className="text-amber-400"> development priority</span> post-seed funding.
          </p>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default ExecutiveTab;
