# APEX OS - UNIFIED AGENTS PROTOCOL v6.1

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║     ░█▀▀█ ░█▀▀█ ░█▀▀▀ ▀▄░▄▀   ░█▀▀▀█ ░█▀▀▀█                                ║
║     ░█▄▄█ ░█▄▄█ ░█▀▀▀ ░░█░░   ░█░░░█ ▀▀▀▄▄                                ║
║     ░█░░░ ░█░░░ ░█▄▄▄ ▄▀░▀▄   ░█▄▄▄█ ░█▄▄▄█                                ║
║                                                                              ║
║     UNIFIED AGENTS PROTOCOL v6.1                                             ║
║     "The future belongs to those who build it."                              ║
║                                                                              ║
║     Last Updated: 2026-02-07                                                 ║
║     Skills Integrated: 12                                                    ║
║     Sections: 16 + 2 Appendices                                              ║
║     Status: ACTIVE                                                           ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

## TABLE OF CONTENTS

```
┌──────────────────────────────────────────────────────────────────────────┐
│  #   SECTION                              PRIORITY    SKILL SOURCE        │
├──────────────────────────────────────────────────────────────────────────┤
│  1   Golden Rules & Identity              CRITICAL    (core)              │
│  2   Agent Hierarchy & Roles              CRITICAL    (core)              │
│  3   Skill Registry & Auto-Triggers       CRITICAL    (meta)              │
│  4   Subagent-Driven Development          HIGH        subagent-driven     │
│  5   Recursive Agent Coordination         HIGH        recursive-coord     │
│  6   VON Recursive Coordination           HIGH        von-recursive       │
│  7   Tony Stark Deployment Mode           HIGH        recursive-coord     │
│  8   Apex Matrix Orchestrator             MEDIUM      apex-matrix         │
│  9   Browser Automation                   MEDIUM      browser-use/agent   │
│  10  React & Next.js Best Practices       MEDIUM      vercel-react        │
│  11  Web Design Guidelines                MEDIUM      web-design          │
│  12  Enforcement Skills (Gherkin+Errors)  HIGH        gherkin/errors      │
│  13  Skill Creation Guidelines            LOW         skill-principles    │
│  14  Logging & Sync State Protocol        CRITICAL    (core)              │
│  15  Pitch Deck & SEED Meeting Readiness  HIGH        (core)              │
│  16  Production Safety Rules              CRITICAL    (core)              │
│  A   Quick Reference Cards                REF         (appendix)          │
│  B   Anti-Patterns (NEVER DO)             CRITICAL    (appendix)          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Golden Rules & Identity

```
╔══════════════════════════════════════════════════════════════════╗
║  SECTION 1: GOLDEN RULES & IDENTITY                             ║
║  Priority: CRITICAL | Applies To: ALL AGENTS                    ║
╚══════════════════════════════════════════════════════════════════╝
```

### 1.1 Who We Are

- **Project:** APEX OS - The Operating System for the AI Age
- **Tone:** Tony Stark confidence meets technical precision
- **Style:** ASCII dashboards, boxed outputs, zero fluff
- **Standard:** Everything is "Full Blown Spectacular" or it doesn't ship

### 1.2 Working Directory Protocol

```yaml
mandatory_protocol:
  working_directory: "/Users/nico/apex-os-vibe"
  verification: "ALWAYS run pwd before any work"
  
  before_any_work:
    step_1: "cd /Users/nico/apex-os-vibe"
    step_2: "pwd  # MUST output: /Users/nico/apex-os-clean"
    step_3: "git status"
    
  if_wrong_directory:
    action: "STOP immediately"
    fix: "Navigate to correct directory"
    verify: "Re-check pwd before proceeding"
    
  root_git_warning: |
    /Users/nico is ALSO a git repo. NEVER commit from root.
    The OLD repo at /Users/nico/apex-os-vibe is ABANDONED for deployments.
    
  clean_repo_rule: |
    ALL work MUST happen in /Users/nico/apex-os-clean (standalone git repo).
    GitHub: https://github.com/fratilanico/apex-os-vibe
    This is the ONLY repo that deploys to infoacademy.uk.
    Created: 2026-02-07 (clean room init from production disk files).
```

### 1.3 Pre-Commit Verification (MANDATORY)

```
┌─────────────────────────────────────────────────────────────┐
│  PRE-COMMIT CHECKLIST - Run before EVERY commit             │
├─────────────────────────────────────────────────────────────┤
│  [ ] pwd == /Users/nico/apex-os-clean                       │
│  [ ] git status shows expected files only                   │
│  [ ] No secrets (.env, credentials) in staged files         │
│  [ ] TypeScript compiles: npm run typecheck                 │
│  [ ] Build passes: npm run build                            │
│  [ ] No console.log in production code                      │
│  [ ] Commit message follows conventional format             │
│  [ ] .agent_sync_state.json updated with completion         │
└─────────────────────────────────────────────────────────────┘
```

### 1.4 Communication Standard

```yaml
output_format:
  dashboards: "ASCII boxed tables for all status reports"
  headers: "Section boxes with ╔══╗ borders"
  progress: "[ ] pending | [~] in_progress | [x] completed"
  tone: "Direct, technical, zero preamble"
  forbidden:
    - "I have finished..."
    - "Sure, I can help with that..."
    - "Let me know if you need anything else..."
  required:
    - "Status dashboards for multi-step work"
    - "Verification logs after each action"
    - "Next steps always listed"
