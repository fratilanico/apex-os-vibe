import React from 'react';
import { Link } from 'react-router-dom';

interface BlogPostCardProps {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  publishedAt: string;
  author: string;
  tags: string[];
  aiScore?: number;
  featuredImage?: string;
}

export const BlogPostCard: React.FC<BlogPostCardProps> = ({
  title,
  excerpt,
  slug,
  publishedAt,
  author,
  tags,
  aiScore,
  featuredImage,
}) => {
  const getScoreBadge = (score: number) => {
    if (score >= 85) return { text: '🔥 HOT', color: 'text-[#10b981] border-[#10b981]' };
    if (score >= 60) return { text: '⚡ WARM', color: 'text-[#f59e0b] border-[#f59e0b]' };
    return { text: '❄️ COLD', color: 'text-[#3b82f6] border-[#3b82f6]' };
  };

  const scoreBadge = aiScore ? getScoreBadge(aiScore) : null;

  return (
    <article className="bg-[rgba(6,182,212,0.1)] backdrop-blur-[10px] border border-[rgba(6,182,212,0.3)] rounded-lg p-6 my-4 transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:border-[#06b6d4] cursor-pointer">
      <Link to={`/blog/${slug}`} className="block">
        {featuredImage && (
          <div className="mb-4 overflow-hidden rounded border border-[rgba(6,182,212,0.3)]">
            <img src={featuredImage} alt={title} className="w-full h-48 object-cover" />
          </div>
        )}
        
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-xl font-bold text-[#67e8f9] hover:text-[#10b981] transition-colors line-clamp-2">
            {title}
          </h2>
          {scoreBadge && (
            <span className={`px-2 py-1 text-xs border rounded ${scoreBadge.color} whitespace-nowrap ml-2`}>
              {scoreBadge.text}
            </span>
          )}
        </div>

        <p className="text-[#cffafe]/80 text-sm mb-4 line-clamp-3">{excerpt}</p>

        <div className="flex items-center justify-between text-xs text-[#06b6d4]/60">
          <div className="flex items-center gap-4">
            <span>👤 {author}</span>
            <span>📅 {new Date(publishedAt).toLocaleDateString()}</span>
          </div>
          
          <div className="flex gap-2">
            {tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-[#06b6d4]">#{tag}</span>
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
};