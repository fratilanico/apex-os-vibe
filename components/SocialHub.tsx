import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send, Users, Zap, ArrowRight } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// SOCIAL HUB - Discord + Telegram + Waitlist CTAs
// Hero section for social-first waitlist strategy
// ═══════════════════════════════════════════════════════════════════════════════

interface PlatformStats {
  discord: number;
  telegram: number;
  waitlist: number;
}

export const SocialHub: React.FC = () => {
  const [stats, setStats] = useState<PlatformStats>({
    discord: 2437,
    telegram: 890,
    waitlist: 847
  });

  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Simulate live count updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        discord: prev.discord + Math.floor(Math.random() * 3),
        telegram: prev.telegram + Math.floor(Math.random() * 2),
        waitlist: Math.max(0, prev.waitlist - Math.floor(Math.random() * 2))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const platforms = [
    {
      id: 'discord',
      name: 'Discord',
      icon: MessageCircle,
      color: '#5865F2',
      gradient: 'from-[#5865F2] to-[#4752C4]',
      members: stats.discord,
      tagline: 'The Neural Network',
      description: 'Join 2,400+ builders. Live chat, voice channels, 24/7 community.',
      cta: 'Join Server',
      url: 'https://discord.gg/apexos',
      features: ['Real-time chat', 'Voice channels', 'Bot integrations', 'Events']
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: Send,
      color: '#0088cc',
      gradient: 'from-[#0088cc] to-[#00a8e6]',
      members: stats.telegram,
      tagline: 'The Signal Channel',
      description: 'Connect with 890+ founders. Async updates, bot access, private groups.',
      cta: 'Join Channel',
      url: 'https://t.me/apexos_network',
      features: ['Bot commands', 'Private groups', 'Async updates', 'File sharing']
    },
    {
      id: 'waitlist',
      name: 'Waitlist',
      icon: Zap,
      color: '#06b6d4',
      gradient: 'from-[#06b6d4] to-[#10b981]',
      members: stats.waitlist,
      tagline: 'Priority Access',
      description: '1,000 spots. 30-day sprint. AI-powered build system.',
      cta: 'Join Waitlist',
      url: '#waitlist-form',
      features: ['Early access', 'AI scoring', 'Referral rewards', 'Exclusive content']
    }
  ];

  return (
    <section className="relative py-20 px-6">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Neural Network Online</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Join the Swarm
            </span>
          </h2>

          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Connect first. Build together. Ship faster. 
            Choose your entry point into the APEX OS ecosystem.
          </p>
        </motion.div>

        {/* Platform Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredCard(platform.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className="group relative"
            >
              <a
                href={platform.url}
                target={platform.id !== 'waitlist' ? '_blank' : undefined}
                rel={platform.id !== 'waitlist' ? 'noopener noreferrer' : undefined}
                className="block h-full"
              >
                <div 
                  className="relative h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 transition-all duration-500 overflow-hidden"
                  style={{
                    borderColor: hoveredCard === platform.id ? `${platform.color}40` : undefined,
                    boxShadow: hoveredCard === platform.id ? `0 0 40px ${platform.color}20` : undefined
                  }}
                >
                  {/* Gradient background on hover */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                    style={{ 
                      backgroundImage: `linear-gradient(135deg, ${platform.color}20, transparent)` 
                    }}
                  />

                  {/* Icon */}
                  <div 
                    className="relative w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110"
                    style={{ 
                      backgroundColor: `${platform.color}20`,
                      boxShadow: `0 0 30px ${platform.color}30`
                    }}
                  >
                    <platform.icon 
                      className="w-8 h-8 transition-colors duration-500"
                      style={{ color: platform.color }}
                    />
                  </div>

                  {/* Content */}
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-2xl font-bold">{platform.name}</h3>
                      <span 
                        className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider"
                        style={{ 
                          backgroundColor: `${platform.color}20`,
                          color: platform.color
                        }}
                      >
                        {platform.tagline}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <Users className="w-4 h-4 text-white/40" />
                      <span className="text-sm font-mono">
                        {platform.members.toLocaleString()} members
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>

                    <p className="text-sm text-white/60 mb-6 leading-relaxed">
                      {platform.description}
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {platform.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-2 py-1 rounded-lg bg-white/5 text-[10px] text-white/50 border border-white/5"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <div 
                      className="flex items-center gap-2 font-mono text-sm font-bold transition-all duration-300 group-hover:gap-4"
                      style={{ color: platform.color }}
                    >
                      {platform.cta}
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </div>

        {/* Bottom tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-white/40 font-mono">
            All paths lead to the same destination: <span className="text-cyan-400">Building the future</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};
