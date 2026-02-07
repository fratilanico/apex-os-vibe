import { gsap } from 'gsap';
import { useRef, useCallback, useEffect } from 'react';

interface VoiceWaveformOptions {
  barCount?: number;
  barColor?: string;
  barWidth?: number;
  barGap?: number;
  smoothing?: number;
  minHeight?: number;
  maxHeight?: number;
  animationSpeed?: number;
  enableGlow?: boolean;
}

interface VoiceWaveformReturn {
  containerRef: React.RefObject<HTMLDivElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  startVisualization: (audioStream?: MediaStream) => void;
  stopVisualization: () => void;
  setIntensity: (intensity: number) => void;
  isActive: boolean;
}

/**
 * VoiceWaveform - Audio visualization for voice input
 * 
 * Creates a dynamic waveform visualization with:
 * - Real-time audio analysis from microphone input
 * - Animated bar visualization
 * - Smooth transitions between states
 * - Glow effects on bars
 * - Fallback simulation mode when no audio stream
 * 
 * @example
 * ```tsx
 * const { containerRef, canvasRef, startVisualization, stopVisualization } = useVoiceWaveform({
 *   barCount: 64,
 *   barColor: '#00ffff',
 *   smoothing: 0.8
 * });
 * 
 * // Start listening
 * startVisualization(audioStream);
 * 
 * // Stop
 * stopVisualization();
 * ```
 */
export function useVoiceWaveform(
  options: VoiceWaveformOptions = {}
): VoiceWaveformReturn {
  const {
    barCount = 64,
    barColor = '#00ffff',
    barWidth = 4,
    barGap = 2,
    smoothing = 0.8,
    minHeight = 4,
    maxHeight = 100,
    animationSpeed = 0.1,
    enableGlow = true,
  } = options;

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationRef = useRef<number | null>(null);
  const isActiveRef = useRef(false);
  const intensityRef = useRef(1);
  const barsRef = useRef<number[]>(new Array(barCount).fill(minHeight));

  // Check for reduced motion
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;

    const resizeCanvas = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Draw waveform
  const drawWaveform = useCallback(() => {
    if (!canvasRef.current || !isActiveRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const totalBarWidth = barWidth + barGap;
    const totalWidth = barCount * totalBarWidth - barGap;
    const startX = (canvas.width - totalWidth) / 2;
    const centerY = canvas.height / 2;

    // Get audio data if available
    if (analyserRef.current && dataArrayRef.current) {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    }

    // Draw bars
    for (let i = 0; i < barCount; i++) {
      let barHeight: number;

      if (analyserRef.current && dataArrayRef.current) {
        // Use real audio data
        const dataIndex = Math.floor((i / barCount) * dataArrayRef.current.length);
        const value = dataArrayRef.current[dataIndex] ?? 0;
        barHeight = (value / 255) * maxHeight * intensityRef.current;
      } else {
        // Simulate waveform
        const time = Date.now() * 0.005;
        const wave1 = Math.sin(time + i * 0.2) * 0.5 + 0.5;
        const wave2 = Math.sin(time * 1.5 + i * 0.1) * 0.3 + 0.3;
        const noise = Math.random() * 0.2;
        barHeight = (wave1 * wave2 + noise) * maxHeight * intensityRef.current * 0.5;
      }

      // Smooth transition
      const currentBar = barsRef.current[i] ?? minHeight;
      barsRef.current[i] = gsap.utils.interpolate(
        currentBar,
        Math.max(minHeight, barHeight),
        animationSpeed
      );

      const x = startX + i * totalBarWidth;
      const height = barsRef.current[i] ?? minHeight;

      // Draw bar with gradient
      const gradient = ctx.createLinearGradient(0, centerY - height / 2, 0, centerY + height / 2);
      gradient.addColorStop(0, `${barColor}00`);
      gradient.addColorStop(0.5, barColor);
      gradient.addColorStop(1, `${barColor}00`);

      ctx.fillStyle = gradient;

      // Draw top bar
      ctx.fillRect(x, centerY - height, barWidth, height / 2);

      // Draw bottom bar (mirror)
      ctx.fillRect(x, centerY, barWidth, height / 2);

      // Draw glow effect
      if (enableGlow && height > minHeight * 2) {
        ctx.shadowColor = barColor;
        ctx.shadowBlur = height * 0.3;
        ctx.fillRect(x, centerY - height / 2, barWidth, height);
        ctx.shadowBlur = 0;
      }
    }

    animationRef.current = requestAnimationFrame(drawWaveform);
  }, [barCount, barWidth, barGap, barColor, minHeight, maxHeight, animationSpeed, enableGlow]);

  // Start visualization
  const startVisualization = useCallback(
    async (audioStream?: MediaStream) => {
      if (isActiveRef.current) return;

      isActiveRef.current = true;

      // Try to use real audio input
      if (audioStream && !prefersReducedMotion.current) {
        try {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
          analyserRef.current = audioContextRef.current.createAnalyser();
          analyserRef.current.fftSize = 256;
          analyserRef.current.smoothingTimeConstant = smoothing;

          const source = audioContextRef.current.createMediaStreamSource(audioStream);
          source.connect(analyserRef.current);

          const bufferLength = analyserRef.current.frequencyBinCount;
          dataArrayRef.current = new Uint8Array(bufferLength);
        } catch (error) {
          console.warn('Audio visualization failed, using simulation:', error);
        }
      }

      drawWaveform();
    },
    [drawWaveform, smoothing]
  );

  // Stop visualization
  const stopVisualization = useCallback(() => {
    isActiveRef.current = false;

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    analyserRef.current = null;
    dataArrayRef.current = null;

    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }

    // Reset bars
    barsRef.current = new Array(barCount).fill(minHeight);
  }, [barCount, minHeight]);

  // Set intensity
  const setIntensity = useCallback((intensity: number) => {
    intensityRef.current = Math.max(0, Math.min(1, intensity));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopVisualization();
    };
  }, [stopVisualization]);

  return {
    containerRef,
    canvasRef,
    startVisualization,
    stopVisualization,
    setIntensity,
    isActive: isActiveRef.current,
  };
}

