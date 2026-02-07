import { gsap } from 'gsap';
import { useRef, useCallback, useEffect } from 'react';

interface HolographicEffectsOptions {
  glowColor?: string;
  glowIntensity?: number;
  scanLineCount?: number;
  distortionAmount?: number;
  flickerIntensity?: number;
  enableNoise?: boolean;
}

interface HolographicEffectsReturn {
  containerRef: React.RefObject<HTMLDivElement | null>;
  triggerGlow: (duration?: number) => void;
  triggerScan: () => void;
  triggerDistortion: (duration?: number) => void;
  setIntensity: (intensity: number) => void;
  isActive: boolean;
}

/**
 * HolographicEffects - Cyan glow, scanning lines, and holographic distortion
 * 
 * Creates a futuristic holographic appearance with:
 * - Cyan glow effects with configurable intensity
 * - Horizontal scanning lines that move across the element
 * - Holographic distortion/glitch effects
 * - Subtle noise texture overlay
 * - Flicker effects for authenticity
 * 
 * @example
 * ```tsx
 * const { containerRef, triggerGlow, triggerScan } = useHolographicEffects({
 *   glowColor: '#00ffff',
 *   glowIntensity: 0.8,
 *   scanLineCount: 8
 * });
 * 
 * return (
 *   <div ref={containerRef} className="jarvis-hologram">
 *     <JarvisModel />
 *   </div>
 * );
 * ```
 */
