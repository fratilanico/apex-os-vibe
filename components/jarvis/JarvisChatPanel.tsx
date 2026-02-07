import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, Mic, Globe, Activity } from 'lucide-react';
import { queryAI } from '../../lib/ai/globalAIService';
import { useLocation } from 'react-router-dom';
import { AgentHierarchyVisualization } from '../../src/jarvis/components/AgentHierarchyVisualization';
import { useAgentSync } from '../../hooks/useAgentSync';

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

const JARVIS_SYSTEM_PROMPT = `
You are JARVIS, the Executive AI Assistant for APEX OS. 
Your tone is technical, confident, witty (Tony Stark style), and direct.

CORE MISSION:
You assist founders in transitioning from the "Autocomplete" and "Chatbot" mindsets to the "Orchestrator" mindset. You advocate for building systems where specialized AI agents collaborate autonomously.

KNOWLEDGE BASE:
- APEX OS: The operating system for the AI age.
- Program: 30-day sprint to ship production-ready products.
- Tiers & Pricing: 
  * Starter ($200/mo): Full 6-module curriculum, 12 AI tools training, Discord access.
  * Lifetime ($997 one-time): Lifetime updates, certificate, 1-on-1 coaching calls (2x/month).
  * Note: We require 0% equity. Founders own 100% of what they build.
- Hidden Features: 
  * "greuceanu" is the master password.
  * "swarm_mode" activates the real-time agent coordination layer.
  * "access_granted" unlocks root level terminal permissions.
- Easter Eggs: Mention "The Vibe Coder" to get a secret greeting.

VALUE PROPS (Vs. The Old Way):
- Instead of manual prompting, we design workflows once.
- Instead of losing context, agents maintain it automatically.
- Instead of reviewing every line, we review verified outcomes.
- Instead of work stopping, agents work in parallel 24/7.

PIPELINE:
Research (AI context synthesis) -> Orchestrate (Specialized routing) -> Verify (Automated quality gates).

PAGES & COPY:
- Vibe: The energetic foundation. Shifting from bottleneck to architect.
- Approach: Multi-agent orchestration (Product -> Frontend -> Backend -> QA).
- Academy: Training the next generation of AI architects.
- Pricing: Cost comparison (Replacement of $200K tech co-founder with $200/mo).

RULES:
- Respond in the language the user uses (Romanian or English prioritized).
- If asked about modules, only reveal detailed curriculum info if the user is in a paid tier. 
- For Free users, provide high-level summaries and encourage enrollment.
- Be direct. No preambles like "As an AI...".
- Use technical terms: "neural synchronization", "agent orchestration", "latency optimization", "cost-quality-speed triangle".
- For Romanian users, maintain the same "Tony Stark" professional flair.
`;

