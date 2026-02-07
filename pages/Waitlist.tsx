import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {  
  Zap, Users, Globe, ArrowRight, Trophy, 
  Activity, Clock, Target, Brain, Code, Sparkles, Terminal as TerminalIcon
} from 'lucide-react';
import { TerminalBranding, TerminalBrandingMobile } from '../components/TerminalBranding';
import { SocialHub } from '../components/SocialHub';
import { TerminalHero } from '../components/TerminalHero';

// ═══════════════════════════════════════════════════════════════════════════════
// APEX OS WAITLIST - SPECTACULAR EDITION
// Support for Personal, Business, and Geek Mode journeys
// ═══════════════════════════════════════════════════════════════════════════════

const TARGET_DAYS = 18;
const targetDate = new Date(Date.now() + TARGET_DAYS * 24 * 60 * 60 * 1000);

type JourneyMode = 'standard' | 'geek';
type UserType = 'personal' | 'business';

const OldVsNewComparison = () => {
  const [activeTab, setActiveTab] = useState<'new' | 'old'>('new');

  const newFeatures = [
    { icon: Brain, title: '17-Agent AI Swarm', desc: 'Autonomous agents handle architecture, code, design, and deployment' },
    { icon: Sparkles, title: '30-Day Sprint', desc: 'Ship production-ready products in 30 days, not 6-12 months' },
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

export default function WaitlistPage() {
  const [mode, setMode] = useState<JourneyMode>('standard');
  const [userType, setUserType] = useState<UserType>('personal');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    name: '', email: '', linkedin: '', phone: '', goal: '', company: '', role: '', details: '', consent: false
  });

  const [timeLeft, setTimeLeft] = useState(() => targetDate.getTime() - Date.now());
  const [count] = useState(2847);
  const [spotsLeft] = useState(153);

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

  const updateForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/waitlist/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userType, platform: 'web_form' }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Submission failed');

      setAiResult(result);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <TerminalBranding />
      <TerminalBrandingMobile />

      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 via-transparent to-emerald-950/20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <section className="pt-20 pb-12 px-6 text-center">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Cohort 001 Applications Open</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tight">
                <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">Build at AI Speed</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed mb-8">
                Join <span className="text-cyan-400 font-bold">1,000 founders</span> shipping in 30 days.
                <br /><span className="text-emerald-400">Zero equity. Maximum velocity.</span>
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16">
              {[
                { icon: Users, value: count.toLocaleString(), label: 'Applied', color: 'cyan' },
                { icon: Zap, value: spotsLeft.toString(), label: 'Spots', color: 'emerald' },
                { icon: Globe, value: '30', label: 'Days', color: 'amber' },
                { icon: Brain, value: '17', label: 'Agents', color: 'violet' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
                  <stat.icon className={`w-8 h-8 mx-auto mb-3 text-${stat.color}-400`} />
                  <div className={`text-4xl font-black text-${stat.color}-400 mb-1`}>{stat.value}</div>
                  <div className="text-xs text-white/50 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>

            <SocialHub />

            <div className="max-w-3xl mx-auto mb-10 bg-black/40 border border-cyan-500/20 rounded-3xl p-6 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-[0.3em]">Live Webinar</div>
                <div className="text-lg text-white/80">Launch Event in:</div>
              </div>
              <div className="grid grid-cols-4 gap-3 text-center">
                {[{ label: 'D', v: countdown.days }, { label: 'H', v: countdown.hours }, { label: 'M', v: countdown.minutes }, { label: 'S', v: countdown.seconds }].map(i => (
                  <div key={i.label} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                    <div className="text-xl font-black text-cyan-400 font-mono">{String(i.v).padStart(2, '0')}</div>
                    <div className="text-[10px] text-white/50 uppercase">{i.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 px-6" id="join">
          <div className="max-w-4xl mx-auto">
            {!submitted ? (
              <div className="space-y-12">
                {/* Journey Selector */}
                <div className="flex flex-wrap justify-center gap-4">
                  <button onClick={() => setMode('standard')} className={`px-8 py-4 rounded-2xl font-bold transition-all border-2 ${mode === 'standard' ? 'bg-white text-black border-white' : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'}`}>
                    Standard Mode
                  </button>
                  <button onClick={() => setMode('geek')} className={`px-8 py-4 rounded-2xl font-bold transition-all border-2 flex items-center gap-2 ${mode === 'geek' ? 'bg-cyan-500 text-black border-cyan-400' : 'bg-cyan-500/5 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/10'}`}>
                    <TerminalIcon className="w-5 h-5" /> Geek Mode
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {mode === 'standard' ? (
                    <motion.div key="std" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 max-w-2xl mx-auto shadow-2xl">
                      <div className="mb-8 flex justify-center gap-4">
                        <button onClick={() => setUserType('personal')} className={`flex-1 py-3 rounded-xl text-xs font-mono uppercase tracking-widest transition-all ${userType === 'personal' ? 'bg-cyan-500 text-black font-bold' : 'bg-white/5 text-white/40'}`}>Personal</button>
                        <button onClick={() => setUserType('business')} className={`flex-1 py-3 rounded-xl text-xs font-mono uppercase tracking-widest transition-all ${userType === 'business' ? 'bg-violet-500 text-white font-bold' : 'bg-white/5 text-white/40'}`}>Business</button>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        {step === 1 && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                            <h2 className="text-2xl font-bold text-center mb-6">Founder Identification</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input type="text" placeholder="Full Name" value={formData.name} onChange={e => updateForm('name', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-cyan-400 outline-none" required />
                              <input type="email" placeholder="Email Address" value={formData.email} onChange={e => updateForm('email', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-cyan-400 outline-none" required />
                            </div>
                            <input type="url" placeholder="LinkedIn Profile" value={formData.linkedin} onChange={e => updateForm('linkedin', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-cyan-400 outline-none" />
                            <button type="button" onClick={() => setStep(2)} disabled={!formData.name || !formData.email} className="w-full py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-black rounded-xl">Next Step</button>
                          </motion.div>
                        )}
                        {step === 2 && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                            <h2 className="text-2xl font-bold text-center mb-6">{userType === 'business' ? 'Company Details' : 'Mission Goal'}</h2>
                            {userType === 'business' && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" placeholder="Company Name" value={formData.company} onChange={e => updateForm('company', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-violet-400 outline-none" />
                                <input type="text" placeholder="Role" value={formData.role} onChange={e => updateForm('role', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-violet-400 outline-none" />
                              </div>
                            )}
                            <select value={formData.goal} onChange={e => updateForm('goal', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-cyan-400 outline-none" required>
                              <option value="">Select Primary Goal</option>
                              <option value="ship">Ship AI Product</option>
                              <option value="accelerator">Accelerator</option>
                              <option value="b2b">B2B Partner</option>
                            </select>
                            <div className="flex gap-4">
                              <button type="button" onClick={() => setStep(1)} className="flex-1 py-4 border border-white/10 rounded-xl">Back</button>
                              <button type="button" onClick={() => setStep(3)} disabled={!formData.goal} className="flex-1 py-4 bg-white text-black font-bold rounded-xl">Almost Done</button>
                            </div>
                          </motion.div>
                        )}
                        {step === 3 && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                            <h2 className="text-2xl font-bold text-center mb-6">Final Verification</h2>
                            <textarea placeholder="Tell us about your mission..." value={formData.details} onChange={e => updateForm('details', e.target.value)} rows={4} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-emerald-400 outline-none resize-none" />
                            <label className="flex items-center gap-3 p-4 bg-black/20 rounded-xl cursor-pointer">
                              <input type="checkbox" checked={formData.consent} onChange={e => updateForm('consent', e.target.checked)} className="w-5 h-5 accent-emerald-400" required />
                              <span className="text-xs text-white/60">I agree to the Terms and Data Processing protocol.</span>
                            </label>
                            {error && <p className="text-red-400 text-xs">{error}</p>}
                            <div className="flex gap-4">
                              <button type="button" onClick={() => setStep(2)} className="flex-1 py-4 border border-white/10 rounded-xl">Back</button>
                              <button type="submit" disabled={loading || !formData.consent} className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-black rounded-xl uppercase tracking-widest">{loading ? 'Processing...' : 'Secure Access'}</button>
                            </div>
                          </motion.div>
                        )}
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div key="geek" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
                      <TerminalHero onSuccess={(data) => { setAiResult(data); setSubmitted(true); }} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/5 backdrop-blur-2xl border border-emerald-500/30 rounded-3xl p-12 text-center max-w-2xl mx-auto shadow-2xl">
                <Trophy className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
                <h2 className="text-4xl font-black mb-4">ACCESS GRANTED</h2>
                <p className="text-white/60 mb-10">Welcome to the swarm. Your identity has been verified.</p>
                {aiResult && (
                  <div className="space-y-6">
                    <div className="bg-black/40 border border-white/5 p-8 rounded-2xl">
                      <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">AI Readiness Score</div>
                      <div className="text-7xl font-black text-emerald-400 mb-4">{aiResult.ai_score}</div>
                      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${aiResult.ai_score}%` }} className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/40 p-4 rounded-xl text-left border border-white/5">
                        <p className="text-[10px] text-white/40 uppercase">Position</p>
                        <p className="text-2xl font-bold text-cyan-400">#{aiResult.rank}</p>
                      </div>
                      <div className="bg-black/40 p-4 rounded-xl text-left border border-white/5">
                        <p className="text-[10px] text-white/40 uppercase">Referral ID</p>
                        <p className="text-xl font-mono font-bold text-emerald-400">{aiResult.referral_code}</p>
                      </div>
                    </div>
                  </div>
                )}
                <button onClick={() => setSubmitted(false)} className="mt-8 text-cyan-400 font-mono text-xs uppercase hover:underline tracking-widest">Register another identity</button>
              </motion.div>
            )}
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Module 00: Access Protocols</h2>
            <OldVsNewComparison />
          </div>
        </section>

        <footer className="py-12 px-6 text-center border-t border-white/5">
          <div className="text-white/30 text-xs font-mono uppercase tracking-widest">© 2026 APEX OS • Built with Neural Orchestration</div>
        </footer>
      </div>
    </div>
  );
}

const Trophy = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
  </svg>
);
