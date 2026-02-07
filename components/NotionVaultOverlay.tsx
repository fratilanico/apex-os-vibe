import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ShieldAlert, Lock } from 'lucide-react';

interface NotionVaultOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  vaultUrl: string;
}

export const NotionVaultOverlay: React.FC<NotionVaultOverlayProps> = ({ isOpen, onClose, vaultUrl }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-black/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative w-full max-w-6xl h-full bg-[#050505] rounded-3xl border-2 border-cyan-500/30 shadow-[0_0_100px_rgba(6,182,212,0.2)] overflow-hidden flex flex-col"
          >
            {/* HUD Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-cyan-500/20">
                  <ShieldAlert className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tighter uppercase">Private Resource Vault</h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-[0.3em]">Access Level: Sovereign Founder</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <a 
                  href={vaultUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] uppercase font-bold hover:bg-white/10 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" /> Open in Browser
                </a>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10 text-white/50 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Embedded Content */}
            <div className="flex-1 relative bg-black">
              <iframe 
                src={vaultUrl}
                className="w-full h-full border-none opacity-90"
                title="APEX OS Private Vault"
                allow="autoplay"
              />
              
              {/* Scanline Effect Overlay */}
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%] z-10" />
            </div>

            {/* Footer Status */}
            <div className="px-8 py-4 bg-white/5 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/30 uppercase tracking-[0.5em]">
              <div className="flex items-center gap-2">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>Encrypted Connection Active</span>
              </div>
              <div>Source: The Greuceanu Protocol</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
