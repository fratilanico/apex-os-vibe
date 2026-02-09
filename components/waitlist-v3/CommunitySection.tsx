import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Users } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { GradientText } from '../ui/GradientText';

type AccentColor = 'cyan' | 'emerald' | 'violet' | 'amber' | 'pink';

interface CommunityCard {
  icon: React.FC<{ className?: string }>;
  title: string;
  count: string;
  countLabel: string;
  description: string;
  tags: string[];
  accent: AccentColor;
  cta: string;
  href?: string;
}

const CARDS: CommunityCard[] = [
  {
    icon: MessageSquare,
    title: 'Discord Community',
    count: 'Join',
    countLabel: 'the swarm',
    description: "We're migrating our legacy community to this new orchestration platform. Be among the first to shape the future of AI-native development.",
    tags: ['Live Chat', 'Agent Demos', 'Builder Logs'],
    accent: 'violet',
    cta: 'Join Discord',
    href: '#',
  },
  {
    icon: Send,
    title: 'Telegram Channel',
    count: 'Get',
    countLabel: 'updates',
    description: 'Direct access to founder updates, product launches, and behind-the-scenes development.',
    tags: ['Announcements', 'Launches', 'Alpha'],
    accent: 'cyan',
    cta: 'Join Telegram',
    href: '#',
  },
  {
    icon: Users,
    title: 'Waitlist',
    count: 'Early',
    countLabel: 'access',
    description: 'Priority access to the APEX OS platform and exclusive beta features.',
    tags: ['Beta Access', 'AI Scoring', 'Founder Perks'],
    accent: 'emerald',
    cta: 'Apply Below ↓',
    href: '#apply',
  },
];

const TAG_COLORS: Record<AccentColor, string> = {
  cyan: 'text-cyan-400/70',
  emerald: 'text-emerald-400/70',
  violet: 'text-violet-400/70',
  amber: 'text-amber-400/70',
  pink: 'text-pink-400/70',
};

const COUNT_COLORS: Record<AccentColor, string> = {
  cyan: 'text-cyan-400',
  emerald: 'text-emerald-400',
  violet: 'text-violet-400',
  amber: 'text-amber-400',
  pink: 'text-pink-400',
};

export const CommunitySection: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="py-16"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-sans">
        <GradientText from="violet-400" to="cyan-400">
          Join the Swarm
        </GradientText>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CARDS.map((card, i) => (
          <GlassCard key={card.title} accent={card.accent} delay={i * 0.15} className="p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <card.icon className={`w-6 h-6 ${COUNT_COLORS[card.accent]}`} />
              <span className="text-white/40 text-sm font-mono uppercase tracking-wider">{card.title}</span>
            </div>

            <div className="mb-4">
              <span className={`text-4xl font-black ${COUNT_COLORS[card.accent]}`}>{card.count}</span>
              <span className="text-white/40 text-sm ml-2">{card.countLabel}</span>
            </div>

            <p className="text-white/50 text-sm mb-6 flex-1">{card.description}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {card.tags.map(tag => (
                <span
                  key={tag}
                  className={`text-xs bg-white/5 border border-white/10 rounded-full px-3 py-1 ${TAG_COLORS[card.accent]}`}
                >
                  {tag}
                </span>
              ))}
            </div>

            <a
              href={card.href}
              className={`text-sm font-bold ${COUNT_COLORS[card.accent]} hover:underline`}
            >
              {card.cta} →
            </a>
          </GlassCard>
        ))}
      </div>
    </motion.section>
  );
};
