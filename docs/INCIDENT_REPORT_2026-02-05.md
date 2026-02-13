# Incident Report - Vertex AI Recovery (2026-02-05)

## Summary
- Incident: AI endpoints returned fallback responses due to Vertex model access failures and org policy blocks.
- Impact: `/api/ai-unified`, `/api/terminal`, `/api/chat`, `/api/matrix-director` fell back to Perplexity or offline.
- Resolution: Switched Vertex project to `cs-poc-amjmnp0kbq2todq7xnldvpm`, set `gemini-2.5-pro` in `us-central1`, and enabled ADC-based auth in Vercel.

## Root Cause
- Org policy `iam.disableServiceAccountKeyCreation` blocked service account key creation in the original project.
- Vertex model access was not enabled/available in the original project/region, producing 404s.
- Gemini API free-tier quota was exhausted, causing 429s and masking primary failures.

## Resolution
- Verified model availability in the POC project by live Vertex calls using ADC.
- Set Vercel production env to:
  - `VERTEX_PROJECT_ID=cs-poc-amjmnp0kbq2todq7xnldvpm`
  - `VERTEX_LOCATION=us-central1`
  - `VERTEX_MODEL=gemini-2.5-pro`
  - `GOOGLE_APPLICATION_CREDENTIALS_BASE64` (from current ADC)
- Disabled Gemini API in the provider chain to stop 429 spam.
- Redeployed to production.

## Validation
- `/api/ai-unified` returns `provider=vertex-ai`, `model=gemini-2.5-pro`, HTTP 200.
- `/api/terminal`, `/api/chat`, `/api/matrix-director` return Vertex responses (tier 1).

## Current Provider Stack
1. Vertex AI (Gemini 2.5 Pro) - Primary
2. Perplexity (Sonar Reasoning Pro) - Fallback
3. Groq (Llama 3.3 70B) - Fallback

## Follow-ups
- Optional: enable Gemini API (paid tier) if needed.
- Optional: lift org policy and re-enable Vertex access in the original project if you want to switch back later.