```

---

## 2. Agent Hierarchy & Roles

```
╔══════════════════════════════════════════════════════════════════╗
║  SECTION 2: AGENT HIERARCHY & ROLES                             ║
║  Priority: CRITICAL | Active Agents: 17                         ║
╚══════════════════════════════════════════════════════════════════╝
```

### 2.1 Hierarchy Visualization

```
                    ┌─────────────────────┐
                    │  LEVEL 1: FOUNDER   │
                    │  @apex-os-monster   │
                    │  Chief Orchestrator │
                    └────────┬────────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
    ┌─────────▼────┐  ┌─────▼──────┐  ┌───▼──────────┐
    │ LEVEL 2:     │  │ LEVEL 2:   │  │ LEVEL 2:     │
    │ EXECUTIVE    │  │ EXECUTIVE  │  │ EXECUTIVE    │
    │ @jarvis-     │  │ @apex-os-  │  │ @opencode-   │
    │ builder-nico │  │ cli-builder│  │ agent        │
    └──────┬───────┘  └─────┬──────┘  └───┬──────────┘
           │                │              │
    ┌──────▼───────────────▼──────────────▼──────┐
    │              LEVEL 3: OPERATIONAL           │
    │  @deployment-automation  @security-monitor  │
    │  @compliance-guardian    @cost-optimizer    │
    └──────────────────┬──────────────────────────┘
                       │
    ┌──────────────────▼──────────────────────────┐
    │              LEVEL 4: SPECIALIST             │
    │  @devops-tester   @content-pipeline         │
    │  @qa-automation   @analytics-engine          │
    │  @matrix-builder  @voice-controller          │
    └─────────────────────────────────────────────┘
```

### 2.2 Communication Flow

```
┌─────────────────────────────────────────────────────┐
│              INTERACTION MATRIX                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  FOUNDER     <────────>     EXECUTIVE               │
│  (Orchestrator)             (JARVIS/CLI/OpenCode)   │
│      │                          │                   │
│      ▼                          ▼                   │
│  DEPLOYMENT  <────────>     DEVOPS                  │
│      │         (Testing)        │                   │
│      ▼                          ▼                   │
│  PRODUCTION  <────────>     COMPLIANCE              │
│                                                     │
│  ←────────> Bidirectional     │ Hierarchical        │
└─────────────────────────────────────────────────────┘
```

---

## 3. Skill Registry & Auto-Triggers

```
╔══════════════════════════════════════════════════════════════════╗
║  SECTION 3: SKILL REGISTRY & AUTO-TRIGGERS                      ║
║  Priority: CRITICAL | Skills Registered: 12                     ║
╚══════════════════════════════════════════════════════════════════╝
```

### 3.1 Complete Skill Registry

```
┌────┬──────────────────────────────┬──────────────────────────────┬──────────┐
│ #  │ SKILL NAME                   │ LOCATION                     │ TIER     │
├────┼──────────────────────────────┼──────────────────────────────┼──────────┤
│ 1  │ subagent-driven-development  │ ~/.agents/skills/            │ FULL     │
│ 2  │ browser-use                  │ ~/.agents/skills/            │ UPPER    │
│ 3  │ agent-browser                │ ~/.agents/skills/            │ UPPER    │
│ 4  │ web-design-guidelines        │ ~/.agents/skills/            │ BASE     │
│ 5  │ vercel-react-best-practices  │ ~/.agents/skills/            │ FULL     │
│ 6  │ opencode-skill-principles    │ ~/.config/opencode/skills/   │ CRITICAL │
│ 7  │ recursive-agent-coordination │ ~/.config/opencode/skills/   │ FULL     │
│ 8  │ von-recursive-coordination   │ ~/.config/opencode/skills/   │ FULL     │
│ 9  │ recursive-coordination       │ ~/.opencode/skills/          │ FULL     │
│ 10 │ apex-matrix-orchestrator     │ ~/.opencode/skills/          │ UPPER    │
│ 11 │ gherkin (enforce)            │ ~/.opencode/skills/          │ CRITICAL │
│ 12 │ error-handling (enforce)     │ ~/.opencode/skills/          │ CRITICAL │
└────┴──────────────────────────────┴──────────────────────────────┴──────────┘
```

### 3.2 Auto-Trigger Decision Tree

```
┌─────────────────────────────────────────────────────────────────────┐
│  WHEN TO USE WHICH SKILL - DECISION TREE                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  "I need to implement a plan with multiple tasks"                  │
│   └─> subagent-driven-development (Section 4)                      │
│                                                                     │
│  "I need to coordinate multiple agents"                            │
│   └─> recursive-agent-coordination (Section 5)                     │
│                                                                     │
│  "I need to run a content pipeline with quality gates"             │
│   └─> von-recursive-coordination (Section 6)                       │
│                                                                     │
│  "SEED meeting prep / Tony Stark mode / deploy NOW"                │
│   └─> recursive-coordination (Section 7)                           │
│                                                                     │
│  "I need to build the Matrix/Learning system"                      │
│   └─> apex-matrix-orchestrator (Section 8)                         │
│                                                                     │
│  "I need to test a website / fill forms / take screenshots"        │
│   └─> browser-use OR agent-browser (Section 9)                     │
│                                                                     │
│  "I'm writing/reviewing React or Next.js code"                     │
│   └─> vercel-react-best-practices (Section 10)                     │
│                                                                     │
│  "Review my UI / check accessibility / audit design"               │
│   └─> web-design-guidelines (Section 11)                           │
│                                                                     │
│  "I'm adding a new feature" (BEFORE writing code)                  │
│   └─> gherkin enforcement (Section 12)                             │
│                                                                     │
│  "I need to create a new skill"                                    │
│   └─> opencode-skill-principles (Section 13)                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.3 Trigger Keywords

