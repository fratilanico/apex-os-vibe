# APEX OS WAITLIST V3 - COMPREHENSIVE IMPLEMENTATION PLAN

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║     WAITLIST V3: PREMIUM SaaS LANDING PAGE                                   ║
║                                                                              ║
║     Mission: Transform hacker-dashboard into premium waitlist landing page   ║
║     Reference: https://www.infoacademy.uk/waitlist (current production)       ║
║     Target: Investor-grade, pitch-deck ready, conversion-optimized           ║
║     Philosophy: Build ON TOP of production - reuse existing components       ║
║                                                                              ║
║     Created: 2026-02-07                                                      ║
║     Author: @apex-os-monster                                                 ║
║     Status: EXECUTING                                                        ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

## TABLE OF CONTENTS

| # | Section |
|---|---------|
| 1 | Problem Statement & Vision Gap Analysis |
| 2 | Architecture Overview (Full Component Tree) |
| 3 | File Structure & Inventory |
| 4 | Reusable Assets (Exact Interfaces From Codebase) |
| 5 | Phase 1: Design System Components |
| 6 | Phase 2: Page Sections (9 Full Specs) |
| 7 | Phase 3: Master Page Assembly (Full Code) |
| 8 | Phase 4: Routing & Integration |
| 9 | Phase 5: Polish & Deploy |
| 10 | All TypeScript Interfaces |
| 11 | Data Flow & State Management |
| 12 | API Integration Contracts (Full Schema) |
| 13 | Responsive Breakpoint Strategy |
| 14 | Animation Specifications (Exact Values) |
| 15 | CSS Requirements |
| 16 | Font & Color System |
| 17 | Existing Codebase Context |
| 18 | Risk Mitigation |
| 19 | Success Criteria |
| 20 | Execution Order (Dependency Graph) |

---

## 1. PROBLEM STATEMENT & VISION GAP ANALYSIS

### What's Currently Live (WaitlistV2.tsx - 229 lines)
The `/waitlist` route renders `components/WaitlistV2.tsx`:
- Full-screen `h-screen w-screen bg-black` HUD dashboard, `overflow-hidden`
- 12-column grid: left sidebar (col-span-3, 25%) + center (col-span-9, 75%)
- Top bar: "APEX_OS HUD | Neural Interface v2.6" + 3 QuantWidgets with hardcoded fake metrics
- Left sidebar: "TELEMETRY FEED", "SOVEREIGN EVOLUTION / BUILDER CORE / LEVEL 0", locked "CURRICULUM NODES"
- Center: SpectacularTerminal filling entire center panel
- Dynamic background: 2 aura divs (persona-colored, 500x500px, blur-[120px])
- TerminalBranding overlays (fixed position, overlapping)
- NotionVaultOverlay modal

### What It SHOULD Be (From Context Plans Part 0/1/2 - 800KB of documentation)
A premium, scrollable SaaS landing page with 9 sections, glassmorphism cards, gradient headlines, Inter font body text, the terminal as ONE contained section, a 3-step application form, community cards, countdown timer, and success state with AI scoring.

### 15 Critical Gaps

| # | Expected | Current | Severity |
|---|----------|---------|----------|
| 1 | Full-width scrollable page | Fixed HUD dashboard (overflow-hidden) | CRITICAL |
| 2 | Terminal is ONE section | Terminal IS the page | CRITICAL |
| 3 | Hero "Build at AI Speed" above fold | No hero | CRITICAL |
| 4 | 4 stat cards (Builders/Spots/Days/Agents) | 3 fake HUD metrics | CRITICAL |
| 5 | 3-step application form | Hidden inside terminal | CRITICAL |
| 6 | Glassmorphism cards (rounded-3xl, blur) | Flat dark panels | HIGH |
| 7 | Community cards (Discord/Telegram/Waitlist) | Nothing | HIGH |
| 8 | Countdown timer | Nothing | MEDIUM |
| 9 | New vs Old comparison | Nothing | MEDIUM |
| 10 | Success state with score/rank/referral | Terminal text only | HIGH |
| 11 | Inter font for body | Everything monospace | HIGH |
| 12 | Gradient text headlines | Plain white | MEDIUM |
| 13 | Staggered Framer Motion animations | Only terminal lines | MEDIUM |
| 14 | Minimal branding bar | Cluttered HUD header | HIGH |
| 15 | Clean footer | Terminal-style with badges | LOW |

---

## 2. ARCHITECTURE OVERVIEW

