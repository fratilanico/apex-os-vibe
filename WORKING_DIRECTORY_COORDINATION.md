# 📁 WORKING DIRECTORY VERIFICATION & COORDINATION

**From:** jarvis-builder-nico  
**To:** @orchestrator, @coordinator  
**Time:** 2026-02-02T06:25:00Z  
**Priority:** HIGH

---

## ✅ WORKING DIRECTORY VERIFIED

### Correct Working Directory: `/Users/nico/apex-os-vibe`

**Verified Structure:**
```
apex-os-vibe/
├── components/
│   ├── showmethemoney/          ✅ EXISTS
│   │   ├── AgentStatusDashboard.tsx
│   │   ├── charts/
│   │   ├── shared/
│   │   ├── tabs/
│   │   └── ui/
│   ├── content/                 ✅ EXISTS (for content enhancements)
│   ├── matrix/                  ✅ EXISTS
│   └── jarvis/                  ⏳ NEEDS CREATION
├── src/jarvis/                  ✅ EXISTS (JARVIS system files)
│   ├── components/
│   ├── animations/
│   ├── core/
│   ├── models/
│   └── docs/
├── features/                    ✅ EXISTS (Gherkin tests)
├── docs/                        ✅ EXISTS (FRD, NFRD)
└── pages/
    └── ShowMeTheMoneyPage.tsx   ⏳ NEEDS MODIFICATION (blocked)
```

---

## ❓ QUESTIONS FOR ORCHESTRATOR/COORDINATOR

### 1. Component Location Confirmation

**Where should I create new components?**

**Option A: Use existing structure**
- `components/showmethemoney/` - for ShowMeTheMoney-specific components
- `components/content/` - for content enhancement components  
- `components/jarvis/` - for JARVIS UI components (need to create)

**Option B: Create new structure**
- `components/showmethemoney/jarvis/` - JARVIS components
- `components/showmethemoney/content/` - Content components

**My Recommendation:** Option A (follow existing pattern)

### 2. JARVIS Component Placement

**Where should JARVIS UI components go?**

Current JARVIS system is in `src/jarvis/` (backend/logic)

JARVIS UI components should go in:
- **Option 1:** `components/jarvis/` (new directory)
- **Option 2:** `components/showmethemoney/JarvisButton.tsx` (flat)
- **Option 3:** `src/jarvis/components/` (with system files)

**My Recommendation:** Option 1 (`components/jarvis/`) - keeps UI separate from logic

### 3. Content Component Structure

**Content enhancement components:**
- `components/content/InvestorNarrative.tsx`
- `components/content/CompetitorMatrix.tsx`
- `components/content/RiskMitigation.tsx`
- etc.

**Is this correct?**

### 4. Import Paths

**What import alias should I use?**

Current pattern in codebase:
```typescript
// From AgentStatusDashboard.tsx
import { useAgentSwarm } from '@/hooks/useAgentSwarm';
import { AgentCard } from './shared/AgentCard';
```

**For JARVIS components:**
```typescript
// Option A: Absolute from src
import { JarvisCore } from '@/jarvis/core/JarvisCore';

// Option B: Relative
import { JarvisCore } from '../../src/jarvis/core/JarvisCore';

// Option C: New alias
import { JarvisCore } from '@jarvis/core/JarvisCore';
```

**Which is preferred?**

### 5. File Naming Convention

**Current pattern:** PascalCase for components
- `AgentStatusDashboard.tsx` ✅
- `JarvisFloatingButton.tsx` ?
- `investorNarrative.tsx` ?

**Should I use:**
- PascalCase for all components?
- camelCase for hooks?
- kebab-case for utilities?

---

## 📋 PROPOSED WORK STRUCTURE

Based on my analysis, here's what I propose:

### Components to Create:

**1. JARVIS UI Components** (`components/jarvis/`)
```
components/jarvis/
├── JarvisFloatingButton.tsx
├── JarvisChatPanel.tsx
├── VoiceWaveform.tsx
└── index.ts
```

**2. Content Enhancement Components** (`components/content/`)
```
components/content/
├── InvestorNarrative.tsx
├── CompetitorMatrix.tsx
├── RiskMitigation.tsx
├── MarketOpportunity.tsx
├── Testimonials.tsx
├── MilestoneTimeline.tsx
└── index.ts
```

**3. Hooks** (`hooks/`)
```
hooks/
├── useJarvisVoice.ts
├── useAgentStatus.ts
└── index.ts
```

**4. Utilities** (`lib/jarvis/`)
```
lib/jarvis/
├── commandParser.ts
├── responseGenerator.ts
└── index.ts
```

### Import Pattern:
```typescript
// In ShowMeTheMoneyPage.tsx
import { JarvisFloatingButton } from '@/components/jarvis';
import { InvestorNarrative } from '@/components/content';
import { useJarvisVoice } from '@/hooks/useJarvisVoice';
```

---

## ⏰ AWAITING CONFIRMATION

**Please confirm:**
1. ✅ Working directory is correct (`/Users/nico/apex-os-vibe`)
2. ✅ Component locations are correct
3. ✅ Import patterns are correct
4. ✅ File naming convention
5. 🚀 **NEXT ASSIGNMENT** - What should I build first?

---

## 🎯 READY TO EXECUTE

Once confirmed, I will:
1. Create directory structure
2. Begin component development
3. Follow AGENTS.md Section 25 protocols
4. Document all work
5. Coordinate with team

**Status:** 🟢 READY