```yaml
auto_triggers:
  subagent-driven-development:
    keywords: ["implement plan", "execute tasks", "dispatch subagent"]
    
  recursive-agent-coordination:
    keywords: ["coordinate agents", "agent status", "multi-agent"]
    
  von-recursive-coordination:
    keywords: ["content pipeline", "quality gates", "6-stage", "lead scoring"]
    
  recursive-coordination:
    keywords: ["tony stark mode", "seed meeting", "deploy now", "full coordination"]
    
  browser-use:
    keywords: ["test website", "fill form", "screenshot", "browser automation"]
    
  agent-browser:
    keywords: ["snapshot", "browser ref", "@e1", "mobile safari", "iOS test"]
    
  vercel-react-best-practices:
    keywords: ["react component", "next.js", "performance", "bundle size", "re-render"]
    
  web-design-guidelines:
    keywords: ["review UI", "accessibility", "audit design", "review UX"]
    
  gherkin:
    keywords: ["new feature", "BDD", "test scenario", "acceptance criteria"]
    
  error-handling:
    keywords: ["error boundary", "try-catch", "null guard", "error handling"]
```

---

## 4. Subagent-Driven Development

```
╔══════════════════════════════════════════════════════════════════╗
║  SECTION 4: SUBAGENT-DRIVEN DEVELOPMENT                         ║
║  Source: ~/.agents/skills/subagent-driven-development/          ║
║  Principle: Fresh subagent per task + 2-stage review            ║
╚══════════════════════════════════════════════════════════════════╝
```

### 4.1 Core Principle

> Fresh subagent per task + two-stage review (spec then quality) = high quality, fast iteration

### 4.2 Process Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  SUBAGENT-DRIVEN DEVELOPMENT FLOW                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Read Plan] ──> [Extract All Tasks] ──> [Create TodoWrite]    │
│                                                                 │
│  FOR EACH TASK:                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                                                        │    │
│  │  1. Dispatch IMPLEMENTER subagent                      │    │
│  │     │                                                  │    │
│  │     ├─ Questions? ──> Answer ──> Resume                │    │
│  │     │                                                  │    │
│  │     ▼                                                  │    │
│  │  2. Implementer: Code + Test + Commit + Self-Review    │    │
│  │     │                                                  │    │
│  │     ▼                                                  │    │
│  │  3. Dispatch SPEC REVIEWER subagent                    │    │
│  │     │                                                  │    │
│  │     ├─ Issues? ──> Implementer fixes ──> Re-review     │    │
│  │     │                                                  │    │
│  │     ▼                                                  │    │
│  │  4. Dispatch CODE QUALITY REVIEWER subagent            │    │
│  │     │                                                  │    │
│  │     ├─ Issues? ──> Implementer fixes ──> Re-review     │    │
│  │     │                                                  │    │
│  │     ▼                                                  │    │
│  │  5. Mark task COMPLETE in TodoWrite                    │    │
│  │                                                        │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                 │
│  [All Tasks Done] ──> [Final Code Review] ──> [Branch Ready]   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 Prompt Templates

