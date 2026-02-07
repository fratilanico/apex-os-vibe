# Functional Requirements Document (FRD)
## ShowMeTheMoney Enhancement - JARVIS Integration & Agent Hierarchy

**Version:** 1.0  
**Date:** February 2, 2026  
**Author:** jarvis-builder-nico  
**Status:** Ready for Implementation

---

## 1. INTRODUCTION

### 1.1 Purpose
This document specifies the functional requirements for enhancing the ShowMeTheMoney page with:
- JARVIS voice assistant integration
- Agent hierarchy visualization (Team tab)
- Content enhancements (7 sections)
- Complete navigation structure

### 1.2 Scope
- **In Scope:** All features described in this document
- **Out of Scope:** Changes to financial numbers (already correct), backend API changes

### 1.3 Definitions
- **JARVIS:** Voice-controlled AI assistant
- **Agent:** AI system component with specific role
- **Team Tab:** New section showing agent hierarchy
- **SMTM:** ShowMeTheMoney page

---

## 2. FUNCTIONAL REQUIREMENTS

### 2.1 Navigation Structure (FR-NAV)

#### FR-NAV-001: Tab Navigation
**Priority:** P0 (Critical)  
**Description:** The page must have 10 navigation tabs

**Requirements:**
- [ ] Tabs must be: Executive, Team, Pricing, Financials, GTM, Expansion, Accelerator, Fundraising, Wireframes, Risks
- [ ] Team tab must be 2nd position (between Executive and Pricing)
- [ ] Clicking tab switches to corresponding section
- [ ] Active tab has gradient background (cyan → violet)
- [ ] Inactive tabs have transparent background
- [ ] Tabs must be sticky on scroll

**Acceptance Criteria:**
```gherkin
Given I am on SMTM
When I click any tab
Then the corresponding section displays
And the tab shows active state
```

#### FR-NAV-002: Mobile Navigation
**Priority:** P0  
**Description:** Navigation must work on mobile devices

**Requirements:**
- [ ] Show abbreviated labels on mobile (Exec, Price, Finance, etc.)
- [ ] Horizontal scroll if tabs don't fit
- [ ] Touch-friendly tap targets (min 44px)

#### FR-NAV-003: Deep Linking
**Priority:** P1  
**Description:** URL hash must control active section

**Requirements:**
- [ ] URL format: `/showmethemoney#team`
- [ ] Page loads with correct section active
- [ ] Browser back/forward works

---

### 2.2 JARVIS Voice Assistant (FR-JAR)

#### FR-JAR-001: Floating Button
**Priority:** P0  
**Description:** JARVIS accessible via floating button

**Requirements:**
- [ ] Position: Fixed bottom-right (24px margin)
- [ ] Size: 56px diameter (48px mobile)
- [ ] Icon: Microphone
- [ ] Animation: Subtle pulse when idle
- [ ] Click opens chat panel

**Acceptance Criteria:**
```gherkin
Given I am on any section
When I look at bottom-right corner
Then I see JARVIS button
When I click it
Then chat panel opens
```

#### FR-JAR-002: Chat Panel
**Priority:** P0  
**Description:** Slide-up chat interface

**Requirements:**
- [ ] Slides up from bottom
- [ ] Dark theme matching SMTM
- [ ] Welcome message on open
- [ ] Quick action chips (common queries)
- [ ] Text input field
- [ ] Close button (X)
- [ ] Message history

**UI Elements:**
- User messages: Right-aligned, cyan background
- JARVIS messages: Left-aligned, violet background
- Voice waveform when listening
- Send button

#### FR-JAR-003: Voice Commands
**Priority:** P0  
**Description:** Process voice/text commands

**Command Types:**
1. **Financial Queries**
   - "What's our MRR in month 6?" → Returns $847,000
   - "What's CAC?" → Returns $150
   - "What's LTV:CAC ratio?" → Returns 9.8:1
   - "What's Year 1 revenue?" → Returns $501,000

2. **Navigation Commands**
   - "Go to pricing" → Switches to Pricing tab
   - "Show me the team" → Switches to Team tab
   - "Take me to accelerator" → Switches to Accelerator tab

3. **Explanation Commands**
   - "What is shadow branding?" → Explains concept
   - "Explain 15% equity model" → Explains model
   - "How does PPP pricing work?" → Explains PPP

