import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ContentScore } from './ContentScore';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface QueueItem {
  id: string;
  content_id: string;
  status: string;
  priority: number;
  notes: string;
  created_at: string;
  content_items: {
    title: string;
    url: string;
    author: string;
  };
  content_scores: {
    relevance_score: number;
    quality_score: number;
    uniqueness_score: number;
    overall_score: number;
    tags: string[];
    summary: string;
    sentiment: string;
  };
}

export const CurationQueue: React.FC = () => {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQueue();
  }, [filter]);

  const fetchQueue = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('content_curation_queue')
      .select(`
        *,
        content_items (title, url, author),
        content_scores (relevance_score, quality_score, uniqueness_score, overall_score, tags, summary, sentiment)
      `)
      .eq('status', filter)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });

    if (!error && data) {
      setItems(data as QueueItem[]);
    }
    setLoading(false);
  };

  const handleAction = async (itemId: string, action: string) => {
    const updates: any = { status: action };
    if (action === 'approved' || action === 'rejected') {
      updates.reviewed_at = new Date().toISOString();
    }

    await supabase
      .from('content_curation_queue')
      .update(updates)
      .eq('id', itemId);

    fetchQueue();
  };

  const getPriorityBadge = (priority: number) => {
    if (priority === 3) return { text: '🔥 HIGH', color: 'bg-[#10b981]/20 text-[#10b981]' };
    if (priority === 2) return { text: '⚡ MEDIUM', color: 'bg-[#f59e0b]/20 text-[#f59e0b]' };
    return { text: '❄️ LOW', color: 'bg-[#3b82f6]/20 text-[#3b82f6]' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#06b6d4]">📋 CONTENT CURATION QUEUE</h2>
        <div className="flex gap-2">
          {['pending', 'approved', 'rejected', 'scheduled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 border rounded text-sm uppercase ${
                filter === status
                  ? 'bg-[rgba(6,182,212,0.2)] border-[#06b6d4] text-[#67e8f9]'
                  : 'border-[rgba(6,182,212,0.3)] text-[#06b6d4]/60 hover:border-[#06b6d4]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[rgba(6,182,212,0.1)] backdrop-blur-[10px] border border-[rgba(6,182,212,0.3)] rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-[#f59e0b]">{items.filter(i => i.status === 'pending').length}</div>
          <div className="text-sm text-[#06b6d4]/60">PENDING</div>
        </div>
        <div className="bg-[rgba(6,182,212,0.1)] backdrop-blur-[10px] border border-[rgba(6,182,212,0.3)] rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-[#10b981]">{items.filter(i => i.priority === 3).length}</div>
          <div className="text-sm text-[#06b6d4]/60">HIGH PRIORITY</div>
        </div>
        <div className="bg-[rgba(6,182,212,0.1)] backdrop-blur-[10px] border border-[rgba(6,182,212,0.3)] rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-[#06b6d4]">{items.filter(i => i.status === 'approved').length}</div>
          <div className="text-sm text-[#06b6d4]/60">APPROVED</div>
        </div>
        <div className="bg-[rgba(6,182,212,0.1)] backdrop-blur-[10px] border border-[rgba(6,182,212,0.3)] rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-[#3b82f6]">{items.filter(i => i.status === 'scheduled').length}</div>
          <div className="text-sm text-[#06b6d4]/60">SCHEDULED</div>
        </div>
      </div>

      {/* Queue Items */}
      {loading ? (
        <div className="text-center py-12 text-[#06b6d4]">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-[#06b6d4]/60">No items in queue</div>
      ) : (
        <div className="space-y-6">
          {items.map((item) => {
            const priority = getPriorityBadge(item.priority);
            return (
              <div key={item.id} className="bg-[rgba(6,182,212,0.1)] backdrop-blur-[10px] border border-[rgba(6,182,212,0.3)] rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#67e8f9] mb-1">
                      {item.content_items?.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-[#06b6d4]/60">
                      <span>👤 {item.content_items?.author || 'Unknown'}</span>
                      <a href={item.content_items?.url} target="_blank" rel="noopener noreferrer" className="text-[#06b6d4] hover:underline">
                        🔗 View Source
                      </a>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded text-xs font-bold ${priority.color}`}>
                    {priority.text}
                  </span>
                </div>

                {item.content_scores && (
                  <ContentScore
                    relevance={item.content_scores.relevance_score}
                    quality={item.content_scores.quality_score}
                    uniqueness={item.content_scores.uniqueness_score}
                    overall={item.content_scores.overall_score}
                    tags={item.content_scores.tags}
                    summary={item.content_scores.summary}
                    sentiment={item.content_scores.sentiment}
                  />
                )}

                {filter === 'pending' && (
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleAction(item.id, 'approved')}
                      className="px-4 py-2 bg-[#10b981]/20 border border-[#10b981] text-[#10b981] rounded hover:bg-[#10b981]/30"
                    >
                      ✅ APPROVE
                    </button>
                    <button
                      onClick={() => handleAction(item.id, 'rejected')}
                      className="px-4 py-2 bg-[#ef4444]/20 border border-[#ef4444] text-[#ef4444] rounded hover:bg-[#ef4444]/30"
                    >
                      ❌ REJECT
                    </button>
                    <button
                      onClick={() => handleAction(item.id, 'scheduled')}
                      className="px-4 py-2 bg-[#06b6d4]/20 border border-[#06b6d4] text-[#06b6d4] rounded hover:bg-[#06b6d4]/30"
                    >
                      📅 SCHEDULE
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};