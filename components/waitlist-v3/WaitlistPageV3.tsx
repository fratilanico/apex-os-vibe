import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, Users, Globe, Clock, Target, Brain, Code, Sparkles,
  Terminal as TerminalIcon, TrendingUp, DollarSign, BarChart3,
  ShieldCheck, Cpu, Zap
} from 'lucide-react';
import { useOnboardingStore } from '../../stores/useOnboardingStore';

/* ── Page sections ── */
import { HeroSection } from './HeroSection';
import { ComparisonSection } from './ComparisonSection';
import { CommunitySection } from './CommunitySection';
import { ApplicationForm } from './ApplicationForm';
import { SuccessState } from './SuccessState';
import { WaitlistFooter } from './WaitlistFooter';
import { BrandingBar } from './BrandingBar';

/* ── JARVIS + Vault ── */
import { JarvisFloatingButton } from '../jarvis/JarvisFloatingButton';
import { JarvisChatPanel } from '../jarvis/JarvisChatPanel';
import { NotionVaultOverlay } from '../NotionVaultOverlay';

/* ── Branding ── */
import { TerminalBranding, TerminalBrandingMobile } from '../TerminalBranding';
import { SpectacularTerminal } from '../SpectacularTerminal';
import { AmbientGlow } from '../ui/AmbientGlow';

// ═══════════════════════════════════════════════════════════════════════════════
// WAITLIST V2.5 — IMMERSIVE HUD + FULL BACKEND + JARVIS
// Two-mode experience: STANDARD (CTA) → GEEK (cockpit HUD)
// Best of V2.1 interactive journey + V3 backend logic
// ═══════════════════════════════════════════════════════════════════════════════

const VAULT_URL = 'https://www.notion.so/infoacademy/APEX-OS-Founder-Bible-Placeholder';