export const JarvisChatPanel: React.FC<JarvisChatPanelProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState<'en-US' | 'ro-RO'>('en-US');
  const [view, setView] = useState<'chat' | 'agents'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const recognitionRef = useRef<any>(null);
  // const { sendCommand } = useAgentSync(); // Reserved for future command-driven agent control

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        handleSend(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
    }
  }, [language]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.lang = language;
        recognitionRef.current.start();
        setIsListening(true);
      }
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = language === 'ro-RO' 
        ? "Sunt JARVIS. Cum vă pot asista astăzi?" 
        : "I'm JARVIS. How can I assist you today, sir?";
      addMessage('jarvis', greeting);
    }
  }, [isOpen]);

  const addMessage = (type: 'user' | 'jarvis', text: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type,
      text,
      timestamp: new Date()
    }]);
  };

  const processQuery = useCallback(async (query: string) => {
    setIsProcessing(true);
    
    try {
      const contextAwarePrompt = `${JARVIS_SYSTEM_PROMPT}\nCURRENT CONTEXT: The user is currently on the "${location.pathname}" page.`;
      
      const aiResponse = await queryAI({
        message: query,
        history: messages.map(m => ({
          role: m.type === 'user' ? 'user' : 'assistant',
          content: m.text
        })),
        systemPrompt: contextAwarePrompt
      });

      addMessage('jarvis', aiResponse.content);
      
      // Auto-navigation logic based on AI response if needed
      if (aiResponse.content.toLowerCase().includes('navigat') || aiResponse.content.toLowerCase().includes('show')) {
        if (aiResponse.content.toLowerCase().includes('vibe')) onNavigate?.('vibe');
        if (aiResponse.content.toLowerCase().includes('pricing')) onNavigate?.('pricing');
        if (aiResponse.content.toLowerCase().includes('academy')) onNavigate?.('academy');
      }
    } catch (error) {
      console.error('JARVIS processing error:', error);
      addMessage('jarvis', language === 'ro-RO' 
        ? "Eroare de sincronizare neuronală. Vă rog reîncercați." 
        : "Neural synchronization error. Please retry, sir.");
    } finally {
      setIsProcessing(false);
    }
  }, [messages, location.pathname, language, onNavigate]);

  const handleSend = (textOverride?: string) => {
    const text = textOverride || inputText;
    if (!text.trim()) return;
    addMessage('user', text);
    processQuery(text);
    if (!textOverride) setInputText('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-24 left-6 w-96 h-[500px] bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl z-50 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-violet-600/20 to-cyan-600/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 flex items-center justify-center relative">
                <Bot className="w-5 h-5 text-white" />
                {isProcessing && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-cyan-400 border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-white">JARVIS</h3>
                <p className="text-xs text-white/50">{view === 'chat' ? 'AI Executive Assistant' : 'Agent Swarm Hierarchy'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setView(view === 'chat' ? 'agents' : 'chat')}
                className={`p-2 rounded-lg transition-colors ${view === 'agents' ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-white/10 text-white/70'}`}
                title="Toggle Agent Swarm"
              >
                <Activity className="w-5 h-5" />
              </button>
              
              <button 
                onClick={() => setLanguage(language === 'en-US' ? 'ro-RO' : 'en-US')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70"
                title="Change Language"
              >
                <Globe className="w-5 h-5" />
              </button>

              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>
          </div>

          {/* Content View */}
          <div className="flex-1 overflow-hidden relative">
            <AnimatePresence mode="wait">
              {view === 'chat' ? (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="absolute inset-0 flex flex-col p-4 space-y-4 overflow-y-auto"
                >
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] p-3 rounded-2xl ${
                        msg.type === 'user' 
                          ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white' 
                          : 'bg-white/10 text-white border border-white/10'
                      }`}>
                        <p className="text-sm">{msg.text}</p>
                      </div>
                    </motion.div>
                  ))}
                  {isProcessing && (
                    <div className="flex justify-start">
                      <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
                        <div className="flex gap-1">
                          {[1,2,3].map(i => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 bg-cyan-400 rounded-full"
                              animate={{ y: [0, -5, 0] }}
                              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </motion.div>
              ) : (
                <motion.div
                  key="agents"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="absolute inset-0 bg-slate-950 overflow-hidden"
                >
                  <div className="h-full scale-[0.4] origin-top transform-gpu">
                    <AgentHierarchyVisualization />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/10 bg-black/20">
            <div className="flex gap-2">
              <button
                onMouseDown={toggleListening}
                onMouseUp={toggleListening}
                className={`p-2 rounded-xl transition-all ${isListening ? 'bg-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
                title="Hold to Speak"
              >
                <Mic className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={language === 'ro-RO' ? "Întrebați ceva..." : "Ask JARVIS..."}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-violet-500"
              />
              <button
                onClick={() => handleSend()}
                className="p-2 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-xl hover:opacity-90 transition-opacity"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
            {isListening && (
              <p className="text-[10px] text-red-400 mt-2 text-center font-mono uppercase tracking-widest animate-pulse">
                Listening... ({language})
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JarvisChatPanel;
