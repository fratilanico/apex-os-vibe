import { gsap } from 'gsap';
import { useRef, useCallback, useEffect } from 'react';

interface JarvisEntranceOptions {
  duration?: number;
  delay?: number;
  particleCount?: number;
  glowColor?: string;
  soundEnabled?: boolean;
  onComplete?: () => void;
  onPhaseChange?: (phase: EntrancePhase) => void;
}

type EntrancePhase = 
  | 'idle'
  | 'initialization'
  | 'power-up'
  | 'materialization'
  | 'activation'
  | 'online';

interface JarvisEntranceReturn {
  containerRef: React.RefObject<HTMLDivElement | null>;
  triggerEntrance: () => void;
  reset: () => void;
  currentPhase: EntrancePhase;
  isPlaying: boolean;
}

/**
 * JarvisEntrance - Dramatic entrance animation sequence for JARVIS
 * 
 * Creates a cinematic multi-phase entrance with:
 * - Phase 1: Initialization (system boot text, loading indicators)
 * - Phase 2: Power-up (energy surge, screen flash)
 * - Phase 3: Materialization (core forms from particles)
 * - Phase 4: Activation (holographic effects activate)
 * - Phase 5: Online (final glow pulse, ready state)
 * 
 * @example
 * ```tsx
 * const { containerRef, triggerEntrance, currentPhase } = useJarvisEntrance({
 *   duration: 3,
 *   onComplete: () => console.log('JARVIS online'),
 *   onPhaseChange: (phase) => console.log('Phase:', phase)
 * });
 * 
 * // Trigger entrance
 * triggerEntrance();
 * ```
 */
