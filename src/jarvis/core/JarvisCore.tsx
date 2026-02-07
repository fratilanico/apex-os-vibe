import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Terminal, Cpu, X, Minimize2, Maximize2 } from 'lucide-react';

interface JarvisCoreProps {
  isOpen: boolean;
  onClose: () => void;
  skin: 'holographic' | 'terminal';
  onSkinChange: (skin: 'holographic' | 'terminal') => void;
}

interface Message {
  id: string;
  role: 'user' | 'jarvis';
  content: string;
  timestamp: Date;
  model?: string;
}

export const JarvisCore: React.FC<JarvisCoreProps> = ({
  isOpen,
  onClose,
  skin,
  onSkinChange,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [personality, setPersonality] = useState<'professional' | 'witty' | 'sarcastic'>('professional');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);

    // Simulate response
    setTimeout(() => {
      const jarvisMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'jarvis',
        content: getPersonalityResponse('I have analyzed your request.'),
        timestamp: new Date(),
        model: 'Qwen 2.5 7B',
      };
      setMessages(prev => [...prev, jarvisMessage]);
      setIsThinking(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getPersonalityResponse = (baseResponse: string): string => {
    switch (personality) {
      case 'witty':
        return baseResponse + ' Rather fascinating, would you not say?';
      case 'sarcastic':
        return 'Oh, absolutely. ' + baseResponse + ' Not that you needed me to tell you that.';
      default:
        return baseResponse;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: 1, 
            scale: isMinimized ? 0.5 : 1,
            y: isMinimized ? 300 : 0,
          }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`fixed z-50 ${
            skin === 'holographic' 
              ? 'bg-black/80 backdrop-blur-xl border border-cyan-500/50 shadow-[0_0_50px_rgba(34,211,238,0.3)]' 
              : 'bg-black border border-green-500/50 font-mono'
          } rounded-2xl overflow-hidden`}
          style={{
            width: isMinimized ? '300px' : '600px',
            height: isMinimized ? '80px' : '700px',
            right: '20px',
            bottom: '20px',
          }}
        >
          {/* Header */}
          <div className={`flex items-center justify-between p-4 border-b ${
            skin === 'holographic' ? 'border-cyan-500/30' : 'border-green-500/30'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                skin === 'holographic' 
                  ? 'bg-cyan-500/20 border border-cyan-500/50' 
                  : 'bg-green-500/20 border border-green-500/50'
              }`}>
                <span className={skin === 'holographic' ? 'text-cyan-400' : 'text-green-400'}>J</span>
              </div>
              <div>
                <h3 className={`font-bold ${
                  skin === 'holographic' ? 'text-cyan-400' : 'text-green-400'
                }`}>
                  {isMinimized ? 'JARVIS' : 'J.A.R.V.I.S.'}
                </h3>
                {!isMinimized && (
                  <p className={`text-xs ${
                    skin === 'holographic' ? 'text-cyan-600' : 'text-green-600'
                  }`}>
                    Just A Rather Very Intelligent System
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onSkinChange(skin === 'holographic' ? 'terminal' : 'holographic')}
                className={`p-2 rounded-lg transition-colors ${
                  skin === 'holographic' 
                    ? 'hover:bg-cyan-500/20 text-cyan-400' 
                    : 'hover:bg-green-500/20 text-green-400'
                }`}
              >
                {skin === 'holographic' ? <Terminal size={18} /> : <Cpu size={18} />}
              </button>

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className={`p-2 rounded-lg transition-colors ${
                  skin === 'holographic' 
                    ? 'hover:bg-cyan-500/20 text-cyan-400' 
                    : 'hover:bg-green-500/20 text-green-400'
                }`}
              >
                {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-lg transition-colors hover:bg-red-500/20 text-red-400"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: '500px' }}>
                {messages.length === 0 && (
                  <div className={`text-center py-12 ${
                    skin === 'holographic' ? 'text-cyan-600' : 'text-green-600'
                  }`}>
                    <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
                      skin === 'holographic' 
                        ? 'bg-cyan-500/20 border border-cyan-500/50' 
                        : 'bg-green-500/20 border border-green-500/50'
                    }`}>
                      <span className="text-2xl">J</span>
                    </div>
                    <p className="text-lg">Good evening, sir. How may I assist you today?</p>
                    <div className="mt-6 flex flex-wrap gap-2 justify-center">
                      {['Analyze unit economics', 'Check agent status', 'Switch to Terminal', 'House Party Protocol'].map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => setInput(suggestion)}
                          className={`px-3 py-1 rounded-full text-sm border ${
                            skin === 'holographic'
                              ? 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10'
                              : 'border-green-500/30 text-green-400 hover:bg-green-500/10'
                          }`}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div className={`max-w-[80%] p-3 rounded-2xl ${
                      message.role === 'user'
                        ? skin === 'holographic'
                          ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-100'
                          : 'bg-green-500/20 border border-green-500/30 text-green-100'
                        : 'bg-zinc-800/80 border border-zinc-700 text-zinc-200'
                    }`}>
                      <p>{message.content}</p>
                      {message.model && (
                        <span className={`text-xs ${
                          skin === 'holographic' ? 'text-cyan-600' : 'text-green-600'
                        }`}>
                          via {message.model}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}

                {isThinking && (
                  <div className="flex justify-start">
                    <div className={`p-3 rounded-2xl ${
                      skin === 'holographic'
                        ? 'bg-zinc-800/80 border border-cyan-500/30'
                        : 'bg-zinc-800/80 border border-green-500/30'
                    }`}>
                      <div className="flex gap-1">
                        <span className="animate-bounce">.</span>
                        <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>.</span>
                        <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className={`p-4 border-t ${
                skin === 'holographic' ? 'border-cyan-500/30' : 'border-green-500/30'
              }`}>
                <div className="flex gap-2">
                  <button
                    className={`p-3 rounded-xl transition-colors ${
                      skin === 'holographic'
                        ? 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20'
                        : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                    }`}
                  >
                    <Mic size={20} />
                  </button>

                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your command or speak..."
                    className={`flex-1 px-4 py-3 rounded-xl bg-zinc-900/80 border outline-none transition-colors ${
                      skin === 'holographic'
                        ? 'border-cyan-500/30 text-cyan-100 placeholder-cyan-700 focus:border-cyan-500'
                        : 'border-green-500/30 text-green-100 placeholder-green-700 focus:border-green-500'
                    }`}
                  />

                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isThinking}
                    className={`px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 ${
                      skin === 'holographic'
                        ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/50'
                        : 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/50'
                    }`}
                  >
                    Send
                  </button>
                </div>

                {/* Personality Selector */}
                <div className="mt-3 flex gap-2 justify-center">
                  {(['professional', 'witty', 'sarcastic'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPersonality(p)}
                      className={`px-3 py-1 rounded-full text-xs capitalize transition-colors ${
                        personality === p
                          ? skin === 'holographic'
                            ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                            : 'bg-green-500/30 text-green-300 border border-green-500/50'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