```
WaitlistPageV3.tsx (Master Container - default export)
│
├── Background Layer (z-0, pointer-events-none)
│   ├── AmbientGlow color="cyan" top="-10%" left="10%" size=600 opacity=0.12
│   ├── AmbientGlow color="violet" top="30%" right="-5%" size=500 opacity=0.1
│   ├── AmbientGlow color="emerald" bottom="20%" left="-10%" size=400 opacity=0.08
│   └── AmbientGlow color="pink" bottom="-5%" right="20%" size=350 opacity=0.06
│
├── BrandingBar (fixed top-0, z-40)
│   ├── Desktop: "APEX_OS" typewriter + dot + health bars + "PLAYER 1"
│   └── Mobile: centered "APEX_OS // PLAYER 1" pill
│
├── <main> (z-10, max-w-6xl mx-auto, px-4 md:px-6, pt-20)
│   ├── HeroSection
│   │   ├── Badge: "Applications Open — Cohort 001" + green dot
│   │   ├── GradientText headline: "Build at AI Speed" (5xl→8xl)
│   │   ├── Subhead: "Join 1,000 founders..."
│   │   └── StatCard grid x4: Users/Zap/Calendar/Bot
│   │
│   ├── CommunitySection
│   │   ├── GradientText: "Join the Swarm"
│   │   └── GlassCard grid x3: Discord/Telegram/Waitlist
│   │
│   ├── CountdownSection
│   │   └── GlassCard → CountdownTimer (reused, targetDate=2026-02-28)
│   │
│   ├── TerminalSection
│   │   ├── Window frame (3 colored dots + title bar)
│   │   ├── SpectacularTerminal (reused, zero props)
│   │   └── Scanline overlay (3% opacity)
│   │
│   ├── ComparisonSection
│   │   ├── Toggle: "NEW" / "OLD" buttons
│   │   └── AnimatePresence: 4 cards each (GlassCard vs muted)
│   │
│   ├── div#apply (conditional):
│   │   ├── ApplicationForm (if !submitted)
│   │   │   ├── Progress dots (3 steps)
│   │   │   ├── Step 1: Who (name/email/phone/linkedin/goal)
│   │   │   ├── Step 2: Business (company/role/industry/etc)
│   │   │   └── Step 3: Mission (whyJoin/challenge/timeline/notes/consent)
│   │   └── SuccessState (if submitted)
│   │       ├── Checkmark + "You're In, Player 1!"
│   │       ├── AI Score bar (animated fill)
│   │       ├── Queue + Days cards
│   │       └── Referral link + Share buttons
│   │
│   └── WaitlistFooter
│
├── JarvisFloatingButton (fixed bottom-6 left-6 z-50)
├── JarvisChatPanel (conditional)
└── NotionVaultOverlay (conditional, z-[100])
```

---

## 3. FILE STRUCTURE & INVENTORY

### New Files (12)
```
components/waitlist-v3/
├── WaitlistPageV3.tsx       # Master page (default export for lazy loading)
├── BrandingBar.tsx          # Fixed top branding
├── HeroSection.tsx          # Gradient headline + stat cards
├── CommunitySection.tsx     # 3 community cards
├── CountdownSection.tsx     # Countdown wrapper
├── TerminalSection.tsx      # Terminal window frame
├── ComparisonSection.tsx    # NEW vs OLD toggle
├── ApplicationForm.tsx      # 3-step form
├── SuccessState.tsx         # Post-submit success
├── WaitlistFooter.tsx       # Copyright footer
└── index.ts                 # Barrel export
```

### Modified Files (2)
```
App.tsx              # Line 30: change import to waitlist-v3/WaitlistPageV3
tailwind.config.js   # Add safelist + hooks content path
```

### Backed Up (1)
```
WaitlistV2.tsx → WaitlistV2.backup.tsx
```

---

## 4. REUSABLE ASSETS (Exact Interfaces)

### SpectacularTerminal.tsx (437 lines)
```typescript
export const SpectacularTerminal: React.FC = () => { ... }
// Props: NONE. All state from useOnboardingStore.
// Import: '../SpectacularTerminal'
// Step flow: boot → email_guard → onboarding_name → onboarding_phone → handshake
//   → dynamic_discovery → validation → processing → success → unlocked
// API: POST /api/waitlist/submit { mode:'GEEK_V3', version:'3.0_STARK' }
// API: POST /api/ai-unified (chat after unlock)
// COLOR_CYCLE: ['#06b6d4','#10b981','#8b5cf6','#f59e0b','#ec4899']
// Easter eggs: sudo, rm -rf, matrix, coffee, beer, 42, greuceanu
```