export function useJarvisEntrance(
  options: JarvisEntranceOptions = {}
): JarvisEntranceReturn {
  const {
    duration = 3,
    delay = 0,
    particleCount = 100,
    glowColor = '#00ffff',
    onComplete,
    onPhaseChange,
  } = options;

  const containerRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const textLinesRef = useRef<HTMLDivElement[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const phaseRef = useRef<EntrancePhase>('idle');
  const isPlayingRef = useRef(false);

  // Check for reduced motion
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // Set phase helper
  const setPhase = useCallback((phase: EntrancePhase) => {
    phaseRef.current = phase;
    onPhaseChange?.(phase);
  }, [onPhaseChange]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }

    particlesRef.current.forEach((p) => p.remove());
    particlesRef.current = [];

    textLinesRef.current.forEach((t) => t.remove());
    textLinesRef.current = [];

    isPlayingRef.current = false;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  // Create particle
  const createParticle = useCallback((x: number, y: number, _delay: number) => {
    if (!containerRef.current) return;

    const particle = document.createElement('div');
    particle.className = 'jarvis-entrance-particle';
    particle.style.cssText = `
      position: absolute;
      width: 4px;
      height: 4px;
      background: ${glowColor};
      border-radius: 50%;
      pointer-events: none;
      box-shadow: 0 0 10px ${glowColor}, 0 0 20px ${glowColor};
      will-change: transform, opacity;
      opacity: 0;
    `;

    containerRef.current.appendChild(particle);
    particlesRef.current.push(particle);

    gsap.set(particle, { x, y, scale: 0 });

    return particle;
  }, [glowColor]);

  // Create boot text line
  const createTextLine = useCallback((text: string, y: number) => {
    if (!containerRef.current) return;

    const line = document.createElement('div');
    line.className = 'jarvis-boot-text';
    line.textContent = text;
    line.style.cssText = `
      position: absolute;
      left: 20px;
      top: ${y}px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      color: ${glowColor};
      text-shadow: 0 0 10px ${glowColor};
      opacity: 0;
      white-space: nowrap;
      pointer-events: none;
    `;

    containerRef.current.appendChild(line);
    textLinesRef.current.push(line);

    return line;
  }, [glowColor]);

  // Trigger entrance animation
  const triggerEntrance = useCallback(() => {
    if (!containerRef.current || isPlayingRef.current) return;

    isPlayingRef.current = true;
    cleanup();

    const container = containerRef.current;
    const centerX = container.offsetWidth / 2;
    const centerY = container.offsetHeight / 2;

    // Handle reduced motion
    if (prefersReducedMotion.current) {
      gsap.set(container, { opacity: 1 });
      setPhase('online');
      onComplete?.();
      isPlayingRef.current = false;
      return;
    }

    // Create timeline
    const tl = gsap.timeline({
      delay,
      onComplete: () => {
        setPhase('online');
        isPlayingRef.current = false;
        onComplete?.();
      },
    });

    timelineRef.current = tl;

    // Phase 1: Initialization
    tl.call(() => setPhase('initialization'));

    const bootTexts = [
      '> Initializing J.A.R.V.I.S. core systems...',
      '> Loading neural networks...',
      '> Calibrating holographic emitters...',
      '> Establishing secure connections...',
      '> Systems nominal.',
    ];

    bootTexts.forEach((text, i) => {
      const line = createTextLine(text, 50 + i * 20);
      if (line) {
        tl.to(line, {
          opacity: 1,
          duration: 0.1,
          ease: 'none',
        }, i * 0.2);
      }
    });

    // Phase 2: Power-up
    tl.call(() => setPhase('power-up'), [], duration * 0.2);

    // Screen flash
    const flash = document.createElement('div');
    flash.style.cssText = `
      position: absolute;
      inset: 0;
      background: ${glowColor};
      opacity: 0;
      pointer-events: none;
      z-index: 100;
    `;
    container.appendChild(flash);

    tl.to(flash, {
      opacity: 0.3,
      duration: 0.1,
      ease: 'power2.out',
    }, duration * 0.25);

    tl.to(flash, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => flash.remove(),
    }, duration * 0.35);

    // Energy surge effect
    tl.to(container, {
      boxShadow: `0 0 100px ${glowColor}60, 0 0 200px ${glowColor}40`,
      duration: 0.5,
      ease: 'power2.out',
    }, duration * 0.25);

    // Phase 3: Materialization
    tl.call(() => setPhase('materialization'), [], duration * 0.4);

    // Create particles in spiral formation
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 4;
      const radius = 150 + Math.random() * 100;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      createParticle(x, y, i * 0.01);
    }

    // Animate particles converging
    particlesRef.current.forEach((particle, i) => {
      const angle = (i / particleCount) * Math.PI * 4;
      const targetX = centerX + Math.cos(angle) * 30;
      const targetY = centerY + Math.sin(angle) * 30;

      tl.to(particle, {
        x: targetX,
        y: targetY,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power3.inOut',
      }, duration * 0.4 + i * 0.005);
    });

    // Hide boot text
    textLinesRef.current.forEach((line) => {
      tl.to(line, {
        opacity: 0,
        duration: 0.3,
      }, duration * 0.5);
    });

    // Phase 4: Activation
    tl.call(() => setPhase('activation'), [], duration * 0.7);

    // Core formation
    if (coreRef.current) {
      tl.fromTo(
        coreRef.current,
        {
          scale: 0,
          opacity: 0,
          rotation: -180,
        },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 0.6,
          ease: 'back.out(1.7)',
        },
        duration * 0.7
      );
    }

    // Particles dissolve into core
    particlesRef.current.forEach((particle, i) => {
      tl.to(particle, {
        x: centerX,
        y: centerY,
        opacity: 0,
        scale: 0,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => particle.remove(),
      }, duration * 0.75 + i * 0.002);
    });

    // Scan line effect
    const scanLine = document.createElement('div');
    scanLine.style.cssText = `
      position: absolute;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, transparent, ${glowColor}, transparent);
      top: 0;
      opacity: 0;
      pointer-events: none;
      z-index: 50;
    `;
    container.appendChild(scanLine);

    tl.fromTo(
      scanLine,
      { top: '0%', opacity: 1 },
      {
        top: '100%',
        opacity: 0,
        duration: 0.8,
        ease: 'power1.inOut',
        onComplete: () => scanLine.remove(),
      },
      duration * 0.75
    );

    // Phase 5: Online
    tl.call(() => setPhase('online'), [], duration * 0.9);

    // Final glow pulse
    tl.to(container, {
      boxShadow: `0 0 150px ${glowColor}80, 0 0 300px ${glowColor}40`,
      duration: 0.3,
      ease: 'power2.out',
    }, duration * 0.9);

    tl.to(container, {
      boxShadow: `0 0 50px ${glowColor}40, 0 0 100px ${glowColor}20`,
      duration: 0.5,
      ease: 'power2.inOut',
    });

    // Clear particle array after animation
    tl.call(() => {
      particlesRef.current = [];
    });
  }, [cleanup, createParticle, createTextLine, delay, duration, glowColor, onComplete, setPhase]);

  // Reset to initial state
  const reset = useCallback(() => {
    cleanup();
    setPhase('idle');

    if (containerRef.current) {
      gsap.set(containerRef.current, {
        opacity: 0,
        boxShadow: 'none',
      });
    }

    if (coreRef.current) {
      gsap.set(coreRef.current, {
        scale: 0,
        opacity: 0,
      });
    }
  }, [cleanup, setPhase]);

  // Initialize hidden state
  useEffect(() => {
    if (containerRef.current) {
      gsap.set(containerRef.current, { opacity: 0 });
    }
    if (coreRef.current) {
      gsap.set(coreRef.current, { scale: 0, opacity: 0 });
    }
  }, []);

  return {
    containerRef,
    triggerEntrance,
    reset,
    currentPhase: phaseRef.current,
    isPlaying: isPlayingRef.current,
  };
}

