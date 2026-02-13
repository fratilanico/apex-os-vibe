# CONTENT ARCHITECTURE - VIBE-CODER ECOSYSTEM v2.0
## Notion → Vibe-Coder Dashboard (Headless CMS) → InfoAcademy Admin Centre (Intelligent Ops) → Production

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║     CONTENT ARCHITECTURE v2.0                                                ║
║     "From Creation to Production - AI-Augmented & Container-Ready"           ║
║                                                                              ║
║     Last Updated: 2026-02-08                                                 ║
║     Status: ACTIVE                                                           ║
║     Breaking Change: Vibe-Coder is now the Headless CMS                      ║
║     Breaking Change: Admin Centre is now Intelligent Content Ops Hub         ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

## SYSTEM ARCHITECTURE (v2.0)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    CONTENT FLOW - 4 STAGE PIPELINE (v2.0)                    │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  STAGE 1                    STAGE 2                                          │
│  ┌──────────────┐          ┌──────────────────────────┐                     │
│  │              │          │                          │                     │
│  │    NOTION    │    →     │   VIBE-CODER DASHBOARD   │                     │
│  │              │          │                          │                     │
│  │  Content     │          │   ★ HEADLESS CMS ★       │                     │
│  │  Creation    │          │                          │                     │
│  │  Hub         │          │   • Content editing      │                     │
│  │              │          │   • Template engine       │                     │
│  └──────────────┘          │   • Container-ready       │                     │
│         │                  │     output formatting     │                     │
│         ↓                  │   • API endpoints for     │                     │
│  ┌──────────────┐          │     content delivery      │                     │
│  │ AI Drafts    │          │   • Version control       │                     │
│  │ Human Review │          │   • Approval workflows    │                     │
│  │ QC Pass      │          │                          │                     │
│  └──────────────┘          └──────────────────────────┘                     │
│                                       │                                      │
│                                       ↓                                      │
│  STAGE 3                                                                     │
│  ┌──────────────────────────────────────────────────────────┐               │
│  │                                                          │               │
│  │   INFOACADEMY ADMIN CENTRE - INTELLIGENT CONTENT OPS     │               │
│  │                                                          │               │
│  │   ┌──────────┐  ┌──────────┐  ┌──────────┐             │               │
│  │   │ NEWS     │  │ BLOG     │  │ LEARN    │  ...VIEWS   │               │
│  │   │ VIEW     │  │ VIEW     │  │ VIEW     │             │               │
│  │   └──────────┘  └──────────┘  └──────────┘             │               │
│  │                                                          │               │
│  │   ┌─────────────────────────────────────────────────┐   │               │
│  │   │  AI ENGINE (Kimi / Perplexity toggles)          │   │               │
│  │   │  • Content adaptation & rewriting               │   │               │
│  │   │  • Recommendations from existing content        │   │               │
│  │   │  • Customer data & ecosystem analysis           │   │               │
│  │   │  • SEO & engagement optimization                │   │               │
│  │   └─────────────────────────────────────────────────┘   │               │
│  │                                                          │               │
│  │   ┌─────────────────────────────────────────────────┐   │               │
│  │   │  TEMPLATE ENGINE                                │   │               │
│  │   │  • Newsletter templates (branded)               │   │               │
│  │   │  • Blog post templates                          │   │               │
│  │   │  • News article templates                       │   │               │
│  │   │  • Custom templates                             │   │               │
│  │   │  • Google Stitch MCP integration (designs)      │   │               │
│  │   └─────────────────────────────────────────────────┘   │               │
│  │                                                          │               │
│  │   ┌─────────────────────────────────────────────────┐   │               │
│  │   │  CONTENT EDITOR                                 │   │               │
│  │   │  • Rich text editing                            │   │               │
│  │   │  • Container preview (WYSIWYG)                  │   │               │
│  │   │  • Branding compliance checker                  │   │               │
│  │   │  • Newsletter format validator                  │   │               │
│  │   └─────────────────────────────────────────────────┘   │               │
│  │                                                          │               │
│  │   [Review] [Adapt with AI] [Edit] [Preview] [Publish]   │               │
│  │                                                          │               │
│  └──────────────────────────────────────────────────────────┘               │
│                                       │                                      │
│                                       ↓                                      │
│  STAGE 4                                                                     │
│  ┌──────────────────────────────────────────────────────────┐               │
│  │                                                          │               │
│  │   PRODUCTION - infoacademy.uk                            │               │
│  │                                                          │               │
│  │   ┌──────────┐  ┌──────────┐  ┌──────────┐             │               │
│  │   │ /news/   │  │ /blog/   │  │ /learn/  │             │               │
│  │   │ container│  │ container│  │ container│             │               │
│  │   └──────────┘  └──────────┘  └──────────┘             │               │
│  │                                                          │               │
│  │   Containers match Admin Centre views 1:1                │               │
│  │   What you see in Admin Centre = What goes live          │               │
│  │                                                          │               │
│  └──────────────────────────────────────────────────────────┘               │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## KEY CHANGE FROM v1.0: ROLE REASSIGNMENT

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  WHAT CHANGED (v1.0 → v2.0)                                                 │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  VIBE-CODER DASHBOARD:                                                       │
│  ├─ v1.0: "Editing & Approval interface"                                     │
│  └─ v2.0: ★ HEADLESS CMS ★                                                  │
│           • Produces container-ready content                                 │
│           • Owns content API endpoints                                       │
│           • Template engine for all content types                            │
│           • Version control & content delivery                               │
│                                                                              │
│  INFOACADEMY ADMIN CENTRE:                                                   │
│  ├─ v1.0: "Headless CMS layer"                                              │
│  └─ v2.0: ★ INTELLIGENT CONTENT OPS HUB ★                                   │
│           • Content-type views (News, Blog, Learn, etc.)                     │
│           • AI-powered adaptation (Kimi/Perplexity toggles)                  │
│           • Recommendations engine (from existing content + customer data)   │
│           • Content editing with rich text + WYSIWYG preview                 │
│           • Template selection (newsletter, blog, news formats)              │
│           • Branding & format compliance                                     │
│           • Google Stitch MCP integration for design assets                  │
│           • Final review gate before production                              │
│                                                                              │
│  WHY: Admin Centre views mirror production containers exactly.               │
│  Content produced in Vibe-Coder arrives shaped for its target container.     │
│  Admin Centre then adds intelligence: AI adaptation, recommendations,        │
│  editing, template application, and final QA before publish.                 │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## NAMING CONVENTIONS

