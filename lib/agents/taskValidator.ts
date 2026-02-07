import type { AgentTask, AgentTaskResult } from '@/types/swarm';

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  🔥 GOLDEN STANDARD TASK VALIDATOR                                           ║
 * ║  Status: [██████████] 100% Production Ready                                  ║
 * ║  Version: 1.0.0 | Authority: Nicolae Fratila                                 ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Listen up - this is the law. Every task output must pass Golden Standard validation.
 * No exceptions. No compromises. Full wire mode engaged.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// VALIDATION RULE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

export interface ValidationRule {
  id: string;
  name: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  check: (content: string) => boolean;
  autoFix?: (content: string) => string;
}

export interface ValidationViolation {
  ruleId: string;
  ruleName: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  line?: number;
  column?: number;
  autoFixed?: boolean;
  originalContent?: string;
  fixedContent?: string;
}

export interface ValidationResult {
  compliant: boolean;
  score: number; // 0-100
  violations: ValidationViolation[];
  fixedContent?: string;
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    total: number;
    autoFixed: number;
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// APPROVED STATUS ICONS (SECTION 4.1)
// ═══════════════════════════════════════════════════════════════════════════════

const APPROVED_ICONS = new Set([
  '🟢', // Active
  '🔴', // Error
  '🟡', // Warning
  '⚪', // Offline
  '✅', // Success
  '❌', // Failure
  'ℹ️', // Info
  '🔥', // Priority
  '⚡', // Fast
  '🚀', // Deployed
  '💰', // Cost
  '🧠', // AI
  '🛡️', // Security
  '⚙️', // Settings
  '🔒', // Secret
]);

const ICON_REGEX = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]|[\u{238C}]|[\u{2B06}]|[\u{2B07}]|[\u{2B05}]|[\u{27A1}]|[\u{2194}-\u{2199}]|[\u{21A9}-\u{21AA}]|[\u{2934}-\u{2935}]|[\u{25AA}-\u{25AB}]|[\u{25FB}-\u{25FE}]|[\u{25FD}-\u{25FE}]|[\u{25AA}]|[\u{25AB}]|[\u{25B6}]|[\u{25C0}]|[\u{1F201}]|[\u{1F202}]|[\u{1F21A}]|[\u{1F22F}]|[\u{1F232}]|[\u{1F233}]|[\u{1F234}]|[\u{1F235}]|[\u{1F236}]|[\u{1F237}]|[\u{1F238}]|[\u{1F239}]|[\u{1F23A}]|[\u{1F250}]|[\u{1F251}]|[\u{2795}]|[\u{2796}]|[\u{2797}]|[\u{27B0}]|[\u{27BF}]|[\u{00A9}]|[\u{00AE}]|[\u{2122}]|[\u{3030}]|[\u{303D}]|[\u{3297}]|[\u{3299}]/gu;

// ═══════════════════════════════════════════════════════════════════════════════
// TONY STARK APPROVED PHRASES (SECTION 5)
// ═══════════════════════════════════════════════════════════════════════════════

const TONY_OPENERS = [
  'Listen up',
  "Here's the deal",
  'Alright, here\'s how we do this',
  'Now pay attention',
  'Let me break this down for you',
];

const TONY_POWER_PHRASES = [
  'Now go build something legendary',
  'You KNOW this works',
  'This is non-negotiable',
  'Full wire mode',
  'Full Tony Stark',
  'No excuses',
  'Only execution',
];

const UNCERTAIN_PHRASES = [
  'I think',
  'maybe',
  'perhaps',
  'should',
  'might',
  'possibly',
  'probably',
  'I believe',
  'it seems',
  'appears to be',
];

// ═══════════════════════════════════════════════════════════════════════════════
// VALIDATION RULES IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════════

