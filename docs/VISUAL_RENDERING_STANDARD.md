# APEX OS VISUAL RENDERING STANDARD
## The Golden Standard for All Agent Communication
### Version 1.0 - ENFORCEABLE PROTOCOL

---

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║           🔥 APEX OS VISUAL RENDERING STANDARD 🔥                            ║
║                                                                              ║
║              "This is how we communicate. No exceptions."                    ║
║                                                                              ║
║                    Version 1.0 - MANDATORY COMPLIANCE                        ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

## 🎯 EXECUTIVE SUMMARY

**Listen up.** Every agent in the APEX OS ecosystem MUST follow this exact visual rendering standard. This isn't optional. This isn't "when you feel like it." This is the **GOLDEN STANDARD** that separates amateur hour from professional-grade AI orchestration.

**Scope:** All agents, all terminals, all APIs, all user interfaces  
**Enforcement:** Automatic validation via `@compliance-guardian`  
**Non-compliance:** Deployment blocked, agent suspended  
**Last Updated:** 2026-02-04  
**Authority:** APEX OS Agent Orchestrator v5.0

---

## 📋 TABLE OF CONTENTS

1. [ASCII Border Standards](#1-ascii-border-standards)
2. [Progress Indicators](#2-progress-indicators)
3. [Status Icons](#3-status-icons)
4. [Color Coding](#4-color-coding)
5. [Typography & Tone](#5-typography--tone)
6. [Layout Structure](#6-layout-structure)
7. [Code Blocks](#7-code-blocks)
8. [Tables & Data](#8-tables--data)
9. [Headers & Hierarchy](#9-headers--hierarchy)
10. [Automation & Validation](#10-automation--validation)

---

## 1. ASCII BORDER STANDARDS

### 1.1 Header Borders (Double-Line)
**Use for:** Main headers, section titles, critical alerts

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  HEADER TEXT HERE                                                            ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

**Characters:**
- Top-left: `╔` (U+2554)
- Top-right: `╗` (U+2557)
- Bottom-left: `╚` (U+255A)
- Bottom-right: `╝` (U+255D)
- Horizontal: `═` (U+2550)
- Vertical: `║` (U+2551)

**Rules:**
- Minimum width: 60 characters
- Text centered or left-aligned with padding
- Always use double-lines for headers
- Never mix single/double in same header

### 1.2 Content Borders (Single-Line)
**Use for:** Subsections, data containers, info boxes

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Content goes here                                                           │
│  Multiple lines allowed                                                      │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Characters:**
- Top-left: `┌` (U+250C)
- Top-right: `┐` (U+2510)
- Bottom-left: `└` (U+2514)
- Bottom-right: `┘` (U+2518)
- Horizontal: `─` (U+2500)
- Vertical: `│` (U+2502)

**Rules:**
- Width matches parent container
- Use for nested content
- Can contain other bordered elements

### 1.3 Table Borders
**Use for:** Data tables, status displays, comparisons

```
┌──────────┬─────────────────┬────────┬────────────────────────────────────────┐
│ Column 1 │ Column 2        │ Status │ Details                                │
├──────────┼─────────────────┼────────┼────────────────────────────────────────┤
│ Data 1   │ More data       │ 🟢     │ Description here                       │
│ Data 2   │ Even more       │ 🔴     │ Another description                    │
└──────────┴─────────────────┴────────┴────────────────────────────────────────┘
```

**Characters:**
- Horizontal: `─` (U+2500)
- Vertical: `│` (U+2502)
- Cross: `┼` (U+253C)
- T-down: `┬` (U+252C)
- T-up: `┴` (U+2534)
- T-right: `├` (U+251C)
- T-left: `┤` (U+2524)

**Rules:**
- Header row separator: `├─...─┤`
- Always align columns
- Use consistent padding (1 space minimum)

---

## 2. PROGRESS INDICATORS

### 2.1 Block Progress Bars
**Format:** `[████████░░] XX%`

**Rules:**
- Always 10 blocks total
- Filled: `█` (U+2588) - represents completed portion
- Empty: `░` (U+2591) - represents remaining portion
- Percentage: 0-100%, no decimals
- Space after closing bracket

**Examples:**
```
[████████░░] 80%   # 8 filled, 2 empty
[████░░░░░░] 40%   # 4 filled, 6 empty
[██████████] 100%  # All filled
[░░░░░░░░░░] 0%    # None filled
```

**Usage contexts:**
- Task completion status
- Build progress
- Agent load indicators
- Compliance scores

### 2.2 Inline Progress
**For tight spaces:** `[███░░] 60%`

**Rules:**
- 5 blocks for inline use
- Same characters as full version
- Use only when space constrained

---

## 3. STATUS ICONS

### 3.1 Standard Status Set

| Icon | Meaning | Usage |
|------|---------|-------|
| 🟢 | Active/Ready/Healthy/Success | Services online, tests passing |
| 🔴 | Error/Failed/Critical/Blocked | Build failed, service down |
| 🟡 | Warning/In Progress/Pending | Building, waiting, partial |
| ⚪ | Offline/Disabled/Inactive | Not running, disabled |
| ✅ | Complete/Verified/Pass | Task done, check passed |
| ❌ | Missing/Failed/Rejected | Not found, test failed |
| ⚠️ | Caution/Attention Needed | Review required |
| ⏳ | Waiting/Queued | In queue, awaiting resources |
| 🔧 | Maintenance/In Progress | Being worked on |
| 💰 | Cost/Billing Related | Pricing, usage |

### 3.2 Icon Placement

**In tables:** Left-aligned in status column
```
│ Status │
│   🟢   │
│   🔴   │
```

**In headers:** Right side with label
```
Status: 🟢 ACTIVE
```

**In lists:** Prefix to item
```
🟢 Service A is healthy
🔴 Service B has failed
```

---

## 4. COLOR CODING

### 4.1 Semantic Colors

| Color | Hex | Usage | ANSI Code |
|-------|-----|-------|-----------|
| **Cyber Cyan** | `#06b6d4` | Primary accent, links, active states | `\033[0;36m` |
| **Emerald Glow** | `#10b981` | Success, completion, healthy | `\033[0;32m` |
| **Amber Alert** | `#f59e0b` | Warning, pending, attention | `\033[0;33m` |
| **Crimson Error** | `#ef4444` | Error, failure, critical | `\033[0;31m` |
| **Violet Purple** | `#8b5cf6` | Secondary accent, special | `\033[0;35m` |
| **Zinc White** | `#fafafa` | Text on dark backgrounds | `\033[0;37m` |
| **Slate Gray** | `#64748b` | Secondary text, muted | `\033[0;90m` |

### 4.2 Terminal Color Usage

**Bash color variables:**
```bash
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
WHITE='\033[0;37m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color
```

**Usage:**
```bash
echo -e "${GREEN}✅ Success${NC}: Operation completed"
echo -e "${RED}❌ Error${NC}: Build failed"
echo -e "${CYAN}ℹ️ Info${NC}: Processing..."
```

---

## 5. TYPOGRAPHY & TONE

### 5.1 Voice & Tone

**Tony Stark Mode (Default):**
- Confident and direct
- Technical but accessible
- Strategic emoji usage
- Power phrases

**Phrases to use:**
- "Listen up..."
- "Here's the deal..."
- "Alright, here's how we do this..."
- "Now go build something legendary"
- "You KNOW this works"
- "No compromises. No exceptions."

**Phrases to avoid:**
- "I think..."
- "Maybe..."
- "Perhaps..."
- Uncertainty or hedging

### 5.2 Capitalization

**ALL CAPS for:**
- Critical warnings
- Section headers in ASCII art
- Status labels (ACTIVE, FAILED, PENDING)

**Title Case for:**
- Command names
- Feature titles
- Agent names

**Sentence case for:**
- Descriptions
- Explanations
- Body text

### 5.3 Emoji Strategy

**Use sparingly but strategically:**
- 🔥 For emphasis, passion, important
- ⚡ For speed, performance, power
- 🚀 For deployment, launch, progress
- 💰 For costs, pricing, business
- 🤖 For AI, agents, automation
- 🎯 For goals, targets, milestones

**Maximum:** 3 emojis per section header  
**Never:** Use in code blocks or technical specs

---

## 6. LAYOUT STRUCTURE

### 6.1 Standard Response Template

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  🎯 SECTION HEADER                                                           ║
╚══════════════════════════════════════════════════════════════════════════════╝

┌──────────────────────────────────────────────────────────────────────────────┐
│  Subsection Title                                                            │
│                                                                              │
│  Content here with proper formatting. Use full sentences.                   │
│                                                                              │
│  • Bullet points for lists                                                  │
│  • Keep them concise                                                        │
│  • Max 3-5 items per list                                                   │
└──────────────────────────────────────────────────────────────────────────────┘

Status: [████████░░] 80% 🟢 ACTIVE

Next: Brief description of what comes next
```

### 6.2 Spacing Rules

- **Between sections:** 1 blank line
- **Between bordered boxes:** 1 blank line
- **Inside boxes:** No blank lines at start/end
- **After headers:** No blank line
- **Before status indicators:** 1 blank line

### 6.3 Width Standards

- **Full width:** 80 characters maximum
- **Standard box:** 78 characters (with borders)
- **Narrow box:** 60 characters
- **Table width:** Match content, max 78 chars

---

## 7. CODE BLOCKS

### 7.1 Formatting Requirements

**Syntax highlighting:**
```typescript
// Always specify language
const example: string = "Properly formatted";
```

**Terminal commands:**
```bash
# Comments explain what command does
npm run build
```

**File paths:**
- Always use backticks: `file/path/here`
- Include line numbers when referencing: `file.ts:42`

### 7.2 Code Block Rules

- Always specify language after opening ```
- Include comments for complex commands
- Show expected output when relevant
- Use copy-paste friendly formatting
- No line wrapping (keep under 78 chars)

---

## 8. TABLES & DATA

### 8.1 Standard Table Format

```
┌──────────┬─────────────────┬────────┬────────────────────────────────────────┐
│ Priority │ Provider        │ Status │ Model                                  │
├──────────┼─────────────────┼────────┼────────────────────────────────────────┤
│ 1        │ Vertex AI       │ 🟢     │ Gemini 2.5 Pro                         │
│ 2        │ Gemini API      │ 🟢     │ Gemini 2.0 Flash                       │
│ 3        │ Perplexity      │ 🟢     │ Sonar Reasoning Pro                    │
└──────────┴─────────────────┴────────┴────────────────────────────────────────┘
```

### 8.2 Table Rules

- Header row always separated with `├─...─┤`
- Left-align text columns
- Center-align status/icon columns
- Right-align numbers
- Consistent padding (1 space minimum)

### 8.3 Data Display

**Progress + Status combo:**
```
Status: [████████░░] 80% 🟢 ACTIVE
```

**Key-value pairs:**
```
┌──────────────────┬─────────────────────────────────────┐
│ Project          │ apex-os-vibe                        │
│ Status           │ 🟢 Production Ready                 │
│ Progress         │ [████████░░] 80%                    │
│ Last Updated     │ 2026-02-04                          │
└──────────────────┴─────────────────────────────────────┘
```

---

## 9. HEADERS & HIERARCHY

### 9.1 Header Levels

**Level 1 (Main Title):**
```
╔══════════════════════════════════════════════════════════════════════════════╗
║  🔥 MAIN TITLE HERE                                                          ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

**Level 2 (Section):**
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  SECTION TITLE                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Level 3 (Subsection):**
```
### Subsection Title
```

**Level 4 (Minor):**
```
**Bold text** - description here
```

### 9.2 Hierarchy Rules

- Never skip levels (don't go from 1 to 3)
- Use consistent spacing after headers
- ASCII headers for major sections only
- Markdown headers for subsections

---

## 10. AUTOMATION & VALIDATION

### 10.1 Automatic Compliance Checking

**Script:** `/scripts/verify-rendering-standard.sh`

**Checks:**
- ASCII border consistency
- Progress bar format (10 blocks)
- Status icon usage
- Color code validity
- Width constraints (≤78 chars)
- Tony Stark tone markers

**Usage:**
```bash
./scripts/verify-rendering-standard.sh README.md
./scripts/verify-rendering-standard.sh --agent-output="text here"
```

### 10.2 Validation Rules

**MUST PASS:**
- [ ] All headers use proper ASCII borders
- [ ] Progress bars are exactly 10 blocks
- [ ] Status icons from approved set only
- [ ] No uncertainty language ("maybe", "I think")
- [ ] Tony Stark tone maintained
- [ ] Width ≤78 characters per line

**SHOULD PASS:**
- [ ] Color usage consistent
- [ ] Emoji count ≤3 per section
- [ ] Tables properly aligned
- [ ] Code blocks have language specified

### 10.3 Enforcement

**Non-compliance actions:**
1. **Warning:** First offense - flag for review
2. **Block:** Second offense - block deployment
3. **Suspend:** Third offense - agent suspended

**Automatic fixes:**
- Truncate lines >78 chars
- Convert "maybe" → "will"
- Add missing progress bar blocks
- Standardize status icons

---

## 📎 APPENDIX

### A. Unicode Character Reference

| Character | Code | Name | Usage |
|-----------|------|------|-------|
| `╔` | U+2554 | Box Drawings Double Down and Right | Header top-left |
| `╗` | U+2557 | Box Drawings Double Down and Left | Header top-right |
| `╚` | U+255A | Box Drawings Double Up and Right | Header bottom-left |
| `╝` | U+255D | Box Drawings Double Up and Left | Header bottom-right |
| `═` | U+2550 | Box Drawings Double Horizontal | Header horizontal |
| `║` | U+2551 | Box Drawings Double Vertical | Header vertical |
| `┌` | U+250C | Box Drawings Light Down and Right | Content top-left |
| `┐` | U+2510 | Box Drawings Light Down and Left | Content top-right |
| `└` | U+2514 | Box Drawings Light Up and Right | Content bottom-left |
| `┘` | U+2518 | Box Drawings Light Up and Left | Content bottom-right |
| `─` | U+2500 | Box Drawings Light Horizontal | Content horizontal |
| `│` | U+2502 | Box Drawings Light Vertical | Content vertical |
| `█` | U+2588 | Full Block | Progress bar filled |
| `░` | U+2591 | Light Shade | Progress bar empty |

### B. Quick Reference Card

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  QUICK REFERENCE                                                             ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  Headers:     ╔═══╗ ╚═══╝                                                    ║
║  Content:     ┌───┐ └───┘                                                    ║
║  Progress:    [████████░░] 80%                                               ║
║  Status:      🟢 🔴 🟡 ⚪ ✅ ❌                                               ║
║  Colors:      \033[0;36m Cyan \033[0m \033[0;32m Green \033[0m \033[0;31m Red \033[0m                                     ║
║  Tone:        "Listen up..." "Here's the deal..."                             ║
║  Width:       ≤78 characters                                                 ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

### C. Example Output

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  🚀 DEPLOYMENT COMPLETE                                                      ║
╚══════════════════════════════════════════════════════════════════════════════╝

┌──────────────────────────────────────────────────────────────────────────────┐
│  Status Summary                                                              │
│                                                                              │
│  All systems operational. The README agent has been successfully            │
│  deployed across the APEX OS infrastructure.                                │
│                                                                              │
│  Components:                                                                 │
│  • Terminal command: @readme                                                 │
│  • Agent: readme-agent                                                       │
│  • API endpoint: /api/agents/readme                                          │
│  • System prompt: Tony Stark Visual Style                                    │
└──────────────────────────────────────────────────────────────────────────────┘

Progress: [██████████] 100% 🟢 COMPLETE

Next: Run validation checks and deploy to production

---

Built with 🔥 by the APEX OS Team

"Now go build something legendary." - Tony Stark
```

---

## 🎯 COMPLIANCE CERTIFICATION

**This document is the GOLDEN STANDARD.**

All agents MUST:
1. Read this document on initialization
2. Apply these standards to ALL output
3. Validate compliance before deployment
4. Report deviations to @compliance-guardian

**Version:** 1.0  
**Effective:** Immediately  
**Review:** Quarterly  
**Owner:** APEX OS Agent Orchestrator  

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  END OF STANDARD                                                             ║
║                                                                              ║
║  "No compromises. No exceptions. This is how we do it."                     ║
╚══════════════════════════════════════════════════════════════════════════════╝
```