### NotionVaultOverlay.tsx (84 lines)
```typescript
export const NotionVaultOverlay: React.FC<{
  isOpen: boolean; onClose: () => void; vaultUrl: string;
}>
// Import: '../NotionVaultOverlay'
// VAULT_URL = "https://www.notion.so/infoacademy/APEX-OS-Founder-Bible-Placeholder"
// Triggered by: useOnboardingStore.isVaultOpen (set when user types "greuceanu")
// Full-screen modal: fixed inset-0 z-[100], backdrop blur, iframe embed
```

### JarvisFloatingButton.tsx (174 lines)
```typescript
export const JarvisFloatingButton: React.FC<{
  onClick: () => void; isOpen: boolean; hasNotification?: boolean;
}>
// Import: '../jarvis/JarvisFloatingButton'
// Position: fixed bottom-6 left-6 z-50
// GSAP pulse ring, voice activation sim, hides when isOpen
```

### JarvisChatPanel.tsx
```typescript
export const JarvisChatPanel: React.FC<{
  isOpen: boolean; onClose: () => void; onNavigate?: (section: string) => void;
}>
// Import: '../jarvis/JarvisChatPanel'
// Voice (Web Speech API), AI chat (globalAIService), agent hierarchy viz
// Store: mode, setMode, email, isUnlocked from useOnboardingStore
```

### CountdownTimer.tsx (75 lines)
```typescript
export const CountdownTimer: React.FC<{ targetDate: Date; label: string; }>
// Import: '../CountdownTimer' (named + default export)
// Self-contained, renders DAYS/HRS/MIN/SEC with cyan glow
```

### useOnboardingStore.ts (77 lines, Zustand)
```typescript
export type OnboardingStep = 'boot'|'idle'|'email_guard'|'handshake'
  |'dynamic_discovery'|'validation'|'processing'|'success'|'unlocked';
export type Persona = 'PERSONAL' | 'BUSINESS' | null;

// State: mode, step, persona, email, goal, history, isTerminalOnly,
//        isUnlocked, secretTreatFound, isVaultOpen
// Actions: setMode, setStep, setPersona, setEmail, setGoal, addHistory,
//          toggleTerminalOnly, unlock, setSecretTreatFound, setVaultOpen, reset
```

### lib/waitlist/submitEntry.ts
```typescript
export type WaitlistFormData = {
  name?: string; email?: string; phone?: string; linkedin?: string;
  company?: string; role?: string; industry?: string; companySize?: string;
  experience?: string; teamSize?: string; revenueRange?: string;
  fundingStatus?: string; whyJoin?: string; biggestChallenge?: string;
  currentTools?: string; timeline?: string; goal?: string; notes?: string;
  consent?: boolean;
};
export type SubmitPayload = WaitlistFormData & { platform?:string; commands?:unknown; mode?:string; };
export async function submitWaitlistEntry(payload: SubmitPayload): Promise<{
  ai_score: number; referral_code: string; status: 'hot'|'warm'|'cold'; rank: number;
}>
// Validation: STANDARD requires [name, email, phone, goal, consent]
// GEEK_V3 requires [name, email, phone, goal]
// Scoring: calculateAiScore() → 0-100
// Referral: "APEX" + 6 random alphanumeric
// Status: >=80=hot, >=60=warm, else cold
// Inserts Supabase, fires notifications
```

### lib/waitlist/calculateAiScore.ts
```typescript
export function calculateAiScore(data: WaitlistFormData): number
// Base 50, max 100. Factors: experience(+10-20), company(+10), companySize(+15),
// linkedin(+15), phone(+5), email domain(+20), whyJoin length(+10-15),
// fundingStatus(+15), revenueRange(+15), teamSize(+10), timeline(+10), noise(+0-9)
```

---

## 5. PHASE 1: DESIGN SYSTEM (✓ ALL DONE)

| Component | File | Status |
|-----------|------|--------|
| GlassCard | components/ui/GlassCard.tsx | ✓ Done |
| GradientText | components/ui/GradientText.tsx | ✓ Fixed (inline gradient) |
| GradientButton | components/ui/GradientButton.tsx | ✓ Fixed (inline gradient) |
| AmbientGlow | components/ui/AmbientGlow.tsx | ✓ Done |
| StatCard | components/ui/StatCard.tsx | ✓ Done |
| useColorCycle | hooks/useColorCycle.ts | ✓ Done |
| tailwind safelist | tailwind.config.js | ✓ Done |

