import React from 'react';
import { useLocation } from 'react-router-dom';
import { useOnboardingStore } from '../stores/useOnboardingStore';
import { PlayerOneHUD } from './artifacts/PlayerOne/PlayerOneHUD';
import { PlayerOneErrorBoundary } from './artifacts/PlayerOne/PlayerOneErrorBoundary';
import { JarvisIntegration } from './jarvis/JarvisIntegration';
import { EasterEggHints } from './EasterEggHints';
import { ErrorBoundary } from './ErrorBoundary';

export const GlobalOverlay: React.FC = () => {
  const location = useLocation();
  const { isUnlocked } = useOnboardingStore();
  
  // Check for password gate authentication
  const isAuthenticated = typeof sessionStorage !== 'undefined' && sessionStorage.getItem('vibe-auth') === 'true';
  
  // Routes where we hide EVERYTHING by default (unless unlocked/authenticated)
  const isWaitlistRoute = location.pathname.startsWith('/waitlist') || 
                          location.pathname.startsWith('/whitelist') || 
                          location.pathname.startsWith('/waitinglist');
  const isLandingRoute = location.pathname === '/';
  
  // Logic: 
  // 1. JARVIS + Hints are visible on Waitlist OR if authenticated/unlocked
  // 2. PlayerOneHUD is ONLY visible if authenticated AND NOT on Waitlist
  
  const showJarvis = isAuthenticated || isUnlocked || isWaitlistRoute || !isLandingRoute;
  const showHUD = isAuthenticated && !isWaitlistRoute;

  if (!showJarvis && !showHUD) return null;

  return (
    <>
      {showHUD && (
        <PlayerOneErrorBoundary>
          <PlayerOneHUD />
        </PlayerOneErrorBoundary>
      )}
      
      {showJarvis && (
        <>
          <JarvisIntegration />
          <ErrorBoundary fallback={null}>
            <EasterEggHints />
          </ErrorBoundary>
        </>
      )}
    </>
  );
};
