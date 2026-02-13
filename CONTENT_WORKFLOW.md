# CONTENT PUBLISHING WORKFLOW
## Notion → Vibe-Coder-Dashboard → InfoAcademy.uk

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║     CONTENT PIPELINE - VON FRAMEWORK v1.0                                    ║
║     "From AI generation to production - with human oversight"                ║
║                                                                              ║
║     Last Updated: 2026-02-08                                                 ║
║     Status: ACTIVE                                                           ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

## Executive Summary

**CRITICAL RULE:** Content flows from Notion through the **Vibe-Coder-Dashboard** before reaching InfoAcademy.uk.  
**NOT:** Notion → InfoAcademy.uk (direct publishing is DISABLED)

The dashboard acts as the **final approval gate** and publishing interface.

---

## Architecture Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        CONTENT PUBLISHING PIPELINE                           │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   NOTION (Content Hub)                                                       │
│   ├─ Queue 1: INGESTION                                                      │
│   │  └─ AI creates initial content drafts                                    │
│   │     • Playbooks                                                          │
│   │     • Strategies                                                         │
│   │     • Learning modules                                                   │
│   │     • Ideas & concepts                                                   │
│   │                                                                          │
│   ├─ Queue 2: 1ST REVIEW                                                     │
│   │  └─ Human editor reviews for accuracy                                    │
│   │                                                                          │
│   ├─ Queue 3: EDITORIAL                                                      │
│   │  └─ Content refinement & formatting                                      │
│   │                                                                          │
│   └─ Queue 4: FINAL QC                                                       │
│      └─ Quality check & approval                                             │
│                                                                              │
│   ↓                                                                          │
│                                                                              │
│   VIBE-CODER-DASHBOARD (Publishing Interface)                               │
│   ├─ Review Queue                                                            │
│   │  └─ See all Notion content ready for publish                             │
│   ├─ Preview Mode                                                            │
│   │  └─ See how content will look on InfoAcademy.uk                          │
│   ├─ Approval Actions                                                        │
│   │  ├─ [✓] Publish to Production                                            │
│   │  ├─ [~] Request Changes → Back to Notion                                 │
│   │  └─ [✗] Reject → Archive                                                 │
│   └─ Publish History                                                         │
│      └─ Track what went live when                                            │
│                                                                              │
│   ↓                                                                          │
│                                                                              │
│   INFOACADEMY.UK (Production)                                                │
│   └─ Live public site                                                        │
│      • SEO-optimized                                                         │
│      • Mobile-responsive                                                     │
│      • Performance-monitored                                                 │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Queue Definitions

### Queue 1: Ingestion
**Purpose:** AI content generation  
**Owner:** AI Agents (automated)  
**Actions:**
- Generate content from prompts
- Create structured documents
- Auto-tag with metadata
- Assign to Queue 2

**Content Types:**
- 📚 Playbooks (tactical guides)
- 🎯 Strategies (business frameworks)
- 🧠 Learning Modules (educational content)
- 💡 Ideas (concepts & innovations)

### Queue 2: 1st Review  
**Purpose:** Accuracy verification  
**Owner:** Content Editor  
**Actions:**
- Verify facts & data
- Check citations
- Validate claims
- Move to Queue 3 or back to Queue 1

### Queue 3: Editorial
**Purpose:** Content refinement  
**Owner:** Senior Editor  
**Actions:**
- Format for web
- Optimize for SEO
- Add visuals/media
- Ensure brand voice consistency

### Queue 4: Final QC
**Purpose:** Quality assurance  
**Owner:** Content Lead  
**Actions:**
- Final proofread
- Link validation
- Mobile preview check
- Approve for dashboard

---

## Dashboard Publishing Interface

### Review Queue View
```
┌─────────────────────────────────────────────────────────────────┐
│  PUBLISHING QUEUE                    [Filter ▼] [Search...]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [ ] 5 Strategies Ready to Publish                              │
│      └─ Last reviewed: 2 hours ago                              │
│                                                                  │
│  [ ] 3 Playbooks Awaiting Approval                              │
│      └─ Last reviewed: 5 hours ago                              │
│                                                                  │
│  [ ] 1 Learning Module in Final Review                          │
│      └─ Last reviewed: 1 day ago                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Content Preview Modal
```
┌─────────────────────────────────────────────────────────────────┐
│  CONTENT PREVIEW                                  [✕] Close     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Title: The AI-First Startup Playbook                           │
│  Type: Playbook                                                  │
│  Author: Claude Agent                                           │
│  Reviewed by: Nico                                               │
│                                                                  │
│  [Desktop Preview] [Mobile Preview] [SEO Meta]                  │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  [Rendered content preview...]                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  [✓ Publish to InfoAcademy]  [~ Request Changes]  [✗ Reject]  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Publishing Actions

