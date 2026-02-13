import React from 'react';
import { GitBranch, Terminal, Box, ArrowRight, Zap, Layers, Award } from 'lucide-react';
import { modules } from '../data/curriculumData';

interface CurriculumProps {
  onOpenCurriculum: () => void;
}

const ICON_MAP: Record<string, any> = {
  Zap,
  Box,
  Terminal,
  GitBranch,
  Layers,
  Award
};

export const Curriculum = React.memo<CurriculumProps>(function Curriculum({ onOpenCurriculum }) {
  return (
    <section 
      onClick={onOpenCurriculum}
      className="py-24 px-4 max-w-4xl mx-auto relative cursor-pointer group transition-opacity hover:opacity-90"
    >
      {/* Connecting Line */}
      <div className="absolute left-8 top-32 bottom-32 w-px bg-gradient-to-b from-cyan-500/0 via-cyan-500/20 to-cyan-500/0 hidden md:block" />

      <div className="space-y-16">
        <div className="text-center md:text-left md:pl-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">The Learning Path</h2>
          <p className="text-white/50">From zero to autonomous engineer in six phases.</p>
        </div>

        <div className="space-y-12">
          {modules.map((mod, idx) => {
            const Icon = ICON_MAP[mod.icon] || Box;
            return (
              <div 
                key={mod.id}
                className="relative flex gap-8 items-start group"
              >
                {/* Timeline Node */}
                <div className="hidden md:flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-black border border-cyan-500/50 group-hover:bg-cyan-500 group-hover:shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-300 z-10" />
                </div>

                <div className="glass-card p-8 rounded-xl flex-1 hover:border-cyan-500/30 transition-colors">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 rounded-lg bg-white/5 text-cyan-400">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest">Module {mod.number}</span>
                      <h3 className="text-xl font-bold text-white">{mod.title}</h3>
                    </div>
                  </div>
                  <p className="text-white/60 leading-relaxed pl-14">
                    {mod.subtitle}
                  </p>
                  <div className="mt-4 pl-14 flex items-center gap-4">
                    <span className="text-[10px] font-mono text-white/30 uppercase">{mod.duration}</span>
                    <div className="w-1 h-1 rounded-full bg-white/10" />
                    <span className="text-[10px] font-mono text-cyan-500/50 uppercase">{mod.objective}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 md:pl-20">
          <button className="text-cyan-400 text-sm font-mono hover:text-cyan-300 transition-colors flex items-center gap-2 mx-auto">
            Click anywhere to explore full curriculum
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
});