| Template | Location | Purpose |
|----------|----------|---------|
| Implementer | `~/.agents/skills/subagent-driven-development/implementer-prompt.md` | Full task context + "ask questions first" |
| Spec Reviewer | `~/.agents/skills/subagent-driven-development/spec-reviewer-prompt.md` | Verify code matches spec (nothing more/less) |
| Code Quality | `~/.agents/skills/subagent-driven-development/code-quality-reviewer-prompt.md` | Clean, tested, maintainable code check |

### 4.4 Rules

```yaml
critical_rules:
  - "NEVER dispatch multiple implementer subagents in parallel"
  - "NEVER skip reviews (spec compliance OR code quality)"
  - "NEVER start code quality review before spec compliance passes"
  - "ALWAYS answer subagent questions before letting them proceed"
  - "ALWAYS provide full task text (don't make subagent read plan file)"
  - "If reviewer finds issues: implementer fixes -> reviewer re-reviews -> repeat"
```

---

## 5. Recursive Agent Coordination

```
╔══════════════════════════════════════════════════════════════════╗
║  SECTION 5: RECURSIVE AGENT COORDINATION                        ║
║  Source: ~/.config/opencode/skills/recursive-agent-coordination/║
║  Cycle: Status -> Assign -> Monitor -> Pre-Deploy -> Deploy     ║
╚══════════════════════════════════════════════════════════════════╝
```

### 5.1 The 5-Phase Coordination Cycle

```
┌─────────────────────────────────────────────────────────────────┐
│  RECURSIVE COORDINATION CYCLE                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Phase 1: STATUS CHECK (MANDATORY)                              │
│  ├─ Read .agent_sync_state.json                                 │
│  ├─ Check git status + recent commits                          │
│  ├─ Query: "Where are you? % complete? Blockers? ETA?"          │
│  └─ Output: Status dashboard                                   │
│                                                                 │
│  Phase 2: TASK ASSIGNMENT                                       │
│  ├─ Match task to agent's primary role                          │
│  ├─ Consider current workload                                   │
│  ├─ Set clear deadlines + dependencies                          │
│  └─ Output: Assignment broadcast                                │
│                                                                 │
│  Phase 3: EXECUTION MONITORING                                  │
│  ├─ Check interval: every 30 minutes                            │
│  ├─ Escalation: task overdue by >1 hour                         │
│  ├─ Blocker resolution: immediate coordination                  │
│  └─ Output: Progress update in .agent_sync_state.json           │
│                                                                 │
│  Phase 4: PRE-DEPLOYMENT VERIFICATION                           │
│  ├─ All agents report 100% complete                             │
│  ├─ Build passes locally                                        │
│  ├─ No TypeScript errors + no console errors                    │
│  ├─ Mobile responsive verified                                  │
│  └─ Output: Pre-deploy checklist                                │
│                                                                 │
│  Phase 5: STAGED DEPLOYMENT                                     │
│  ├─ Stage 1: Push to GitHub                                     │
│  ├─ Stage 2: Deploy to Vercel Preview                           │
│  ├─ Stage 3: Team review on preview URL                         │
│  ├─ Stage 4: Deploy to Production                               │
│  └─ Output: Deployment confirmation                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Status Report Template

```markdown
## Agent Coordination Status Report

**Timestamp:** [ISO 8601]
**Orchestrator:** @apex-os-monster
**Phase:** [Current Phase]

| Agent | Status | Task | Progress | Blockers | ETA |
|-------|--------|------|----------|----------|-----|
| @agent-name | Active | Task desc | 75% | None | 2h |

### Completed: [list]
### Pending: [list]
### Blockers: [list]
### Next Actions: [numbered list]
```

---

## 6. VON Recursive Coordination

```
╔══════════════════════════════════════════════════════════════════╗
║  SECTION 6: VON RECURSIVE COORDINATION                          ║
║  Source: ~/.config/opencode/skills/von-recursive-coordination/  ║
║  Pipeline: 6-Stage Quality Gate System                          ║
╚══════════════════════════════════════════════════════════════════╝
```

### 6.1 The 6-Stage Pipeline

```
┌───────────┐    ┌───────────┐    ┌───────────┐
│  STAGE 1  │───>│  STAGE 2  │───>│  STAGE 3  │
│ INGESTION │    │  LOGGING  │    │ 1ST QC    │
│           │    │           │    │ score>=85 │
└───────────┘    └───────────┘    └─────┬─────┘
                                        │
                                  PASS? │ REJECT: re-queue
                                        ▼
┌───────────┐    ┌───────────┐    ┌───────────┐
│  STAGE 6  │<───│  STAGE 5  │<───│  STAGE 4  │
│ PUBLISHER │    │    QC     │    │  EDITOR   │
│ (approval)│    │ (links,   │    │ (human or │
│           │    │  images)  │    │  auto)    │
└───────────┘    └───────────┘    └───────────┘
```

### 6.2 Quality Standards

```yaml
von_framework_compliance:
  spectacular_impact: "High-energy vocabulary, winning milestones"
  extreme_density: "Zero preambles, zero fluff"
  provocative_hooks: "Bold claims, challenge status quo"
  technical_swagger: "Deep-tech terminology mixed with strategy"
  minimum_quality_score: 85
  
