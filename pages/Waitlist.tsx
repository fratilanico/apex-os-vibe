import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {  
  Zap, Users, Globe, ArrowRight, Trophy, Share2, 
  Activity, Clock, Target, Brain, Code, Sparkles
} from 'lucide-react';
import { TerminalBranding, TerminalBrandingMobile } from '../components/TerminalBranding';
import { SocialHub } from '../components/SocialHub';
import { TerminalHero } from '../components/TerminalHero';

// ═══════════════════════════════════════════════════════════════════════════════
// APEX OS WAITLIST - SPECTACULAR EDITION
// Module 00 Terminal Experience + Old vs New
// ═══════════════════════════════════════════════════════════════════════════════

// Countdown target (webinar) ~18 days by default
const TARGET_DAYS = 18;
const targetDate = new Date(Date.now() + TARGET_DAYS * 24 * 60 * 60 * 1000);

// Old vs New Comparison Component
const OldVsNewComparison = () => {
  const [activeTab, setActiveTab] = useState<'new' | 'old'>('new');

  const newFeatures = [
    { icon: Brain, title: '17-Agent AI Swarm', desc: 'Autonomous agents handle architecture, code, design, and deployment' },
    { icon: RocketIcon, title: '30-Day Sprint', desc: 'Ship production-ready products in 30 days, not 6-12 months' },
    { icon: Target, title: 'GTM on Day 1', desc: 'Go-to-market strategy integrated from the start' },
    { icon: Code, title: 'Keep Your Equity', desc: 'No VC dilution. You own 100% of what you build' },
  ];

  const oldProblems = [
    { icon: Clock, title: '6-12 Month Cycles', desc: 'Traditional development takes forever to ship' },
    { icon: Activity, title: '$500K+ Burn Rate', desc: 'High costs before you even validate the idea' },
    { icon: Users, title: 'Slow Feedback Loops', desc: 'Market shifts before you can iterate' },
    { icon: Zap, title: 'Equity Dilution', desc: 'Give away 20-40% just to get started' },
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
      {/* Tab Switcher */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setActiveTab('new')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-mono uppercase tracking-widest border transition-all ${
            activeTab === 'new' 
              ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-black border-transparent font-bold' 
              : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            APEX Protocol (NEW)
          </span>
        </button>
        <button
          onClick={() => setActiveTab('old')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-mono uppercase tracking-widest border transition-all ${
            activeTab === 'old' 
              ? 'bg-white text-black border-white font-bold' 
              : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <Clock className="w-4 h-4" />
            Legacy Way (OLD)
          </span>
        </button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'new' ? (
          <motion.div
            key="new"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {newFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 border border-cyan-500/30 hover:border-cyan-500/50 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-cyan-500/20 group-hover:bg-cyan-500/30 transition-colors">
                    <feature.icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">{feature.title}</h3>
                    <p className="text-xs text-white/60 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="old"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {oldProblems.map((problem, index) => (
              <motion.div
                key={problem.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-5 rounded-2xl bg-white/5 border border-white/10 opacity-60"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-white/10">
                    <problem.icon className="w-6 h-6 text-white/40" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white/60 mb-1">{problem.title}</h3>
                    <p className="text-xs text-white/40 leading-relaxed">{problem.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main Waitlist Page Component
export default function WaitlistPage() {
  const [submitted, setSubmitted] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(() => targetDate.getTime() - Date.now());
  const [count] = useState(2847);
  const [spotsLeft] = useState(153);

  // Webinar countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(targetDate.getTime() - Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (ms: number) => {
    if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { days, hours, minutes, seconds };
  };

  const countdown = formatCountdown(timeLeft);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* Terminal Branding */}
      <TerminalBranding />
      <TerminalBrandingMobile />

      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 via-transparent to-emerald-950/20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-20 pb-12 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Applications Open • Cohort 001</span>
              </div>

              {/* Title */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight">
                <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Build at AI Speed
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed mb-8">
                Join <span className="text-cyan-400 font-bold">1,000 founders</span> shipping products in 30 days.
                <br />
                <span className="text-emerald-400">Zero equity. Maximum velocity.</span>
              </p>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16"
            >
              {[
                { icon: Users, value: count.toLocaleString(), label: 'Builders Applied', color: 'cyan' },
                { icon: Zap, value: spotsLeft.toString(), label: 'Spots Left', color: 'emerald' },
                { icon: Globe, value: '30', label: 'Days to Launch', color: 'amber' },
                { icon: Brain, value: '17', label: 'AI Agents', color: 'violet' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:border-cyan-500/30 transition-all">
                  <stat.icon className={`w-8 h-8 mx-auto mb-3 text-${stat.color}-400`} />
                  <div className={`text-4xl font-black text-${stat.color}-400 mb-1`}>{stat.value}</div>
                  <div className="text-xs text-white/50 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Social Hub */}
            <SocialHub />

            {/* Webinar Countdown */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-3xl mx-auto mb-10 bg-black/40 border border-cyan-500/20 rounded-3xl p-6 backdrop-blur-xl"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="text-xs font-mono text-cyan-400 uppercase tracking-[0.3em]">Live Webinar</div>
                  <div className="text-lg text-white/80">Reserve your spot in the next 2–3 weeks</div>
                </div>
                <div className="grid grid-cols-4 gap-3 text-center">
                  {[
                    { label: 'Days', value: countdown.days },
                    { label: 'Hours', value: countdown.hours },
                    { label: 'Minutes', value: countdown.minutes },
                    { label: 'Seconds', value: countdown.seconds },
                  ].map(item => (
                    <div key={item.label} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                      <div className="text-2xl font-black text-cyan-400 font-mono">{String(item.value).padStart(2, '0')}</div>
                      <div className="text-[10px] text-white/50 uppercase tracking-widest">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Terminal Hero Section - CENTERPIECE */}
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            {!submitted ? (
              <TerminalHero onSuccess={(data) => {
                setAiResult(data);
                setSubmitted(true);
              }} />
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 backdrop-blur-2xl border border-emerald-500/30 rounded-3xl p-12 text-center max-w-2xl mx-auto"
              >
                <Trophy className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
                <h2 className="text-3xl font-black mb-2 uppercase">You're In!</h2>
                <p className="text-white/60 mb-8">Identity verified. Welcome to the swarm.</p>

                {aiResult && (
                  <div className="mb-8 p-8 bg-black/40 rounded-2xl border border-emerald-500/20">
                    <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-2">AI Readiness Score</div>
                    <div className="text-6xl font-black text-emerald-400 mb-4">{aiResult.ai_score}</div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden mb-4">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${aiResult.ai_score}%` }}
                        className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-left bg-black/20 p-4 rounded-xl">
                        <p className="text-xs text-white/40 uppercase">Position</p>
                        <p className="text-xl font-bold text-cyan-400">#{aiResult.rank}</p>
                      </div>
                      <div className="text-left bg-black/20 p-4 rounded-xl">
                        <p className="text-xs text-white/40 uppercase">Referral ID</p>
                        <p className="text-xl font-bold text-emerald-400 font-mono">{aiResult.referral_code}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-cyan-400 font-mono text-sm uppercase hover:underline"
                >
                  Return to Terminal
                </button>
              </motion.div>
            )}
          </div>
        </section>

        {/* Old vs New Comparison */}
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <OldVsNewComparison />
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 text-center">
          <div className="text-white/30 text-sm font-mono uppercase tracking-widest">
            © 2026 APEX OS • Built with AI • Owned by Builders
          </div>
        </footer>
      </div>
    </div>
  );
}

// Icon fallbacks
const RocketIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-5c1.62-2.2 5-3 5-3"/><path d="M12 15v5s3.03-.55 5-2c2.2-1.62 3-5 3-5"/>
  </svg>
);

const Trophy = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
  </svg>
);
