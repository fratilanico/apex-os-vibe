import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { ChromaticLogo } from './ui/ChromaticLogo';

// Premium navbar inspired by OpenAI/Apple/Claude
// Clean, minimal, professional

interface NavbarProps {
  onOpenCurriculum?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const navItems = [
    { name: 'START', path: '/' },
    { name: 'VIBE', path: '/vibe' },
    { name: 'APPROACH', path: '/approach' },
    { name: 'ACADEMY', path: '/academy' },
    { name: 'CONTACT', path: '/contact' }
  ];

  const isActive = (path: string) => location.pathname === path;

  // Track scroll for backdrop effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
        }`}
      >
        <div className="relative max-w-7xl mx-auto h-16">
          {/* Logo - Absolute Left */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Link to="/" className="flex items-center group">
              <ChromaticLogo type="apex" size="sm" className="scale-[0.4] origin-left" />
            </Link>
          </div>
          
          {/* Desktop Navigation - True Center */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-xs font-mono font-bold tracking-widest uppercase transition-colors ${
                  isActive(item.path)
                    ? 'text-white'
                    : 'text-white/60 hover:text-cyan-400'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA - Absolute Right */}
          <div className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2">
            <Link
              to="/pricing"
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-sm font-bold tracking-wider hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
            >
              ENROLL NOW
            </Link>
          </div>

          {/* Mobile Menu Button - Absolute Right */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-16 left-0 right-0 z-50 md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10 shadow-2xl"
            >
              <div className="max-w-7xl mx-auto px-4 py-6 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'text-white bg-white/10'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <Link
                  to="/pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block mt-4 px-4 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-sm font-bold text-center"
                >
                  ENROLL NOW
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
