import { gsap } from 'gsap';
import { useRef, useCallback, useEffect } from 'react';

interface TerminalEffectsOptions {
  cursorBlinkRate?: number;
  typingSpeed?: number;
  scanlineOpacity?: number;
  flickerIntensity?: number;
  crtCurvature?: number;
  enableScreenShake?: boolean;
  textGlowColor?: string;
}

interface TerminalEffectsReturn {
  containerRef: React.RefObject<HTMLDivElement | null>;
  typeText: (text: string, element: HTMLElement, speed?: number) => Promise<void>;
  clearText: (element: HTMLElement) => void;
  triggerFlicker: (duration?: number) => void;
  triggerScreenShake: (intensity?: number) => void;
  setCursor: (element: HTMLElement, visible: boolean) => void;
  isTyping: boolean;
}

/**
 * TerminalEffects - CRT monitor effects, typing animations, and cursor blink
 * 
 * Creates an authentic retro terminal experience with:
 * - CRT scanlines overlay
 * - Screen flicker and curvature effects
 * - Typewriter text animation
 * - Blinking cursor
 * - Screen shake for impact
 * - Text glow effects
 * 
 * @example
 * ```tsx
 * const { containerRef, typeText, triggerFlicker } = useTerminalEffects({
 *   typingSpeed: 30,
 *   cursorBlinkRate: 530
 * });
 * 
 * // Type text
 * await typeText('Initializing JARVIS...', textElement);
 * ```
 */
