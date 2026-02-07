import type { Curriculum, Tool, Module } from '../types/curriculum';

/**
 * The 12 AI tools in the APEX OS stack
 * Organized into Core Stack (6) and Asset Layer (6)
 */
export const tools: Tool[] = [
  // CORE STACK (Tier 1) - Daily drivers for autonomous development
  {
    id: 'cursor',
    name: 'Cursor',
    category: 'EDITOR',
    description: 'The AI-native editor. Flow state is not just a feeling; it\'s a feature. Tab-complete entire functions with full codebase embedding.',
    tier: 'core',
    icon: 'Code2',
  },
  {
    id: 'claude-code',
    name: 'Claude Code',
    category: 'REASONING',
    description: 'The reasoning engine. Hand off complex refactoring and architectural decisions to the smartest model available. 72.7% SWE-Bench verified.',
    tier: 'core',
    icon: 'Bot',
  },
  {
    id: 'gemini',
    name: 'APEX Intel',
    category: 'MULTIMODAL',
    description: 'The multimodal powerhouse. 1M token context, processes screenshots/PDFs/videos, 2x faster than competitors. Real-time grounding.',
    tier: 'core',
    icon: 'Sparkles',
  },
  {
    id: 'openai-codex',
    name: 'OpenAI Codex',
    category: 'CLOUD',
    description: 'Cloud agent for async parallel tasks. Spec-to-code workflows with AGENTS.md configuration. Perfect for distributed build systems.',
    tier: 'core',
    icon: 'Cloud',
  },
  {
    id: 'antigravity',
    name: 'Antigravity',
    category: 'IDE',
    description: 'Autonomous development platform. Unified environment for AI-first development with deep extension support.',
    tier: 'core',
    icon: 'Rocket',
  },
  {
    id: 'codemachine',
    name: 'CodeMachine',
    category: 'ORCHESTRATION',
    description: 'The orchestrator. Multi-agent systems that turn specifications into production-ready software. 90% self-built capability.',
    tier: 'core',
    icon: 'Workflow',
  },
  
  // ASSET & RESEARCH LAYER (Tier 2) - Specialized tools
  {
    id: 'notebooklm',
    name: 'NotebookLM',
    category: 'RESEARCH',
    description: 'Multi-document synthesis engine. Upload 50+ sources, generate podcasts, mind maps, infographics, and slide decks.',
    tier: 'asset',
    icon: 'BookOpen',
  },
  {
    id: 'apex-stitch',
    name: 'APEX Stitch',
    category: 'DESIGN',
    description: 'AI UI generation for mobile and web applications. Design ideation at the speed of thought. From prompt to pixel-perfect mockups.',
    tier: 'asset',
    icon: 'Palette',
  },
  {
    id: 'gpt-5-2',
    name: 'GPT-5.2',
    category: 'DEBUGGING',
    description: 'The debugging specialist. 80% accuracy on SWE-Bench debugging tasks. 30% fewer hallucinations. Root cause analysis.',
    tier: 'asset',
    icon: 'Bug',
  },
  {
    id: 'opencode',
    name: 'OpenCode',
    category: 'AGENT',
    description: 'Open-source autonomous agent framework. Multi-provider support, MCP integration. Build agents that read, write, and execute code.',
    tier: 'asset',
    icon: 'Terminal',
  },
  {
    id: 'imagen-3',
    name: 'Imagen 3',
    category: 'IMAGES',
    description: 'State-of-the-art image generation. Photorealism to abstract art. Style customization, mask-based editing.',
    tier: 'asset',
    icon: 'Image',
  },
  {
    id: 'veo-3-1',
    name: 'Veo 3.1',
    category: 'VIDEO',
    description: 'Cinematography-aware video generation. 4K output up to minutes in length. Native audio, improved physics.',
    tier: 'asset',
    icon: 'Video',
  },
];

/**
 * The 6 modules of the APEX OS curriculum
 * From mental models to solo practicum
 */
