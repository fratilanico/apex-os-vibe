export async function callPerplexity(
  systemPrompt: string,
  userPrompt: string,
  options: { temperature?: number; maxTokens?: number } = {}
) {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) throw new Error('PERPLEXITY_API_KEY missing');

  const invoke = async (model: string) => {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: options.temperature ?? 0.2,
        max_tokens: options.maxTokens ?? 4096,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Perplexity API Error: ${response.status} - ${err}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? '';
    if (!content.trim()) throw new Error(`Perplexity empty content for model ${model}`);
    return content;
  };

  try {
    return await invoke('sonar-reasoning-pro');
  } catch (err: any) {
    const msg = String(err?.message || '');
    if (msg.includes('Invalid model') || msg.includes('empty content')) {
      console.warn('[Perplexity] primary failed, retrying sonar-reasoning');
      return await invoke('sonar-reasoning');
    }
    throw err;
  }
}