### FILE NAMING STANDARD
```
[TYPE]_[CATEGORY]_[YYYYMMDD]_[VERSION]_[STATUS].[ext]

Examples:
✓ PLAYBOOK_AI_ORCHESTRATION_20260208_V1_APPROVED.md
✓ STRATEGY_CONTENT_VELOCITY_20260207_V2_REVIEW.md
✓ MODULE_00_THE_SHIFT_20260208_V3_PUBLISHED.md
✓ NEWS_CLAUDE_4_6_LAUNCH_20260205_V1_LIVE.md

NEVER:
✗ playbook-final-draft-2.docx
✗ my-article-v2-FINAL-FINAL.md
✗ content(1).txt
```

### FOLDER STRUCTURE

```
CONTENT_HUB/
├── 01_DRAFTS/
│   ├── 2026/
│   │   ├── 02_FEBRUARY/
│   │   │   ├── PLAYBOOK/
│   │   │   ├── STRATEGY/
│   │   │   ├── MODULE/
│   │   │   └── NEWS/
│   │   └── 03_MARCH/
│   └── README.md
│
├── 02_IN_REVIEW/
│   ├── FIRST_PASS/
│   ├── EDITORIAL/
│   ├── FINAL_QC/
│   └── README.md
│
├── 03_APPROVED/
│   ├── READY_FOR_ADMIN/
│   └── README.md
│
├── 04_PUBLISHED/
│   ├── 2026/
│   │   ├── 02_FEBRUARY/
│   │   │   ├── BLOG/
│   │   │   └── NEWS/
│   └── README.md
│
├── 05_ARCHIVED/
│   ├── REJECTED/
│   ├── OUTDATED/
│   └── README.md
│
├── TEMPLATES/
│   ├── NEWSLETTER_BRANDED_V1.md
│   ├── BLOG_POST_TEMPLATE_V1.md
│   ├── NEWS_ARTICLE_TEMPLATE_V1.md
│   ├── PLAYBOOK_TEMPLATE_V3.md
│   ├── STRATEGY_TEMPLATE_V2.md
│   └── MODULE_TEMPLATE_V3.md
│
└── ASSETS/
    ├── IMAGES/
    ├── DIAGRAMS/
    ├── DESIGNS/          # Google Stitch MCP exports
    └── DOWNLOADS/
```

---

## STAGE 1: NOTION - CONTENT CREATION HUB

### Purpose
Central content repository where AI and humans collaborate on content creation.

### Workflows

#### 1.1 AI Content Generation
```
TRIGGER: Content request or automated pipeline
ACTION: AI agent creates initial draft
OUTPUT: File in 01_DRAFTS/2026/MM_MONTH/TYPE/
NAMING: [TYPE]_[TOPIC]_YYYYMMDD_V1_DRAFT.md
NEXT: Move to 02_IN_REVIEW/FIRST_PASS/
```

#### 1.2 Human Review Queues

**QUEUE 1: FIRST_PASS**
```yaml
status: IN_REVIEW
folder: 02_IN_REVIEW/FIRST_PASS/
owner: Content Editor
actions:
  - VERIFY facts and data
  - CHECK citations
  - VALIDATE claims
  - ENSURE clarity
decision:
  - PASS → Move to EDITORIAL/
  - REVISE → Back to 01_DRAFTS/ with comments
  - REJECT → Move to 05_ARCHIVED/REJECTED/
```

