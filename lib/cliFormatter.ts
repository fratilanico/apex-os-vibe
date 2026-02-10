/**
 * CLI Formatter Utility
 * 
 * Converts AI responses and game data into authentic CLI-style output.
 * Replaces ReactMarkdown with pure ASCII formatting.
 * 
 * Design principles:
 * - No HTML tags, only plain text
 * - Box drawing characters for tables/borders
 * - ANSI-style color classes (applied via CSS)
 * - Exit codes for command results
 * - Strict 42-character constant for HUD alignment (Golden Standard)
 */

/**
 * The Golden Standard Width for HUD components
 * Optimized for readability without excessive wrapping
 */
export const HUD_WIDTH = 64;
export const MOBILE_HUD_WIDTH = 42;

/**
 * Color codes for terminal output (applied via CSS classes)
 */
export const CLI_COLORS = {
  SUCCESS: 'text-emerald-400',
  ERROR: 'text-red-400',
  WARNING: 'text-yellow-400',
  INFO: 'text-cyan-400',
  MUTED: 'text-white/40',
  HIGHLIGHT: 'text-violet-400',
  PROMPT: 'text-cyan-500',
} as const;

/**
 * Box drawing characters for ASCII art
 */
const BOX = {
  TOP_LEFT: '┌',
  TOP_RIGHT: '┐',
  BOTTOM_LEFT: '└',
  BOTTOM_RIGHT: '┘',
  HORIZONTAL: '─',
  VERTICAL: '│',
  T_DOWN: '┬',
  T_UP: '┴',
  T_RIGHT: '├',
  T_LEFT: '┤',
  CROSS: '┼',
  HEAVY_TOP_LEFT: '╔',
  HEAVY_TOP_RIGHT: '╗',
  HEAVY_BOTTOM_LEFT: '╚',
  HEAVY_BOTTOM_RIGHT: '╝',
  HEAVY_HORIZONTAL: '═',
  HEAVY_VERTICAL: '║',
  HEAVY_T_RIGHT: '╠',
  HEAVY_T_LEFT: '╣',
} as const;

/**
 * Smartly wrap text to fit within a specific width
 */
export function smartWrap(text: string, width: number = HUD_WIDTH): string[] {
  if (!text) return [];
  const lines: string[] = [];
  const paragraphs = text.split('\n');

  paragraphs.forEach(p => {
    if (p.trim() === '') {
      lines.push('');
      return;
    }
    const words = p.split(' ');
    let currentLine = '';

    words.forEach(word => {
      if ((currentLine + (currentLine ? ' ' : '') + word).length <= width) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
        // Handle words longer than width
        while (currentLine.length > width) {
          lines.push(currentLine.substring(0, width));
          currentLine = currentLine.substring(width);
        }
      }
    });
    if (currentLine) lines.push(currentLine);
  });

  return lines;
}

/**
 * Get current target width based on environment
 */
function getTargetWidth(): number {
  if (typeof window !== 'undefined') {
    return window.innerWidth < 768 ? MOBILE_HUD_WIDTH : HUD_WIDTH;
  }
  return HUD_WIDTH;
}

/**
 * Box text with heavy borders (Golden Standard)
 */
export function boxText(title: string, content: string | string[]): string {
  const targetWidth = getTargetWidth();
  const innerWidth = targetWidth - 4;
  
  const contentLines = Array.isArray(content) ? content : content.split('\n');
  const wrappedLines: string[] = [];
  
  contentLines.forEach(line => {
    wrappedLines.push(...smartWrap(line, innerWidth));
  });

  const top = BOX.HEAVY_TOP_LEFT + BOX.HEAVY_HORIZONTAL.repeat(targetWidth - 2) + BOX.HEAVY_TOP_RIGHT;
  const header = `${BOX.HEAVY_VERTICAL} ${title.substring(0, innerWidth).padEnd(innerWidth)} ${BOX.HEAVY_VERTICAL}`;
  const sep = BOX.HEAVY_T_RIGHT + BOX.HEAVY_HORIZONTAL.repeat(targetWidth - 2) + BOX.HEAVY_T_LEFT;
  const body = wrappedLines.map(line => `${BOX.HEAVY_VERTICAL} ${line.padEnd(innerWidth)} ${BOX.HEAVY_VERTICAL}`).join('\n');
  const bottom = BOX.HEAVY_BOTTOM_LEFT + BOX.HEAVY_HORIZONTAL.repeat(targetWidth - 2) + BOX.HEAVY_BOTTOM_RIGHT;
  
  return `${top}\n${header}\n${sep}\n${body}\n${bottom}`;
}

