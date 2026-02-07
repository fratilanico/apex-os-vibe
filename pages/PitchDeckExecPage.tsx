import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, Zap, Target, Users, Landmark, ArrowRight, CheckCircle2, Cpu, Brain, Workflow, Code2, Globe
} from 'lucide-react';

const PITCH_CONSTANTS = {
  leads: 32000,
  activeUsers: 2000,
  retention: 1.4,
  m18Target: 1000,
  seedAsk: 1200000,
  preMoney: 6800000,
  m18Arr: 1480000,
  cac: 150,
  ltv: 1500,
};

export const PitchDeckExecPage: React.FC = () => {
  const [jarvisMsg, setJarvisMsg] = useState("");
  const fullJarvisMsg = "GENERATING EXECUTIVE MEMO... SYNCING CORE ASSETS... ENCRYPTION ACTIVE.";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullJarvisMsg.length) {
        setJarvisMsg(fullJarvisMsg.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 30);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-[#030305] text-white font-sans selection:bg-cyan-500/30 pb-32">
      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-32 space-y-32 relative z-10">
        
        {/* HEADER / STATUS */}
        <header className="border-b border-white/10 pb-12">
          <div className="text-[10px] font-mono text-cyan-400 font-black uppercase tracking-[0.5em] mb-8">
            {jarvisMsg}
            <span className="inline-block w-1 h-3 bg-cyan-400 ml-1 animate-pulse" />
          </div>
          <h1 className="text-7xl font-black uppercase italic tracking-tighter mb-4 leading-none">32,000 Warm Leads.</h1>
          <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-emerald-400 uppercase leading-tight mb-12">One Accelerator.</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {[
              { label: 'The Ask', value: '$1.2M', color: 'cyan' },
              { label: 'Valuation', value: '$6.8M', color: 'violet' },
              { label: 'M18 ARR', value: '$1.48M', color: 'emerald' },
              { label: 'Retention', value: '1.4%', color: 'amber' },
            ].map((metric, idx) => (
              <div key={idx} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl">
                <div className={`text-2xl font-black text-${metric.color}-400 font-mono italic`}>{metric.value}</div>
                <div className="text-[8px] text-white/40 uppercase font-black tracking-widest mt-1">{metric.label}</div>
              </div>
            ))}
          </div>
        </header>

        {/* SECTION 01: THE HOOK */}
        <section className="space-y-12">
          <div className="space-y-4">
            <span className="text-xs font-black text-cyan-400 uppercase tracking-[0.4em] font-mono">01_THE_REVOLUTION</span>
            <h3 className="text-4xl font-black uppercase italic tracking-tighter leading-none">Leave the old ways behind.<br />Join the revolution.</h3>
          </div>
          <p className="text-white/60 text-xl leading-relaxed font-medium max-w-2xl">
            "Empowering 32,000 pre-existing clients to skip the outdated dev-cycle. Ship any product in 10 days with your own team of autonomous AI agents."
          </p>
          <div className="p-10 rounded-[3rem] border border-cyan-500/20 bg-cyan-500/5 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h4 className="text-white font-black uppercase text-sm mb-4">Legacy Asset Activation</h4>
                <p className="text-white/40 text-sm leading-relaxed">Leveraging the oldest IT Academy in Romania to convert a decade of trust into technical founders. 2,000 active core users already seeding the engine.</p>
              </div>
              <div className="text-center md:text-right">
                <div className="text-6xl font-black text-white font-mono tracking-tighter italic underline decoration-cyan-500/30 underline-offset-8 decoration-4">$0</div>
                <div className="text-[10px] text-cyan-400 uppercase font-black tracking-widest mt-2">Initial Acquisition Cost</div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 02: THE ENGINE */}
        <section className="space-y-16" style={{ breakInside: 'avoid' }}>
          <div className="space-y-4">
            <span className="text-xs font-black text-violet-400 uppercase tracking-[0.4em] font-mono">02_THE_ENGINE_ROOM</span>
            <h3 className="text-4xl font-black uppercase italic tracking-tighter leading-none">Founder Factory</h3>
          </div>
          <div className="space-y-8">
            {[
              { t: 'Strategic Root', d: 'Nicolae Fratila (CEO/POC CTO). Humans providing vision, risk, and innovation direction.', c: 'cyan', icon: Target },
              { t: 'Command Layer', d: 'Claude 4.5 Opus. Handling department strategy, logic, and architectural integrity.', c: 'rose', icon: Cpu },
              { t: 'Management', d: 'Claude 5 Sonnet. Quality gatekeeping, spec translation, and validation loops.', c: 'violet', icon: Brain },
              { t: 'Execution', d: 'Gemini 3 Flash. High-velocity component building and autonomous devops.', c: 'emerald', icon: ZapIcon },
            ].map((layer, i) => (
              <div key={i} className="flex gap-8 p-8 rounded-3xl border border-white/5 bg-white/[0.01] items-center">
                <div className={`w-12 h-12 rounded-2xl bg-${layer.c}-500/20 flex items-center justify-center shrink-0 shadow-lg shadow-${layer.c}-500/10`}>
                  <layer.icon className={`w-6 h-6 text-${layer.c}-400`} />
                </div>
                <div>
                  <h4 className="text-white font-black uppercase text-sm mb-1 italic">{layer.t}</h4>
                  <p className="text-white/40 text-xs font-medium uppercase tracking-tight">{layer.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 03: THE NUMBERS */}
        <section className="space-y-16" style={{ breakInside: 'avoid' }}>
          <div className="space-y-4">
            <span className="text-xs font-black text-emerald-400 uppercase tracking-[0.4em] font-mono">03_METRIC_CORE</span>
            <h3 className="text-4xl font-black uppercase italic tracking-tighter leading-none">Economics of Scale</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-10 rounded-[3rem] border border-emerald-500/20 bg-emerald-500/5 text-center">
              <div className="text-5xl font-black text-white font-mono mb-2 italic">9.8:1</div>
              <div className="text-[10px] text-emerald-400 uppercase font-black tracking-[0.2em]">Efficiency Ratio (Base Case)</div>
            </div>
            <div className="p-10 rounded-[3rem] border border-amber-500/20 bg-amber-500/5 text-center">
              <div className="text-5xl font-black text-white font-mono mb-2 italic">6:1</div>
              <div className="text-[10px] text-amber-400 uppercase font-black tracking-[0.2em]">Efficiency Ratio (Conservative)</div>
            </div>
          </div>
          <div className="p-12 rounded-[3rem] border border-white/5 bg-black/40 text-center">
            <div className="text-xs text-white/30 uppercase font-black tracking-widest mb-8">TAM / SAM / SOM</div>
            <div className="flex flex-col md:flex-row justify-around gap-12">
              <div>
                <div className="text-4xl font-black text-white font-mono italic">$36.2B</div>
                <div className="text-[8px] text-white/40 uppercase font-bold mt-1">Total Market</div>
              </div>
              <div className="w-px h-12 bg-white/5 hidden md:block" />
              <div>
                <div className="text-4xl font-black text-white font-mono italic">$8.4B</div>
                <div className="text-[8px] text-white/40 uppercase font-bold mt-1">Serviceable Pool</div>
              </div>
              <div className="w-px h-12 bg-white/5 hidden md:block" />
              <div>
                <div className="text-4xl font-black text-cyan-400 font-mono italic">$89M</div>
                <div className="text-[8px] text-white/40 uppercase font-bold mt-1">Target SOM</div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 04: THE ASK */}
        <footer className="pt-32 space-y-16" style={{ breakInside: 'avoid' }}>
          <div className="p-16 rounded-[4rem] border-2 border-violet-500/40 bg-violet-500/5 backdrop-blur-3xl text-center shadow-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
            <div className="relative z-10">
              <div className="text-xs font-black text-violet-400 uppercase tracking-[0.5em] font-mono mb-8">04_THE_SEED_ROUND</div>
              <h2 className="text-6xl font-black uppercase italic tracking-tighter text-white mb-12">$1.2M CAPITAL_INJECTION</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto mb-16 text-left">
                <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10">
                  <div className="text-3xl font-black text-white font-mono italic">$6.8M</div>
                  <div className="text-[9px] text-white/40 uppercase font-black mt-1">Pre-Money Valuation</div>
                </div>
                <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10">
                  <div className="text-3xl font-black text-white font-mono italic">15%</div>
                  <div className="text-[9px] text-white/40 uppercase font-black mt-1">Strategic Equity</div>
                </div>
              </div>
              <a href="https://calendly.com/fratilanico-vibecoderacademy" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-6 px-20 py-10 rounded-[2.5rem] bg-white text-black text-3xl font-black uppercase tracking-widest transition-all hover:bg-cyan-400 hover:shadow-3xl shadow-white/20">
                SECURE_CALL <ArrowRight className="w-10 h-10" />
              </a>
            </div>
          </div>
          <div className="text-center text-white/10 font-mono text-[8px] uppercase tracking-[0.6em] pt-12">
            2026_APEX_OS_SOVEREIGNTY_PROTOCOL // EXECUTIVE_MEMO_LOCKED
          </div>
        </footer>

      </div>
    </main>
  );
};

const ZapIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.71V21l5.19-2.81a2 2 0 0 1 1.81 0L16.19 21 20 17.71a2 2 0 0 0 .81-1.62v-9.01a2 2 0 0 0-1.19-1.83L12 2.35 4.38 5.25A2 2 0 0 0 3.19 7.08v7.63a2 2 0 0 0 .81 1.62Z"/><path d="M12 7v10"/><path d="M8 12h8"/></svg>
);

export default PitchDeckExecPage;
