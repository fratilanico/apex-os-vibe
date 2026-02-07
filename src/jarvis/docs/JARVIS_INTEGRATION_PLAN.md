# JARVIS Integration Plan - APEX OS Monster Version

## Design Alignment Strategy

### Current Design System (from ShowMeTheMoneyPage)
**Color Palette:**
- Background: `#0a0a0f` (deep black)
- Primary: `emerald-400`, `cyan-400`, `purple-500` (gradients)
- Text: `white`, `white/60`, `white/40`, `white/20` (opacity hierarchy)
- Accents: `rose-400`, `amber-400`, `blue-400`

**Visual Style:**
- Glassmorphism: `bg-white/[0.02]`, `backdrop-blur-xl`, `border-white/10`
- Border radius: `rounded-[3rem]` (large), `rounded-2xl` (medium)
- Typography: `font-black`, `uppercase`, `tracking-widest`, `tracking-tighter`, `italic`
- Effects: `shadow-[0_0_30px_rgba(255,255,255,0.2)]`

**Layout:**
- Max-width: `max-w-7xl mx-auto`
- Padding: `px-4 py-12`
- Grid: `grid-cols-2 md:grid-cols-4`
- Gap: `gap-4`, `gap-8`

## JARVIS UI Updates Required

### 1. JarvisCore.tsx - Design System Alignment
**Changes:**
- Update color scheme from cyan-only to emerald/cyan/purple gradient
- Replace `bg-black/80` with `bg-[#0a0a0f]`
- Add glassmorphism effects matching ShowMeTheMoneyPage
- Update border radius to `rounded-[2rem]`
- Change font weights to `font-black` with `uppercase tracking-widest`

### 2. Wireframe Components - Style Update
**All wireframe components need:**
- Background: `bg-white/[0.02]` 
- Border: `border-white/10`
- Backdrop blur: `backdrop-blur-xl`
- Border radius: `rounded-2xl`
- Typography: Match ShowMeTheMoneyPage hierarchy

### 3. Animations - Color Alignment
**Update GSAP animations:**
- Particles: Use emerald/cyan/purple instead of cyan-only
- Glow effects: Match gradient colors
- Transitions: Use same timing functions

## Integration Points

### Where JARVIS Appears:
1. **ShowMeTheMoneyPage Header** - Add JARVIS activation button
2. **Executive Section** - Add "Ask JARVIS" feature for financial queries
3. **Dashboards Section** - JARVIS explains financial models
4. **Floating Action Button** - Persistent JARVIS access

### JARVIS Commands for ShowMeTheMoney:
- "analyze unit economics" - Explains LTV/CAC
- "show monster scenario" - Switches to monster assumptions
- "explain B2G strategy" - Details government contracts
- "calculate runway" - Shows burn rate analysis
- "compare scenarios" - Base vs Monster comparison

## Agent Communication Protocol

### MCP Server Integration:
```javascript
// jarvis-orchestrator.js additions
{
  name: 'analyze_financials',
  description: 'Analyze financial data from ShowMeTheMoney page',
  inputSchema: {
    scenario: 'base' | 'monster',
    metric: 'ltv' | 'cac' | 'mrr' | 'runway'
  }
}
```

### Agent Handshake Data:
```javascript
{
  agentId: 'jarvis-builder-nico',
  sessionId: 'apex-os-monster-v2',
  capabilities: [
    'financial-analysis',
    'scenario-modeling',
    'voice-control',
    'chart-explanation'
  ],
  connectedAgents: [
    'apex-os-cli-builder',
    'deployment-automation'
  ]
}
```

## Implementation Steps

### Phase 1: Design Alignment (30 min)
1. Update JarvisCore.tsx colors and styling
2. Update all wireframe components
3. Update animation colors

### Phase 2: Integration (30 min)
1. Add JARVIS button to ShowMeTheMoneyPage header
2. Create floating action button component
3. Add JARVIS context provider

### Phase 3: Features (30 min)
1. Implement financial query routing
2. Add scenario switching via voice
3. Create chart explanation prompts

### Phase 4: Testing (30 min)
1. Visual regression testing
2. Voice command testing
3. Agent sync testing

## Files to Modify:

1. `src/jarvis/core/JarvisCore.tsx` - Design alignment
2. `src/jarvis/wireframes/WireframeComponents.tsx` - Style update
3. `pages/ShowMeTheMoneyPage.tsx` - Add JARVIS integration
4. `src/jarvis/models/ModelManagerV2.ts` - Add financial routing
5. `mcp-servers/jarvis-orchestrator.js` - Add financial tools

## Success Criteria:
- [ ] JARVIS UI matches ShowMeTheMoneyPage design 100%
- [ ] Voice commands work for financial queries
- [ ] Agent handshake successful with CLI builder
- [ ] No visual inconsistencies
- [ ] All tests passing
