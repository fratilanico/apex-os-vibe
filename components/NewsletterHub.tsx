import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Shield, Zap, Cpu, Terminal, ArrowRight, ExternalLink } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  url: string;
  published_at: string;
  ai_score: number;
  raw_data: {
    sovereign_analysis?: {
      summary: string;
      arbitrage: string;
      moat_score: number;
    }
  };
}

export const NewsletterHub: React.FC = () => {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(30);

    if (error) console.error(error);
    else setItems(data || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-cyan-500/30">
      {/* Neural Grid Background */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0" style={{ 
          backgroundImage: `linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header - Golden Standard */}
        <div className="flex flex-col items-center mb-16">
          <img 
            src="/assets/apex-ascii-logo-ultra.png" 
            alt="APEX OS Logo" 
            className="w-96 mb-6"
          />
          <h1 className="text-2xl font-mono font-bold tracking-[0.3em] text-cyan-400 uppercase">
            Technical Intelligence Hub
          </h1>
          <div className="mt-4 flex items-center gap-4 text-xs font-mono text-white/40 uppercase tracking-widest">
            <span>Live Updates</span>
            <span>•</span>
            <span className="text-emerald-400">System Active</span>
            <span>•</span>
            <span>Orchestration Mode</span>
          </div>
        </div>

        {/* Why Box - Narrative Infill */}
        <div className="max-w-4xl mx-auto mb-16 p-8 rounded-xl border-2 border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Cpu size={120} />
          </div>
          <h2 className="text-xl font-mono font-extrabold mb-4 text-white uppercase tracking-wider">
            The Sovereign Mandate: Information as Arbitrage
          </h2>
          <p className="text-white/70 leading-relaxed text-sm">
            In the age of AI orchestration, speed is the only moat. We don't read news; we extract arbitrage. 
            The hub uses recursive agent swarms to filter 32,000 sources, identifying the technical inflections 
            before the market reacts. <strong>Move at machine speed or become legacy.</strong>
          </p>
        </div>

        {/* Intelligence Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin text-cyan-400"><Cpu size={48} /></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group p-6 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/50 transition-all relative overflow-hidden flex flex-col"
              >
                {/* Score Badge */}
                <div className="absolute top-4 right-4 font-mono text-[10px] text-emerald-400 border border-emerald-400/30 px-2 py-1 rounded bg-emerald-400/5">
                  AI SCORE: {item.ai_score || '??'}
                </div>

                <h3 className="text-lg font-bold mb-4 line-clamp-2 group-hover:text-cyan-400 transition-colors pr-12">
                  {item.title}
                </h3>

                {item.raw_data.sovereign_analysis ? (
                  <div className="flex-grow">
                    <div className="mb-4 text-xs text-white/60 line-clamp-3 italic border-l-2 border-cyan-500/30 pl-3">
                      "{item.raw_data.sovereign_analysis.summary}"
                    </div>
                    <div className="mb-6 p-3 rounded bg-cyan-500/5 border border-cyan-500/10 text-[11px] text-cyan-100/80 font-mono">
                      <div className="text-cyan-400 font-bold mb-1 tracking-tighter uppercase">Arbitrage:</div>
                      {item.raw_data.sovereign_analysis.arbitrage}
                    </div>
                  </div>
                ) : (
                  <div className="flex-grow flex items-center justify-center text-white/20 h-32 italic text-xs">
                    Pending agentic analysis...
                  </div>
                )}

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                  <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                    {new Date(item.published_at).toLocaleDateString()}
                  </span>
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-white transition-colors group/link"
                  >
                    <span>SOURCE</span>
                    <ExternalLink size={12} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Footer - Golden Standard */}
        <div className="mt-20 pt-10 border-t border-cyan-500/20 text-center">
          <div className="font-mono text-[10px] text-emerald-400 mb-4 tracking-[0.5em] uppercase">
            [██████████] System Status: Optimized
          </div>
          <p className="text-white/40 text-[10px] uppercase tracking-widest">
            © 2026 APEX OS • Sovereign Intelligence Division
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsletterHub;
