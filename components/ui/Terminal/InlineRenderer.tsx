import React from 'react';

const TAG_REGEX = /(\[(?:\/)?(?:h1|h2|h3|b|code|muted|info|warn|success|error|box|inflection)\])/g;
const ICON_REGEX = /\[icon:([a-z-]+)\]/g;

const ICONS: Record<string, string> = {
  bolt: '⚡',
  rocket: '🚀',
  fire: '🔥',
  check: '✅',
  warn: '⚠️',
  info: 'ℹ️',
  star: '⭐',
};

const STYLE_MAP: Record<string, string> = {
  h1: 'text-[#06b6d4] font-black tracking-widest uppercase text-base sm:text-lg mb-2',
  h2: 'text-[#06b6d4] font-bold tracking-wide text-sm sm:text-base mb-1',
  h3: 'text-[#06b6d4] font-semibold text-xs sm:text-sm mb-1',
  b: 'text-white font-bold',
  code: 'text-[#10b981] bg-white/5 px-1 rounded font-mono',
  muted: 'text-white/40',
  info: 'text-[#06b6d4]',
  warn: 'text-yellow-400',
  success: 'text-[#10b981]',
  error: 'text-red-400',
  inflection: 'text-[#8b5cf6] font-bold italic',
};

export const InlineRenderer: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;

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

    const isBox = activeTags.includes('box');

    const iconSplit = piece.split(ICON_REGEX);
    const rendered = iconSplit.map((segment, i) => {
      if (i % 2 === 1) {
        return <span key={`icon-${index}-${i}`} className="inline-block mr-1">{ICONS[segment] ?? '•'}</span>;
      }
      return <span key={`txt-${index}-${i}`}>{segment}</span>;
    });

    if (isBox) {
      nodes.push(
        <div 
          key={`box-${index}`} 
          className="my-4 border-2 border-[#06b6d4] rounded-lg p-4 bg-[#111118]/80 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
        >
          <div className="flex flex-col gap-2">
            {rendered}
          </div>
        </div>
      );
    } else {
      nodes.push(
        <span key={`seg-${index}`} className={className}>
          {rendered}
        </span>
      );
    }
  });

  return <>{nodes}</>;
};
