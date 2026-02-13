import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { ChromaticLogo } from './ui/ChromaticLogo';

interface NavbarProps {
  onOpenCurriculum?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navItems = [
    { name: 'START', path: '/' },
    { name: 'VIBE', path: '/vibe' },
    { name: 'APPROACH', path: '/approach' },
    { name: 'ACADEMY', path: '/academy' },
    { name: 'CONTACT', path: '/contact' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <motion.nav
        aria-label="Primary"
        initial={{ y: -100, x: '-50%' }}
        animate={{ y: 0, x: '-50%' }}
        className="fixed top-8 left-1/2 z-40 px-3 sm:px-6 py-3 rounded-full bg-black/40 border border-white/10 backdrop-blur-2xl flex items-center gap-4 sm:gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      >
        <Link to="/" className="flex items-center gap-2 pr-3 sm:pr-4 border-r border-white/10 group">
          {/* Cyan ASCII Logo for Landing Page */}
          <ChromaticLogo type="apex-cyan" size="sm" className="scale-[0.35] md:scale-[0.4] origin-left" />
        </Link>
        
        {/* Desktop navigation */}
        <div className="hidden sm:flex items-center gap-8">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path}
              className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:tracking-[0.3em] ${
                isActive(item.path) ? 'text-white' : 'text-white/40 hover:text-white'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden p-2 text-white/60 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Desktop Enroll button */}
        <Link to="/pricing" className="relative group hidden sm:block">
          <motion.div
            className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 opacity-75 blur-md group-hover:opacity-100 transition-opacity"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(6, 182, 212, 0.6), 0 0 80px rgba(139, 92, 246, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            className="relative px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
          >
            ENROLL NOW
          </motion.button>
        </Link>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 sm:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-24 left-4 right-4 z-40 sm:hidden bg-black/95 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-2xl"
            >
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-base font-bold uppercase tracking-wider py-3 px-4 rounded-xl transition-all min-h-[48px] flex items-center ${
                      isActive(item.path) 
                        ? 'text-cyan-400 bg-cyan-500/10' 
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <Link
                  to="/pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-4 px-6 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-sm font-bold uppercase tracking-wider text-center min-h-[48px] flex items-center justify-center shadow-lg shadow-cyan-500/30"
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

export default Navbar;
