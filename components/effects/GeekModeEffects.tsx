import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useOnboardingStore } from '../../stores/useOnboardingStore';

interface MatrixRainProps {
  enabled?: boolean;
  density?: number;
  speed?: number;
}

export const MatrixRain: React.FC<MatrixRainProps> = ({ 
  enabled = true, 
  density = 50,
  speed = 1 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { mode } = useOnboardingStore();

  useEffect(() => {
    if (!enabled || mode !== 'GEEK') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const columns = Math.floor(canvas.width / 20);
    const drops: number[] = new Array(columns).fill(1);
    
    const chars = '0123456789ABCDEFｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';

    let animationId: number;

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0F0';
      ctx.font = '15px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * 20, drops[i] * 20);

        if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += speed;
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
  }, [enabled, mode, speed]);

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

// Glitch overlay effect
export const GlitchOverlay: React.FC = () => {
  const { geekEffects } = useOnboardingStore();

  if (!geekEffects.enableGlitchEffects) return null;

  return (
    <motion.div
      className="fixed inset-0 z-40 pointer-events-none"
      animate={{
        opacity: [0, 0.1, 0, 0.05, 0],
        x: [0, -2, 2, -1, 0],
      }}
      transition={{
        duration: 0.5,
        repeat: Infinity,
        repeatDelay: Math.random() * 5 + 3,
      }}
      style={{
        background: 'rgba(6, 182, 212, 0.1)',
        mixBlendMode: 'overlay',
      }}
    />
  );
};

// Floating ASCII particles
export const AsciiParticles: React.FC = () => {
  const { geekEffects, mode } = useOnboardingStore();

  if (!geekEffects.enableAsciiArt || mode !== 'GEEK') return null;

  const particles = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    char: ['λ', '▓', '█', '◢', '◣', '◤', '◥', '╱', '╲', '╳'][i],
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
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          animate={{
            y: [0, -100, 0],
            opacity: [0.2, 0.5, 0.2],
            rotate: [0, 360],
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
