import React from 'react';
import { useOnboardingStore } from '../../stores/useOnboardingStore';
import { AmbientGlow } from '../ui/AmbientGlow';
import { MatrixRain, Scanlines, GlitchOverlay, AsciiParticles } from '../effects/GeekModeEffects';
import { BrandingBar } from './BrandingBar';
import { HeroSection } from './HeroSection';
import { CommunitySection } from './CommunitySection';
import { ComparisonSection } from './ComparisonSection';
import { TerminalSection } from './TerminalSection';
import { ApplicationForm } from './ApplicationForm';
import { SuccessState } from './SuccessState';
import { WaitlistFooter } from './WaitlistFooter';
import { JarvisFloatingButton } from '../jarvis/JarvisFloatingButton';
import { JarvisChatPanel } from '../jarvis/JarvisChatPanel';
import { NotionVaultOverlay } from '../NotionVaultOverlay';

const VAULT_URL = 'https://infoacademy.notion.site/ebd/301e9828402e808c81a9e7b43f69d845';

interface SubmitResult {
  ai_score: number;
  referral_code: string;
  status: 'hot' | 'warm' | 'cold';
  rank: number;
}

const WaitlistPageV3: React.FC = () => {
  const [jarvisOpen, setJarvisOpen] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [result, setResult] = React.useState<SubmitResult | null>(null);

  const { isVaultOpen, setVaultOpen, mode, setMode, persona } = useOnboardingStore();

  React.useEffect(() => { setMode('GEEK'); }, [setMode]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('vault_access') === 'true') {
        setVaultOpen(true);
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [setVaultOpen]);

  const handleSuccess = React.useCallback((data: SubmitResult) => {
    setResult(data);
    setSubmitted(true);
    requestAnimationFrame(() => {
      document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  const getAuraColors = () => {
    if (persona === 'PERSONAL') return [
      { color: 'cyan' as const, top: '-10%', left: '10%', size: 800, opacity: 0.55 },
      { color: 'cyan' as const, top: '40%', right: '-5%', size: 700, opacity: 0.45 },
    ];
    if (persona === 'BUSINESS') return [
      { color: 'violet' as const, top: '-10%', left: '10%', size: 800, opacity: 0.55 },
      { color: 'pink' as const, top: '40%', right: '-5%', size: 700, opacity: 0.45 },
    ];
    return [
      { color: 'cyan' as const, top: '-10%', left: '10%', size: 800, opacity: 0.55 },
      { color: 'violet' as const, top: '30%', right: '-5%', size: 700, opacity: 0.45 },
    ];
  };

  // Teal to Purple gradient background
  const backgroundStyle = {
    background: 'linear-gradient(135deg, #0d3b3b 0%, #0d4a4a 25%, #1a3a52 50%, #2d1b4e 75%, #1a0f2e 100%)'
  };

  return (
    <div className="relative min-h-screen w-full text-white overflow-x-hidden" style={backgroundStyle}>
      <MatrixRain enabled={mode === 'GEEK'} />
      {mode === 'GEEK' && <><Scanlines /><GlitchOverlay /><AsciiParticles /></>}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {getAuraColors().map((glow, idx) => <AmbientGlow key={idx} {...glow} />)}
      </div>
      <BrandingBar geekMode={mode === 'GEEK'} onToggleGeek={() => setMode(mode === 'GEEK' ? 'STANDARD' : 'GEEK')} />
      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-16 pb-12">
        <HeroSection />
        <div id="terminal-handshake" className="py-8 scroll-mt-24"><TerminalSection /></div>
        <CommunitySection />
        <ComparisonSection />
        <div className="py-16 text-center opacity-60 hover:opacity-100 transition-opacity" id="apply">
          {submitted && result ? 
            <SuccessState aiScore={result.ai_score} referralCode={result.referral_code} status={result.status} rank={result.rank} /> : 
            <ApplicationForm onSuccess={handleSuccess} />
          }
        </div>
        <WaitlistFooter />
      </main>
      <JarvisFloatingButton onClick={() => setJarvisOpen(p => !p)} isOpen={jarvisOpen} />
      <JarvisChatPanel isOpen={jarvisOpen} onClose={() => setJarvisOpen(false)} />
      <NotionVaultOverlay isOpen={isVaultOpen} onClose={() => setVaultOpen(false)} vaultUrl={VAULT_URL} />
    </div>
  );
};

export default WaitlistPageV3;
