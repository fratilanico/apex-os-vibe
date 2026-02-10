import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { CountdownTimer } from '../CountdownTimer';

// Friday 27th February 2026 at 6:00 PM UK time (GMT)
const WEBINAR_DATE = new Date('2026-02-27T18:00:00+00:00');

export const CountdownSection: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="py-16"
    >
      <GlassCard accent="cyan" hover={false} className="p-8 md:p-12 text-center border-cyan-500/20">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 font-sans">
          Live Webinar
        </h3>
        <p className="text-white/50 mb-8 font-sans">
          First 100 Builders Get Early Access
        </p>
        <CountdownTimer targetDate={WEBINAR_DATE} label="NEXT COHORT STARTS IN" />
      </GlassCard>
    </motion.section>
  );
};
