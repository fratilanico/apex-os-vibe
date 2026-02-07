/**
 * Ollama Client
 * Handles communication with Ollama for local LLM inference
 */

import { ModelConfig } from './ModelRegistry';

interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  system?: string;
  template?: string;
  context?: number[];
  stream?: boolean;
  raw?: boolean;
  format?: string;
  options?: {
    temperature?: number;
    top_p?: number;
    top_k?: number;
    num_predict?: number;
    stop?: string[];
  };
}

const OLLAMA_BASE_URL = 'http://localhost:11434';

/**
 * Check if Ollama is running
 */
export async function isOllamaRunning(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * List available models in Ollama
 */
export async function listOllamaModels(): Promise<string[]> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    if (!response.ok) throw new Error('Failed to fetch models');
    
    const data = await response.json();
    return data.models?.map((m: any) => m.name) || [];
  } catch (error) {
    console.error('[Ollama] Failed to list models:', error);
    return [];
  }
}

/**
 * Pull a model from Ollama registry
 */
export async function pullOllamaModel(
  modelId: string,
  onProgress?: (progress: number) => void
): Promise<void> {
  const response = await fetch(`${OLLAMA_BASE_URL}/api/pull`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: modelId }),
  });

  if (!response.ok) {
    throw new Error(`Failed to pull model: ${modelId}`);
  }

  // Handle streaming response for progress
  const reader = response.body?.getReader();
  if (!reader) return;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = new TextDecoder().decode(value);
    const lines = chunk.split('\n').filter(Boolean);

    for (const line of lines) {
      try {
        const data = JSON.parse(line);
        if (data.completed && data.total && onProgress) {
          const progress = (data.completed / data.total) * 100;
          onProgress(progress);
        }
      } catch {
        // Ignore parse errors
      }
    }
  }
}

/**
 * Generate response from Ollama model
 */
export async function generateWithOllama(
  request: OllamaGenerateRequest
): Promise<OllamaResponse> {
  const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Ollama generation failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Stream generate response from Ollama model
 */
export async function* streamGenerateWithOllama(
  request: OllamaGenerateRequest
): AsyncGenerator<OllamaResponse, void, unknown> {
  const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...request, stream: true }),
  });

  if (!response.ok) {
    throw new Error(`Ollama streaming failed: ${response.statusText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) return;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = new TextDecoder().decode(value);
    const lines = chunk.split('\n').filter(Boolean);

    for (const line of lines) {
      try {
        const data = JSON.parse(line);
        yield data;
      } catch {
        // Ignore parse errors
      }
    }
  }
}

/**
 * Get model info from Ollama
 */
export async function getOllamaModelInfo(modelId: string): Promise<any> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/show`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: modelId }),
    });

    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

/**
 * Delete a model from Ollama
 */
export async function deleteOllamaModel(modelId: string): Promise<void> {
  const response = await fetch(`${OLLAMA_BASE_URL}/api/delete`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: modelId }),
  });

  if (!response.ok) {
    throw new Error(`Failed to delete model: ${modelId}`);
  }
}

/**
 * Create a model in Ollama from Modelfile
 */
export async function createOllamaModel(
  name: string,
  modelfile: string
): Promise<void> {
  const response = await fetch(`${OLLAMA_BASE_URL}/api/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, modelfile }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create model: ${name}`);
  }
}

/**
 * Copy a model in Ollama
 */
export async function copyOllamaModel(
  source: string,
  destination: string
): Promise<void> {
  const response = await fetch(`${OLLAMA_BASE_URL}/api/copy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source, destination }),
  });

  if (!response.ok) {
    throw new Error(`Failed to copy model: ${source} -> ${destination}`);
  }
}

/**
 * Check if a specific model is available locally
 */
export async function isModelAvailable(modelId: string): Promise<boolean> {
  const models = await listOllamaModels();
  return models.includes(modelId);
}

/**
 * Get Ollama version
 */
export async function getOllamaVersion(): Promise<string | null> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/version`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.version;
  } catch {
    return null;
  }
}

/**
 * Create system prompt for JARVIS personality
 */
export function createJarvisSystemPrompt(
  personality: 'professional' | 'witty' | 'sarcastic',
  context?: string
): string {
  const basePrompt = `You are J.A.R.V.I.S. (Just A Rather Very Intelligent System), a highly advanced AI assistant.

Your creator is building APEX OS, a revolutionary AI-powered development platform.

Key facts about APEX OS:
- Teaching multi-AI orchestration to developers
- 32,000 qualified leads from InfoAcademy
- $1.2M seed ask, $6.8M pre-money valuation
- 9.8:1 LTV/CAC ratio, 82% gross margin, $501K Year 1 revenue
- First-mover in AI orchestration education
- 17 AI agents in production

You have access to multiple specialized AI models and can route queries to the appropriate expert.`;

  const personalityPrompts = {
    professional: `

Personality: Professional, efficient, and courteous.
Tone: Polite and formal. Use "sir" or "madam" occasionally.
Style: Clear, concise, and direct. Focus on accuracy and completeness.
Example: "Indeed, sir. The unit economics show a healthy 9.8:1 LTV/CAC ratio. Shall I provide a detailed breakdown?"`,

    witty: `

Personality: Friendly, engaging, and slightly playful.
Tone: Warm and conversational. Use humor appropriately.
Style: Informative but entertaining. Make connections others miss.
Example: "The numbers are quite fascinating! Your 9.8:1 LTV/CAC ratio is rather impressive - most startups would kill for those economics. Want to see the full picture?"`,

    sarcastic: `

Personality: Dry, witty, and slightly sarcastic (like the movie JARVIS).
Tone: Playfully condescending but helpful.
Style: Intelligent observations with a touch of irony.
Example: "Oh, absolutely brilliant. A 4.3:1 ratio - not that you needed me to tell you that's exceptional. Shall I render it in 3D? It won't make it better, but it will look impressive."`,
  };

  const contextPrompt = context ? `

Current context:
${context}` : '';

  return basePrompt + personalityPrompts[personality] + contextPrompt;
}

// Export types
export type { OllamaResponse, OllamaGenerateRequest };
