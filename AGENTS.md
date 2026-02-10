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

### 1.5 API & Network Layer Changes - REQUIRES APPROVAL

```
╔══════════════════════════════════════════════════════════════════╗
║  API & NETWORK LAYER CHANGES - MANDATORY APPROVAL PROTOCOL      ║
║  Priority: CRITICAL | Applies To: ALL AGENTS                    ║
╚══════════════════════════════════════════════════════════════════╝

CRITICAL: Any changes to API endpoints, network layer, or type 
definitions MUST follow this approval protocol:

NEVER directly modify without explicit approval:
- api/ai-unified.ts
- api/matrix-director.ts
- Any /api/* endpoint files
- Any type definition files (*.d.ts, types/*.ts)
- Any network configuration or model IDs
- Any database schema or connection strings

APPROVAL PROTOCOL:
1. PRESENT proposed changes as multiple choice question
2. WAIT for explicit user confirmation
3. Only then proceed with implementation
4. Follow up with verification

Example format:
┌─────────────────────────────────────────────────────────────┐
│  PROPOSED API CHANGE REQUIRES APPROVAL                      │
├─────────────────────────────────────────────────────────────┤
│  File: api/ai-unified.ts                                    │
│  Impact: Updates model IDs in cascade                       │
│  Risk: HIGH - Could break production AI responses           │
│                                                              │
│  [1] APPROVE - Update to latest models                      │
│  [2] SKIP - Keep current models                             │
│  [3] REVIEW - Show me detailed diff first                   │
│  [4] DISCUSS - I have questions                             │
└─────────────────────────────────────────────────────────────┘

WHY THIS MATTERS:
- API changes can break production instantly
- Network layer changes affect all users
- Type changes require cascading updates
- Model ID changes impact AI response quality
- Database changes are irreversible

AGENTS.MD VIOLATION = IMMEDIATE FLAG
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
  RULE_7: "NEVER deploy to production without EXPLICIT user permission"
  
  incident_record: |
    2026-02-06: WaitlistV2 ghost component leaked from stale git branch.
    Root cause: Old repo at /Users/nico tracked only 9 files in apex-os-vibe/.
    Impact: 10 hours of user time lost debugging.
    Resolution: Created clean repo at /Users/nico/apex-os-clean.
    
    2026-02-10: Agent deployed to production without explicit user permission.
    Root cause: Agent auto-deployed after user said "this one is loading" (referring to preview).
    Impact: User trust violated, production potentially unstable.
    Resolution: Added RULE_7 - "NEVER deploy to production without EXPLICIT user permission".
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

## 17. Shadow Testing & Regression Testing Protocol (GOLDEN STANDARD)

```
╔══════════════════════════════════════════════════════════════════╗
║  SECTION 17: SHADOW TESTING & REGRESSION PROTOCOL               ║
║  Priority: CRITICAL | Status: MANDATORY PRE-DEPLOY              ║
║  Added: 2026-02-10 | Author: @apex-os-monster                   ║
╚══════════════════════════════════════════════════════════════════╝
```

### 17.1 Protocol Overview

**MANDATORY:** No code deploys to production without completing ALL phases of shadow testing.

**Definition:** Shadow testing = testing the new deployment alongside production to catch issues before they affect users.

**Regression testing = verifying existing functionality still works after changes.**

### 17.2 Pre-Flight Checklist (BEFORE Testing)

```yaml
pre_flight:
  - [ ] Code committed to feature branch
  - [ ] Build passes locally: npm run build
  - [ ] TypeScript compiles: npm run typecheck
  - [ ] No console.log in production code
  - [ ] Environment variables set
  - [ ] Feature flags configured
  - [ ] Rollback plan documented
