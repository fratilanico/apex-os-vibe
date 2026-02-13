# Vertex Runtime Configuration

## Active Project
- Project ID: `cs-poc-amjmnp0kbq2todq7xnldvpm`
- Region: `us-central1`
- Model: `gemini-2.5-pro`

## Required Vercel Environment Variables
- `VERTEX_PROJECT_ID=cs-poc-amjmnp0kbq2todq7xnldvpm`
- `VERTEX_LOCATION=us-central1`
- `VERTEX_MODEL=gemini-2.5-pro`
- `GOOGLE_APPLICATION_CREDENTIALS_BASE64=<base64 adc>`
- `USE_VERTEX_AI=true`

## Provider Stack
1. Vertex AI (primary)
2. Perplexity (fallback)
3. Groq (fallback)

## Notes
- Gemini API is disabled in the chain to avoid free-tier quota errors.
- If switching projects, validate model availability via a direct Vertex generateContent call before updating envs.
