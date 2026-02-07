import React from 'react';
import { motion } from 'framer-motion';
import { 
  Terminal, TrendingUp, DollarSign, Users
} from 'lucide-react';
import { SpectacularTerminal } from '../components/SpectacularTerminal';
import { JarvisIntegration } from '../components/jarvis/JarvisIntegration';

// ═══════════════════════════════════════════════════════════════════════════════
// APEX OS WAITING LIST - MASTERPIECE CONTAINER
// ═══════════════════════════════════════════════════════════════════════════════

const AnimatedGrid: React.FC = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-950 to-black" />
    <div className="absolute inset-0 opacity-20" style={{
      backgroundImage: `linear-gradient(rgba(6,182,212,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.1) 1px, transparent 1px)`,
      backgroundSize: '40px 40px',
    }} />
    <motion.div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 8, repeat: Infinity }} />
    <motion.div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 10, repeat: Infinity }} />
  </div>
);

const QuantWidget: React.FC<{ label: string, value: string, icon: any, color: string }> = ({ label, value, icon: Icon, color }) => (
  <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4 backdrop-blur-md">
    <div className={`p-2 rounded-lg bg-${color}-500/20`}>
      <Icon className={`w-5 h-5 text-${color}-400`} />
    </div>
    <div>
      <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{label}</p>
      <p className="text-lg font-bold text-white tracking-tight">{value}</p>
    </div>
  </div>
);

export default function WaitingListPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative font-mono">
      <AnimatedGrid />
      
      <div className="relative z-10 min-h-screen flex flex-col p-4 md:p-12">
        <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col gap-8">
          
          {/* HUD Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-6 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                <Terminal className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tighter text-white">APEX_OS <span className="text-cyan-400">HUD</span></h1>
                <p className="text-[10px] text-cyan-400/60 uppercase tracking-[0.3em]">Neural Interface Online</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <QuantWidget label="LTV:CAC" value="9.8:1" icon={TrendingUp} color="emerald" />
              <QuantWidget label="Year 1 Target" value="$501K" icon={DollarSign} color="cyan" />
              <QuantWidget label="Waitlist" value="2,855" icon={Users} color="violet" />
            </div>
          </div>

          {/* Terminal Component */}
          <SpectacularTerminal />

          {/* Footer Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-50 hover:opacity-100 transition-opacity">
            <div className="text-center p-4">
              <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Architecture</p>
              <p className="text-xs font-bold text-cyan-400 uppercase">Multi-Agent Cascade</p>
            </div>
            <div className="text-center p-4 border-x border-white/10">
              <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Infrastructure</p>
              <p className="text-xs font-bold text-emerald-400 uppercase">Vertex AI / GCP</p>
            </div>
            <div className="text-center p-4">
              <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Status</p>
              <p className="text-xs font-bold text-violet-400 uppercase">Mission: Module 00</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