**QUEUE 2: EDITORIAL**
```yaml
status: EDITORIAL_REVIEW
folder: 02_IN_REVIEW/EDITORIAL/
owner: Senior Editor
actions:
  - FORMAT for web
  - SEO optimization
  - ADD visuals/media
  - BRAND voice alignment
decision:
  - PASS → Move to FINAL_QC/
  - REVISE → Back to FIRST_PASS/
```

**QUEUE 3: FINAL_QC**
```yaml
status: FINAL_QC
folder: 02_IN_REVIEW/FINAL_QC/
owner: Content Lead
actions:
  - FINAL proofread
  - LINK validation
  - MOBILE preview check
  - METADATA completeness
decision:
  - APPROVE → Move to 03_APPROVED/
  - REVISE → Back to EDITORIAL/
```

### Change Tracking in Notion

Each content piece MUST include:
```yaml
metadata:
  created_date: "2026-02-08"
  created_by: "@claude-agent"
  last_modified: "2026-02-08T14:30:00Z"
  modified_by: "@nico"
  version: "v1.2"
  status: "FINAL_QC"
  
changelog:
  - date: "2026-02-08"
    version: "v1.0"
    change: "Initial AI draft created"
    author: "@claude-agent"
    
  - date: "2026-02-08"
    version: "v1.1"
    change: "Fact-check and citation verification"
    author: "@content-editor"
    
  - date: "2026-02-08"
    version: "v1.2"
    change: "SEO optimization and formatting"
    author: "@senior-editor"
```

---

## STAGE 2: VIBE-CODER DASHBOARD (HEADLESS CMS)

### Purpose
**The headless CMS layer.** Receives approved content from Notion, structures it into container-ready formats, exposes content via API endpoints, and manages content delivery to downstream systems.

### Core Responsibilities

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  VIBE-CODER DASHBOARD = HEADLESS CMS                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. CONTENT STRUCTURING                                                     │
│     • Receive approved Notion content                                       │
│     • Parse and validate structure                                          │
│     • Apply container-ready formatting                                      │
│     • Generate structured JSON payloads                                     │
│                                                                             │
│  2. CONTENT API                                                             │
│     • GET    /api/content/[type]/[slug]     (fetch content)                 │
│     • POST   /api/content/ingest            (receive from Notion)           │
│     • PUT    /api/content/[id]/update       (update content)                │
│     • DELETE /api/content/[id]/archive      (archive content)               │
│     • GET    /api/content/types             (list content types)            │
│     • GET    /api/content/templates         (list available templates)      │
│                                                                             │
│  3. CONTAINER-READY OUTPUT                                                  │
│     • Each content piece tagged with target container                       │
│     • Metadata, SEO, assets bundled per container spec                      │
│     • Output format matches what Admin Centre views expect                  │
│                                                                             │
│  4. VERSION CONTROL                                                         │
│     • Full version history per content piece                                │
│     • Diff viewer between versions                                          │
│     • Rollback capability                                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Content Type → Container Mapping

```
┌─────────────────────┬────────────────────────┬──────────────────────┐
│  CONTENT TYPE        │  CONTAINER TARGET       │  ADMIN CENTRE VIEW   │
├─────────────────────┼────────────────────────┼──────────────────────┤
│  news               │  /news/                 │  News View           │
│  blog               │  /blog/                 │  Blog View           │
│  playbook           │  /blog/playbook/        │  Blog View           │
│  strategy           │  /blog/strategy/        │  Blog View           │
│  module             │  /learn/modules/        │  Learn View          │
│  newsletter         │  (email delivery)       │  Newsletter View     │
│  resource           │  /resources/            │  Resources View      │
└─────────────────────┴────────────────────────┴──────────────────────┘
```

### API Schema

```typescript
// Content Item Schema (produced by Vibe-Coder CMS)
interface ContentItem {
  id: string;
  slug: string;
  type: 'playbook' | 'strategy' | 'module' | 'news' | 'blog' | 'newsletter' | 'resource';
  status: 'draft' | 'review' | 'approved' | 'in_admin' | 'published' | 'archived';
  targetContainer: string;  // e.g. "/news/latest", "/blog/playbook"
  
  content: {
    title: string;
    subtitle?: string;
    body: string;        // Structured HTML
    bodyMarkdown: string; // Source markdown preserved
    excerpt: string;
    readingTime: number;
  };
  
  metadata: {
    author: string;
    createdAt: string;
    modifiedAt: string;
    publishedAt?: string;
    tags: string[];
    category: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    templateId?: string;  // Which template was used
  };
  
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
    canonicalUrl: string;
  };
  
  changelog: Array<{
    version: string;
    date: string;
    change: string;
    author: string;
  }>;
  
  assets: Array<{
    type: 'image' | 'video' | 'download' | 'design';
    url: string;
    alt?: string;
    source?: 'notion' | 'stitch' | 'upload';  // Track asset origin
  }>;
}

// API Response
interface ContentAPIResponse {
  success: boolean;
  data?: ContentItem | ContentItem[];
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
  };
  error?: {
    code: string;
    message: string;
  };
}
```

