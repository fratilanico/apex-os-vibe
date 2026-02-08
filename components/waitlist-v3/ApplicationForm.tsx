import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { GradientButton } from '../ui/GradientButton';
import { GradientText } from '../ui/GradientText';
import { ArrowRight, Terminal } from 'lucide-react';
import { useOnboardingStore } from '../../stores/useOnboardingStore';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ApplicationFormProps {
  onSuccess: (data: {
    ai_score: number;
    referral_code: string;
    status: 'hot' | 'warm' | 'cold';
    rank: number;
  }) => void;
}

interface FormData {
  /* Step 1 */
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  goal: string;
  /* Step 1.5 - Profile Type */
  profileType: 'personal' | 'business' | '';
  /* Step 2 */
  company: string;
  role: string;
  industry: string;
  companySize: string;
  experience: string;
  fundingStatus: string;
  /* Step 3 */
  whyJoin: string;
  biggestChallenge: string;
  timeline: string;
  notes: string;
  consent: string;
}

const INITIAL_FORM: FormData = {
  name: '',
  email: '',
  phone: '',
  linkedin: '',
  goal: '',
  profileType: '',
  company: '',
  role: '',
  industry: '',
  companySize: '',
  experience: '',
  fundingStatus: '',
  whyJoin: '',
  biggestChallenge: '',
  timeline: '',
  notes: '',
  consent: '',
};

/* ------------------------------------------------------------------ */
/*  Select options                                                     */
/* ------------------------------------------------------------------ */

const INDUSTRY_OPTIONS = [
  'SaaS',
  'FinTech',
  'HealthTech',
  'EdTech',
  'eCommerce',
  'AI/ML',
  'Agency',
  'Other',
];

const COMPANY_SIZE_OPTIONS = [
  'Just me',
  '2-10',
  '10-50',
  '50-200',
  '200+',
];

const EXPERIENCE_OPTIONS = [
  'Less than 1 year',
  '1-3 years',
  '3-5 years',
  '5+ years',
];

const FUNDING_OPTIONS = [
  'Pre-seed',
  'Bootstrapped',
  'Seed',
  'Series A+',
];

const TIMELINE_OPTIONS = [
  'Immediately',
  '1 month',
  '3 months',
  '6 months',
];

/* ------------------------------------------------------------------ */
/*  Step metadata                                                      */
/* ------------------------------------------------------------------ */

const STEPS = [
  { label: 'Identity Node', accent: 'cyan' },
  { label: 'Segmentation Protocol', accent: 'violet' },
  { label: 'Mission Validation', accent: 'emerald' },
] as const;

/* ------------------------------------------------------------------ */
/*  Shared styles                                                      */
/* ------------------------------------------------------------------ */

const INPUT_CLS =
  'w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 ' +
  'text-white placeholder:text-white/30 font-sans text-base ' +
  'focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 ' +
  'transition-colors duration-200';

const SELECT_CLS = `${INPUT_CLS} appearance-none`;

// Data-URL for the custom select chevron
const CHEVRON_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.3)' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`;

const selectStyle: React.CSSProperties = {
  backgroundImage: CHEVRON_SVG,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 1rem center',
  backgroundSize: '1rem',
};

const TEXTAREA_CLS = `${INPUT_CLS} min-h-[120px] resize-none`;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ------------------------------------------------------------------ */
/*  Slide variants                                                     */
/* ------------------------------------------------------------------ */

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -50 : 50, opacity: 0 }),
};

/* ------------------------------------------------------------------ */
/*  Small sub-components                                               */
/* ------------------------------------------------------------------ */

const FieldError: React.FC<{ msg?: string }> = ({ msg }) =>
  msg ? <p className="text-red-400 text-xs mt-1">{msg}</p> : null;

