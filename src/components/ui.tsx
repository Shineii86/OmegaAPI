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
      className="text-[0.65rem] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-[#5c5a70] hover:text-[#e8e6f0] transition-all border border-transparent hover:border-[#1e1e3a]"
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
      <div className="absolute top-[0.6rem] right-3 opacity-0 group-hover:opacity-100 transition-opacity">
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