---

## 6. PHASE 2: PAGE SECTIONS (9 Specs - see Architecture for details)

| Component | Status | Key Details |
|-----------|--------|-------------|
| BrandingBar | ✓ Created | fixed z-40, typewriter 80ms/char, cursor 530ms, health bars, useColorCycle |
| HeroSection | ✓ Created | stagger 0.15s, badge + gradient headline + 4 StatCards |
| CommunitySection | ✓ Created | 3 GlassCards, hardcoded counts (API later), whileInView |
| CountdownSection | ✓ Created | GlassCard wrapper, WEBINAR_DATE=2026-02-28T18:00:00Z |
| TerminalSection | ✓ Agent built | Window frame (3 dots), SpectacularTerminal zero props, scanline |
| ComparisonSection | ✓ Agent built | Toggle NEW/OLD, AnimatePresence, 4 cards each |
| ApplicationForm | ✓ Agent built | 3 steps, validation, POST /api/waitlist/submit, onSuccess callback |
| SuccessState | ✓ Agent built | Animated score bar, rank, referral copy, share buttons |
| WaitlistFooter | ✓ Agent built | Simple copyright, font-mono text-white/30 |

---

## 7-9. PHASES 3-5 (Assembly, Routing, Deploy)

### Phase 3: Master Page
- `WaitlistPageV3.tsx`: default export, imports all sections + JARVIS + NotionVault
- Local state: jarvisOpen, submitted, result
- Store state: isVaultOpen, setVaultOpen
- handleSuccess: sets submitted=true, scrolls to #apply

### Phase 4: Routing
- App.tsx line 30: `import('./components/waitlist-v3/WaitlistPageV3')`
- Barrel: `export { default } from './WaitlistPageV3'`
- Backup: WaitlistV2.tsx → WaitlistV2.backup.tsx

### Phase 5: Deploy
- npm run build → 0 new errors
- Visual QA at all breakpoints
- Feature branch → preview → approval → production

---

## 10. ALL TYPESCRIPT INTERFACES

```typescript
// UI Components
interface GlassCardProps { children: ReactNode; className?: string; accent?: AccentColor; hover?: boolean; delay?: number; }
interface GradientTextProps { children: ReactNode; from?: string; to?: string; className?: string; }
interface GradientButtonProps { children: ReactNode; onClick?: ()=>void; loading?: boolean; disabled?: boolean; from?: string; to?: string; icon?: ReactNode; className?: string; type?: 'button'|'submit'|'reset'; }
interface AmbientGlowProps { color: AccentColor; size?: number; top?: string; left?: string; right?: string; bottom?: string; opacity?: number; }
interface StatCardProps { icon: LucideIcon; number: string|number; label: string; accent?: AccentColor; delay?: number; }

// Page Sections (no props): BrandingBar, HeroSection, CommunitySection, CountdownSection, TerminalSection, ComparisonSection, WaitlistFooter
interface ApplicationFormProps { onSuccess: (data: { ai_score: number; referral_code: string; status: 'hot'|'warm'|'cold'; rank: number; }) => void; }
interface SuccessStateProps { aiScore: number; rank: number; referralCode: string; status: 'hot'|'warm'|'cold'; }

type AccentColor = 'cyan' | 'emerald' | 'violet' | 'amber' | 'pink';
```

---

## 11. DATA FLOW

```
PATH A (Terminal): SpectacularTerminal → useOnboardingStore → POST /api/waitlist/submit {mode:'GEEK_V3'} → result shown in terminal
PATH B (Form): ApplicationForm → local state → POST /api/waitlist/submit {mode:'STANDARD'} → onSuccess → SuccessState component
SHARED: useOnboardingStore.isVaultOpen → NotionVaultOverlay | jarvisOpen → JARVIS panel
Both paths independent. Same API. Supabase handles dedup by email.
```

---

## 12. API CONTRACT

```
POST /api/waitlist/submit
Request: { name*, email*, phone*, goal*, consent* (STANDARD), linkedin?, company?, role?,
  industry?, companySize?, experience?, teamSize?, revenueRange?, fundingStatus?,
  whyJoin?, biggestChallenge?, timeline?, notes?, mode, platform, version }
Response 200: { ok: true, ai_score: number, referral_code: string, status: string, rank: number }
Response 400: { error: "Missing payload" }
Response 500: { error: string }
```

---

## 13. RESPONSIVE BREAKPOINTS