4. **Agent Status Commands**
   - "Show me agent swarm" → Opens Team tab
   - "What is CLI Builder doing?" → Highlights agent

**Response Format:**
- Must be under 100 words
- Must include specific numbers
- Must be contextually relevant
- Response time < 2 seconds

#### FR-JAR-004: Voice Wake Word
**Priority:** P1  
**Description:** Activate JARVIS by voice

**Requirements:**
- [ ] Wake word: "Hey JARVIS"
- [ ] Opens chat panel automatically
- [ ] Shows listening state
- [ ] Voice waveform animates

#### FR-JAR-005: Contextual Help
**Priority:** P1  
**Description:** Help icons on financial metrics

**Requirements:**
- [ ] Help icon appears on metric hover
- [ ] Click shows JARVIS explanation popup
- [ ] Example: LTV:CAC 9.8:1 → "We earn $9.80 for every $1 spent"

---

### 2.3 Agent Hierarchy Visualization (FR-AGENT)

#### FR-AGENT-001: Team Tab Display
**Priority:** P0  
**Description:** New Team section with agent hierarchy

**Requirements:**
- [ ] Tab label: "Team"
- [ ] Title: "Multi-Agent Orchestration"
- [ ] Subtitle: "Hierarchical AI Agent Swarm with Real-Time Coordination"
- [ ] Shows 12 active agents indicator
- [ ] Shows Fork 4 badge

#### FR-AGENT-002: Founder Level
**Priority:** P0  
**Description:** Display founder agent

**Requirements:**
- [ ] Agent: APEX OS MONSTER
- [ ] Role: Founder & Chief Orchestrator
- [ ] Icon: Crown
- [ ] Full width card
- [ ] Violet/fuchsia gradient
- [ ] Status: Active

#### FR-AGENT-003: Executive Level
**Priority:** P0  
**Description:** Display 4 executive agents

**Agents:**
1. **J.A.R.V.I.S.**
   - Role: Executive AI Director
   - Icon: Brain
   - Status: Active
   - Children: 4 specialist models

2. **CLI Builder**
   - Role: Executive Operations
   - Icon: Terminal
   - Status: Busy
   - Children: 3 operational agents

3. **DevOps Swarm**
   - Role: Executive Infrastructure
   - Icon: Cloud
   - Status: Active
   - Children: 4 devops agents

4. **Content Strategist**
   - Role: Executive Content
   - Icon: FileCode
   - Status: Active
   - Children: 2 content agents

**Visual:** Blue/cyan gradient cards

#### FR-AGENT-004: Specialist Models (under JARVIS)
**Priority:** P0  
**Description:** Display 4 AI models

**Models:**
1. **QWEN** - Code Specialist
2. **DEEPSEEK** - Analysis Specialist
3. **LLAMA** - Creative Specialist
4. **PHI-3** - Logic Specialist

**Visual:** Pink/rose gradient cards

#### FR-AGENT-005: Operational Agents
**Priority:** P0  
**Description:** Display under CLI Builder

**Agents:**
1. Frontend Agent - UI/UX Implementation
2. Backend Agent - API & Services
3. Integration Agent - System Integration

**Visual:** Emerald/teal gradient

#### FR-AGENT-006: DevOps Agents
**Priority:** P0  
**Description:** Display under DevOps Swarm

**Agents:**
1. Deploy Agent - Deployment Automation
2. Monitor Agent - System Monitoring
3. Security Agent - Security & Compliance
4. Infra Agent - Infrastructure Management

**Visual:** Orange/amber gradient

#### FR-AGENT-007: Agent Cards
**Priority:** P0  
**Description:** Each agent displayed as card

**Card Contents:**
- [ ] Agent name
- [ ] Role description
- [ ] Status badge (Active/Busy/Idle/Syncing)
- [ ] Icon
- [ ] Metrics (Tasks Completed, Success Rate, Latency)
- [ ] Last action
- [ ] Capability tags (max 3 visible)

#### FR-AGENT-008: Agent Detail Panel
**Priority:** P0  
**Description:** Slide-in panel with full details

**Trigger:** Click agent card  
**Behavior:**
- [ ] Slides in from right
- [ ] Full agent details
- [ ] All metrics displayed
- [ ] All capabilities listed
- [ ] Current activity
- [ ] Subordinate agents list
- [ ] Close button

