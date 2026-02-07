import React from 'react';
import { motion } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// TRUST BAR - HORIZONTAL SCROLL OF TOOL LOGOS
// Grayscale to color on hover with holographic shimmer
// ═══════════════════════════════════════════════════════════════════════════════

// SVG Logo Components
const VercelLogo: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className }) => (
  <svg viewBox="0 0 76 65" className={className} fill="currentColor">
    <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
  </svg>
);

const SupabaseLogo: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg viewBox="0 0 109 113" className={className} style={style} fill="currentColor">
    <path d="M63.7076 110.284C60.6471 113.885 55.6472 111.532 55.4854 106.88L53.8949 62.6748L99.0546 30.779C102.625 28.3209 107.268 31.4652 106.154 35.6364L95.1741 99.2698C94.4897 102.32 91.7095 104.399 88.5732 104.399H72.8865C69.7502 104.399 66.97 106.478 66.2856 109.529L63.7076 110.284Z" />
    <path d="M45.317 2.07103C48.3995 -1.62336 54.0599 0.448796 54.2169 5.25865L55.6384 49.4887L11.8153 80.2735C8.24503 82.7316 3.60203 79.5873 4.71615 75.4161L15.6961 11.7827C16.3805 8.73231 19.1607 6.6532 22.297 6.6532H37.9837C41.12 6.6532 43.9002 4.57409 44.5846 1.52369L45.317 2.07103Z" />
  </svg>
);

const PolarLogo: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.8a7.2 7.2 0 110 14.4 7.2 7.2 0 010-14.4z" />
    <circle cx="12" cy="12" r="3.6" />
  </svg>
);

const GoogleAILogo: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg viewBox="0 0 24 24" className={className} style={style}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const PerplexityLogo: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6zm4 4h-2v-2h2v2zm0-4h-2V7h2v6z" />
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const OpenAILogo: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.896zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
  </svg>
);

const ClaudeLogo: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
    <path d="M17.304 3.541c-2.803 0-4.489 1.663-5.792 4.629-.612-2.161-2.096-4.629-5.334-4.629-3.368 0-5.896 2.96-5.896 7.135 0 4.79 2.803 7.466 5.896 7.466 3.232 0 4.716-2.468 5.334-4.629 1.303 2.966 2.989 4.629 5.792 4.629 3.093 0 5.896-2.676 5.896-7.466 0-4.175-2.528-7.135-5.896-7.135zm-11.126 11.1c-1.663 0-2.676-1.512-2.676-3.965 0-2.453 1.013-3.965 2.676-3.965 1.92 0 2.676 1.512 3.093 3.093.417 1.581.417 2.676.417 2.676s-.417 2.161-3.51 2.161zm11.126 0c-1.92 0-2.676-1.512-3.093-3.093-.417-1.581-.417-2.676-.417-2.676s.417-2.161 3.51-2.161c1.663 0 2.676 1.512 2.676 3.965 0 2.453-1.013 3.965-2.676 3.965z" />
  </svg>
);

const CursorLogo: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
    <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.45.45 0 0 0 .32-.77L6.18 2.89a.45.45 0 0 0-.68.32z" />
  </svg>
);

interface ToolLogo {
  name: string;
  Logo: React.FC<{ className?: string; style?: React.CSSProperties }>;
  color: string;
}

const tools: ToolLogo[] = [
  { name: 'Vercel', Logo: VercelLogo, color: '#000000' },
  { name: 'Supabase', Logo: SupabaseLogo, color: '#3ECF8E' },
  { name: 'Polar.sh', Logo: PolarLogo, color: '#FF6B6B' },
  { name: 'Google AI', Logo: GoogleAILogo, color: '#4285F4' },
  { name: 'Perplexity', Logo: PerplexityLogo, color: '#20B2AA' },
  { name: 'OpenAI', Logo: OpenAILogo, color: '#10A37F' },
  { name: 'Claude', Logo: ClaudeLogo, color: '#D97757' },
  { name: 'Cursor', Logo: CursorLogo, color: '#00FF94' },
];

const LogoItem: React.FC<{ tool: ToolLogo; index: number }> = ({ tool, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative flex items-center justify-center px-8 py-4"
    >
      {/* Holographic shimmer container */}
      <div className="relative overflow-hidden rounded-lg p-4 transition-all duration-500
                    grayscale hover:grayscale-0 opacity-50 hover:opacity-100">
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full 
                      transition-transform duration-1000 ease-out
                      bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        {/* Logo - Grayscale version */}
        <tool.Logo 
          className="w-8 h-8 transition-all duration-300 
                    group-hover:scale-110 group-hover:drop-shadow-lg"
          style={{ 
            filter: 'grayscale(100%)',
          }}
        />
        
        {/* Colored version on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <tool.Logo 
            className="w-8 h-8 transition-all duration-300 scale-110"
            style={{ 
              color: tool.color,
              filter: `drop-shadow(0 0 10px ${tool.color}50)`,
            }}
          />
        </div>
      </div>

      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileHover={{ opacity: 1, y: 0 }}
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 
                   px-2 py-1 bg-gray-800 text-white text-xs font-mono rounded
                   opacity-0 group-hover:opacity-100 transition-opacity duration-300
                   whitespace-nowrap pointer-events-none"
      >
        {tool.name}
      </motion.div>
    </motion.div>
  );
};

export const TrustBar: React.FC = () => {
  return (
    <section className="relative py-16 bg-[#0a0a0a] border-t border-b border-gray-800/50 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-gray-400 font-mono text-sm tracking-widest uppercase">
            The same tools powering modern AI products
          </p>
        </motion.div>

        {/* Logo Scroll Container */}
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10" />

          {/* Scrolling container */}
          <motion.div
            animate={{ x: [0, -1920] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            }}
            className="flex items-center"
          >
            {/* First set */}
            {tools.map((tool, i) => (
              <LogoItem key={`first-${i}`} tool={tool} index={i} />
            ))}
            
            {/* Duplicate for seamless loop */}
            {tools.map((tool, i) => (
              <LogoItem key={`second-${i}`} tool={tool} index={i} />
            ))}
            
            {/* Third set for extra coverage */}
            {tools.map((tool, i) => (
              <LogoItem key={`third-${i}`} tool={tool} index={i} />
            ))}
          </motion.div>
        </div>

        {/* Bottom accent line */}
        <div className="mt-12 flex justify-center">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="w-32 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"
          />
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