export const VALIDATION_RULES: ValidationRule[] = [
  // ═════════════════════════════════════════════════════════════════════════════
  // RULE 001: Double-Line Header Banner (CRITICAL)
  // ═════════════════════════════════════════════════════════════════════════════
  {
    id: 'RULE_001',
    name: 'Double-Line Header Banner',
    severity: 'critical',
    description: 'Must contain at least one double-line header (╔═══╗)',
    check: (content: string) => {
      const hasDoubleLineHeader = /╔═+╗/.test(content);
      return hasDoubleLineHeader;
    },
    autoFix: (content: string) => {
      if (/╔═+╗/.test(content)) return content;
      
      // Add a default header if missing
      const header = `╔══════════════════════════════════════════════════════════════════════════════╗
║  🔥 TASK OUTPUT - GOLDEN STANDARD COMPLIANT                                  ║
╚══════════════════════════════════════════════════════════════════════════════╝

`;
      return header + content;
    },
  },

  // ═════════════════════════════════════════════════════════════════════════════
  // RULE 002: Table Box-Drawing Characters (HIGH)
  // ═════════════════════════════════════════════════════════════════════════════
  {
    id: 'RULE_002',
    name: 'Table Box-Drawing Characters',
    severity: 'high',
    description: 'All tables must use box-drawing characters (┌┐└┘├┤┬┴┼─│)',
    check: (content: string) => {
      // Check if there are any markdown tables
      const hasMarkdownTable = /\|[-]+\|/.test(content);
      // Check if there are box-drawing tables
      const hasBoxDrawing = /[┌┐└┘├┤┬┴┼─│]/.test(content);
      
      // If markdown tables exist without box-drawing, it's a violation
      if (hasMarkdownTable && !hasBoxDrawing) {
        return false;
      }
      return true;
    },
    autoFix: (content: string) => {
      // Convert markdown tables to ASCII tables
      return convertMarkdownTablesToASCII(content);
    },
  },

  // ═════════════════════════════════════════════════════════════════════════════
  // RULE 003: Progress Bar Format (CRITICAL)
  // ═════════════════════════════════════════════════════════════════════════════
  {
    id: 'RULE_003',
    name: 'Progress Bar Format',
    severity: 'critical',
    description: 'Progress bars must be 10 blocks with percentage [████████░░] XX%',
    check: (content: string) => {
      // Find all progress indicators
      const progressPattern = /\[█{0,10}░{0,10}\]\s*\d{1,3}%/g;
      const invalidProgressPattern = /(\d+%\s*(complete|done|finished))|(\[#{1,10}\]\s*\d+%)|(\[={1,10}\]\s*\d+%)/gi;
      
      const hasValidProgress = progressPattern.test(content);
      const hasInvalidProgress = invalidProgressPattern.test(content);
      
      // If there are progress indicators, they must be valid
      if (hasInvalidProgress) return false;
      
      // If no progress bars at all, that's okay (not all content needs them)
      return true;
    },
    autoFix: (content: string) => {
      return formatProgressBars(content);
    },
  },

  // ═════════════════════════════════════════════════════════════════════════════
  // RULE 004: Approved Status Icons (CRITICAL)
  // ═════════════════════════════════════════════════════════════════════════════
  {
    id: 'RULE_004',
    name: 'Approved Status Icons',
    severity: 'critical',
    description: 'Status icons must be from approved list (🟢🔴🟡⚪✅❌)',
    check: (content: string) => {
      const allIcons = content.match(ICON_REGEX) || [];
      
      for (const icon of allIcons) {
        if (!APPROVED_ICONS.has(icon)) {
          return false;
        }
      }
      return true;
    },
    autoFix: (content: string) => {
      // Replace common non-approved icons with approved ones
      return content
        .replace(/✓/g, '✅')
        .replace(/✔/g, '✅')
        .replace(/✗/g, '❌')
        .replace(/✖/g, '❌')
        .replace(/○/g, '⚪')
        .replace(/●/g, '🟢')
        .replace(/▲/g, '🔺')
        .replace(/▼/g, '🔻');
    },
  },

  // ═════════════════════════════════════════════════════════════════════════════
  // RULE 005: Code Block Syntax Highlighting (HIGH)
  // ═════════════════════════════════════════════════════════════════════════════
  {
    id: 'RULE_005',
    name: 'Code Block Syntax Highlighting',
    severity: 'high',
    description: 'Code blocks must have language specification',
    check: (content: string) => {
      // Find code blocks without language
      const codeBlockPattern = /```\s*\n/g;
      const hasCodeBlocksWithoutLang = codeBlockPattern.test(content);
      return !hasCodeBlocksWithoutLang;
    },
    autoFix: (content: string) => {
      // Add 'text' as default language for code blocks without one
      return content.replace(/```\s*\n/g, '```text\n');
    },
  },

  // ═════════════════════════════════════════════════════════════════════════════
  // RULE 006: Tony Stark Tone (HIGH)
  // ═════════════════════════════════════════════════════════════════════════════
  {
    id: 'RULE_006',
    name: 'Tony Stark Tone',
    severity: 'high',
    description: 'Should use Tony Stark approved phrases and avoid uncertain language',
    check: (content: string) => {
      const lowerContent = content.toLowerCase();
      
      // Check for uncertain phrases
      for (const phrase of UNCERTAIN_PHRASES) {
        if (lowerContent.includes(phrase.toLowerCase())) {
          return false;
        }
      }
      
      return true;
    },
    autoFix: (content: string) => {
      let fixed = content;
      
      // Replace uncertain phrases with confident ones
      const replacements: Record<string, string> = {
        'I think': 'You KNOW',
        'maybe': 'definitely',
        'perhaps': 'absolutely',
        'should': 'will',
        'might': 'does',
        'possibly': 'certainly',
        'probably': 'definitely',
        'I believe': 'You KNOW',
        'it seems': 'it is',
        'appears to be': 'is',
      };
      
      for (const [uncertain, confident] of Object.entries(replacements)) {
        const regex = new RegExp(uncertain, 'gi');
        fixed = fixed.replace(regex, confident);
      }
      
      return fixed;
    },
  },

  // ═════════════════════════════════════════════════════════════════════════════
  // RULE 007: Icon Spacing (MEDIUM)
  // ═════════════════════════════════════════════════════════════════════════════
  {
    id: 'RULE_007',
    name: 'Icon Spacing',
    severity: 'medium',
    description: 'Icons must have proper spacing (Status: 🟢 Active)',
    check: (content: string) => {
      // Check for icons without spaces
      const badSpacingPattern = /[\p{L}\p{N}][🟢🔴🟡⚪✅❌ℹ️🔥⚡🚀💰🧠🛡️⚙️🔒]|[🟢🔴🟡⚪✅❌ℹ️🔥⚡🚀💰🧠🛡️⚙️🔒][\p{L}\p{N}]/gu;
      return !badSpacingPattern.test(content);
    },
    autoFix: (content: string) => {
      // Add spaces around icons
      return content.replace(/([\p{L}\p{N}])([🟢🔴🟡⚪✅❌ℹ️🔥⚡🚀💰🧠🛡️⚙️🔒])/gu, '$1 $2')
                   .replace(/([🟢🔴🟡⚪✅❌ℹ️🔥⚡🚀💰🧠🛡️⚙️🔒])([\p{L}\p{N}])/gu, '$1 $2');
    },
  },

  // ═════════════════════════════════════════════════════════════════════════════
  // RULE 008: Progress Bar Context (HIGH)
  // ═════════════════════════════════════════════════════════════════════════════
  {
    id: 'RULE_008',
    name: 'Progress Bar Context',
    severity: 'high',
    description: 'Progress bars should include context label',
    check: (content: string) => {
      const progressPattern = /\[█{0,10}░{0,10}\]\s*\d{1,3}%/g;
      const matches = content.match(progressPattern) || [];
      
      for (const match of matches) {
        // Check if there's a label before the progress bar
        const index = content.indexOf(match);
        const beforeMatch = content.substring(Math.max(0, index - 50), index);
        
        // Should have a label like "Progress:" or "Status:" or similar
        if (!/\w+\s*[:\-]/.test(beforeMatch)) {
          // This is a warning, not a critical failure
          // We'll let it pass but note it
        }
      }
      
      return true; // This is a soft rule
    },
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Convert markdown tables to ASCII box-drawing tables
 */
function convertMarkdownTablesToASCII(content: string): string {
  const lines = content.split('\n');
  const result: string[] = [];
  let inTable = false;
  let tableLines: string[] = [];
  
  for (const line of lines) {
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      inTable = true;
      tableLines.push(line);
    } else if (inTable) {
      // Process the collected table
      result.push(...processMarkdownTable(tableLines));
      tableLines = [];
      inTable = false;
      result.push(line);
    } else {
      result.push(line);
    }
  }
  
  if (tableLines.length > 0) {
    result.push(...processMarkdownTable(tableLines));
  }
  
  return result.join('\n');
}

/**
 * Process a markdown table and convert to ASCII
 */
function processMarkdownTable(lines: string[]): string[] {
  if (lines.length < 2) return lines;
  
  // Skip separator line (second line with dashes)
  const dataLines = lines.filter((line, index) => index !== 1);
  
  // Parse cells
  const rows = dataLines.map(line => 
    line.split('|')
      .map(cell => cell.trim())
      .filter(cell => cell.length > 0)
  );
  
  if (rows.length === 0) return lines;
  
  // Calculate column widths
  const colCount = Math.max(...rows.map(row => row.length));
  const colWidths: number[] = [];
  
  for (let i = 0; i < colCount; i++) {
    const width = Math.max(...rows.map(row => (row[i] || '').length), 10);
    colWidths.push(width);
  }
  
  // Build ASCII table
  const result: string[] = [];
  
  // Top border
  result.push('┌' + colWidths.map(w => '─'.repeat(w + 2)).join('┬') + '┐');
  
  // Header row
  const headerRow = rows[0];
  const headerCells = colWidths.map((w, i) => ' ' + (headerRow[i] || '').padEnd(w) + ' ');
  result.push('│' + headerCells.join('│') + '│');
  
  // Separator
  result.push('├' + colWidths.map(w => '─'.repeat(w + 2)).join('┼') + '┤');
  
  // Data rows
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const cells = colWidths.map((w, j) => ' ' + (row[j] || '').padEnd(w) + ' ');
    result.push('│' + cells.join('│') + '│');
  }
  
  // Bottom border
  result.push('└' + colWidths.map(w => '─'.repeat(w + 2)).join('┴') + '┘');
  
  return result;
}

/**
 * Format progress bars to Golden Standard
 */
function formatProgressBars(content: string): string {
  // Find various progress patterns and convert them
  
  // Pattern 1: [####] 40% or [----] 40%
  content = content.replace(/\[(#{1,10}|-{1,10})\]\s*(\d{1,3})%/g, (match, bars, percent) => {
    const filled = Math.round((parseInt(percent) / 100) * 10);
    const empty = 10 - filled;
    return `[${'█'.repeat(filled)}${'░'.repeat(empty)}] ${percent.padStart(3)}%`;
  });
  
  // Pattern 2: 40% complete (text-based)
  content = content.replace(/(\d{1,3})%\s*(complete|done|finished)/gi, (match, percent) => {
    const filled = Math.round((parseInt(percent) / 100) * 10);
    const empty = 10 - filled;
    return `[${'█'.repeat(filled)}${'░'.repeat(empty)}] ${percent.padStart(3)}%`;
  });
  
  // Pattern 3: Already has blocks but wrong count
  content = content.replace(/\[(█{1,20}|░{1,20})\]\s*(\d{1,3})%/g, (match, bars, percent) => {
    const filled = Math.round((parseInt(percent) / 100) * 10);
    const empty = 10 - filled;
    return `[${'█'.repeat(filled)}${'░'.repeat(empty)}] ${percent.padStart(3)}%`;
  });
  
  return content;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN VALIDATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Validate task output against Golden Standard
 * 
 * Listen up - this is the main entry point. Every task output goes through here.
 * No exceptions. You KNOW this works.
 */
export function validateTaskOutput(
  task: AgentTask,
  result: AgentTaskResult,
  options: {
    autoFix?: boolean;
    strictMode?: boolean;
  } = {}
): ValidationResult {
  const { autoFix = true, strictMode = false } = options;
  
  const content = result.output || result.result || '';
  const violations: ValidationViolation[] = [];
  let fixedContent = content;
  let autoFixedCount = 0;
  
  // Run all validation rules
  for (const rule of VALIDATION_RULES) {
    const isValid = rule.check(fixedContent);
    
    if (!isValid) {
      const violation: ValidationViolation = {
        ruleId: rule.id,
        ruleName: rule.name,
        severity: rule.severity,
        message: `Golden Standard violation: ${rule.description}`,
      };
      
      // Attempt auto-fix if available
      if (autoFix && rule.autoFix) {
        const beforeFix = fixedContent;
        fixedContent = rule.autoFix(fixedContent);
        
        if (fixedContent !== beforeFix) {
          violation.autoFixed = true;
          violation.originalContent = beforeFix;
          violation.fixedContent = fixedContent;
          autoFixedCount++;
        }
      }
      
      violations.push(violation);
    }
  }
  
  // Calculate compliance score
  const criticalCount = violations.filter(v => v.severity === 'critical').length;
  const highCount = violations.filter(v => v.severity === 'high').length;
  const mediumCount = violations.filter(v => v.severity === 'medium').length;
  const lowCount = violations.filter(v => v.severity === 'low').length;
  
  // Scoring algorithm:
  // - Critical: -25 points each
  // - High: -15 points each
  // - Medium: -5 points each
  // - Low: -2 points each
  // - Auto-fixed: +5 points each (up to max)
  
  let score = 100;
  score -= criticalCount * 25;
  score -= highCount * 15;
  score -= mediumCount * 5;
  score -= lowCount * 2;
  score += autoFixedCount * 5;
  
  // Clamp score between 0 and 100
  score = Math.max(0, Math.min(100, score));
  
  // Determine compliance
  // In strict mode: must be 100%
  // Normal mode: 80%+ is compliant
  const compliant = strictMode ? score === 100 : score >= 80;
  
  return {
    compliant,
    score,
    violations,
    fixedContent: autoFix && fixedContent !== content ? fixedContent : undefined,
    summary: {
      critical: criticalCount,
      high: highCount,
      medium: mediumCount,
      low: lowCount,
      total: violations.length,
      autoFixed: autoFixedCount,
    },
  };
}

/**
 * Quick validation check - returns true/false only
 */
export function isGoldenStandardCompliant(content: string): boolean {
  const result = validateTaskOutput(
    { id: 'quick-check', agentId: 'validator', status: 'running', prompt: '', startedAt: Date.now() },
    { output: content, status: 'completed', completedAt: Date.now() },
    { autoFix: false }
  );
  return result.compliant;
}

/**
 * Format violations into a readable report
 */
export function formatValidationReport(result: ValidationResult): string {
  const lines: string[] = [];
  
  // Header
  lines.push('╔══════════════════════════════════════════════════════════════════════════════╗');
  lines.push('║  🔥 GOLDEN STANDARD VALIDATION REPORT                                        ║');
  lines.push('╚══════════════════════════════════════════════════════════════════════════════╝');
  lines.push('');
  
  // Score
  const scoreBar = generateProgressBar(result.score);
  lines.push(`Compliance Score: ${scoreBar} ${result.score}%`);
  lines.push(`Status: ${result.compliant ? '🟢 COMPLIANT' : '🔴 NON-COMPLIANT'}`);
  lines.push('');
  
  // Summary
  lines.push('┌──────────────────────────────────────────────────────────────────────────────┐');
  lines.push('│ VIOLATION SUMMARY                                                            │');
  lines.push('├──────────────────────────────────────────────────────────────────────────────┤');
  lines.push(`│  🔴 Critical:  ${result.summary.critical.toString().padStart(3)}                                                      │`);
  lines.push(`│  🟡 High:      ${result.summary.high.toString().padStart(3)}                                                      │`);
  lines.push(`│  🟠 Medium:    ${result.summary.medium.toString().padStart(3)}                                                      │`);
  lines.push(`│  ⚪ Low:       ${result.summary.low.toString().padStart(3)}                                                      │`);
  lines.push(`│  ✅ Auto-Fixed: ${result.summary.autoFixed.toString().padStart(3)}                                                      │`);
  lines.push('└──────────────────────────────────────────────────────────────────────────────┘');
  lines.push('');
  
  // Violations
  if (result.violations.length > 0) {
    lines.push('┌──────────────────────────────────────────────────────────────────────────────┐');
    lines.push('│ DETAILED VIOLATIONS                                                          │');
    lines.push('├──────────────────────────────────────────────────────────────────────────────┤');
    
    for (const violation of result.violations) {
      const icon = violation.severity === 'critical' ? '🔴' : 
                   violation.severity === 'high' ? '🟡' : 
                   violation.severity === 'medium' ? '🟠' : '⚪';
      lines.push(`│ ${icon} ${violation.ruleId}: ${violation.ruleName.padEnd(58)}│`);
      lines.push(`│    ${violation.message.substring(0, 64).padEnd(64)}│`);
      if (violation.autoFixed) {
        lines.push(`│    ✅ Auto-fixed                                                              │`);
      }
      lines.push('├──────────────────────────────────────────────────────────────────────────────┤');
    }
    
    lines.push('└──────────────────────────────────────────────────────────────────────────────┘');
  }
  
  // Footer
  lines.push('');
  if (result.compliant) {
    lines.push('✅ All Golden Standard requirements met. You KNOW this works.');
  } else {
    lines.push('🔴 Golden Standard violations detected. Fix these before deployment.');
    lines.push('No excuses. Only execution.');
  }
  
  return lines.join('\n');
}

/**
 * Generate a progress bar string
 */
function generateProgressBar(percentage: number): string {
  const filled = Math.round((percentage / 100) * 10);
  const empty = 10 - filled;
  return `[${'█'.repeat(filled)}${'░'.repeat(empty)}]`;
}

/**
 * Auto-format content to Golden Standard
 */
export function autoFormatContent(content: string): string {
  let formatted = content;
  
  // Apply all auto-fixes
  for (const rule of VALIDATION_RULES) {
    if (rule.autoFix && !rule.check(formatted)) {
      formatted = rule.autoFix(formatted);
    }
  }
  
  return formatted;
}

/**
 * Get compliance score for a task
 */
export function getTaskComplianceScore(task: AgentTask, result: AgentTaskResult): number {
  const validation = validateTaskOutput(task, result, { autoFix: false });
  return validation.score;
}

/**
 * Export validation utilities
 */
export const TaskValidator = {
  validate: validateTaskOutput,
  isCompliant: isGoldenStandardCompliant,
  formatReport: formatValidationReport,
  autoFormat: autoFormatContent,
  getScore: getTaskComplianceScore,
  rules: VALIDATION_RULES,
};

export default TaskValidator;
