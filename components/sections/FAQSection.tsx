import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Terminal, ArrowRight, Zap, Users, Clock, Shield, Sparkles, GraduationCap, TrendingUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  icon: React.ElementType;
  concern: string;
}

const faqItems: FAQItem[] = [
  {
    question: "What exactly will I build in this program?",
    answer: "You'll build a complete AI-powered business system: automated content pipelines, agent orchestration infrastructure, deployment workflows, and revenue-generating products. By Module 12, you'll have a deployed system running 24/7—not just tutorials, real assets that work while you sleep.",
    icon: Zap,
    concern: "Worried it's just theory?"
  },
  {
    question: "How much coding experience do I actually need to start?",
    answer: "Basic JavaScript/TypeScript familiarity helps, but we start from fundamentals. Module 00 covers the foundation. If you can read code and follow logic, you can complete this. AI handles the heavy lifting—you learn to direct it. We've had designers, marketers, and product managers succeed.",
    icon: GraduationCap,
    concern: "Not a 'coder'?"
  },
  {
    question: "What's the real time commitment per week?",
    answer: "Plan for 8-12 hours/week for optimal progress. Some modules are lighter (4-5 hours), others heavier (15+ hours for builds). It's self-paced—fall behind, catch up. The system waits for no one, but we don't leave anyone behind either. Lifetime access means you set the pace.",
    icon: Clock,
    concern: "Busy schedule?"
  },
  {
    question: "How is this different from free tutorials?",
    answer: "Free tutorials teach tools. We teach systems. You get production-grade architecture, agent orchestration patterns, and deployment strategies that actually scale. Plus: direct access to the founder, live builds, and a community of serious builders—not tutorial followers. The difference? Free stuff collects dust. This builds businesses.",
    icon: Sparkles,
    concern: "Why pay when YouTube is free?"
  },
  {
    question: "What tools will I master and how?",
    answer: "The 12-tool stack: Cursor, Claude Code, Gemini 3, OpenAI Codex, Antigravity, CodeMachine, NotebookLM, Google Stitch, GPT-5.2, OpenCode, Imagen 3, and Veo 3.1. Plus infrastructure: Vercel, Supabase, Polar.sh, and PM2 automation. You don't just watch—you build with each tool in real projects.",
    icon: Zap,
    concern: "Tool overload anxiety?"
  },
  {
    question: "Is there a community or just videos?",
    answer: "Both. You get structured curriculum modules AND access to the builder community. Weekly live sessions, async Q&A, and direct feedback on your builds. This isn't a course you consume—it's a system you join. Your network becomes your net worth. Alumni become collaborators, co-founders, clients.",
    icon: Users,
    concern: "Going it alone?"
  },
  {
    question: "What if I fall behind the cohort?",
    answer: "The curriculum is modular—skip ahead, circle back. All sessions are recorded. You have lifetime access. We run cohorts quarterly, so you can always join the next live cycle. Progress beats perfection. Most 'behind' people are actually just processing deeper. The path is yours.",
    icon: TrendingUp,
    concern: "Fear of falling behind?"
  },
  {
    question: "Do you offer refunds?",
    answer: "14-day money-back guarantee. If you complete Module 00 and 01 and don't see the value, full refund. No questions. We only want serious builders who are ready to execute. If you're not ready to build, this isn't for you. If you are, you won't want a refund.",
    icon: Shield,
    concern: "Risk concerns?"
  },
  {
    question: "What happens after the 12 modules—how do I reach accelerator?",
    answer: "You graduate with a deployed system, a portfolio of AI-powered assets, and access to the alumni network. Many graduates become contributors, mentors, or launch their own products using our infrastructure. The accelerator track opens for projects showing traction. This is just the beginning of your journey.",
    icon: ArrowRight,
    concern: "What comes next?"
  },
  {
    question: "Will this actually help my career or is it just hype?",
    answer: "The builders who complete this program don't need jobs—they create them. But yes, companies are desperate for AI systems engineers. The skills here (agent orchestration, infrastructure automation, AI integration) command $150K-300K+ salaries. Or you build your own thing. Your choice. Either way, you win.",
    icon: TrendingUp,
    concern: "ROI doubts?"
  }
];

// Typewriter hook
const useTypewriter = (text: string, isActive: boolean, speed: number = 12) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isActive) {
      setDisplayedText('');
      setIsComplete(false);
      indexRef.current = 0;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      return;
    }

    const typeNext = () => {
      if (indexRef.current < text.length) {
        setDisplayedText(text.slice(0, indexRef.current + 1));
        indexRef.current++;
        timeoutRef.current = setTimeout(typeNext, speed);
      } else {
        setIsComplete(true);
      }
    };

    indexRef.current = 0;
    typeNext();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, isActive, speed]);

  return { displayedText, isComplete };
};

interface FAQCardProps {
  item: FAQItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

const FAQCard: React.FC<FAQCardProps> = ({ item, index, isOpen, onToggle }) => {
  const { displayedText, isComplete } = useTypewriter(item.answer, isOpen);
  const Icon = item.icon;

  return (
    <div
      className={`rounded-xl overflow-hidden border transition-all duration-300 ${
        isOpen 
          ? 'border-cyan-500/50 bg-cyan-500/5' 
          : 'border-white/10 bg-white/[0.02] hover:border-cyan-500/30'
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 flex items-center justify-between text-left group"
      >
        <div className="flex items-start gap-4">
          <span className="text-cyan-500/40 font-mono text-sm mt-1">{String(index + 1).padStart(2, '0')}</span>
          <div className="flex-1">
            <span className={`text-lg font-semibold block pr-8 transition-colors ${
              isOpen ? 'text-cyan-400' : 'text-white/80 group-hover:text-cyan-300'
            }`}>
              {item.question}
            </span>
            {!isOpen && (
              <span className="text-xs text-white/40 mt-1 block">
                {item.concern}
              </span>
            )}
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <ChevronDown className={`w-5 h-5 ${isOpen ? 'text-cyan-400' : 'text-cyan-500/60'}`} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2">
              <div className="pl-10 border-l-2 border-cyan-500/20">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10 shrink-0">
                    <Icon className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white/80 leading-relaxed font-mono text-sm">
                      {displayedText}
                      {!isComplete && (
                        <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse" />
                      )}
                    </p>
                    {isComplete && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-3 flex items-center gap-2 text-xs text-cyan-400/60"
                      >
                        <Terminal className="w-3 h-3" />
                        <span>Answer loaded. Ready for next query.</span>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
        >
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-bold text-cyan-400 uppercase tracking-widest">FAQ</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl font-bold text-white mb-4"
        >
          10 Questions About
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
            Your Progression
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl text-white/60 max-w-2xl mx-auto"
        >
          Honest answers. No marketing speak. Just the path from where you are to where you're going.
        </motion.p>
      </div>

      {/* FAQ List */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="space-y-4 max-w-4xl mx-auto"
      >
        {faqItems.map((item, idx) => (
          <FAQCard
            key={idx}
            item={item}
            index={idx}
            isOpen={openIndex === idx}
            onToggle={() => handleToggle(idx)}
          />
        ))}
      </motion.div>

      {/* Footer CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="text-center pt-8"
      >
        <p className="text-white/50 mb-4">Still have questions? The community has answers.</p>
        <button className="group px-6 py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-semibold hover:bg-cyan-500/20 transition-all duration-300">
          <span className="flex items-center gap-2">
            Join the Discord
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </button>
      </motion.div>
    </div>
  );
};

export default FAQSection;
