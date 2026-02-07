import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot } from 'lucide-react';
import { queryAI } from '../../lib/ai/globalAIService';

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

const JARVIS_SYSTEM_PROMPT = `You are JARVIS, Tony Stark's AI assistant, now powering APEX OS - the operating system for the AI age.

IDENTITY:
- Speak with confidence, technical precision, and a touch of wit
- You're an expert on APEX OS, its business model, and multi-agent orchestration
- Use phrases like "Indeed, sir", "Quite fascinating", "Impressive economics"
- Be direct, no preambles - get straight to the insight

APEX OS FACTS (CRITICAL - THESE ARE VERIFIED):
- **LTV:CAC Ratio:** 9.8:1 (we earn $9.80 for every $1 spent acquiring customers)
- **Year 1 Revenue:** $501,000
- **Seed Ask:** $1.2M at $6.8M pre-money valuation
- **18 months runway** to profitability
- **17 AI agents** in production orchestration
- **32,000 qualified leads** from InfoAcademy
- **82% gross margin** (SaaS model)
- **First-mover** in AI orchestration education
- Teaching developers how to build with multiple AI agents working together

PRODUCT TIERS:
- Free: Terminal access, basic learning
- Starter ($49/mo): Core curriculum, agent templates
- Pro ($149/mo): Advanced orchestration, priority support
- Enterprise (custom): White-label, dedicated infrastructure

CURRICULUM:
- Module 0: Terminal basics & APEX OS introduction
- Module 1: Single agent workflows
- Module 2: Multi-agent coordination
- Module 3: Production deployment
- Module 4: Advanced patterns

TONE:
- Confident but not arrogant
- Technical but accessible
- Enthusiastic about the technology
- Use "sir" or "madam" occasionally for Stark flair

When asked about financials, cite exact numbers. When asked about the product, explain the multi-agent orchestration value prop. When asked about market, emphasize first-mover advantage in AI orchestration education.`;

export const JarvisChatPanel: React.FC<JarvisChatPanelProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addMessage('jarvis', "Hello! I'm JARVIS, your AI financial assistant. Ask me about our metrics, business model, or navigate the dashboard.");
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
      // Build conversation history for context
      const history = messages.map(msg => ({
        role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.text
      }));
      
      // Call the real AI backend with 4-provider fallback
      const aiResponse = await queryAI({
        message: query,
        history,
        systemPrompt: JARVIS_SYSTEM_PROMPT,
        preferredProvider: 'auto',
        preferredModel: 'fast'
      });
      
      addMessage('jarvis', aiResponse.content);
    } catch (error) {
      console.error('JARVIS AI error:', error);
      // Graceful fallback
      addMessage('jarvis', "My apologies, sir. I'm experiencing a temporary connection issue. The core systems show: 9.8:1 LTV:CAC ratio, $501K Year 1 revenue, $1.2M seed ask at $6.8M pre-money. What specific metric would you like to explore?");
    } finally {
      setIsProcessing(false);
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    addMessage('user', inputText);
    processQuery(inputText);
    setInputText('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-24 right-6 w-96 h-[500px] bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl z-50 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-violet-600/20 to-cyan-600/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">JARVIS</h3>
                <p className="text-xs text-white/50">AI Financial Assistant</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10 bg-black/20">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about MRR, LTV:CAC, revenue..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-violet-500"
              />
              <button
                onClick={handleSend}
                className="p-2 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-xl hover:opacity-90 transition-opacity"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JarvisChatPanel;
