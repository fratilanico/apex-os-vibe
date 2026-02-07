import { TerminalBranding, TerminalBrandingMobile } from '../components/TerminalBranding';
import { SocialHub } from '../components/SocialHub';
import { TerminalHero } from '../components/TerminalHero';

const TELEMETRY = [
  {
    title: 'GitHub AI commits',
    value: '4% -> 20% by 2026',
    source: 'GitHub Octoverse 2024',
    action: 'ARBITRAGE: control surface for AI output',
  },
  {
    title: 'Task horizon',
    value: 'Doubles every 4-7 months',
    source: 'METR 2025',
    action: 'ACTION: compress execution cycles to 10 days',
  },
  {
    title: 'Enterprise training',
    value: '30,000 Claude professionals',
    source: 'Accenture 2025',
    action: 'ARBITRAGE: enterprise adoption is locked',
  },
  {
    title: 'Tokenomics flip',
    value: 'Tokens -> orchestrated outcomes',
    source: 'SemiAnalysis 2026',
    action: 'ACTION: sell execution, not seats',
  },
  {
    title: 'Info-work TAM',
    value: '$15T knowledge economy',
    source: 'Macro synthesis 2026',
    action: 'ARBITRAGE: control layer scales globally',
  },
];

const PROGRESS = [
  { label: 'Cohort Fill', value: '78%', bar: 78, note: '1,000 seats' },
  { label: 'Module 00 Readiness', value: '92%', bar: 92, note: 'Terminal online' },
  { label: 'Distribution Asset', value: '64%', bar: 64, note: '32K lead base' },
  { label: 'Agent Swarm', value: '88%', bar: 88, note: '17 agents active' },
];

const MODULE_TRACK = [
  { title: 'Module 00', subtitle: 'Free entry', status: 'ACTIVE' },
  { title: 'Modules 01-03', subtitle: 'Subscription core', status: 'LOCKED' },
  { title: 'Modules 04-08', subtitle: 'Revenue expansion', status: 'LOCKED' },
  { title: 'Accelerator', subtitle: 'Equity upside', status: 'LOCKED' },
];

const EXECUTION_LOG = [
  { time: '2026-02-06', item: 'Module 00 Terminal UI', action: 'SHIPPED' },
  { time: '2026-02-06', item: 'Waitlist notify pipeline', action: 'ACTIVE' },
  { time: '2026-02-06', item: 'Risk matrix annexes', action: 'DELIVERED' },
  { time: '2026-02-06', item: 'Investor summary v1', action: 'PUBLISHED' },
  { time: '2026-02-06', item: 'Signal entry hub', action: 'ONLINE' },
];

