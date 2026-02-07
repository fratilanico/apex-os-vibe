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
 */

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
} as const;

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
 * 
 * @example
 * formatTable(['Name', 'XP', 'Status'], [
 *   ['Quest 1', '100', 'Complete'],
 *   ['Quest 2', '250', 'Active']
 * ])
 */
export function formatTable(headers: string[], rows: string[][]): string {
  if (rows.length === 0) return 'No data';

  // Calculate column widths
  const colWidths = headers.map((header, i) => {
    const maxDataWidth = Math.max(...rows.map(row => (row[i] || '').length));
    return Math.max(header.length, maxDataWidth);
  });

  // Build top border
  const topBorder = BOX.TOP_LEFT + colWidths.map(w => BOX.HORIZONTAL.repeat(w + 2)).join(BOX.T_DOWN) + BOX.TOP_RIGHT;

  // Build header row
  const headerRow = BOX.VERTICAL + headers.map((h, i) => ` ${h.padEnd(colWidths[i] || 0)} `).join(BOX.VERTICAL) + BOX.VERTICAL;

  // Build separator
  const separator = BOX.T_RIGHT + colWidths.map(w => BOX.HORIZONTAL.repeat(w + 2)).join(BOX.CROSS) + BOX.T_LEFT;

  // Build data rows
  const dataRows = rows.map(row => 
    BOX.VERTICAL + row.map((cell, i) => ` ${(cell || '').padEnd(colWidths[i] || 0)} `).join(BOX.VERTICAL) + BOX.VERTICAL
  ).join('\n');

  // Build bottom border
  const bottomBorder = BOX.BOTTOM_LEFT + colWidths.map(w => BOX.HORIZONTAL.repeat(w + 2)).join(BOX.T_UP) + BOX.BOTTOM_RIGHT;

  return `${topBorder}\n${headerRow}\n${separator}\n${dataRows}\n${bottomBorder}`;
}

/**
 * Format a code block with simple borders
 */
export function formatCodeBlock(code: string, language?: string): string {
  const lines = code.split('\n');
  const languageLength = language?.length || 0;
  const maxLineLength = Math.max(...lines.map(l => l.length), languageLength + 2);
  
  const topBorder = BOX.TOP_LEFT + BOX.HORIZONTAL.repeat(maxLineLength + 2) + BOX.TOP_RIGHT;
  const bottomBorder = BOX.BOTTOM_LEFT + BOX.HORIZONTAL.repeat(maxLineLength + 2) + BOX.BOTTOM_RIGHT;
  
  const languageLabel = language ? `${BOX.VERTICAL} [${language}]${' '.repeat(maxLineLength - languageLength - 2)}${BOX.VERTICAL}\n` : '';
  const separator = language ? `${BOX.T_RIGHT}${BOX.HORIZONTAL.repeat(maxLineLength + 2)}${BOX.T_LEFT}\n` : '';
  
  const codeLines = lines.map(line => `${BOX.VERTICAL} ${line.padEnd(maxLineLength)} ${BOX.VERTICAL}`).join('\n');
  
  return `${topBorder}\n${languageLabel}${separator}${codeLines}\n${bottomBorder}`;
}

/**
 * Format a list with bullet points
 */
export function formatList(items: string[], ordered: boolean = false): string {
  return items.map((item, i) => {
    const bullet = ordered ? `${i + 1}.` : '•';
    return `  ${bullet} ${item}`;
  }).join('\n');
}

/**
 * Format a progress bar
 */
export function formatProgressBar(current: number, max: number, width: number = 20): string {
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));
  const filled = Math.floor((percentage / 100) * width);
  const empty = width - filled;
  
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  const percentText = `${Math.floor(percentage)}%`;
  
  return `[${bar}] ${percentText}`;
}

/**
 * Format player stats display
 */
export function formatPlayerStats(stats: {
  xp: number;
  gold: number;
  level: number;
  completedQuests: number;
  unlockedSkills: number;
  nodesCompleted: number;
}): string {
  const xpForNextLevel = Math.pow(stats.level, 2) * 100;
  const xpProgress = stats.xp - Math.pow(stats.level - 1, 2) * 100;
  const xpNeeded = xpForNextLevel - Math.pow(stats.level - 1, 2) * 100;
  
  return `
╔════════════════════════════════════════════╗
║           PLAYER ONE STATUS                ║
╠════════════════════════════════════════════╣
║  Level:           ${String(stats.level).padEnd(24)} ║
║  XP:              ${String(stats.xp).padEnd(24)} ║
║  Gold:            ${String(stats.gold).padEnd(24)} ║
╠════════════════════════════════════════════╣
║  Next Level:      ${formatProgressBar(xpProgress, xpNeeded, 16).padEnd(24)} ║
╠════════════════════════════════════════════╣
║  Quests:          ${String(stats.completedQuests).padEnd(24)} ║
║  Skills:          ${String(stats.unlockedSkills).padEnd(24)} ║
║  Nodes:           ${String(stats.nodesCompleted).padEnd(24)} ║
╚════════════════════════════════════════════╝
`.trim();
}

/**
 * Format quest list
 */