export function useHolographicEffects(
  options: HolographicEffectsOptions = {}
): HolographicEffectsReturn {
  const {
    glowColor = '#00ffff',
    glowIntensity = 0.6,
    scanLineCount = 8,
    distortionAmount = 0.02,
    flickerIntensity = 0.1,
    enableNoise = true,
  } = options;

  const containerRef = useRef<HTMLDivElement>(null);
  const scanLinesRef = useRef<HTMLDivElement[]>([]);
  const glowRef = useRef<HTMLDivElement>(null);
  const noiseRef = useRef<HTMLCanvasElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isActiveRef = useRef(false);

  // Check for reduced motion
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // Initialize effects
  useEffect(() => {
    if (!containerRef.current || prefersReducedMotion.current) return;

    const container = containerRef.current;

    // Create glow overlay
    const glow = document.createElement('div');
    glow.className = 'jarvis-hologram-glow';
    glow.style.cssText = `
      position: absolute;
      inset: -20px;
      border-radius: inherit;
      background: radial-gradient(
        ellipse at center,
        ${glowColor}${Math.round(glowIntensity * 40).toString(16).padStart(2, '0')} 0%,
        ${glowColor}${Math.round(glowIntensity * 20).toString(16).padStart(2, '0')} 40%,
        transparent 70%
      );
      pointer-events: none;
      opacity: 0;
      z-index: 1;
      will-change: opacity;
    `;
    container.appendChild(glow);
    glowRef.current = glow;

    // Create scan lines
    for (let i = 0; i < scanLineCount; i++) {
      const line = document.createElement('div');
      line.className = 'jarvis-scan-line';
      line.style.cssText = `
        position: absolute;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(
          90deg,
          transparent 0%,
          ${glowColor}80 50%,
          transparent 100%
        );
        opacity: 0;
        pointer-events: none;
        z-index: 2;
        will-change: transform, opacity;
      `;
      container.appendChild(line);
      scanLinesRef.current.push(line);
    }

    // Create noise canvas
    if (enableNoise) {
      const canvas = document.createElement('canvas');
      canvas.className = 'jarvis-noise-overlay';
      canvas.style.cssText = `
        position: absolute;
        inset: 0;
        pointer-events: none;
        opacity: 0.03;
        z-index: 3;
        mix-blend-mode: overlay;
      `;
      container.appendChild(canvas);
      noiseRef.current = canvas;

      // Generate noise
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const resizeNoise = () => {
          canvas.width = container.offsetWidth;
          canvas.height = container.offsetHeight;
          const imageData = ctx.createImageData(canvas.width, canvas.height);
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            const value = Math.random() * 255;
            data[i] = value;
            data[i + 1] = value;
            data[i + 2] = value;
            data[i + 3] = 255;
          }
          ctx.putImageData(imageData, 0, 0);
        };
        resizeNoise();
        window.addEventListener('resize', resizeNoise);
      }
    }

    // Initial animation - fade in glow
    gsap.to(glow, {
      opacity: 0.6,
      duration: 1.5,
      ease: 'power2.out',
    });

    isActiveRef.current = true;

    return () => {
      glow.remove();
      scanLinesRef.current.forEach((line) => line.remove());
      noiseRef.current?.remove();
      scanLinesRef.current = [];
      timelineRef.current?.kill();
    };
  }, [glowColor, glowIntensity, scanLineCount, enableNoise]);

  // Trigger glow effect
  const triggerGlow = useCallback(
    (duration = 0.8) => {
      if (!glowRef.current || prefersReducedMotion.current) return;

      gsap.to(glowRef.current, {
        opacity: 1,
        duration: duration * 0.3,
        ease: 'power2.out',
        onComplete: () => {
          gsap.to(glowRef.current, {
            opacity: 0.6,
            duration: duration * 0.7,
            ease: 'power2.inOut',
          });
        },
      });
    },
    []
  );

  // Trigger scan effect
  const triggerScan = useCallback(() => {
    if (scanLinesRef.current.length === 0 || prefersReducedMotion.current) return;

    const tl = gsap.timeline();

    scanLinesRef.current.forEach((line, index) => {
      const delay = index * 0.1;

      tl.fromTo(
        line,
        {
          top: '0%',
          opacity: 0,
        },
        {
          top: '100%',
          opacity: 1,
          duration: 0.6,
          ease: 'power1.inOut',
        },
        delay
      );

      tl.to(
        line,
        {
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in',
        },
        delay + 0.4
      );
    });
  }, []);

  // Trigger distortion effect
  const triggerDistortion = useCallback(
    (duration = 0.5) => {
      if (!containerRef.current || prefersReducedMotion.current) return;

      const container = containerRef.current;
      const children = Array.from(container.children).filter(
        (el) => !el.classList.contains('jarvis-hologram-glow') &&
                !el.classList.contains('jarvis-scan-line') &&
                !el.classList.contains('jarvis-noise-overlay')
      );

      const tl = gsap.timeline();

      // Chromatic aberration effect using multiple layers
      children.forEach((child) => {
        const element = child as HTMLElement;

        tl.to(
          element,
          {
            x: () => (Math.random() - 0.5) * 10 * distortionAmount * 100,
            y: () => (Math.random() - 0.5) * 5 * distortionAmount * 100,
            skewX: () => (Math.random() - 0.5) * 5 * distortionAmount * 100,
            filter: `blur(${distortionAmount * 5}px)`,
            duration: duration * 0.2,
            ease: 'power1.inOut',
            yoyo: true,
            repeat: 3,
          },
          0
        );
      });

      tl.to(
        children,
        {
          x: 0,
          y: 0,
          skewX: 0,
          filter: 'blur(0px)',
          duration: duration * 0.2,
          ease: 'power2.out',
        }
      );
    },
    [distortionAmount]
  );

  // Set intensity
  const setIntensity = useCallback(
    (intensity: number) => {
      if (!glowRef.current) return;

      gsap.to(glowRef.current, {
        opacity: intensity,
        duration: 0.5,
        ease: 'power2.out',
      });
    },
    []
  );

  // Continuous flicker effect
  useEffect(() => {
    if (!glowRef.current || prefersReducedMotion.current || flickerIntensity <= 0) return;

    const flicker = gsap.to(glowRef.current, {
      opacity: `+=${flickerIntensity}`,
      duration: 0.05,
      repeat: -1,
      yoyo: true,
      ease: 'none',
      paused: true,
    });

    // Random flicker intervals
    const triggerFlicker = () => {
      if (Math.random() > 0.95) {
        flicker.play();
        setTimeout(() => flicker.pause(), 100 + Math.random() * 200);
      }
      setTimeout(triggerFlicker, 500 + Math.random() * 2000);
    };

    const flickerTimeout = setTimeout(triggerFlicker, 2000);

    return () => {
      clearTimeout(flickerTimeout);
      flicker.kill();
    };
  }, [flickerIntensity]);

  return {
    containerRef,
    triggerGlow,
    triggerScan,
    triggerDistortion,
    setIntensity,
    isActive: isActiveRef.current,
  };
}

/**
 * Standalone HolographicEffects class for non-React usage
 */
export class HolographicEffects {
  private container: HTMLElement;
  private options: Required<HolographicEffectsOptions>;
  private glow: HTMLDivElement | null = null;
  private scanLines: HTMLDivElement[] = [];
  private noise: HTMLCanvasElement | null = null;
  private timeline: gsap.core.Timeline | null = null;

  constructor(
    container: HTMLElement,
    options: HolographicEffectsOptions = {}
  ) {
    this.container = container;
    this.options = {
      glowColor: '#00ffff',
      glowIntensity: 0.6,
      scanLineCount: 8,
      distortionAmount: 0.02,
      flickerIntensity: 0.1,
      enableNoise: true,
      ...options,
    };

    this.init();
  }