/**
 * Standalone JarvisEntrance class for non-React usage
 */
export class JarvisEntrance {
  private container: HTMLElement;
  private core: HTMLElement | null = null;
  private options: Required<JarvisEntranceOptions>;
  private timeline: gsap.core.Timeline | null = null;
  private particles: HTMLDivElement[] = [];
  private textLines: HTMLDivElement[] = [];
  private currentPhase: EntrancePhase = 'idle';
  private isPlaying = false;

  constructor(
    container: HTMLElement,
    core: HTMLElement | null = null,
    options: JarvisEntranceOptions = {}
  ) {
    this.container = container;
    this.core = core;
    this.options = {
      duration: 3,
      delay: 0,
      particleCount: 100,
      glowColor: '#00ffff',
      soundEnabled: false,
      onComplete: () => {},
      onPhaseChange: () => {},
      ...options,
    };

    // Set initial state
    gsap.set(container, { opacity: 0 });
    if (core) {
      gsap.set(core, { scale: 0, opacity: 0 });
    }
  }

  private setPhase(phase: EntrancePhase): void {
    this.currentPhase = phase;
    this.options.onPhaseChange(phase);
  }

  private cleanup(): void {
    if (this.timeline) {
      this.timeline.kill();
      this.timeline = null;
    }

    this.particles.forEach((p) => p.remove());
    this.particles = [];

    this.textLines.forEach((t) => t.remove());
    this.textLines = [];

    this.isPlaying = false;
  }

  private createParticle(x: number, y: number): HTMLDivElement {
    const particle = document.createElement('div');
    particle.className = 'jarvis-entrance-particle';
    particle.style.cssText = `
      position: absolute;
      width: 4px;
      height: 4px;
      background: ${this.options.glowColor};
      border-radius: 50%;
      pointer-events: none;
      box-shadow: 0 0 10px ${this.options.glowColor}, 0 0 20px ${this.options.glowColor};
      will-change: transform, opacity;
      opacity: 0;
    `;

    this.container.appendChild(particle);
    this.particles.push(particle);
    gsap.set(particle, { x, y, scale: 0 });

    return particle;
  }

  private createTextLine(text: string, y: number): HTMLDivElement {
    const line = document.createElement('div');
    line.className = 'jarvis-boot-text';
    line.textContent = text;
    line.style.cssText = `
      position: absolute;
      left: 20px;
      top: ${y}px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      color: ${this.options.glowColor};
      text-shadow: 0 0 10px ${this.options.glowColor};
      opacity: 0;
      white-space: nowrap;
      pointer-events: none;
    `;

    this.container.appendChild(line);
    this.textLines.push(line);

    return line;
  }

  public play(): void {
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.cleanup();

    const centerX = this.container.offsetWidth / 2;
    const centerY = this.container.offsetHeight / 2;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.set(this.container, { opacity: 1 });
      this.setPhase('online');
      this.options.onComplete();
      this.isPlaying = false;
      return;
    }

    const tl = gsap.timeline({
      delay: this.options.delay,
      onComplete: () => {
        this.setPhase('online');
        this.isPlaying = false;
        this.options.onComplete();
      },
    });

