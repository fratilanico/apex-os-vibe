import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useOnboardingStore } from '../../stores/useOnboardingStore';

interface MatrixRainProps {
  enabled?: boolean;
  density?: number;
  speed?: number;
}

// Detect low-powered devices (specifically targeting Samsung/Tablets flickering)
const isLowPoweredDevice = () => {
  if (typeof window === 'undefined') return false;
  const isMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isTablet = /iPad|Android(?!.*Mobile)|Tablet/i.test(navigator.userAgent) 
    || (window.innerWidth >= 768 && window.innerWidth <= 1366);
  
  // Type-safe check for deviceMemory
  const nav = navigator as any;
  const isLowMemory = nav.deviceMemory && nav.deviceMemory < 4;
  
  return isMobile || isTablet || isLowMemory;
};

export const MatrixRain: React.FC<MatrixRainProps> = ({ 
  enabled = true,
  speed = 0.7 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { mode } = useOnboardingStore();
  const [isLowPower] = useState(() => isLowPoweredDevice());

  useEffect(() => {
    // Only enable in GEEK mode
    if (!enabled || mode !== 'GEEK') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: false }); // Optimization
    if (!ctx) return;

    // Optimization: Wider columns for low power = fewer calculations
    const columnWidth = isLowPower ? 40 : 20;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const columns = Math.floor(canvas.width / columnWidth);
    const drops: number[] = new Array(columns).fill(1);
    
    // Optimization: Simple charset for low power
    const chars = isLowPower 
      ? '01' 
      : '0123456789ABCDEFｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';

    let animationId: number;
    let frameCount = 0;
    
    const draw = () => {
      frameCount++;
      
      // Optimization: Frame skipping for low power (30fps) vs 60fps for high end
      if (isLowPower && frameCount % 2 !== 0) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      // Optimization: Direct clear for low power to prevent ghosting/flicker
      if (isLowPower) {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.fillStyle = '#0F0';
      ctx.font = '15px monospace';
      
      for (let i = 0; i < drops.length; i++) {
        const charIndex = Math.floor(Math.random() * chars.length);
        const text = chars[charIndex] || '0';
        const dropValue = drops[i] || 0;
        
        ctx.fillText(text, i * columnWidth, dropValue * 20);
        
        if (dropValue * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        } else {
          drops[i] = dropValue + 1;
        }
      }
      
      animationId = requestAnimationFrame(draw);
    };

    draw();
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
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
      style={{ 
        mixBlendMode: 'screen',
        willChange: 'transform' // Force GPU
      }}
    />
  );
};

export const Scanlines: React.FC = () => {
  const { geekEffects } = useOnboardingStore();
  const intensity = geekEffects.scanlineIntensity;
  const [isLowPower] = useState(() => isLowPoweredDevice());

  // Disable intense effects on low power to prevent flickering
  if (intensity <= 0 || isLowPower) return null;

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

export const GlitchOverlay: React.FC = () => {
  const { geekEffects } = useOnboardingStore();
  const [isLowPower] = useState(() => isLowPoweredDevice());

  // Disable glitch on low power - major cause of flicker
  if (!geekEffects.enableGlitchEffects || isLowPower) return null;

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

export const AsciiParticles: React.FC = () => {
  const { geekEffects, mode } = useOnboardingStore();
  const [isLowPower] = useState(() => isLowPoweredDevice());

  if (!geekEffects.enableAsciiArt || mode !== 'GEEK') return null;

  // Fewer particles on low power
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
            rotate: isLowPower ? 0 : [0, 360], // Optimization: no rotation on low power
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

export default MatrixRain;
