import React from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// SIGNAL ENTRY HUB (SOVEREIGN STYLE)
// ═══════════════════════════════════════════════════════════════════════════════

const platforms = [
  {
    id: 'discord',
    name: 'Discord Neural Network',
    metric: '2,437',
    metricLabel: 'ACTIVE MEMBERS',
    action: 'JOIN SERVER',
    url: 'https://discord.gg/apexos',
    note: 'Run /waitlist to open the onboarding modal.',
  },
  {
    id: 'telegram',
    name: 'Telegram Signal Channel',
    metric: '890',
    metricLabel: 'SUBSCRIBERS',
    action: 'OPEN BOT',
    url: 'https://t.me/apexos_bot?start=waitlist',
    note: 'Start waitlist flow via bot command sequence.',
  },
  {
    id: 'waitlist',
    name: 'Module 00 Waitlist',
    metric: '1,000',
    metricLabel: 'SEAT CAP',
    action: 'INITIATE CONTACT',
    url: '#terminal-hero',
    note: 'Type contact inside the terminal to begin.',
  },
];

export const SocialHub: React.FC = () => {
  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="border border-cyan-500/20 bg-white/5 rounded-xl px-4 py-3 font-mono text-[10px] tracking-widest text-cyan-400 uppercase">
          Signal Entry Points // Community Protocol
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {platforms.map((platform) => (
            <a
              key={platform.id}
              href={platform.url}
              target={platform.id !== 'waitlist' ? '_blank' : undefined}
              rel={platform.id !== 'waitlist' ? 'noopener noreferrer' : undefined}
              className="border border-cyan-500/20 bg-black/60 rounded-2xl p-6 font-mono text-sm text-white/80 hover:border-cyan-400/60 transition-colors"
            >
              <div className="text-xs text-cyan-400 tracking-[0.2em] uppercase">{platform.name}</div>
              <div className="mt-3 text-3xl text-emerald-400 tabular-nums font-bold">{platform.metric}</div>
              <div className="text-[10px] text-white/50 tracking-widest">{platform.metricLabel}</div>
              <div className="mt-4 text-xs text-white/60">{platform.note}</div>
              <div className="mt-6 text-[11px] text-cyan-400 tracking-[0.2em] uppercase">{platform.action}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
