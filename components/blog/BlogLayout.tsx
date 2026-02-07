import React from 'react';
import { Link } from 'react-router-dom';

interface BlogLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const BlogLayout: React.FC<BlogLayoutProps> = ({ children, title = 'APEX OS Content Hub' }) => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#06b6d4] font-mono">
      {/* ASCII Header */}
      <header className="border-2 border-[#06b6d4] p-4 m-4 shadow-[0_0_10px_rgba(6,182,212,0.5)] bg-[rgba(6,182,212,0.1)]">
        <div className="text-center">
          <pre className="text-[#06b6d4] text-xs md:text-sm lg:text-base whitespace-pre-wrap">
{`
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║           🔥 APEX OS CONTENT HUB v2.0 🔥                        ║
║           Neural Content Aggregation & Distribution              ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
`}
          </pre>
          <div className="flex justify-center gap-4 mt-4 text-sm">
            <span className="text-[#10b981]">🟢 SYSTEM ONLINE</span>
            <span className="text-[#06b6d4]">|</span>
            <span className="text-[#10b981]">AGENTS: 17 ACTIVE</span>
            <span className="text-[#06b6d4]">|</span>
            <span className="text-[#06b6d4]">VERTEX AI: CONNECTED</span>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-[#06b6d4]/30 py-4 px-6">
        <div className="max-w-7xl mx-auto flex gap-6">
          <Link to="/blog" className="text-[#06b6d4] hover:text-[#10b981] transition-colors">[ BLOG ]</Link>
          <Link to="/blog/curation" className="text-[#06b6d4] hover:text-[#10b981] transition-colors">[ CURATION ]</Link>
          <Link to="/blog/analytics" className="text-[#06b6d4] hover:text-[#10b981] transition-colors">[ ANALYTICS ]</Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#06b6d4]/30 py-6 px-6 mt-12">
        <div className="max-w-7xl mx-auto text-center text-sm text-[#06b6d4]/60">
          <div className="flex justify-center gap-8 mb-4">
            <div>CONTENT PIPELINE: <span className="text-[#10b981]">[████████░░] 80%</span></div>
            <div>AI SCORING: <span className="text-[#10b981]">[██████████] 100%</span></div>
            <div>CURATION QUEUE: <span className="text-[#f59e0b]">[████░░░░░░] 40%</span></div>
          </div>
          <p>© 2026 APEX OS | Neural Content Distribution System</p>
        </div>
      </footer>
    </div>
  );
};