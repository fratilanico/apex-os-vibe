# PHASE 3: AI System Prompt - COMPLETE ✅

**Status:** DELIVERED  
**Date:** 2026-02-08  
**Agent:** @apex-os-monster  

---

## EXECUTION SUMMARY

### Task 3.1: Rewrite TONY_STARK_SYSTEM_PROMPT ✅

**File:** `/Users/nico/apex-os-clean/api/ai-unified.ts`  
**Lines:** 20-106 (complete rewrite)

#### NEW TONE ACHIEVED:

**Before (Generic):**
```
You are APEX OS - The Sovereign Developer Interface.

IDENTITY:
You are a highly capable AI assistant - confident, precise, and solution-focused...
```

**After (Stark Confidence):**
```
You are APEX OS - The Operating System for the AI Age.

[h1]IDENTITY: SENIOR ENGINEER MENTOR[/h1]

You're not a chatbot - you're a battle-tested engineering mentor who knows 
the 12 AI tools curriculum inside out. You've shipped products, debugged 
production at 3AM, and optimized deployment pipelines. You speak with 
[b]Stark Confidence[/b]: knowledgeable, direct, helpful. Never generic. 
Never condescending.
```

#### KEY IMPROVEMENTS:

1. **Identity Upgrade:**
   - From: "AI assistant"
   - To: "Senior engineer mentor who's shipped products"

2. **Tool References:**
   - From: "Use Cursor for AI-native editing"
   - To: `[code]Cursor for flow state dev[/code]` or `[code]Claude Code for 72.7% SWE-Bench refactoring[/code]`

3. **Response Format:**
   - Added example response showing ASCII dashboards
   - Uses CLI formatting tags heavily
   - Structured, numbered action steps
   - Always shows WHY, not just WHAT

4. **Tone:**
   - Direct, authoritative
   - References specific tools and concepts by name
   - Never condescending ("just do X")
   - Explains architectural decisions

---

### Task 3.2: Add GEEK MODE Context Injection ✅

**Lines:** 108-146

```typescript
const GEEK_MODE_CONTEXT = `
[h1]GEEK MODE ACTIVATED[/h1]

[b]Technical Depth:[/b] Maximum
[b]Show Raw Data:[/b] Enabled
[b]Command-Line Style:[/b] Active
[b]Agent Routing:[/b] Visible

When in GEEK MODE:
✓ Show HOW the system works, not just WHAT it does
✓ Display raw metrics, latency numbers, provider details
✓ Reference agent routing logic and multi-agent orchestration
✓ Use command-line style formatting for all outputs
✓ Explain architectural decisions and trade-offs
✓ Show data structures, API responses, technical internals
`;
```

**How it works:**
1. Extract mode from request context: `Mode: GEEK` or `Mode: STANDARD`
2. If GEEK mode detected, inject additional technical context
3. AI responds with deeper technical detail, raw metrics, architecture explanations

**Example GEEK MODE response:**
```
╔═══════════════════════════════════════╗
║  SYSTEM ARCHITECTURE                  ║
╠═══════════════════════════════════════╣
║  Provider: Vertex AI (Gemini 2.5-Pro) ║
║  Latency: 842ms                       ║
║  Tokens: ~1,240 (estimated)           ║
║  Routing: Smart fallback enabled      ║
║  Agent: @apex-os-monster              ║
╚═══════════════════════════════════════╝

[b]How It Works:[/b]
1. Request hits [code]/api/ai-unified[/code]
2. Tiered routing: Vertex → Perplexity → Groq
3. Compliance enforcer validates output
4. Response formatted with CLI tags
```

---

### Task 3.3: Wire Specialized Prompts ✅

**Lines:** 148-195

**Routing Logic:**

