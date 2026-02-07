# Changelog - 2026-02-05

## Infrastructure
- Switched Vertex runtime to project `cs-poc-amjmnp0kbq2todq7xnldvpm` with `gemini-2.5-pro` in `us-central1`.
- Added ADC logging for Vertex credential handling.
- Removed Gemini API from the provider chain to avoid quota 429 spam.

## API / AI
- Unified provider response handling to support Vertex primary routing.
- Updated terminal/chat/matrix endpoints to rely on `/api/ai-unified` with server-safe baseUrl.

## Documentation
- Updated README to reflect current provider stack and Vertex environment settings.
- Added incident report for Vertex recovery.
