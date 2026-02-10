import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, Mic, Globe, Activity, Terminal, Maximize2, Minimize2 } from 'lucide-react';
import { queryAI } from '../../lib/ai/globalAIService';
import { useLocation } from 'react-router-dom';
import { AgentHierarchyVisualization } from '../../src/jarvis/components/AgentHierarchyVisualization';
import { InlineRenderer } from '../ui/Terminal/InlineRenderer';
import { convertMarkdownToCLI } from '../../lib/cliFormatter';
import { useOnboardingStore } from '../../stores/useOnboardingStore';

// ═══════════════════════════════════════════════════════════════════════════════
// JARVIS EXECUTIVE ASSISTANT - GEEK MODE EVOLVED
// Voice Integration | Tier-Based Disclosure | Technical Cockpit
// ═══════════════════════════════════════════════════════════════════════════════

interface Message {
  id: string;
  type: 'user' | 'jarvis';
  text: string;
  timestamp: Date;
}

interface JarvisChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (section: string) => void;
}

export const JarvisChatPanel: React.FC<JarvisChatPanelProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const { mode, setMode, email, isUnlocked, startJarvisSession, endJarvisSession, addJarvisMessage } = useOnboardingStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState<'en-US' | 'ro-RO'>('en-US');
  const [view, setView] = useState<'chat' | 'agents'>('chat');
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(window.speechSynthesis);

  // JARVIS Voice Feedback (Founder Persona)
  const speak = useCallback((text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel(); // Stop current speech

    // Strip CLI tags for cleaner speech
    const cleanText = text.replace(/\[(?:\/)?(?:h1|h2|h3|b|code|muted|info|warn|success|error|choice)\]/g, '');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language;
    utterance.rate = 1.1; // Strategic/Urgent pace
    utterance.pitch = 1.05; // Confident tone
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    synthRef.current.speak(utterance);
  }, [language]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const lower = transcript.toLowerCase();
        
        // Voice Triggers
        if (lower.includes('activate geek mode') || lower.includes('go full wire')) {
          setMode('GEEK');
          speak("Geek Mode engaged, sir. Neural link optimized.");
          return;
        }
        
        setInputText(transcript);
        handleSend(transcript);
      };

      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = () => setIsListening(false);
    }
  }, [language, setMode, speak]);

  const startListening = useCallback(() => {
    try {
      if (recognitionRef.current && !isListening) {
        recognitionRef.current.lang = language;
        recognitionRef.current.start();
        setIsListening(true);
      }
    } catch (e) {
      setIsListening(false);
    }
  }, [isListening, language]);

  const stopListening = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Press-and-hold tracking for desktop
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHoldingRef = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Analytics: Track session start/end
  useEffect(() => {
    if (isOpen) {
      startJarvisSession();
    } else {
      endJarvisSession();
    }
    
    return () => {
      if (isOpen) {
        endJarvisSession();
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = language === 'ro-RO' 
        ? "Sunt JARVIS. Identificați obiectivul, Fondatorule. Swarm-ul este inactiv." 
        : "I'm JARVIS. Identify your objective, Founder. The swarm is idling.";
      addMessage('jarvis', greeting);
      speak(greeting);
    }
  }, [isOpen]);

  const addMessage = (type: 'user' | 'jarvis', text: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type,
      text,
      timestamp: new Date()
    }]);
    
    // Analytics: Track message
    addJarvisMessage(type, text);
  };

  const processQuery = useCallback(async (query: string) => {
    setIsProcessing(true);
    
    try {
      const aiResponse = await queryAI({
        message: query,
        history: messages.map(m => ({
          role: m.type === 'user' ? 'user' : 'assistant',
          content: m.text
        })),
        userEmail: email || undefined,
        context: `The user is on the "${location.pathname}" page. Mode: ${mode}. Sync Level: ${isUnlocked ? 'TIER 1' : 'TIER 0'}.`
      });

      const formattedResponse = convertMarkdownToCLI(aiResponse.content);
      addMessage('jarvis', formattedResponse);
      speak(aiResponse.content);
      
      if (aiResponse.content.toLowerCase().includes('navigat') || aiResponse.content.toLowerCase().includes('show')) {
        if (aiResponse.content.toLowerCase().includes('vibe')) onNavigate?.('vibe');
        if (aiResponse.content.toLowerCase().includes('pricing')) onNavigate?.('pricing');
        if (aiResponse.content.toLowerCase().includes('academy')) onNavigate?.('academy');
      }
    } catch (error) {
      addMessage('jarvis', "Neural synchronization error. Swarm link unstable.");
    } finally {
      setIsProcessing(false);
    }
  }, [messages, location.pathname, email, mode, isUnlocked, speak, onNavigate]);

  const handleSend = (textOverride?: string) => {
    const text = textOverride || inputText;
    if (!text.trim()) return;
    addMessage('user', text);
    processQuery(text);
    if (!textOverride) setInputText('');
  };

  const isGeek = mode === 'GEEK';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: 1
          }}
          exit={{ opacity: 0, y: 100, scale: 0.95 }}
          className={`fixed bottom-24 left-4 right-4 sm:left-6 sm:right-auto sm:w-96 md:w-[28rem] lg:w-[32rem] h-[60vh] sm:h-[500px] md:h-[600px] max-h-[80vh] bg-slate-900/95 backdrop-blur-2xl rounded-2xl border transition-all duration-500 shadow-2xl z-50 flex flex-col overflow-hidden ${isGeek ? 'border-cyan-500/50' : 'border-white/10'}`}
          style={{ 
            maxWidth: isGeek ? '600px' : '500px',
          }}
        >
          {/* Header */}
          <div className={`flex items-center justify-between p-4 border-b transition-colors duration-500 ${isGeek ? 'border-cyan-500/30 bg-cyan-500/10' : 'border-white/10 bg-white/5'}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center relative">
                <Bot className="w-5 h-5 text-white" />
                {(isProcessing || isSpeaking) && (
                  <motion.div
                    className="absolute -inset-1 rounded-full border-2 border-cyan-400 border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                )}
              </div>
              <div>
                <h3 className={`font-black tracking-tighter ${isGeek ? 'text-cyan-400' : 'text-white'}`}>JARVIS</h3>
                <p className="text-[10px] uppercase tracking-widest text-white/40">{isGeek ? 'GEEK_MODE // ACTIVE' : 'AI Executive Assistant'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setMode(isGeek ? 'STANDARD' : 'GEEK')}
                className={`p-2 rounded-lg transition-all ${isGeek ? 'bg-cyan-500 text-black' : 'hover:bg-white/10 text-white/50'}`}
                title="Toggle Geek Mode"
              >
                <Terminal className="w-4 h-4" />
              </button>
              
              <button 
                onClick={() => setView(view === 'chat' ? 'agents' : 'chat')}
                className={`p-2 rounded-lg transition-colors ${view === 'agents' ? 'text-cyan-400 bg-white/5' : 'text-white/50 hover:bg-white/10'}`}
              >
                <Activity className="w-4 h-4" />
              </button>

              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-white/50">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content View */}
          <div className="flex-1 overflow-hidden relative bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
            <AnimatePresence mode="wait">
              {view === 'chat' ? (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col p-6 space-y-4 overflow-y-auto custom-scrollbar"
                >
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, x: msg.type === 'user' ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[90%] p-4 rounded-2xl text-xs leading-relaxed ${
                        msg.type === 'user' 
                          ? 'bg-cyan-500 text-black font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)]' 
                          : `${isGeek ? 'bg-black/60 border-cyan-500/20' : 'bg-white/5 border-white/10'} text-white border font-mono whitespace-pre-wrap`
                      }`}>
                        <InlineRenderer text={msg.text} />
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </motion.div>
              ) : (
                <motion.div
                  key="agents"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 bg-slate-950 overflow-hidden"
                >
                  <div className="h-full scale-[0.5] origin-top transform-gpu">
                    <AgentHierarchyVisualization />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input Area */}
          <div className={`p-4 border-t transition-colors duration-500 ${isGeek ? 'border-cyan-500/30 bg-cyan-500/5' : 'border-white/10 bg-black/20'}`}>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  // Tap-to-toggle: tap once to start, tap again to stop
                  e.preventDefault();
                  if (!isHoldingRef.current) {
                    toggleListening();
                  }
                  isHoldingRef.current = false;
                }}
                onMouseDown={() => {
                  // Desktop press-and-hold: start after 300ms hold
                  holdTimerRef.current = setTimeout(() => {
                    isHoldingRef.current = true;
                    startListening();
                  }, 300);
                }}
                onMouseUp={() => {
                  // Desktop release: stop if was holding
                  if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
                  if (isHoldingRef.current) {
                    stopListening();
                  }
                }}
                onMouseLeave={() => {
                  if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
                  if (isHoldingRef.current) {
                    stopListening();
                    isHoldingRef.current = false;
                  }
                }}
                onTouchStart={(e) => {
                  // Mobile press-and-hold: start after 300ms
                  e.preventDefault();
                  holdTimerRef.current = setTimeout(() => {
                    isHoldingRef.current = true;
                    startListening();
                  }, 300);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
                  if (isHoldingRef.current) {
                    // Was holding — stop recording
                    stopListening();
                    isHoldingRef.current = false;
                  } else {
                    // Quick tap — toggle
                    toggleListening();
                  }
                }}
                className={`p-2 rounded-xl transition-all touch-manipulation ${
                  isListening
                    ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)] animate-pulse'
                    : 'bg-white/5 text-white/50 hover:bg-white/10'
                }`}
              >
                <Mic className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isGeek ? "> HANDSHAKE_REQUIRED..." : "Ask JARVIS..."}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white font-mono text-sm outline-none focus:border-cyan-500 transition-colors"
              />
              
              <button
                onClick={() => handleSend()}
                className="p-2 bg-cyan-500 text-black rounded-xl hover:scale-105 transition-transform"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JarvisChatPanel;
