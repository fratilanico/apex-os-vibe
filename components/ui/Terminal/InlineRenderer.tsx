import React from 'react';

const TAG_REGEX = /(\[(?:\/)?(?:h1|h2|h3|b|code|muted|info|warn|success|error|choice|cyan|violet|emerald|pink|amber|gold|blue|lime|rose|indigo)\])/gi;
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
  h1: 'text-amber-400 font-bold tracking-widest uppercase text-sm',
  h2: 'text-amber-300 font-semibold tracking-wide text-sm',
  h3: 'text-amber-200 font-semibold text-sm',
  b: 'text-white font-semibold',
  code: 'text-amber-200 bg-white/5 px-1 rounded font-mono',
  muted: 'text-white/20',
  info: 'text-amber-400',
  warn: 'text-yellow-500',
  success: 'text-emerald-500',
  error: 'text-red-500',
  choice: 'text-violet-400 font-bold italic border-b border-violet-500/30',
  cyan: 'text-cyan-400',
  violet: 'text-violet-400',
  emerald: 'text-emerald-400',
  pink: 'text-pink-400',
  amber: 'text-amber-500',
  gold: 'text-yellow-500 font-bold',
  blue: 'text-blue-400',
  lime: 'text-lime-400',
  rose: 'text-rose-400',
  indigo: 'text-indigo-400',
};

export const InlineRenderer: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;
  const pieces = text.split(TAG_REGEX);
  const activeTags: string[] = [];
  const nodes: React.ReactNode[] = [];

  pieces.forEach((piece, index) => {
    if (!piece) return;
    if (piece.startsWith('[') && piece.endsWith(']')) {
      const tag = piece.slice(1, -1).toLowerCase();
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
