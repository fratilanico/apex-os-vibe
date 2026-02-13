import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useOnboardingStore } from '../../stores/useOnboardingStore';

export const MatrixRain: React.FC<{ enabled?: boolean; speed?: number }> = ({ enabled = true, speed = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { mode } = useOnboardingStore();

  useEffect(() => {
    if (!enabled || mode !== 'GEEK') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const columnWidth = 20;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const columns = Math.floor(canvas.width / columnWidth);
    const drops: number[] = new Array(columns).fill(1);
    const chars = '0123456789ABCDEFｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';

    let animationId: number;
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0F0';
      ctx.font = '15px monospace';
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)] ?? '0';
        ctx.fillText(text, i * columnWidth, drops[i] * 20);
        if (drops[i] * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [enabled, mode, speed]);

  if (!enabled || mode !== 'GEEK') return null;

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-20" style={{ mixBlendMode: 'screen' }} />;
};

export const Scanlines: React.FC = () => {
    return <div className="fixed inset-0 z-50 pointer-events-none" style={{ background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px)`, opacity: 0.2 }} />;
};

export const GlitchOverlay: React.FC = () => {
  return <div className="fixed inset-0 z-40 pointer-events-none glitch-effect" style={{ background: 'rgba(6, 182, 212, 0.1)', mixBlendMode: 'overlay', animation: 'glitch 5s infinite' }} />;
};

export const AsciiParticles: React.FC = () => {
  const particles = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    char: ['λ', '▓', '█', '◢', '◣', '◤', '◥', '╱', '╲', '╳'][i % 10],
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 10,
  }));

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div key={p.id} className="absolute text-cyan-500/20 font-mono text-sm" style={{ left: `${p.x}%`, top: `${p.y}%`, willChange: 'transform, opacity' }} animate={{ y: [0, -100, 0], opacity: [0.2, 0.5, 0.2], rotate: [0, 360] }} transition={{ duration: p.duration, repeat: Infinity, ease: 'linear' }}>
          {p.char}
        </motion.div>
      ))}
    </div>
  );
};