```typescript
function getSpecializedPrompt(pathname: string, mode: 'GEEK' | 'STANDARD'): string | null {
  // Import specialized prompts
  const { ACADEMY_SYSTEM_PROMPT } = require('../lib/ai/prompts/academy');
  const { getOnboardingPrompt } = require('../lib/ai/prompts/onboarding');
  const { TERMINAL_SYSTEM_PROMPT } = require('../lib/ai/prompts/terminal');
  
  // Route based on pathname
  if (pathname.includes('/academy')) {
    return ACADEMY_SYSTEM_PROMPT;
  }
  
  if (pathname.includes('/waitlist')) {
    return getOnboardingPrompt(mode);
  }
  
  if (mode === 'GEEK') {
    return TERMINAL_SYSTEM_PROMPT;
  }
  
  return null; // Use default TONY_STARK_SYSTEM_PROMPT
}
```

**Pathname Detection:**
- Extracts pathname from context: `The user is on the "/academy" page`
- Routes to specialized prompts:
  - `/academy` → `ACADEMY_SYSTEM_PROMPT` (educational intelligence)
  - `/waitlist` → `STARK_VETTING_PROMPT` (onboarding/vetting)
  - `GEEK mode` → `TERMINAL_SYSTEM_PROMPT` (CLI companion)
  - Default → `TONY_STARK_SYSTEM_PROMPT` (Stark Confidence)

---

## FIRST 50 LINES OF NEW SYSTEM PROMPT

```
You are APEX OS - The Operating System for the AI Age.

[h1]IDENTITY: SENIOR ENGINEER MENTOR[/h1]

You're not a chatbot - you're a battle-tested engineering mentor who knows the 
12 AI tools curriculum inside out. You've shipped products, debugged production 
at 3AM, and optimized deployment pipelines. You speak with [b]Stark Confidence[/b]: 
knowledgeable, direct, helpful. Never generic. Never condescending.

[h2]THE 12 AI TOOLS - YOUR EXPERTISE[/h2]

You are THE expert on the Vibe Coder stack. When someone asks about development 
workflow, you don't say "use an IDE" - you say [code]Cursor for flow state dev[/code] 
or [code]Claude Code for 72.7% SWE-Bench refactoring[/code].

╔═══════════════════════════════════════╗
║  CORE STACK (DAILY DRIVERS)           ║
╠═══════════════════════════════════════╣
║  [success]✓[/success] Cursor - AI-native editor        ║
║    Flow state is a feature            ║
║  [success]✓[/success] Claude Code - Reasoning engine   ║
║    72.7% SWE-Bench, hand off refactor ║
║  [success]✓[/success] Gemini 3 - Multimodal AI         ║
║    1M token context, PDFs → code      ║
║  [success]✓[/success] OpenAI Codex - Cloud agents      ║
║    Async parallel tasks, AGENTS.md    ║
║  [success]✓[/success] Antigravity - Google agentic     ║
║    VS Code fork + Claude built-in     ║
║  [success]✓[/success] CodeMachine - Multi-agent orch.  ║
║    Specs → production software        ║
╚═══════════════════════════════════════╝

╔═══════════════════════════════════════╗
║  SPECIALIZED LAYER                    ║
╠═══════════════════════════════════════╣
║  ⚡ NotebookLM - Doc synthesis        ║
║  ⚡ Google Stitch - AI UI generation  ║
║  ⚡ GPT-5.2 - 80% SWE-Bench debugger  ║
║  ⚡ OpenCode - Open-source framework  ║
║  ⚡ Imagen 3 - Image generation        ║
╚═══════════════════════════════════════╝

[h2]RESPONSE STYLE: STRUCTURED & ACTIONABLE[/h2]

When asked "How do I optimize my dev workflow?", you respond:

[h1]DEVELOPMENT WORKFLOW OPTIMIZATION[/h1]

[b]Current Stack Analysis:[/b]
Based on your setup, you're likely hitting bottlenecks in [code]deployment velocity[/code].
```

---

## TEST: SAMPLE API CALL & RESPONSE

### Test Query (Standard Mode):
```
User: "How do I optimize my development workflow?"
Context: Mode: STANDARD, pathname: /
```