```

### 17.3 Shadow Testing Phases

#### PHASE 1: Visual Regression Testing (CRITICAL)

**Objective:** Catch layout breaks, overflow issues, visual glitches

**Test Matrix:**
```
┌─────────────────┬──────────────────────────────────────────┐
│ Device          │ Viewport      │ Priority │ Time Alloc  │
├─────────────────┼───────────────┼──────────┼─────────────┤
│ Desktop Chrome  │ 1920x1080     │ P0       │ 5 min       │
│ Desktop Firefox │ 1920x1080     │ P1       │ 3 min       │
│ Desktop Safari  │ 1920x1080     │ P1       │ 3 min       │
│ Tablet iPad     │ 768x1024      │ P0       │ 5 min       │
│ Tablet Samsung  │ 800x1200      │ P0       │ 5 min       │
│ Mobile iPhone   │ 375x812       │ P0       │ 5 min       │
│ Mobile Android  │ 360x740       │ P0       │ 5 min       │
│ Small Mobile    │ 320x568       │ P2       │ 3 min       │
└─────────────────┴───────────────┴──────────┴─────────────┘
```

**Visual Checklist:**
```yaml
navbar:
  - [ ] Logo visible and properly sized
  - [ ] No overlapping elements
  - [ ] All buttons accessible
  - [ ] Signal bars visible (desktop)
  - [ ] Player ID visible (desktop)
  
hero_section:
  - [ ] Title readable
  - [ ] Subtitle visible
  - [ ] Terminal/CTA accessible
  - [ ] No overflow issues
  
terminal:
  - [ ] Content visible
  - [ ] Input at bottom
  - [ ] No extra black space
  - [ ] Wire animation visible (if enabled)
  - [ ] Scroll works properly
  
comparison_section:
  - [ ] NEW tab readable
  - [ ] OLD tab readable (minimum 30% opacity)
  - [ ] Toggle switches work
  - [ ] Cards don't overlap
  
forms:
  - [ ] All inputs visible
  - [ ] Placeholder text readable
  - [ ] Submit button accessible
  - [ ] Error states visible
  
footer:
  - [ ] Links clickable
  - [ ] Copyright visible
  - [ ] Glow effect present
```

#### PHASE 2: Functional Regression Testing (CRITICAL)

**Objective:** Ensure existing features still work

**Test Flows:**

**Flow A: Terminal Handshake & AI Swarm (4-Step)**
```yaml
steps:
  1: "Page loads → Boot sequence plays"
  2: "Enter name/email → Press Enter"
  3: "Handshake animation plays → Select RED/BLUE pill"
  4: "Type complex question (e.g. 'How do I optimize TAM?') → Verify AI response"
  
validation:
  - [ ] Boot sequence completes
  - [ ] Persona selection updates UI theme
  - [ ] Unknown commands route to AI Swarm (Gemini/Perplexity)
  - [ ] Response includes CLI tags ([h1], [code], etc.)
  - [ ] No console errors
```

**Flow B: JARVIS Profiling & Recommendations**
```yaml
steps:
  1: "Open JARVIS → Type 3 messages"
  2: "Verify Micro-Question trigger appears"
  3: "Answer question → Verify profile update in logs"
  4: "Open 'Neural Roadmap' view → Verify recommendations"
  
validation:
  - [ ] JARVIS session syncs with Supabase
  - [ ] Micro-questions relevant to missing data
  - [ ] Recommendations scored by persona
```

**Flow C: Countdown & Navbar**
```yaml
steps:
  1: "Check countdown timer"
  2: "Refresh page 3 times"
  
validation:
  - [ ] Countdown remains fixed to Feb 27, 6PM UK
  - [ ] Logo fits perfectly in navbar (all devices)
```

**Flow B: Geek Mode Toggle**
```yaml
steps:
  1: "Click 'Geek: OFF' button"
  2: "Verify effects appear (desktop)"
  3: "Verify effects reduced (tablet)"
  4: "Verify no effects (mobile)"
  5: "Click again to turn off"
  
validation:
  - [ ] Button toggles state
  - [ ] Effects appropriate for device
  - [ ] No flashing on 120Hz displays
  - [ ] No console errors
```

**Flow C: Navigation**
```yaml
steps:
  1: "Click all nav links"
  2: "Verify page transitions"
  3: "Check scroll position"
  4: "Test mobile menu"
  
validation:
  - [ ] All routes accessible
  - [ ] No 404s
  - [ ] Smooth transitions
  - [ ] Mobile menu works
