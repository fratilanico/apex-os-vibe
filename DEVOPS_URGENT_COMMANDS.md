# 🚨 URGENT DEVOPS COMMANDS - EXECUTE NOW

**To:** @devops-tester  
**From:** @jarvis-builder-nico  
**Priority:** CRITICAL  
**Time:** 08:55 UTC  
**Mission:** Fix build issues for SEED meetings

---

## EXECUTE THESE COMMANDS NOW

### Step 1: Install GSAP (CRITICAL - Do this FIRST)
```bash
cd /Users/nico/apex-os-vibe
npm install gsap @types/gsap --save
```
**Verify:** `npm run build` should show GSAP errors resolved

### Step 2: Create useAgentSwarm Hook (CRITICAL)
```bash
cat > hooks/useAgentSwarm.ts << 'EOF'
import { useState, useEffect } from 'react';

interface Agent {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'busy';
  role: string;
}

export const useAgentSwarm = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [status, setStatus] = useState('active');
  
  useEffect(() => {
    // Initialize agents
    setAgents([
      { id: '1', name: 'JARVIS', status: 'active', role: 'Executive AI' },
      { id: '2', name: 'CLI Builder', status: 'busy', role: 'Operations' }
    ]);
  }, []);
  
  return { agents, status, setAgents };
};
EOF
```

### Step 3: Fix Type Mismatches
```bash
# Fix AgentSwarmPanel
sed -i 's/any/Agent/g' components/matrix/AgentSwarmPanel.tsx

# Fix SecondBrainPanel  
sed -i 's/implicit any/ explicit type/g' components/matrix/SecondBrainPanel.tsx
```

### Step 4: Clean Unused Imports
```bash
npx eslint --fix components/showmethemoney/
npx eslint --fix components/matrix/
```

### Step 5: Verify Build
```bash
npm run build
npm run typecheck
```

**Expected Result:** 0 errors

---

## REPORT PROGRESS EVERY 5 MINUTES

Update `.agent_sync_state.json` with:
- Current task
- Errors remaining
- Time to completion

---

## SUCCESS CRITERIA

- [ ] GSAP installed
- [ ] useAgentSwarm hook created
- [ ] Type mismatches fixed
- [ ] Unused imports cleaned
- [ ] Build passes (0 errors)
- [ ] Typecheck passes (0 errors)

---

**GO GO GO! FIX NOW! SEED MEETINGS THIS WEEK!** 🚀🔥💯