#### FR-AGENT-009: Status Indicators
**Priority:** P0  
**Description:** Visual status for each agent

**Statuses:**
- Active: Green badge
- Busy: Amber badge
- Idle: Gray badge
- Syncing: Blue badge with pulse animation

#### FR-AGENT-010: View Modes
**Priority:** P1  
**Description:** Toggle between views

**Views:**
1. **Hierarchy** (default) - Tree structure
2. **Flow** - Data flow visualization
3. **Metrics** - System statistics

#### FR-AGENT-011: Connection Lines
**Priority:** P1  
**Description:** Show relationships between agents

**Requirements:**
- [ ] Lines connect parent to child agents
- [ ] Animate on page load
- [ ] Gradient styling (white/20)

---

### 2.4 Content Enhancements (FR-CONTENT)

#### FR-CONTENT-001: Investor Narratives
**Priority:** P1  
**Description:** Enhanced descriptions for each section

**Sections to Enhance:**
1. Executive Summary - "The $50B AI Education Opportunity"
2. Pricing Strategy - "PPP-Optimized Global Pricing"
3. Financial Projections - "12-Month Path to $2.8M ARR"
4. Go-To-Market - "Zero-CAC Community-Led Growth"
5. Market Expansion - "Romania → India → West Strategy"
6. Accelerator - "15% Equity Venture Model"
7. Fundraising - "$1.2M Seed for 18-Month Runway"

**Format:**
- Hook statement (1 sentence)
- Problem/Solution framing
- Market validation (3 bullets)
- Competitive moat explanation
- Risk mitigation (3 bullets)

#### FR-CONTENT-002: Competitor Comparison Matrix
**Priority:** P1  
**Description:** Side-by-side comparison

**Location:** Executive Summary subsection  
**Competitors:**
1. Lambda School / BloomTech
2. Codecademy Pro
3. Zero to Mastery
4. Scrimba
5. Traditional Bootcamps

**Comparison Points:**
- Pricing (entry/mid/pro)
- Curriculum depth
- Community size
- Success stories
- Unique differentiator

#### FR-CONTENT-003: Risk Mitigation Strategies
**Priority:** P1  
**Description:** Enhanced risks section

**Risks to Cover:**
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Market saturation | Medium | High | Shadow branding + PPP |
| Churn | Low | Medium | Accelerator model |
| Competition | High | Medium | B2B database moat |
| Technical debt | Low | High | Multi-agent orchestration |
| Regulatory | Medium | Low | GDPR compliance |

#### FR-CONTENT-004: TAM/SAM/SOM Visualization
**Priority:** P1  
**Description:** Market opportunity pyramid

**Data:**
- TAM: $350B Global EdTech
- SAM: $50B AI/No-Code Education
- SOM: $2.8M Year 1

**Visual:** Animated pyramid or concentric circles

#### FR-CONTENT-005: Customer Testimonials
**Priority:** P1  
**Description:** Social proof section

**Location:** After Financial Projections  
**Format:** 3-5 cards with:
- Quote
- Name + Title
- Company/Outcome
- Avatar
- Metric (e.g., "Shipped MVP in 14 days")

#### FR-CONTENT-006: Milestone Timeline
**Priority:** P2  
**Description:** Visual timeline

**Milestones:**
- Month 1-3: Launch + 100 students
- Month 4-6: Accelerator cohort #1
- Month 7-9: West market launch
- Month 10-12: B2B partnerships
- Month 18: Series A ready

---

### 2.5 Animation Requirements (FR-ANIM)

#### FR-ANIM-001: Agent Card Entrance
**Priority:** P1  
**Description:** GSAP animations for agent cards

**Requirements:**
- [ ] Fade in from opacity 0 to 1
- [ ] Slide up 20px
- [ ] Duration: 0.5s per card
- [ ] Stagger delay: 0.1s between cards
- [ ] Easing: power2.out

#### FR-ANIM-002: Connection Lines
**Priority:** P1  
**Description:** Animate hierarchy lines

**Requirements:**
- [ ] Draw on page load
- [ ] Gradient animation
- [ ] Duration: 1s

#### FR-ANIM-003: Detail Panel
**Priority:** P1  
**Description:** Slide animation

**Requirements:**
- [ ] Slide in from right (x: 100 → 0)
- [ ] Duration: 0.3s
- [ ] Easing: power2.out
- [ ] Slide out on close