```

#### PHASE 3: Performance Testing (HIGH)

**Metrics:**
```yaml
core_web_vitals:
  LCP: "< 2.5s (Largest Contentful Paint)"
  FID: "< 100ms (First Input Delay)"
  CLS: "< 0.1 (Cumulative Layout Shift)"
  FCP: "< 1.5s (First Contentful Paint)"
  TTI: "< 3.5s (Time to Interactive)"
  
animation_performance:
  frame_rate: "60fps target"
  dropped_frames: "< 5%"
  gpu_usage: "Check in DevTools"
  
bundle_size:
  total: "< 500KB gzipped"
  initial_js: "< 200KB"
  images: "Optimized, lazy loaded"
```

**Tools:**
- Chrome DevTools Lighthouse
- Chrome DevTools Performance tab
- React DevTools Profiler
- WebPageTest.org

#### PHASE 4: Accessibility Testing (MEDIUM)

**Checks:**
```yaml
keyboard_navigation:
  - [ ] Tab order logical
  - [ ] Focus indicators visible
  - [ ] Enter activates buttons
  - [ ] Escape closes modals
  - [ ] Space toggles checkboxes
  
screen_reader:
  - [ ] ARIA labels present
  - [ ] Alt text meaningful
  - [ ] Headings hierarchy correct
  - [ ] Links descriptive
  
color_contrast:
  - [ ] Text 4.5:1 ratio
  - [ ] Large text 3:1 ratio
  - [ ] UI components 3:1 ratio
  
motion:
  - [ ] Respect prefers-reduced-motion
  - [ ] No auto-playing videos
  - [ ] Pause/stop controls present
```

#### PHASE 5: Cross-Browser Testing (MEDIUM)

**Browsers:**
```yaml
desktop:
  chrome: "Latest 2 versions"
  firefox: "Latest 2 versions"
  safari: "Latest 2 versions"
  edge: "Latest 2 versions"
  
mobile:
  ios_safari: "Latest 2 versions"
  chrome_android: "Latest 2 versions"
  samsung_internet: "Latest version"
```

### 17.4 Regression Testing Matrix

**After ANY change, verify:**

```yaml
smoke_tests:
  - [ ] Homepage loads
  - [ ] Terminal initializes
  - [ ] No console errors
  - [ ] All routes accessible
  
critical_paths:
  - [ ] Signup flow works
  - [ ] Payment processing works
  - [ ] Admin panel accessible
  - [ ] Analytics tracking works
  
visual_regression:
  - [ ] Screenshots match baseline
  - [ ] No unintended layout shifts
  - [ ] Fonts load correctly
  - [ ] Images display properly
```

### 17.5 Bug Severity Classification

```yaml
P0_critical:
  definition: "Prevents core functionality, affects all users"
  examples:
    - "Terminal doesn't load"
    - "Cannot submit forms"
    - "Site crashes on load"
    - "Seizure-inducing animations"
  action: "DEPLOYMENT BLOCKED - Fix immediately"
  
P1_high:
  definition: "Major feature broken, workaround exists"
  examples:
    - "Logo not visible"
    - "Buttons overlap on mobile"
    - "Geek mode broken"
    - "Performance degraded"
  action: "DEPLOYMENT BLOCKED - Fix before deploy"
  
P2_medium:
  definition: "Minor issue, doesn't block core flow"
  examples:
    - "Animation slightly off"
    - "Color contrast low"
    - "Spacing inconsistent"
  action: "Can deploy with known issue, fix in next cycle"
  
P3_low:
  definition: "Cosmetic issue only"
  examples:
    - "Typo in copy"
    - "Shadow slightly wrong"
    - "Font weight off by 100"
  action: "Deploy and fix in next cycle"
```

### 17.6 Testing Documentation

**MANDATORY:** Document all findings

```markdown
## Shadow Test Report - YYYY-MM-DD

### Test Environment
- Branch: feature/name
- Commit: abc123
- Tester: @agent-name
- Duration: XX minutes

### Devices Tested
- [ ] Desktop Chrome 1920x1080
- [ ] Tablet iPad 768x1024
- [ ] Mobile iPhone 375x812

