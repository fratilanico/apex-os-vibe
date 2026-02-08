import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {  
  Zap, Users, Globe, 
  Activity, Clock, Target, Brain, Code, Sparkles, Terminal as TerminalIcon,
  TrendingUp, DollarSign, BarChart3, ShieldCheck, Cpu
} from 'lucide-react';
import { TerminalBranding, TerminalBrandingMobile } from '../components/TerminalBranding';
import { SpectacularTerminal } from '../components/SpectacularTerminal';
import { useOnboardingStore } from '../stores/useOnboardingStore';

// ═══════════════════════════════════════════════════════════════════════════════
// APEX OS WAITLIST - SPECTACULAR EDITION (V2.1)
// Support for Personal, Business, and Geek Mode journeys with Aura Morphing
// ═══════════════════════════════════════════════════════════════════════════════

const TARGET_DAYS = 18;
const targetDate = new Date(Date.now() + TARGET_DAYS * 24 * 60 * 60 * 1000);

const QuantWidget: React.FC<{ label: string, value: string, icon: any, color: string }> = ({ label, value, icon: Icon, color }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4 backdrop-blur-md"
  >
    <div className={`p-2 rounded-lg bg-${color}-500/20`}>
      <Icon className={`w-5 h-5 text-${color}-400`} />
    </div>
    <div>
      <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{label}</p>
      <p className="text-lg font-bold text-white tracking-tight">{value}</p>
    </div>
  </motion.div>
);

