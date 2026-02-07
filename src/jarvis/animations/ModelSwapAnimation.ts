/**
 * Model Swap Animation - Tony Stark Standards
 * GSAP-powered animations for JARVIS model transitions
 */

import gsap from 'gsap';

interface AnimationConfig {
  duration?: number;
  ease?: string;
  onComplete?: () => void;
}

export class ModelSwapAnimation {
  private static instance: ModelSwapAnimation;
  private isAnimating: boolean = false;

  static getInstance(): ModelSwapAnimation {
    if (!ModelSwapAnimation.instance) {
      ModelSwapAnimation.instance = new ModelSwapAnimation();
    }
    return ModelSwapAnimation.instance;
  }

  /**
   * Animate model card swap with particle effects
   */
  async animateSwap(
    fromElement: HTMLElement,
    toElement: HTMLElement,
    config: AnimationConfig = {}
  ): Promise<void> {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const { duration = 0.6, ease = 'power3.out' } = config;

    const tl = gsap.timeline({
      onComplete: () => {
        this.isAnimating = false;
        config.onComplete?.();
      },
    });

    // Phase 1: Shrink and fade out current model
    tl.to(fromElement, {
      scale: 0.8,
      opacity: 0.5,
      filter: 'blur(4px)',
      duration: duration * 0.4,
      ease: 'power2.in',
    });

    // Phase 2: Particle burst effect
    tl.add(() => this.createParticleBurst(fromElement), '-=0.1');

    // Phase 3: Bring in new model
    tl.fromTo(
      toElement,
      {
        scale: 1.2,
        opacity: 0,
        filter: 'blur(8px)',
      },
      {
        scale: 1,
        opacity: 1,
        filter: 'blur(0px)',
        duration: duration * 0.6,
        ease: ease,
      }
    );

    // Phase 4: Glow pulse
    tl.to(toElement, {
      boxShadow: '0 0 30px rgba(34, 211, 238, 0.6)',
      duration: 0.2,
      yoyo: true,
      repeat: 1,
    });

    return new Promise((resolve) => {
      tl.eventCallback('onComplete', () => {
        resolve();
      });
    });
  }

  /**
   * Create particle burst effect
   */
  private createParticleBurst(element: HTMLElement): void {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const particleCount = 12;
    const particles: HTMLDivElement[] = [];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: #22d3ee;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        left: ${centerX}px;
        top: ${centerY}px;
      `;
      document.body.appendChild(particle);
      particles.push(particle);

      const angle = (i / particleCount) * Math.PI * 2;
      const distance = 50 + Math.random() * 50;

      gsap.to(particle, {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        opacity: 0,
        scale: 0,
        duration: 0.5 + Math.random() * 0.3,
        ease: 'power2.out',
        onComplete: () => particle.remove(),
      });
    }
  }

  /**
   * Animate model loading state
   */
  animateLoading(element: HTMLElement): gsap.core.Tween {
    return gsap.to(element, {
      opacity: 0.7,
      scale: 0.98,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });
  }

  /**
   * Stop all animations
   */
  stopAll(): void {
    gsap.killTweensOf('.jarvis-model-card');
    this.isAnimating = false;
  }
}

export default ModelSwapAnimation.getInstance();