### 1. Publish to Production
**Trigger:** Click [✓ Publish] in dashboard  
**Result:**
- Content pushed to InfoAcademy.uk
- CDN cache invalidated
- SEO sitemap updated
- Analytics tracking enabled
- Notification sent to team

### 2. Request Changes
**Trigger:** Click [~ Request Changes]  
**Result:**
- Content moved back to Notion Queue 3
- Comments added to Notion document
- Assigned to original editor
- Dashboard queue updated

### 3. Reject/Archive
**Trigger:** Click [✗ Reject]  
**Result:**
- Content archived in Notion
- Removed from publishing queue
- Analytics: track rejection reason
- Optional: notify content creator

---

## Technical Integration

### Notion API Integration
```typescript
// Pseudo-code for dashboard-Notion sync

interface NotionContent {
  id: string;
  title: string;
  type: 'playbook' | 'strategy' | 'module' | 'idea';
  status: 'ingestion' | 'review' | 'editorial' | 'qc' | 'approved';
  notionUrl: string;
  lastEdited: Date;
  assignedTo: string;
  metadata: {
    tags: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedReadTime: number;
  };
}

// Sync from Notion to Dashboard
async function syncNotionToDashboard(): Promise<NotionContent[]> {
  const approvedContent = await notionAPI.query({
    database_id: CONTENT_DB_ID,
    filter: {
      property: 'Status',
      select: { equals: 'Final QC Approved' }
    }
  });
  
  return approvedContent.results.map(mapToDashboardFormat);
}
```

### Dashboard → Production Pipeline
```typescript
// Publishing workflow

interface PublishAction {
  contentId: string;
  action: 'publish' | 'reject' | 'request_changes';
  reason?: string;
  publishedBy: string;
  timestamp: Date;
}

async function publishToProduction(action: PublishAction): Promise<void> {
  // 1. Validate action permissions
  await validatePermissions(action.publishedBy);
  
  // 2. Transform Notion content to web format
  const webContent = await transformNotionToWeb(action.contentId);
  
  // 3. Deploy to InfoAcademy.uk
  await deployToVercel(webContent);
  
  // 4. Update Notion status
  await notionAPI.updatePage(action.contentId, {
    status: 'Published',
    publishedAt: new Date(),
    publishedUrl: generatePublicUrl(webContent)
  });
  
  // 5. Invalidate CDN cache
  await vercelAPI.purgeCache(generatePublicUrl(webContent));
  
  // 6. Log to analytics
  await analytics.track('content_published', action);
}
```

---

## Content Types & Templates

### 1. Playbooks
**Format:** Step-by-step tactical guides  
**Notion Template:** `PLAYBOOK_TEMPLATE`  
**Dashboard Preview:** Yes  
**SEO:** High priority  
**Examples:**
- "The 72-Hour MVP Playbook"
- "AI Agent Orchestration Guide"
- "Vibe Coding Best Practices"

### 2. Strategies
**Format:** Business frameworks & methodologies  
**Notion Template:** `STRATEGY_TEMPLATE`  
**Dashboard Preview:** Yes  
**SEO:** Medium priority  
**Examples:**
- "Content Velocity Strategy"
- "Multi-Agent Scaling Framework"
- "SEED Meeting Preparation Guide"

### 3. Learning Modules
**Format:** Educational courses & tutorials  
**Notion Template:** `MODULE_TEMPLATE`  
**Dashboard Preview:** Yes  
**SEO:** High priority  
**Examples:**
- "Module 00: The Shift"
- "Module 01: The 12 AI Tools"
- "Module 02: AGENTS.md Protocol"

### 4. Ideas
**Format:** Concept explorations & innovations  
**Notion Template:** `IDEA_TEMPLATE`  
**Dashboard Preview:** No (internal only)  
**SEO:** Low priority  
**Examples:**
- "AI-Native Operating System Concepts"
- "Future of Multi-Agent Workflows"
- "Content Pipeline Automation Ideas"