  private init(): void {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    // Create glow
    this.glow = document.createElement('div');
    this.glow.className = 'jarvis-hologram-glow';
    this.glow.style.cssText = `
      position: absolute;
      inset: -20px;
      border-radius: inherit;
      background: radial-gradient(
        ellipse at center,
        ${this.options.glowColor}${Math.round(this.options.glowIntensity * 40).toString(16).padStart(2, '0')} 0%,
        ${this.options.glowColor}${Math.round(this.options.glowIntensity * 20).toString(16).padStart(2, '0')} 40%,
        transparent 70%
      );
      pointer-events: none;
      opacity: 0;
      z-index: 1;
      will-change: opacity;
    `;
    this.container.appendChild(this.glow);

    // Create scan lines
    for (let i = 0; i < this.options.scanLineCount; i++) {
      const line = document.createElement('div');
      line.className = 'jarvis-scan-line';
      line.style.cssText = `
        position: absolute;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(
          90deg,
          transparent 0%,
          ${this.options.glowColor}80 50%,
          transparent 100%
        );
        opacity: 0;
        pointer-events: none;
        z-index: 2;
        will-change: transform, opacity;
      `;
      this.container.appendChild(line);
      this.scanLines.push(line);
    }

    // Create noise
    if (this.options.enableNoise) {
      this.noise = document.createElement('canvas');
      this.noise.className = 'jarvis-noise-overlay';
      this.noise.style.cssText = `
        position: absolute;
        inset: 0;
        pointer-events: none;
        opacity: 0.03;
        z-index: 3;
        mix-blend-mode: overlay;
      `;
      this.container.appendChild(this.noise);

      const ctx = this.noise.getContext('2d');
      if (ctx) {
        this.noise.width = this.container.offsetWidth;
        this.noise.height = this.container.offsetHeight;
        const imageData = ctx.createImageData(this.noise.width, this.noise.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const value = Math.random() * 255;
          data[i] = value;
          data[i + 1] = value;
          data[i + 2] = value;
          data[i + 3] = 255;
        }
        ctx.putImageData(imageData, 0, 0);
      }
    }

    // Initial fade in
    gsap.to(this.glow, {
      opacity: 0.6,
      duration: 1.5,
      ease: 'power2.out',
    });
  }

  public triggerGlow(duration = 0.8): void {
    if (!this.glow) return;

    gsap.to(this.glow, {
      opacity: 1,
      duration: duration * 0.3,
      ease: 'power2.out',
      onComplete: () => {
        gsap.to(this.glow, {
          opacity: 0.6,
          duration: duration * 0.7,
          ease: 'power2.inOut',
        });
      },
    });
  }

  public triggerScan(): void {
    if (this.scanLines.length === 0) return;

    const tl = gsap.timeline();

    this.scanLines.forEach((line, index) => {
      const delay = index * 0.1;

      tl.fromTo(
        line,
        { top: '0%', opacity: 0 },
        {
          top: '100%',
          opacity: 1,
          duration: 0.6,
          ease: 'power1.inOut',
        },
        delay
      );

      tl.to(
        line,
        {
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in',
        },
        delay + 0.4
      );
    });
  }

  public triggerDistortion(duration = 0.5): void {
    const children = Array.from(this.container.children).filter(
      (el) => !el.classList.contains('jarvis-hologram-glow') &&
              !el.classList.contains('jarvis-scan-line') &&
              !el.classList.contains('jarvis-noise-overlay')
    );

    const tl = gsap.timeline();

    children.forEach((child) => {
      const element = child as HTMLElement;
      tl.to(
        element,
        {
          x: () => (Math.random() - 0.5) * 10 * this.options.distortionAmount * 100,
          y: () => (Math.random() - 0.5) * 5 * this.options.distortionAmount * 100,
          skewX: () => (Math.random() - 0.5) * 5 * this.options.distortionAmount * 100,
          filter: `blur(${this.options.distortionAmount * 5}px)`,
          duration: duration * 0.2,
          ease: 'power1.inOut',
          yoyo: true,
          repeat: 3,
        },
        0
      );
    });

    tl.to(
      children,
      {
        x: 0,
        y: 0,
        skewX: 0,
        filter: 'blur(0px)',
        duration: duration * 0.2,
        ease: 'power2.out',
      }
    );
  }

  public setIntensity(intensity: number): void {
    if (!this.glow) return;

    gsap.to(this.glow, {
      opacity: intensity,
      duration: 0.5,
      ease: 'power2.out',
    });
  }

  public destroy(): void {
    this.glow?.remove();
    this.scanLines.forEach((line) => line.remove());
    this.noise?.remove();
    this.timeline?.kill();
  }
}

export default useHolographicEffects;