---

## STAGE 3: INFOACADEMY ADMIN CENTRE (INTELLIGENT CONTENT OPS HUB)

### Purpose
**The intelligent content operations hub.** Receives container-ready content from Vibe-Coder CMS, provides content-type-specific views that mirror production containers, enables AI-powered content adaptation and recommendations, supports rich editing with branded templates, and acts as the final quality gate before production publish.

### Core Capabilities

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  INFOACADEMY ADMIN CENTRE = INTELLIGENT CONTENT OPS HUB                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. CONTENT-TYPE VIEWS (mirror production containers)                       │
│  2. AI ENGINE (Kimi / Perplexity toggles)                                   │
│  3. RECOMMENDATIONS ENGINE (existing content + customer data + ecosystem)   │
│  4. RICH CONTENT EDITOR (WYSIWYG with branding compliance)                  │
│  5. TEMPLATE SELECTOR (newsletter, blog, news + custom)                     │
│  6. DESIGN INTEGRATION (Google Stitch MCP)                                  │
│  7. FINAL REVIEW & PUBLISH GATE                                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.1 Content-Type Views

Each view mirrors its production container exactly. What you see in Admin Centre is what goes live.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ INFOACADEMY ADMIN CENTRE                                    [Admin: @nico]  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  VIEWS:                                                                     │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────────┐ ┌───────────┐           │
│  │ NEWS   │ │ BLOG   │ │ LEARN  │ │ NEWSLETTER │ │ RESOURCES │           │
│  │ VIEW   │ │ VIEW   │ │ VIEW   │ │ VIEW       │ │ VIEW      │           │
│  └────────┘ └────────┘ └────────┘ └────────────┘ └───────────┘           │
│                                                                             │
│  Each view shows content exactly as it will appear in its                   │
│  production container (/news/, /blog/, /learn/, email, /resources/)         │
│                                                                             │
│  TABS PER VIEW:                                                             │
│  [Queue] [In Review] [Scheduled] [Published] [Archived]                    │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  NEWS VIEW - Active                                               [Filter] │
│  ═══════════════════════════════════════════════════════════════════════   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  NEWS_CLAUDE_4_6_LAUNCH_20260205_V1                                │   │
│  │  Status: READY FOR REVIEW                                          │   │
│  │  From: Vibe-Coder CMS → Container: /news/latest/                  │   │
│  │  ──────────────────────────────────────────────────────────────    │   │
│  │                                                                     │   │
│  │  ┌─────────────────────────────────────────────────────────┐       │   │
│  │  │  [CONTAINER PREVIEW - exactly as /news/ will render]    │       │   │
│  │  │                                                         │       │   │
│  │  │  Claude Opus 4.6 Launches with Industry-Leading         │       │   │
│  │  │  Agentic Coding Capabilities                            │       │   │
│  │  │                                                         │       │   │
│  │  │  February 5, 2026 | AI Models | 4 min read              │       │   │
│  │  │  ...                                                    │       │   │
│  │  └─────────────────────────────────────────────────────────┘       │   │
│  │                                                                     │   │
│  │  [Edit] [Adapt with AI ▾] [Apply Template ▾] [Preview] [Publish]  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 AI Engine (Kimi / Perplexity Toggles)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  AI CONTENT ADAPTATION ENGINE                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─── AI MODEL SELECTOR ───────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  [● Kimi]  [○ Perplexity]  [○ Claude]  [○ Custom]                  │   │
│  │                                                                     │   │
│  │  Active: Kimi                                                       │   │
│  │  Context: Full content library + customer data + ecosystem          │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ADAPTATION MODES:                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  [Rewrite for Audience]                                             │   │
│  │  Adapt tone/complexity for target audience segment                  │   │
│  │  Inputs: audience level (beginner/intermediate/advanced),           │   │
│  │          persona (developer, founder, investor, student)            │   │
│  │                                                                     │   │
│  │  [SEO Optimize]                                                     │   │
│  │  Enhance for search with keyword analysis from Perplexity           │   │
│  │  Inputs: target keywords, competitor analysis                       │   │
│  │                                                                     │   │
│  │  [Expand / Condense]                                                │   │
│  │  Make longer-form or compress to summary/social post                │   │
│  │  Inputs: target word count, format (full/summary/social)            │   │
│  │                                                                     │   │
│  │  [Cross-Reference]                                                  │   │
│  │  Find and link related existing content automatically               │   │
│  │  Inputs: content library scan, relevance threshold                  │   │
│  │                                                                     │   │
│  │  [Newsletter Adapt]                                                 │   │
│  │  Reformat for newsletter delivery with branded layout               │   │
│  │  Inputs: newsletter template, section (featured/digest/brief)       │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Recommendations Engine

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  RECOMMENDATIONS ENGINE                                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  DATA SOURCES:                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  [1] Existing Content Library                                       │   │
│  │      • All published articles, playbooks, modules                   │   │
│  │      • Content performance metrics (views, engagement, shares)      │   │
│  │      • Topic coverage gaps                                          │   │
│  │                                                                     │   │
│  │  [2] Customer Data                                                  │   │
│  │      • Waitlist signups & interests                                 │   │
│  │      • User engagement patterns                                     │   │
│  │      • Feature requests & feedback                                  │   │
│  │      • Segment-level preferences                                    │   │
│  │                                                                     │   │
│  │  [3] Ecosystem Intelligence                                         │   │
│  │      • Industry trends (AI, edtech, vibe-coding)                    │   │
│  │      • Competitor content analysis                                  │   │
│  │      • Technology landscape changes                                 │   │
│  │      • Market signals                                               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  RECOMMENDATION TYPES:                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  BEFORE PUBLISH:                                                    │   │
│  │  • "This topic was covered in [X] - consider linking"               │   │
│  │  • "Customer segment [Y] engages 3x more with [format] content"    │   │
│  │  • "Trending topic: add section about [Z] for relevance"           │   │
│  │  • "Similar competitor piece ranks for [keywords] - differentiate"  │   │
│  │                                                                     │   │
│  │  CONTENT STRATEGY:                                                  │   │
│  │  • "Gap analysis: No content on [topic] despite 40% interest"      │   │
│  │  • "Top performing content type this month: [type]"                 │   │
│  │  • "Suggested next 5 articles based on engagement data"             │   │
│  │  • "Newsletter open rate highest for [topic category]"              │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.4 Template Selector

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  TEMPLATE ENGINE                                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  TEMPLATE SOURCES:                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  [1] Built-in Templates (CONTENT_HUB/TEMPLATES/)                    │   │
│  │      ├── NEWSLETTER_BRANDED_V1.md    (branded newsletter format)    │   │
│  │      ├── BLOG_POST_TEMPLATE_V1.md    (standard blog layout)         │   │
│  │      ├── NEWS_ARTICLE_TEMPLATE_V1.md (news format)                  │   │
│  │      ├── PLAYBOOK_TEMPLATE_V3.md     (long-form playbook)           │   │
│  │      ├── STRATEGY_TEMPLATE_V2.md     (strategy doc)                 │   │
│  │      └── MODULE_TEMPLATE_V3.md       (learning module)              │   │
│  │                                                                     │   │
│  │  [2] Google Stitch MCP Designs                                      │   │
│  │      • Import design assets from Stitch                             │   │
│  │      • Convert to content templates                                 │   │
│  │      • Maintain brand consistency                                   │   │
│  │      • CSS/layout extraction from designs                           │   │
│  │                                                                     │   │
│  │  [3] HTML Upload → Auto-Generate                                    │   │
│  │      • Upload any .html file                                        │   │
│  │      • System auto-extracts layout, styles, structure               │   │
│  │      • Generates reusable template from the HTML                    │   │
│  │      • Maps sections to content placeholders                        │   │
│  │      • Preserves CSS/branding from source HTML                      │   │
│  │                                                                     │   │
│  │  [4] Custom Templates                                               │   │
│  │      • Create from scratch in Admin Centre                          │   │
│  │      • Clone and modify existing templates                          │   │
│  │      • Import from external sources                                 │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  TEMPLATE APPLICATION:                                                      │
│  1. Select content piece                                                    │
│  2. Click "Apply Template"                                                  │
│  3. Choose template from library                                            │
│  4. Preview content in template                                             │
│  5. Adjust (branding, layout, sections)                                     │
│  6. Save as template variant (optional)                                     │
│                                                                             │
│  BRANDING COMPLIANCE:                                                       │
│  • All templates enforce brand guidelines automatically                     │
│  • Color palette, typography, spacing locked to brand spec                  │
│  • Newsletter format validated against email client compatibility           │
│  • Logo usage, tone of voice, CTA style enforced                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.5 Content Editor

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CONTENT EDITOR - RICH EDITING WITH CONTAINER PREVIEW                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌── EDITOR TOOLBAR ───────────────────────────────────────────────────┐   │
│  │ [B] [I] [U] [H1] [H2] [H3] [Link] [Image] [Code] [Quote]          │   │
│  │ [Table] [Divider] [Embed] [CTA Button] [Callout]                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌── SPLIT VIEW ───────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  LEFT: Editor (Markdown/Rich Text)  │  RIGHT: Container Preview    │   │
│  │  ─────────────────────────────────  │  ─────────────────────────   │   │
│  │                                     │                               │   │
│  │  # Claude Opus 4.6 Launches         │  [Rendered as it will        │   │
│  │                                     │   appear in /news/ on        │   │
│  │  Anthropic released Claude Opus     │   infoacademy.uk with        │   │
│  │  4.6 today, featuring...            │   full styling, branding,    │   │
│  │                                     │   and layout]                │   │
│  │  ## Key Features                    │                               │   │
│  │  - Agentic coding                  │                               │   │
│  │  - Computer use                    │                               │   │
│  │  - Tool use                        │                               │   │
│  │                                     │                               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌── PREVIEW MODES ────────────────────────────────────────────────────┐   │
│  │  [Desktop] [Mobile] [Newsletter Email] [Social Card] [RSS]          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌── METADATA PANEL ──────────────────────────────────────────────────┐   │
│  │  Title:       [                                              ]      │   │
│  │  Slug:        [                                              ]      │   │
│  │  Author:      [                                              ]      │   │
│  │  Category:    [ News          ▾]                                    │   │
│  │  Tags:        [ai] [claude] [models] [+]                           │   │
│  │  Template:    [ News Article V1  ▾]                                │   │
│  │  Container:   /news/latest/ (auto-mapped)                          │   │
│  │  SEO Score:   ██████████░░ 82/100 [Improve with AI]               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.6 Publish Flow