export function useTerminalEffects(
  options: TerminalEffectsOptions = {}
): TerminalEffectsReturn {
  const {
    cursorBlinkRate = 530,
    typingSpeed = 30,
    scanlineOpacity = 0.1,
    flickerIntensity = 0.05,
    crtCurvature = 0.1,
    enableScreenShake = true,
    textGlowColor = '#00ff00',
  } = options;

  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement | null>(null);
  const scanlinesRef = useRef<HTMLDivElement | null>(null);
  const crtOverlayRef = useRef<HTMLDivElement | null>(null);
  const isTypingRef = useRef(false);
  const cursorTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const typingTimelineRef = useRef<gsap.core.Timeline | null>(null);

  // Check for reduced motion
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // Initialize terminal effects
  useEffect(() => {
    if (!containerRef.current || prefersReducedMotion.current) return;

    const container = containerRef.current;

    // Create CRT scanlines
    const scanlines = document.createElement('div');
    scanlines.className = 'crt-scanlines';
    scanlines.style.cssText = `
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        0deg,
        rgba(0, 0, 0, ${scanlineOpacity}),
        rgba(0, 0, 0, ${scanlineOpacity}) 1px,
        transparent 1px,
        transparent 2px
      );
      pointer-events: none;
      z-index: 10;
      animation: scanlineMove 10s linear infinite;
    `;
    container.appendChild(scanlines);
    scanlinesRef.current = scanlines;

    // Create CRT curvature overlay
    const crtOverlay = document.createElement('div');
    crtOverlay.className = 'crt-curvature';
    crtOverlay.style.cssText = `
      position: absolute;
      inset: 0;
      background: radial-gradient(
        ellipse at center,
        transparent 50%,
        rgba(0, 0, 0, ${crtCurvature}) 100%
      );
      pointer-events: none;
      z-index: 11;
    `;
    container.appendChild(crtOverlay);
    crtOverlayRef.current = crtOverlay;

    // Add scanline animation keyframes
    const style = document.createElement('style');
    style.textContent = `
      @keyframes scanlineMove {
        0% { background-position: 0 0; }
        100% { background-position: 0 100%; }
      }
      @keyframes textFlicker {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.95; }
      }
    `;
    document.head.appendChild(style);

    // Continuous subtle flicker
    const flicker = gsap.to(container, {
      opacity: `+=${flickerIntensity}`,
      duration: 0.05,
      repeat: -1,
      yoyo: true,
      ease: 'none',
      paused: true,
    });

    // Random flicker trigger
    const triggerRandomFlicker = () => {
      if (Math.random() > 0.97) {
        flicker.play();
        setTimeout(() => flicker.pause(), 50 + Math.random() * 100);
      }
      setTimeout(triggerRandomFlicker, 100 + Math.random() * 500);
    };

    const flickerTimeout = setTimeout(triggerRandomFlicker, 1000);

    return () => {
      clearTimeout(flickerTimeout);
      scanlines.remove();
      crtOverlay.remove();
      style.remove();
      flicker.kill();
    };
  }, [scanlineOpacity, crtCurvature, flickerIntensity]);

  // Type text with typewriter effect
  const typeText = useCallback(
    async (text: string, element: HTMLElement, speed = typingSpeed): Promise<void> => {
      if (prefersReducedMotion.current) {
        element.textContent = text;
        return;
      }

      isTypingRef.current = true;
      element.textContent = '';

      // Add glow effect to text
      element.style.textShadow = `0 0 10px ${textGlowColor}, 0 0 20px ${textGlowColor}`;

      return new Promise((resolve) => {
        const chars = text.split('');
        let currentIndex = 0;

        const typeNextChar = () => {
          if (currentIndex < chars.length) {
            const char = chars[currentIndex];
            if (char !== undefined) {
              element.textContent = (element.textContent || '') + char;
            }
            currentIndex++;

            // Randomize typing speed slightly for realism
            const randomSpeed = speed * (0.8 + Math.random() * 0.4);
            setTimeout(typeNextChar, randomSpeed);
          } else {
            isTypingRef.current = false;
            resolve();
          }
        };

        typeNextChar();
      });
    },
    [typingSpeed, textGlowColor]
  );

  // Clear text
  const clearText = useCallback((element: HTMLElement) => {
    if (typingTimelineRef.current) {
      typingTimelineRef.current.kill();
    }
    element.textContent = '';
    isTypingRef.current = false;
  }, []);

  // Set cursor visibility and blink
  const setCursor = useCallback(
    (element: HTMLElement, visible: boolean) => {
      // Remove existing cursor
      if (cursorRef.current) {
        cursorRef.current.remove();
        cursorRef.current = null;
      }

      if (cursorTimelineRef.current) {
        cursorTimelineRef.current.kill();
        cursorTimelineRef.current = null;
      }

      if (!visible) return;

      // Create cursor element
      const cursor = document.createElement('span');
      cursor.className = 'terminal-cursor';
      cursor.textContent = '█';
      cursor.style.cssText = `
        display: inline-block;
        color: ${textGlowColor};
        text-shadow: 0 0 10px ${textGlowColor};
        margin-left: 2px;
        will-change: opacity;
      `;

      element.appendChild(cursor);
      cursorRef.current = cursor;

      // Blink animation
      if (!prefersReducedMotion.current) {
        cursorTimelineRef.current = gsap.timeline({ repeat: -1 });
        cursorTimelineRef.current
          .to(cursor, { opacity: 0, duration: cursorBlinkRate / 1000 / 2, ease: 'steps(1)' })
          .to(cursor, { opacity: 1, duration: cursorBlinkRate / 1000 / 2, ease: 'steps(1)' });
      }
    },
    [cursorBlinkRate, textGlowColor]
  );

  // Trigger screen flicker
  const triggerFlicker = useCallback(
    (duration = 0.2) => {
      if (!containerRef.current || prefersReducedMotion.current) return;

      gsap.to(containerRef.current, {
        opacity: 0.7,
        duration: duration * 0.2,
        yoyo: true,
        repeat: 5,
        ease: 'steps(2)',
        onComplete: () => {
          gsap.to(containerRef.current, {
            opacity: 1,
            duration: 0.1,
          });
        },
      });
    },
    []
  );

  // Trigger screen shake
  const triggerScreenShake = useCallback(
    (intensity = 5) => {
      if (!containerRef.current || !enableScreenShake || prefersReducedMotion.current) return;

      const tl = gsap.timeline();

      tl.to(containerRef.current, {
        x: intensity,
        y: intensity * 0.5,
        duration: 0.05,
        ease: 'power1.inOut',
      })
        .to(containerRef.current, {
          x: -intensity,
          y: -intensity * 0.5,
          duration: 0.05,
          ease: 'power1.inOut',
        })
        .to(containerRef.current, {
          x: intensity * 0.5,
          y: intensity,
          duration: 0.05,
          ease: 'power1.inOut',
        })
        .to(containerRef.current, {
          x: 0,
          y: 0,
          duration: 0.1,
          ease: 'elastic.out(1, 0.3)',
        });
    },
    [enableScreenShake]
  );

  return {
    containerRef,
    typeText,
    clearText,
    triggerFlicker,
    triggerScreenShake,
    setCursor,
    isTyping: isTypingRef.current,
  };
}

/**
 * Standalone TerminalEffects class for non-React usage
 */
export class TerminalEffects {
  private container: HTMLElement;
  private options: Required<TerminalEffectsOptions>;
  private scanlines: HTMLDivElement | null = null;
  private crtOverlay: HTMLDivElement | null = null;
  private cursor: HTMLSpanElement | null = null;
  private cursorTimeline: gsap.core.Timeline | null = null;
  private _isTyping = false;

  public get isTyping(): boolean {
    return this._isTyping;
  }

  constructor(
    container: HTMLElement,
    options: TerminalEffectsOptions = {}
  ) {
    this.container = container;
    this.options = {
      cursorBlinkRate: 530,
      typingSpeed: 30,
      scanlineOpacity: 0.1,
      flickerIntensity: 0.05,
      crtCurvature: 0.1,
      enableScreenShake: true,
      textGlowColor: '#00ff00',
      ...options,
    };

    this.init();
  }