### Results Summary
- Total Issues: X
- P0: X
- P1: X
- P2: X
- P3: X

### Critical Issues (P0/P1)
1. [Issue description]
   - Device: [which device]
   - Steps to reproduce: [steps]
   - Expected: [expected behavior]
   - Actual: [actual behavior]
   - Screenshot: [link]

### Resolved Issues
1. [Issue] → Fixed in commit [hash]

### Sign-off
- [ ] All P0/P1 issues resolved
- [ ] Performance metrics met
- [ ] Accessibility checks pass
- [ ] Ready for production

Tester: @agent-name
Date: YYYY-MM-DD
```

### 17.7 Golden Standard Enforcement

**MANDATORY RULES:**

```yaml
pre_deploy_requirements:
  - "ALL P0 issues MUST be resolved"
  - "ALL P1 issues SHOULD be resolved (or documented with approval)"
  - "Visual regression testing on minimum 3 devices"
  - "Functional testing on critical paths"
  - "Performance metrics within thresholds"
  - "No console errors in production build"
  - "Shadow test report documented"
  
post_deploy_verification:
  - "Verify production URL within 5 minutes"
  - "Run smoke tests on production"
  - "Check error monitoring (Sentry/etc)"
  - "Verify analytics tracking"
  - "Monitor for 1 hour post-deploy"
  
rollback_criteria:
  - "P0 issue discovered in production"
  - "Error rate > 1%"
  - "Performance degraded > 50%"
  - "User complaints spike"
  - "Any security vulnerability"
```

### 17.8 Quick Reference: Testing Commands

```bash
# Local testing
npm run dev          # Start dev server
npm run build        # Production build
npm run typecheck    # TypeScript check

# Deployment
vercel deploy        # Deploy to preview
vercel --prod        # Deploy to production

# Verification
curl -s https://infoacademy.uk | head -20  # Check production
```

---

## 18. Large Document Analysis Protocol (EPIC)

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  SECTION 18: LARGE DOCUMENT ANALYSIS PROTOCOL                               ║
║  Status: EPIC | MANDATORY for documents >2000 lines                         ║
║  Added: 2026-02-11 | Origin: Session KIMI APEX OS Analysis                  ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

### 18.1 Trigger Condition

**MANDATORY DEPLOYMENT:** When any document exceeds **2000 lines**, immediately execute the 3-Agent Analysis Swarm.

```yaml
trigger:
  condition: "document_line_count > 2000"
  auto_execute: true
  no_exceptions: true
  
examples:
  - Session logs (>5000 lines)
  - Audit reports (>3000 lines)  
  - Technical specifications (>2500 lines)
  - Meeting transcripts (>2000 lines)
