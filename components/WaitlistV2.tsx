'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// Basic type for a terminal line
interface TerminalLine {
  text: string;
  type?: 'input' | 'output' | 'error' | 'system' | 'success';
}

const BOOT_SEQUENCE = [
  { text: '> initializing APEX_OS kernel...', delay: 100, type: 'system' as const },
  { text: '> loading Module 00 curriculum...', delay: 300, type: 'system' as const },
  { text: '> connecting to APEX OS Intel...', delay: 500, type: 'system' as const },
  { text: '[OK] system ready', delay: 900, type: 'success' as const },
];

export const WaitlistV2: React.FC = () => {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState('');
  const [email, setEmail] = useState('');
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [booted, setBooted] = useState(false);
  const [bootLine, setBootLine] = useState(0);

  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addLine = useCallback((text: string, type: TerminalLine['type'] = 'output') => {
    setLines(prev => [...prev, { text, type }].slice(-100));
  }, []);

  // Boot sequence effect
  useEffect(() => {
    if (booted) return;
    const line = BOOT_SEQUENCE[bootLine];
    if (!line) {
      setBooted(true);
      return;
    }
    const timer = setTimeout(() => {
      addLine(line.text, line.type);
      setBootLine(p => p + 1);
      if (bootLine === BOOT_SEQUENCE.length - 1) {
        setBooted(true);
        addLine('Please enter your email to join the waitlist:', 'system');
      }
    }, line.delay);
    return () => clearTimeout(timer);
  }, [bootLine, booted, addLine]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const handleCommand = async (command: string) => {
    if (!isEmailSubmitted) {
        // Simple email validation
        if (!/\S+@\S+\.\S+/.test(command)) {
            addLine('Invalid email format. Please try again.', 'error');
            return;
        }
        setEmail(command);
        setIsEmailSubmitted(true);
        setInput('');
        addLine(`> Email registered: ${command}`, 'success');
        addLine('You can now use the terminal. Type `help` for commands.', 'system');
        return;
    }

    const trimmed = command.trim();
    if (!trimmed) return;

    addLine(`> ${trimmed}`, 'input');
    setInput('');
    setIsProcessing(true);

    try {
      // API call will be added here later
      const response = await fetch('/api/waitlist-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, name: 'Waitlist User', command: trimmed }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API request failed');
      }

      // For now, just echo
      await new Promise(res => setTimeout(res, 1000));
      addLine(`Echo: ${trimmed}`);
    } catch (error) {
      addLine(`Error: ${(error as Error).message}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-black text-white font-mono">
      {/* Left Panel (25%) */}
      <div className="w-1/4 h-full p-4 flex flex-col space-y-4 border-r border-gray-700">
        <div className="flex-1 border border-dashed border-gray-600 p-2">Left Top (Typewriter, CTA)</div>
        <div className="flex-1 border border-dashed border-gray-600 p-2">Left Bottom (Cool Widget)</div>
      </div>

      {/* Right Panels (75%) */}
      <div className="w-3/4 h-full flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto" ref={terminalRef}>
            {/* APEX OS ASCII LOGO */}
            <pre className="text-cyan-400 text-center text-sm">
                {
`
    /\\\\\\\\\\\\\\\_ /\\\\\\\\\\\\\\\\\\_        /\\\\\\\\\\\\\\\_        /\\\\\\\\\_        
     /\\\//////////__//\\\///////////__       /\\\///////////__      /\\\///////\\\_       
      /\\\      /\\\/      /\\\      /\\\      /\\\      /\\\_     /\\\______/\\\_      
       /\\\\\\\\\\\/ /\\\      /\\\      /\\\      /\\\      /\\\\\\\\\\\/ /\\\      
        /\\\/////////  /\\\      /\\\      /\\\      /\\\      /\\\///////////  /\\\      
         /\\\    /\\\/ /\\\      /\\\      /\\\      /\\\      /\\\      /\\\      
          /\\\    /\\\/ /\\\\\\\\\\\\\\\/       /\\\\\\\\\\\\\\\/ /\\\      /\\\      
           \///     \///  \/////////////         \/////////////  \///       \///      
`                
                }
            </pre>
            {lines.map((line, i) => (
                <div key={i} className={`whitespace-pre-wrap ${line.type === 'error' ? 'text-red-500' : line.type === 'success' ? 'text-green-500' : 'text-cyan-400'}`}>
                    {line.text}
                </div>
            ))}
        </div>
        <div className="h-1/3 p-4 flex space-x-4 border-t border-gray-700">
            <div className="flex-1 border border-dashed border-gray-600 p-2">Bottom Right (Modules)</div>
            <div className="w-1/3 border border-dashed border-gray-600 p-2">
                 <form onSubmit={(e) => { e.preventDefault(); handleCommand(input); }} className="h-full">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full h-full bg-transparent focus:outline-none"
                        placeholder={!booted ? 'Initializing...' : isEmailSubmitted ? 'Type command...' : 'Enter your email...'}
                        disabled={isProcessing || !booted}
                        autoFocus
                    />
                </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default WaitlistV2;