  private init(): void {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    // Create scanlines
    this.scanlines = document.createElement('div');
    this.scanlines.className = 'crt-scanlines';
    this.scanlines.style.cssText = `
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        0deg,
        rgba(0, 0, 0, ${this.options.scanlineOpacity}),
        rgba(0, 0, 0, ${this.options.scanlineOpacity}) 1px,
        transparent 1px,
        transparent 2px
      );
      pointer-events: none;
      z-index: 10;
    `;
    this.container.appendChild(this.scanlines);

    // Create CRT overlay
    this.crtOverlay = document.createElement('div');
    this.crtOverlay.className = 'crt-curvature';
    this.crtOverlay.style.cssText = `
      position: absolute;
      inset: 0;
      background: radial-gradient(
        ellipse at center,
        transparent 50%,
        rgba(0, 0, 0, ${this.options.crtCurvature}) 100%
      );
      pointer-events: none;
      z-index: 11;
    `;
    this.container.appendChild(this.crtOverlay);

    // Subtle flicker
    const flicker = gsap.to(this.container, {
      opacity: `+=${this.options.flickerIntensity}`,
      duration: 0.05,
      repeat: -1,
      yoyo: true,
      ease: 'none',
      paused: true,
    });

    const triggerRandomFlicker = () => {
      if (Math.random() > 0.97) {
        flicker.play();
        setTimeout(() => flicker.pause(), 50 + Math.random() * 100);
      }
      setTimeout(triggerRandomFlicker, 100 + Math.random() * 500);
    };

    setTimeout(triggerRandomFlicker, 1000);
  }

  public async typeText(
    text: string,
    element: HTMLElement,
    speed = this.options.typingSpeed
  ): Promise<void> {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      element.textContent = text;
      return;
    }

    this._isTyping = true;
    element.textContent = '';
    element.style.textShadow = `0 0 10px ${this.options.textGlowColor}, 0 0 20px ${this.options.textGlowColor}`;

    return new Promise((resolve) => {
      const chars = text.split('');
      let currentIndex = 0;

      const typeNextChar = () => {
        if (currentIndex < chars.length) {
          const char = chars[currentIndex];
          if (char !== undefined) {
            element.textContent = (element.textContent || '') + char;
          }
          currentIndex++;
          const randomSpeed = speed * (0.8 + Math.random() * 0.4);
          setTimeout(typeNextChar, randomSpeed);
        } else {
          this._isTyping = false;
          resolve();
        }
      };

      typeNextChar();
    });
  }

  public clearText(element: HTMLElement): void {
    element.textContent = '';
    this._isTyping = false;
  }

  public setCursor(element: HTMLElement, visible: boolean): void {
    if (this.cursor) {
      this.cursor.remove();
      this.cursor = null;
    }

    if (this.cursorTimeline) {
      this.cursorTimeline.kill();
      this.cursorTimeline = null;
    }

    if (!visible) return;

    this.cursor = document.createElement('span');
    this.cursor.className = 'terminal-cursor';
    this.cursor.textContent = '█';
    this.cursor.style.cssText = `
      display: inline-block;
      color: ${this.options.textGlowColor};
      text-shadow: 0 0 10px ${this.options.textGlowColor};
      margin-left: 2px;
    `;

    element.appendChild(this.cursor);

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      this.cursorTimeline = gsap.timeline({ repeat: -1 });
      this.cursorTimeline
        .to(this.cursor, { opacity: 0, duration: this.options.cursorBlinkRate / 1000 / 2, ease: 'steps(1)' })
        .to(this.cursor, { opacity: 1, duration: this.options.cursorBlinkRate / 1000 / 2, ease: 'steps(1)' });
    }
  }

  public triggerFlicker(duration = 0.2): void {
    gsap.to(this.container, {
      opacity: 0.7,
      duration: duration * 0.2,
      yoyo: true,
      repeat: 5,
      ease: 'steps(2)',
      onComplete: () => {
        gsap.to(this.container, {
          opacity: 1,
          duration: 0.1,
        });
      },
    });
  }

  public triggerScreenShake(intensity = 5): void {
    if (!this.options.enableScreenShake) return;

    const tl = gsap.timeline();
    tl.to(this.container, {
      x: intensity,
      y: intensity * 0.5,
      duration: 0.05,
      ease: 'power1.inOut',
    })
      .to(this.container, {
        x: -intensity,
        y: -intensity * 0.5,
        duration: 0.05,
        ease: 'power1.inOut',
      })
      .to(this.container, {
        x: intensity * 0.5,
        y: intensity,
        duration: 0.05,
        ease: 'power1.inOut',
      })
      .to(this.container, {
        x: 0,
        y: 0,
        duration: 0.1,
        ease: 'elastic.out(1, 0.3)',
      });
  }

  public destroy(): void {
    this.scanlines?.remove();
    this.crtOverlay?.remove();
    this.cursor?.remove();
    this.cursorTimeline?.kill();
  }
}

export default useTerminalEffects;