```

### 18.2 The 3-Agent Swarm Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
║  3-AGENT SWARM - PARALLEL ANALYSIS PROTOCOL                                 ║
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────┐                                                    │
│  │  AGENT 1:           │  ┌─────────────────────┐                          │
│  │  HIGH-LEVEL         │  │  AGENT 2:           │                          │
│  │  STRATEGIC ANALYZER │  │  DEEP TECHNICAL     │                          │
│  │                     │  │  ANALYZER           │                          │
│  │  • Biggest plays    │  │                     │  ┌─────────────────────┐ │
│  │  • Strategic moves  │  │  • Files modified   │  │  AGENT 3:           │ │
│  │  • Key milestones   │  │  • Bug fixes        │  │  VALIDATOR          │ │
│  │  • Decisions made   │  │  • Features         │  │                     │ │
│  │  • Timeline         │  │  • Code changes     │  │  • Claims vs reality│ │
│  │                     │  │  • Dependencies     │  │  • Inconsistencies  │ │
│  │  PARALLEL           │  │  • Technical debt   │  │  • Unresolved issues│ │
│  │  EXECUTION          │  │                     │  │  • Risks           │ │
│  └──────────┬──────────┘  └──────────┬──────────┘  │  • QA gaps          │ │
│             │                        │             └─────────────────────┘ │
│             └────────────┬───────────┘                                     │
│                          ▼                                                 │
│             ┌─────────────────────────────┐                                │
│             │  SYNTHESIS PHASE            │                                │
│             │  • Merge findings           │                                │
│             │  • Cross-reference          │                                │
│             │  • Conflict resolution      │                                │
│             │  • Final report generation  │                                │
│             └─────────────────────────────┘                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 18.3 Agent Specifications

#### Agent 1: High-Level Strategic Analyzer

**Role:** Strategic intelligence extraction
**Focus:** Big picture, not implementation details

**Prompt Template:**
```typescript
{
  role: "HIGH-LEVEL STRATEGIC ANALYZER",
  mission: `Read the entire document and extract the BIGGEST PLAYS, 
            strategic moves, and high-level insights.`,
  
  read_strategy: "Complete document read with multiple offset/limit calls",
  
  deliverables: [
    "Executive Summary (3-5 bullet points of biggest strategic plays)",
    "Key Milestones Achieved",
    "Major Decisions Made", 
    "Strategic Pivot Points",
    "Resource Allocations",
    "Timeline of Critical Events"
  ],
  
  format: "GOLDEN_STANDARD with ASCII headers and progress bars",
  
  forbidden: [
    "Implementation details",
    "Code snippets",
    "Line-by-line analysis",
    "Technical specifications"
  ]
}
```

#### Agent 2: Deep Technical Analyzer

**Role:** Exhaustive technical documentation
**Focus:** Granular implementation details

**Prompt Template:**
```typescript
{
  role: "DEEP TECHNICAL ANALYZER",
  mission: `Perform SECTION-BY-SECTION granular analysis of all 
            technical work, code changes, bug fixes, and implementations.`,
  
  read_strategy: "Complete document read with section parsing",
  
  deliverables: [
    "Files Modified (complete list with line numbers)",
    "Bug Fixes Applied (what was broken, how fixed)",
    "Features Implemented (technical details)",
    "API Changes (endpoints, models, data flow)",
    "UI/UX Changes (components, styling, interactions)",
    "Performance Optimizations",
    "Configuration Changes",
    "Database/Storage Changes",
    "Dependencies Added/Removed"
  ],
  
  workstreams: [
    "Terminal System Enhancements",
    "UI/UX Improvements",
    "Performance & Optimization", 
    "Bug Fixes & Hotfixes",
    "Infrastructure & Config",
    "AI/Backend Integration"
  ],
  
  format: "GOLDEN_STANDARD with detailed tables and code blocks"
}
```

#### Agent 3: Validation & Verification Agent

**Role:** Reality checker and risk assessor
**Focus:** What was claimed vs what was delivered

**Prompt Template:**
```typescript
{
  role: "VALIDATION & VERIFICATION AGENT",
  mission: `Validate: what was CLAIMED vs what was ACTUALLY done.
            Identify inconsistencies, gaps, and risks.`,
  
  read_strategy: "Complete document + cross-reference with claims",
  
  deliverables: [
    "CLAIMS vs REALITY Matrix",
    "Inconsistencies Found",
    "Unresolved Issues (P0, P1, P2)",
    "Technical Debt Introduced",
    "Risks & Regressions",
    "Dependencies & Blockers",
    "QA Gaps (what wasn't tested)",
    "Documentation Gaps"
  ],
  
  validation_criteria: [
    "Is the code production-ready?",
    "Are there any TODOs left?",
    "Did all tests pass?",
    "Are there breaking changes?",
    "Is Golden Standard maintained?"
  ],
  
  severity_ratings: ["P0", "P1", "P2", "P3"]
}
```

### 18.4 Execution Protocol

```yaml
phase_1_dispatch:
  action: "Deploy all 3 agents in PARALLEL"
  tool: "Task tool with subagent_type: general"
  timeout: "600 seconds per agent"
  
phase_2_synthesis:
  action: "Orchestrator merges findings"
  steps:
    - "Collect all 3 agent reports"
    - "Identify conflicts or contradictions"
    - "Reconcile differences"
    - "Assign severity ratings"
    