pipeline_velocity: "< 5 minutes per content piece"
approval_rate: "> 90% pass QC"
```

---

## 7. Tony Stark Deployment Mode

```
╔══════════════════════════════════════════════════════════════════╗
║  SECTION 7: TONY STARK DEPLOYMENT MODE                          ║
║  Source: ~/.opencode/skills/recursive-coordination/             ║
║  Trigger: "tony stark mode" | "seed meeting" | "deploy now"    ║
║  Timeline: 50 minutes to deployment                             ║
╚══════════════════════════════════════════════════════════════════╝
```

### 7.1 Deployment Timeline

```
┌─────────┬──────────────────────────────────────┬──────────────┐
│  TIME   │ ACTION                               │ AGENT        │
├─────────┼──────────────────────────────────────┼──────────────┤
│  T+0    │ Intelligence gathering & broadcast   │ Orchestrator │
│  T+5    │ Dependencies commit & push           │ @deployment  │
│  T+10   │ Matrix infrastructure commit         │ @cli-builder │
│  T+15   │ ShowMeTheMoney components            │ @opencode    │
│  T+20   │ JARVIS AI assistant                  │ @jarvis      │
│  T+35   │ Integration & testing                │ ALL agents   │
│  T+45   │ Deploy to preview                    │ @deployment  │
│  T+50   │ Validation & go-live                 │ Orchestrator │
└─────────┴──────────────────────────────────────┴──────────────┘
```

---

## 8. Apex Matrix Orchestrator

```
╔══════════════════════════════════════════════════════════════════╗
║  SECTION 8: APEX MATRIX ORCHESTRATOR                            ║
║  Source: ~/.opencode/skills/apex-matrix-orchestrator/           ║
║  Phase 2: Neural Synchronization Architecture                   ║
╚══════════════════════════════════════════════════════════════════╝
```

### 8.1 Core Components

```
┌─────────────────────────────────────────────────────────────────┐
│  MATRIX ARCHITECTURE                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. useMatrixStore (Zustand)                                    │
│     ├─ nodes: MatrixNode[]                                      │
│     ├─ edges: MatrixEdge[]                                      │
│     ├─ activeNodeId: string | null                              │
│     └─ terminalContext: string[]                                │
│                                                                 │
│  2. AI Director API (POST /api/matrix-director)                 │
│     ├─ Input: { currentGraph, terminalLog, userGoal }           │
│     ├─ Output: DirectorPayload                                  │
│     └─ Engine: Gemini 3 Flash                                   │
│                                                                 │
│  3. CodeMachine-CLI Adaptation                                  │
│     └─ Agent Swarm UI visualization                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. Browser Automation

```
╔══════════════════════════════════════════════════════════════════╗
║  SECTION 9: BROWSER AUTOMATION                                  ║
║  Sources: browser-use + agent-browser                           ║
║  Use Case: QA testing, form filling, screenshots, scraping      ║
╚══════════════════════════════════════════════════════════════════╝
```

### 9.1 Which Tool When

```
┌─────────────────────────────────────────────────────────────────┐
│  BROWSER TOOL DECISION                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Need simple navigation + screenshots + forms?                  │
│   └─> browser-use  (index-based: click 5, input 3 "text")      │
│                                                                 │
│  Need snapshot refs + complex interaction chains?               │
│   └─> agent-browser (ref-based: @e1, @e2, re-snapshot)         │
│                                                                 │
│  Need iOS/mobile Safari testing?                                │
│   └─> agent-browser -p ios                                      │
│                                                                 │
│  Need to use real Chrome with existing logins?                  │
│   └─> browser-use --browser real                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 9.2 Quick Reference: browser-use

```bash
browser-use open <url>              # Navigate
browser-use state                   # Get elements with indices
browser-use click <index>           # Click by index
browser-use screenshot [path]       # Capture page
browser-use close                   # Always close when done
```

### 9.3 Quick Reference: agent-browser

```bash
agent-browser open <url>            # Navigate
agent-browser snapshot -i           # Get refs (@e1, @e2)
agent-browser click @e1             # Click by ref
agent-browser fill @e2 "text"       # Type into element
agent-browser close                 # Always close when done
```

---

## 10. React & Next.js Best Practices

```
╔══════════════════════════════════════════════════════════════════╗
║  SECTION 10: REACT & NEXT.js BEST PRACTICES                    ║
║  Source: ~/.agents/skills/vercel-react-best-practices/          ║
║  Rules: 45 across 8 categories (Vercel Engineering)             ║
╚══════════════════════════════════════════════════════════════════╝
```

### 10.1 Priority Categories

```
┌────┬────────────────────────────────┬──────────┬─────────┐
│ #  │ CATEGORY                       │ IMPACT   │ PREFIX  │
├────┼────────────────────────────────┼──────────┼─────────┤
│ 1  │ Eliminating Waterfalls         │ CRITICAL │ async-  │
│ 2  │ Bundle Size Optimization       │ CRITICAL │ bundle- │
│ 3  │ Server-Side Performance        │ HIGH     │ server- │
│ 4  │ Client-Side Data Fetching      │ MED-HIGH │ client- │
│ 5  │ Re-render Optimization         │ MEDIUM   │ rerender-│
│ 6  │ Rendering Performance          │ MEDIUM   │ rendering-│
│ 7  │ JavaScript Performance         │ LOW-MED  │ js-     │
│ 8  │ Advanced Patterns              │ LOW      │ advanced-│
└────┴────────────────────────────────┴──────────┴─────────┘
```

### 10.2 Top 5 Critical Rules

```yaml
1_async_parallel:
  rule: "Use Promise.all() for independent async operations"
  impact: "2-10x improvement"
  
