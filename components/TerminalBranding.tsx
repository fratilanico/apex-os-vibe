import React from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// APEX OS TERMINAL BRANDING (STABLE)
// Static sovereign HUD anchors to eliminate twitch
// ═══════════════════════════════════════════════════════════════════════════════

export const TerminalBranding: React.FC = () => {
  return (
    <>
      <div className="fixed top-6 left-6 z-50 hidden md:flex items-center gap-3 font-mono text-xs tracking-[0.3em] text-cyan-400">
        <span>APEX_OS</span>
        <span className="text-white/40">//</span>
        <span className="text-white/70">WAITLIST</span>
      </div>

      <div className="fixed top-6 right-6 z-50 hidden md:flex items-center gap-3 font-mono text-[10px] tracking-widest text-emerald-400">
        <span>STATUS</span>
        <span className="text-white/70">ACTIVE</span>
        <span className="text-emerald-400">[██████████]</span>
      </div>
    </>
  );
};

export const TerminalBrandingMobile: React.FC = () => {
  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center md:hidden">
      <div className="px-4 py-2 rounded-full font-mono text-[10px] font-bold tracking-wider border border-cyan-500/30 text-cyan-400 bg-black/80">
        APEX_OS // STATUS ACTIVE
      </div>
    </div>
  );
};
