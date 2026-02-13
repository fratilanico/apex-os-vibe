import React from 'react';

const TAG_REGEX = /(\[(?:\/)?(?:h1|h2|h3|b|code|muted|info|warn|success|error|violet|cyan|gold|emerald|matrix)\])/g;
const ICON_REGEX = /\[icon:([a-z-]+)\]/g;

const ICONS: Record<string, string> = {
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

const STYLE_MAP: Record<string, string> = {
  h1: 'text-cyan-300 font-bold tracking-widest uppercase text-sm block my-2',
  h2: 'text-cyan-200 font-semibold tracking-wide text-sm block my-1',
  h3: 'text-cyan-100 font-semibold text-sm block my-1',
  b: 'text-white font-semibold',
  code: 'text-emerald-300 bg-white/5 px-1 rounded font-mono',
  muted: 'text-white/40',
  info: 'text-cyan-400',
  warn: 'text-yellow-400',
  success: 'text-emerald-400',
  error: 'text-red-400',
  violet: 'text-violet-400',
  cyan: 'text-cyan-400',
  gold: 'text-amber-400',
  emerald: 'text-emerald-400',
  matrix: 'text-green-400',
};

export const InlineRenderer: React.FC<{ text: string }> = ({ text }) => {
  const pieces = text.split(TAG_REGEX);
  const activeTags: string[] = [];
  const nodes: React.ReactNode[] = [];

  pieces.forEach((piece, index) => {
    if (!piece) return;
    if (piece.startsWith('[') && piece.endsWith(']')) {
      const tag = piece.slice(1, -1);
      if (tag.startsWith('/')) {
        const closing = tag.slice(1);
        const idx = activeTags.lastIndexOf(closing);
        if (idx >= 0) activeTags.splice(idx, 1);
      } else {
        activeTags.push(tag);
      }
      return;
    }

    const className = activeTags
      .map((t) => STYLE_MAP[t])
      .filter(Boolean)
      .join(' ');

    const iconSplit = piece.split(ICON_REGEX);
    const rendered = iconSplit.map((segment, i) => {
      if (i % 2 === 1) {
        return <span key={`icon-${index}-${i}`}>{ICONS[segment] ?? '•'}</span>;
      }
      return <span key={`txt-${index}-${i}`}>{segment}</span>;
    });

    nodes.push(
      <span key={`seg-${index}`} className={className}>
        {rendered}
      </span>
    );
  });

  return <>{nodes}</>;
};