```yaml
publish_flow:
  step_1_review:
    action: "Content arrives from Vibe-Coder CMS"
    view: "Appears in correct content-type view queue"
    status: "READY FOR REVIEW"
    
  step_2_ai_adapt:
    action: "Toggle AI engine (Kimi/Perplexity)"
    options:
      - "Rewrite for audience"
      - "SEO optimize"
      - "Expand/condense"
      - "Cross-reference existing content"
      - "Newsletter adapt"
    status: "AI ADAPTED"
    
  step_3_edit:
    action: "Rich text editing with container preview"
    checks:
      - "Branding compliance"
      - "Newsletter format (if applicable)"
      - "Template applied correctly"
      - "All links valid"
      - "Assets loaded"
    status: "EDITED"
    
  step_4_recommendations:
    action: "Review AI recommendations"
    data: "Existing content + customer data + ecosystem"
    outputs:
      - "Related content links"
      - "Audience targeting suggestions"
      - "Optimal publish timing"
      - "Gap analysis"
    status: "RECOMMENDATIONS REVIEWED"
    
  step_5_preview:
    action: "Final preview in container format"
    modes: ["Desktop", "Mobile", "Newsletter Email", "Social Card"]
    verify: "Preview matches production container exactly"
    status: "PREVIEW APPROVED"
    
  step_6_publish:
    action: "Publish to production"
    options:
      - "Publish Now"
      - "Schedule for Later"
      - "Publish + Send Newsletter"
    post_publish:
      - "CDN cache invalidation"
      - "Social card generation"
      - "Newsletter queue (if applicable)"
      - "Analytics tracking initialized"
    status: "PUBLISHED"
    
notification:
  slack: "#content-team"
  email: "content@infoacademy.uk"
```

