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
        className="fixed top-8 left-1/2 z-40 px-4 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-2xl flex items-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] min-w-[85vw] md:min-w-[700px] h-11"
      >
        {/* Left: Logo + Divider */}
        <div className="flex items-center h-full pl-2">
          <Link to="/" className="flex items-center group pr-4 border-r border-white/10 h-6">
            <ChromaticLogo type="apex-cyan" size="sm" className="scale-[0.28] md:scale-[0.32] origin-left" />
          </Link>
        </div>
        
        {/* Center: Navigation - True mathematical center */}
        <div className="flex-1 flex justify-center items-center gap-4 md:gap-8 overflow-hidden h-full">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path}
              className={`text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] transition-all hover:tracking-[0.25em] whitespace-nowrap ${
                isActive(item.path) ? 'text-white' : 'text-white/40 hover:text-white'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right: Mobile Trigger (Mobile only) */}
        <div className="md:hidden pr-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white/60 hover:text-white transition-colors"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </motion.nav>

      {/* Desktop Enroll button - Floating Outside */}
      <div className="fixed top-8 right-8 z-50 hidden sm:block">
        <Link to="/pricing" className="relative group">
          <motion.div
            className="absolute -inset-2 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 opacity-0 group-hover:opacity-50 blur-xl transition-all duration-500"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative px-5 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-[9px] font-black uppercase tracking-[0.15em] shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all border border-white/10"
          >
            ENROLL NOW
          </motion.button>
        </Link>
      </div>

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