export default function WaitlistPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <TerminalBranding />
      <TerminalBrandingMobile />

      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#111118] to-[#0a0a0a]" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'linear-gradient(rgba(6,182,212,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.15) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />
      </div>

      <div className="relative z-10">
        <section className="pt-24 pb-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <img
                src="/assets/apex-ascii-logo-ultra.png"
                alt="APEX OS"
                className="mx-auto w-full max-w-3xl"
              />
            </div>

            <div className="mt-6 border border-cyan-500/20 bg-white/5 rounded-xl px-4 py-3 font-mono text-[10px] tracking-widest text-cyan-400 uppercase">
              Protocol: Waitlist 2026 // Status: Sovereign Mandate
            </div>

            <pre className="mt-6 font-mono text-[11px] text-white/80 bg-black/60 border border-cyan-500/30 rounded-xl p-4 whitespace-pre-wrap">{`╔══════════════════════════════════════════════════════════════════════════════╗
║  PROOF: 10-DAY BUILD TO PRODUCTION MVP                                      ║
║  DISTRIBUTION: 32K WARM LEADS TO $0 CAC LAUNCH                               ║
║  POSITIONING: SOVEREIGN ORCHESTRATION LAYER                                 ║
╚══════════════════════════════════════════════════════════════════════════════╝`}</pre>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {PROGRESS.map((item) => (
                <div key={item.label} className="border border-cyan-500/20 bg-black/70 rounded-xl p-4">
                  <div className="flex items-center justify-between text-xs font-mono text-white/60">
                    <span>{item.label}</span>
                    <span className="text-cyan-400 tabular-nums">{item.value}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                      style={{ width: `${item.bar}%` }}
                    />
                  </div>
                  <div className="mt-2 text-[10px] font-mono text-white/40 tracking-widest">{item.note}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-4">
              {TELEMETRY.map((item) => (
                <div key={item.title} className="border border-cyan-500/20 bg-black/60 rounded-xl p-4">
                  <div className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase">{item.title}</div>
                  <div className="mt-2 text-sm text-white/80 font-semibold">{item.value}</div>
                  <div className="mt-2 text-[10px] text-white/40">{item.source}</div>
                  <div className="mt-3 text-[10px] text-emerald-300 font-mono">{item.action}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-cyan-500/20 pt-4 text-[10px] font-mono text-white/40 flex flex-wrap gap-4 justify-between">
              <span>Sources: GitHub Octoverse 2024</span>
              <span>Sources: METR 2025</span>
              <span>Sources: Accenture 2025</span>
              <span>Sources: SemiAnalysis 2026</span>
              <span>Sources: Macro Synthesis 2026</span>
            </div>
          </div>
        </section>

        <SocialHub />

        <section className="py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="border border-cyan-500/20 bg-white/5 rounded-xl px-4 py-3 font-mono text-[10px] tracking-widest text-cyan-400 uppercase">
              Great Divide // Old World vs APEX OS
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-white/10 bg-black/60 rounded-2xl p-6">
                <div className="text-xs font-mono text-white/50 tracking-widest uppercase">Old World</div>
                <div className="mt-4 space-y-2 text-sm text-white/60">
                  <div>6-12 months to MVP</div>
                  <div>$500K+ burn before validation</div>
                  <div>20-40% equity dilution</div>
                  <div>Slow GTM and late feedback</div>
                </div>
              </div>
              <div className="border border-cyan-500/30 bg-black/70 rounded-2xl p-6">
                <div className="text-xs font-mono text-cyan-400 tracking-widest uppercase">APEX OS Way</div>
                <div className="mt-4 space-y-2 text-sm text-white/80">
                  <div>10 days to production MVP</div>
                  <div>$200/mo AI-native stack</div>
                  <div>Founders keep 100% equity</div>
                  <div>GTM on day one</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="border border-cyan-500/20 bg-white/5 rounded-xl px-4 py-3 font-mono text-[10px] tracking-widest text-cyan-400 uppercase">
              Module Track // Sovereign Progression
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              {MODULE_TRACK.map((module) => (
                <div key={module.title} className="border border-cyan-500/20 bg-black/70 rounded-xl p-4">
                  <div className="text-sm font-mono text-cyan-400 uppercase tracking-wider">{module.title}</div>
                  <div className="mt-2 text-xs text-white/60">{module.subtitle}</div>
                  <div className="mt-4 text-[10px] font-mono text-emerald-400">[{module.status}]</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-cyan-500/20 bg-black/70 rounded-2xl p-6">
              <div className="text-xs font-mono text-cyan-400 tracking-widest uppercase">Distribution Asset</div>
              <div className="mt-4 text-sm text-white/80">
                32,000 warm leads from InfoAcademy. $0 CAC launch pad with immediate activation potential.
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 text-[11px] text-white/60">
                <div className="border border-white/10 rounded-lg p-3">RO + Serbia partner relay</div>
                <div className="border border-white/10 rounded-lg p-3">Orange Romania B2B channel</div>
                <div className="border border-white/10 rounded-lg p-3">Agentic outreach engine</div>
                <div className="border border-white/10 rounded-lg p-3">Community referral loop</div>
              </div>
            </div>
            <div className="border border-cyan-500/20 bg-black/70 rounded-2xl p-6">
              <div className="text-xs font-mono text-cyan-400 tracking-widest uppercase">Execution Ledger</div>
              <div className="mt-4 space-y-3 text-[11px] font-mono text-white/70">
                {EXECUTION_LOG.map((entry) => (
                  <div key={entry.item} className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="tabular-nums">{entry.time}</span>
                    <span className="text-white/60">{entry.item}</span>
                    <span className="text-emerald-400">[{entry.action}]</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <TerminalHero />

        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="border border-cyan-500/30 bg-black/70 rounded-2xl p-6 font-mono text-sm text-white/80">
              We are not an edtech company. We are the sovereign orchestration layer for founders who refuse to dilute, delay, or surrender velocity.
            </div>
            <div className="mt-6 text-xs font-mono text-emerald-400">[██████████] SYSTEM STATUS: OPTIMIZED</div>
          </div>
        </section>

        <footer className="py-8 px-6 text-center">
          <div className="text-white/30 text-xs font-mono">© 2026 APEX OS | Built for founders | Sovereign execution layer</div>
        </footer>
      </div>
    </div>
  );
}