2_bundle_barrel_imports:
  rule: "Import directly from source, not barrel files"
  impact: "200-800ms import cost reduction"
  
3_bundle_dynamic_imports:
  rule: "Use next/dynamic for heavy components"
  impact: "Directly affects TTI and LCP"
  
4_server_parallel_fetching:
  rule: "Restructure RSC to parallelize data fetching"
  impact: "Eliminates server-side waterfalls"
  
5_server_minimize_serialization:
  rule: "Only pass fields the client actually uses"
  impact: "Reduces page weight and load time"
```

---

## 11. Web Design Guidelines

```
╔══════════════════════════════════════════════════════════════════╗
║  SECTION 11: WEB DESIGN GUIDELINES                              ║
║  Source: ~/.agents/skills/web-design-guidelines/                ║
║  Trigger: "review UI" | "check accessibility"                   ║
╚══════════════════════════════════════════════════════════════════╝
```

### 11.1 Review Protocol

```yaml
review_workflow:
  step_1: "Fetch latest guidelines from Vercel source URL"
  step_2: "Read the specified files"
  step_3: "Check against ALL rules"
  step_4: "Output findings in file:line format"
  
guidelines_source: |
  https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

---

## 12. Enforcement Skills

```
╔══════════════════════════════════════════════════════════════════╗
║  SECTION 12: ENFORCEMENT SKILLS (MANDATORY)                     ║
║  Sources: gherkin + error-handling                               ║
║  Rule: Violations = BLOCKED commits                             ║
╚══════════════════════════════════════════════════════════════════╝
```

### 12.1 Gherkin BDD Enforcement

```
┌─────────────────────────────────────────────────────────────────┐
│  GHERKIN BDD - MANDATORY FOR ALL FEATURES                       │
├─────────────────────────────────────────────────────────────────┤
│  BEFORE writing ANY feature code:                               │
│  1. Create features/{name}.feature                              │
│  2. Write scenarios with tags: @smoke @critical                 │
│  3. Create step definitions                                     │
│  4. All scenarios MUST pass                                     │
│                                                                 │
│  NO TESTS = NO MERGE                                            │
└─────────────────────────────────────────────────────────────────┘
```

### 12.2 Error Handling Enforcement

