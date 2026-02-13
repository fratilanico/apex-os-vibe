import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Check,
  Shield,
  Users,
  Clock,
  Zap,
  ArrowRight,
  Sparkles,
  Timer,
} from 'lucide-react';
import { PRICING_TIERS, calculatePrice, calculateDiscount, getSavings, type PricingTier } from '../data/pricingData';

type BillingPeriod = 'monthly' | 'yearly';

// Emerging market pricing is the default — no toggle needed
const IS_EMERGING_MARKET = true;

const badgeColorMap: Record<string, string> = {
  orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  violet: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
};

const glowColorMap: Record<string, string> = {
  orange: 'shadow-orange-500/20',
  amber: 'shadow-amber-500/20',
  emerald: 'shadow-cyan-500/30',
  violet: 'shadow-violet-500/20',
  cyan: 'shadow-cyan-500/20',
};

const borderColorMap: Record<string, string> = {
  orange: 'border-orange-500/20 hover:border-orange-500/40',
  amber: 'border-amber-500/20 hover:border-amber-500/40',
  emerald: 'border-cyan-500/40 hover:border-cyan-500/60',
  violet: 'border-violet-500/20 hover:border-violet-500/40',
  cyan: 'border-cyan-500/20 hover:border-cyan-500/40',
};

interface TierCardProps {
  tier: PricingTier;
  billing: BillingPeriod;
  index: number;
}

