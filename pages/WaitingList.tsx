import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { 
  Mic, Sparkles, Terminal, Zap, Brain, Rocket, 
  ChevronRight, X, Send, Loader2, Cpu, Wifi, Shield,
  Activity, Globe, Lock, Code2, Bot, MessageSquare
} from 'lucide-react';
import { JarvisIntegration } from '../components/jarvis/JarvisIntegration';

// ═══════════════════════════════════════════════════════════════════════════════
// APEX OS WAITING LIST - JARVIS ENHANCED EDITION
// Full terminal experience with AI assistant integration
// ═══════════════════════════════════════════════════════════════════════════════

interface TerminalLine {
  id: string;
  text: string;
  type: 'input' | 'output' | 'error' | 'system' | 'success' | 'jarvis' | 'matrix';
  timestamp?: Date;
}

interface JarvisMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  provider?: string;
  latency?: number;
}

const COLOR_CYCLE = ['#06b6d4', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#ef4444'];

const BOOT_SEQUENCE = [
  { text: 'Initializing APEX_OS Kernel v4.0...', delay: 100, type: 'system' as const },
  { text: 'Loading neural network modules...', delay: 400, type: 'system' as const },
  { text: 'Connecting to Vertex AI infrastructure...', delay: 700, type: 'system' as const },
  { text: 'Activating JARVIS assistant protocol...', delay: 1000, type: 'jarvis' as const },
  { text: 'Establishing secure connection...', delay: 1300, type: 'system' as const },
  { text: 'Loading Module 00 curriculum data...', delay: 1600, type: 'system' as const },
  { text: 'Synchronizing agent swarm...', delay: 1900, type: 'matrix' as const },
  { text: '[OK] All systems operational', delay: 2200, type: 'success' as const },
  { text: 'Welcome to APEX OS. Type "help" for available commands.', delay: 2500, type: 'jarvis' as const },
];

const COMMANDS = {
  help: {
    description: 'Show available commands',
    response: `[SYSTEM] Available Commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  help          - Show this help menu
  about         - About APEX OS
  join          - Join the waitlist
  status        - System status
  jarvis        - Activate JARVIS AI
  clear         - Clear terminal
  agents        - List active agents
  modules       - Show curriculum modules
  contact       - Contact information
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tip: Click the JARVIS button (bottom right) for voice-enabled AI assistance.`
  },
  about: {
    description: 'About APEX OS',
    response: `╔══════════════════════════════════════════════════════════════╗
║                    APEX OS v4.0                              ║
║           The Operating System for the AI Age                ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Mission: Democratize AI-native software development         ║
║                                                              ║
║  Stack: 17-Agent Swarm + Vertex AI + Multi-Model LLMs        ║
║                                                              ║
║  Cohort: 1,000 founders • 30-day sprint • Zero equity        ║
║                                                              ║
║  Status: MODULE 00 ACTIVE                                    ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝`
  },
  status: {
    description: 'System status',
    response: () => {
      const now = new Date();
      return `[SYSTEM] APEX OS Status Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Time: ${now.toISOString()}
Status: 🟢 OPERATIONAL
Uptime: 99.99%

Active Services:
  ✓ Vertex AI (Gemini 2.5 Pro)
  ✓ Perplexity API (Sonar Pro)
  ✓ Groq API (Llama 3.3 70B)
  ✓ Agent Swarm (17 agents)
  ✓ JARVIS Assistant (Online)
  ✓ Module 00 Terminal (Active)

Network: Secure (TLS 1.3)
Region: us-central1
Latency: <50ms`
    }
  },
  agents: {
    description: 'List active agents',
    response: `[MATRIX] Active Agent Swarm
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👑 Infrastructure-Architect  [ONLINE]
🔒 Security-Monitor          [ONLINE]
📋 Compliance-Guardian       [ONLINE]
🚀 Deployment-Automation      [ONLINE]
🚨 Incident-Response          [STANDBY]
💰 Cost-Optimizer            [ONLINE]
🧠 Intelligence-Architect     [ONLINE]
🖥️  Brain-Monitor             [ONLINE]
📚 Knowledge-Monitor          [ONLINE]
🎓 Curriculum-Meta-Agent      [ONLINE]
🔧 Builder-Prime              [ONLINE]
🕵️  Scout-Intel               [ONLINE]
🎨 UI-UX-Synthesizer          [ONLINE]
⚡ Performance-Optimizer       [ONLINE]
🧪 Test-Automation            [ONLINE]
📊 Analytics-Engine           [ONLINE]
🤖 JARVIS-Core                [ACTIVE]

Total: 17 agents synchronized`
  },
  modules: {
    description: 'Show curriculum modules',
    response: `[CURRICULUM] APEX OS Learning Track
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Module 00: Foundation (FREE)
  └─ Terminal mastery
  └─ AI tool stack overview
  └─ 17-agent orchestration

Module 01: Build (Subscription)
  └─ Cursor + Claude workflows
  └─ Multi-agent development
  └─ Production deployment

Module 02: Scale (Subscription)
  └─ System architecture
  └─ Performance optimization
  └─ Cost management

Module 03: Monetize (Subscription)
  └─ GTM strategies
  └─ Pricing models
  └─ Revenue optimization

Module 04-08: Advanced Tracks
  └─ Specialized deep-dives
  └─ Industry-specific builds
  └─ Accelerator program

Status: Module 00 accepting applications`
  },
  contact: {
    description: 'Contact information',
    response: `[CONTACT] APEX OS Support
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Discord:  https://discord.gg/apexos
Telegram: https://t.me/apexos_network
Email:    hello@apex-os.io

For immediate assistance:
  1. Click JARVIS button (bottom right)
  2. Type your question
  3. Get instant AI-powered help

Office Hours: 24/7 via JARVIS`
  }
};

// Matrix rain effect component
const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = Array(Math.floor(columns)).fill(1);
    
    let animationId: number;
    
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#0F0';
      ctx.font = `${fontSize}px monospace`;
      
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
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
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0 opacity-20"
    />
  );
};