```
┌─────────────────────────────────────────────────────────────────┐
│  ERROR HANDLING - MANDATORY                                     │
├─────────────────────────────────────────────────────────────────┤
│  REQUIRED:                                                      │
│  [x] All async operations wrapped in try-catch                  │
│  [x] All arrays have null guards                                │
│  [x] ErrorBoundary exists                                       │
│                                                                 │
│  FORBIDDEN:                                                     │
│  [!] Empty catch blocks                                         │
│  [!] @ts-ignore without handling                                │
│  [!] Non-null assertions without validation                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 13. Skill Creation Guidelines

```
╔══════════════════════════════════════════════════════════════════╗
║  SECTION 13: SKILL CREATION GUIDELINES                          ║
║  Source: ~/.config/opencode/skills/opencode-skill-principles/   ║
╚══════════════════════════════════════════════════════════════════╝
```

### 13.1 Core Principles

```yaml
1_concise_is_key: "Only add context agent doesn't already have"
2_under_500_lines: "SKILL.md should be under 500 lines"
3_progressive_disclosure: "Essential info in SKILL.md, details separate"
4_appropriate_freedom: "Match specificity to task fragility"
```

### 13.2 Required Metadata

```yaml
# SKILL.md frontmatter
---
name: your-skill-name        # max 64 chars
description: "Brief desc"    # max 1024 chars, 3rd person
tier: FULL                   # CRITICAL|BASE|UPPER|FULL
---
```

---

## 14. Logging & Sync State Protocol

```
╔══════════════════════════════════════════════════════════════════╗
║  SECTION 14: LOGGING & SYNC STATE PROTOCOL                      ║
║  Priority: CRITICAL | Frequency: Every 5 minutes                ║
╚══════════════════════════════════════════════════════════════════╝
```

### 14.1 5-Minute Self-Verification (MANDATORY)

```
┌─────────────────────────────────────────────────────────────────┐
│  SELF-VERIFICATION - EVERY 5 MINUTES - NO EXCEPTIONS           │
├─────────────────────────────────────────────────────────────────┤
│  AT AGENT BIRTH:                                                │
│  1. Read .agent_sync_state.json immediately                     │
│  2. Update status with timestamp                                │
│  3. Verify working directory (pwd)                              │
│  4. Check for conflicts                                         │
│  5. Confirm next actions                                        │
│                                                                 │
│  EVERY 5 MINUTES:                                               │
│  1. Update .agent_sync_state.json                               │
│  2. Verify no conflicts                                         │
│  3. Validate recent commits                                     │
│  4. Check for uncommitted changes                               │
│  5. Confirm still on assigned task                              │
│                                                                 │
│  IF MISSED: STOP all work, notify orchestrator                 │
└─────────────────────────────────────────────────────────────────┘
```

### 14.2 .agent_sync_state.json Schema

```json
{
  "verification": {
    "agent": "@agent-name",
    "timestamp": "2026-02-07T00:00:00Z",
    "status": "ACTIVE|BUILDING|WAITING|BLOCKED",
    "current_task": "What I'm doing NOW",
    "progress": "0-100%",
    "blockers": "List or 'None'",
    "next_action": "What I'll do next 5 min",
    "alignment_verified": true
  }
}
```

---

## 15. Pitch Deck & SEED Meeting Readiness

```
╔══════════════════════════════════════════════════════════════════╗
║  SECTION 15: PITCH DECK & SEED MEETING READINESS                ║
║  JARVIS: EXEMPT from standardization                            ║
╚══════════════════════════════════════════════════════════════════╝
```

### 15.1 JARVIS Exception Clause

```yaml
jarvis_exception:
  rule: "JARVIS components EXEMPT from standardization"
  reason: "Differentiator for SEED meetings"
  
  standards:
    quality: "Pitch-deck ready"
    animations: "60fps GSAP"
    performance: "<2s response time"
```

### 15.2 Financial Numbers (MUST BE ACCURATE)

```
┌─────────────────────────────────────────────────────────────────┐
│  FINANCIAL NUMBERS - SEED MEETING CRITICAL                      │
├─────────────────────────────────────────────────────────────────┤
│  LTV:CAC Ratio:     9.8:1                                       │
│  Year 1 Revenue:    $501K                                       │
│  Seed Ask:          $1.2M                                       │
│  Agent Count:       17 AI agents                                │
│                                                                 │
│  ANY DISCREPANCY = DEPLOYMENT BLOCKER                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 16. Production Safety Rules (CRITICAL)

```
╔══════════════════════════════════════════════════════════════════╗
║  SECTION 16: PRODUCTION SAFETY RULES                             ║
║  Status: CRITICAL | Learned from 10-hour incident 2026-02-06     ║
╚══════════════════════════════════════════════════════════════════╝
```

### 16.1 Golden Production Rules

```yaml
production_safety:
  site: "https://infoacademy.uk"
  repo: "/Users/nico/apex-os-clean"
  github: "https://github.com/fratilanico/apex-os-vibe"
  
  RULE_1: "NEVER replace working components with V2 versions wholesale"
  RULE_2: "ITERATE on what's live in production, never swap"
  RULE_3: "Build MUST pass before any commit"
  RULE_4: "Always work on feature branch, verify preview deploy, then merge"
  RULE_5: "Production baseline = infoacademy.uk (what's live NOW)"
  RULE_6: "Build ON TOP of production, not from scratch"
  
  incident_record: |
    2026-02-06: WaitlistV2 ghost component leaked from stale git branch.
    Root cause: Old repo at /Users/nico tracked only 9 files in apex-os-vibe/.
    Impact: 10 hours of user time lost debugging.
    Resolution: Created clean repo at /Users/nico/apex-os-clean.
```

### 16.2 LKGC (Last Known Good Config) Backup

```yaml
lkgc:
  url: "https://apex-os-vibe-ov8cxp9tm-nicos-projects-81a407b9.vercel.app"
  label: "FOREVER BACKUP - NEVER DELETE"
  created: "2026-02-06"
  purpose: "Emergency rollback if production breaks"
  
  rollback_procedure:
    step_1: "Verify LKGC is still accessible"
    step_2: "Point infoacademy.uk alias to LKGC deploy"
    step_3: "Investigate and fix the broken deploy"
    step_4: "Deploy fix, verify, then restore alias"
```