export function formatQuestList(quests: Array<{
  id: string;
  title: string;
  difficulty: string;
  status: 'available' | 'active' | 'completed';
  xpReward: number;
}>): string {
  if (quests.length === 0) {
    return 'No quests available.\n[exit 0]';
  }

  const rows = quests.map(q => [
    q.status === 'active' ? '▶' : q.status === 'completed' ? '✓' : ' ',
    q.title,
    q.difficulty,
    `${q.xpReward} XP`,
  ]);

  return formatTable(['', 'QUEST', 'DIFFICULTY', 'REWARD'], rows);
}

/**
 * Format inventory/skills list
 */
export function formatSkillsList(skills: Array<{
  id: string;
  name: string;
  progress: number;
}>): string {
  if (skills.length === 0) {
    return 'No skills unlocked yet.\n[exit 0]';
  }

  const rows = skills.map(s => [
    s.name,
    formatProgressBar(s.progress, 100, 12),
  ]);

  return formatTable(['SKILL', 'PROGRESS'], rows);
}

/**
 * Format node list (for ls command)
 */
export function formatNodeList(nodes: Array<{
  id: string;
  label: string;
  type: string;
  status: string;
  distance?: number;
}>): string {
  if (nodes.length === 0) {
    return 'No adjacent nodes.\n[exit 0]';
  }

  const rows = nodes.map(n => [
    n.id,
    n.label,
    n.type,
    n.status.toUpperCase(),
    n.distance !== undefined ? `${n.distance} hops` : '-',
  ]);

  return formatTable(['ID', 'NAME', 'TYPE', 'STATUS', 'DISTANCE'], rows);
}

/**
 * Format ASCII map (simplified node graph view)
 */
export function formatAsciiMap(currentNodeId: string, adjacentNodes: Array<{ id: string; label: string }>): string {
  const maxLabelLength = Math.max(...adjacentNodes.map(n => n.label.length), 10);
  
  const lines: string[] = [];
  
  // Current node (center)
  lines.push('');
  lines.push(`     ╔${'═'.repeat(maxLabelLength + 2)}╗`);
  lines.push(`     ║ ${currentNodeId.padEnd(maxLabelLength)} ║ ◄── YOU ARE HERE`);
  lines.push(`     ╚${'═'.repeat(maxLabelLength + 2)}╝`);
  lines.push('         │');
  
  // Adjacent nodes
  if (adjacentNodes.length > 0) {
    adjacentNodes.forEach((node, i) => {
      const isLast = i === adjacentNodes.length - 1;
      const connector = isLast ? '└──' : '├──';
      lines.push(`         ${connector} [${node.id}] ${node.label}`);
    });
  } else {
    lines.push('         (no connections)');
  }
  
  lines.push('');
  
  return lines.join('\n');
}

/**
 * Format fork choices
 */
export function formatForkChoices(choices: Array<{
  label: string;
  description: string;
  consequence?: string;
}>): string {
  const lines: string[] = [];
  
  lines.push('');
  lines.push('═══════════════════════════════════════════════════════');
  lines.push('              DECISION POINT DETECTED');
  lines.push('═══════════════════════════════════════════════════════');
  lines.push('');
  
  choices.forEach((choice, i) => {
    lines.push(`  [${i + 1}] ${choice.label}`);
    lines.push(`      ${choice.description}`);
    if (choice.consequence) {
      lines.push(`      ⚠ ${choice.consequence}`);
    }
    lines.push('');
  });
  
  lines.push('───────────────────────────────────────────────────────');
  lines.push('Use: fork choose <label>');
  lines.push('');
  
  return lines.join('\n');
}

/**
 * Convert AI markdown-like response to plain CLI text
 * Basic parsing: strips markdown, preserves code blocks and lists
 */
export function convertMarkdownToCLI(markdown: string): string {
  let output = markdown;
  
  // Convert headers to styled tags
  output = output.replace(/^###\s+(.+)$/gm, '[h3]$1[/h3]\n');
  output = output.replace(/^##\s+(.+)$/gm, '[h2]$1[/h2]\n');
  output = output.replace(/^#\s+(.+)$/gm, '[h1]$1[/h1]\n');

  // Bold / italic markers
  output = output.replace(/\*\*(.+?)\*\*/g, '[b]$1[/b]');
  output = output.replace(/__(.+?)__/g, '[b]$1[/b]');
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
  
  // Convert ordered lists
  output = output.replace(/^\d+\.\s+(.+)$/gm, (_match, text, offset, str) => {
    const linesBefore = str.substring(0, offset).split('\n');
    const currentListLength = linesBefore.reverse().findIndex((line: string) => !/^\d+\./.test(line));
    const num = currentListLength === -1 ? linesBefore.length : linesBefore.length - currentListLength;
    return `  ${num}. ${text}`;
  });

  return output;
}

const ICON_MAP: Record<string, string> = {
  bolt: '⚡',
  rocket: '🚀',
  fire: '🔥',
  check: '✅',
  warn: '⚠️',
  info: 'ℹ️',
  star: '⭐',
};

export function stripCliTags(text: string): string {
  let output = text;
  output = output.replace(/\[icon:([a-z-]+)\]/g, (_, name) => ICON_MAP[name] ?? '•');
  output = output.replace(/\[(?:\/)?(?:h1|h2|h3|b|code|muted|info|warn|success|error)\]/g, '');
  return output;
}