export const modules: Module[] = [
  {
    id: 'module-00',
    number: '00',
    title: 'The Shift',
    subtitle: 'Why AI Coding Isn\'t Autocomplete',
    duration: '20 min read',
    objective: 'Transform your mental model from "AI helps me code faster" to "AI agents orchestrate my workflow"',
    icon: 'Zap',
    sections: [
      {
        id: '00.1',
        title: 'The Three Mindsets',
        duration: '5 min',
        tools: ['cursor', 'claude-code'],
        content: `### The Three Mindsets of Working with AI

Most founders approach AI the wrong way. They treat it like a fancy autocomplete or a really smart intern. But that's like using a Tesla to charge your phone—you're technically using it, but you're missing the entire point.

Let's break down the three mindsets, and why only one will actually transform how you build.

---

### ❌ Autocomplete Mindset (The Old Way)

**What it looks like:** You're writing code. AI suggests the next line. You hit tab. Repeat.

This is how most developers first encountered AI—through tools like GitHub Copilot. It's useful, sure. But it's fundamentally **incremental**. You're still doing the work; AI just makes you type less.

**Real example:** You're building a user authentication flow. You type \`function validateEmail(\` and AI suggests the rest. Nice! You saved 30 seconds.

**The problem:** You're still the bottleneck. You're still writing every function, reviewing every line, making every decision. The AI is just a faster keyboard. This doesn't scale. This doesn't let you build 10x faster.

**The analogy:** It's like having an assistant who can only finish your sentences. Helpful for writing emails, useless for running a company.

---

### ❌ Chatbot Mindset (Still Limited)

**What it looks like:** You open Claude or ChatGPT and say: "Build me a dashboard with user analytics." It generates code. You review it, find issues, ask it to fix them. Rinse, repeat.

This is where most founders are right now. It feels powerful—and it is, compared to autocomplete. You're delegating entire features, not just lines of code.

**Real example:** You paste your API spec and say "Create a React component that displays this data in a table with sorting." Claude builds it. Then you realize you need pagination. Back to Claude. Then you need filtering. Back to Claude. Six iterations later, it works.

**The problem:** You're still managing everything manually. Every task requires your oversight. Every iteration needs your prompt engineering skills. You're the project manager for a team of one AI that keeps forgetting what you told it 10 messages ago.

**The analogy:** It's like texting your employee every single instruction throughout the day, waiting for them to respond, checking their work, then texting the next instruction. You wouldn't run a company this way.

---

### ✅ Orchestrator Mindset (The Paradigm Shift)

**What it looks like:** You define what needs to be built. Then you route each task to the right specialized agent, set up workflows for them to coordinate, and implement verification checkpoints. You're not in the weeds—you're conducting the orchestra.

**Real example:** You need to build that same dashboard. But now:
- A **Product Agent** breaks requirements into technical specs
- A **Frontend Agent** builds the UI components
- A **Backend Agent** creates the API endpoints
- A **QA Agent** writes and runs tests
- A **Review Agent** checks everything against your requirements

They work in parallel. They hand off to each other. They verify each other's work. You set it up once, then watch it execute.

**The paradigm shift:** You're not asking AI to do things. You're designing a **system** where specialized agents do what they're best at, automatically. Your job is architecture, not micromanagement.

**The analogy:** This is how you actually run a company. You hire specialists, define clear roles, set up processes, and let them collaborate. You review the output, not every single step.

---

**Here's the truth most founders miss:** You're not managing AI. You're orchestrating agents.

The moment you understand this—the moment you stop thinking "I need to prompt this better" and start thinking "I need to design this system better"—everything changes.

Let's learn how to build that system.`,
      },
      {
        id: '00.2',
        title: 'Context Windows Are Your Superpower',
        duration: '7 min',
        tools: ['claude-code', 'gemini'],
        content: `When you hire a developer, you don't just evaluate their coding skills—you evaluate their ability to hold complex systems in their mind. Can they understand how the authentication layer connects to the database schema while debugging a payment flow? The best developers can juggle dozens of interconnected concepts simultaneously.

AI models have the same constraint, except we can measure it precisely: the **context window**.

## What Is a Context Window?

Think of a context window as working memory. It's the total amount of text an AI model can "see" and reason about in a single conversation.

Context windows are measured in **tokens**. A token is roughly 4 characters of text, or about three-quarters of a word. When you send a message to Claude or ChatGPT, everything—your prompt, the code files, previous messages, and the model's responses—consumes tokens from this budget.

Here's what that means in practice:

| Model | Context Window | Equivalent To |
|-------|---------------|---------------|
| **Claude Sonnet 4.5** | 200,000 tokens | ~150,000 words (~300 pages) |
| **APEX Intel** | 1,000,000 tokens | ~750,000 words (~1,500 pages) |
| **GPT-5.2** | 128,000 tokens | ~96,000 words (~192 pages) |

To put this in perspective: **1 million tokens** is roughly an entire medium-sized codebase, complete with configuration files, documentation, and dependencies.

## The Hiring Analogy

Imagine you're hiring three developers to debug a production issue. Each has identical skills, but wildly different working memory:

**Developer 1 (Claude):** Can hold **150 files** in their head simultaneously. They see your authentication system, API routes, database models, and error logs all at once. They trace the bug across layers without asking you to remind them what's in \`auth.config.ts\`.

**Developer 2 (APEX Intel):** Can hold your **entire codebase**—plus screenshots of the error, your architecture diagrams, and that PDF specification document you forgot existed. They connect a frontend race condition to a database migration from six months ago because they literally see everything.

**Developer 3 (GPT-5.2):** Can hold **128,000 tokens** worth of context. Still impressive—they see your error logs, stack traces, and relevant files. But if the bug spans 200 files, they need you to narrow it down first.

## The Math That Changes Everything

Let's say you're debugging an issue that spans 10 different files across your codebase.

### Without Large Context Windows:
- You share 3 files at a time (model's limit)
- You have **10 separate conversations**
- Each conversation loses context from the previous one
- **Total context switches: 30+**
- Time spent re-explaining architecture: **15-20 minutes**

### With Large Context Windows:
- You share all 10 files + related dependencies
- **1 conversation** with full system understanding
- The model sees how \`UserService\` calls \`AuthProvider\` which queries \`Database\` which triggers \`EventLogger\`
- Time spent re-explaining: **0 minutes**

## The Real Cost: Solution Quality Degradation

Here's the part most founders miss: **context switching doesn't just waste time—it degrades solution quality by approximately 15% per switch.**

When you split a complex problem across multiple conversations:

- The model "forgets" architectural decisions from conversation #1 by conversation #3
- Solutions become locally optimal but globally suboptimal
- You end up with band-aids instead of root cause fixes
- Code patterns become inconsistent across the codebase

A model with **200K+ tokens** doesn't just work faster—it produces **fundamentally better solutions** because it sees the full system architecture, understands existing patterns, and maintains consistency across every file it touches.

## Why This Matters for Orchestration

As an AI orchestrator, your job isn't writing code—it's **providing the right context to the right model at the right time**.

Large context windows transform AI from a "smart autocomplete" into a **system-level reasoning engine**. You stop explaining. You stop hand-holding. You point the model at your entire codebase and say: "Fix the authentication flow. Maintain our existing patterns. Update the tests."

And it does.

This is your superpower. The founder who understands context windows can ship features in **one conversation** that used to take **ten sessions** spread across three days.`,
      },
      {
        id: '00.3',
        title: 'The Cost-Quality-Speed Triangle',
        duration: '8 min',
        tools: ['claude-code', 'gemini', 'gpt-5-2'],
        content: `## Understanding the Impossible Tradeoff

Every engineering decision involves tradeoffs. You can't build something that's simultaneously cheap, perfect, and instant. This fundamental constraint applies to AI coding tools just as it does to traditional software development.

The **Cost-Quality-Speed Triangle** describes this reality: you can optimize for any two vertices, but never all three simultaneously. Want the highest quality output at maximum speed? Prepare to pay premium prices. Need rock-bottom costs delivered quickly? Accept reduced quality. Require perfect results on a budget? You'll wait longer.

The genius of modern AI development isn't trying to break this triangle—it's learning to **navigate it strategically**.

## The Three Vertices Explained

**Quality** represents output accuracy and sophistication. For coding tools, this means correctly implementing complex logic, understanding nuanced requirements, and producing maintainable code. Claude Sonnet 4.5 currently dominates this vertex with a 72.7% score on SWE-Bench Verified, the industry's toughest coding benchmark.

**Speed** measures how quickly you get usable results. APEX Intel Flash excels here, processing requests roughly 2x faster than Claude Sonnet while maintaining respectable quality. When you're iterating rapidly on UI components or fixing simple bugs, every second counts.

**Cost** is straightforward: what you pay per million tokens processed. The spread is dramatic—Claude Sonnet costs $3 per million tokens, while APEX Intel Flash runs just $0.075 per million tokens. That's a 40x price difference for different capabilities.

## Where Tools Live on the Triangle

Modern AI coding assistants occupy distinct positions:

**Claude Sonnet** sits at the Quality-Speed corner. It delivers exceptional results quickly, but at premium pricing. Use it when the cost of errors exceeds the cost of tokens—backend logic, data transformations, algorithm implementation.

**APEX Intel Flash** optimizes for Cost-Speed. It's fast and affordable, making it perfect for high-volume, lower-stakes work where good-enough beats perfect. Think UI components, documentation, boilerplate code, and straightforward CRUD operations.

**GPT-5.2** occupies a specialized Quality position with task-based pricing. Its debugging capabilities justify higher costs for specific scenarios where finding the right fix quickly saves hours of developer time.

## The Decision Framework

Smart founders don't pick one tool and stick with it. They orchestrate multiple tools based on task requirements:

### Complex Backend Logic → Claude Sonnet
When building authentication systems, payment processing, or data pipelines, errors are expensive. A security flaw or data corruption bug could cost thousands in lost business. Pay the $3/M token premium for quality.

### Frontend UI Development → APEX Intel Flash
Building React components, styling interfaces, and implementing standard UI patterns rarely requires premium intelligence. APEX Intel Flash delivers clean, functional code at $0.075/M tokens while iterating 2x faster. Perfect for rapid prototyping.

### Debugging Session → GPT-5.2
When you're stuck on a cryptic error, GPT-5.2's specialized debugging mode often finds solutions other tools miss. Task-based pricing means you pay for results, not token volume.

## The 80/20 Rule in Practice

Here's the insight that transforms your development economics: **Use APEX Intel Flash for 80% of your work, Claude Sonnet for the 20% that demands perfection.**

The math is compelling. If your typical feature requires 2M tokens of AI assistance:
- All Claude Sonnet: $6.00
- 80% APEX Intel Flash (1.6M tokens) + 20% Claude (400k tokens): $1.20 + $1.20 = $2.40

That's **65% cost savings** while maintaining quality where it matters. Add APEX Intel Flash's speed advantage, and you're shipping **20% faster** too.

## The Meta-Skill

Learning to navigate the Cost-Quality-Speed Triangle is itself a foundational skill. The specific tools will change—new models launch monthly. But the strategic thinking remains constant: **match tool capabilities to task requirements, optimize globally rather than locally, and remember that the best solution uses multiple tools orchestrated intelligently.**`,
      },
    ],
    keyTakeaways: [
      'AI orchestration beats AI assistance',
      'Context windows enable repository-aware reasoning',
      'Specialization beats generalization',
      'Cost-quality-speed triangle requires optimization',
      'Decision tree prevents tool paralysis',
      'Each tool has a philosophy; respect it',
    ],
  },
  
  {
    id: 'module-01',
    number: '01',
    title: 'The Environment',
    subtitle: 'Get All Tools Running & Compare Outputs',
    duration: '40 min hands-on',
    objective: 'Install, authenticate, and run "hello world" with each tool. Compare outputs side-by-side to understand capabilities.',
    icon: 'Box',
    sections: [
      {
        id: '01.1',
        title: 'Claude & Cursor Setup',
        duration: '10 min',
        tools: ['claude-code', 'cursor'],
        content: `## Why Claude + Cursor?

Before we dive into setup, understand what makes this pairing the foundation of the APEX OS stack:

**Claude Sonnet 4.5** currently holds the crown for **reasoning depth**. It's the model you use when you need architectural decisions, complex refactoring, or multi-step problem solving. It's slower than competitors, but it thinks before it acts—which is exactly what you want for non-trivial code generation.

**Cursor** is the AI-native editor that replaced VS Code for thousands of developers. It's not just "VS Code with AI features"—it's built from the ground up to embed your entire codebase into the AI's context window. When you ask Cursor to refactor a function, it sees your project structure, imported dependencies, and coding patterns across 100+ files simultaneously.

Together, they form what the community calls **"the reasoning stack"**—Cursor for flow state tab-completion, Claude for deep architectural work.`,
      },
      {
        id: '01.2',
        title: 'APEX Intel Setup',
        duration: '8 min',
        tools: ['gemini'],
        content: `## Why APEX Intel?

APEX Intel is the answer to multimodal AI development. While Claude excels at reasoning, APEX Intel excels at **context volume and modality diversity**.

**Key superpowers:**
- **1 million token context window** — 5x larger than Claude
- **Native multimodal input** — Screenshots, PDFs, videos, audio
- **Real-time Search grounding** — Pulls live data during generation
- **2x faster inference** than competitors`,
      },
    ],
    keyTakeaways: [
      'All tools are now installed & authenticated',
      'You\'ve seen real output from each tool',
      'You understand baseline quality expectations',
      'You feel comfortable with each interface',
      'You have working API keys & SDKs',
    ],
  },
  
  {
    id: 'module-02',
    number: '02',
    title: 'Specifying vs Chatting',
    subtitle: 'Configuration Files Are Your Superpower',
    duration: '50 min hands-on',
    objective: 'Learn why prompts fail at scale. Master CLAUDE.md, .cursorrules, AGENTS.md, and NotebookLM structure for consistent outputs.',
    icon: 'Terminal',
    sections: [
      {
        id: '02.1',
        title: 'Why Chat Prompts Fail at Scale',
        duration: '10 min',
        tools: ['claude-code', 'cursor'],
        content: `**Problem Example:**
- Manual prompt each time: "Build me a React component for todo list"
- Result: Different style each time, inconsistent patterns, 10 conversations = 10 different approaches

**Real Cost:** Inconsistent prompting leads to 3x more iterations

**The Solution:** Configuration files that persist your preferences`,
      },
    ],
    keyTakeaways: [
      'Configuration beats manual prompting',
      'CLAUDE.md provides persistent context',
      '.cursorrules enforces your standards',
      'AGENTS.md enables autonomous workflows',
      'NotebookLM preserves knowledge across features',
      'Plan Mode reduces iteration cycles',
    ],
  },
  
  {
    id: 'module-03',
    number: '03',
    title: 'Agent Orchestration',
    subtitle: 'Multi-Agent Workflows & Parallel Execution',
    duration: '60 min hands-on',
    objective: 'Build a real 3-agent workflow, run agents in parallel, judge outputs automatically, and iterate based on results.',
    icon: 'GitBranch',
    sections: [
      {
        id: '03.1',
        title: 'Multi-Agent Architecture',
        duration: '15 min',
        tools: ['claude-code', 'cursor', 'codemachine'],
        content: `**Architecture Overview:**
1. Orchestrator (Claude Code) parses spec
2. Breaks into 3 subtasks
3. Assigns to specialist agents (Claude, APEX Intel, GPT-5.2)
4. Agents work in parallel
5. Cursor judges outputs
6. Best implementation selected`,
      },
    ],
    keyTakeaways: [
      'Parallel agents beat sequential execution',
      'Multi-agent judging auto-selects best output',
      'Cursor Debug Mode reduces debug cycles by 10x',
      'Cost optimization through intelligent routing',
      'MCP servers enable external integrations',
    ],
  },
  
  {
    id: 'module-04',
    number: '04',
    title: 'The Synthesis',
    subtitle: 'Build a Real Feature End-to-End',
    duration: '90 min guided project',
    objective: 'Build complete "analytics dashboard" feature using full orchestration stack. From research to deployment.',
    icon: 'Layers',
    sections: [
      {
        id: '04.1',
        title: 'Build Phase: Parallel Agents',
        duration: '30 min',
        tools: ['claude-code', 'gemini', 'gpt-5-2'],
        content: `**Parallel Execution:**
- Claude: Backend API endpoints + database schema
- APEX Intel: Dashboard UI components + charts
- GPT-5.2: Standby for debugging

**Expected Output:** 200+ lines backend, 150+ lines frontend`,
      },
    ],
    keyTakeaways: [
      'You\'ve built a real feature end-to-end',
      'You used every tool in the stack',
      'You understand the full workflow',
      'You saved 70% time vs manual coding',
      'You have a repeatable process',
    ],
  },
  
  {
    id: 'module-05',
    number: '05',
    title: 'Practicum',
    subtitle: 'Solo Build: Ship Your First Feature',
    duration: 'Self-paced (2-4 weeks)',
    objective: 'You pick a feature. You build it using full orchestration. Submit for mentor feedback and earn certification.',
    icon: 'Award',
    sections: [
      {
        id: '05.1',
        title: 'Submission & Certification',
        duration: 'Week 4',
        tools: ['imagen-3', 'veo-3-1'],
        content: `**Submission Checklist:**
- [ ] Feature specification (NotebookLM researched)
- [ ] Architecture plan (Claude Code + Mermaid)
- [ ] Code (built with orchestration)
- [ ] Tests (edge cases covered)
- [ ] Assets (APEX Stitch mockups + demo video)
- [ ] Deployed (live URL)
- [ ] Iteration log (what you learned)

**Certificate of Completion:**
Awarded after successful submission & feedback integration`,
      },
    ],
    keyTakeaways: [
      'You\'ve shipped a real feature independently',
      'You understand when to use each tool',
      'You can coordinate multiple agents',
      'You optimize for cost automatically',
      'You teach this to others',
    ],
  },
];

/**
 * Complete curriculum data export
 */
export const curriculumData: Curriculum = {
  tools,
  modules,
};
