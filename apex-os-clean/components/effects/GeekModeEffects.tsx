import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useOnboardingStore } from '../../stores/useOnboardingStore';

interface MatrixRainProps {
  enabled?: boolean;
  density?: number;
  speed?: number;
}

// Detect if device is low-powered (tablet, mobile, older devices)
const isLowPoweredDevice = () => {
  if (typeof window === 'undefined') return false;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isTablet = /iPad|Android(?!.*Mobile)|Tablet/i.test(navigator.userAgent) || (window.innerWidth >= 768 && window.innerWidth <= 1366);
  const isLowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4;
  return isMobile || isTablet || isLowMemory;
};

export const MatrixRain: React.FC<MatrixRainProps> = ({ 
  enabled = true,
  speed = 1 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { mode } = useOnboardingStore();
  const [isLowPower] = useState(() => isLowPoweredDevice());
  const frameCountRef = useRef(0);

  useEffect(() => {
    if (!enabled || mode !== 'GEEK') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limit canvas size for performance
    const maxWidth = Math.min(window.innerWidth, 1920);
    const maxHeight = Math.min(window.innerHeight, 1080);
    canvas.width = maxWidth;
    canvas.height = maxHeight;

    // Reduce columns for low-power devices
    const columnWidth = isLowPower ? 40 : 20;
    const columns = Math.floor(maxWidth / columnWidth);
    const drops: number[] = new Array(columns).fill(1);
    
    // Simpler charset for better performance
    const chars = isLowPower 
      ? '01'
      : '0123456789ABCDEFｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';

    let animationId: number;
    // Skip frames on low-power devices (30fps instead of 60fps)
    const frameSkip = isLowPower ? 2 : 1;

    const draw = () => {
      frameCountRef.current++;
      
      // Skip frames for performance
      if (frameCountRef.current % frameSkip !== 0) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      // Use lighter clearing on low-power devices
      if (isLowPower) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.fillStyle = '#0F0';
      ctx.font = isLowPower ? '12px monospace' : '15px monospace';

      for (let i = 0; i < drops.length; i++) {
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
  }, [enabled, mode, speed, isLowPower]);

  if (!enabled || mode !== 'GEEK') return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-20"
      style={{ mixBlendMode: 'screen' }}
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
  const [isLowPower] = useState(() => isLowPoweredDevice());

  if (!geekEffects.enableGlitchEffects) return null;
  
  // Disable on low-power devices to prevent flickering
  if (isLowPower) return null;

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

// Floating ASCII particles - optimized
export const AsciiParticles: React.FC = () => {
  const { geekEffects, mode } = useOnboardingStore();
  const [isLowPower] = useState(() => isLowPoweredDevice());

  if (!geekEffects.enableAsciiArt || mode !== 'GEEK') return null;

  // Reduce particles on low-power devices
  const particleCount = isLowPower ? 3 : 10;
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    char: ['λ', '▓', '█', '◢', '◣', '◤', '◥', '╱', '╲', '╳'][i % 10],
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 10,
  }));

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute text-cyan-500/20 font-mono text-sm"
          style={{ 
            left: `${p.x}%`, 
            top: `${p.y}%`,
            willChange: 'transform, opacity',
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0.2, 0.5, 0.2],
            rotate: isLowPower ? 0 : [0, 360], // Disable rotation on low-power
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