### 3.7 Rejection Flow

```yaml
rejection_flow:
  trigger: "Content doesn't meet quality bar"
  action:
    1: "Show rejection reason modal"
    2: "Options:"
    options:
      - "Factually incorrect"
      - "Off-brand voice"
      - "Quality issues"
      - "Strategic misalignment"
      - "Needs AI adaptation first"
      - "Wrong template/format"
      - "Other: [text input]"
    3: "Add comments for revision"
    4: "Route back to Vibe-Coder CMS for rework"
    5: "Notify original author + assigned editor"
  status: "REVISION REQUIRED"
```

---

## STAGE 4: PRODUCTION - infoacademy.uk

### Purpose
Public-facing website where content lives in containerized sections. Container structure matches Admin Centre views 1:1.

### Container Architecture

```
INFOACADEMY.UK
│
├── / (Homepage)
│
├── /blog/                          # Blog Container
│   ├── /playbook/                  # Playbook Sub-container
│   │   ├── ai-orchestration-playbook/
│   │   ├── vibe-coding-guide/
│   │   └── ...
│   ├── /strategy/                  # Strategy Sub-container
│   └── index.json                  # Blog listing
│
├── /news/                          # News Container
│   ├── /latest/                    # Latest News Sub-container
│   │   ├── claude-4-6-launch/
│   │   ├── gpt-5-2-announcement/
│   │   └── ...
│   ├── /archive/                   # Archived News
│   └── index.json                  # News listing
│
├── /learn/                         # Learning Container
│   ├── /modules/                   # Module Sub-container
│   │   ├── module-00-the-shift/
│   │   ├── module-01-the-tools/
│   │   └── ...
│   └── index.json                  # Learning catalog
│
└── /resources/                     # Resources Container
    ├── /playbooks/
    ├── /strategies/
    └── index.json
```

### Container ↔ Admin View Mapping

```
┌────────────────────────┬────────────────────────┐
│  PRODUCTION CONTAINER   │  ADMIN CENTRE VIEW      │
├────────────────────────┼────────────────────────┤
│  /news/                │  News View              │
│  /blog/                │  Blog View              │
│  /learn/               │  Learn View             │
│  /resources/           │  Resources View         │
│  (email delivery)      │  Newsletter View        │
├────────────────────────┼────────────────────────┤
│  RULE: 1:1 mapping.                              │
│  What you see in Admin Centre view =              │
│  What renders in the production container.        │
└───────────────────────────────────────────────────┘
```