#### FR-ANIM-004: JARVIS Voice Waveform
**Priority:** P1  
**Description:** Animated bars when listening

**Requirements:**
- [ ] GSAP animated bars
- [ ] Cyan/violet gradient
- [ ] Responsive to audio input

---

## 3. USER INTERFACE REQUIREMENTS

### 3.1 Design System Compliance
- Must match vibe-portfolio aesthetic exactly
- Dark theme (slate-950 background)
- Gradient accents (cyan → violet → purple)
- Glassmorphism effects
- Rounded corners (2xl to 3xl)
- Monospace typography for data
- Uppercase tracking-widest for labels

### 3.2 Responsive Breakpoints
- Desktop: 1920px, 1366px
- Tablet: 768px
- Mobile: 375px

### 3.3 Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- ARIA labels
- Focus indicators
- Color contrast ≥ 4.5:1

---

## 4. INTEGRATION REQUIREMENTS

### 4.1 JARVIS Integration Points
- Floating button on all sections
- Contextual help on financial metrics
- Voice navigation between tabs
- Agent status queries link to Team tab

### 4.2 Agent Hierarchy Integration
- Team tab accessible via navigation
- JARVIS can highlight agents
- Real-time status updates (if available)
- Click agent → Detail panel

### 4.3 Content Integration
- Investor narratives in each section header
- Competitor matrix in Executive
- Testimonials after Financials
- Timeline in Executive or separate

---

## 5. DATA REQUIREMENTS

### 5.1 Financial Data (READ-ONLY)
All financial numbers are already correct:
- Year 1 Revenue: $501,000
- Month 6 MRR: $847,000
- Month 12 MRR: $1,420,000
- CAC: $150
- LTV: $1,466
- LTV:CAC: 9.8:1
- Blended ARPU: $165

### 5.2 Agent Data
Static data structure (no backend required):
- Agent names, roles, capabilities
- Metrics (tasks, success rate, latency)
- Status (active/busy/idle/syncing)
- Hierarchical relationships

---

## 6. ERROR HANDLING

### 6.1 JARVIS Errors
- Unrecognized command → Suggest available commands
- Voice recognition failure → Suggest typing
- Network error → Show offline state

### 6.2 Agent Hierarchy Errors
- Missing data → Show "N/A"
- Animation failure → Static display
- Panel won't open → Log error, continue

---

## 7. ACCEPTANCE CRITERIA SUMMARY

### Must Have (P0)
- [ ] 10 navigation tabs working
- [ ] Team tab with agent hierarchy
- [ ] JARVIS floating button
- [ ] JARVIS chat panel
- [ ] Basic voice commands (financial queries)
- [ ] Agent cards with metrics
- [ ] Agent detail panel
- [ ] All financial numbers accurate
- [ ] Design matches vibe-portfolio
- [ ] Mobile responsive

### Should Have (P1)
- [ ] Voice wake word activation
- [ ] Contextual help tooltips
- [ ] Investor narratives
- [ ] Competitor matrix
- [ ] Risk mitigation strategies
- [ ] Testimonials section
- [ ] GSAP animations
- [ ] View mode toggle

### Nice to Have (P2)
- [ ] Advanced voice natural language
- [ ] Real-time agent status updates
- [ ] Animated TAM/SAM/SOM pyramid
- [ ] Interactive milestone timeline

---

## 8. TRACEABILITY MATRIX

| Requirement ID | Gherkin Feature | Priority | Status |
|----------------|----------------|----------|--------|
| FR-NAV-001 | showmethemoney_navigation.feature | P0 | Pending |
| FR-NAV-002 | showmethemoney_navigation.feature | P0 | Pending |
| FR-JAR-001 | jarvis_voice_assistant.feature | P0 | Pending |
| FR-JAR-002 | jarvis_voice_assistant.feature | P0 | Pending |
| FR-JAR-003 | jarvis_voice_assistant.feature | P0 | Pending |
| FR-AGENT-001 | agent_hierarchy_visualization.feature | P0 | Pending |
| FR-AGENT-002 | agent_hierarchy_visualization.feature | P0 | Pending |
| FR-AGENT-007 | agent_hierarchy_visualization.feature | P0 | Pending |
| FR-AGENT-008 | agent_hierarchy_visualization.feature | P0 | Pending |

---

**END OF FUNCTIONAL REQUIREMENTS DOCUMENT**
