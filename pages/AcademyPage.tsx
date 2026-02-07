import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  Box, 
  FileCode, 
  GitBranch, 
  Layers, 
  Award,
  ArrowRight,
  CheckCircle2,
  Wrench,
  GraduationCap,
  Terminal,
} from 'lucide-react';
import { BentoCard, StatsBar, ViewToggle } from '../components/AcademyPage';
import { ToolArsenal } from '../components/artifacts/ToolArsenal/ToolArsenal';
import { CurriculumLog } from '../components/artifacts/CurriculumLog/CurriculumLog';
import { AuthenticatedTerminal } from '../components/artifacts/AuthenticatedTerminal';
import { curriculumData } from '../data/curriculumData';
const { modules } = curriculumData;
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useAuthStore } from '../stores';
import { useAcademyStore } from '../stores';
import { CLITypingButton } from '../components/CLITypingButton';

export const AcademyPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuthStore();
  const { displayMode, setView } = useAcademyStore();
  const [showAuthTerminal, setShowAuthTerminal] = useState(false);

  const iconMap = {
    Zap,
    Box,
    FileCode,
    GitBranch,
    Layers,
    Award,
  };

  const modulesWithIcons = modules.map(module => ({
    ...module,
    iconComponent: iconMap[module.icon as keyof typeof iconMap] || Box,
  }));

  const handleModuleClick = (moduleId: string) => {
    navigate(`/#${moduleId}`);
  };

  return (
    <main className="relative z-10 px-3 sm:px-4 lg:px-6 max-w-5xl mx-auto pb-16 overflow-x-hidden">
      {/* Enhanced Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto pt-6 sm:pt-8 pb-8 sm:pb-12">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute top-10 right-1/4 w-64 h-64 bg-violet-500/20 rounded-full blur-[100px] animate-pulse delay-1000" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6"
        >
          <span className="text-xs sm:text-sm font-medium text-cyan-400">
            Join 500+ founders building the future of AI
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter mb-6"
        >
          <span className="text-white">Master AI</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06b6d4] via-[#8b5cf6] to-[#10b981]">
            Orchestration
          </span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg sm:text-xl text-white/60 mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          From autocomplete mindset to orchestrator mastery.
          Ship production features in days, not months.
        </motion.p>
      </section>

      <StatsBar />

      {/* Curriculum Control Center */}
      <section className="pb-16" data-curriculum-section>
        <div className="flex flex-col items-center mb-12">
          <ViewToggle activeView={displayMode} onViewChange={setView} />
        </div>

        <div className="relative min-h-[600px]">
          {/* Grid View */}
          <div className={displayMode !== 'grid' ? 'hidden' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'}>
            {modulesWithIcons.map((module) => (
              <BentoCard
                key={module.id}
                number={module.number}
                title={module.title}
                subtitle={module.subtitle}
                duration={module.duration}
                objective={module.objective}
                icon={module.iconComponent}
                sectionCount={module.sections.length}
                onClick={() => handleModuleClick(module.id)}
              />
            ))}
          </div>

          {/* Terminal View */}
          {displayMode === 'terminal' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full"
            >
              {isAuthenticated ? (
                <ErrorBoundary>
                  <CurriculumLog />
                </ErrorBoundary>
              ) : (
                <div className="text-center py-20 border-2 border-white/5 rounded-3xl bg-white/[0.02] backdrop-blur-xl">
                  <Terminal className="w-16 h-16 mx-auto mb-6 text-cyan-400/20" />
                  <h3 className="text-xl font-bold text-white mb-4">Sovereign Access Required</h3>
                  <p className="text-white/40 mb-8 max-w-sm mx-auto text-sm">You must authenticate via the terminal to access the interactive curriculum.</p>
                  <button
                    onClick={() => setShowAuthTerminal(true)}
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-[#06b6d4] text-black font-black uppercase tracking-widest hover:scale-105 transition-all"
                  >
                    <Terminal className="w-5 h-5" />
                    <span>Initialize Protocol</span>
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Auth Terminal Modal */}
      {showAuthTerminal && !isAuthenticated && (
        <ErrorBoundary>
          <AuthenticatedTerminal
            onAuthenticated={(user) => {
              setShowAuthTerminal(false);
              login({
                email: user.email,
                name: user.name || 'Founder',
                authMethod: 'cli',
              });
              setView('terminal');
            }}
            onClose={() => setShowAuthTerminal(false)}
          />
        </ErrorBoundary>
      )}

      {/* Tools Section */}
      <section className="pb-20 border-t border-white/5 pt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">Your C-Suite of AI Tools</h2>
          <p className="text-white/40 text-sm">Master the 12 tools that power the modern technical founder.</p>
        </div>
        <ErrorBoundary>
          <ToolArsenal />
        </ErrorBoundary>
      </section>

      {/* CTA Section */}
      <section className="text-center py-20 border-t border-white/5">
        <h2 className="text-3xl sm:text-4xl font-black text-white mb-6 uppercase">Ready to Orchestrate?</h2>
        <p className="text-white/50 mb-10 max-w-2xl mx-auto text-lg">
          Stop hunting for a technical co-founder. Deploy your own swarm today.
        </p>
        {!isAuthenticated && (
          <CLITypingButton
            initialText="Join the Academy"
            finalButtonText="Initialize Terminal"
            onFinalClick={() => setShowAuthTerminal(true)}
            typingSpeed={50}
          />
        )}
      </section>
    </main>
  );
};
