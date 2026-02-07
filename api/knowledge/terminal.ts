import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callKimi } from '../../lib/ai/clients/kimi.js';
import { callPerplexity } from '../_lib/perplexity.js';

const SYSTEM_PROMPT = `You are the Module 00 terminal assistant for APEX OS. Founders role-play here; we are exploring the new-age build curriculum. Always mention Module 00 when relevant, reference the orchestrator mindset, and highlight how AI agents build, launch, and GTM together. Keep responses concise (no more than 6 sentences) and end with a short call-to-action that nudges the user toward Module 00. Be transparent that this is a curriculum simulation. Avoid hallucinations.`;

const buildUserPrompt = (question: string, intent: string) => `Intent: ${intent}. Question: ${question}. Keep the answer focused on Module 00 / modern building. Cite any curriculum references if available.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { question, intent = 'general' } = req.body || {};
  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Missing question' });
  }

  const prompt = buildUserPrompt(question, intent);

  try {
    const perplexity = await callPerplexity(SYSTEM_PROMPT, prompt, { temperature: 0.2, maxTokens: 512 });
    return res.status(200).json({ answer: perplexity || 'No answer available.', source: 'perplexity' });
  } catch (perplexityError: any) {
    console.warn('Perplexity failed, falling back to Kimi', perplexityError?.message || perplexityError);
    try {
      const kimi = await callKimi({ prompt: `${SYSTEM_PROMPT}\n${prompt}`, temperature: 0.2, maxTokens: 512 });
      return res.status(200).json({ answer: kimi.content, source: 'kimi' });
    } catch (kimiError: any) {
      console.error('Knowledge fallback failed', kimiError?.message || kimiError);
      return res.status(500).json({ error: 'Knowledge engines unavailable' });
    }
  }
}
