import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { PasswordGate } from './components/PasswordGate';
import { ScrollToTop } from './components/ScrollToTop';
import { StickyCTA } from './components/StickyCTA';
import { EasterEggHints } from './components/EasterEggHints';
import { PlayerOneHUD } from './components/artifacts/PlayerOne/PlayerOneHUD';
import { PlayerOneErrorBoundary } from './components/artifacts/PlayerOne/PlayerOneErrorBoundary';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useWebVitals } from './hooks/useWebVitals';

// Lazy load all page components for better performance
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const VibePage = lazy(() => import('./pages/VibePage').then(m => ({ default: m.VibePage })));
const ApproachPage = lazy(() => import('./pages/ApproachPage').then(m => ({ default: m.ApproachPage })));
const AcademyPage = lazy(() => import('./pages/AcademyPage').then(m => ({ default: m.AcademyPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const PricingPage = lazy(() => import('./pages/PricingPage').then(m => ({ default: m.PricingPage })));
const AdminPage = lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })));
const GamePage = lazy(() => import('./pages/GamePage').then(m => ({ default: m.GamePage })));
const ShowMeTheMoneyPage = lazy(() => import('./pages/ShowMeTheMoneyPage').then(m => ({ default: m.ShowMeTheMoneyPage })));
const ShowMeTheMoneyFix2Page = lazy(() => import('./pages/ShowMeTheMoneyFix2Page').then(m => ({ default: m.ShowMeTheMoneyPage })));
const ShowMeTheMoneyFix4Page = lazy(() => import('./pages/ShowMeTheMoneyFix4Page').then(m => ({ default: m.ShowMeTheMoneyFix4Page })));
const ShowMeTheMoneyFix5Page = lazy(() => import('./pages/ShowMeTheMoneyFix5Page').then(m => ({ default: m.ShowMeTheMoneyFix5Page })));
const FullPitch01Page = lazy(() => import('./pages/FullPitch01Page'));
const PitchDeckExecPage = lazy(() => import('./pages/PitchDeckExecPage'));

const MatrixPage = lazy(() => import('./pages/MatrixPage').then(m => ({ default: m.default })));
const WaitlistPage = lazy(() => import('./components/waitlist-v3/WaitlistPageV3'));
const WaitingListPage = lazy(() => import('./pages/WaitingList'));
// const NewsletterHubPage = lazy(() => import('./components/NewsletterHub').then(m => ({ default: m.NewsletterHub })));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-cyan-400 font-mono animate-pulse">Loading...</div>
  </div>
);

const RouteErrorFallback: React.FC<{ error: Error }> = ({ error }) => (
  <div className="min-h-screen flex items-center justify-center px-4">
    <div className="max-w-md text-center">
      <h1 className="text-2xl font-bold text-red-400 mb-4">Something went wrong</h1>
      <p className="text-white/60 mb-4">{error.message}</p>
      <button
        onClick={() => window.location.href = '/'}
        className="px-6 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600"
      >
        Return Home
      </button>
    </div>
  </div>
);