/* ── QuantWidget (persona-reactive stat cards from V2.1) ── */
const QuantWidget: React.FC<{ label: string; value: string; icon: any; color: string }> = ({
  label, value, icon: Icon, color,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 backdrop-blur-md"
  >
    <div className={`p-2 rounded-lg bg-${color}-500/20`}>
      <Icon className={`w-4 h-4 text-${color}-400`} />
    </div>
    <div>
      <p className="text-[9px] font-mono text-white/40 uppercase tracking-widest">{label}</p>
      <p className="text-base font-bold text-white tracking-tight">{value}</p>
    </div>
  </motion.div>
);

/* ── OldVsNew comparison with animated tab switching ── */
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

  const items = activeTab === 'new' ? newFeatures : oldProblems;
  const isNew = activeTab === 'new';

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setActiveTab('new')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-[10px] font-mono uppercase tracking-widest border transition-all ${
            isNew
              ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-black border-transparent font-bold'
              : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
          }`}
        >
          APEX Protocol
        </button>
        <button
          onClick={() => setActiveTab('old')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-[10px] font-mono uppercase tracking-widest border transition-all ${
            !isNew
              ? 'bg-white text-black border-white font-bold'
              : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
          }`}
        >
          Legacy Way
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
          {items.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className={`p-3 rounded-xl bg-white/5 border border-white/10 ${!isNew ? 'opacity-60' : ''}`}>
              <div className="flex items-start gap-3">
                <div className={`p-1.5 rounded-lg ${isNew ? 'bg-cyan-500/20' : 'bg-white/10'}`}>
                  <f.icon className={`w-4 h-4 ${isNew ? 'text-cyan-400' : 'text-white/40'}`} />
                </div>
                <div>
                  <h3 className={`text-xs font-bold mb-0.5 ${isNew ? 'text-white' : 'text-white/60'}`}>{f.title}</h3>
                  <p className={`text-[10px] leading-relaxed ${isNew ? 'text-white/60' : 'text-white/40'}`}>{f.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

/* ── Countdown widget ── */
const TARGET_DAYS = 18;
const targetDate = new Date(Date.now() + TARGET_DAYS * 24 * 60 * 60 * 1000);

const CountdownWidget = () => {
  const [timeLeft, setTimeLeft] = useState(() => targetDate.getTime() - Date.now());

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(targetDate.getTime() - Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const totalSeconds = Math.floor(timeLeft / 1000);
  const countdown = {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };

  return (
    <div className="bg-black/40 border border-white/5 rounded-2xl p-5 backdrop-blur-md">
      <p className="text-[10px] text-white/40 uppercase tracking-widest mb-3">Webinar Countdown</p>
      <div className="grid grid-cols-4 gap-3 text-center">
        {Object.entries(countdown).map(([unit, val]) => (
          <div key={unit}>
            <p className="text-xl font-bold text-white">{String(val).padStart(2, '0')}</p>
            <p className="text-[8px] text-white/30 uppercase">{unit[0]}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Submit result type ── */
interface SubmitResult {
  ai_score: number;
  referral_code: string;
  status: 'hot' | 'warm' | 'cold';
  rank: number;
}

/* ════════════════════════════════════════════════════════════════════════ */
/*  MAIN PAGE — V2.5                                                       */
/* ════════════════════════════════════════════════════════════════════════ */

const WaitlistPageV3: React.FC = () => {
  const [jarvisOpen, setJarvisOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const { mode, setMode, persona, isUnlocked, isVaultOpen, setVaultOpen } = useOnboardingStore();

  useEffect(() => { setMode('GEEK'); }, [setMode]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleSuccess = useCallback((data: SubmitResult) => {
    setResult(data);
    setSubmitted(true);
    requestAnimationFrame(() => {
      document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  const auraColor = persona === 'BUSINESS' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(6, 182, 212, 0.15)';

  const getAuraColors = () => {
    if (persona === 'PERSONAL') {
      return [
        { color: 'cyan' as const, top: '-10%', left: '10%', size: 700, opacity: 0.15 },
        { color: 'emerald' as const, bottom: '20%', left: '-10%', size: 500, opacity: 0.1 },
      ];
    }
    if (persona === 'BUSINESS') {
      return [
        { color: 'violet' as const, top: '-10%', left: '10%', size: 700, opacity: 0.15 },
        { color: 'pink' as const, bottom: '20%', left: '-10%', size: 500, opacity: 0.1 },
      ];
    }
    return [
      { color: 'cyan' as const, top: '-10%', left: '10%', size: 600, opacity: 0.12 },
      { color: 'violet' as const, top: '30%', right: '-5%', size: 500, opacity: 0.1 },
    ];
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden font-mono selection:bg-cyan-500/30">
      {/* Dynamic Background — persona-driven aura morphing */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{ backgroundColor: auraColor }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
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
        {getAuraColors().map((glow, idx) => (
          <AmbientGlow key={idx} color={glow.color} top={glow.top} left={glow.left} right={glow.right} bottom={glow.bottom} size={glow.size} opacity={glow.opacity} />
        ))}
      </div>

      {/* Branding */}
      {!isMobile && <TerminalBranding />}
      {isMobile && <TerminalBrandingMobile />}
      <BrandingBar />

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 p-4 md:p-8 lg:p-12 pt-20">
        <div className="max-w-7xl mx-auto space-y-10">

          {/* ── HERO + QUANT WIDGETS ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7">
              <HeroSection />
            </div>
            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
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

          {/* ── MAIN HUD: Sidebar + Terminal ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[550px]">
            {/* Left sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <OldVsNewComparison />
              <CountdownWidget />
            </div>

            {/* Center — Terminal / Activate Geek Mode */}
            <div className="lg:col-span-8 flex flex-col">
              <AnimatePresence mode="wait">
                {mode === 'GEEK' ? (
                  <motion.div key="terminal" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="flex-1 flex flex-col">
                    <SpectacularTerminal />
                    <button onClick={() => setMode('STANDARD')} className="mt-3 text-[10px] text-white/20 hover:text-white/50 transition-colors self-center font-mono tracking-widest">
                      [ RETURN_TO_STANDARD_INTERFACE ]
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 flex flex-col items-center justify-center text-center space-y-8 h-full backdrop-blur-xl">
                    <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                      <TerminalIcon className="w-8 h-8 text-cyan-400" />
                    </div>
                    <div className="space-y-3">
                      <h2 className="text-2xl md:text-3xl font-bold">FOUNDER ONBOARDING</h2>
                      <p className="text-white/40 max-w-sm text-sm">Standard web forms are for legacy builders. Founders use the Direct Neural Uplink.</p>
                    </div>
                    <button onClick={() => setMode('GEEK')} className="group relative px-10 py-4 bg-cyan-500 text-black font-black rounded-xl overflow-hidden hover:scale-105 transition-transform text-sm tracking-wider">
                      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                      ACTIVATE GEEK MODE
                    </button>
                    <p className="text-[10px] text-white/20 uppercase tracking-widest pt-8">Encryption: AES-256 | Mode: Direct_Uplink_v2.5</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── Trophy on unlock ── */}
          {isUnlocked && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <div className="inline-block p-1 rounded-2xl bg-gradient-to-r from-cyan-500 via-emerald-500 to-violet-500">
                <div className="px-6 py-3 bg-black rounded-[14px] flex items-center gap-4">
                  <span className="text-amber-400 text-lg">🏆</span>
                  <span className="text-sm font-bold">NEURAL LINK SECURED</span>
                  <div className="w-px h-4 bg-white/10" />
                  <span className="text-xs text-white/60 italic">"You're in the system now, Player One."</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Community ── */}
          <CommunitySection />

          {/* ── Standard form fallback ── */}
          <div className="py-12 text-center">
            <p className="text-sm text-white/40 mb-8 font-mono tracking-wider">Prefer a standard form?</p>
            <div id="apply">
              {submitted && result ? (
                <SuccessState aiScore={result.ai_score} rank={result.rank} referralCode={result.referral_code} status={result.status} />
              ) : (
                <ApplicationForm onSuccess={handleSuccess} />
              )}
            </div>
          </div>

          {/* ── Footer ── */}
          <WaitlistFooter />
        </div>
      </div>

      {/* ── JARVIS ── */}
      <JarvisFloatingButton onClick={() => setJarvisOpen(p => !p)} isOpen={jarvisOpen} />
      <JarvisChatPanel isOpen={jarvisOpen} onClose={() => setJarvisOpen(false)} />

      {/* ── Notion Vault ── */}
      <NotionVaultOverlay isOpen={isVaultOpen} onClose={() => setVaultOpen(false)} vaultUrl={VAULT_URL} />
    </div>
  );
};

export default WaitlistPageV3;
