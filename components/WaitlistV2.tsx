import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import * as CLIFormatter from '@/lib/cliFormatter';
import { InlineRenderer } from '@/components/ui/Terminal/InlineRenderer';

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE 00 WAITLIST - CYBERPUNK EDITION
// Hacker CTA, Terminal Journey, Matrix Rain, Sound Effects
// ═══════════════════════════════════════════════════════════════════════════════

interface TerminalLine {
  text: string;
  type?: 'input' | 'output' | 'error' | 'system' | 'glitch' | 'matrix' | 'success';
  timestamp?: number;
}

interface FormData {
  name: string;
  email: string;
  linkedin: string;
  company: string;
  role: string;
  whyJoin: string;
  challenge: string;
}

const COLOR_CYCLE = ['#06b6d4', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899'];

// Matrix rain component
const MatrixRain: React.FC<{ active: boolean }> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const context = ctx;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?アイウエオカキクケコ';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = Array(Math.floor(columns)).fill(1);

    let animationId: number;
    
    const draw = () => {
      context.fillStyle = 'rgba(0, 0, 0, 0.05)';
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = '#0F0';
      context.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        const drop = drops[i] ?? 0;
        context.fillText(text, i * fontSize, drop * fontSize);

        if (drop * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        } else {
          drops[i] = drop + 1;
        }
      }
      
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, [active]);

  if (!active) return null;
  
  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 opacity-40" />;
};

