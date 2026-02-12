import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useOnboardingStore } from '../../stores/useOnboardingStore';

interface MatrixRainProps {
  enabled?: boolean;
  density?: number;
  speed?: number;
}

// Device type detection with Samsung Tab specific check
const getDeviceType = () => {
  if (typeof window === 'undefined') return { isMobile: false, isTablet: false, isSamsungTab: false, dpr: 1 };
  
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /android(?!.*tab|.*tablet)|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  const isTablet = /ipad|android.*tablet|android.*tab|samsung.*tab|galaxy.*tab/i.test(userAgent) || 
                   (window.innerWidth >= 600 && window.innerWidth <= 1400 && 'ontouchstart' in window);
  const isSamsungTab = /samsung.*tab|sm-t|galaxy.*tab/i.test(userAgent);
  const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x for performance
  
  return { isMobile, isTablet, isSamsungTab, dpr };
};

// GPU-accelerated device detection
const getGPUSettings = () => {
  const { isMobile, isTablet, isSamsungTab, dpr } = getDeviceType();
  
  // Aggressive settings for Samsung tablets and all tablets
  const isHighLoadDevice = isTablet || isSamsungTab;
  
  return {
    isMobile,
    isTablet: isTablet || isSamsungTab,
    isSamsungTab,
    dpr,
    // Frame skipping: 2 for desktop (30fps), 3 for tablets (20fps)
    frameSkip: isHighLoadDevice ? 3 : 2,
    // Max columns to render
    maxColumns: isHighLoadDevice ? 40 : 80,
    // Canvas scale: render at lower res, scale up with CSS
    canvasScale: isHighLoadDevice ? 0.5 : 0.75,
    // Opacity
    opacity: isHighLoadDevice ? 0.15 : 0.20,
  };
};

export const MatrixRain: React.FC<MatrixRainProps> = ({ 
  enabled = true,
  speed = 1 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { mode } = useOnboardingStore();
  const [gpuSettings] = useState(() => getGPUSettings());
  const frameCountRef = useRef(0);

  useEffect(() => {
    if (!enabled || mode !== 'GEEK') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // GPU optimization: Set canvas to lower resolution and scale with CSS
    const displayWidth = Math.min(window.innerWidth, 1920);
    const displayHeight = Math.min(window.innerHeight, 1080);
    const renderWidth = Math.floor(displayWidth * gpuSettings.canvasScale);
    const renderHeight = Math.floor(displayHeight * gpuSettings.canvasScale);
    
    canvas.width = renderWidth;
    canvas.height = renderHeight;
    // Scale canvas via CSS to display size
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    // Wider columns = fewer elements to render
    const columnWidth = gpuSettings.isTablet ? 40 : 30;
    const columns = Math.floor(renderWidth / columnWidth);
    const drops: number[] = new Array(columns).fill(1);
    
    // Binary only on high-load devices for performance
    const chars = gpuSettings.isTablet 
      ? '01'
      : '0123456789ABCDEF';

    let animationId: number;
    const frameSkip = gpuSettings.frameSkip;

    const draw = () => {
      frameCountRef.current++;
      
      // Frame skipping for consistent FPS
      if (frameCountRef.current % frameSkip !== 0) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      // Clear with fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0F0';
      ctx.font = `${gpuSettings.isTablet ? 12 : 14}px monospace`;

      // Limit iterations to maxColumns
      const maxIterations = Math.min(drops.length, gpuSettings.maxColumns);

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
      const newDisplayWidth = Math.min(window.innerWidth, 1920);
      const newDisplayHeight = Math.min(window.innerHeight, 1080);
      const newRenderWidth = Math.floor(newDisplayWidth * gpuSettings.canvasScale);
      const newRenderHeight = Math.floor(newDisplayHeight * gpuSettings.canvasScale);
      
      canvas.width = newRenderWidth;
      canvas.height = newRenderHeight;
      canvas.style.width = `${newDisplayWidth}px`;
      canvas.style.height = `${newDisplayHeight}px`;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [enabled, mode, speed, gpuSettings]);

  if (!enabled || mode !== 'GEEK') return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        opacity: gpuSettings.opacity,
        willChange: 'transform',
        transform: 'translateZ(0)',
        isolation: 'isolate',
        contain: 'layout style paint',
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{
          imageRendering: 'pixelated', // Sharper scaling
        }}
      />
    </div>
  );
};

// Enhanced scanlines with GPU acceleration
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
        willChange: 'opacity',
        transform: 'translateZ(0)',
        isolation: 'isolate',
        contain: 'layout style paint',
      }}
    />
  );
};

// Glitch overlay with GPU isolation
export const GlitchOverlay: React.FC = () => {
  const { geekEffects } = useOnboardingStore();
  const [isLowPower] = useState(() => {
    const { isMobile, isTablet } = getDeviceType();
    return isMobile || isTablet;
  });

  if (!geekEffects.enableGlitchEffects) return null;
  
  // Disable on low-power devices to prevent flickering
  if (isLowPower) return null;

  return (
    <div
      className="fixed inset-0 z-40 pointer-events-none"
      style={{
        background: 'rgba(6, 182, 212, 0.08)',
        opacity: 0.5,
        willChange: 'opacity',
        transform: 'translateZ(0)',
        isolation: 'isolate',
        contain: 'layout style paint',
      }}
    />
  );
};

// Floating ASCII particles with GPU acceleration
export const AsciiParticles: React.FC = () => {
  const { geekEffects, mode } = useOnboardingStore();
  const [gpuSettings] = useState(() => getGPUSettings());

  if (!geekEffects.enableAsciiArt || mode !== 'GEEK') return null;

  // Reduce particles on high-load devices
  const particleCount = gpuSettings.isTablet ? 2 : 5;
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    char: ['λ', '▓', '█', '◢', '◣'][i % 5],
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 15,
  }));

  return (
    <div 
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      style={{
        willChange: 'transform',
        transform: 'translateZ(0)',
        isolation: 'isolate',
        contain: 'layout style paint',
      }}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute text-cyan-500/15 font-mono text-sm"
          style={{ 
            left: `${p.x}%`, 
            top: `${p.y}%`,
            willChange: 'transform, opacity',
          }}
          animate={{
            y: [0, -50, 0],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {p.char}
        </motion.div>
      ))}
    </div>
  );
};

// Geek Mode Indicator
export const GeekModeIndicator: React.FC = () => {
  const { mode, geekEffects } = useOnboardingStore();

  if (mode !== 'GEEK') return null;

  return (
    <div 
      className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2"
      style={{
        willChange: 'transform',
        transform: 'translateZ(0)',
      }}
    >
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