const TierCard: React.FC<TierCardProps> = ({ tier, billing, index }) => {
  const isYearly = billing === 'yearly';
  const price = calculatePrice(tier, IS_EMERGING_MARKET, isYearly);
  const discount = calculateDiscount(tier, IS_EMERGING_MARKET, isYearly);
  const savings = getSavings(tier, IS_EMERGING_MARKET, isYearly);
  const isHighlighted = tier.highlighted;
  const isOneTime = tier.interval === 'one-time';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.1 }}
      className={`relative rounded-2xl border p-5 sm:p-6 transition-all duration-300 ${
        isHighlighted
          ? `${borderColorMap[tier.badgeColor]} bg-gradient-to-b from-cyan-500/10 to-violet-500/5 shadow-lg ${glowColorMap[tier.badgeColor]}`
          : `${borderColorMap[tier.badgeColor]} bg-white/[0.02]`
      }`}
    >
      {isHighlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-xs font-bold text-black tracking-wider">
          RECOMMENDED
        </div>
      )}

      {/* Badge */}
      <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider border mb-4 ${badgeColorMap[tier.badgeColor]}`}>
        {tier.badge}
      </div>

      {/* Name */}
      <h3 className="text-xl font-bold text-white mb-1">{tier.name}</h3>
      <p className="text-xs text-white/40 mb-4">{tier.targetAudience}</p>

      {/* Price */}
      <div className="mb-4">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl sm:text-4xl font-bold text-white">${price}</span>
          <span className="text-white/40 text-sm">
            {isOneTime ? ' one-time' : isYearly ? '/year' : '/mo'}
          </span>
        </div>
        {discount > 0 && (
          <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] font-bold text-emerald-400">
              {discount}% OFF{savings > 0 ? ` — save $${savings}` : ''}
            </span>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-white/60 mb-4">{tier.description}</p>

      {/* Features */}
      <div className="space-y-2 mb-6">
        {tier.features.map((feature) => (
          <div key={feature} className="flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span className="text-xs text-white/70">{feature}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Link
        to="/waitlist"
        className={`block w-full py-3 rounded-xl font-bold text-center text-sm transition-all ${
          isHighlighted
            ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-black hover:shadow-lg hover:shadow-cyan-500/25'
            : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
        }`}
      >
        {isOneTime ? 'Apply Now' : 'Join Waitlist'}
      </Link>
    </motion.div>
  );
};

export const PricingPage: React.FC = () => {
  const [billing, setBilling] = useState<BillingPeriod>('monthly');

  return (
    <main className="relative z-10 px-3 sm:px-4 lg:px-6 max-w-6xl mx-auto pb-16 overflow-x-hidden">
      {/* Hero */}
      <section className="relative text-center max-w-4xl mx-auto pt-6 sm:pt-8 pb-8 sm:pb-12">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute top-10 right-1/4 w-64 h-64 bg-violet-500/20 rounded-full blur-[100px] animate-pulse delay-1000" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 mb-4 sm:mb-6"
        >
          <Timer className="w-4 h-4 text-amber-400 animate-pulse flex-shrink-0" />
          <span className="text-xs sm:text-sm font-semibold text-amber-400">
            Founding cohort forming now — Limited spots
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6"
        >
          <span className="text-white">Invest in </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-emerald-400">
            Your Independence
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-white/60 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0"
        >
          Stop paying $200K/year for a tech co-founder or giving away equity.
          <br />
          <span className="text-white/80 font-semibold">
            Build your own AI engineering team for a fraction of the cost.
          </span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8 sm:mb-10 px-2 sm:px-0"
        >
          <div className="flex items-center gap-2 text-white/60">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium">30-day money-back guarantee</span>
          </div>
          <div className="flex items-center gap-2 text-white/60">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium">500+ founders enrolled</span>
          </div>
        </motion.div>
      </section>

      {/* Billing + Region Toggle */}
      <section className="max-w-lg mx-auto mb-8 sm:mb-12 px-2 sm:px-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          {/* Billing toggle */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-3 p-2 rounded-xl bg-white/[0.02] border border-white/10">
            <button
              onClick={() => setBilling('monthly')}
              className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition-all min-h-[44px] ${
                billing === 'monthly'
                  ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition-all relative min-h-[44px] ${
                billing === 'yearly'
                  ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              Yearly
              <span className="hidden sm:block absolute -top-2 -right-2 px-2 py-0.5 text-xs font-bold bg-emerald-500 text-white rounded-full shadow-lg shadow-emerald-500/50">
                SAVE 25%
              </span>
            </button>
          </div>

        </motion.div>
      </section>

      {/* Pricing Grid */}
      <section className="mb-12 sm:mb-16 px-2 sm:px-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {PRICING_TIERS.slice(0, 3).map((tier, idx) => (
            <TierCard key={tier.id} tier={tier} billing={billing} index={idx} />
          ))}
        </div>

        {/* Bottom row: 2 wider cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto mt-4 sm:mt-6">
          {PRICING_TIERS.slice(3).map((tier, idx) => (
            <TierCard key={tier.id} tier={tier} billing={billing} index={idx + 3} />
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="mb-12 sm:mb-16 px-2 sm:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Compare Your Options</h2>
            <p className="text-white/60">See how Vibe Academy stacks up against traditional paths</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-white/40 font-medium text-sm">Feature</th>
                  <th className="text-center py-4 px-4">
                    <div className="text-cyan-400 font-bold">Vibe Academy</div>
                    <div className="text-emerald-400 text-xs">Recommended</div>
                  </th>
                  <th className="text-center py-4 px-4 text-white/60 font-medium text-sm">Tech Co-Founder</th>
                  <th className="text-center py-4 px-4 text-white/60 font-medium text-sm">Dev Agency</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="py-4 px-4 text-white/80 text-sm">Upfront Cost</td>
                  <td className="py-4 px-4 text-center text-cyan-400 font-semibold">$200/mo or $997</td>
                  <td className="py-4 px-4 text-center text-white/60">$0 (equity)</td>
                  <td className="py-4 px-4 text-center text-white/60">$15,000+</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-4 px-4 text-white/80 text-sm">Annual Cost</td>
                  <td className="py-4 px-4 text-center text-cyan-400 font-semibold">$997-$2,400</td>
                  <td className="py-4 px-4 text-center text-white/60">$150K-$300K</td>
                  <td className="py-4 px-4 text-center text-white/60">$50K-$200K</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-4 px-4 text-white/80 text-sm">Equity Required</td>
                  <td className="py-4 px-4 text-center text-cyan-400 font-semibold">0%</td>
                  <td className="py-4 px-4 text-center text-white/60">15-50%</td>
                  <td className="py-4 px-4 text-center text-white/60">0%</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-4 px-4 text-white/80 text-sm">Time to Start</td>
                  <td className="py-4 px-4 text-center text-cyan-400 font-semibold">Immediate</td>
                  <td className="py-4 px-4 text-center text-white/60">3-12 months</td>
                  <td className="py-4 px-4 text-center text-white/60">2-4 weeks</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-4 px-4 text-white/80 text-sm">Knowledge Transfer</td>
                  <td className="py-4 px-4 text-center text-cyan-400 font-semibold">You learn everything</td>
                  <td className="py-4 px-4 text-center text-white/60">Dependent on them</td>
                  <td className="py-4 px-4 text-center text-white/60">None</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-4 px-4 text-white/80 text-sm">Ongoing Dependency</td>
                  <td className="py-4 px-4 text-center text-cyan-400 font-semibold">None - you own it</td>
                  <td className="py-4 px-4 text-center text-white/60">High risk if they leave</td>
                  <td className="py-4 px-4 text-center text-white/60">Vendor lock-in</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-4 px-4 text-white/80 text-sm">24/7 Availability</td>
                  <td className="py-4 px-4 text-center text-cyan-400 font-semibold">AI agents work anytime</td>
                  <td className="py-4 px-4 text-center text-white/60">Limited hours</td>
                  <td className="py-4 px-4 text-center text-white/60">Business hours only</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-white/80 text-sm">Scalability</td>
                  <td className="py-4 px-4 text-center text-cyan-400 font-semibold">Unlimited parallel agents</td>
                  <td className="py-4 px-4 text-center text-white/60">1 person bandwidth</td>
                  <td className="py-4 px-4 text-center text-white/60">Hourly billing</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </section>

      {/* Trust Section */}
      <section className="mb-12 sm:mb-16 px-2 sm:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto"
        >
          {[
            {
              icon: Shield,
              title: '30-Day Money-Back',
              desc: 'Not satisfied? Get a full refund within 30 days. No questions asked.',
              color: 'emerald',
            },
            {
              icon: Clock,
              title: 'Lifetime Updates',
              desc: 'Curriculum evolves with AI. Your access includes all future updates.',
              color: 'cyan',
            },
            {
              icon: Zap,
              title: 'Start Immediately',
              desc: 'Get instant access to your tier modules. Begin building within minutes.',
              color: 'violet',
            },
          ].map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 + idx * 0.1 }}
              className="p-4 sm:p-6 rounded-xl border border-white/10 bg-white/[0.02] text-center"
            >
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-${item.color}-500/10 border border-${item.color}-500/20 flex items-center justify-center mx-auto mb-3 sm:mb-4`}
              >
                <item.icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${item.color}-400`} />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">{item.title}</h3>
              <p className="text-xs sm:text-sm text-white/60">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="text-center py-8 sm:py-12 border-t border-white/5 px-2 sm:px-0">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 mb-4 sm:mb-6">
            <Timer className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-amber-400">
              Founding cohort — Limited spots remaining
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
            Ready to Build Without a Tech Co-Founder?
          </h2>
          <p className="text-white/60 mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base px-2 sm:px-0">
            Join 500+ founders who are shipping production features faster than 10-person dev
            teams. Your AI engineering team is waiting.
          </p>

          <Link
            to="/waitlist"
            className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all text-base sm:text-lg min-h-[48px]"
          >
            <span>Join the Waitlist</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          </Link>

          <p className="mt-4 text-xs sm:text-sm text-white/40">
            30-day money-back guarantee. No risk to try.
          </p>
        </motion.div>
      </section>
    </main>
  );
};