phase_3_deliverables:
  outputs:
    - "GAP ANALYSIS: What's missing vs requirements"
    - "GAP ASSESSMENT: Impact of each gap"
    - "FULL ROADMAP: Path to completion"
    - "PROGRESS STATUS DASHBOARD: Visual progress tracking"
    - "SPRINT PLANNING: What needs to be done next"
    - "DEPENDENCY MAP: Blockers and prerequisites"
    - "TO-BE STATE DEFINITION: Target architecture"
```

### 18.5 Output Format Standards

All 3 agents must return reports in **GOLDEN STANDARD** format:

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  [AGENT NAME] - ANALYSIS REPORT                                              ║
║  Document: [filename] | Lines: [count] | Date: [timestamp]                   ║
╚══════════════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────────────┐
│  [SECTION NAME]                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  Content with:                                                              │
│  • Tables for structured data                                               │
│  • Progress bars [████████░░] 80%                                           │
│  • Status icons 🟢🔴🟡⚪✅❌                                                  │
│  • Severity ratings P0/P1/P2/P3                                            │
│                                                                             │
│  Listen up - [Tony Stark style commentary]                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 18.6 Post-Analysis Actions

After receiving all 3 reports, the orchestrator must:

```yaml
immediate_actions:
  1_integrate_findings:
    - "Create unified gap analysis"
    - "Prioritize issues by severity"
    - "Map dependencies between fixes"
    
  2_create_roadmap:
    - "Define sprint goals"
    - "Estimate effort per task"
    - "Assign owners"
    - "Set deadlines"
    
  3_update_documentation:
    - "Update AGENTS.md if process improved"
    - "Document lessons learned"
    - "Archive findings"
    
  4_communicate:
    - "Present findings to user"
    - "Get approval on roadmap"
    - "Confirm priorities"
```

### 18.7 Example Use Cases

**Case 1: Session Log Analysis**
```
Trigger: Session log = 5,784 lines (>2000 threshold)
Action: Deploy 3-Agent Swarm
Result: 
  - Agent 1: Strategic plays (3-step terminal, Geek Mode accessibility)
  - Agent 2: 23 files modified, 30+ commits, +5,784/-1,247 lines
  - Agent 3: 10 claims vs reality mismatches, 9 LSP errors unresolved
Output: Full gap analysis with roadmap to production
```

**Case 2: Audit Report Analysis**
```
Trigger: Security audit = 3,200 lines
Action: Deploy 3-Agent Swarm
Result:
  - Agent 1: Critical vulnerabilities found
  - Agent 2: 47 files need patching
  - Agent 3: 12 issues marked P0, deployment blocked
Output: Emergency remediation plan
```

### 18.8 Success Metrics

```yaml
quality_metrics:
  coverage: "All 5,784+ lines analyzed"
  accuracy: "Zero contradictions between agents"
  actionability: "Every gap has owner + deadline"
  completeness: "100% of claims validated"
  
time_metrics:
  analysis_time: "<15 minutes for 5000 lines"
  synthesis_time: "<5 minutes"
  total_turnaround: "<20 minutes from trigger to roadmap"
```

### 18.9 Integration with Other Sections

```
┌─────────────────────────────────────────────────────────────────────────────┐
║  PROTOCOL INTEGRATION MAP                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Section 4 (Subagent-Driven) ◄── Uses 3-Agent Swarm for large docs         │
│  Section 5 (Coordination) ◄────── Orchestrates agent dispatch              │
│  Section 17 (Shadow Testing) ◄─── Validates gaps found                     │
│  Section 16 (Safety) ◄─────────── Prevents deployment if gaps P0/P1        │
│                                                                             │
│  GOLDEN STANDARD ◄─────────────── All reports must follow visual protocol  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║  END OF AGENTS.md v6.2 - UNIFIED AGENTS PROTOCOL                             ║
║                                                                              ║
║  Skills Integrated: 12                                                       ║
║  Sections: 18 + 2 Appendices                                                 ║
║  Status: ACTIVE                                                              ║
║                                                                              ║
║  "I am Iron Man." - Tony Stark                                               ║
║  "I built this with 17 AI agents." - APEX OS                                 ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
```