// Hacker CTA Component
const HackerCTA: React.FC<{ onExecute: () => void }> = ({ onExecute }) => {
  const [displayText, setDisplayText] = useState<string[]>([]);
  const [showCursor, setShowCursor] = useState(true);
  const fullText = [
    '> ROOT_ACCESS_REQUIRED',
    '> WEBINAR_COUNTDOWN: 15_DAYS',
    '> COHORT_LAUNCH: 30_DAYS',
    '> ONLY_153_SLOTS_REMAINING',
    '> EXECUTE_REGISTRATION_PROTOCOL?',
    '> [Y/N]: _'
  ];

  useEffect(() => {
    let lineIndex = 0;
    let charIndex = 0;
    
    const typeInterval = setInterval(() => {
      if (lineIndex < fullText.length) {
        const currentLine = fullText[lineIndex];
        if (!currentLine) {
          lineIndex++;
          charIndex = 0;
          return;
        }
        if (charIndex <= currentLine.length) {
          setDisplayText(prev => {
            const newText = [...prev];
            newText[lineIndex] = currentLine.slice(0, charIndex);
            return newText;
          });
          charIndex++;
        } else {
          lineIndex++;
          charIndex = 0;
        }
      } else {
        clearInterval(typeInterval);
      }
    }, 50);

    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => {
      clearInterval(typeInterval);
      clearInterval(cursorInterval);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center mb-8 cursor-pointer group"
      onClick={onExecute}
    >
      <div className="inline-block text-left">
        {fullText.map((_line, i) => (
          <div
            key={i}
            className="font-mono text-lg md:text-xl text-red-500 group-hover:text-red-400 transition-colors"
            style={{
              textShadow: '0 0 10px rgba(239, 68, 68, 0.8), 0 0 20px rgba(239, 68, 68, 0.4)',
            }}
          >
            {displayText[i] || ''}
            {i === fullText.length - 1 && showCursor && (
              <span className="animate-pulse">▊</span>
            )}
          </div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        className="mt-4 text-xs text-red-400/60 font-mono"
      >
        [CLICK TO INITIATE REGISTRATION PROTOCOL]
      </motion.div>
    </motion.div>
  );
};

// Sound effect player with volume control and mute toggle
const playSound = (type: 'keystroke' | 'enter' | 'error' | 'success', soundEnabled: boolean) => {
  if (!soundEnabled) return;
  
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch (type) {
      case 'keystroke':
        oscillator.frequency.value = 800 + Math.random() * 200;
        gainNode.gain.value = 0.015; // 50% reduction
        oscillator.type = 'sine';
        break;
      case 'enter':
        oscillator.frequency.value = 600;
        gainNode.gain.value = 0.04; // 50% reduction
        oscillator.type = 'square';
        break;
      case 'error':
        oscillator.frequency.value = 200;
        gainNode.gain.value = 0.03; // 70% reduction - less annoying!
        oscillator.type = 'sawtooth';
        break;
      case 'success':
        oscillator.frequency.value = 1200;
        gainNode.gain.value = 0.03; // 50% reduction
        oscillator.type = 'sine';
        break;
    }
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.05);
  } catch (e) {
    // Audio context might be blocked, ignore
  }
};

// Hidden commands
const HIDDEN_COMMANDS: Record<string, string[]> = {
  sudo: [
    '',
    'Nice try.',
    'You are already root here.',
    'This is YOUR terminal.',
    'You have full control.',
  ],
  'rm -rf': [
    '',
    'You cannot delete the future.',
    'Module 00 is immutable.',
    'Nice try though.',
  ],
  matrix: [
    '',
    'Wake up, Neo...',
    'The Matrix has you...',
    'Follow the white rabbit.',
    'Knock, knock.',
  ],
  konami: [
    '',
    '↑↑↓↓←→←→BA',
    'Cheat code activated!',
    'You found the secret.',
    'Welcome to the inner circle.',
  ],
  hack: [
    '',
    'Initiating hack sequence...',
    '[##########] 100%',
    'Access granted.',
    'Just kidding. This is a legal terminal.',
  ],
  coffee: [
    '',
    '       ( (',
    '        ) )',
    '      ........',
    '      |      |]',
    '      \      /',
    '       `----\'',
    '',
    '☕ COFFEE.exe loaded successfully',
    'Caffeine levels: OPTIMAL',
    '',
  ],
  beer: [
    '',
    '🍺 Pouring beer...',
    'Relaxation mode activated.',
    'Ship tomorrow.',
  ],
  '42': [
    '',
    'The Answer to the Ultimate Question...',
    'Of Life, the Universe, and Everything...',
    'Is 42.',
    'But the real answer is Module 00.',
  ],
};

export const WaitlistV2: React.FC = () => {
  const [booted, setBooted] = useState(false);
  const [bootLine, setBootLine] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState('');
  const [matrixMode, setMatrixMode] = useState(false);
  const [formStep, setFormStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    linkedin: '',
    company: '',
    role: '',
    whyJoin: '',
    challenge: ''
  });
  const [aiScore, setAiScore] = useState(0);
  const [referralCode, setReferralCode] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('apex-terminal-sound');
      return saved !== null ? saved === 'true' : true;
    }
    return true;
  });
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Persist sound preference
  useEffect(() => {
    localStorage.setItem('apex-terminal-sound', soundEnabled.toString());
  }, [soundEnabled]);

  const BOOT_SEQUENCE = [
    { text: '> initializing APEX_OS kernel...', delay: 100, type: 'system' },
    { text: '> loading Module 00 curriculum...', delay: 300, type: 'system' },
    { text: '> connecting to Vertex AI...', delay: 500, type: 'system' },
    { text: '> calibrating expert mode...', delay: 700, type: 'system' },
    { text: '[OK] kernel ready', delay: 900, type: 'success' },
    { text: '[OK] curriculum loaded', delay: 1100, type: 'success' },
    { text: '[OK] AI connected', delay: 1300, type: 'success' },
    { text: '', delay: 1500, type: 'system' },
    { text: '╔════════════════════════════════════════════════════════════════╗', delay: 1600, type: 'system' },
    { text: '║           APEX OS - ADAPTIVE LEARNING PLATFORM                 ║', delay: 1650, type: 'system' },
    { text: '╠════════════════════════════════════════════════════════════════╣', delay: 1700, type: 'system' },
    { text: '║  MISSION: Transform newbies into accelerator-ready visionaries ║', delay: 1750, type: 'system' },
    { text: '╚════════════════════════════════════════════════════════════════╝', delay: 1800, type: 'system' },
    { text: '', delay: 1850, type: 'system' },
    { text: '┌─ WHAT YOU GET ──────────────────────────────────────────────┐', delay: 1900, type: 'system' },
    { text: '│                                                              │', delay: 1920, type: 'system' },
    { text: '│  ✓ 12-Module Progressive Curriculum                         │', delay: 1940, type: 'success' },
    { text: '│    • Foundation → Learner → Builder → Visionary             │', delay: 1960, type: 'system' },
    { text: '│                                                              │', delay: 1980, type: 'system' },
    { text: '│  ✓ 8 AI Tools Mastery                                       │', delay: 2000, type: 'success' },
    { text: '│    • Vercel, Supabase, Google AI, Perplexity, etc.          │', delay: 2020, type: 'system' },
    { text: '│                                                              │', delay: 2040, type: 'system' },
    { text: '│  ✓ Adaptive Learning Experience                             │', delay: 2060, type: 'success' },
    { text: '│    • Personalized to your goals and pace                    │', delay: 2080, type: 'system' },
    { text: '│                                                              │', delay: 2100, type: 'system' },
    { text: '│  ✓ Cohort-Based Community                                   │', delay: 2120, type: 'success' },
    { text: '│    • 25-30 students per cohort, lifetime access             │', delay: 2140, type: 'system' },
    { text: '│                                                              │', delay: 2160, type: 'system' },
    { text: '│  ✓ Accelerator Pathway                                      │', delay: 2180, type: 'success' },
    { text: '│    • Top graduates eligible for InfoAcademy (1% equity)     │', delay: 2200, type: 'system' },
    { text: '│                                                              │', delay: 2220, type: 'system' },
    { text: '└──────────────────────────────────────────────────────────────┘', delay: 2240, type: 'system' },
    { text: '', delay: 2260, type: 'system' },
    { text: 'Welcome to Module 00.', delay: 2300, type: 'system' },
    { text: 'I am your curriculum expert.', delay: 2400, type: 'system' },
    { text: 'Type "help" for commands or "info" for product details.', delay: 2500, type: 'system' },
  ];

  // Boot sequence
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    BOOT_SEQUENCE.forEach((line, i) => {
      const t = setTimeout(() => {
        setBootLine(i + 1);
        if (line.text) {
          setLines(prev => [...prev, { text: line.text, type: line.type as TerminalLine['type'] }]);
        }
        if (i === BOOT_SEQUENCE.length - 1) setBooted(true);
      }, line.delay);
      timeouts.push(t);
    });
    return () => timeouts.forEach(clearTimeout);
  }, []);

  // Color cycling
  useEffect(() => {
    if (!booted) return;
    const interval = setInterval(() => {
      setColorIndex(p => (p + 1) % COLOR_CYCLE.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [booted]);

  // Auto-scroll
  useEffect(() => {
    terminalRef.current?.scrollTo({ top: terminalRef.current.scrollHeight, behavior: 'smooth' });
  }, [lines]);

  // Focus input
  useEffect(() => {
    if (booted) inputRef.current?.focus();
  }, [booted, formStep]);

  const addLine = useCallback((text: string, type: TerminalLine['type'] = 'output') => {
    setLines(prev => [...prev, { text, type, timestamp: Date.now() }].slice(-100));
  }, []);

  const calculateAIScore = (data: FormData) => {
    let score = 50;
    if (data.linkedin) score += 15;
    if (data.company) score += 10;
    if (data.whyJoin.length > 100) score += 15;
    if (data.challenge) score += 10;
    return Math.min(100, score);
  };

  const submitToAPI = async () => {
    try {
      const response = await fetch('/api/waitlist/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          aiScore,
          referralCode,
          timestamp: new Date().toISOString()
        }),
      });
      
      if (!response.ok) throw new Error('Submit failed');
      return true;
    } catch (error) {
      console.error('Submit error:', error);
      // Fallback: Send email directly
      try {
        await fetch('/api/waitlist-notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            aiScore,
            referralCode,
            to: 'apex@infoacademy.uk'
          }),
        });
        return true;
      } catch (e) {
        return false;
      }
    }
  };

  const handleFormStep = async (value: string) => {
    const fields: (keyof FormData)[] = ['name', 'email', 'linkedin', 'company', 'role', 'whyJoin', 'challenge'];
    const currentField = fields[formStep];
    if (!currentField) {
      addLine('Form state error. Please restart registration.', 'error');
      return;
    }
    
    setFormData(prev => ({ ...prev, [currentField]: value }));
    addLine(`> ${value}`, 'input');
    
    if (formStep < fields.length - 1) {
      setFormStep(prev => prev + 1);
      const nextPrompts = [
        'Email address:',
        'LinkedIn URL (optional):',
        'Company (optional):',
        'Your role/title:',
        'Why do you want to join Module 00?',
        'What is your biggest challenge right now? (optional):'
      ];
      const nextPrompt = nextPrompts[formStep] ?? 'Next input:';
      setTimeout(() => addLine(nextPrompt, 'system'), 300);
    } else {
      // Calculate score and generate referral
      const score = calculateAIScore({ ...formData, [currentField]: value });
      setAiScore(score);
      const code = `APEX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setReferralCode(code);
      
      addLine('', 'system');
      addLine('Processing your application...', 'system');
      
      // Submit to API
      const success = await submitToAPI();
      
      if (success) {
        addLine('', 'success');
        addLine('╔════════════════════════════════════════════════════════╗', 'success');
        addLine('║           APPLICATION SUBMITTED SUCCESSFULLY           ║', 'success');
        addLine('╠════════════════════════════════════════════════════════╣', 'success');
        addLine(`║  AI Readiness Score: ${score}/100                              ║`, 'success');
        addLine(`║  Referral Code: ${code}                    ║`, 'success');
        addLine(`║  Queue Position: #${461 + Math.floor(Math.random() * 50)}                              ║`, 'success');
        addLine('╚════════════════════════════════════════════════════════╝', 'success');
        addLine('', 'success');
        addLine('Check your email for confirmation.', 'success');
        addLine('Welcome to the future of building.', 'success');
        setSubmitted(true);
      } else {
        addLine('Error submitting. Please try again or email apex@infoacademy.uk', 'error');
      }
    }
  };

  const handleCommand = async (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;

    playSound('enter', soundEnabled);
    
    // If in form mode, handle form input
    if (formStep > 0 && !submitted) {
      await handleFormStep(cmd);
      setInput('');
      return;
    }

    addLine(`> ${cmd}`, 'input');
    setInput('');

    // Check for hidden commands
    const hiddenCmd = Object.keys(HIDDEN_COMMANDS).find(hc => cmd.toLowerCase() === hc.toLowerCase());
    if (hiddenCmd && HIDDEN_COMMANDS[hiddenCmd]) {
      playSound('success', soundEnabled);
      if (hiddenCmd === 'matrix') {
        setMatrixMode(true);
        setTimeout(() => setMatrixMode(false), 5000);
      }
      const hiddenLines = HIDDEN_COMMANDS[hiddenCmd];
      if (!hiddenLines) return;
      hiddenLines.forEach((line, i) => {
        setTimeout(() => addLine(line, hiddenCmd === 'matrix' ? 'matrix' : 'output'), i * 200);
      });
      return;
    }

    // Built-in commands
    if (cmd.toLowerCase() === 'help') {
      playSound('success', soundEnabled);
      addLine('', 'system');
      addLine('╔════════════════════════════════════════════════════════╗', 'system');
      addLine('║              AVAILABLE COMMANDS                        ║', 'system');
      addLine('╠════════════════════════════════════════════════════════╣', 'system');
      addLine('║  contact    → Start registration                       ║', 'system');
      addLine('║  info       → Product details & features               ║', 'system');
      addLine('║  help       → Show this menu                           ║', 'system');
      addLine('║  discord    → Get Discord invite                       ║', 'system');
      addLine('║  telegram   → Get Telegram link                        ║', 'system');
      addLine('║  clear      → Clear terminal                           ║', 'system');
      addLine('╚════════════════════════════════════════════════════════╝', 'system');
      addLine('', 'system');
      addLine('Hidden commands: matrix, sudo, hack, coffee, beer, 42...', 'glitch');
      addLine('', 'system');
      addLine('Or ask me anything about APEX OS!', 'system');
      return;
    }

    if (cmd.toLowerCase() === 'info') {
      playSound('success', soundEnabled);
      addLine('', 'system');
      addLine('╔════════════════════════════════════════════════════════════════╗', 'system');
      addLine('║              APEX OS - PRODUCT INFORMATION                     ║', 'system');
      addLine('╠════════════════════════════════════════════════════════════════╣', 'system');
      addLine('║                                                                ║', 'system');
      addLine('║  🎯 THE PROBLEM                                               ║', 'system');
      addLine('║  Traditional education is static, outdated, and one-size-     ║', 'system');
      addLine('║  fits-all. By the time you finish, your skills are already    ║', 'system');
      addLine('║  obsolete.                                                    ║', 'system');
      addLine('║                                                                ║', 'system');
      addLine('║  💡 THE SOLUTION                                              ║', 'system');
      addLine('║  APEX OS is an adaptive learning platform that acts as your   ║', 'system');
      addLine('║  second brain. It learns about you and personalizes the       ║', 'system');
      addLine('║  entire experience to your goals, pace, and learning style.   ║', 'system');
      addLine('║                                                                ║', 'system');
      addLine('║  📚 THE CURRICULUM                                            ║', 'system');
      addLine('║  • 12 progressive modules (Foundation → Visionary)            ║', 'system');
      addLine('║  • 8 AI tools mastery (Vercel, Supabase, Google AI, etc.)     ║', 'system');
      addLine('║  • Real projects, not theory                                  ║', 'system');
      addLine('║  • Cohort-based (25-30 students) with lifetime access         ║', 'system');
      addLine('║                                                                ║', 'system');
      addLine('║  🚀 THE OUTCOME                                               ║', 'system');
      addLine('║  • Transform from newbie to accelerator-ready visionary       ║', 'system');
      addLine('║  • Build projects that solve real problems                    ║', 'system');
      addLine('║  • Top graduates eligible for InfoAcademy (1% equity)         ║', 'system');
      addLine('║                                                                ║', 'system');
      addLine('║  💰 PRICING                                                   ║', 'system');
      addLine('║  • Academy: £2,497 one-time (lifetime access)                 ║', 'system');
      addLine('║  • Accelerator: 1% equity (for qualified graduates)           ║', 'system');
      addLine('║                                                                ║', 'system');
      addLine('╚════════════════════════════════════════════════════════════════╝', 'system');
      addLine('', 'system');
      addLine('Ready to start? Type "contact" to register.', 'system');
      return;
    }

    if (cmd.toLowerCase() === 'contact' || cmd.toLowerCase() === 'register') {
      playSound('success', soundEnabled);
      setFormStep(1);
      addLine('', 'system');
      addLine('Initializing registration protocol...', 'system');
      addLine('', 'system');
      addLine('Please answer the following questions:', 'system');
      addLine('Your name:', 'system');
      return;
    }

    if (cmd.toLowerCase() === 'discord') {
      playSound('success', soundEnabled);
      addLine('', 'system');
      addLine('Discord: https://discord.gg/Mbk6vZdy', 'output');
      addLine('Join 2,400+ builders in the Neural Network', 'output');
      return;
    }

    if (cmd.toLowerCase() === 'telegram') {
      playSound('success', soundEnabled);
      addLine('', 'system');
      addLine('Telegram: https://t.me/apexos_bot', 'output');
      addLine('Connect with founders async', 'output');
      return;
    }

    if (cmd.toLowerCase() === 'clear') {
      playSound('success', soundEnabled);
      setLines([]);
      addLine('Terminal cleared. How can I help you?', 'system');
      return;
    }

    // Unknown command - try AI
    setLoading(true);
    addLine('Querying AI...', 'system');
    
    try {
      const response = await fetch('/api/ai-unified', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: cmd,
          history: lines.filter(l => l.type === 'input' || l.type === 'output').slice(-10).map(l => ({
            role: l.type === 'input' ? 'user' : 'assistant',
            content: l.text
          }))
        })
      });
      
      if (!response.ok) throw new Error('AI request failed');
      
      const data = await response.json();
      playSound('success', soundEnabled);
      addLine('', 'output');
      const content = typeof data?.content === 'string' ? data.content : '';
      const formatted = CLIFormatter.convertMarkdownToCLI(content);
      formatted.split('\n').forEach((line) => addLine(line, 'output'));
      addLine('', 'output');
      const provider = data?.provider ?? 'unknown';
      const model = data?.model ?? 'unknown';
      const latency = data?.latency ?? 0;
      addLine(`[Provider: ${provider} | Model: ${model} | Latency: ${latency}ms]`, 'system');
    } catch (error) {
      playSound('error', soundEnabled);
      addLine(`AI Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      addLine('Type "help" for available commands or "contact" to register.', 'system');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    handleCommand(input);
  };

  const handleKeyPress = () => {
    playSound('keystroke', soundEnabled);
  };

  const startRegistration = () => {
    handleCommand('contact');
  };

  const color = COLOR_CYCLE[colorIndex];

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] overflow-hidden flex flex-col">
      {/* Matrix Rain Background */}
      <MatrixRain active={matrixMode} />
      
      {/* CRT Effect */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.02]"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
        }}
      />

      {/* Ambient Glow */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] rounded-full blur-[200px]"
          style={{ background: `radial-gradient(circle, ${color}20, transparent 60%)` }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
        {/* Hacker CTA */}
        {!formStep && !submitted && <HackerCTA onExecute={startRegistration} />}

        {/* Terminal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl"
        >
          <div
            className="bg-black/95 border-2 rounded-2xl overflow-hidden"
            style={{
              borderColor: `${color}50`,
              boxShadow: `0 0 100px ${color}20`,
            }}
          >
            {/* Header */}
            <div
              className="px-6 py-4 border-b flex items-center justify-between"
              style={{ borderColor: `${color}30`, background: `linear-gradient(90deg, ${color}10, transparent)` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: color }} />
                <span className="font-mono text-sm tracking-widest uppercase" style={{ color }}>
                  Module 00 // Registration Terminal
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-white/40">
                <span>APEX OS Terminal</span>
                <span>•</span>
                <span>Online</span>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="ml-2 p-1 rounded hover:bg-white/10 transition-colors"
                  title={soundEnabled ? "Mute sounds" : "Enable sounds"}
                >
                  {soundEnabled ? '🔊' : '🔇'}
                </button>
              </div>
            </div>

            {/* Terminal Content */}
            <div
              ref={terminalRef}
              className="h-[50vh] md:h-[55vh] overflow-y-auto p-6 font-mono text-sm md:text-base"
              onClick={() => inputRef.current?.focus()}
            >
              {/* Boot Sequence */}
              {!booted && (
                <div className="space-y-1">
                  {BOOT_SEQUENCE.slice(0, bootLine).map((line, i) => (
                    <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#06b6d4' }}>
                      {line.text}
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Command History */}
                {lines.map((line, i) => (
                  <div
                    key={i}
                    className={`whitespace-pre-wrap mb-1 ${
                      line.type === 'input' ? 'text-yellow-400' :
                      line.type === 'error' ? 'text-red-400' :
                      line.type === 'system' ? 'text-cyan-400' :
                      line.type === 'glitch' ? 'text-pink-400 animate-pulse' :
                      line.type === 'matrix' ? 'text-green-400 font-bold' :
                      line.type === 'success' ? 'text-emerald-400' :
                      'text-white/90'
                    }`}
                  >
                    <InlineRenderer text={line.text} />
                  </div>
                ))}
            </div>

            {/* Input */}
            {booted && !submitted && (
              <form
                onSubmit={handleSubmit}
                className="px-6 py-4 border-t flex items-center gap-3"
                style={{ borderColor: `${color}30` }}
              >
                <span className="font-mono font-bold" style={{ color }}>
                  {formStep > 0 ? '>' : 'founder@module00:~$'}
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => { setInput(e.target.value); handleKeyPress(); }}
                  className="flex-1 bg-transparent outline-none text-white font-mono"
                  placeholder={formStep > 0 ? 'Type your answer...' : 'Type "contact" to register or "help" for commands...'}
                  disabled={loading}
                  autoFocus
                />
                {!loading && <span className="w-2 h-5 animate-pulse" style={{ backgroundColor: color }} />}
              </form>
            )}

            {/* Success State */}
            {submitted && (
              <div className="px-6 py-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-block p-4 rounded-full bg-emerald-500/20 border border-emerald-500/50 mb-4"
                >
                  <span className="text-4xl">🚀</span>
                </motion.div>
                <h3 className="text-2xl font-bold text-emerald-400 mb-2">Welcome to Module 00</h3>
                <p className="text-white/60">Check your email for next steps.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions - Anti-Contrast Glow */}
        {booted && !formStep && !submitted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex flex-wrap justify-center gap-3"
          >
            {['contact', 'help', 'matrix', 'discord'].map((cmd) => (
              <button
                key={cmd}
                onClick={() => { setInput(cmd); inputRef.current?.focus(); }}
                disabled={loading}
                className="px-4 py-2 rounded-lg border font-mono text-xs transition-all hover:scale-105 disabled:opacity-50 uppercase tracking-wider"
                style={{ 
                  borderColor: `${color}60`, 
                  color: '#0a0a0a', 
                  background: color,
                  boxShadow: `0 0 20px ${color}60, 0 0 40px ${color}40, inset 0 0 10px rgba(255,255,255,0.3)`,
                  textShadow: '0 0 5px rgba(255,255,255,0.5)'
                }}
              >
                {cmd}
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WaitlistV2;
