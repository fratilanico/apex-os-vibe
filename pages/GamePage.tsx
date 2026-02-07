import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { TronScene, TronGrid, DataStreams } from '../components/game/TronEnvironment';
import { HoloTerminal, Cyberdeck } from '../components/game/HolographicUI';
import { GameHUD, DashboardOverlay } from '../components/game';
import { GridLoader } from '../components/artifacts/PlayerOne/components/GridLoader';

export function GamePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 🔥 INSTANT SYSTEM ENGAGEMENT
    setIsLoading(false);
  }, []);

  return (
    <div className="fixed inset-0 bg-tron-bg overflow-hidden">
      <GridLoader isLoading={isLoading} onLoadingComplete={() => setIsLoading(false)} />
      
      {/* Rest of the component with a fast fade-in */}
      <motion.div 
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        className="w-full h-full"
      >
        {/* Exit Button */}
        <button
          onClick={() => navigate('/')}
          className="fixed top-4 right-4 z-[100] px-6 py-2 font-mono text-sm uppercase tracking-wider
                     bg-black/60 border border-tron-cyan text-tron-cyan
                     hover:bg-tron-cyan/10 hover:border-tron-cyan/80 hover:shadow-[0_0_10px_rgba(0,255,255,0.3)]
                     transition-all duration-200 rounded backdrop-blur-sm"
        >
          Exit System
        </button>

        {/* 3D Scene */}
        <ErrorBoundary fallback={
          <div className="absolute inset-0 flex items-center justify-center bg-tron-bg">
            <div className="text-tron-cyan font-mono text-center">
              <p className="text-2xl mb-4">3D Environment Error</p>
              <p className="text-sm opacity-70">The TRON grid failed to initialize</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 border border-tron-cyan hover:bg-tron-cyan/10"
              >
                Reload
              </button>
            </div>
          </div>
        }>
          <TronScene>
            <TronGrid />
            <DataStreams />
            <Cyberdeck position={[0, -1.5, 2]} />
            <HoloTerminal position={[0, 1, 0]} />
          </TronScene>
        </ErrorBoundary>

        {/* 2D HUD Overlay */}
        <GameHUD />
        <DashboardOverlay />
      </motion.div>
    </div>
  );
}