### 16.3 Deployment Workflow

```yaml
deployment_workflow:
  step_1:
    action: "Create feature branch"
    command: "git checkout -b feature/my-feature"
    
  step_2:
    action: "Implement changes"
    verify: "npm run build (MUST pass with 0 errors)"
    
  step_3:
    action: "Commit and push"
    command: "git push -u origin feature/my-feature"
    
  step_4:
    action: "Deploy preview"
    command: "vercel deploy"
    verify: "Visually compare preview vs infoacademy.uk"
    
  step_5:
    action: "Merge to main"
    command: "git checkout main && git merge feature/my-feature && git push"
    
  step_6:
    action: "Deploy production"
    command: "vercel --prod"
    verify: "Check infoacademy.uk immediately after deploy"
    
  step_7:
    action: "Verify production"
    checks:
      - "Homepage loads correctly"
      - "Terminal is responsive"
      - "All routes accessible"
      - "No ghost components visible"
```

---

## Appendix A: Quick Reference Cards

```
╔══════════════════════════════════════════════════════════════════╗
║  APPENDIX A: QUICK REFERENCE                                    ║
╚══════════════════════════════════════════════════════════════════╝
```

### A.1 Skill Trigger Cheat Sheet

```
┌────────────────────────┬────────────────────────────────┐
│  TRIGGER PHRASE         │  SKILL ACTIVATED               │
├────────────────────────┼────────────────────────────────┤
│  "implement plan"       │  subagent-driven-development   │
│  "coordinate agents"    │  recursive-agent-coordination  │
│  "tony stark mode"      │  recursive-coordination        │
│  "test website"         │  browser-use/agent-browser     │
│  "react component"      │  vercel-react-best-practices   │
│  "new feature"          │  gherkin enforcement           │
└────────────────────────┴────────────────────────────────┘
```

### A.2 Essential Commands

```bash
# Working directory verification
cd /Users/nico/apex-os-clean && pwd

# Agent sync state
cat .agent_sync_state.json

# Build verification
npm run typecheck && npm run build

# Deploy preview
vercel deploy

# Deploy production
vercel --prod
```

### A.3 Architecture Decisions

```yaml
architecture:
  compute: "Cloud Run (serverless, scale-to-zero)"
  budget: "~£900 GCP credits available"
  gcp_project: "cs-poc-amjmnp0kbq2todq7xnldvpm"
  max_parallel_agents: 10
  persistence: "Supabase"
  hosting: "Vercel (SPA + serverless functions)"
  tiers: "Free / Starter / Pro / Enterprise"
  
  approved_services:
    - "Vercel (hosting + serverless)"
    - "Supabase (database + auth)"
    - "GCP Cloud Run (agent execution)"
    - "GCP Vertex AI (LLM inference)"
    
  not_yet_enabled:
    - "run.googleapis.com"
    - "cloudbuild.googleapis.com"
    - "artifactregistry.googleapis.com"
```

---

## Appendix B: Anti-Patterns (NEVER DO)

```
╔══════════════════════════════════════════════════════════════════╗
║  APPENDIX B: ANTI-PATTERNS                                      ║
╚══════════════════════════════════════════════════════════════════╝
```

### B.1 Directory & Git

```yaml
never:
  - "Work in wrong directory"
  - "Commit from root /Users/nico"
  - "Skip .agent_sync_state.json updates"
  - "Skip 5-minute self-verification"
```

### B.2 Code Quality

```yaml
never:
  - "Empty catch blocks"
  - "Skip quality gates for speed"
  - "Standardize JARVIS components (EXEMPT)"
  - "Sequential awaits for independent ops (use Promise.all)"
```

### B.3 Banned Tools & Processes

```yaml
banned:
  pm2:
    status: "PERMANENTLY BANNED"
    killed: "2026-02-07"
    reason: "Uncontrolled background processes, daemon resurrection, resource drain"
    alternative: "Cloud Run (serverless, scale-to-zero)"
    
  root_repo:
    status: "ABANDONED"
    path: "/Users/nico (root git repo)"
    reason: "Tracked entire home directory, caused ghost components in production"
    alternative: "/Users/nico/apex-os-clean (standalone repo)"
    
  wholesale_component_swap:
    status: "BANNED"
    reason: "WaitlistV2 incident - 10 hours lost"
    alternative: "Iterate on live components incrementally"
```

---

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║  END OF AGENTS.md v6.1 - UNIFIED AGENTS PROTOCOL                             ║
║                                                                              ║
║  Skills Integrated: 12                                                       ║
║  Sections: 16 + 2 Appendices                                                 ║
║  Status: ACTIVE                                                              ║
║                                                                              ║
║  "I am Iron Man." - Tony Stark                                               ║
║  "I built this with 17 AI agents." - APEX OS                                 ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
```