const OldVsNewComparison = () => {
  const [activeTab, setActiveTab] = useState<'new' | 'old'>('new');

  const newFeatures = [
    { icon: Brain, title: '17-Agent AI Swarm', desc: 'Autonomous agents handle architecture, code, design, and deployment' },
    { icon: Sparkles, title: '30-Day Sprint', desc: 'Ship production-ready products in 30 days, not 6-12 months' },
    { icon: Target, title: 'GTM on Day 1', desc: 'Go-to-market strategy integrated from the start' },
    { icon: Code, title: 'Keep Your Equity', desc: 'No VC dilution. You own 100% of what you build' },
  ];

  const oldProblems = [
    { icon: Clock, title: '6-12 Month Cycles', desc: 'Traditional development takes forever to ship' },
    { icon: Activity, title: '$500K+ Burn Rate', desc: 'High costs before you even validate the idea' },
    { icon: Users, title: 'Slow Feedback Loops', desc: 'Market shifts before you can iterate' },
    { icon: Zap, title: 'Equity Dilution', desc: 'Give away 20-40% just to get started' },
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl h-full">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setActiveTab('new')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-mono uppercase tracking-widest border transition-all ${
            activeTab === 'new' 
              ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-black border-transparent font-bold' 
              : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
          }`}
        >
          APEX Protocol (NEW)
        </button>
        <button
          onClick={() => setActiveTab('old')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-mono uppercase tracking-widest border transition-all ${
            activeTab === 'old' 
              ? 'bg-white text-black border-white font-bold' 
              : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
          }`}
        >
          Legacy Way (OLD)
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'new' ? (
          <motion.div key="new" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 gap-4">
            {newFeatures.map((feature, index) => (
              <motion.div key={feature.title} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="p-4 rounded-2xl bg-white/5 border border-white/10 group">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-xl bg-cyan-500/20"><feature.icon className="w-5 h-5 text-cyan-400" /></div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">{feature.title}</h3>
                    <p className="text-xs text-white/60 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div key="old" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 gap-4">
            {oldProblems.map((problem, index) => (
              <motion.div key={problem.title} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="p-4 rounded-2xl bg-white/5 border border-white/10 opacity-60">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-xl bg-white/10"><problem.icon className="w-5 h-5 text-white/40" /></div>
                  <div>
                    <h3 className="text-sm font-bold text-white/60 mb-1">{problem.title}</h3>
                    <p className="text-xs text-white/40 leading-relaxed">{problem.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function WaitlistPage() {
  const { mode, setMode, persona, isUnlocked } = useOnboardingStore();
  const [timeLeft, setTimeLeft] = useState(() => targetDate.getTime() - Date.now());
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(targetDate.getTime() - Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    return {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60
    };
  };

  const countdown = formatCountdown(timeLeft);
  const auraColor = persona === 'BUSINESS' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(6, 182, 212, 0.15)';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden font-mono selection:bg-cyan-500/30">
      {!isMobile && <TerminalBranding />}
      {isMobile && <TerminalBrandingMobile />}

      {/* Dynamic Background Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{ backgroundColor: auraColor }}
          transition={{ duration: 2 }}
          className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" 
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], x: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] transition-colors duration-1000"
          style={{ backgroundColor: auraColor }}
        />
        <motion.div 
          animate={{ scale: [1.1, 1, 1.1], x: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[150px] transition-colors duration-1000 opacity-50"
          style={{ backgroundColor: auraColor }}
        />
      </div>

      <div className="relative z-10 p-4 md:p-12 lg:p-20">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Header HUD */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-[0.3em] text-cyan-400 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Cohort 001 Active Handshake
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6">
                  BUILD AT <br />
                  <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">AI SPEED.</span>
                </h1>
                <p className="text-white/50 text-lg max-w-xl leading-relaxed">
                  Join the elite swarm of founders shipping products in 10 days. 
                  Zero equity. Full sovereignty. Absolute velocity.
                </p>
              </motion.div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <AnimatePresence mode="wait">
                {persona === 'BUSINESS' ? (
                  <>
                    <QuantWidget key="tam" label="Market TAM" value="$420B" icon={Globe} color="violet" />
                    <QuantWidget key="roi" label="Agentic ROI" value="12.4x" icon={TrendingUp} color="violet" />
                    <QuantWidget key="swarm" label="Active Swarm" value="17 Agents" icon={Cpu} color="violet" />
                    <QuantWidget key="sec" label="Compliance" value="SOC2 Ready" icon={ShieldCheck} color="violet" />
                  </>
                ) : (
                  <>
                    <QuantWidget key="vel" label="Vibe Velocity" value="94 pts" icon={Activity} color="cyan" />
                    <QuantWidget key="ltv" label="LTV:CAC" value="9.8:1" icon={DollarSign} color="cyan" />
                    <QuantWidget key="users" label="Waitlist" value="2,855" icon={Users} color="cyan" />
                    <QuantWidget key="skill" label="Skill Tier" value="Sovereign" icon={BarChart3} color="cyan" />
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Main Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[600px]">
            {/* Left Sidebar - Comparison */}
            <div className="lg:col-span-4 space-y-8">
              <OldVsNewComparison />
              
              {/* Webinar Countdown */}
              <div className="bg-black/40 border border-white/5 rounded-3xl p-6 backdrop-blur-md">
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-4">Webinar Countdown</p>
                <div className="grid grid-cols-4 gap-4 text-center">
                  {Object.entries(countdown).map(([unit, val]) => (
                    <div key={unit}>
                      <p className="text-2xl font-bold text-white">{String(val).padStart(2, '0')}</p>
                      <p className="text-[8px] text-white/30 uppercase">{unit[0]}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Center Piece - Terminal / Form */}
            <div className="lg:col-span-8 flex flex-col">
              <AnimatePresence mode="wait">
                {mode === 'GEEK' ? (
                  <motion.div 
                    key="terminal"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="flex-1 flex flex-col"
                  >
                    <SpectacularTerminal />
                    <button 
                      onClick={() => setMode('STANDARD')}
                      className="mt-4 text-[10px] text-white/20 hover:text-white transition-colors self-center"
                    >
                      [ RETURN_TO_STANDARD_INTERFACE ]
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white/5 border border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center text-center space-y-8 h-full backdrop-blur-xl"
                  >
                    <div className="w-20 h-20 rounded-3xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                      <TerminalIcon className="w-10 h-10 text-cyan-400" />
                    </div>
                    <div className="space-y-4">
                      <h2 className="text-3xl font-bold">FOUNDER ONBOARDING</h2>
                      <p className="text-white/40 max-w-sm">Standard web forms are for legacy builders. Founders use the Direct Neural Uplink.</p>
                    </div>
                    
                    <button 
                      onClick={() => setMode('GEEK')}
                      className="group relative px-12 py-5 bg-cyan-500 text-black font-black rounded-2xl overflow-hidden hover:scale-105 transition-transform"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                      ACTIVATE GEEK MODE
                    </button>

                    <p className="text-[10px] text-white/20 uppercase tracking-widest pt-12">Encryption: AES-256 | Mode: Direct_Uplink_v2.1</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Success / Final Reward Layer */}
          {isUnlocked && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pt-12 text-center">
              <div className="inline-block p-1 rounded-2xl bg-gradient-to-r from-cyan-500 via-emerald-500 to-violet-500">
                <div className="px-8 py-4 bg-black rounded-[14px] flex items-center gap-4">
                  <TrophyIcon className="w-5 h-5 text-amber-400" />
                  <span className="text-sm font-bold">NEURAL LINK SECURED</span>
                  <div className="w-px h-4 bg-white/10" />
                  <span className="text-xs text-white/60 italic">"You're in the system now, Player One."</span>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>

      <footer className="relative z-10 py-12 text-center opacity-30 text-[10px] tracking-[0.5em] uppercase">
        APEX OS // THE OPERATING SYSTEM FOR THE AI AGE // 2026
      </footer>
    </div>
  );
}

const TrophyIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
  </svg>
);
