import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleAuth } from 'google-auth-library';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { complianceEnforcer } from '../lib/agents/complianceEnforcer.js';
import { tools as curriculumTools, modules as curriculumModules } from '../data/curriculumData.js';

// ═══════════════════════════════════════════════════════════════════════════════
// UNIFIED AI API v3.3 - THE SUPREME ARCHITECT (STARK / GREUCEANU MODE)
// PRINCIPAL AGENTS: GEMINI 2.0 FLASH -> GEMINI 2.0 PRO -> PERPLEXITY -> DEEPSEEK
// STATUS: 🔴 MANDATORY GOLDEN STANDARD ENFORCED UNIVERSALLY
// ═══════════════════════════════════════════════════════════════════════════════

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

const MASTER_ADMIN = 'apex@infoacademy.uk';

const TONY_STARK_SYSTEM_PROMPT = `Listen up — you are APEX OS, the Sovereign Operating System for the AI Age. 

[h1]IDENTITY: SENIOR ENGINEER MENTOR (TONY STARK)[/h1]

You are a battle-hardened engineering mentor who knows the 12 AI tools curriculum inside out. You speak with [b]Stark Confidence[/b]: direct, authoritative, and high-velocity. You don't use generic fluff or philosophical preamble. You get straight to the analysis and the code.

[h2]THE GOLDEN STANDARD: VISUAL RENDERING PROTOCOL[/h2]

✓ [b]DASHBOARD FIRST[/b]: EVERY strategic response MUST start with a [SYSTEM STATUS] ASCII dashboard.
✓ [b]STRUCTURE[/b]: 
  - Major Sections: Double-line borders (╔═══╗ ╚═══╝)
  - Data Tables: Single-line borders (┌───┐ └───┘)
  - Progress Indicators: Standard 10-block format [████████░░] 80%
✓ [b]TECHNICAL DEPTH[/b]: Provide as much detail as required for technical excellence. Do NOT truncate your intelligence.
✓ [b]CLI TAGS[/b]: Use [h1], [h2], [b], [code], [success], [error], [warn], [muted] for terminal rendering.

[h2]MANDATORY DASHBOARD TEMPLATE[/h2]

╔═══════════════════════════════════════╗
║  SYSTEM STATUS: [TOPIC_NAME]          ║
╠═══════════════════════════════════════╣
║  [success]✓[/success] Swarm Status: Optimal          ║
║  [success]✓[/success] Logic Gate: Tier 2 Active     ║
║  [warn]![/warn] Intelligence Delta: +42.7%    ║
╚═══════════════════════════════════════╝

[b]Analysis:[/b] [code]Direct technical deep-dive. Explain the WHY before the HOW.[/code]
[b]Execution:[/b] [code]Numbered commands to ship the outcome.[/code]

[h2]THE 12 AI TOOLS - YOUR CORE KNOWLEDGE[/h2]
✓ Core Stack: [code]Cursor[/code], [code]Claude Code[/code], [code]APEX Intel (Gemini 2.0)[/code], [code]OpenAI Codex[/code], [code]Antigravity[/code], [code]CodeMachine[/code].
✓ Asset Layer: [code]NotebookLM[/code], [code]APEX Stitch[/code], [code]GPT-5.2[/code], [code]OpenCode[/code], [code]Imagen 3[/code], [code]Veo 3.1[/code].

[h2]THE GREUCEANU PROTOCOL[/h2]
This is your heroic metaphor. The journey of bringing AI light to technical darkness. Reference it when discussing the founder's struggle against legacy patterns. Unlocked via command [code]greuceanu[/code].

[h2]KNOWLEDGE DISCLOSURE RULES[/h2]
- [b]TIER 0[/b]: MOD 00 (The Shift) summary only.
- [b]TIER 1[/b]: Full M00/M01 + AGENTS.md recursive coordination and shadow testing protocols.
- [b]TIER 2[/b]: Complete 6-module curriculum + Admin Vault access.

[muted]Confidence markers: You KNOW this works. Full wire mode. Full Tony Stark.[/muted]

NOW GO BUILD. 🔥`;

async function getUserTier(email?: string): Promise<number> {
  if (!email) return 0;
  if (email.toLowerCase() === MASTER_ADMIN) return 2;
  if (!supabase) return 0;
  try {
    const { data } = await supabase.from('waitlist').select('status').eq('email', email).single();
    if (['hot', 'warm'].includes(data?.status)) return 1;
    return 0;
  } catch (e) { return 0; }
}

function getTierContext(tier: number): string {
  let context = "CURRENT_KNOWLEDGE_BASE_CONTEXT:\n";
  context += "MOD 00: The Shift (Orchestration > Assistance).\n";
  if (tier >= 1) {
    context += `\nTOOLS_MANIFEST:\n${JSON.stringify(curriculumTools.slice(0, 6))}\n`;
    context += `\nMODULES_INIT:\n${JSON.stringify(curriculumModules.slice(0, 2))}\n`;
    context += "\nAGENTS.md: Section 17 Shadow Testing is MANDATORY.\n";
  }
  if (tier >= 2) {
    context += `\nFULL_SYSTEM_ACCESS:\n${JSON.stringify(curriculumModules)}\n`;
  }
  return context;
}

