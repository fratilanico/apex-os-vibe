# APEX OS VIBE

[![Vercel](https://img.shields.io/badge/Vercel-Production-black?logo=vercel)](https://apex-os-vibe.vercel.app)
[![Vertex AI](https://img.shields.io/badge/Vertex%20AI-Primary-4285F4?logo=google-cloud)](https://cloud.google.com/vertex-ai)
[![Agents](https://img.shields.io/badge/Agents-19%20Active-10b981)](https://apex-os-vibe.vercel.app/matrix)

> **The Sovereign Developer Interface** - AI-native development platform with autonomous agent swarm

---

## Status

- **Primary AI:** Vertex AI (Gemini 2.5 Pro)
- **Fallbacks:** Perplexity, Groq
- **Gemini API:** Disabled (quota protection)

---

## Quick Start

```bash
# Clone and setup
git clone <repo-url>
cd apex-os-vibe
npm install

# Local development
npm run dev

# Deploy to production
npm run build
npx vercel --prod
```

---

## Architecture

### AI Provider Stack

| Priority | Provider | Model | Status | Cost |
|----------|----------|-------|--------|------|
| 1 | **Vertex AI** | Gemini 2.5 Pro | ✅ Active | Paid (on-demand) |
| 2 | Perplexity | Sonar Reasoning Pro | ✅ Fallback | Pay-per-use |
| 3 | Groq | Llama 3.3 70B | ✅ Fallback | Free tier |

### Agent Swarm

19 specialized agents across 6 curriculum modules:

**Foundation (Free)**
- `config-agent` - Environment setup
- `doc-agent` - Documentation

**Frontend (Free)**
- `ui-agent` - UI components
- `frontend-agent` - SPA architecture

**Backend (Pro)**
- `backend-agent` - API design
- `database-agent` - Schema design
- `security-agent` - Auth & encryption

**DevOps (Pro)**
- `devops-agent` - CI/CD pipelines
- `infrastructure-agent` - Terraform/IaC
- `monitoring-agent` - Observability

**Advanced (Pro)**
- `architecture-agent` - System design
- `performance-agent` - Optimization
- `testing-agent` - TDD & coverage

**AI (Business)**
- `ai-agent` - ML/LLM integration
- `data-agent` - ETL & analytics
- `nlp-agent` - Text processing

**Specialized (Business)**
- `blockchain-agent` - Web3/Solidity
- `embedded-agent` - IoT/Firmware
- `game-agent` - Game development

---

## API Endpoints

### AI Endpoints

**POST /api/ai-unified**
```bash
curl -X POST https://apex-os-vibe.vercel.app/api/ai-unified \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Create a React button component",
    "history": []
  }'
```

**POST /api/terminal**
```bash
curl -X POST https://apex-os-vibe.vercel.app/api/terminal \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Explain useEffect hook",
    "history": []
  }'
```

### Agent Endpoints

**POST /api/agents/invoke**
```bash
curl -X POST https://apex-os-vibe.vercel.app/api/agents/invoke \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "ui-agent",
    "prompt": "Create a login form component",
    "context": { "framework": "react" }
  }'
```

---

## Environment Variables

```bash
# Primary AI Provider (Vertex AI)
VERTEX_PROJECT_ID=cs-poc-amjmnp0kbq2todq7xnldvpm
VERTEX_LOCATION=us-central1
VERTEX_MODEL=gemini-2.5-pro
USE_VERTEX_AI=true
GOOGLE_APPLICATION_CREDENTIALS_BASE64=base64_adc_blob

# Fallback Providers
PERPLEXITY_API_KEY=your_key_here
GROQ_API_KEY=your_key_here

# Database (Optional)
SUPABASE_URL=your_url
SUPABASE_ANON_KEY=your_key
```

---

## Scripts

```bash
# Agent management
npm run agents:start      # Start agent orchestrator
npm run agents:stop       # Stop all agents
npm run agents:status     # Check agent status

# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run typecheck        # TypeScript check
npm run test             # Run tests

# Utilities
./scripts/vertex-auth-check.sh    # Verify Vertex AI auth
./scripts/agent-sync.sh           # Sync agent states
```

---

## Cost Breakdown

**Monthly Infrastructure:**
- Vercel Pro: $20/month
- Vercel KV: $0 (free tier)
- Serverless: $0 (free tier)

**AI Usage (Vertex AI):**
- Input: ~$0.00125/1K chars
- Output: ~$0.00375/1K chars
- Estimated: $10-50/month (medium usage)

**Total: ~$30-70/month**

---

## Troubleshooting

**Vertex AI Authentication Issues:**
```bash
# Check auth status
./scripts/vertex-auth-check.sh

# Re-authenticate
gcloud auth login
gcloud auth application-default login
```

**Build Failures:**
```bash
# Clean and rebuild
rm -rf node_modules dist
npm install
npm run build
```

---

## Operations

- `docs/INCIDENT_REPORT_2026-02-05.md`
- `docs/CHANGELOG_2026-02-05.md`
- `docs/VERTEX_RUNTIME_CONFIG.md`

---

## License

MIT - See LICENSE file

---

Built with 🔥 by the APEX OS Team
