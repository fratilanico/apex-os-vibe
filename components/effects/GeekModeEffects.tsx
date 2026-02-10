import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useOnboardingStore } from '../../stores/useOnboardingStore';

interface MatrixRainProps {
  enabled?: boolean;
  density?: number;
  speed?: number;
}

// Device type detection
const getDeviceType = () => {
  if (typeof window === 'undefined') return { isMobile: false, isTablet: false, isSamsungTab: false };
  
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /android(?!.*tab|.*tablet)|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  const isTablet = /ipad|android.*tablet|android.*tab|samsung.*tab|galaxy.*tab/i.test(userAgent) || 
                   (window.innerWidth >= 600 && window.innerWidth <= 1400 && 'ontouchstart' in window);
  const isSamsungTab = /samsung.*tab|sm-t|galaxy.*tab/i.test(userAgent);
  
  return { isMobile, isTablet, isSamsungTab };
};

// Determine if we should disable effects completely (mobile phones only)
// Tablets get effects with reduced intensity to prevent flashing
const shouldDisableEffects = () => {
  const { isMobile } = getDeviceType();
  return isMobile; // Only disable on mobile phones, allow on tablets with safety measures
};

// Get tablet-optimized settings to prevent flashing
const getTabletSettings = () => {
  const { isTablet, isSamsungTab } = getDeviceType();
  return {
    isTablet: isTablet || isSamsungTab,
    frameSkip: isTablet || isSamsungTab ? 3 : 1, // Render every 3rd frame on tablets
    intensity: isTablet || isSamsungTab ? 0.15 : 0.20, // 15% opacity on tablets vs 20%
    charLimit: isTablet || isSamsungTab ? 30 : 60, // Fewer characters
  };
};

export const MatrixRain: React.FC<MatrixRainProps> = ({ 
  enabled = true,
  speed = 1 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { mode } = useOnboardingStore();
  const tabletSettings = getTabletSettings();
  const frameCountRef = useRef(0);

  useEffect(() => {
    // CRITICAL: Disable on mobile phones only - tablets get reduced effects
    if (shouldDisableEffects()) return;
    
    if (!enabled || mode !== 'GEEK') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

      // Limit canvas size for performance - smaller on tablets to prevent flashing
    const maxWidth = Math.min(window.innerWidth, 1920);
    const maxHeight = Math.min(window.innerHeight, 1080);
    canvas.width = maxWidth;
    canvas.height = maxHeight;

    const columnWidth = tabletSettings.isTablet ? 30 : 20; // Wider columns = fewer elements on tablets
    const columns = Math.floor(maxWidth / columnWidth);
    const drops: number[] = new Array(columns).fill(1);
    
    // Limit character set on tablets
    const chars = tabletSettings.isTablet 
      ? '01'  // Binary only on tablets - less visual noise
      : '0123456789ABCDEFｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';

    let animationId: number;

    const draw = () => {
      frameCountRef.current++;

      // Frame skipping for tablets - only render every Nth frame
      if (frameCountRef.current % tabletSettings.frameSkip !== 0) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0F0';
      ctx.font = '15px monospace';

      // Limit iteration to fewer columns on tablets
      const maxIterations = tabletSettings.isTablet 
        ? Math.min(drops.length, 40) 
        : drops.length;

      for (let i = 0; i < maxIterations; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)] ?? '0';
        const dropPos = drops[i] ?? 0;
        ctx.fillText(text, i * columnWidth, dropPos * 20);

        if (dropPos * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] = (drops[i] ?? 0) + speed;
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      canvas.width = Math.min(window.innerWidth, 1920);
      canvas.height = Math.min(window.innerHeight, 1080);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [enabled, mode, speed, tabletSettings]);

  // CRITICAL: Don't render on mobile phones (keep effects off for small devices)
  if (shouldDisableEffects()) return null;
  if (!enabled || mode !== 'GEEK') return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ 
        mixBlendMode: 'screen',
        opacity: tabletSettings.intensity, // Reduced opacity on tablets
      }}
    />
  );
};

// Enhanced scanlines that respond to intensity
export const Scanlines: React.FC = () => {
  const { geekEffects } = useOnboardingStore();
  const intensity = geekEffects.scanlineIntensity;

  if (intensity <= 0) return null;

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none"
      style={{
        background: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0, 0, 0, ${intensity / 200}) 2px,
          rgba(0, 0, 0, ${intensity / 200}) 4px
        )`,
        opacity: intensity / 100,
      }}
    />
  );
};

// Glitch overlay effect - optimized for performance
export const GlitchOverlay: React.FC = () => {
  const { geekEffects } = useOnboardingStore();
  const tabletSettings = getTabletSettings();

  if (!geekEffects.enableGlitchEffects) return null;
  
  // CRITICAL: Disable glitch effects on tablets to prevent flashing/seizures
  // Glitch effects are too intense for 120Hz displays
  if (tabletSettings.isTablet) return null;

  return (
    <div
      className="fixed inset-0 z-40 pointer-events-none glitch-effect"
      style={{
        background: 'rgba(6, 182, 212, 0.1)',
        mixBlendMode: 'overlay',
        animation: 'glitch 5s infinite',
      }}
    />
  );
};

// Floating ASCII particles - Reduced on tablets to prevent flashing
export const AsciiParticles: React.FC = () => {
  const { geekEffects, mode } = useOnboardingStore();
  const tabletSettings = getTabletSettings();

  // CRITICAL: Disable on mobile phones only - tablets get reduced particles
  if (shouldDisableEffects()) return null;
  if (!geekEffects.enableAsciiArt || mode !== 'GEEK') return null;

  // Reduce particle count on tablets to prevent visual overload
  const particleCount = tabletSettings.isTablet ? 3 : 5;
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    char: ['λ', '▓', '█', '◢', '◣'][i % 5],
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute text-cyan-500/10 font-mono text-sm"
          style={{ 
            left: `${p.x}%`, 
            top: `${p.y}%`,
          }}
        >
          {p.char}
        </div>
      ))}
    </div>
  );
};

// Geek Mode Indicator
export const GeekModeIndicator: React.FC = () => {
  const { mode, geekEffects } = useOnboardingStore();

  if (mode !== 'GEEK') return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-black/80 border border-cyan-500/50 rounded-lg px-4 py-2 font-mono text-xs"
      >
        <div className="text-cyan-400 font-bold mb-1">⚡ GEEK MODE ACTIVE</div>
        <div className="space-y-1 text-white/60">
          {geekEffects.enableMatrixRain && <div>Matrix Rain: ON</div>}
          {geekEffects.enableGlitchEffects && <div>Glitch FX: ON</div>}
          {geekEffects.enableAsciiArt && <div>ASCII Art: ON</div>}
          {geekEffects.scanlineIntensity > 0 && <div>Scanlines: {geekEffects.scanlineIntensity}%</div>}
        </div>
      </motion.div>
    </div>
  );
};

export default MatrixRain;
