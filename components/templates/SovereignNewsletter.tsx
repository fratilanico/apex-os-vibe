import React from 'react';
import { motion } from 'framer-motion';

interface SovereignNewsletterProps {
  title: string;
  date: string;
  summary: string;
  sections: Array<{
    title: string;
    content: string;
    arbitrage: string;
  }>;
}

export const SovereignNewsletter: React.FC<SovereignNewsletterProps> = ({ title, date, summary, sections }) => {
  return (
    <div className="max-w-2xl mx-auto bg-[#0a0a0a] text-white p-8 font-sans border border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
      {/* Header */}
      <div className="text-center mb-12 border-bottom border-cyan-500/30 pb-8">
        <div className="font-mono text-[10px] text-cyan-400 mb-2 tracking-[0.5em] uppercase">
          Neural Nexus Protocol
        </div>
        <h1 className="text-3xl font-mono font-black tracking-tight text-white uppercase mb-4 italic">
          {title}
        </h1>
        <div className="text-white/40 text-xs font-mono uppercase tracking-widest">
          Transmitted: {date}
        </div>
      </div>

      {/* The Hook */}
      <div className="mb-12 p-6 bg-cyan-500/5 border-l-4 border-cyan-500 italic text-white/80 leading-relaxed">
        {summary}
      </div>

      {/* Content Sections */}
      {sections.map((section, i) => (
        <div key={i} className="mb-12">
          <h2 className="text-lg font-mono font-bold text-cyan-400 uppercase mb-4 flex items-center gap-3">
            <span className="text-[10px] text-white/20">0{i+1}</span>
            {section.title}
          </h2>
          <div className="text-white/70 leading-relaxed mb-6 whitespace-pre-wrap">
            {section.content}
          </div>
          
          {/* Arbitrage Box */}
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
            <div className="font-mono text-[10px] text-emerald-400 mb-2 uppercase tracking-widest font-bold">
              Technical Arbitrage
            </div>
            <p className="text-[11px] text-emerald-100/70 font-mono">
              {section.arbitrage}
            </p>
          </div>
        </div>
      ))}

      {/* Footer */}
      <div className="mt-20 pt-8 border-t border-white/10 text-center">
        <div className="font-mono text-[10px] text-cyan-400/40 mb-4 tracking-[0.3em] uppercase">
          [██████████] Transmission Secure
        </div>
        <p className="text-white/20 text-[10px] uppercase tracking-widest">
          You are receiving this because you belong to the Sovereign technical class.
        </p>
      </div>
    </div>
  );
};
