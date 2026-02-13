import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GridLoaderProps {
  isLoading: boolean;
  onLoadingComplete?: () => void;
}

export const GridLoader: React.FC<GridLoaderProps> = ({ isLoading, onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState('IGNITION_SEQUENCE_START');
  const [glitchActive, setGlitchActive] = useState(false);

  const loadingTexts = [
    'BOOTING_CORE_ENGINE...',
    'SYNCING_NEURAL_STREAMS...',
    'KIMI_PRINCIPAL_LINK_STABLE',
    'CALIBRATING_QUANT_ARCS...',
    'DIVERGING_TIMELINES...',
    'ACCELERATING_VECTORS...',
    'BYPASSING_CONVENTIONAL_LIMITS...',
    'STARK_PROTOCOLS_ENGAGED',
    'SYSTEM_READY'
  ];

  useEffect(() => {
    if (!isLoading) {
      setProgress(100);
      setCurrentText('READY');
      setTimeout(() => {
        onLoadingComplete?.();
      }, 300);
      return;
    }

    setProgress(0);
    
    // High-frequency text switching (Stark vibe)
    let textIndex = 0;
    const textInterval = setInterval(() => {
      textIndex++;
      if (textIndex < loadingTexts.length) {
        setCurrentText(loadingTexts[textIndex]!);
      }
    }, 80); // Fast text transition

    // Rapid progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        // Accelerating progress
        const step = Math.random() * 15 + 5; 
        return Math.min(prev + step, 100);
      });
    }, 50);

    // Occasional glitches
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 50);
    }, 400);

    return () => {
      clearInterval(textInterval);
      clearInterval(progressInterval);
      clearInterval(glitchInterval);
    };
  }, [isLoading, onLoadingComplete]);

  const cols = 24;
  const rows = 14;
  const totalCells = cols * rows;
  const targetActiveCells = Math.ceil((progress / 100) * totalCells);
  
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            filter: glitchActive ? 'hue-rotate(90deg) brightness(1.5) contrast(2)' : 'none'
          }}
          exit={{ 
            scale: 2,
            opacity: 0,
            filter: 'blur(20px) brightness(2)',
            transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] }
          }}
          className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Stark scanline effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none z-50" />
          
          <div className="relative z-10 flex flex-col items-center gap-12">
            {/* The Warp Speed Logo Placeholder */}
            <motion.div 
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: glitchActive ? [0, 2, -2, 0] : 0
              }}
              transition={{ duration: 0.1, repeat: Infinity }}
              className="relative w-24 h-24 border-2 border-cyan-500 rounded-full flex items-center justify-center"
            >
              <div className="w-16 h-16 border border-cyan-400 rounded-full animate-ping" />
              <div className="absolute inset-0 border-t-2 border-emerald-400 rounded-full animate-spin" />
            </motion.div>

            {/* High-Density Grid */}
            <div className="relative group">
              <div 
                className="grid gap-[2px]"
                style={{ 
                  gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                  width: '600px',
                }}
              >
                {Array.from({ length: totalCells }).map((_, index) => {
                  const isActive = index < targetActiveCells;
                  const intensity = Math.random();
                  
                  return (
                    <motion.div
                      key={index}
                      animate={{ 
                        opacity: isActive ? (intensity > 0.5 ? 1 : 0.7) : 0.05,
                        backgroundColor: isActive ? '#06b6d4' : '#111'
                      }}
                      className="w-5 h-2 rounded-[1px]"
                    />
                  );
                })}
              </div>
              
              {/* Telemetry Overlays */}
              <div className="absolute -top-12 -left-12 font-mono text-[8px] text-cyan-500/60 leading-tight">
                KERNEL_LOAD: 0.003s<br/>
                MEMORY_MAP: SUCCESS<br/>
                NEURAL_LINK: ACTIVE
              </div>
              <div className="absolute -bottom-12 -right-12 font-mono text-[8px] text-emerald-500/60 text-right leading-tight">
                COORD_X: {Math.random().toFixed(4)}<br/>
                COORD_Y: {Math.random().toFixed(4)}<br/>
                STARK_V6.0_STABLE
              </div>
            </div>

            {/* Status Bar */}
            <div className="w-[600px] space-y-4">
              <div className="flex justify-between items-end">
                <div className="font-black font-mono text-xs text-white tracking-[0.4em] uppercase">
                  {currentText}
                </div>
                <div className="font-mono text-[10px] text-cyan-400">
                  {Math.round(progress)}%
                </div>
              </div>
              
              <div className="h-1 w-full bg-white/5 relative overflow-hidden">
                <motion.div
                  className="h-full bg-cyan-400 shadow-[0_0_15px_#22d3ee]"
                  animate={{ width: `${progress}%` }}
                  transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                />
                {/* Traveling spark */}
                <motion.div 
                  animate={{ left: ['0%', '100%'] }}
                  transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 w-20 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
                />
              </div>
            </div>
          </div>

          {/* Flash Effect on Finish */}
          {progress === 100 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              className="absolute inset-0 bg-white z-[10000]"
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