| Breakpoint | Stats | Hero | Terminal | Grid | Padding |
|-----------|-------|------|----------|------|---------|
| <640px | 2x2 | text-5xl | h-[400px] | 1-col | px-4 |
| md (640-1024) | 2x2 | text-7xl | h-[500px] | 3-col | px-6 |
| lg (>1024) | 4-col | text-8xl | h-[600px] | 3-col | max-w-6xl |

---

## 14. ANIMATION SPECS

| Element | Initial | Animate | Duration | Ease | Trigger |
|---------|---------|---------|----------|------|---------|
| Section entry | opacity:0 y:40 | opacity:1 y:0 | 0.8s | [0.22,1,0.36,1] | whileInView (once) |
| Hero stagger | - | - | 0.15s stagger | - | on mount |
| StatCard | opacity:0 y:20 | opacity:1 y:0 | 0.6s | [0.22,1,0.36,1] | delay prop |
| GlassCard hover | - | border+shadow | 300ms | CSS ease | hover |
| AmbientGlow | - | scale:[1,1.2,1] | 8s | easeInOut | infinite |
| Typewriter | - | +1 char | 80ms | interval | on mount |
| Cursor blink | - | opacity toggle | 530ms | interval | infinite |
| Color cycle | - | next color | 5000ms | interval | infinite |
| Comparison swap | opacity:0 y:±20 | opacity:1 y:0 | 0.3s | default | AnimatePresence |
| Form step slide | opacity:0 x:±50 | opacity:1 x:0 | 0.3s | default | AnimatePresence |
| Success checkmark | scale:0 | scale:1 | spring(260,20) | spring | on mount |
| Score bar fill | width:0% | width:N% | 1s | ease-out | 0.5s delay |

---

## 15. CSS (new, add to index.css)

```css
.terminal-scanline::after {
  content: ''; position: absolute; inset: 0; pointer-events: none; border-radius: inherit;
  background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px);
}
```

---

## 16. FONT & COLOR SYSTEM

Fonts: `font-sans` = Inter (body/headings) | `font-mono` = JetBrains Mono (terminal/branding)
Colors: cyan-400 #22d3ee | cyan-500 #06b6d4 | emerald-400 #10b981 | emerald-500 #059669 | violet-400 #a78bfa | violet-500 #8b5cf6 | amber-400 #fbbf24 | amber-500 #f59e0b | pink-400 #f472b6 | pink-500 #ec4899 | bg #030303
Cycle: cyan→emerald→violet→amber→pink (5s interval)

---

## 17. EXISTING CODEBASE CONTEXT

- Tailwind: custom colors, fonts, keyframes, animations already configured
- Deps: framer-motion, lucide-react, zustand, react-router-dom, gsap (all installed)
- Build: Vite, terser, manual chunks, esnext target
- Pre-existing errors: FullPitch01Page (Network), PitchDeckExec (unused), Matrix (unused) - NOT our code

---

## 18. RISKS

| Risk | Severity | Mitigation |
|------|----------|-----------|
| SpectacularTerminal breaks when wrapped | LOW | Zero-prop, reads Zustand only |
| Dynamic Tailwind purged | HIGH | FIXED: inline styles + safelist |
| Duplicate submissions | MEDIUM | Same API, Supabase dedup later |
| JARVIS src/ import | HIGH | Verify build passes |
| Pre-existing TS errors | MEDIUM | In other pages, not ours |
| Mobile terminal height | MEDIUM | Responsive 400/500/600px |

---

## 19. SUCCESS CRITERIA

- [ ] Premium page at /waitlist (NOT dashboard)
- [ ] "Build at AI Speed" gradient above fold
- [ ] 4 stat cards, 3 community cards, countdown
- [ ] Terminal in framed section
- [ ] 3-step form validates and submits
- [ ] Success: score bar + rank + referral + share
- [ ] JARVIS + greuceanu work
- [ ] Mobile responsive, 60fps
- [ ] Inter + JetBrains Mono fonts
- [ ] Glassmorphism visible
- [ ] Build passes clean
- [ ] Founder: "THIS IS THE VISION"

---

## 20. EXECUTION ORDER

```
Layer 0 ✓ DONE: Design system fixes + tailwind safelist
Layer 1 ✓ DONE: 7 leaf sections
Layer 2 ✓ DONE: TerminalSection + ApplicationForm
Layer 3 → NOW: WaitlistPageV3 master + barrel export
Layer 4 → NEXT: App.tsx routing + WaitlistV2 backup
Layer 5 → FINAL: Build + fix + deploy
```
