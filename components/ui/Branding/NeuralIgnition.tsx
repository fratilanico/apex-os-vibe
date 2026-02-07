import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface NeuralIgnitionProps {
  onComplete?: () => void;
}

export const NeuralIgnition: React.FC<NeuralIgnitionProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const terminalCenterRef = useRef<HTMLDivElement>(null);
  const cursorCenterRef = useRef<HTMLSpanElement>(null);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !logoRef.current || !terminalCenterRef.current || !cursorCenterRef.current || !terminalBottomRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) {
          // Delay a bit before finishing to let the "Welcome Back" message linger
          setTimeout(onComplete, 2000);
        }
      }
    });

    // Phase 1: The Blink
    tl.set(terminalCenterRef.current, { display: "block" });
    tl.fromTo(cursorCenterRef.current, { opacity: 0 }, { opacity: 1, repeat: 7, duration: 0.2, yoyo: true, ease: "steps(1)" });
    tl.to(terminalCenterRef.current, { opacity: 0, duration: 0.4, delay: 0.5 });
    tl.set(terminalCenterRef.current, { display: "none" });

    // Phase 2: Clip Lighting
    tl.to(logoRef.current, { opacity: 0.4, filter: "brightness(0.3)", duration: 0.05 });
    tl.to(logoRef.current, { opacity: 0, duration: 0.05 });
    tl.to(logoRef.current, { opacity: 0.6, filter: "brightness(0.5)", duration: 0.05 });
    tl.to(logoRef.current, { opacity: 0.1, duration: 0.1 });
    tl.to(logoRef.current, { opacity: 0.3, filter: "brightness(0.2)", duration: 0.2 });
    tl.to(logoRef.current, { opacity: 0, duration: 0.05 });
    tl.to(logoRef.current, { opacity: 1, filter: "brightness(1)", duration: 1.5, ease: "power2.inOut" });

    // Phase 3 & 4: Subtle Vibration & Neural Pulse
    tl.add(() => {
      // High-frequency jitter
      gsap.to(logoRef.current, {
        x: "random(-1.5, 1.5)",
        y: "random(-1.5, 1.5)",
        repeat: -1,
        duration: 0.04,
        ease: "none"
      });

      // Neural Pulse
      gsap.to(logoRef.current, {
        filter: "brightness(1.2) drop-shadow(0 0 40px rgba(6, 182, 212, 0.8))",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, "-=0.5");

    // Phase 5: System ON
    const lines = [
      "INITIALIZING KERNEL v4.0.2...",
      "LOADING NEURAL_NET_DRIVERS...",
      "CHECKING SWARM_COHESION...",
      "ESTABLISHING SECURE_TUNNEL...",
      "AGENT_SWARM: ONLINE",
      "SOVEREIGN_STATE: ACTIVE",
      "NEURAL_IGNITION_COMPLETE.",
      "WELCOME BACK, NICOLAE."
    ];

    tl.add(() => {
      let i = 0;
      const interval = setInterval(() => {
        if (i >= lines.length) {
          clearInterval(interval);
          return;
        }
        const line = document.createElement('div');
        line.style.margin = '4px 0';
        line.style.opacity = '0';
        line.style.textShadow = '0 0 5px #10b981';
        line.style.color = '#10b981';
        line.style.fontFamily = 'monospace';
        line.innerText = `> ${lines[i]}`;
        terminalBottomRef.current?.prepend(line);
        gsap.to(line, { opacity: 1, x: 20, duration: 0.3 });
        i++;
      }, 350);
    }, "+=0.2");

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-[#0a0a0a] flex justify-center align-center overflow-hidden"
    >
      {/* Grid */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0" style={{ 
          backgroundImage: `linear-gradient(to right, rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(6, 182, 212, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none z-[110]" style={{
        background: `linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))`,
        backgroundSize: '100% 3px, 2px 100%'
      }} />

      <div ref={terminalCenterRef} className="absolute z-[105] text-4xl text-cyan-400 font-mono hidden" style={{ textShadow: '0 0 15px #06b6d4' }}>
        <span>SYSTEM_READY</span>
        <span ref={cursorCenterRef} className="inline-block w-[10px] h-[1.2em] bg-cyan-400 ml-2 align-middle"></span>
      </div>

      <div className="relative z-[104] flex justify-center items-center w-[80%] h-[80%]">
        <img 
          ref={logoRef}
          src="/assets/branding-header.png" 
          alt="APEX OS"
          className="max-w-full max-h-full opacity-0 brightness-0"
        />
      </div>

      <div 
        ref={terminalBottomRef}
        className="fixed bottom-10 left-10 right-10 h-32 z-[105] flex flex-col-reverse pointer-events-none overflow-hidden"
      >
      </div>
    </div>
  );
};
