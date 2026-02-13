import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Zap, Bell, ArrowRight, Newspaper } from 'lucide-react';

export const NewsletterHub: React.FC = () => {
  const benefits = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Weekly AI Developments',
      description: 'Curated updates on the latest AI tools and techniques'
    },
    {
      icon: <Bell className="w-5 h-5" />,
      title: 'Early Access',
      description: 'Be the first to know about new modules and features'
    },
    {
      icon: <Newspaper className="w-5 h-5" />,
      title: 'Insider Knowledge',
      description: 'Tips and tricks from the APEX OS community'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto mt-12 p-8 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-violet-500/10"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
          <Mail className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h3 className="font-mono text-lg text-cyan-400">
            NEWSLETTER HUB
          </h3>
          <p className="text-white/60 text-sm">
            Stay connected for free
          </p>
        </div>
      </div>

      <p className="text-white/80 mb-6">
        Not ready to join the cohort? No problem. Subscribe to our newsletter hub and stay 
        up-to-date with the latest AI developments, tool updates, and insider knowledge - <span className="text-cyan-400 font-semibold">completely free</span>.
      </p>

      <div className="grid gap-4 mb-6">
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3 p-3 rounded-lg bg-white/5"
          >
            <div className="text-cyan-400 mt-0.5">{benefit.icon}</div>
            <div>
              <h4 className="font-mono text-sm text-white mb-1">{benefit.title}</h4>
              <p className="text-xs text-white/50">{benefit.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <button
        className="w-full py-4 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-semibold flex items-center justify-center gap-2 transition-all group"
        onClick={() => window.open('https://newsletter.apex-os.dev', '_blank')}
      >
        <span>Subscribe to Newsletter Hub</span>
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>

      <p className="text-center text-xs text-white/40 mt-4">
        Join 5,000+ builders getting weekly AI updates. Unsubscribe anytime.
      </p>
    </motion.div>
  );
};

export default NewsletterHub;