import React, { useState, useCallback } from 'react';
import { useOnboardingStore } from '../../stores/useOnboardingStore';

/* ------------------------------------------------------------------ */
/*  Background & UI primitives                                         */
/* ------------------------------------------------------------------ */
import { AmbientGlow } from '../ui/AmbientGlow';

/* ------------------------------------------------------------------ */
/*  Page sections (order matches scroll order)                         */
/* ------------------------------------------------------------------ */
import { BrandingBar } from './BrandingBar';
import { HeroSection } from './HeroSection';
import { CommunitySection } from './CommunitySection';
import { CountdownSection } from './CountdownSection';
import { TerminalSection } from './TerminalSection';
import { ComparisonSection } from './ComparisonSection';
import { ApplicationForm } from './ApplicationForm';
import { SuccessState } from './SuccessState';
import { WaitlistFooter } from './WaitlistFooter';

/* ------------------------------------------------------------------ */
/*  JARVIS + Vault                                                     */
/* ------------------------------------------------------------------ */
import { JarvisFloatingButton } from '../jarvis/JarvisFloatingButton';
import { JarvisChatPanel } from '../jarvis/JarvisChatPanel';
import { NotionVaultOverlay } from '../NotionVaultOverlay';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const VAULT_URL =
  'https://www.notion.so/infoacademy/APEX-OS-Founder-Bible-Placeholder';

/* ------------------------------------------------------------------ */
/*  Result type from ApplicationForm onSuccess                         */
/* ------------------------------------------------------------------ */
interface SubmitResult {
  ai_score: number;
  referral_code: string;
  status: 'hot' | 'warm' | 'cold';
  rank: number;
}

/* ================================================================== */
/*  WaitlistPageV3                                                     */
/* ================================================================== */

const WaitlistPageV3: React.FC = () => {
  /* ---- local state ---- */
  const [jarvisOpen, setJarvisOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);

  /* ---- store (vault) ---- */
  const isVaultOpen = useOnboardingStore((s) => s.isVaultOpen);
  const setVaultOpen = useOnboardingStore((s) => s.setVaultOpen);

  /* ---- handlers ---- */
  const handleSuccess = useCallback((data: SubmitResult) => {
    setResult(data);
    setSubmitted(true);

    // Scroll to #apply so user sees the SuccessState
    requestAnimationFrame(() => {
      const el = document.getElementById('apply');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  const handleJarvisToggle = useCallback(() => {
    setJarvisOpen((prev) => !prev);
  }, []);

  const handleJarvisClose = useCallback(() => {
    setJarvisOpen(false);
  }, []);

  /* ================================================================ */
  /*  Render                                                           */
  /* ================================================================ */
  return (
    <div className="relative min-h-screen w-full bg-black text-white overflow-x-hidden">
      {/* ── Background glow orbs (z-0, no pointer events) ── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <AmbientGlow color="cyan" top="-10%" left="10%" size={600} opacity={0.12} />
        <AmbientGlow color="violet" top="30%" right="-5%" size={500} opacity={0.1} />
        <AmbientGlow color="emerald" bottom="20%" left="-10%" size={400} opacity={0.08} />
        <AmbientGlow color="pink" bottom="-5%" right="20%" size={350} opacity={0.06} />
      </div>

      {/* ── Branding bar (fixed top, z-40) ── */}
      <BrandingBar />

      {/* ── Main content (z-10, scrollable) ── */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 pt-20 pb-12">
        {/* 1. Hero */}
        <HeroSection />

        {/* 2. Community cards */}
        <CommunitySection />

        {/* 3. Countdown */}
        <CountdownSection />

        {/* 4. Terminal */}
        <TerminalSection />

        {/* 5. Comparison (NEW vs OLD) */}
        <ComparisonSection />

        {/* 6. Application / Success */}
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

        {/* 7. Footer */}
        <WaitlistFooter />
      </main>

      {/* ── JARVIS floating button (z-50) ── */}
      <JarvisFloatingButton
        onClick={handleJarvisToggle}
        isOpen={jarvisOpen}
      />

      {/* ── JARVIS chat panel ── */}
      <JarvisChatPanel
        isOpen={jarvisOpen}
        onClose={handleJarvisClose}
      />

      {/* ── Notion Vault overlay (z-100) ── */}
      <NotionVaultOverlay
        isOpen={isVaultOpen}
        onClose={() => setVaultOpen(false)}
        vaultUrl={VAULT_URL}
      />
    </div>
  );
};

export default WaitlistPageV3;