    this.timeline = tl;
    const { duration, glowColor, particleCount } = this.options;

    // Phase 1: Initialization
    tl.call(() => this.setPhase('initialization'));

    const bootTexts = [
      '> Initializing J.A.R.V.I.S. core systems...',
      '> Loading neural networks...',
      '> Calibrating holographic emitters...',
      '> Establishing secure connections...',
      '> Systems nominal.',
    ];

    bootTexts.forEach((text, i) => {
      const line = this.createTextLine(text, 50 + i * 20);
      tl.to(line, {
        opacity: 1,
        duration: 0.1,
        ease: 'none',
      }, i * 0.2);
    });

    // Phase 2: Power-up
    tl.call(() => this.setPhase('power-up'), [], duration * 0.2);

    const flash = document.createElement('div');
    flash.style.cssText = `
      position: absolute;
      inset: 0;
      background: ${glowColor};
      opacity: 0;
      pointer-events: none;
      z-index: 100;
    `;
    this.container.appendChild(flash);

    tl.to(flash, {
      opacity: 0.3,
      duration: 0.1,
      ease: 'power2.out',
    }, duration * 0.25);

    tl.to(flash, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => flash.remove(),
    }, duration * 0.35);

    tl.to(this.container, {
      boxShadow: `0 0 100px ${glowColor}60, 0 0 200px ${glowColor}40`,
      duration: 0.5,
      ease: 'power2.out',
    }, duration * 0.25);

    // Phase 3: Materialization
    tl.call(() => this.setPhase('materialization'), [], duration * 0.4);

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 4;
      const radius = 150 + Math.random() * 100;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      this.createParticle(x, y);
    }

    this.particles.forEach((particle, i) => {
      const angle = (i / particleCount) * Math.PI * 4;
      const targetX = centerX + Math.cos(angle) * 30;
      const targetY = centerY + Math.sin(angle) * 30;

      tl.to(particle, {
        x: targetX,
        y: targetY,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power3.inOut',
      }, duration * 0.4 + i * 0.005);
    });

    this.textLines.forEach((line) => {
      tl.to(line, {
        opacity: 0,
        duration: 0.3,
      }, duration * 0.5);
    });

    // Phase 4: Activation
    tl.call(() => this.setPhase('activation'), [], duration * 0.7);

    if (this.core) {
      tl.fromTo(
        this.core,
        { scale: 0, opacity: 0, rotation: -180 },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 0.6,
          ease: 'back.out(1.7)',
        },
        duration * 0.7
      );
    }

    this.particles.forEach((particle, i) => {
      tl.to(particle, {
        x: centerX,
        y: centerY,
        opacity: 0,
        scale: 0,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => particle.remove(),
      }, duration * 0.75 + i * 0.002);
    });

    const scanLine = document.createElement('div');
    scanLine.style.cssText = `
      position: absolute;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, transparent, ${glowColor}, transparent);
      top: 0;
      opacity: 0;
      pointer-events: none;
      z-index: 50;
    `;
    this.container.appendChild(scanLine);

    tl.fromTo(
      scanLine,
      { top: '0%', opacity: 1 },
      {
        top: '100%',
        opacity: 0,
        duration: 0.8,
        ease: 'power1.inOut',
        onComplete: () => scanLine.remove(),
      },
      duration * 0.75
    );

    // Phase 5: Online
    tl.call(() => this.setPhase('online'), [], duration * 0.9);

    tl.to(this.container, {
      boxShadow: `0 0 150px ${glowColor}80, 0 0 300px ${glowColor}40`,
      duration: 0.3,
      ease: 'power2.out',
    }, duration * 0.9);

    tl.to(this.container, {
      boxShadow: `0 0 50px ${glowColor}40, 0 0 100px ${glowColor}20`,
      duration: 0.5,
      ease: 'power2.inOut',
    });

    tl.call(() => {
      this.particles = [];
    });
  }

  public reset(): void {
    this.cleanup();
    this.setPhase('idle');
    gsap.set(this.container, { opacity: 0, boxShadow: 'none' });
    if (this.core) {
      gsap.set(this.core, { scale: 0, opacity: 0 });
    }
  }

  public destroy(): void {
    this.cleanup();
  }

  public getPhase(): EntrancePhase {
    return this.currentPhase;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export default useJarvisEntrance;