---

## Quality Gates

### Before Dashboard (Notion Queues)
- [ ] Fact-check accuracy
- [ ] Verify citations & sources
- [ ] Check brand voice consistency
- [ ] Ensure mobile formatting
- [ ] Validate all links work
- [ ] SEO metadata complete
- [ ] Images optimized & attributed

### Dashboard Approval Checklist
- [ ] Preview looks correct (desktop)
- [ ] Preview looks correct (mobile)
- [ ] SEO title & description set
- [ ] URL slug is optimized
- [ ] Tags/categories assigned
- [ ] No sensitive info exposed
- [ ] Ready for public consumption

---

## Analytics & Tracking

### Dashboard Metrics
```
┌─────────────────────────────────────────────────────────────────┐
│  CONTENT ANALYTICS                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  PUBLISHED THIS WEEK: 12                                       │
│  ├─ Playbooks: 5                                               │
│  ├─ Strategies: 4                                              │
│  ├─ Modules: 2                                                 │
│  └─ Ideas: 1                                                   │
│                                                                  │
│  IN REVIEW: 8                                                  │
│  ├─ Queue 2 (1st Review): 3                                    │
│  ├─ Queue 3 (Editorial): 3                                     │
│  └─ Queue 4 (Final QC): 2                                      │
│                                                                  │
│  REJECTION RATE: 15%                                           │
│  AVG TIME TO PUBLISH: 2.3 days                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Production Metrics (InfoAcademy.uk)
- Page views per content piece
- Average read time
- Bounce rate
- Social shares
- Conversion to waitlist
- Search rankings

---

## Emergency Procedures

### Accidental Publish
**Scenario:** Wrong content went live  
**Action:**
1. Dashboard → [Emergency Unpublish]
2. Select content → [Revert to Draft]
3. CDN cache cleared automatically
4. Content removed from site (404)
5. Notify team via Slack

### Critical Error in Live Content
**Scenario:** Published content has serious error  
**Action:**
1. Dashboard → [Emergency Edit]
2. Quick fix in inline editor
3. [Republish] with urgency flag
4. CDN purged
5. Add to changelog

### Dashboard Down
**Scenario:** Publishing interface unavailable  
**Action:**
1. Fallback: Direct Vercel CLI deployment
2. Command: `vercel --prod` from clean repo
3. Manual Notion status updates
4. Restore dashboard ASAP

---

## Roles & Responsibilities

### AI Agents (Queue 1)
- Generate initial content
- Follow templates strictly
- Tag appropriately
- Self-review before queue submission

### Content Editor (Queue 2)
- Fact-check accuracy
- Verify citations
- Ensure clarity
- Move to Queue 3 or back to 1

### Senior Editor (Queue 3)
- Format for web
- SEO optimization
- Brand voice alignment
- Add visuals

### Content Lead (Queue 4)
- Final quality check
- Approve for dashboard
- Strategic alignment review

### Publisher (Dashboard)
- Final preview approval
- Publish to production
- Monitor performance
- Handle emergencies

---

## File Locations

**Notion:**
- Content Database: `InfoAcademy Content Hub`
- Templates: `Templates` folder
- Archive: `Published` + `Rejected` folders

**Dashboard:**
- Interface: `/admin/content` or `/dashboard/publishing`
- Queue API: `/api/content/queue`
- Publish API: `/api/content/publish`

**Production:**
- Site: https://infoacademy.uk
- CMS: Vercel + Git-based
- CDN: Vercel Edge Network

---

## Related Documentation

- `VON_RECURSIVE_COORDINATION.md` - 6-stage content pipeline
- `FULL_WIRE_ARCHITECTURE.md` - System architecture
- `AGENTS.md` - Agent protocols & rules
- `PRICING_TIERS.md` - Content monetization strategy

---

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║  REMEMBER:                                                                   ║
║                                                                              ║
║  NOTION → DASHBOARD → INFOACADEMY.UK                                        ║
║                                                                              ║
║  The dashboard is the FINAL GATE.                                            ║
║  Never publish directly from Notion to production.                           ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

**Last Updated:** 2026-02-08  
**Status:** ACTIVE  
**Owner:** @apex-os-monster