/**
 * Format a success message with exit code
 */
export function formatSuccess(message: string, exitCode: number = 0): string {
  return `${message}\n[exit ${exitCode}]`;
}

/**
 * Format an error message with exit code
 */
export function formatError(message: string, exitCode: number = 1): string {
  return `ERROR: ${message}\n[exit ${exitCode}]`;
}

/**
 * Format a table from data
 */
export function formatTable(headers: string[], rows: string[][]): string {
  if (rows.length === 0) return 'No data';
  const targetWidth = getTargetWidth();

  // Calculate column widths proportional to targetWidth
  const totalPadding = (headers.length * 3) + 1;
  const availableWidth = targetWidth - totalPadding;
  const colWidths = headers.map(() => Math.floor(availableWidth / headers.length));

  // Build top border
  const topBorder = BOX.TOP_LEFT + colWidths.map(w => BOX.HORIZONTAL.repeat((w || 0) + 2)).join(BOX.T_DOWN) + BOX.TOP_RIGHT;

  // Build header row
  const headerRow = BOX.VERTICAL + headers.map((h, i) => ` ${h.substring(0, colWidths[i] || 0).padEnd(colWidths[i] || 0)} `).join(BOX.VERTICAL) + BOX.VERTICAL;

  // Build separator
  const separator = BOX.T_RIGHT + colWidths.map(w => BOX.HORIZONTAL.repeat((w || 0) + 2)).join(BOX.CROSS) + BOX.T_LEFT;

  // Build data rows
  const dataRows = rows.map(row => 
    BOX.VERTICAL + colWidths.map((w, i) => ` ${(row[i] || '').substring(0, w || 0).padEnd(w || 0)} `).join(BOX.VERTICAL) + BOX.VERTICAL
  ).join('\n');

  // Build bottom border
  const bottomBorder = BOX.BOTTOM_LEFT + colWidths.map(w => BOX.HORIZONTAL.repeat((w || 0) + 2)).join(BOX.T_UP) + BOX.BOTTOM_RIGHT;

  return `${topBorder}\n${headerRow}\n${separator}\n${dataRows}\n${bottomBorder}`;
}

/**
 * Format a code block with simple borders
 */
export function formatCodeBlock(code: string, language?: string): string {
  const targetWidth = getTargetWidth();
  const innerWidth = targetWidth - 4;
  
  const lines = code.split('\n');
  const wrappedLines: string[] = [];
  lines.forEach(line => wrappedLines.push(...smartWrap(line, innerWidth)));
  
  const topBorder = BOX.TOP_LEFT + BOX.HORIZONTAL.repeat(targetWidth - 2) + BOX.TOP_RIGHT;
  const bottomBorder = BOX.BOTTOM_LEFT + BOX.HORIZONTAL.repeat(targetWidth - 2) + BOX.BOTTOM_RIGHT;
  
  const languageLabel = language ? `${BOX.VERTICAL} [${language}]${' '.repeat(Math.max(0, targetWidth - (language?.length || 0) - 6))}${BOX.VERTICAL}\n` : '';
  const separator = language ? `${BOX.T_RIGHT}${BOX.HORIZONTAL.repeat(targetWidth - 2)}${BOX.T_LEFT}\n` : '';
  
  const codeLines = wrappedLines.map(line => `${BOX.VERTICAL} ${line.padEnd(innerWidth)} ${BOX.VERTICAL}`).join('\n');
  
  return `${topBorder}\n${languageLabel}${separator}${codeLines}\n${bottomBorder}`;
}