// Protected routes component
const ProtectedRoutes: React.FC = () => {
  return (
    <PasswordGate>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={
            <ErrorBoundary fallback={<RouteErrorFallback error={new Error('Home page error')} />}>
              <HomePage />
            </ErrorBoundary>
          } />
          <Route path="/vibe" element={
            <ErrorBoundary fallback={<RouteErrorFallback error={new Error('Vibe page error')} />}>
              <VibePage />
            </ErrorBoundary>
          } />
          <Route path="/approach" element={
            <ErrorBoundary fallback={<RouteErrorFallback error={new Error('Approach page error')} />}>
              <ApproachPage />
            </ErrorBoundary>
          } />
          <Route path="/academy" element={
            <ErrorBoundary fallback={<RouteErrorFallback error={new Error('Academy page error')} />}>
              <AcademyPage />
            </ErrorBoundary>
          } />
          <Route path="/contact" element={
            <ErrorBoundary fallback={<RouteErrorFallback error={new Error('Contact page error')} />}>
              <ContactPage />
            </ErrorBoundary>
          } />
          <Route path="/pricing" element={
            <ErrorBoundary fallback={<RouteErrorFallback error={new Error('Pricing page error')} />}>
              <PricingPage />
            </ErrorBoundary>
          } />
          <Route path="/admin" element={
            <ErrorBoundary fallback={<RouteErrorFallback error={new Error('Admin page error')} />}>
              <AdminPage />
            </ErrorBoundary>
          } />
          <Route path="/showmethemoney" element={
            <ErrorBoundary fallback={<RouteErrorFallback error={new Error('Business plan page error')} />}>
              <ShowMeTheMoneyPage />
            </ErrorBoundary>
          } />
          <Route path="/showmethemoneytest" element={
            <ErrorBoundary fallback={<RouteErrorFallback error={new Error('Business plan test page error')} />}>
              <ShowMeTheMoneyPage />
            </ErrorBoundary>
          } />
          <Route path="/showmethefix2" element={
            <ErrorBoundary fallback={<RouteErrorFallback error={new Error('Pitch deck fix page error')} />}>
              <ShowMeTheMoneyFix2Page />
            </ErrorBoundary>
          } />
          <Route path="/showmethefix4" element={
            <ErrorBoundary fallback={<RouteErrorFallback error={new Error('Pitch deck fix 4 page error')} />}>
              <ShowMeTheMoneyFix4Page />
            </ErrorBoundary>
          } />
          <Route path="/showmethefix5" element={
            <ErrorBoundary fallback={<RouteErrorFallback error={new Error('Pitch deck fix 5 page error')} />}>
              <ShowMeTheMoneyFix5Page />
            </ErrorBoundary>
          } />
          <Route path="/fullpitch01" element={
            <ErrorBoundary fallback={<RouteErrorFallback error={new Error('Full Pitch 01 page error')} />}>
              <FullPitch01Page />
            </ErrorBoundary>
          } />
          <Route path="/pitchdeckexec" element={
            <ErrorBoundary fallback={<RouteErrorFallback error={new Error('Pitch Deck Exec page error')} />}>
              <PitchDeckExecPage />
            </ErrorBoundary>
          } />
          <Route path="/matrix" element={
            <ErrorBoundary fallback={<RouteErrorFallback error={new Error('Matrix page error')} />}>
              <MatrixPage />
            </ErrorBoundary>
          } />
        </Route>
        {/* Game page outside Layout - full-screen immersive experience */}
        <Route path="/game" element={
          <ErrorBoundary fallback={<RouteErrorFallback error={new Error('Game page error')} />}>
            <GamePage />
          </ErrorBoundary>
        } />
      </Routes>
    </PasswordGate>
  );
};

// Public routes component (no password protection)
const PublicRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="*" element={
        <ErrorBoundary fallback={<RouteErrorFallback error={new Error('Waitlist page error')} />}>
          <WaitlistPage />
        </ErrorBoundary>
      } />
    </Routes>
  );
};

// Hide HUD/CTA on specific routes to keep the page clean
const HideOnCleanRoutes: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isCleanRoute = 
    location.pathname === '/' || 
    location.pathname.startsWith('/waitlist') || 
    location.pathname.startsWith('/waitinglist') ||
    location.pathname.startsWith('/whitelist');
    
  if (isCleanRoute) return null;
  return <>{children}</>;
};

const App = (): React.ReactElement => {
  // Initialize web vitals monitoring
  useWebVitals();

  return (
    <BrowserRouter>
      <ScrollToTop />
      <HideOnCleanRoutes>
        <PlayerOneErrorBoundary>
          <PlayerOneHUD />
        </PlayerOneErrorBoundary>
      </HideOnCleanRoutes>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public routes - no password protection */}
          <Route path="/waitlist/*" element={<PublicRoutes />} />
          <Route path="/whitelist/*" element={<PublicRoutes />} />
          <Route path="/waitinglist/*" element={
            <ErrorBoundary fallback={<RouteErrorFallback error={new Error('WaitingList page error')} />}>
              <WaitingListPage />
            </ErrorBoundary>
          } />
          
          {/* Protected routes - require password */}
          <Route path="/*" element={<ProtectedRoutes />} />
        </Routes>
      </Suspense>
      <HideOnCleanRoutes>
        <StickyCTA />
        <ErrorBoundary fallback={null}>
          <EasterEggHints />
        </ErrorBoundary>
      </HideOnCleanRoutes>
    </BrowserRouter>
  );
};

export default App;