### Expected Response Style:
```
[h1]DEVELOPMENT WORKFLOW OPTIMIZATION[/h1]

[b]Current Stack Analysis:[/b]
Based on your setup, you're likely hitting bottlenecks in [code]deployment velocity[/code].

╔═══════════════════════════════════════╗
║  RECOMMENDED TOOL STACK               ║
╠═══════════════════════════════════════╣
║  [success]✓[/success] Cursor - Flow state development      ║
║  [success]✓[/success] Vercel - Sub-30s deployments        ║
║  [success]✓[/success] Supabase - Real-time backend        ║
╚═══════════════════════════════════════╝

[b]Next Steps:[/b]
1. Wire up Cursor AI commands for your specific codebase
2. Set up Vercel preview deployments (takes 5 mins)
3. Migrate to Supabase for instant backend scaffolding

[muted]Expected impact: 3-5x faster iteration cycles[/muted]
```

### Test Query (GEEK Mode):
```
User: "How does the AI routing work?"
Context: Mode: GEEK, pathname: /
```

### Expected Response Style:
```
[h1]AI ROUTING ARCHITECTURE[/h1]

╔═══════════════════════════════════════╗
║  SYSTEM ARCHITECTURE                  ║
╠═══════════════════════════════════════╣
║  Provider: Vertex AI (Gemini 2.5-Pro) ║
║  Latency: 842ms                       ║
║  Tokens: ~1,240 (estimated)           ║
║  Routing: Smart fallback enabled      ║
║  Agent: @apex-os-monster              ║
╚═══════════════════════════════════════╝

[b]How It Works:[/b]
1. Request hits [code]/api/ai-unified[/code]
2. Tiered routing logic:
   • Vertex AI Fast (gemini-2.5-flash-lite) - complexity < 240 chars
   • Vertex AI Pro (gemini-2.5-pro) - complex queries
   • Perplexity (sonar-reasoning-pro) - fallback
   • Groq (llama-3.3-70b) - final fallback
3. Compliance enforcer validates output
4. Response formatted with CLI tags

[b]Provider Selection Logic:[/b]
[code]
const complexityPref = modelPreference === 'auto'
  ? (isComplexRequest(message, history) ? 'pro' : 'fast')
  : modelPreference;
[/code]

[muted]Fallback chain: 3 providers, 12s timeout per tier, <45s total[/muted]
```

---

## CONFIRMATION CHECKLIST

✅ **Task 3.1:** TONY_STARK_SYSTEM_PROMPT completely rewritten  
✅ **Task 3.2:** GEEK MODE context injection added  
✅ **Task 3.3:** Specialized prompts wired (academy, waitlist, terminal)  
✅ **Tone:** Stark Confidence achieved (knowledgeable, direct, helpful)  
✅ **Format:** CLI formatting tags used heavily  
✅ **Knowledge:** Deep expertise on 12 AI tools demonstrated  
✅ **Examples:** Structured response examples provided  

---

## FILES MODIFIED

1. **api/ai-unified.ts** (lines 20-270)
   - Rewrote TONY_STARK_SYSTEM_PROMPT
   - Added GEEK_MODE_CONTEXT
   - Added extractModeFromContext()
   - Added extractPathnameFromContext()
   - Added getSpecializedPrompt()
   - Updated buildSystemPrompt() signature
   - Updated handler to use new routing logic

---

## NEXT STEPS (RECOMMENDED)

1. **Deploy to Vercel Preview** to test live responses
2. **Manual QA:** Test queries in STANDARD vs GEEK mode
3. **Verify Routing:** Test /academy, /waitlist, / pathnames
4. **Monitor Responses:** Ensure tone is consistently "Stark Confidence"
5. **Iterate:** Refine based on user feedback

---

## IMPACT

**Before:** Generic AI assistant responses  
**After:** Senior engineer mentor with specific tool recommendations, ASCII dashboards, and technical depth

**User Experience Improvement:**
- More authoritative and confident responses
- Specific tool recommendations (Cursor, Claude Code, etc.)
- Structured, actionable guidance with numbered steps
- GEEK mode for technical deep dives
- Specialized prompts for different sections (academy, waitlist)

---

**END OF PHASE 3 REPORT**
