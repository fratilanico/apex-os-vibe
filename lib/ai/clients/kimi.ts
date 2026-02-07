interface KimiRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

interface KimiResponse {
  content: string;
}

export async function callKimi(request: KimiRequest): Promise<KimiResponse> {
  const apiKey = process.env.KIMI_API_KEY?.replace(/^sk-/, 'sk-')?.trim();
  if (!apiKey) throw new Error('KIMI_API_KEY not configured');

  const response = await fetch('https://api.kimi.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: request.model || 'kimi-1',
      messages: [
        { role: 'system', content: request.prompt },
      ],
      temperature: request.temperature ?? 0.2,
      max_tokens: request.maxTokens ?? 1024,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Kimi API error: ${response.status} ${text}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content ?? data?.output ?? '';
  if (!content.trim()) {
    throw new Error('Kimi returned empty content');
  }

  return { content: content.trim() };
}
