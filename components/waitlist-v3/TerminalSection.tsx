'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TerminalContent, TerminalInput, useTerminal } from '../SpectacularTerminal';

export const TerminalSection: React.FC = () => {
  const {
    lines,
    inputValue,
    setInputValue,
    step,
    isProcessing,
    showPillChoice,
    glitchActive,
    scanActive,
    getPlaceholder,
    terminalRef,
    inputRef,
    handleCommand,
    handlePillChoice,
  } = useTerminal();

  return (
    <div className="py-8 w-full">
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full"
      >
        {/* Terminal window frame - Flex layout to eliminate extra space */}
        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/90 w-full max-w-full transition-all duration-700 flex flex-col h-[60vh] sm:h-[65vh] md:h-[70vh]">
          {/* Title bar */}
          <div className="h-10 bg-white/5 flex items-center px-4 gap-2 border-b border-white/5 flex-shrink-0">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-3 text-xs text-white/30 font-mono tracking-wider">
              Module 00 // Orchestrator Cockpit
            </span>
          </div>

          {/* Content area - grows to fill space, no extra black area */}
          <div className="relative flex-1 overflow-y-auto min-h-0">
            <TerminalContent
              lines={lines}
              step={step}
              isProcessing={isProcessing}
              showPillChoice={showPillChoice}
              glitchActive={glitchActive}
              scanActive={scanActive}
              onPillChoice={handlePillChoice}
              terminalRef={terminalRef}
            />

            {/* Scanline overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
              }}
            />
          </div>

          {/* Input bar - sits at bottom with no gap above it */}
          <TerminalInput
            inputValue={inputValue}
            setInputValue={setInputValue}
            step={step}
            isProcessing={isProcessing}
            showPillChoice={showPillChoice}
            getPlaceholder={getPlaceholder}
            onSubmit={handleCommand}
            inputRef={inputRef}
          />
        </div>
      </motion.section>
    </div>
  );
};
