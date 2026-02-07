import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {  
  Zap, Users, Globe, ArrowRight, Trophy, Share2, 
  Activity, Clock, Target, Rocket, Brain, Code, Sparkles
} from 'lucide-react';
import { TerminalBranding, TerminalBrandingMobile } from '../components/TerminalBranding';
import { SocialHub } from '../components/SocialHub';
import { TerminalHero, CommandRecord } from '../components/TerminalHero';

// ═══════════════════════════════════════════════════════════════════════════════
// APEX OS WAITLIST - SPECTACULAR EDITION
// Module 00 Terminal Experience + Old vs New + AI-Scored Form
// ═══════════════════════════════════════════════════════════════════════════════

// Supabase and webhook callers moved to server-side

// Countdown target (webinar) ~18 days by default
const TARGET_DAYS = 18;
const targetDate = new Date(Date.now() + TARGET_DAYS * 24 * 60 * 60 * 1000);

// Terminal typing animation component

// Old vs New Comparison Component
const OldVsNewComparison = () => {
  const [activeTab, setActiveTab] = useState<'new' | 'old'>('new');

  const newFeatures = [
    { icon: Brain, title: '17-Agent AI Swarm', desc: 'Autonomous agents handle architecture, code, design, and deployment' },
    { icon: Rocket, title: '30-Day Sprint', desc: 'Ship production-ready products in 30 days, not 6-12 months' },
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
  // Form State
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiScore, setAiScore] = useState<number | null>(null);
  const [rank, setRank] = useState<number | null>(null);
  const [referralCode, setReferralCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [commandRecords, setCommandRecords] = useState<CommandRecord[]>([]);

  // Stats
  const [count, setCount] = useState(2847);
  const [spotsLeft, setSpotsLeft] = useState(153);
  const [timeLeft, setTimeLeft] = useState(() => targetDate.getTime() - Date.now());

  // Form Data
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', linkedin: '',
    company: '', role: '', industry: '', companySize: '',
    experience: '', teamSize: '', revenueRange: '', fundingStatus: '',
    whyJoin: '', biggestChallenge: '', currentTools: '', timeline: '', referralSource: '',
    goal: '', notes: '', consent: false,
  });

  // Live counter simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => c + Math.floor(Math.random() * 3));
      setSpotsLeft(s => Math.max(0, s - Math.floor(Math.random() * 2)));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

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

  const formSectionRef = useRef<HTMLDivElement>(null);

  const handleTerminalContact = () => {
    setStep(1);
    setTimeout(() => {
      formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const handleCommandRecord = (record: CommandRecord) => {
    setCommandRecords((prev) => [...prev, record].slice(-20));
    void fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'event',
        userId: 'module00_terminal',
        eventType: `terminal:${record.intent}`,
        payload: record,
      }),
    }).catch((err) => console.warn('Terminal analytics log failed', err));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.name || !formData.email || !formData.phone || !formData.goal || !formData.consent) {
      setError('Please complete all required fields (Name, Email, Phone, Goal, Consent).');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/waitlist/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, commands: commandRecords }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Submission failed');
      }

      setAiScore(result.ai_score);
      setReferralCode(result.referral_code);
      setRank(result.rank ?? count + 1);
      setSubmitted(true);
      setCommandRecords([]);
      setCount((c) => c + 1);
      setSpotsLeft((s) => Math.max(0, s - 1));
    } catch (error: any) {
      console.error('Submission error', error);
      setError(error.message || 'Could not submit right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const copyReferral = () => {
    navigator.clipboard.writeText(`https://apex-os.io/waitlist?ref=${referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

            {/* Social Hub - Discord + Telegram + Waitlist */}
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

        {/* Old vs New + Terminal Section */}
        {/* Terminal Hero - Full Screen Centerpiece */}
        <TerminalHero
          onContactRequest={handleTerminalContact}
          onCommandRecord={handleCommandRecord}
        />

        {/* Old vs New Comparison */}
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <OldVsNewComparison />
          </div>
        </section>

        {/* Waitlist Form Section */}
        <section ref={formSectionRef} className="py-16 px-6">
          <div className="max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/5 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl p-8 md:p-10"
                >
                  {error && (
                    <div className="mb-6 text-sm text-amber-200 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3">
                      {error}
                    </div>
                  )}
                  {/* Progress */}
                  <div className="flex justify-center gap-2 mb-8">
                    {[1, 2, 3].map((s) => (
                      <div
                        key={s}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          s === step ? 'w-12 bg-cyan-400' : s < step ? 'w-12 bg-emerald-400' : 'w-12 bg-white/20'
                        }`}
                      />
                    ))}
                  </div>

                  <form onSubmit={handleSubmit}>
                    {/* Step 1: Identity */}
                    {step === 1 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                        <div className="text-center mb-6">
                          <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">Step 01</div>
                          <h2 className="text-2xl font-bold">Who are you?</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-mono text-cyan-400 uppercase mb-2">Full Name</label>
                            <input
                              type="text"
                              value={formData.name}
                              onChange={(e) => updateForm('name', e.target.value)}
                              placeholder="Tony Stark"
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-cyan-400 focus:outline-none transition-all"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono text-cyan-400 uppercase mb-2">Email</label>
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) => updateForm('email', e.target.value)}
                              placeholder="founder@company.com"
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-cyan-400 focus:outline-none transition-all"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-mono text-cyan-400 uppercase mb-2">Phone</label>
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => updateForm('phone', e.target.value)}
                              placeholder="+1 (555) 000-0000"
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-cyan-400 focus:outline-none transition-all"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono text-cyan-400 uppercase mb-2">LinkedIn</label>
                            <input
                              type="url"
                              value={formData.linkedin}
                              onChange={(e) => updateForm('linkedin', e.target.value)}
                              placeholder="linkedin.com/in/username"
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-cyan-400 focus:outline-none transition-all"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-cyan-400 uppercase mb-2">Mission Goal</label>
                          <select
                            value={formData.goal}
                            onChange={(e) => updateForm('goal', e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:outline-none appearance-none cursor-pointer"
                            required
                          >
                            <option value="">Select your goal...</option>
                            <option value="ship">Ship an AI product</option>
                            <option value="accelerator">Join the Accelerator</option>
                            <option value="b2b">Partner for B2B</option>
                            <option value="hire">Hire APEX to build</option>
                            <option value="other">Other / Tell us more</option>
                          </select>
                        </div>

                        <button
                          type="button"
                          onClick={nextStep}
                          disabled={!formData.name || !formData.email || !formData.phone || !formData.goal}
                          className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-black py-4 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Continue <ArrowRight className="w-5 h-5" />
                        </button>
                      </motion.div>
                    )}

                    {/* Step 2: Business */}
                    {step === 2 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                        <div className="text-center mb-6">
                          <div className="text-xs font-mono text-violet-400 uppercase tracking-widest mb-2">Step 02</div>
                          <h2 className="text-2xl font-bold">Your Business</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-mono text-violet-400 uppercase mb-2">Company</label>
                            <input
                              type="text"
                              value={formData.company}
                              onChange={(e) => updateForm('company', e.target.value)}
                              placeholder="Stark Industries"
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-violet-400 focus:outline-none transition-all"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono text-violet-400 uppercase mb-2">Role</label>
                            <input
                              type="text"
                              value={formData.role}
                              onChange={(e) => updateForm('role', e.target.value)}
                              placeholder="CEO / Founder"
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-violet-400 focus:outline-none transition-all"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-mono text-violet-400 uppercase mb-2">Industry</label>
                            <select
                              value={formData.industry}
                              onChange={(e) => updateForm('industry', e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-400 focus:outline-none appearance-none cursor-pointer"
                              required
                            >
                              <option value="">Select...</option>
                              <option value="saas">SaaS / Software</option>
                              <option value="ai-ml">AI / Machine Learning</option>
                              <option value="fintech">Fintech</option>
                              <option value="ecommerce">E-commerce</option>
                              <option value="healthcare">Healthcare</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-mono text-violet-400 uppercase mb-2">Company Size</label>
                            <select
                              value={formData.companySize}
                              onChange={(e) => updateForm('companySize', e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-400 focus:outline-none appearance-none cursor-pointer"
                              required
                            >
                              <option value="">Select...</option>
                              <option value="solo">Solo Founder</option>
                              <option value="2-5">2-5 people</option>
                              <option value="10-50">10-50 people</option>
                              <option value="50-200">50-200 people</option>
                              <option value="200+">200+ people</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-mono text-violet-400 uppercase mb-2">Experience</label>
                            <select
                              value={formData.experience}
                              onChange={(e) => updateForm('experience', e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-400 focus:outline-none appearance-none cursor-pointer"
                              required
                            >
                              <option value="">Select...</option>
                              <option value="0-1">0-1 years</option>
                              <option value="1-3">1-3 years</option>
                              <option value="3-5">3-5 years</option>
                              <option value="5+">5+ years</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-mono text-violet-400 uppercase mb-2">Funding Status</label>
                            <select
                              value={formData.fundingStatus}
                              onChange={(e) => updateForm('fundingStatus', e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-400 focus:outline-none appearance-none cursor-pointer"
                              required
                            >
                              <option value="">Select...</option>
                              <option value="bootstrapped">Bootstrapped</option>
                              <option value="pre-seed">Pre-seed</option>
                              <option value="seed">Seed</option>
                              <option value="series-a">Series A</option>
                              <option value="profitable">Profitable</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-mono text-violet-400 uppercase mb-2">Team Size</label>
                            <select
                              value={formData.teamSize}
                              onChange={(e) => updateForm('teamSize', e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-400 focus:outline-none appearance-none cursor-pointer"
                              required
                            >
                              <option value="">Select...</option>
                              <option value="solo">Solo</option>
                              <option value="2-5">2-5</option>
                              <option value="5-10">5-10</option>
                              <option value="10+">10+</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-mono text-violet-400 uppercase mb-2">Revenue Range</label>
                            <select
                              value={formData.revenueRange}
                              onChange={(e) => updateForm('revenueRange', e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-400 focus:outline-none appearance-none cursor-pointer"
                              required
                            >
                              <option value="">Select...</option>
                              <option value="pre-revenue">Pre-revenue</option>
                              <option value="10k-50k">$10k-$50k</option>
                              <option value="50k-100k">$50k-$100k</option>
                              <option value="100k+">$100k+</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <button
                            type="button"
                            onClick={prevStep}
                            className="flex-1 py-4 rounded-xl border border-white/20 text-white font-bold hover:bg-white/5 transition-all"
                          >
                            Back
                          </button>
                          <button
                            type="button"
                            onClick={nextStep}
                          disabled={!formData.company || !formData.role || !formData.industry || !formData.companySize || !formData.experience || !formData.fundingStatus || !formData.teamSize || !formData.revenueRange}
                            className="flex-1 bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-black py-4 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Continue <ArrowRight className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Mission */}
                    {step === 3 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                        <div className="text-center mb-6">
                          <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-2">Step 03</div>
                          <h2 className="text-2xl font-bold">Your Mission</h2>
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-emerald-400 uppercase mb-2">Why do you want to join?</label>
                          <textarea
                            value={formData.whyJoin}
                            onChange={(e) => updateForm('whyJoin', e.target.value)}
                            placeholder="Tell us about your goals and what you want to build..."
                            rows={4}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-emerald-400 focus:outline-none resize-none transition-all"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-mono text-emerald-400 uppercase mb-2">Biggest Challenge</label>
                            <select
                              value={formData.biggestChallenge}
                              onChange={(e) => updateForm('biggestChallenge', e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-400 focus:outline-none appearance-none cursor-pointer"
                              required
                            >
                              <option value="">Select...</option>
                              <option value="speed">Execution Speed</option>
                              <option value="technical">Technical Architecture</option>
                              <option value="ai">AI Integration</option>
                              <option value="gtm">Go-to-Market</option>
                              <option value="team">Team Building</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-mono text-emerald-400 uppercase mb-2">Timeline</label>
                            <select
                              value={formData.timeline}
                              onChange={(e) => updateForm('timeline', e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-400 focus:outline-none appearance-none cursor-pointer"
                              required
                            >
                              <option value="">Select...</option>
                              <option value="immediately">Immediately</option>
                              <option value="1-month">Within 1 month</option>
                              <option value="3-months">Within 3 months</option>
                              <option value="6-months">Within 6 months</option>
                            </select>
                          </div>
                        </div>

                    <div>
                      <label className="block text-xs font-mono text-emerald-400 uppercase mb-2">Notes / Context (optional)</label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => updateForm('notes', e.target.value)}
                        placeholder="Anything else we should know (stack, market, timeline, blockers)..."
                        rows={3}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-emerald-400 focus:outline-none transition-all"
                      />
                    </div>

                    <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl px-4 py-3">
                      <input
                        id="consent"
                        type="checkbox"
                        checked={formData.consent}
                        onChange={(e) => updateForm('consent', e.target.checked)}
                        className="w-4 h-4 accent-emerald-400"
                        required
                      />
                      <label htmlFor="consent" className="text-xs text-white/70">I agree to be contacted about APEX OS (email/phone) and receive the webinar details.</label>
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex-1 py-4 rounded-xl border border-white/20 text-white font-bold hover:bg-white/5 transition-all"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading || !formData.whyJoin || !formData.biggestChallenge || !formData.timeline || !formData.consent}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-black py-4 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Processing...' : 'Join Waitlist'} <ArrowRight className="w-5 h-5" />
                      </button>
                        </div>
                      </motion.div>
                    )}
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/5 backdrop-blur-2xl border border-emerald-500/30 rounded-3xl p-8 md:p-10 text-center"
                >
                  <Trophy className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
                  <h2 className="text-3xl font-black mb-2">You're In!</h2>
                  <div className="text-white/60 mb-8">Welcome to the APEX OS ecosystem.</div>

                  {aiScore && (
                    <div className="mb-8 p-6 bg-black/40 rounded-2xl border border-emerald-500/20">
                      <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-2">AI Readiness Score</div>
                      <div className="text-6xl font-black text-emerald-400 mb-4">{aiScore}</div>
                      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${aiScore}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full"
                        />
                      </div>
                      <div className="mt-2 text-sm text-white/60">
                        {aiScore >= 80 ? '🔥 Hot Lead - Priority Access' : aiScore >= 60 ? '⚡ Warm Lead - Standard Queue' : '📋 Cold Lead - Review Required'}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-black/40 border border-white/10 rounded-xl p-4">
                      <div className="text-xs text-white/40 uppercase mb-1">Queue Position</div>
                      <div className="text-2xl font-black text-cyan-400">#{rank?.toLocaleString()}</div>
                    </div>
                    <div className="bg-black/40 border border-white/10 rounded-xl p-4">
                      <div className="text-xs text-white/40 uppercase mb-1">Launch Window</div>
                      <div className="text-2xl font-black text-emerald-400">T-14 Days</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 rounded-xl p-5 border border-cyan-500/30 mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Share2 className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Boost Your Position</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={`https://apex-os.io/waitlist?ref=${referralCode}`}
                        readOnly
                        className="flex-1 bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white/50"
                      />
                      <button
                        onClick={copyReferral}
                        className="px-4 py-2 bg-cyan-500 text-black font-bold rounded-lg text-xs uppercase hover:bg-cyan-400 transition-all"
                      >
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-white/40">Webinar invite coming soon. Check your email.</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-6 text-center">
          <div className="text-white/30 text-sm">© 2026 APEX OS • Built with AI • Owned by Builders</div>
        </footer>
      </div>
    </div>
  );
}