// Animated background grid
const AnimatedGrid: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-950 to-black" />
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      {/* Animated glow orbs */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

// Terminal header with animated status
const TerminalHeader: React.FC<{ 
  booted: boolean; 
  colorIndex: number;
  jarvisActive: boolean;
}> = ({ booted, colorIndex, jarvisActive }) => {
  const currentColor = COLOR_CYCLE[colorIndex];
  
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4" style={{ color: currentColor }} />
          <span className="font-mono text-sm font-bold" style={{ color: currentColor }}>
            APEX_OS // TERMINAL
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        {/* Status indicators */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <Wifi className="w-3 h-3 text-emerald-400" />
          <span className="text-white/60">ONLINE</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs font-mono">
          <Shield className="w-3 h-3 text-cyan-400" />
          <span className="text-white/60">SECURE</span>
        </div>
        
        {jarvisActive && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30"
          >
            <Bot className="w-3 h-3 text-violet-400" />
            <span className="text-xs font-mono text-violet-300">JARVIS ACTIVE</span>
          </motion.div>
        )}
        
        {/* Color cycle indicator */}
        <div className="flex items-center gap-1">
          {COLOR_CYCLE.map((color, i) => (
            <motion.div
              key={color}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: color }}
              animate={{
                scale: i === colorIndex ? 1.5 : 1,
                opacity: i === colorIndex ? 1 : 0.3,
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Main WaitingList Page Component
export default function WaitingListPage() {
  // State
  const [booted, setBooted] = useState(false);
  const [bootLine, setBootLine] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [jarvisActive, setJarvisActive] = useState(false);
  const [showJarvisPanel, setShowJarvisPanel] = useState(false);
  const [jarvisMessages, setJarvisMessages] = useState<JarvisMessage[]>([]);
  const [jarvisInput, setJarvisInput] = useState('');
  const [jarvisLoading, setJarvisLoading] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  
  // Refs
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const jarvisInputRef = useRef<HTMLInputElement>(null);
  
  // Boot sequence
  useEffect(() => {
    if (bootLine < BOOT_SEQUENCE.length) {
      const line = BOOT_SEQUENCE[bootLine];
      const timer = setTimeout(() => {
        addLine(line.text, line.type);
        setBootLine(prev => prev + 1);
        if (bootLine === BOOT_SEQUENCE.length - 1) {
          setBooted(true);
          setJarvisActive(true);
        }
      }, line.delay);
      return () => clearTimeout(timer);
    }
  }, [bootLine]);
  
  // Color cycling
  useEffect(() => {
    if (!booted) return;
    const interval = setInterval(() => {
      setColorIndex(p => (p + 1) % COLOR_CYCLE.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [booted]);
  
  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);
  
  // Focus input on boot
  useEffect(() => {
    if (booted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [booted]);
  
  const addLine = useCallback((text: string, type: TerminalLine['type'] = 'output') => {
    setLines(prev => [...prev, { 
      id: Math.random().toString(36).substr(2, 9),
      text, 
      type,
      timestamp: new Date()
    }].slice(-200));
  }, []);
  
  const handleCommand = async (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    
    addLine(`> ${raw}`, 'input');
    setInput('');
    
    // Special commands
    if (cmd === 'clear') {
      setLines([]);
      return;
    }
    
    if (cmd === 'join') {
      setShowJoinModal(true);
      addLine('[SYSTEM] Opening waitlist application...', 'system');
      return;
    }
    
    if (cmd === 'jarvis') {
      setShowJarvisPanel(true);
      addLine('[JARVIS] AI assistant activated. How can I help you?', 'jarvis');
      return;
    }
    
    // Check built-in commands
    if (COMMANDS[cmd as keyof typeof COMMANDS]) {
      setLoading(true);
      await new Promise(r => setTimeout(r, 300));
      const command = COMMANDS[cmd as keyof typeof COMMANDS];
      const response = typeof command.response === 'function' 
        ? command.response() 
        : command.response;
      addLine(response, 'output');
      setLoading(false);
      return;
    }
    
    // AI-powered response for unknown commands
    setLoading(true);
    try {
      const response = await fetch('/api/ai-unified', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: cmd,
          history: [],
          context: 'User is in the APEX OS terminal. They typed a command or question.'
        }),
      });
      
      if (!response.ok) throw new Error('AI request failed');
      
      const data = await response.json();
      const content = data?.content || 'No response from AI.';
      
      // Format and display response
      addLine(content, 'output');
      
      // Show JARVIS indicator if Vertex AI responded
      if (data.provider === 'vertex-ai') {
        addLine(`[JARVIS] Response generated via ${data.model} (${data.latency}ms)`, 'jarvis');
      }
    } catch (error: any) {
      addLine(`[ERROR] ${error.message}`, 'error');
      addLine('[TIP] Try typing "help" for available commands.', 'system');
    } finally {
      setLoading(false);
    }
  };
  
  const handleJarvisSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jarvisInput.trim() || jarvisLoading) return;
    
    const userMessage = jarvisInput.trim();
    setJarvisInput('');
    
    // Add user message
    setJarvisMessages(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);
    
    setJarvisLoading(true);
    
    try {
      const response = await fetch('/api/ai-unified', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: jarvisMessages.slice(-10).map(m => ({
            role: m.role,
            content: m.content
          })),
          preferredProvider: 'vertex'
        }),
      });
      
      if (!response.ok) throw new Error('AI request failed');
      
      const data = await response.json();
      
      setJarvisMessages(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        role: 'assistant',
        content: data.content,
        timestamp: new Date(),
        provider: data.provider,
        latency: data.latency
      }]);
    } catch (error: any) {
      setJarvisMessages(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        role: 'system',
        content: `Error: ${error.message}. Please try again.`,
        timestamp: new Date()
      }]);
    } finally {
      setJarvisLoading(false);
    }
  };
  
  const currentColor = COLOR_CYCLE[colorIndex];
  
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background Effects */}
      <AnimatedGrid />
      <MatrixRain />
      
      {/* Main Terminal Container */}
      <div className="relative z-10 min-h-screen flex flex-col p-4 md:p-8">
        <div className="flex-1 max-w-6xl mx-auto w-full flex flex-col">
          {/* Terminal Window */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 bg-black/80 backdrop-blur-2xl border-2 rounded-2xl overflow-hidden flex flex-col shadow-2xl"
            style={{ borderColor: `${currentColor}40` }}
          >
            {/* Terminal Header */}
            <TerminalHeader 
              booted={booted} 
              colorIndex={colorIndex}
              jarvisActive={jarvisActive}
            />
            
            {/* Terminal Content */}
            <div 
              ref={terminalRef}
              className="flex-1 overflow-y-auto p-6 font-mono space-y-3"
            >
              <AnimatePresence>
                {lines.map((line) => (
                  <motion.div
                    key={line.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`whitespace-pre-wrap text-sm leading-relaxed ${
                      line.type === 'input' ? 'text-cyan-400' :
                      line.type === 'error' ? 'text-red-400' :
                      line.type === 'success' ? 'text-emerald-400' :
                      line.type === 'jarvis' ? 'text-violet-400' :
                      line.type === 'matrix' ? 'text-green-400' :
                      line.type === 'system' ? 'text-yellow-400' :
                      'text-white/80'
                    }`}
                  >
                    {line.type === 'input' && <span className="text-white/40 mr-2">λ</span>}
                    {line.type === 'jarvis' && <Bot className="w-4 h-4 inline mr-2" />}
                    {line.type === 'matrix' && <Cpu className="w-4 h-4 inline mr-2" />}
                    {line.type === 'system' && <Activity className="w-4 h-4 inline mr-2" />}
                    {line.text}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Loading indicator */}
              {loading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-cyan-400"
                >
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-xs uppercase tracking-widest">Processing...</span>
                </motion.div>
              )}
            </div>
            
            {/* Terminal Input */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleCommand(input); }}
              className="px-6 py-4 border-t border-white/10 flex items-center gap-3 bg-white/5"
            >
              <span 
                className="font-mono font-bold text-lg"
                style={{ color: currentColor }}
              >
                λ
              </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent outline-none text-white font-mono text-sm"
                placeholder={booted ? "Type command or ask JARVIS..." : "Initializing..."}
                disabled={loading || !booted}
                autoFocus
              />
              {booted && (
                <button
                  type="button"
                  onClick={() => setShowJarvisPanel(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-mono hover:bg-violet-500/30 transition-colors"
                >
                  <Bot className="w-3 h-3" />
                  JARVIS
                </button>
              )}
            </form>
          </motion.div>
          
          {/* Quick Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { cmd: 'help', icon: Terminal, label: 'Help' },
              { cmd: 'about', icon: Globe, label: 'About' },
              { cmd: 'join', icon: Rocket, label: 'Join Waitlist' },
              { cmd: 'jarvis', icon: Bot, label: 'Ask JARVIS' },
            ].map((action) => (
              <button
                key={action.cmd}
                onClick={() => handleCommand(action.cmd)}
                disabled={!booted || loading}
                className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-cyan-500/30 transition-all disabled:opacity-50"
              >
                <action.icon className="w-5 h-5 text-cyan-400" />
                <span className="text-sm font-medium">{action.label}</span>
              </button>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* JARVIS Panel */}
      <AnimatePresence>
        {showJarvisPanel && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-slate-950/95 backdrop-blur-2xl border-l border-white/10 z-50 flex flex-col"
          >
            {/* JARVIS Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-violet-600/20 to-cyan-600/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">JARVIS</h3>
                  <p className="text-xs text-white/50">AI Assistant • Vertex AI</p>
                </div>
              </div>
              <button
                onClick={() => setShowJarvisPanel(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>
            
            {/* JARVIS Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {jarvisMessages.length === 0 ? (
                <div className="text-center py-12">
                  <Bot className="w-16 h-16 mx-auto mb-4 text-violet-400 opacity-50" />
                  <p className="text-white/60 mb-2">JARVIS is ready to help</p>
                  <p className="text-sm text-white/40">
                    Ask about APEX OS, the curriculum, or how to join
                  </p>
                </div>
              ) : (
                jarvisMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${
                      msg.role === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'user' 
                        ? 'bg-cyan-500/20' 
                        : 'bg-violet-500/20'
                    }`}>
                      {msg.role === 'user' ? (
                        <MessageSquare className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <Bot className="w-4 h-4 text-violet-400" />
                      )}
                    </div>
                    <div className={`flex-1 p-4 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-cyan-500/10 border border-cyan-500/20'
                        : 'bg-white/5 border border-white/10'
                    }`}>
                      <p className="text-sm text-white/90 whitespace-pre-wrap">{msg.content}</p>
                      {msg.provider && (
                        <p className="text-xs text-white/40 mt-2">
                          via {msg.provider} • {msg.latency}ms
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
              
              {jarvisLoading && (
                <div className="flex items-center gap-2 text-violet-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-xs">JARVIS is thinking...</span>
                </div>
              )}
            </div>
            
            {/* JARVIS Input */}
            <form 
              onSubmit={handleJarvisSubmit}
              className="p-4 border-t border-white/10 bg-white/5"
            >
              <div className="flex items-center gap-3 bg-black/40 rounded-xl px-4 py-3 border border-white/10">
                <input
                  ref={jarvisInputRef}
                  type="text"
                  value={jarvisInput}
                  onChange={(e) => setJarvisInput(e.target.value)}
                  placeholder="Ask JARVIS anything..."
                  className="flex-1 bg-transparent outline-none text-white text-sm"
                  disabled={jarvisLoading}
                />
                <button
                  type="submit"
                  disabled={!jarvisInput.trim() || jarvisLoading}
                  className="p-2 rounded-lg bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 disabled:opacity-50 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Join Waitlist Modal */}
      <AnimatePresence>
        {showJoinModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-full bg-slate-950/95 border border-cyan-500/30 rounded-3xl p-8"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 flex items-center justify-center">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Join the Waitlist</h2>
                <p className="text-white/60">
                  1,000 spots • 30-day sprint • Zero equity
                </p>
              </div>
              
              <div className="space-y-4">
                <a
                  href="/waitlist"
                  className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-xl font-bold text-black hover:opacity-90 transition-opacity"
                >
                  <Zap className="w-5 h-5" />
                  Apply Now
                </a>
                
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:bg-white/10 transition-colors"
                >
                  Continue in Terminal
                </button>
              </div>
              
              <button
                onClick={() => setShowJoinModal(false)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* JARVIS Floating Button (alternative access) */}
      <JarvisIntegration 
        onNavigate={(section) => {
          if (section === 'jarvis') {
            setShowJarvisPanel(true);
          }
        }}
      />
    </div>
  );
}
