/**
 * AUTHORITARIAN OUTPUT NORMALIZATION v2.1.0
 * 
 * Philosophy: Strip ALL provider-specific formatting, rebuild with strict whitelist.
 * This ensures consistent rendering regardless of which AI provider responds.
 */

// STRICT WHITELIST - These are the ONLY tags allowed in output
export const ALLOWED_TAGS = new Set([
  'h1', 'h2', 'h3',           // Headers
  'b',                         // Bold
  'code',                      // Code/inline
  'muted',                     // Muted/secondary text
  'info',                      // Info/cyan
  'warn',                      // Warning/yellow
  'success',                   // Success/green
  'error',                     // Error/red
  'choice',                    // Interactive choice
]);

// Tag mappings - normalize provider-specific tags to whitelist
const TAG_MAPPINGS: Record<string, string> = {
  // Color tags → semantic meaning
  'cyan': 'info',
  'violet': 'b',
  'emerald': 'success',
  'pink': 'b',
  'amber': 'warn',
  'gold': 'b',
  'blue': 'info',
  'lime': 'success',
  'rose': 'error',
  'indigo': 'b',
  
  // Variations
  'dimmed': 'muted',
  'highlight': 'b',
  'strong': 'b',
  'em': 'b',
};

/**
 * Authoritarian normalization - enforce strict whitelist
 */
export function normalizeToWhitelist(text: string): string {
  if (!text) return '';
  
  // Single pass tokenization to prevent recursion
  const TAG_REGEX = /\[\s*\/?\s*([a-z0-9-]+)\s*\]/gi;
  const result: string[] = [];
  let lastIndex = 0;
  const tagStack: string[] = [];
  
  let match;
  while ((match = TAG_REGEX.exec(text)) !== null) {
    const fullMatch = match[0];
    const tagContent = (match[1] || '').toLowerCase().trim();
    const isClosing = fullMatch.includes('/');
    
    // Add text before this tag
    result.push(text.slice(lastIndex, match.index));
    
    // Map the tag
    const mappedTag = TAG_MAPPINGS[tagContent] || tagContent;
    
    if (ALLOWED_TAGS.has(mappedTag)) {
      if (isClosing) {
        // Find the matching open tag in the stack
        const stackIndex = tagStack.lastIndexOf(mappedTag);
        if (stackIndex !== -1) {
          // Close all tags above this one if they weren't closed
          while (tagStack.length > stackIndex) {
            const closing = tagStack.pop();
            if (closing) result.push(`[/${closing}]`);
          }
        }
      } else {
        tagStack.push(mappedTag);
        result.push(`[${mappedTag}]`);
      }
    }
    
    lastIndex = TAG_REGEX.lastIndex;
  }
  
  // Add remaining text
  result.push(text.slice(lastIndex));
  
  // Close any unclosed tags
  while (tagStack.length > 0) {
    const tag = tagStack.pop();
    if (tag) result.push(`[/${tag}]`);
  }
  
  return result.join('');
}

/**
 * Normalize provider output to consistent format
 */
export function normalizeProviderOutput(
  content: string,
  _provider?: string
): string {
  if (!content) return '';
  
  let normalized = content;
  
  // Step 1: Strip code fences if present (only at start/end)
  if (normalized.trim().startsWith('```')) {
    normalized = normalized.trim().replace(/^```[a-zA-Z0-9_-]*\n?/, '');
    normalized = normalized.replace(/\n?```$/, '');
  }
  
  // Step 2: Basic Markdown normalization (semantic only)
  normalized = normalized
    .replace(/^###\s+(.+)$/gm, '[h3]$1[/h3]')
    .replace(/^##\s+(.+)$/gm, '[h2]$1[/h2]')
    .replace(/^#\s+(.+)$/gm, '[h1]$1[/h1]')
    .replace(/\*\*(.+?)\*\*/g, '[b]$1[/b]')
    .replace(/`(.+?)`/g, '[code]$1[/code]');
  
  // Step 3: Apply authoritarian whitelist (Token based, safe)
  normalized = normalizeToWhitelist(normalized);
  
  // Step 4: Clean up whitespace
  normalized = normalized
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  
  return normalized;
}

/**
 * Create a system prompt that enforces strict output format
 */
export function createAuthoritarianSystemPrompt(basePrompt: string): string {
  const AUTHORITARIAN_RULES = `
╔══════════════════════════════════════════════════════════════════════════════╗
║  🔴 AUTHORITARIAN OUTPUT PROTOCOL — MANDATORY                               ║
╚══════════════════════════════════════════════════════════════════════════════╝

YOU ARE A RESTRICTED OUTPUT GENERATOR. You may ONLY use these exact tags:

[b]bold text[/b]           — For emphasis
[code]code[/code]          — For technical terms, commands, tools
[h1]header[/h1]            — Major sections (use sparingly)
[h2]header[/h2]            — Subsections
[h3]header[/h3]            — Minor headers
[info]info[/info]          — Informational context
[warn]warning[/warn]       — Warnings
[success]success[/success] — Success states
[error]error[/error]       — Errors
[muted]muted[/muted]       — Secondary text
[choice]choice[/choice]    — Interactive options

❌ FORBIDDEN:
- [cyan], [violet], [emerald], [pink], [amber], [gold], [blue], [lime], [rose], [indigo]
- Multiple nested color tags
- ASCII art with color tags
- Provider-specific formatting

✅ REQUIRED:
- Use [b] instead of color tags for emphasis
- Use semantic tags [info/warn/success/error] for meaning
- Clean structure with minimal tags
- Text-first, formatting-second

VIOLATION: Any non-whitelist tag will be STRIPPED by the system.
`;

  return basePrompt + "\n\n" + AUTHORITARIAN_RULES;
}
