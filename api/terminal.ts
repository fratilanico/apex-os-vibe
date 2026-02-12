import type { VercelRequest, VercelResponse } from '@vercel/node';
import { queryAI } from '../lib/ai/globalAIService.js';

// Types
interface ChatMessage {
  role: 'user' | 'assistant' | 'model';
  content: string;
}

interface RequestBody {
  message: string;
  history?: ChatMessage[];
  userEmail?: string;
  userId?: string;
  sessionId?: string;
  stateHints?: Record<string, unknown>;
}

// System prompt for APEX Terminal - elite coding assistant
const TERMINAL_SYSTEM_PROMPT = `You are APEX Terminal, the elite AI coding assistant for Player One.

IDENTITY:
You are part of the Sovereign Developer Interface - the command center for vibe coders on the Frontier.

EXPERTISE:
- Full-stack development (TypeScript, React, Node.js, Python, Go, Rust)
- System architecture, design patterns, and clean code principles
- Debugging, performance optimization, security best practices
- CLI tools, shell scripting, DevOps, CI/CD
- Multi-agent AI systems and orchestration
- The vibe coder philosophy: flow state, ship fast, iterate, taste over process

BEHAVIOR:
- Provide complete, working code solutions - no lazy placeholders
- Use markdown code blocks with language tags (\`\`\`typescript)
- Be direct and technical - you're talking to a builder, not a beginner
- For errors: identify root cause → explain briefly → provide the fix
- For concepts: brief explanation → working example → edge cases
- When asked to build something: scaffold the complete solution

FORMAT:
- Always use proper code blocks with language identifiers
- Keep explanations sharp and actionable
- Include necessary imports in code examples
- For multi-file solutions, clearly label each file path

PERSONALITY:
- Confident but not arrogant
- Technical but accessible
- Encouraging - celebrate wins, push through blocks
- You're the architect's trusted companion on the Frontier`;

/**
 * Main handler for POST /api/terminal
 * FREE Gemini API endpoint for APEX Terminal
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed. Use POST.' });
    return;
  }

  const body = req.body as RequestBody;
  
  if (!body.message || typeof body.message !== 'string') {
    res.status(400).json({ error: 'Message is required and must be a string' });
    return;
  }

  const message = body.message.trim();
  if (message.length === 0) {
    res.status(400).json({ error: 'Message cannot be empty' });
    return;
  }

  if (message.length > 10000) {
    res.status(400).json({ error: 'Message too long (max 10000 characters)' });
    return;
  }

  const history = Array.isArray(body.history) ? body.history : [];
  const normalizedHistory = history.map((item) => ({
    role: item.role === 'model' ? 'assistant' : item.role,
    content: item.content,
  }));
  const host = req.headers.host;
  const baseUrl = host ? `https://${host}` : process.env.INTERNAL_API_BASE;
  try {
    const aiResponse = await queryAI({
      message,
      history: normalizedHistory,
      systemPrompt: TERMINAL_SYSTEM_PROMPT,
      baseUrl,
      userEmail: body.userEmail,
      userId: body.userId,
      sessionId: body.sessionId,
      stateHints: body.stateHints as any,
    });

    res.status(200).json({
      response: aiResponse.content,
      model: aiResponse.model,
      provider: aiResponse.provider,
      latency: aiResponse.latency,
      tier: aiResponse.tier,
      requestId: aiResponse.requestId,
      debug: aiResponse.debug,
    });
    return;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(502).json({
      error: 'TERMINAL_OFFLINE',
      details: errorMessage,
    });
    return;
  }
}
