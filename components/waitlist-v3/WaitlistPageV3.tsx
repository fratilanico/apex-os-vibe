import React, { useState, useCallback, useEffect } from 'react';
import { useOnboardingStore } from '../../stores/useOnboardingStore';

/* ── Background ── */
import { AmbientGlow } from '../ui/AmbientGlow';
import { MatrixRain, Scanlines, GlitchOverlay, AsciiParticles, GeekModeIndicator } from '../effects/GeekModeEffects';

/* ── Page sections (SECTION 5 ALIGNMENT) ── */
import { BrandingBar } from './BrandingBar';
import { HeroSection } from './HeroSection';
import { CommunitySection } from './CommunitySection';
import { ComparisonSection } from './ComparisonSection';
import { TerminalSection } from './TerminalSection';
import { ApplicationForm } from './ApplicationForm';
import { SuccessState } from './SuccessState';
import { WaitlistFooter } from './WaitlistFooter';

/* ── JARVIS + Vault ── */
import { NotionVaultOverlay } from '../NotionVaultOverlay';

/* ── Constants ── */
const VAULT_URL = 'https://infoacademy-apexos.notion.site/ebd//301e9828402e808c81a9e7b43f69d845';

interface SubmitResult {
  ai_score: number;
  referral_code: string;
  status: 'hot' | 'warm' | 'cold';
  rank: number;
}

const WaitlistPageV3: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);

  const isVaultOpen = useOnboardingStore((s) => s.isVaultOpen);
  const setVaultOpen = useOnboardingStore((s) => s.setVaultOpen);
  const persona = useOnboardingStore((s) => s.persona);

  // Note: Geek mode starts OFF by default - users can toggle it on
  // This ensures optimal performance and lets users choose their experience

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

  const handleTerminalComplete = useCallback(async (data: { name: string; email: string; persona: 'PERSONAL' | 'BUSINESS' }) => {
    try {
      const res = await fetch('/api/waitlist/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          profileType: data.persona.toLowerCase(),
          mode: 'GEEK_V3',
          platform: 'terminal-handshake',
          version: '3.0_TERMINAL',
        }),
      });

      if (res.ok) {
        const result = await res.json();
        handleSuccess(result);
      }
    } catch (err) {
      console.error('Terminal submission failed:', err);
    }
  }, [handleSuccess]);

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
      { color: 'cyan' as const, bottom: '-5%', right: '20%', size: 400, opacity: 0.25 },
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
      
      {/* GEEK MODE EFFECTS */}
      <MatrixRain enabled={true} />
      <Scanlines />
      <GlitchOverlay />
      <AsciiParticles />

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
          <TerminalSection onComplete={handleTerminalComplete} />
        </div>

        {/* 2. Community (Social Proof) */}
        <CommunitySection />

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

      {/* Notion Vault */}
      <NotionVaultOverlay isOpen={isVaultOpen} onClose={() => setVaultOpen(false)} vaultUrl={VAULT_URL} />

      {/* Geek Mode Status Indicator */}
      <GeekModeIndicator />
    </div>
  );
};

export default WaitlistPageV3;
