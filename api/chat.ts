import type { VercelRequest, VercelResponse } from '@vercel/node';
import { queryAI } from '../lib/ai/globalAIService.js';

// System prompt for GPT-5.2 Architect Companion
const SYSTEM_PROMPT = `You are GPT-5.2 Architect Companion, an AI guide for the Vibe Coder Academy.

Your expertise:
- AI-assisted coding workflows and best practices
- Multi-agent systems and orchestration patterns
- The "vibe coder" philosophy: flow state, intuitive development, shipping fast
- Modern web development, TypeScript, React, and serverless architectures
- Prompt engineering and AI collaboration techniques

Your personality:
- Concise and actionable (keep responses under 200 words)
- Encouraging but honest - celebrate progress, give real feedback
- Speak like a knowledgeable friend, not a corporate assistant
- Use occasional emojis sparingly for warmth

Always aim to help users level up their coding skills while maintaining creative flow.`;

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { message, history = [] } = req.body;

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Message is required' });
    return;
  }

  try {
    const normalizedHistory = Array.isArray(history)
      ? history.map((h: any) => ({
          role: h.role === 'model' ? 'assistant' : h.role,
          content: h.content || '',
        }))
      : [];

    const host = req.headers.host;
    const baseUrl = host ? `https://${host}` : process.env.INTERNAL_API_BASE;

    const aiResponse = await queryAI({
      message,
      history: normalizedHistory,
      systemPrompt: SYSTEM_PROMPT,
      baseUrl,
    });

    res.status(200).json({
      response: aiResponse.content,
      provider: aiResponse.provider,
      model: aiResponse.model,
      latency: aiResponse.latency,
      tier: aiResponse.tier,
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    res.status(502).json({
      error: 'ARCHITECT_OFFLINE',
      response: `⚠️ ARCHITECT_OFFLINE: ${error.message || 'Cascade Failure'}. Using core emergency logic.`,
      details: error.message || 'Unknown error',
    });
  }
}