### Content Rendering

```typescript
// Container Component
interface ContentContainerProps {
  type: 'blog' | 'news' | 'learn' | 'resources';
  slug: string;
  content: ContentItem;
}

// Blog Post Container
function BlogPostContainer({ content }: { content: ContentItem }) {
  return (
    <article className="blog-post">
      <header>
        <h1>{content.content.title}</h1>
        <p className="subtitle">{content.content.subtitle}</p>
        <div className="meta">
          <span>By {content.metadata.author}</span>
          <span>{formatDate(content.metadata.publishedAt)}</span>
          <span>{content.content.readingTime} min read</span>
        </div>
      </header>
      
      <div 
        className="content-body"
        dangerouslySetInnerHTML={{ __html: content.content.body }}
      />
      
      <footer>
        <div className="tags">
          {content.metadata.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
        <ShareButtons url={content.seo.canonicalUrl} />
      </footer>
    </article>
  );
}
```

---

## WORKFLOW SUMMARY (v2.0)

### Complete Flow Diagram

```
NOTION                    VIBE-CODER DASHBOARD        INFOACADEMY ADMIN CENTRE      PRODUCTION
(Content Creation)        (HEADLESS CMS)              (INTELLIGENT OPS HUB)         (Live Site)
  │                              │                              │                      │
  │ 1. AI/Human creates          │                              │                      │
  │    content in Notion         │                              │                      │
  │                              │                              │                      │
  │ 2. Review queues:            │                              │                      │
  │    FIRST_PASS →              │                              │                      │
  │    EDITORIAL →               │                              │                      │
  │    FINAL_QC →                │                              │                      │
  │    APPROVED                  │                              │                      │
  │                              │                              │                      │
  └─────────────────────────────>│ 3. CMS ingests content       │                      │
                                 │    • Structures to JSON       │                      │
                                 │    • Applies container format │                      │
                                 │    • Tags with target         │                      │
                                 │      container                │                      │
                                 │    • Version tracked          │                      │
                                 │                              │                      │
                                 └─────────────────────────────>│ 4. Content appears    │
                                                                │    in correct VIEW    │
                                                                │                      │
                                                                │ 5. AI Adaptation      │
                                                                │    (Kimi/Perplexity)  │
                                                                │    • Rewrite          │
                                                                │    • SEO optimize     │
                                                                │    • Cross-reference  │
                                                                │                      │
                                                                │ 6. Recommendations    │
                                                                │    • Related content  │
                                                                │    • Customer data    │
                                                                │    • Gap analysis     │
                                                                │                      │
                                                                │ 7. Edit & Template    │
                                                                │    • Rich editor      │
                                                                │    • Apply template   │
                                                                │    • Brand check      │
                                                                │    • Newsletter fmt   │
                                                                │                      │
                                                                │ 8. Preview in         │
                                                                │    container format   │
                                                                │    (WYSIWYG)          │
                                                                │                      │
                                                                │ 9. PUBLISH            │
                                                                │    └─────────────────>│
                                                                                       │
                                                                                       ▼
                                                                                   [LIVE]
                                                                                infoacademy.uk
                                                                                /news/ /blog/
                                                                                /learn/ etc.
```

---

## GOOGLE STITCH MCP INTEGRATION

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  GOOGLE STITCH MCP - DESIGN ASSET PIPELINE                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  PURPOSE: Import design assets and convert to content templates             │
│                                                                             │
│  FLOW:                                                                      │
│  1. Design created in Google Stitch                                         │
│  2. MCP connector exports design components                                │
│  3. Admin Centre imports as template:                                       │
│     • Layout structure                                                      │
│     • Color palette                                                         │
│     • Typography rules                                                      │
│     • Component positioning                                                 │
│     • Responsive breakpoints                                                │
│  4. Template available in Template Selector                                 │
│  5. Content shaped to design automatically                                  │
│                                                                             │
│  USE CASES:                                                                 │
│  • Newsletter header/footer designs → Newsletter template                   │
│  • Blog hero layouts → Blog post template                                   │
│  • Social card designs → OG image templates                                 │
│  • Landing page sections → Module templates                                 │
│                                                                             │
│  ALTERNATIVE: Create templates directly in Admin Centre                     │
│  if Stitch designs aren't available yet                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## CHANGE TRACKING & VERSIONING

### Version Numbering

```
FORMAT: v[MAJOR].[MINOR]

v1.0 - Initial creation
v1.1 - Minor edits (typo fixes, formatting)
v1.2 - Content updates (facts, data)
v2.0 - Major rewrite or restructuring

Examples:
• PLAYBOOK_AI_ORCHESTRATION_20260208_V1_0_DRAFT.md
• PLAYBOOK_AI_ORCHESTRATION_20260208_V1_1_REVIEW.md
• PLAYBOOK_AI_ORCHESTRATION_20260208_V1_2_APPROVED.md
• PLAYBOOK_AI_ORCHESTRATION_20260208_V2_0_DRAFT.md (major rewrite)
```

