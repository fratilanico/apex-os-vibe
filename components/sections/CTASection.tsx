import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  BookOpen, 
  Wrench, 
  Rocket, 
  Lock, 
  ArrowRight, 
  Sparkles,
  TrendingUp,
  Shield,
  CreditCard
} from 'lucide-react';
import { GlowButton } from '../ui/GlowButton';

// ═══════════════════════════════════════════════════════════════════════════════
// CTA SECTION - Business Model Clarity Edition
// Choose Your Path: Academy → Accelerator
// ═══════════════════════════════════════════════════════════════════════════════

interface CTASectionProps {
  onJoinClick?: () => void;
}

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}

const PathCard: React.FC<{
  title: string;
  subtitle: string;
  features: Feature[];
  ctaText: string;
  ctaAction?: () => void;
  disabled?: boolean;
  disabledReason?: string;
  price?: string;
  badge?: string;
  variant: 'academy' | 'accelerator';
  delay?: number;
}> = ({ 
  title, 
  subtitle, 
  features, 
  ctaText, 
  ctaAction, 
  disabled, 
  disabledReason,
  price,
  badge,
  variant,
  delay = 0 
}) => {
  const isAcademy = variant === 'academy';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      className={`relative group rounded-2xl overflow-hidden ${
        isAcademy 
          ? 'bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border-2 border-cyan-500/30' 
          : 'bg-gradient-to-br from-emerald-500/10 to-violet-500/5 border-2 border-emerald-500/30'
      }`}
    >
      {/* Background Glow */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
        isAcademy 
          ? 'bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10' 
          : 'bg-gradient-to-br from-emerald-500/10 via-transparent to-violet-500/10'
      }`} />
      
      {/* Badge */}
      {badge && (
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider ${
          isAcademy 
            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
        }`}>
          {badge}
        </div>
      )}

      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="mb-6">
          <h3 className={`text-2xl font-bold mb-2 ${isAcademy ? 'text-white' : 'text-white'}`}>
            {title}
          </h3>
          <p className="text-white/60 text-sm">{subtitle}</p>
        </div>

        {/* Features */}
        <ul className="space-y-4 mb-8">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <motion.li 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: delay + 0.1 + idx * 0.05 }}
                className="flex items-start gap-3"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isAcademy ? 'bg-cyan-500/10 text-cyan-400' : 'bg-emerald-500/10 text-emerald-400'
                }`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <span className="text-white/80 text-sm pt-1.5">{feature.text}</span>
              </motion.li>
            );
          })}
        </ul>

        {/* Price */}
        {price && (
          <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{price}</span>
              <span className="text-white/40 text-sm">one-time</span>
            </div>
            <p className="text-white/40 text-xs mt-1">Payment plans available</p>
          </div>
        )}

        {/* CTA */}
        <GlowButton
          onClick={ctaAction}
          disabled={disabled}
          variant={isAcademy ? 'primary' : 'secondary'}
          size="lg"
          className="w-full"
          icon={disabled ? <Lock className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        >
          {disabled ? disabledReason : ctaText}
        </GlowButton>
      </div>

      {/* Border Glow Effect */}
      <div className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${
        isAcademy 
          ? 'shadow-[0_0_30px_rgba(6,182,212,0.2)]' 
          : 'shadow-[0_0_30px_rgba(16,185,129,0.2)]'
      }`} />
    </motion.div>
  );
};

const FlowDiagram: React.FC = () => {
  const steps = [
    { label: 'Newbie', icon: Sparkles, color: 'text-zinc-400' },
    { label: 'Academy', icon: Users, color: 'text-cyan-400', active: true },
    { label: 'Builder', icon: Wrench, color: 'text-blue-400' },
    { label: 'Visionary', icon: TrendingUp, color: 'text-violet-400' },
    { label: 'Accelerator', icon: Rocket, color: 'text-emerald-400', highlight: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4 }}
      className="mt-16 p-6 rounded-2xl bg-white/5 border border-white/10"
    >
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              step.active 
                ? 'bg-cyan-500/20 border border-cyan-500/30' 
                : step.highlight 
                  ? 'bg-emerald-500/20 border border-emerald-500/30'
                  : 'bg-white/5 border border-white/10'
            }`}>
              <step.icon className={`w-4 h-4 ${step.color}`} />
              <span className={`text-sm font-medium ${step.color}`}>{step.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <ArrowRight className="w-4 h-4 text-white/20 hidden md:block" />
            )}
          </React.Fragment>
        ))}
      </div>
      <p className="text-center text-white/40 text-sm mt-4">
        25-30 students per cohort → Graduate → Apply for Accelerator (1% equity)
      </p>
    </motion.div>
  );
};

export const CTASection: React.FC<CTASectionProps> = ({ onJoinClick }) => {
  return (
    <section className="relative py-32 px-4 overflow-hidden bg-[#0a0a0a]">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[150px]" />
        <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[150px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-white/70">Your journey starts here</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Choose Your Path
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/60 max-w-2xl mx-auto"
          >
            Start with the Academy. Graduate to the Accelerator. 
            Build your sovereign future.
          </motion.p>
        </div>

        {/* Path Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Academy Path */}
          <PathCard
            title="APEX OS Academy"
            subtitle="For founders ready to master AI"
            badge="Now Enrolling"
            price="£2,497"
            variant="academy"
            delay={0.2}
            features={[
              { icon: Users, text: '25-30 students per cohort (intimate, focused)' },
              { icon: BookOpen, text: '12-module comprehensive curriculum' },
              { icon: Wrench, text: 'Master 8 AI tools + infrastructure stack' },
              { icon: Rocket, text: 'Build real projects, not tutorials' },
              { icon: Shield, text: 'Lifetime access to community & updates' },
            ]}
              ctaText="Join the Next Webinar"
            ctaAction={onJoinClick}
          />

          {/* Accelerator Path */}
          <PathCard
            title="InfoAcademy Accelerator"
            subtitle="For graduates with viable projects"
            badge="By Application"
            variant="accelerator"
            delay={0.3}
            features={[
              { icon: TrendingUp, text: '1% equity intake (founder-friendly terms)' },
              { icon: CreditCard, text: 'Seed funding for product development' },
              { icon: Users, text: 'Weekly 1:1 mentorship with Nicolae' },
              { icon: Rocket, text: 'Scale to market with full support' },
              { icon: Shield, text: 'Access to investor network' },
            ]}
            ctaText="Apply for Accelerator"
            disabled={true}
            disabledReason="Graduate First"
          />
        </div>

        {/* Flow Diagram */}
        <FlowDiagram />

        {/* Payment Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-12 flex items-center justify-center gap-3"
        >
          <CreditCard className="w-4 h-4 text-white/40" />
          <span className="text-sm text-white/40">Secure checkout via</span>
          <a 
            href="https://polar.sh" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-colors"
          >
            <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="text-sm font-medium text-white/70">Polar.sh</span>
          </a>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
          className="mt-16 pt-16 border-t border-white/10"
        >
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-white/40">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>14-day money-back guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Lifetime curriculum access</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Payment plans available</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
