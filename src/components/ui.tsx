'use client';

import { useState } from 'react';

export function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="text-[0.62rem] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-[#a5b4fc] hover:text-white transition-all"
    >
      {copied ? '✓ copied' : 'copy'}
    </button>
  );
}

export function CodeBlock({ code, lang = 'bash', title }: { code: string; lang?: string; title?: string }) {
  return (
    <div className="code-block group relative">
      {title && (
        <div className="code-header">
          <div className="dots"><span /><span /><span /></div>
          <span>{title}</span>
        </div>
      )}
      <pre><code>{code}</code></pre>
      <div className="absolute top-[0.5rem] right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <CopyBtn text={code} />
      </div>
    </div>
  );
}

export function formatViews(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toString();
}

export function formatDate(d: string): string {
  if (!d) return '';
  try { return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); }
  catch { return d; }
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-7 h-7 border-2 border-[var(--border)] border-t-[var(--accent)] rounded-full animate-spin" />
    </div>
  );
}

export function EmptyState({ icon, title, description }: { icon?: React.ReactNode; title: string; description: string }) {
  return (
    <div className="text-center py-16">
      {icon && <div className="flex justify-center mb-4 text-[var(--text-muted)]">{icon}</div>}
      <h3 className="text-lg font-semibold mb-2 text-[var(--text)]">{title}</h3>
      <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto">{description}</p>
    </div>
  );
}
