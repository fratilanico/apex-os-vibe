import React, { useState, useCallback, useEffect } from 'react';
import { useOnboardingStore } from '../../stores/useOnboardingStore';

/* ── Background ── */
import { AmbientGlow } from '../ui/AmbientGlow';

/* ── Page sections (order matches scroll order) ── */
import { BrandingBar } from './BrandingBar';
import { TerminalSection } from './TerminalSection';
import { CommunitySection } from './CommunitySection';
import { CountdownSection } from './CountdownSection';
import { ComparisonSection } from './ComparisonSection';
import { ApplicationForm } from './ApplicationForm';
import { SuccessState } from './SuccessState';
import { WaitlistFooter } from './WaitlistFooter';

/* ── JARVIS + Vault ── */
import { JarvisFloatingButton } from '../jarvis/JarvisFloatingButton';
import { JarvisChatPanel } from '../jarvis/JarvisChatPanel';
import { NotionVaultOverlay } from '../NotionVaultOverlay';

// ═══════════════════════════════════════════════════════════════════════════════
// WAITLIST V3 — TERMINAL-FIRST (RESTORED)
// The terminal IS the hero. Same immersive layout that got partner approval.
// Backend: JARVIS, ApplicationForm, email delivery, Notion vault all intact.
// ═══════════════════════════════════════════════════════════════════════════════

const VAULT_URL = 'https://www.notion.so/infoacademy/APEX-OS-Founder-Bible-Placeholder';

interface SubmitResult {
  ai_score: number;
  referral_code: string;
  status: 'hot' | 'warm' | 'cold';
  rank: number;
}

const WaitlistPageV3: React.FC = () => {
  const [jarvisOpen, setJarvisOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);

  const isVaultOpen = useOnboardingStore((s) => s.isVaultOpen);
  const setVaultOpen = useOnboardingStore((s) => s.setVaultOpen);
  const setMode = useOnboardingStore((s) => s.setMode);
  const persona = useOnboardingStore((s) => s.persona);

  // Auto-activate GEEK mode on mount
  useEffect(() => { setMode('GEEK'); }, [setMode]);

  const handleSuccess = useCallback((data: SubmitResult) => {
    setResult(data);
    setSubmitted(true);
    requestAnimationFrame(() => {
      document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  // Persona-driven aura colors
  const getAuraColors = () => {
    if (persona === 'PERSONAL') {
      return [
        { color: 'cyan' as const, top: '-10%', left: '10%', size: 700, opacity: 0.15 },
        { color: 'cyan' as const, top: '40%', right: '-5%', size: 600, opacity: 0.12 },
        { color: 'emerald' as const, bottom: '20%', left: '-10%', size: 500, opacity: 0.1 },
        { color: 'cyan' as const, bottom: '-5%', right: '20%', size: 400, opacity: 0.08 },
      ];
    }
    if (persona === 'BUSINESS') {
      return [
        { color: 'violet' as const, top: '-10%', left: '10%', size: 700, opacity: 0.15 },
        { color: 'violet' as const, top: '40%', right: '-5%', size: 600, opacity: 0.12 },
        { color: 'pink' as const, bottom: '20%', left: '-10%', size: 500, opacity: 0.1 },
        { color: 'violet' as const, bottom: '-5%', right: '20%', size: 400, opacity: 0.08 },
      ];
    }
    return [
      { color: 'cyan' as const, top: '-10%', left: '10%', size: 600, opacity: 0.12 },
      { color: 'violet' as const, top: '30%', right: '-5%', size: 500, opacity: 0.1 },
      { color: 'emerald' as const, bottom: '20%', left: '-10%', size: 400, opacity: 0.08 },
      { color: 'pink' as const, bottom: '-5%', right: '20%', size: 350, opacity: 0.06 },
    ];
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-white overflow-x-hidden">
      {/* Background glow orbs — persona-driven */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {getAuraColors().map((glow, idx) => (
          <AmbientGlow
            key={idx}
            color={glow.color}
            top={glow.top}
            left={glow.left}
            right={glow.right}
            bottom={glow.bottom}
            size={glow.size}
            opacity={glow.opacity}
          />
        ))}
      </div>

      {/* Branding bar (fixed top) */}
      <BrandingBar />

      {/* Main content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 pt-20 pb-12">
        {/* 1. Minimal Hero Subtitle */}
        <div className="text-center py-8">
          <p className="text-xl md:text-2xl text-white/60 font-sans">
            Join 1,000 founders shipping products in 30 days.
          </p>
        </div>

        {/* 2. Terminal — THE HERO (70vh, full-width, CRT scanlines) */}
        <TerminalSection />

        {/* 3. Community cards */}
        <CommunitySection />

        {/* 4. Countdown */}
        <CountdownSection />

        {/* 5. Comparison (APEX vs Legacy) */}
        <ComparisonSection />

        {/* 6. Standard form (secondary fallback) */}
        <div className="py-16 text-center">
          <p className="text-sm text-white/40 mb-8 font-mono tracking-wider">
            Prefer a standard form?
          </p>
          <div id="apply">
            {submitted && result ? (
              <SuccessState
                aiScore={result.ai_score}
                rank={result.rank}
                referralCode={result.referral_code}
                status={result.status}
              />
            ) : (
              <ApplicationForm onSuccess={handleSuccess} />
            )}
          </div>
        </div>

        {/* 7. Footer */}
        <WaitlistFooter />
      </main>

      {/* JARVIS */}
      <JarvisFloatingButton onClick={() => setJarvisOpen(p => !p)} isOpen={jarvisOpen} />
      <JarvisChatPanel isOpen={jarvisOpen} onClose={() => setJarvisOpen(false)} />

      {/* Notion Vault */}
      <NotionVaultOverlay isOpen={isVaultOpen} onClose={() => setVaultOpen(false)} vaultUrl={VAULT_URL} />
    </div>
  );
};

export default WaitlistPageV3;
