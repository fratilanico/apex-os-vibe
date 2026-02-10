import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, Mic, Terminal, Activity, BookOpen, HelpCircle, Volume2, VolumeX } from 'lucide-react';
import { queryAI } from '../../lib/ai/globalAIService';
import { useLocation } from 'react-router-dom';
import { AgentHierarchyVisualization } from '../../src/jarvis/components/AgentHierarchyVisualization';
import { InlineRenderer } from '../ui/Terminal/InlineRenderer';
import { convertMarkdownToCLI } from '../../lib/cliFormatter';
import { useOnboardingStore } from '../../stores/useOnboardingStore';
import { RecommendationEngine } from '../../lib/intelligence/recommendations/engine';
import { MicroQuestionSystem } from '../../lib/intelligence/agents/micro-questions';
import { StudyRecommendation, MicroQuestion } from '../../lib/intelligence/types';

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
  const { 
    mode, 
    setMode, 
    email, 
    isUnlocked, 
    startJarvisSession, 
    endJarvisSession, 
    addJarvisMessage,
    userProfile,
    setUserProfile,
    voiceEnabled,
    setVoiceEnabled
  } = useOnboardingStore();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [language] = useState<'en-US' | 'ro-RO'>('en-US');
  const [view, setView] = useState<'chat' | 'agents' | 'recommendations'>('chat');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recommendations, setRecommendations] = useState<StudyRecommendation[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<MicroQuestion | null>(null);

  // Initialize Intelligence Engines
  const recEngine = useRef(new RecommendationEngine());
  const questionSystem = useRef(new MicroQuestionSystem());
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(typeof window !== 'undefined' ? window.speechSynthesis : null);

  // JARVIS Voice Feedback (Founder Persona)
  const speak = useCallback((text: string) => {
    if (!synthRef.current || !voiceEnabled || isListening) return;
    synthRef.current.cancel();

    // 1. STRIP CODE BLOCKS AND CLI TAGS - They are annoying to hear
    const cleanText = text
      .replace(/\[code\][\s\S]*?\[\/code\]/g, '') // Remove [code] tags and content
      .replace(/```[\s\S]*?```/g, '')             // Remove markdown code blocks
      .replace(/\[(?:\/)?(?:h1|h2|h3|b|muted|info|warn|success|error|choice)\]/g, '') // Remove other tags
      .replace(/\s+/g, ' ')                      // Normalize whitespace
      .trim();
    
    if (!cleanText || cleanText.length < 2) return;
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language;
    
    // 2. TUNE VOICE FOR JARVIS FEEL
    // Try to find a sophisticated British male voice if available
    const voices = synthRef.current.getVoices();
    const jarvisVoice = voices.find(v => 
      (v.name.includes('Google UK English Male') || v.name.includes('Daniel') || v.name.includes('Arthur')) && v.lang.startsWith('en')
    ) || voices.find(v => v.lang.startsWith('en') && v.name.includes('Male'));
    
    if (jarvisVoice) {
      utterance.voice = jarvisVoice;
    }

    utterance.rate = 1.05; // Slightly faster for intelligence feel
    utterance.pitch = 0.9;  // Slightly lower for that sophisticated resonance
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    synthRef.current.speak(utterance);
  }, [language, voiceEnabled, isListening]);

  // Handle incoming messages - cancel speech if new message sent
  useEffect(() => {
    if (isProcessing && synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, [isProcessing]);

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

  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHoldingRef = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Analytics Tracking
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
  }, [isOpen, startJarvisSession, endJarvisSession]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = language === 'ro-RO' 
        ? "Sunt JARVIS. Identificați obiectivul, Fondatorule. Swarm-ul este inactiv." 
        : "I'm JARVIS. Identify your objective, Founder. The swarm is idling.";
      addMessage('jarvis', greeting);
      speak(greeting);
    }
  }, [isOpen, language, speak]);

  const addMessage = (type: 'user' | 'jarvis', text: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type,
      text,
      timestamp: new Date()
    }]);
    
    addJarvisMessage(type, text);
  };

  const processQuery = useCallback(async (query: string) => {
    setIsProcessing(true);
    
    try {
      const personaContext = userProfile.persona === 'investor' || userProfile.persona === 'founder' || userProfile.persona === 'enterprise'
        ? "Persona: RED PILL / BUSINESS. Focus on ROI, metrics, scalability, and business frameworks. Use technical but executive language."
        : "Persona: BLUE PILL / PERSONAL. Focus on projects, skills, 'aha' moments, and hands-on building. Use encouraging, builder-focused language.";

      const aiResponse = await queryAI({
        message: query,
        history: messages.map(m => ({
          role: m.type === 'user' ? 'user' : 'assistant',
          content: m.text
        })),
        userEmail: email || undefined,
        context: `
          User Persona: ${userProfile.persona}
          Journey: ${personaContext}
          Expertise: ${userProfile.expertiseLevel}
          Interests: ${userProfile.interests.join(', ')}
          Current Page: ${location.pathname}
          Mode: ${mode}
          Security Level: ${isUnlocked ? 'TIER 1 (Unlocked)' : 'TIER 0 (Restricted)'}
          System: You are JARVIS, an elite executive assistant for APEX OS. Be concise, technical, and helpful. 
          Respond using APEX CLI tags: [h1], [h2], [h3], [b], [code], [muted], [info], [warn], [success], [error], [choice].
        `
      });

      const formattedResponse = convertMarkdownToCLI(aiResponse.content);
      addMessage('jarvis', formattedResponse);
      speak(aiResponse.content);
      
      // Update Recommendations
      const newRecs = await recEngine.current.getRecommendations(userProfile, {
        sessionId: Date.now().toString(),
        startTime: Date.now(),
        queryCount: messages.length + 1,
        topicsDiscussed: [query, ...messages.slice(-5).map(m => m.text)],
      });
      setRecommendations(newRecs);

      // 3. Check for Micro-Question trigger - REDUCED INTENSITY (20% of original)
      // Trigger much less frequently (e.g. every 10 messages) or with a 20% chance
      const shouldAsk = messages.length > 0 && messages.length % 10 === 0 && Math.random() < 0.5;
      
      if (shouldAsk) {
        const nextQ = await questionSystem.current.getNextQuestion(userProfile);
        if (nextQ) {
          setCurrentQuestion(nextQ);
        }
      }

      // Navigation detection
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
  }, [messages, location.pathname, email, mode, isUnlocked, speak, onNavigate, userProfile, addJarvisMessage]);

  const handleSend = (textOverride?: string) => {
    const text = textOverride || inputText;
    if (!text.trim()) return;
    addMessage('user', text);
    processQuery(text);
    if (!textOverride) setInputText('');
  };

  const handleAnswer = async (answer: string) => {
    if (!currentQuestion) return;
    
    try {
      const updates = await questionSystem.current.processAnswer(userProfile, currentQuestion.id, answer);
      setUserProfile(updates);
      setCurrentQuestion(null);
      addMessage('user', answer);
      addMessage('jarvis', "Information synchronized. Your profile has been updated.");
      speak("Information synchronized, sir.");
    } catch (error) {
      console.error("Error processing answer:", error);
    }
  };

  const isGeek = mode === 'GEEK';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.95 }}
          className={`fixed bottom-24 left-4 right-4 sm:left-6 sm:right-auto sm:w-96 md:w-[28rem] lg:w-[32rem] h-[60vh] sm:h-[500px] md:h-[600px] max-h-[80vh] bg-slate-900/95 backdrop-blur-2xl rounded-2xl border transition-all duration-500 shadow-2xl z-50 flex flex-col overflow-hidden ${isGeek ? 'border-cyan-500/50' : 'border-white/10'}`}
          style={{ maxWidth: isGeek ? '600px' : '500px' }}
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
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`p-2 rounded-lg transition-all ${voiceEnabled ? 'text-cyan-400 bg-white/5' : 'text-white/30 hover:bg-white/10'}`}
                title={voiceEnabled ? "Mute Voice" : "Unmute Voice"}
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

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
                title="Agent Swarm"
              >
                <Activity className="w-4 h-4" />
              </button>

              <button 
                onClick={() => setView(view === 'recommendations' ? 'chat' : 'recommendations')}
                className={`p-2 rounded-lg transition-colors ${view === 'recommendations' ? 'text-cyan-400 bg-white/5' : 'text-white/50 hover:bg-white/10'}`}
                title="Study Recommendations"
              >
                <BookOpen className="w-4 h-4" />
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

                  {currentQuestion && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 rounded-xl bg-violet-900/40 border border-violet-500/50 backdrop-blur-md space-y-3"
                    >
                      <div className="flex items-center gap-2 text-violet-300 font-bold text-[10px] uppercase tracking-widest">
                        <HelpCircle className="w-3 h-3" /> JARVIS Query
                      </div>
                      <p className="text-white text-xs font-medium">{currentQuestion.question}</p>
                      <div className="grid grid-cols-1 gap-2">
                        {currentQuestion.options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => handleAnswer(opt)}
                            className="text-left p-2 rounded-lg bg-white/5 hover:bg-violet-500/20 text-white/80 hover:text-white text-[10px] border border-white/5 transition-all"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ) : view === 'agents' ? (
                <motion.div
                  key="agents"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-slate-950 overflow-hidden"
                >
                  <div className="h-full scale-[0.5] origin-top transform-gpu">
                    <AgentHierarchyVisualization />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="recommendations"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="absolute inset-0 p-6 overflow-y-auto custom-scrollbar space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-cyan-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                      <BookOpen className="w-4 h-4" /> Neural Roadmap
                    </h4>
                  </div>
                  
                  {recommendations.length > 0 ? (
                    recommendations.map((rec) => (
                      <motion.div
                        key={rec.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all group"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-[10px] font-mono text-cyan-400/60 uppercase">{rec.type} // {rec.difficulty}</span>
                          <span className="text-[10px] font-mono text-white/30">{rec.estimatedTime}m</span>
                        </div>
                        <h5 className="text-white font-bold text-sm mb-1 group-hover:text-cyan-400 transition-colors">{rec.title}</h5>
                        <p className="text-white/50 text-[10px] leading-relaxed mb-3">{rec.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-emerald-400 font-medium bg-emerald-400/10 px-2 py-0.5 rounded-full">
                            {rec.matchReason}
                          </span>
                          <button 
                            onClick={() => window.open(rec.url, '_blank')}
                            className="text-[10px] text-cyan-400 font-bold uppercase tracking-tighter hover:underline"
                          >
                            Access Module
                          </button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Bot className="w-12 h-12 text-white/10 mx-auto mb-4" />
                      <p className="text-white/30 text-[10px] uppercase tracking-widest">Awaiting more data to refine roadmap...</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input Area */}
          <div className={`p-4 border-t transition-colors duration-500 ${isGeek ? 'border-cyan-500/30 bg-cyan-500/5' : 'border-white/10 bg-black/20'}`}>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (!isHoldingRef.current) {
                    toggleListening();
                  }
                  isHoldingRef.current = false;
                }}
                onMouseDown={() => {
                  holdTimerRef.current = setTimeout(() => {
                    isHoldingRef.current = true;
                    startListening();
                  }, 300);
                }}
                onMouseUp={() => {
                  if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
                  if (isHoldingRef.current) {
                    stopListening();
                  }
                }}
                className={`p-2 rounded-xl transition-all ${isListening ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)] animate-pulse' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
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