const CharCounter: React.FC<{ length: number; min: number }> = ({
  length,
  min,
}) => (
  <p className={`text-xs mt-1 ${length >= min ? 'text-emerald-400' : 'text-white/30'}`}>
    {length}/{min} minimum
  </p>
);

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  onSuccess,
}) => {
  const { setMode } = useOnboardingStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  /* ---- helpers ---- */

  const set = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const value =
      e.target.type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
          ? 'yes'
          : ''
        : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    // clear field error on change
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  /* ---- validation per step ---- */

  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) errs.name = 'Name is required';
      if (!formData.email.trim()) errs.email = 'Email is required';
      else if (!EMAIL_RE.test(formData.email)) errs.email = 'Invalid email address';
      if (!formData.phone.trim()) errs.phone = 'Phone number is required';
      if (!formData.goal.trim()) errs.goal = 'Please describe your mission';
      else if (formData.goal.trim().length < 50)
        errs.goal = 'Minimum 50 characters required';
    }

    if (step === 2) {
      if (!formData.profileType) errs.profileType = 'Please select Personal or Business';
    }

    if (step === 3) {
      if (!formData.whyJoin.trim()) errs.whyJoin = 'This field is required';
      else if (formData.whyJoin.trim().length < 50)
        errs.whyJoin = 'Minimum 50 characters required';
      if (!formData.consent) errs.consent = 'You must agree to continue';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* ---- navigation ---- */

  const goNext = () => {
    if (!validateStep(currentStep)) return;
    setDirection(1);
    setCurrentStep((s) => Math.min(s + 1, 3));
  };

  const goBack = () => {
    setDirection(-1);
    setCurrentStep((s) => Math.max(s - 1, 1));
  };

  /* ---- submit ---- */

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/waitlist/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          mode: 'STANDARD',
          platform: 'waitlist-v3',
          version: '3.0_FORM',
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Submission failed');
      }

      const data = await res.json();
      onSuccess(data);
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ================================================================ */
  /*  Step renderers                                                   */
  /* ================================================================ */

  const renderStep1 = () => (
    <div className="space-y-5">
      {/* Name */}
      <div>
        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={set('name')}
          className={INPUT_CLS}
        />
        <FieldError msg={errors.name} />
      </div>

      {/* Email */}
      <div>
        <input
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={set('email')}
          className={INPUT_CLS}
        />
        <FieldError msg={errors.email} />
      </div>

      {/* Phone */}
      <div>
        <input
          type="tel"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={set('phone')}
          className={INPUT_CLS}
        />
        <FieldError msg={errors.phone} />
      </div>

      {/* LinkedIn */}
      <div>
        <input
          type="url"
          placeholder="LinkedIn Profile (optional)"
          value={formData.linkedin}
          onChange={set('linkedin')}
          className={INPUT_CLS}
        />
      </div>

      {/* Goal */}
      <div>
        <textarea
          placeholder="What is your primary 10-day build goal? Minimum 50 characters"
          value={formData.goal}
          onChange={set('goal')}
          className={TEXTAREA_CLS}
        />
        <CharCounter length={formData.goal.length} min={50} />
        <FieldError msg={errors.goal} />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-5">
      {/* Profile Type Toggle */}
      <div>
        <p className="text-sm text-white/50 mb-3 text-center">I am a:</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, profileType: 'personal' }))}
            className={`p-4 rounded-xl border-2 transition-all ${
              formData.profileType === 'personal'
                ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20'
            }`}
          >
            <div className="font-bold text-sm">Personal Builder</div>
            <div className="text-[10px] mt-1 opacity-70 uppercase tracking-wider">Individual Mastery</div>
          </button>
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, profileType: 'business' }))}
            className={`p-4 rounded-xl border-2 transition-all ${
              formData.profileType === 'business'
                ? 'border-violet-400 bg-violet-400/10 text-violet-400 shadow-[0_0_15px_rgba(167,139,250,0.2)]'
                : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20'
            }`}
          >
            <div className="font-bold text-sm">Business Architect</div>
            <div className="text-[10px] mt-1 opacity-70 uppercase tracking-wider">Enterprise Fleet</div>
          </button>
        </div>
        <FieldError msg={errors.profileType} />
      </div>

      {/* Conditional fields based on profileType */}
      {formData.profileType === 'business' && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-5 overflow-hidden">
          <div>
            <input
              type="text"
              placeholder="Company Name"
              value={formData.company}
              onChange={set('company')}
              className={INPUT_CLS}
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Your Role"
              value={formData.role}
              onChange={set('role')}
              className={INPUT_CLS}
            />
          </div>

          <div>
            <select
              value={formData.industry}
              onChange={set('industry')}
              className={SELECT_CLS}
              style={selectStyle}
            >
              <option value="" disabled>
                Industry
              </option>
              {INDUSTRY_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select
              value={formData.companySize}
              onChange={set('companySize')}
              className={SELECT_CLS}
              style={selectStyle}
            >
              <option value="" disabled>
                Company Size
              </option>
              {COMPANY_SIZE_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>

            <select
              value={formData.fundingStatus}
              onChange={set('fundingStatus')}
              className={SELECT_CLS}
              style={selectStyle}
            >
              <option value="" disabled>
                Funding Status
              </option>
              {FUNDING_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        </motion.div>
      )}

      {/* Experience (shown for both) */}
      {formData.profileType && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <select
            value={formData.experience}
            onChange={set('experience')}
            className={SELECT_CLS}
            style={selectStyle}
          >
            <option value="" disabled>
              Experience Level
            </option>
            {EXPERIENCE_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </motion.div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-5">
      {/* Why Join */}
      <div>
        <textarea
          placeholder="Why do you want to join the APEX swarm?"
          value={formData.whyJoin}
          onChange={set('whyJoin')}
          className={TEXTAREA_CLS}
        />
        <CharCounter length={formData.whyJoin.length} min={50} />
        <FieldError msg={errors.whyJoin} />
      </div>

      {/* Biggest Challenge */}
      <div>
        <textarea
          placeholder="What's your biggest challenge?"
          value={formData.biggestChallenge}
          onChange={set('biggestChallenge')}
          className={TEXTAREA_CLS}
        />
      </div>

      {/* Timeline */}
      <div>
        <select
          value={formData.timeline}
          onChange={set('timeline')}
          className={SELECT_CLS}
          style={selectStyle}
        >
          <option value="" disabled>
            When do you want to start?
          </option>
          {TIMELINE_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      {/* Consent */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={formData.consent === 'yes'}
            onChange={set('consent')}
            className="mt-1 accent-cyan-500"
          />
          <span className="text-sm text-white/60">
            I agree to the Terms and Data Processing protocol.
          </span>
        </label>
        <FieldError msg={errors.consent} />
      </div>
    </div>
  );

  const stepRenderers = [renderStep1, renderStep2, renderStep3];

  /* ================================================================ */
  /*  Progress indicator                                               */
  /* ================================================================ */

  const accentMap: Record<string, string> = {
    cyan: 'bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.6)]',
    violet: 'bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.6)]',
    emerald: 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)]',
  };

  const renderProgress = () => (
    <div className="flex flex-col items-center mb-12">
      <div className="flex items-center justify-center gap-0">
        {STEPS.map((step, i) => {
          const stepNum = i + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;

          let dotCls = 'w-4 h-4 rounded-full transition-all duration-300 ';
          if (isActive) dotCls += accentMap[step.accent];
          else if (isCompleted) dotCls += 'bg-emerald-500';
          else dotCls += 'bg-white/20';

          return (
            <React.Fragment key={stepNum}>
              {i > 0 && (
                <div
                  className={`h-0.5 w-16 transition-colors duration-300 ${
                    isCompleted || isActive ? 'bg-emerald-500' : 'bg-white/10'
                  }`}
                />
              )}
              <div className="flex flex-col items-center">
                <div className={dotCls} />
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Labels */}
      <div className="flex items-center justify-center mt-3 gap-0">
        {STEPS.map((step, i) => (
          <React.Fragment key={step.label}>
            {i > 0 && <div className="w-16" />}
            <span className="text-xs text-white/40 whitespace-nowrap text-center min-w-[4rem]">
              {step.label}
            </span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  /* ================================================================ */
  /*  Navigation buttons                                               */
  /* ================================================================ */

  const renderNav = () => (
    <div className="flex justify-between items-center mt-8">
      {currentStep > 1 ? (
        <button
          type="button"
          onClick={goBack}
          className="text-white/40 hover:text-white transition-colors text-sm font-mono uppercase tracking-widest"
        >
          &larr; Back
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setMode('GEEK')}
          className="flex items-center gap-2 text-cyan-400/60 hover:text-cyan-400 transition-colors text-[10px] font-mono uppercase tracking-widest border border-cyan-400/20 px-3 py-1 rounded-lg bg-cyan-400/5"
        >
          <Terminal className="w-3 h-3" /> Geek Mode
        </button>
      )}

      {currentStep < 3 ? (
        <GradientButton onClick={goNext} icon={<ArrowRight className="w-4 h-4" />}>
          Continue
        </GradientButton>
      ) : (
        <GradientButton
          type="submit"
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Synchronizing...' : 'Secure Access'}
        </GradientButton>
      )}
    </div>
  );

  /* ================================================================ */
  /*  Main render                                                      */
  /* ================================================================ */

  return (
    <section id="apply" className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          <GradientText from="cyan-400" to="emerald-400">
            Initiate Neural Handshake
          </GradientText>
        </h2>

        {/* Subtitle */}
        <p className="text-white/50 text-center mb-12 max-w-xl mx-auto">
          Secure your mission profile to get your AI Readiness Score and secure your
          position in the swarm.
        </p>

        {/* Progress */}
        {renderProgress()}

        {/* Form card */}
        <GlassCard className="p-8 max-w-2xl mx-auto" hover={false}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {stepRenderers[currentStep - 1]?.()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {renderNav()}

          {/* Submit error */}
          {submitError && (
            <p className="text-red-400 text-sm text-center mt-4 font-mono">
              [!] {submitError}
            </p>
          )}
        </GlassCard>
      </motion.div>
    </section>
  );
};