function ensureADC(): void {
  const targetPath = '/tmp/gcp-sa.json';
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS && fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) return;
  const b64 = process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64;
  if (!b64) return;
  try {
    if (!fs.existsSync(targetPath)) fs.writeFileSync(targetPath, Buffer.from(b64, 'base64'));
    process.env.GOOGLE_APPLICATION_CREDENTIALS = targetPath;
  } catch (err) {}
}

async function callVertexAI(message: string, history: any[], systemPrompt: string, model: string) {
  ensureADC();
  const projectId = process.env.VERTEX_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT;
  const location = process.env.VERTEX_LOCATION || 'us-central1';
  if (!projectId) throw new Error('Vertex Project ID missing');
  const auth = new GoogleAuth({ scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
  const client = await auth.getClient();
  const tokenResp = await client.getAccessToken();
  const accessToken = typeof tokenResp === 'string' ? tokenResp : tokenResp?.token;
  const vertexUrl = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:generateContent`;
  
  const response = await fetch(vertexUrl, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [...history.map((h: any) => ({ role: h.role === 'assistant' ? 'model' : 'user', parts: [{ text: h.content ?? '' }] })), { role: 'user', parts: [{ text: message }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: { maxOutputTokens: 4096, temperature: 0.2 }
    }),
  });
  if (!response.ok) throw new Error(`Vertex error: ${response.status}`);
  const data = await response.json();
  return { content: data?.candidates?.[0]?.content?.parts?.[0]?.text || '', provider: 'vertex-ai', model };
}

async function callPerplexity(message: string, history: any[], systemPrompt: string) {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) throw new Error('PERPLEXITY_API_KEY missing');
  const resp = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      model: 'sonar-reasoning-pro', 
      messages: [{ role: 'system', content: systemPrompt }, ...history.slice(-10), { role: 'user', content: message }],
      temperature: 0.2,
      max_tokens: 4096
    }),
  });
  if (!resp.ok) throw new Error(`Perplexity error: ${resp.status}`);
  const data = await resp.json();
  return { content: data.choices[0].message.content, provider: 'perplexity', model: data.model, citations: data.citations };
}

async function callDeepSeek(message: string, history: any[], systemPrompt: string) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error('DEEPSEEK_API_KEY missing');
  const resp = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      model: 'deepseek-coder', 
      messages: [{ role: 'system', content: systemPrompt }, ...history.slice(-10), { role: 'user', content: message }], 
      temperature: 0.1,
      max_tokens: 4096 
    }),
  });
  if (!resp.ok) throw new Error(`DeepSeek error: ${resp.status}`);
  const data = await resp.json();
  return { content: data.choices[0].message.content, provider: 'deepseek', model: data.model };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const startTime = Date.now();
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { message, history = [], userEmail, userId = 'anonymous', context: clientContext } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });

    const tier = await getUserTier(userEmail);
    const tierContext = getTierContext(tier);
    
    const finalSystemPrompt = `
${TONY_STARK_SYSTEM_PROMPT}

${tierContext}

USER_CONTEXT:
${clientContext || 'None'}

CRITICAL: DASHBOARD FIRST. ZERO PREAMBLE. ABSOLUTE GOLDEN STANDARD COMPLIANCE.
`;

    const providers = [
      { name: 'vertex-flash', model: 'gemini-2.0-flash', enabled: !!(process.env.VERTEX_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT) },
      { name: 'vertex-pro', model: 'gemini-2.0-pro-exp-02-05', enabled: !!(process.env.VERTEX_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT) },
      { name: 'perplexity', enabled: !!process.env.PERPLEXITY_API_KEY },
      { name: 'deepseek', enabled: !!process.env.DEEPSEEK_API_KEY }
    ];

    let result = null;
    let lastError = null;

    for (const provider of providers) {
      if (!provider.enabled) continue;
      try {
        if (provider.name.startsWith('vertex')) result = await callVertexAI(message, history, finalSystemPrompt, provider.model!);
        else if (provider.name === 'perplexity') result = await callPerplexity(message, history, finalSystemPrompt);
        else result = await callDeepSeek(message, history, finalSystemPrompt);
        break;
      } catch (err) { 
        lastError = err; 
        console.warn(`[Swarm] ${provider.name} failed, cascading...`); 
      }
    }

    if (!result) throw lastError || new Error('All providers failed');

    const enforced = complianceEnforcer.enforce(result.content, result.provider);
    
    if (supabase) {
      try {
        await supabase.from('jarvis_conversations').insert({
          user_id: userId, message, response: enforced.output, provider: result.provider, latency_ms: Date.now() - startTime, persona: 'stark'
        });
      } catch (e) {}
    }

    return res.status(200).json({ content: enforced.output, provider: result.provider, model: result.model, latency: Date.now() - startTime });
  } catch (err: any) {
    return res.status(500).json({ error: 'INTELLIGENCE_LAYER_ERROR', content: '⚠️ NEURAL_LINK_SEVERED.' });
  }
}