/**
 * Standalone VoiceWaveform class for non-React usage
 */
export class VoiceWaveform {
  private container: HTMLElement;
  private canvas: HTMLCanvasElement;
  private options: Required<VoiceWaveformOptions>;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;
  private animationId: number | null = null;
  private isActive = false;
  private intensity = 1;
  private bars: number[];

  constructor(
    container: HTMLElement,
    options: VoiceWaveformOptions = {}
  ) {
    this.container = container;
    this.options = {
      barCount: 64,
      barColor: '#00ffff',
      barWidth: 4,
      barGap: 2,
      smoothing: 0.8,
      minHeight: 4,
      maxHeight: 100,
      animationSpeed: 0.1,
      enableGlow: true,
      ...options,
    };

    this.bars = new Array(this.options.barCount).fill(this.options.minHeight);

    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'voice-waveform-canvas';
    this.canvas.style.cssText = `
      width: 100%;
      height: 100%;
      display: block;
    `;
    this.container.appendChild(this.canvas);

    // Initial resize
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  private resize(): void {
    this.canvas.width = this.container.offsetWidth;
    this.canvas.height = this.container.offsetHeight;
  }

  private draw = (): void => {
    if (!this.isActive) return;

    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const { barCount, barWidth, barGap, barColor, minHeight, maxHeight, animationSpeed, enableGlow } = this.options;
    const totalBarWidth = barWidth + barGap;
    const totalWidth = barCount * totalBarWidth - barGap;
    const startX = (this.canvas.width - totalWidth) / 2;
    const centerY = this.canvas.height / 2;

    if (this.analyser && this.dataArray) {
      this.analyser.getByteFrequencyData(this.dataArray);
    }

    for (let i = 0; i < barCount; i++) {
      let barHeight: number;

      if (this.analyser && this.dataArray) {
        const dataIndex = Math.floor((i / barCount) * this.dataArray.length);
        const value = this.dataArray[dataIndex] ?? 0;
        barHeight = (value / 255) * maxHeight * this.intensity;
      } else {
        const time = Date.now() * 0.005;
        const wave1 = Math.sin(time + i * 0.2) * 0.5 + 0.5;
        const wave2 = Math.sin(time * 1.5 + i * 0.1) * 0.3 + 0.3;
        const noise = Math.random() * 0.2;
        barHeight = (wave1 * wave2 + noise) * maxHeight * this.intensity * 0.5;
      }

      const currentBar = this.bars[i] ?? minHeight;
      this.bars[i] = gsap.utils.interpolate(
        currentBar,
        Math.max(minHeight, barHeight),
        animationSpeed
      );

      const x = startX + i * totalBarWidth;
      const height = this.bars[i] ?? minHeight;

      const gradient = ctx.createLinearGradient(0, centerY - height / 2, 0, centerY + height / 2);
      gradient.addColorStop(0, `${barColor}00`);
      gradient.addColorStop(0.5, barColor);
      gradient.addColorStop(1, `${barColor}00`);

      ctx.fillStyle = gradient;
      ctx.fillRect(x, centerY - height, barWidth, height / 2);
      ctx.fillRect(x, centerY, barWidth, height / 2);

      if (enableGlow && height > minHeight * 2) {
        ctx.shadowColor = barColor;
        ctx.shadowBlur = height * 0.3;
        ctx.fillRect(x, centerY - height / 2, barWidth, height);
        ctx.shadowBlur = 0;
      }
    }

    this.animationId = requestAnimationFrame(this.draw);
  };

  public async start(audioStream?: MediaStream): Promise<void> {
    if (this.isActive) return;

    this.isActive = true;

    if (audioStream) {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256;
        this.analyser.smoothingTimeConstant = this.options.smoothing;

        const source = this.audioContext.createMediaStreamSource(audioStream);
        source.connect(this.analyser);

        const bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(bufferLength);
      } catch (error) {
        console.warn('Audio visualization failed, using simulation:', error);
      }
    }

    this.draw();
  }

  public stop(): void {
    this.isActive = false;

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.analyser = null;
    this.dataArray = null;

    const ctx = this.canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    this.bars = new Array(this.options.barCount).fill(this.options.minHeight);
  }

  public setIntensity(intensity: number): void {
    this.intensity = Math.max(0, Math.min(1, intensity));
  }

  public destroy(): void {
    this.stop();
    this.canvas.remove();
  }
}

export default useVoiceWaveform;