### Change Log Template

```markdown
# CHANGE LOG
## [TITLE]

### Current Version: v[X.Y]
### Last Updated: YYYY-MM-DD
### Status: [DRAFT/REVIEW/APPROVED/PUBLISHED]

---

## Version History

### v2.0 - 2026-02-08
**Author:** @content-lead
**Change:** Major restructuring - split into 3 sections
**Reason:** User feedback indicated complexity
**AI Adaptation:** Kimi rewrite for beginner audience
**Files Modified:**
- Added: section-01-fundamentals.md
- Added: section-02-advanced.md
- Modified: main-playbook.md (restructured)

### v1.0 - 2026-02-08
**Author:** @claude-agent
**Change:** Initial draft creation
**Reason:** Content request for AI orchestration guide
```

---

## FOLDER ORGANIZATION RULES

### Rule 1: Dates in Folders
```
CORRECT:   01_DRAFTS/2026/02_FEBRUARY/PLAYBOOK/
INCORRECT: 01_DRAFTS/February 2026/Playbooks/
```

### Rule 2: Status in Filenames
```
CORRECT:   PLAYBOOK_AI_ORCHESTRATION_20260208_V1_APPROVED.md
INCORRECT: Playbook - AI Orchestration (FINAL).docx
```

### Rule 3: Capital Letters for Constants
```
CORRECT:   CONTENT_HUB/ ├── 01_DRAFTS/ ├── TEMPLATES/
INCORRECT: content-hub/ ├── drafts/ ├── templates/
```

### Rule 4: README in Every Folder
Every folder MUST contain a README.md explaining purpose, naming conventions, ownership, and item flow.

---

## EMERGENCY PROCEDURES

### Hotfix Production Content
```bash
# 1. Identify content in Admin Centre
Content: NEWS_CRITICAL_BUG_20260208_V1_LIVE.md

# 2. Emergency edit directly in Admin Centre
# 3. Fast-track: bypass AI adaptation for critical fixes
# 4. Deploy immediately
# 5. Document with emergency changelog entry
```

### Rollback Published Content
```bash
# 1. Admin Centre → Emergency Rollback
# 2. Select content → [Rollback to Previous Version]
# 3. CDN purge (automatic on rollback)
# 4. Archive rolled-back version to 05_ARCHIVED/
# 5. Notify: Slack #content-team + Email stakeholders
```

---

## INTEGRATION CHECKLIST

### New Content Type Setup
- [ ] Create template in TEMPLATES/
- [ ] Define folder structure in 01_DRAFTS/
- [ ] Set up review queues in 02_IN_REVIEW/
- [ ] Configure Vibe-Coder CMS container mapping
- [ ] Create Admin Centre view for the content type
- [ ] Set up AI adaptation presets
- [ ] Configure recommendations for this type
- [ ] Create production container
- [ ] Test end-to-end flow
- [ ] Document in this file

---

## METRICS & MONITORING

### Admin Centre Metrics
```
Content Velocity:
• Drafts created: 12/week
• Avg time to approval: 2.3 days
• AI adaptation rate: 65% of content adapted
• Recommendation acceptance: 40%
• Template usage: 90% use built-in templates

Quality Metrics:
• Avg review cycles: 1.4
• Emergency edits: 2/month
• Rollbacks: 0/month
• Brand compliance: 98%
```

### Production Metrics
```
Content Performance:
• Avg read time: 4.2 minutes
• Bounce rate: 32%
• Social shares: 150/post
• SEO ranking: Avg position 4.5
• Newsletter open rate: 42%
• Newsletter CTR: 8.3%
```

---

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  SUMMARY v2.0                                                                ║
╚══════════════════════════════════════════════════════════════════════════════╝

NOTION (Content Creation Hub)
  └── 01_DRAFTS/ → 02_IN_REVIEW/ → 03_APPROVED/

VIBE-CODER DASHBOARD (★ HEADLESS CMS ★)
  └── Ingest → Structure → Container-ready JSON → API delivery
  └── Content types mapped to target containers

INFOACADEMY ADMIN CENTRE (★ INTELLIGENT CONTENT OPS HUB ★)
  └── Content-type VIEWS (mirror production containers 1:1)
  └── AI ENGINE: Kimi / Perplexity toggles for content adaptation
  └── RECOMMENDATIONS: From content library + customer data + ecosystem
  └── EDITOR: Rich text + WYSIWYG container preview
  └── TEMPLATES: Newsletter, Blog, News + Google Stitch MCP designs
  └── BRANDING: Auto-enforced compliance
  └── PUBLISH: Final gate → Production

PRODUCTION (infoacademy.uk)
  └── /news/ /blog/ /learn/ /resources/
  └── Containerized sections matching Admin Centre views exactly

══════════════════════════════════════════════════════════════════════════════
Last Updated: 2026-02-08
Owner: @apex-os-monster
Status: ACTIVE
Version: 2.0
══════════════════════════════════════════════════════════════════════════════
```
