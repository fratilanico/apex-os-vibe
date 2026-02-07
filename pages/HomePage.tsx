import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { ToolsGrid } from '../components/ToolsGrid';
import { Curriculum } from '../components/Curriculum';
import { Footer } from '../components/Footer';
import { GridLoader } from '@/components/artifacts/PlayerOne/components/GridLoader';

interface OutletContext {
  onOpenCurriculum: () => void;
}

export const HomePage: React.FC = () => {
  const { onOpenCurriculum } = useOutletContext<OutletContext>();
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedInitialLoad, setHasCompletedInitialLoad] = useState(false);

  useEffect(() => {
    // ⚡ INSTANT SYNC: No simulated waiting
    setIsLoading(false);
    setHasCompletedInitialLoad(true);
    sessionStorage.setItem('apex_initial_load_complete', 'true');
  }, []);

  // Check if we should skip loader (user has seen it this session)
  useEffect(() => {
    const initialLoadComplete = sessionStorage.getItem('apex_initial_load_complete');
    if (initialLoadComplete && !localStorage.getItem('apex_authenticated')) {
      setIsLoading(false);
      setHasCompletedInitialLoad(true);
    }
  }, []);

  return (
    <>
      <GridLoader 
        isLoading={isLoading} 
        onLoadingComplete={() => setIsLoading(false)} 
      />
      <main className={`relative z-10 px-4 sm:px-6 max-w-6xl mx-auto space-y-20 pb-16 transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <Hero onOpenCurriculum={onOpenCurriculum} />
        <ToolsGrid />
        <Curriculum onOpenCurriculum={onOpenCurriculum} />
        <Footer />
      </main>
    </>
  );
};