/**
 * Convert AI markdown-like response to plain CLI text
 */
export function convertMarkdownToCLI(markdown: string): string {
  let output = markdown;
  const targetWidth = getTargetWidth();
  
  // Convert headers to styled tags
  output = output.replace(/^###\s+(.+)$/gm, '[h3][violet]$1[/violet][/h3]\n');
  output = output.replace(/^##\s+(.+)$/gm, '[h2][cyan]$1[/cyan][/h2]\n');
  output = output.replace(/^#\s+(.+)$/gm, '[h1][gold]$1[/gold][/h1]\n');

  // Bold / italic markers
  output = output.replace(/\*\*(.+?)\*\*/g, '[emerald]$1[/emerald]');
  output = output.replace(/__(.+?)__/g, '[emerald]$1[/emerald]');
  output = output.replace(/\*(.+?)\*/g, '$1');
  output = output.replace(/_(.+?)_/g, '$1');
  
  // Convert code blocks
  output = output.replace(/```(\w+)?\n([\s\S]+?)```/g, (_, lang, code) => {
    return '\n' + formatCodeBlock(code.trim(), lang) + '\n';
  });
  
  // Convert inline code
  output = output.replace(/`(.+?)`/g, '[$1]');
  
  // Convert unordered lists
  output = output.replace(/^[-*]\s+(.+)$/gm, '  • $1');
  
  // Smart wrap long paragraphs that aren't headers or code blocks
  const lines = output.split('\n');
  const wrappedLines = lines.map(line => {
    if (line.startsWith('[h') || line.startsWith('╔') || line.startsWith('╚') || line.startsWith('╠') || line.startsWith('║') || line.startsWith('┌') || line.startsWith('└') || line.trim() === '') {
      return line;
    }
    return smartWrap(line, targetWidth).join('\n');
  });
  
  return wrappedLines.join('\n');
}

const ICON_MAP: Record<string, string> = {
  bolt: '⚡',
  rocket: '🚀',
  fire: '🔥',
  check: '✅',
  warn: '⚠️',
  info: 'ℹ️',
  star: '⭐',
  brain: '🧠',
  shield: '🛡️',
  money: '💰',
  gear: '⚙️',
  lock: '🔒',
};

/**
 * Replace [icon:name] with emoji
 */
export function injectIcons(text: string): string {
  return text.replace(/\[icon:([a-z-]+)\]/g, (_, name) => ICON_MAP[name] || '•');
}

export function formatNodeList(nodes: {id: string, label: string, type: string, status?: string}[]): string {
  const headers = ['ID', 'LABEL', 'TYPE'];
  const rows = nodes.map(n => [n.id.substring(0, 8), n.label.substring(0, 15), n.type.substring(0, 8)]);
  return formatTable(headers, rows);
}

export function formatAsciiMap(currentLabel: string, nodes: {id: string, label: string}[]): string {
    let output = `\n      [ ${currentLabel} ]\n`;
    output += `         |\n`;
    output += `    +----+----+\n`;
    nodes.slice(0, 3).forEach(n => {
        output += `    | ${n.label}\n`;
    });
    return output;
}

export function formatPlayerStats(stats: any): string {
    const headers = ['STAT', 'VALUE'];
    const rows = Object.entries(stats).map(([k, v]) => [k, String(v)]);
    return formatTable(headers, rows);
}

export function formatSkillsList(skills: {id: string, name: string, level: number}[]): string {
    const headers = ['SKILL', 'LVL'];
    const rows = skills.map(s => [s.name, String(s.level)]);
    return formatTable(headers, rows);
}

export function formatQuestList(quests: {id: string, title: string, status: string}[]): string {
    const headers = ['QUEST', 'STATUS'];
    const rows = quests.map(q => [q.title.substring(0, 20), q.status]);
    return formatTable(headers, rows);
}
