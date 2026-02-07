import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, TrendingUp, DollarSign, Users, Activity, Brain
} from 'lucide-react';
import { SpectacularTerminal } from './SpectacularTerminal';
import { useOnboardingStore } from '../stores/useOnboardingStore';
import { TerminalBranding } from './TerminalBranding';

// ═══════════════════════════════════════════════════════════════════════════════
// WAITLIST V2 - MULTI-PANEL FOUNDER INTERFACE
// Real-time UI Morphing | Personal vs Business | Geek Mode Integrated
// ═══════════════════════════════════════════════════════════════════════════════

const QuantWidget: React.FC<{ label: string, value: string, icon: any, color: string }> = ({ label, value, icon: Icon, color }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
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

const ModuleAccessPanel = () => {
  const { isUnlocked } = useOnboardingStore();
  
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl h-full">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="w-5 h-5 text-cyan-400" />
        <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Curriculum Access</h3>
      </div>
      
      <div className="space-y-4">
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <p className="text-[10px] font-bold text-emerald-400 uppercase mb-1">Module 00: Foundation</p>
          <p className="text-[9px] text-white/60">ACCESS GRANTED: Protocol Onboarding</p>
        </div>
        
        <div className={`p-3 rounded-lg transition-all duration-500 ${isUnlocked ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-white/5 border-white/5 opacity-40'}`}>
          <p className={`text-[10px] font-bold uppercase mb-1 ${isUnlocked ? 'text-cyan-400' : 'text-white/40'}`}>Module 01: Build</p>
          <p className="text-[9px] text-white/60">{isUnlocked ? 'ACCESS GRANTED: Agent Orchestration' : 'LOCKED: Awaiting Neural Sync'}</p>
        </div>

        <div className="p-3 rounded-lg bg-white/5 border border-white/5 opacity-20">
          <p className="text-[10px] font-bold text-white/40 uppercase mb-1">Module 02: Scale</p>
          <p className="text-[9px] text-white/60">LOCKED: High-Value Target</p>
        </div>
      </div>
    </div>
  );
};

export const WaitlistV2: React.FC = () => {
  const { mode, persona, isTerminalOnly } = useOnboardingStore();
  const auraColor = persona === 'BUSINESS' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(6, 182, 212, 0.2)';

  return (
    <div className="h-screen w-screen bg-black text-white font-mono overflow-hidden relative selection:bg-cyan-500/30">
      <TerminalBranding />
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{ backgroundColor: auraColor }}
          className="absolute inset-0 opacity-20 transition-colors duration-1000"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] transition-colors duration-1000"
          style={{ backgroundColor: auraColor }}
        />
      </div>

      <div className="relative z-10 h-full flex flex-col p-6 gap-6">
        
        {/* HUD Header */}
        <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
              <Terminal className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase">APEX_OS <span className="text-cyan-400 font-bold">HUD</span></h1>
              <p className="text-[10px] text-cyan-400/60 uppercase tracking-[0.3em]">Neural Interface v2.1 // Mode: {mode}</p>
            </div>
          </div>
          
          <div className="hidden md:flex gap-4">
            <QuantWidget label="LTV:CAC" value="9.8:1" icon={TrendingUp} color="emerald" />
            <QuantWidget label="Year 1 Target" value="$501K" icon={DollarSign} color="cyan" />
            <QuantWidget label="Waitlist" value="2,855" icon={Users} color="violet" />
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
          
          {/* Left Metadata Panel (25%) */}
          <AnimatePresence>
            {!isTerminalOnly && (
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="col-span-3 flex flex-col gap-6 min-h-0"
              >
                {/* Dynamic Intelligence Feed */}
                <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl overflow-hidden flex flex-col">
                  <div className="flex items-center gap-2 mb-6">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Intelligence Feed</h3>
                  </div>
                  
                  <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar text-[11px]">
                    {persona === 'BUSINESS' ? (
                      <>
                        <div>
                          <p className="text-[10px] text-white/40 uppercase mb-2">Market Sovereignty</p>
                          <p className="leading-relaxed">Analyzing Enterprise AI TAM... $420B detected. Potential ROI for Agentic Orchestration: 12.4x.</p>
                        </div>
                        <div className="pt-4 border-t border-white/5">
                          <p className="text-[10px] text-white/40 uppercase mb-2">Swarm Projection</p>
                          <div className="h-20 w-full bg-white/5 rounded-lg border border-dashed border-white/10 flex items-center justify-center">
                            <span className="text-[10px] text-white/20 animate-pulse uppercase tracking-widest">Monitoring 17 Agents</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <p className="text-[10px] text-white/40 uppercase mb-2">Individual Arbitrage</p>
                          <p className="leading-relaxed">Vibe Coding Velocity: 94 pts. Neural throughput optimal. Token consumption trending below benchmark.</p>
                        </div>
                        <div className="pt-4 border-t border-white/5">
                          <p className="text-[10px] text-white/40 uppercase mb-2">Skill Progression</p>
                          <div className="space-y-3">
                            <div className="flex justify-between text-[9px] uppercase"><span className="text-cyan-400">Sovereign Core</span><span>Level 1</span></div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: '45%' }} className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Modules Overview */}
                <div className="h-1/3">
                  <ModuleAccessPanel />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Center Activity Panel (75% or 100%) */}
          <div className={`${isTerminalOnly ? 'col-span-12' : 'col-span-9'} flex flex-col min-h-0`}>
            <SpectacularTerminal />
          </div>

        </div>

        {/* Footer HUD */}
        <div className="flex items-center justify-between text-[10px] font-mono text-white/30 uppercase tracking-[0.5em] px-2">
          <div>© 2026 APEX OS // THE FUTURE BELONGS TO BUILDERS</div>
          <div className="flex gap-8">
            <span>Encryption: AES-256</span>
            <span>Uptime: 99.99%</span>
            <span>Latency: 42ms</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WaitlistV2;
