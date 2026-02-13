import React from 'react';

interface ContentScoreProps {
  relevance: number;
  quality: number;
  uniqueness: number;
  overall: number;
  tags: string[];
  summary: string;
  sentiment: string;
}

export const ContentScore: React.FC<ContentScoreProps> = ({
  relevance,
  quality,
  uniqueness,
  overall,
  tags,
  summary,
  sentiment,
}) => {
  const getProgressBar = (score: number) => {
    const filled = Math.round(score / 10);
    const empty = 10 - filled;
    return `[${'█'.repeat(filled)}${'░'.repeat(empty)}] ${score}%`;
  };

  const getSentimentColor = (s: string) => {
    if (s === 'positive') return 'text-[#10b981]';
    if (s === 'negative') return 'text-[#ef4444]';
    return 'text-[#f59e0b]';
  };

  return (
    <div className="bg-[rgba(6,182,212,0.1)] backdrop-blur-[10px] border border-[rgba(6,182,212,0.3)] rounded-lg p-6 my-4 transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:border-[#06b6d4]">
      <h3 className="text-lg font-bold text-[#06b6d4] mb-4">🧠 AI CONTENT ANALYSIS</h3>
      
      <div className="space-y-2 font-mono text-sm">
        <div className="flex justify-between">
          <span className="text-[#67e8f9]">Relevance:</span>
          <span className="text-[#10b981]">{getProgressBar(relevance)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#67e8f9]">Quality:</span>
          <span className="text-[#10b981]">{getProgressBar(quality)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#67e8f9]">Uniqueness:</span>
          <span className="text-[#10b981]">{getProgressBar(uniqueness)}</span>
        </div>
        <div className="border-t border-[#06b6d4]/30 my-2 pt-2">
          <div className="flex justify-between font-bold">
            <span className="text-[#67e8f9]">OVERALL:</span>
            <span className={overall > 85 ? 'text-[#10b981]' : overall > 60 ? 'text-[#f59e0b]' : 'text-[#ef4444]'}>
              {getProgressBar(overall)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <span className="text-[#67e8f9] text-sm">Sentiment: </span>
        <span className={`${getSentimentColor(sentiment)} font-bold`}>
          {sentiment.toUpperCase()}
        </span>
      </div>

      <div className="mt-4">
        <span className="text-[#67e8f9] text-sm">Tags: </span>
        <div className="flex flex-wrap gap-2 mt-1">
          {tags.map((tag, i) => (
            <span key={i} className="px-2 py-1 bg-[rgba(6,182,212,0.2)] text-[#67e8f9] text-xs rounded border border-[rgba(6,182,212,0.3)]">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-black/30 rounded border border-[rgba(6,182,212,0.2)]">
        <span className="text-[#67e8f9] text-sm block mb-1">Summary:</span>
        <p className="text-[#cffafe] text-sm">{summary}</p>
      </div>
    </div>
  );
};