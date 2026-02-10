'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy, CheckCircle, ExternalLink, ArrowRight } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

interface SuccessStateProps {
  aiScore: number;
  rank: number;
  referralCode: string;
  status: 'hot' | 'warm' | 'cold';
}

const statusConfig = {
  hot: {
    label: 'Sovereign Founder',
    textClass: 'text-emerald-400',
    barClass: 'bg-gradient-to-r from-cyan-400 to-emerald-400',
    shadow: '0 0 20px rgba(6, 182, 212, 0.4)',
  },
  warm: {
    label: 'Strong Signal',
    textClass: 'text-cyan-400',
    barClass: 'bg-gradient-to-r from-cyan-400 to-violet-400',
    shadow: 'none',
  },
  cold: {
    label: 'Growing Potential',
    textClass: 'text-white/40',
    barClass: 'bg-white/30',
    shadow: 'none',
  },
} as const;

import { useOnboardingStore } from '../../stores/useOnboardingStore';

// Calculation for fixed date: Friday 27th February 2026 at 6:00 PM UK time (GMT)
const WEBINAR_DATE = new Date('2026-02-27T18:00:00+00:00');

export const SuccessState: React.FC<SuccessStateProps> = ({
  aiScore,
  rank,
  referralCode,
  status,
}) => {
  const [copied, setCopied] = useState(false);
  const { persona } = useOnboardingStore();
  const config = statusConfig[status];
  const referralUrl = `https://infoacademy.uk/waitlist?ref=${referralCode}`;

  const daysToLaunch = Math.max(0, Math.ceil((WEBINAR_DATE.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select the input text
    }
  };

  const tweetText = encodeURIComponent(
    "Just secured my spot on APEX OS — the operating system for the AI age. Build at AI speed with 17 AI agents."
  );
  const shareUrl = encodeURIComponent(referralUrl);

  const personaNextSteps = {
    BUSINESS: {
      title: "Business Architect Journey",
      step: "Start with the ROI Analysis Module",
      cta: "View Strategy",
      link: "/academy/modules/roi-analysis"
    },
    PERSONAL: {
      title: "Personal Builder Journey",
      step: "Start with the Vibe Coding Module",
      cta: "View Playbook",
      link: "/academy/modules/vibe-coding"
    },
    NONE: {
      title: "Founder Journey",
      step: "Complete your profile for a custom roadmap",
      cta: "Explore Swarm",
      link: "/academy"
    }
  };

  const nextStep = personaNextSteps[persona || 'NONE'];

  return (
    <section className="py-16 text-center">
      {/* 1. Checkmark circle */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-8"
      >
        <Check className="w-10 h-10 text-emerald-400" strokeWidth={3} />
      </motion.div>

      {/* 2. Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="text-3xl md:text-4xl font-bold text-white mb-10"
      >
        You&apos;re In, {persona === 'BUSINESS' ? 'Architect' : 'Builder'}!
      </motion.h2>

      {/* 3. AI Score section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-lg mx-auto mb-8"
      >
        <GlassCard className="p-6" hover={false} delay={0.3}>
          <p className="text-sm text-white/50 uppercase tracking-wider mb-4">
            AI Readiness Score
          </p>

          {/* Progress bar */}
          <div className="h-3 rounded-full bg-white/10 overflow-hidden mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${aiScore}%` }}
              transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
              className={`h-full rounded-full ${config.barClass}`}
              style={{ boxShadow: config.shadow }}
            />
          </div>

          {/* Score text */}
          <p className="text-right text-sm text-white/70 font-mono mb-2">
            {aiScore}/100
          </p>

          {/* Status label */}
          <p className={`text-sm font-medium ${config.textClass}`}>
            {config.label}
          </p>
        </GlassCard>
      </motion.div>

      {/* 4. Stat cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-8"
      >
        <GlassCard className="p-6 text-center" hover={false} delay={0.4}>
          <p className="text-3xl font-black text-cyan-400 mb-1">#{rank}</p>
          <p className="text-sm text-white/50">Queue Position</p>
        </GlassCard>
        <GlassCard className="p-6 text-center" hover={false} delay={0.5}>
          <p className="text-3xl font-black text-emerald-400 mb-1">{daysToLaunch}</p>
          <p className="text-sm text-white/50">Days to Launch</p>
        </GlassCard>
      </motion.div>

      {/* Persona Next Step */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="max-w-lg mx-auto mb-8 p-6 bg-gradient-to-br from-violet-900/20 to-cyan-900/20 rounded-2xl border border-white/10"
      >
        <h4 className="text-cyan-400 font-bold text-xs uppercase tracking-widest mb-2">{nextStep.title}</h4>
        <p className="text-white text-sm mb-4">{nextStep.step}</p>
        <a href={nextStep.link} className="inline-flex items-center gap-2 text-xs font-bold text-white bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-all">
          {nextStep.cta} <ArrowRight className="w-3 h-3" />
        </a>
      </motion.div>

      {/* 5. Referral section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-lg mx-auto mb-8"
      >
        <GlassCard className="p-4" hover={false} delay={0.6}>
          <p className="text-sm text-white/50 mb-3">Your referral link</p>
          <div className="flex">
            <input
              type="text"
              readOnly
              value={referralUrl}
              className="flex-1 bg-black/40 border border-white/10 rounded-l-xl px-4 py-3 text-sm text-white/70 font-mono outline-none min-w-0"
            />
            <button
              onClick={handleCopy}
              className="bg-cyan-500 hover:bg-cyan-400 transition-colors rounded-r-xl px-4 py-3 flex items-center gap-2 text-sm font-medium text-black whitespace-nowrap"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
          </div>
        </GlassCard>
      </motion.div>

      {/* 6. Share section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-sm text-white/40 mb-3">Boost Your Position</p>
        <div className="flex justify-center gap-3">
          <a
            href={`https://twitter.com/intent/tweet?text=${tweetText}&url=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-6 py-3 text-sm text-white/70 hover:text-white hover:border-white/20 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Twitter
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-6 py-3 text-sm text-white/70 hover:text-white hover:border-white/20 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            LinkedIn
          </a>
        </div>
      </motion.div>
    </section>
  );
};
