/**
 * GOLDEN STANDARD ENFORCER v2.1.0
 * 
 * Automatically validates and enforces Golden Standard compliance on ALL outputs.
 * This is the AUTHORITARIAN layer - no output ships without validation.
 */

import { normalizeToWhitelist } from './normalization.js';

// Golden Standard Rules
const GOLDEN_RULES = {
  // ASCII Borders
  DOUBLE_LINE_HEADER: /╔[═]+╗/,
  
  // Progress Bars - exactly 10 blocks
  PROGRESS_BAR: /\[[█░]{10}\]\s*\d+%/,
  
  // Status Icons
  VALID_ICONS: /[🟢🔴🟡⚪✅❌🔥⚡🚀💰🧠🛡️]/,
  
  // Tony Stark phrases
  STARK_PHRASES: /(Listen up|Here's the deal|No excuses|You KNOW this|Now go build)/i,
  
  // Forbidden phrases (uncertainty)
  FORBIDDEN_PHRASES: /\b(I think|maybe|perhaps|possibly|I'm not sure|could be)\b/i,
  
  // Code blocks
  CODE_BLOCK: /```[\s\S]*?```/,
  INLINE_CODE: /`[^`]+`/
};

interface ValidationResult {
  compliant: boolean;
  score: number; // 0-100
  violations: string[];
  warnings: string[];
  fixes: string[];
}

/**
 * Enforce Golden Standard on AI output
 */
export function enforceGoldenStandard(content: string): ValidationResult {
  const violations: string[] = [];
  const warnings: string[] = [];
  const fixes: string[] = [];
  let score = 100;
  
  const text = content || '';
  
  // Check 1: Has double-line header banner
  if (!GOLDEN_RULES.DOUBLE_LINE_HEADER.test(text)) {
    violations.push('Missing double-line header banner (╔═══╗)');
    score -= 15;
    fixes.push('Add ╔══════════════════╗ header to major sections');
  }
  
  // Check 2: Has progress bars (if showing percentages)
  if (text.includes('%') && !GOLDEN_RULES.PROGRESS_BAR.test(text)) {
    violations.push('Percentages must use 10-block progress bars [████████░░]');
    score -= 10;
    fixes.push('Replace "85%" with "[████████░░] 85%"');
  }
  
  // Check 3: No forbidden uncertain language
  if (GOLDEN_RULES.FORBIDDEN_PHRASES.test(text)) {
    violations.push('Found uncertain language (I think, maybe, etc)');
    score -= 20;
    fixes.push('Replace with definitive statements: "The system IS" not "I think"');
  }
  
  // Check 4: Has status icons (for dashboard outputs)
  if (text.includes('Status:') && !GOLDEN_RULES.VALID_ICONS.test(text)) {
    warnings.push('Status sections should include icons (🟢🔴🟡)');
    score -= 5;
    fixes.push('Add status icons: 🟢 Active, 🔴 Error, 🟡 Warning');
  }
  
  // Check 5: Tony Stark tone (for executive summaries)
  if (text.includes('Analysis:') && !GOLDEN_RULES.STARK_PHRASES.test(text)) {
    warnings.push('Executive summaries should use Tony Stark tone');
    score -= 5;
    fixes.push('Add: "Listen up -" or "Here\'s the deal:"');
  }
  
  // Check 6: Code formatting present (if code mentioned)
  if (/\b(code|function|api|endpoint)\b/i.test(text) && 
      !GOLDEN_RULES.CODE_BLOCK.test(text) && 
      !GOLDEN_RULES.INLINE_CODE.test(text) &&
      !text.includes('[code]')) {
    warnings.push('Code references should be in [code]tags[/code]');
    score -= 10;
    fixes.push('Wrap code in [code]...[/code] tags');
  }
  
  return {
    compliant: violations.length === 0 && score >= 80,
    score: Math.max(0, score),
    violations,
    warnings,
    fixes
  };
}

/**
 * Auto-fix Golden Standard violations
 */
export function autoFixGoldenStandard(content: string): string {
  let fixed = content || '';
  
  // Fix 1: Apply semantic normalization (Token based, safe)
  fixed = normalizeToWhitelist(fixed);
  
  // Fix 2: Convert percentages to progress bars
  fixed = fixed.replace(/(\d+)%/g, (match, p1) => {
    const percent = parseInt(p1);
    const filledCount = Math.round(percent / 10);
    const emptyCount = 10 - filledCount;
    const bar = "[" + "█".repeat(filledCount) + "░".repeat(Math.max(0, emptyCount)) + "] " + percent + "%";
    
    // Check if the match is already inside a progress bar pattern
    const idx = fixed.indexOf(match);
    if (idx > 0 && fixed[idx - 1] === ' ') {
       const prevText = fixed.substring(Math.max(0, idx - 15), idx);
       if (prevText.includes('[')) return match;
    }
    
    return bar;
  });
  
  // Fix 3: Normalize uncertain phrases to definitive ones
  fixed = fixed
    .replace(/\bI think\b/gi, 'The APEX OS analysis confirms')
    .replace(/\bmaybe\b/gi, 'specifically')
    .replace(/\bperhaps\b/gi, 'likely')
    .replace(/\bpossibly\b/gi, 'within parameters')
    .replace(/\bI'm not sure\b/gi, 'Initial synchronization suggest')
    .replace(/\bcould be\b/gi, 'is identified as');
  
  return fixed;
}

/**
 * Wrap content in APEX OS Intelligence Branding (GOLDEN STANDARD)
 */
export function wrapInIntelligence(content: string, provider: string = 'perplexity', model: string = 'sonar-reasoning-pro'): string {
  const timestamp = new Date().toISOString();
  const header = [
    '╔══════════════════════════════════════════════════════════════════════════════╗',
    '║  🧠 APEX OS UNIFIED INTELLIGENCE                                             ║',
    '╚══════════════════════════════════════════════════════════════════════════════╝',
    ''
  ].join('\n');

  const footer = [
    '',
    '┌──────────────────────────────────────────────────────────────────────────────┐',
    '│ 📶 SOURCE: ' + provider.toUpperCase().padEnd(12) + ' │ 🤖 MODEL: ' + model.substring(0, 20).padEnd(20) + ' │ ⏱️ ' + timestamp.substring(11, 19) + ' │',
    '└──────────────────────────────────────────────────────────────────────────────┘'
  ].join('\n');

  const hasHeader = content.trim().startsWith('╔');
  
  return (hasHeader ? '' : header) + content + footer;
}

/**
 * Main enforcer function - use this on ALL AI outputs
 */
export function enforceAndFix(content: string, provider: string = 'perplexity', model: string = 'sonar-reasoning-pro'): { content: string; valid: boolean; report: string } {
  const text = content || '';
  
  const validation = enforceGoldenStandard(text);
  
  let processedContent = text;
  
  if (!validation.compliant) {
    processedContent = autoFixGoldenStandard(text);
  }

  processedContent = wrapInIntelligence(processedContent, provider, model);
  
  const finalValidation = enforceGoldenStandard(processedContent);
  
  const barFilled = Math.round(finalValidation.score / 10);
  const barEmpty = 10 - barFilled;
  const barStr = "█".repeat(barFilled) + "░".repeat(Math.max(0, barEmpty));

  return {
    content: processedContent,
    valid: finalValidation.compliant,
    report: 'Golden Standard enforced. Score: [' + barStr + '] ' + finalValidation.score + '%'
  };
}
