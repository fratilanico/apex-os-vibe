import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// APEX OS LANDING PAGE - Full integration of all sections
// ═══════════════════════════════════════════════════════════════════════════════

// Sections
import { HeroSection } from '../components/sections/HeroSection';
import { TrustBar } from '../components/sections/TrustBar';
import { CurriculumGrid } from '../components/sections/CurriculumGrid';
import { ToolsShowcase } from '../components/sections/ToolsShowcase';
import { CaseStudy } from '../components/sections/CaseStudy';
import { FAQSection } from '../components/sections/FAQSection';
import { CTASection } from '../components/sections/CTASection';

// Components
import { WaitlistV2 } from '../components/WaitlistV2';
import { TerminalHero } from '../components/TerminalHero';
import { CountdownTimer } from '../components/CountdownTimer';
import { CustomerJourney } from '../components/CustomerJourney';
import { NewsletterHub } from '../components/NewsletterHub';

// Section IDs for navigation
const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'trust', label: 'Trust' },
  { id: 'curriculum', label: 'Curriculum' },
  { id: 'terminal', label: 'Terminal' },
  { id: 'tools', label: 'Tools' },
  { id: 'case-study', label: 'Case Study' },
  { id: 'faq', label: 'FAQ' },
  { id: 'cta', label: 'Join' },
];

// Progress calculation for each section
const getProgressForSection = (sectionId: string): number => {
  const index = sections.findIndex(s => s.id === sectionId);
  return index / (sections.length - 1);
};

export const IndexPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Smooth scroll handler
  const scrollToSection = (id: string) => {
    setIsScrolling(true);
    const element = sectionRefs.current[id];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
      
      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Reset scrolling flag after animation
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    }
  };

  // Intersection observer for active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrolling) return; // Don't update while manually scrolling
        
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: '-10% 0px -10% 0px' }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observer.disconnect();
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isScrolling]);

  // Ref callback helper
  const setRef = (id: string) => (el: HTMLElement | null): void => {
    if (el) {
      sectionRefs.current[id] = el;
    }
  };

  // Handle join click
  const handleJoinClick = () => {
    setShowWaitlist(true);
    scrollToSection('terminal');
  };

  // Handle CTA from other sections
  const handleCTAClick = () => {
    scrollToSection('cta');
  };

  const progress = getProgressForSection(activeSection);

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* Smooth Scroll Behavior */}
      <style>{`
        html {
          scroll-behavior: smooth;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #0a0a0a;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.3);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.5);
        }
      `}</style>

      {/* Navigation Dots */}
      <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-3">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`group relative w-3 h-3 rounded-full transition-all duration-300 ${
              activeSection === section.id
                ? 'bg-cyan-400 scale-125 shadow-[0_0_10px_rgba(6,182,212,0.8)]'
                : 'bg-white/20 hover:bg-white/40'
            }`}
            title={section.label}
          >
            {/* Tooltip */}
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 rounded bg-black/80 border border-white/10 text-xs text-white/70 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {section.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-white/5">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progress }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{ transformOrigin: 'left' }}
        />
      </div>

      {/* Main Content */}
      <main className="relative">
        {/* Hero Section */}
        <section
          id="hero"
          ref={setRef('hero')}
          className="min-h-screen"
        >
          <HeroSection onStartJourney={() => scrollToSection('terminal')} />
        </section>

        {/* Trust Bar */}
        <section
          id="trust"
          ref={setRef('trust')}
          className="relative"
        >
          <TrustBar />
        </section>

        {/* Curriculum Grid */}
        <section
          id="curriculum"
          ref={setRef('curriculum')}
          className="relative"
        >
          <CurriculumGrid />
        </section>

        {/* Terminal Section */}
        <section
          id="terminal"
          ref={setRef('terminal')}
          className="min-h-screen relative py-12"
        >
          {/* Countdown Timer */}
          <div className="mb-8">
            <CountdownTimer 
              targetDate={new Date('2026-03-01T00:00:00')} 
              label="Next Cohort Launch"
            />
          </div>

          {/* Customer Journey Visualization */}
          <CustomerJourney />

          <AnimatePresence mode="wait">
            {showWaitlist ? (
              <motion.div
                key="waitlist"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <WaitlistV2 />
              </motion.div>
            ) : (
              <motion.div
                key="terminal-hero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TerminalHero 
                  onContactRequest={() => setShowWaitlist(true)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Newsletter Hub */}
          <NewsletterHub />
        </section>

        {/* Tools Showcase */}
        <section
          id="tools"
          ref={setRef('tools')}
          className="relative"
        >
          <ToolsShowcase />
        </section>

        {/* Case Study */}
        <section
          id="case-study"
          ref={setRef('case-study')}
          className="relative py-24 px-4"
        >
          <div className="max-w-7xl mx-auto">
            <CaseStudy />
          </div>
        </section>

        {/* FAQ Section */}
        <section
          id="faq"
          ref={setRef('faq')}
          className="relative py-24 px-4"
        >
          <div className="max-w-4xl mx-auto">
            <FAQSection />
          </div>
        </section>

        {/* CTA Section */}
        <section
          id="cta"
          ref={setRef('cta')}
          className="relative"
        >
          <CTASection onJoinClick={handleJoinClick} />
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <span className="font-bold text-black">A</span>
              </div>
              <span className="font-bold text-white">APEX OS</span>
            </div>
            
            {/* Copyright */}
            <div className="text-sm text-white/40">
              © 2026 APEX OS. All rights reserved.
            </div>
            
            {/* Links */}
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-white/60 hover:text-cyan-400 transition-colors">Privacy</a>
              <a href="#" className="text-sm text-white/60 hover:text-cyan-400 transition-colors">Terms</a>
              <a href="#" className="text-sm text-white/60 hover:text-cyan-400 transition-colors">Contact</a>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/30">
            <div className="flex items-center gap-4">
              <span>Built with</span>
              <span className="text-cyan-400">React</span>
              <span>+</span>
              <span className="text-cyan-400">TypeScript</span>
              <span>+</span>
              <span className="text-cyan-400">Tailwind</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default IndexPage;
