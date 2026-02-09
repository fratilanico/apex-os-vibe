import React, { useState, useCallback, useEffect } from 'react';
import { useOnboardingStore } from '../../stores/useOnboardingStore';

/* ── Background ── */
import { AmbientGlow } from '../ui/AmbientGlow';

/* ── Page sections (SECTION 5 ALIGNMENT) ── */
import { BrandingBar } from './BrandingBar';
import { HeroSection } from './HeroSection';
import { CommunitySection } from './CommunitySection';
import { CountdownSection } from './CountdownSection';
import { ComparisonSection } from './ComparisonSection';
import { TerminalSection } from './TerminalSection';
import { ApplicationForm } from './ApplicationForm';
import { SuccessState } from './SuccessState';
import { WaitlistFooter } from './WaitlistFooter';

/* ── JARVIS + Vault ── */
import { JarvisFloatingButton } from '../jarvis/JarvisFloatingButton';
import { JarvisChatPanel } from '../jarvis/JarvisChatPanel';
import { NotionVaultOverlay } from '../NotionVaultOverlay';

/* ── Constants ── */
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

  // Auto-activate GEEK mode on mount (Operator Default)
  useEffect(() => { setMode('GEEK'); }, [setMode]);

  // Content Lock / Vault Access Check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('vault_access') === 'true') {
        setVaultOpen(true);
        // Clean URL so refresh doesn't re-trigger if logic changes
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [setVaultOpen]);

  const handleSuccess = useCallback((data: SubmitResult) => {
    setResult(data);
    setSubmitted(true);
    requestAnimationFrame(() => {
      document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  // Persona-driven aura colors - RESTORED to rich visible gradients
  const getAuraColors = () => {
    if (persona === 'PERSONAL') {
      return [
        { color: 'cyan' as const, top: '-10%', left: '10%', size: 800, opacity: 0.55 },
        { color: 'cyan' as const, top: '40%', right: '-5%', size: 700, opacity: 0.45 },
        { color: 'emerald' as const, bottom: '20%', left: '-10%', size: 600, opacity: 0.40 },
        { color: 'cyan' as const, bottom: '-5%', right: '20%', size: 500, opacity: 0.35 },
      ];
    }
    if (persona === 'BUSINESS') {
      return [
        { color: 'violet' as const, top: '-10%', left: '10%', size: 800, opacity: 0.55 },
        { color: 'violet' as const, top: '40%', right: '-5%', size: 700, opacity: 0.45 },
        { color: 'pink' as const, bottom: '20%', left: '-10%', size: 600, opacity: 0.40 },
        { color: 'violet' as const, bottom: '-5%', right: '20%', size: 500, opacity: 0.35 },
      ];
    }
    return [
      { color: 'cyan' as const, top: '-10%', left: '10%', size: 800, opacity: 0.55 },
      { color: 'violet' as const, top: '30%', right: '-5%', size: 700, opacity: 0.45 },
      { color: 'emerald' as const, bottom: '20%', left: '-10%', size: 600, opacity: 0.40 },
      { color: 'pink' as const, bottom: '-5%', right: '20%', size: 500, opacity: 0.35 },
    ];
  };

  const selectionColor = persona === 'BUSINESS' ? '#8b5cf6' : '#22d3ee';

  return (
    <div className="relative min-h-screen w-full text-white overflow-x-hidden"
         style={{ 
           background: 'linear-gradient(135deg, #0a1628 0%, #0d2137 25%, #0a2a3a 50%, #0d2137 75%, #0a1628 100%)'
         }}>
      <style>{`
        ::selection { background: ${selectionColor}33 !important; color: ${selectionColor} !important; }
        body { background: linear-gradient(135deg, #0a1628 0%, #0d2137 25%, #0a2a3a 50%, #0d2137 75%, #0a1628 100%) !important; }
      `}</style>
      
      {/* Background glow orbs - Rich teal/cyan gradient overlays */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Base ambient layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-violet-500/5" />
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

      {/* ── HUD ── */}
      <BrandingBar />

      {/* ── Main content ── */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 pt-20 pb-12">
        {/* 1. Hero (FOMO Engine) */}
        <HeroSection />

        {/* 5. Terminal — THE REVEAL (Restored to top position per user request) */}
        <div id="terminal-handshake" className="py-8 scroll-mt-24">
          <TerminalSection />
        </div>

        {/* 2. Community (Social Proof) */}
        <CommunitySection />

        {/* 3. Countdown (Urgency) */}
        <CountdownSection />

        {/* 4. Comparison (Problem/Solution) */}
        <ComparisonSection />

        {/* 2. Community (Social Proof) */}
        <CommunitySection />

        {/* 3. Countdown (Urgency) */}
        <CountdownSection />

        {/* 4. Comparison (Problem/Solution) */}
        <ComparisonSection />

        {/* 6. Legacy Form (Fallback) */}
        <div className="py-16 text-center opacity-60 hover:opacity-100 transition-opacity">
          <p className="text-sm text-white/40 mb-8 font-mono tracking-wider">
            // OR USE LEGACY PROTOCOL
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
        <div className="relative z-0">
          <WaitlistFooter />
        </div>
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
