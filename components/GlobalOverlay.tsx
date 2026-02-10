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
  
  // Logic: Show HUD/Jarvis if:
  // 1. User passed PasswordGate (isAuthenticated)
  // 2. User unlocked the Terminal on the Waitlist (isUnlocked)
  // 3. User is on the Waitlist page (Always visible per request)
  // 4. User is NOT on a "clean" route (Landing)
  
  const shouldShow = isAuthenticated || isUnlocked || isWaitlistRoute || !isLandingRoute;

  if (!shouldShow) return null;

  return (
    <>
      <PlayerOneErrorBoundary>
        <PlayerOneHUD />
      </PlayerOneErrorBoundary>
      
      <JarvisIntegration />
      
      <ErrorBoundary fallback={null}>
        <EasterEggHints />
      </ErrorBoundary>
    </>
  );
};
