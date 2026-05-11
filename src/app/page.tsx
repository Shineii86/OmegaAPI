'use client';

import { useState, useEffect, useRef } from 'react';

const BASE = typeof window !== 'undefined' ? window.location.origin : 'https://omegaapi.vercel.app';

const keywords = [
  'Free API', 'No Auth', 'Manga Data', 'Manhwa & Webtoon', 'CORS Ready',
  'REST API', 'Sub-Second Cache', 'Rate Limiting', 'Open Source', 'MIT Licensed',
  'OmegaScans Powered', 'JSON Responses', 'Full-Text Search', 'Series Metadata',
  'Chapter Images', 'Edge Runtime', 'Zero Config', 'TypeScript',
];

const endpoints = [
  {
    method: 'GET', path: '/api/v1/series', label: 'series',
    desc: 'Browse all series with search & pagination',
    params: [
      { name: 'page', type: 'int', required: false, def: '1', desc: 'Page number' },
      { name: 'perPage', type: 'int', required: false, def: '20', desc: 'Results per page (max 100)' },
      { name: 'q', type: 'string', required: false, def: '—', desc: 'Search query to filter' },
    ],
    curl: `curl "${BASE}/api/v1/series?page=1&perPage=5"`,
    js: `const res = await fetch('${BASE}/api/v1/series?page=1&perPage=5');
const { success, data, pagination } = await res.json();

data.forEach(s => {
  console.log(s.title, s.rating, s.status);
});`,
  },
  {
    method: 'GET', path: '/api/v1/series/{slug}', label: 'series/{slug}',
    desc: 'Get complete series details by slug',
    params: [
      { name: 'slug', type: 'string', required: true, def: '—', desc: 'URL-friendly identifier' },
      { name: 'include', type: 'string', required: false, def: '—', desc: '"chapters" to embed list' },
    ],
    curl: `curl "${BASE}/api/v1/series/sex-stopwatch?include=chapters"`,
    js: `const res = await fetch(
  '${BASE}/api/v1/series/sex-stopwatch?include=chapters'
);
const { data } = await res.json();

console.log(data.title);        // "Sex Stopwatch"
console.log(data.rating);       // 4.96
console.log(data.chaptersCount); // 155
console.log(data.chapters);     // [{ id, name, slug, ... }]`,
  },
  {
    method: 'GET', path: '/api/v1/chapters/{slug}', label: 'chapters/{slug}',
    desc: 'Get all chapters for a series',
    params: [
      { name: 'slug', type: 'string', required: true, def: '—', desc: 'Series slug' },
      { name: 'page', type: 'int', required: false, def: '1', desc: 'Page number' },
      { name: 'perPage', type: 'int', required: false, def: '100', desc: 'Per page (max 500)' },
    ],
    curl: `curl "${BASE}/api/v1/chapters/sex-stopwatch"`,
    js: `const res = await fetch('${BASE}/api/v1/chapters/sex-stopwatch');
const { data, pagination } = await res.json();

console.log(pagination.total); // 155
data.forEach(ch => {
  console.log(ch.name, ch.isFree, ch.url);
});`,
  },
  {
    method: 'GET', path: '/api/v1/chapter/{slug}/{chapter}', label: 'chapter/{slug}/{chapter}',
    desc: 'Get chapter content with all image URLs',
    params: [
      { name: 'slug', type: 'string', required: true, def: '—', desc: 'Series slug' },
      { name: 'chapter', type: 'string', required: true, def: '—', desc: 'Chapter slug (e.g. chapter-1)' },
    ],
    curl: `curl "${BASE}/api/v1/chapter/sex-stopwatch/chapter-1"`,
    js: `const res = await fetch(
  '${BASE}/api/v1/chapter/sex-stopwatch/chapter-1'
);
const { data } = await res.json();

console.log(data.pageCount);   // 13
console.log(data.images[0]);   // "https://media.omegascans.org/..."
console.log(data.series.title); // "Sex Stopwatch"`,
  },
  {
    method: 'GET', path: '/api/v1/search?q={query}', label: 'search',
    desc: 'Full-text search across all series',
    params: [
      { name: 'q', type: 'string', required: true, def: '—', desc: 'Search query' },
      { name: 'page', type: 'int', required: false, def: '1', desc: 'Page number' },
    ],
    curl: `curl "${BASE}/api/v1/search?q=solo"`,
    js: `const res = await fetch('${BASE}/api/v1/search?q=solo');
const { data } = await res.json();

data.forEach(s => {
  console.log(s.title, s.slug, s.status);
});`,
  },
  {
    method: 'GET', path: '/api/v1/genres', label: 'genres',
    desc: 'List all available genres',
    params: [],
    curl: `curl "${BASE}/api/v1/genres"`,
    js: `const res = await fetch('${BASE}/api/v1/genres');
const { data } = await res.json();
console.log(data.genres); // ["Action", "Adult", ...]`,
  },
  {
    method: 'GET', path: '/api/v1/health', label: 'health',
    desc: 'API health with upstream probe & uptime',
    params: [],
    curl: `curl "${BASE}/api/v1/health"`,
    js: `const res = await fetch('${BASE}/api/v1/health');
const { data } = await res.json();

console.log(data.status);           // "ok"
console.log(data.upstream.status);  // "ok"
console.log(data.upstream.latencyMs); // 180`,
  },
  {
    method: 'GET', path: '/api/v1/stats', label: 'stats',
    desc: 'API statistics and endpoint listing',
    params: [],
    curl: `curl "${BASE}/api/v1/stats"`,
    js: `const res = await fetch('${BASE}/api/v1/stats');
const { data } = await res.json();

console.log(data.name);     // "OmegaAPI"
console.log(data.version);  // "1.0.0"
console.log(data.endpoints); // [...]`,
  },
];

/* ── SVG Icon Components ── */
function IconSignal({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h.01M7 20v-4M12 20v-8M17 20V8M22 20V4" /></svg>;
}
function IconBolt({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>;
}
function IconLockOpen({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 9.9-1" /></svg>;
}
function IconDiamond({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 13L2 9z" /><path d="M11 3l-1.5 6L2 9M13 3l1.5 6 9.5 0M12 22L8.5 9h7L12 22" /></svg>;
}
function IconSearch({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>;
}
function IconBook({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>;
}
function IconZap({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>;
}
function IconGlobe({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>;
}
function IconShield({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
}
function IconServer({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2" /><rect x="2" y="14" width="20" height="8" rx="2" ry="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></svg>;
}
function IconBarChart({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></svg>;
}
function IconHeartPulse({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19.5 12.572l-7.5 7.428-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572" /><path d="M6 12h2l2-4 3 8 2-4h3" /></svg>;
}
function IconPlay({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>;
}
function IconDatabase({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>;
}
function IconSettings({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>;
}
function IconFileText({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>;
}
function IconChevronRight({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>;
}
function IconExternalLink({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>;
}

// ── Animated Counter ──
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1200;
          const step = target / (duration / 16);
          let current = 0;
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, 16);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="counter-value">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

// ── Copy Button ──
function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="text-[0.65rem] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-[var(--text-muted)] hover:text-[var(--text)] transition-all border border-transparent hover:border-[var(--border)]"
    >
      {copied ? '✓ copied' : 'copy'}
    </button>
  );
}

// ── Code Block ──
function CodeBlock({ code, lang = 'bash' }: { code: string; lang?: string }) {
  return (
    <div className="code-block">
      <div className="code-header">
        <div className="dots">
          <span /><span /><span />
        </div>
        <span>{lang}</span>
      </div>
      <pre><code>{code}</code></pre>
      <div className="absolute top-[2.6rem] right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <CopyBtn text={code} />
      </div>
    </div>
  );
}

// ── Search Modal (⌘K) ──
function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('');
  const [focusIdx, setFocusIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = endpoints.filter(
    (ep) =>
      ep.path.toLowerCase().includes(q.toLowerCase()) ||
      ep.desc.toLowerCase().includes(q.toLowerCase()) ||
      ep.label.toLowerCase().includes(q.toLowerCase())
  );

  useEffect(() => {
    if (open) {
      setQ('');
      setFocusIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (open) onClose();
      }
      if (e.key === 'Escape' && open) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-modal animate-fade-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 border-b border-[var(--border)]">
          <IconSearch size={18} />
          <input
            ref={inputRef}
            className="search-input"
            placeholder="Search endpoints..."
            value={q}
            onChange={(e) => { setQ(e.target.value); setFocusIdx(0); }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setFocusIdx((i) => Math.min(i + 1, filtered.length - 1)); }
              if (e.key === 'ArrowUp') { e.preventDefault(); setFocusIdx((i) => Math.max(i - 1, 0)); }
              if (e.key === 'Enter' && filtered[focusIdx]) {
                const el = document.getElementById(`ep-${filtered[focusIdx].label}`);
                el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                onClose();
              }
            }}
          />
          <kbd className="text-[0.6rem] font-mono bg-white/[0.04] border border-[var(--border)] rounded px-1.5 py-0.5 text-[var(--text-muted)]">ESC</kbd>
        </div>
        {filtered.length > 0 ? (
          <div className="max-h-72 overflow-y-auto">
            {filtered.map((ep, i) => (
              <div
                key={ep.label}
                className={`search-result ${i === focusIdx ? 'focused' : ''}`}
                onClick={() => {
                  const el = document.getElementById(`ep-${ep.label}`);
                  el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  onClose();
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="badge-get">{ep.method}</span>
                  <span className="font-mono text-sm text-[var(--text)]">{ep.path}</span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-1">{ep.desc}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-sm text-[var(--text-muted)]">No endpoints found</div>
        )}
      </div>
    </div>
  );
}

// ── Playground ──
function Playground() {
  const [url, setUrl] = useState(`${BASE}/api/v1/health`);
  const [resp, setResp] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<number | null>(null);
  const [time, setTime] = useState<number | null>(null);

  const run = async () => {
    setLoading(true);
    setStatus(null);
    setTime(null);
    const start = performance.now();
    try {
      const res = await fetch(url);
      setStatus(res.status);
      setTime(Math.round(performance.now() - start));
      const data = await res.json();
      setResp(JSON.stringify(data, null, 2));
    } catch (err) {
      setStatus(0);
      setResp(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--cyan)] flex items-center justify-center text-white">
          <IconPlay size={18} />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Live Playground</h3>
          <p className="text-xs text-[var(--text-muted)]">Test any endpoint in real-time</p>
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && run()}
          placeholder="Enter API URL..."
          className="flex-1 bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm font-mono text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]/50 transition-colors"
        />
        <button onClick={run} disabled={loading} className="btn-primary text-sm px-5 disabled:opacity-50">
          {loading ? '...' : 'Send'}
        </button>
      </div>
      <div className="flex gap-3 mb-4 h-6 items-center">
        {status !== null && (
          <span className={`tag ${status >= 200 && status < 300 ? 'tag-green' : status >= 400 ? 'tag-rose' : 'tag-amber'}`}>
            {status}
          </span>
        )}
        {time !== null && (
          <span className="tag tag-cyan">{time}ms</span>
        )}
      </div>
      {resp && (
        <div className="code-block">
          <div className="code-header">
            <div className="dots"><span /><span /><span /></div>
            <span>response</span>
          </div>
          <pre className="!text-[0.78rem] max-h-80 overflow-auto"><code>{resp}</code></pre>
        </div>
      )}
    </div>
  );
}

// ── Health Badge ──
function HealthBadge() {
  const [health, setHealth] = useState<{ status: string; upstream: { status: string; latencyMs: number } } | null>(null);
  useEffect(() => {
    fetch(`${BASE}/api/v1/health`).then(r => r.json()).then(setHealth).catch(() => {});
  }, []);

  if (!health) return (
    <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-pulse" />
      checking...
    </div>
  );

  const ok = health.upstream?.status === 'ok';
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <span className={`w-2 h-2 rounded-full ${ok ? 'bg-[var(--emerald)] shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-[var(--amber)]'}`} />
      <span className="text-[var(--text-dim)]">
        {ok ? 'Operational' : 'Degraded'} · {health.upstream?.latencyMs}ms
      </span>
    </div>
  );
}

// ── Main Page ──
export default function HomePage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeEp, setActiveEp] = useState(0);
  const [codeTab, setCodeTab] = useState<'curl' | 'js'>('curl');
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const ep = endpoints[activeEp];

  return (
    <main className="grid-bg relative">
      <div className="orb orb-purple w-[500px] h-[500px] top-[-100px] left-[-100px]" />
      <div className="orb orb-cyan w-[400px] h-[400px] top-[200px] right-[-80px]" />

      {/* ── Nav ── */}
      <nav className="glass sticky top-0 z-50 border-b border-[var(--border)]/40">
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--cyan)] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow">
              Ω
            </div>
            <span className="font-bold text-lg tracking-tight">OmegaAPI</span>
            <span className="tag tag-purple ml-1 hidden sm:inline-flex">v1.0</span>
          </a>

          <div className="hidden md:flex items-center gap-6">
            <a href="/docs" className="text-sm text-[var(--text-dim)] hover:text-[var(--text)] transition-colors">Docs</a>
            <a href="/browse" className="text-sm text-[var(--text-dim)] hover:text-[var(--text)] transition-colors">Browse</a>
            <a href="/support" className="text-sm text-[var(--text-dim)] hover:text-[var(--text)] transition-colors">Support</a>
            <HealthBadge />
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 text-sm text-[var(--text-muted)] bg-white/[0.03] border border-[var(--border)] rounded-lg px-3 py-1.5 hover:border-[var(--accent)]/30 transition-colors"
            >
              <IconSearch size={14} />
              Search
              <kbd className="text-[0.6rem] font-mono bg-white/[0.04] border border-[var(--border)] rounded px-1 py-0.5 ml-1">⌘K</kbd>
            </button>
          </div>

          <button className="md:hidden text-[var(--text-dim)]" onClick={() => setMobileMenu(!mobileMenu)}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenu ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {mobileMenu && (
          <div className="md:hidden border-t border-[var(--border)] px-5 py-4 space-y-3 animate-fade-in">
            <a href="/docs" className="block text-sm text-[var(--text-dim)]" onClick={() => setMobileMenu(false)}>Docs</a>
            <a href="/browse" className="block text-sm text-[var(--text-dim)]" onClick={() => setMobileMenu(false)}>Browse</a>
            <a href="#features" className="block text-sm text-[var(--text-dim)]" onClick={() => setMobileMenu(false)}>Features</a>
            <a href="#endpoints" className="block text-sm text-[var(--text-dim)]" onClick={() => setMobileMenu(false)}>API</a>
            <a href="#playground" className="block text-sm text-[var(--text-dim)]" onClick={() => setMobileMenu(false)}>Playground</a>
            <a href="/support" className="block text-sm text-[var(--text-dim)]" onClick={() => setMobileMenu(false)}>Support</a>
            <HealthBadge />
          </div>
        )}
      </nav>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 pt-20 md:pt-28 pb-16 text-center relative">
        <div className="animate-fade-up opacity-0">
          <div className="inline-flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-[var(--emerald)] shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-xs text-[var(--text-dim)]">Live and Free — Powered by OmegaScans</span>
          </div>

          <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-6">
            <span className="gradient-text">The API for</span><br />
            <span className="gradient-text">Manga and Manhwa</span><br />
            <span className="gradient-text">Data</span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--text-dim)] max-w-xl mx-auto mb-10 leading-relaxed">
            Browse series. Get chapter images. Search titles.<br className="hidden md:block" />
            No API key. No signup. Just build.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {['Free API', 'No Auth', 'Manga Data', 'Chapter Images', 'CORS Ready', 'Edge Cached'].map((t) => (
              <span key={t} className="tag tag-purple">{t}</span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <a href="#endpoints" className="btn-primary text-sm">
              Explore Endpoints <IconChevronRight size={14} />
            </a>
            <a href="#playground" className="btn-ghost text-sm">
              Try it Live
            </a>
          </div>

          <div className="max-w-2xl mx-auto">
            <CodeBlock code={`curl "${BASE}/api/v1/series/sex-stopwatch"`} lang="bash" />
          </div>
        </div>
      </section>

      {/* ── Marquee ── */}
      <section className="py-6 border-y border-[var(--border)]/40 overflow-hidden mb-20">
        <div className="marquee-track">
          {[...keywords, ...keywords].map((kw, i) => (
            <span key={i} className="flex items-center gap-3 px-5 text-sm font-medium text-[var(--text-muted)] whitespace-nowrap select-none">
              {kw}
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]/40" />
            </span>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 mb-24">
        <div className="stat-grid grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: 8, suffix: '', label: 'Endpoints', icon: <IconSignal size={24} /> },
            { value: 60, suffix: '', label: 'Req/Min', icon: <IconBolt size={24} /> },
            { value: 0, suffix: '', label: 'Auth Needed', icon: <IconLockOpen size={24} /> },
            { value: 100, suffix: '%', label: 'Free Forever', icon: <IconDiamond size={24} /> },
          ].map((s, i) => (
            <div
              key={s.label}
              className={`glass-card rounded-2xl p-6 text-center animate-fade-up opacity-0 stagger-${i + 1}`}
            >
              <div className="flex justify-center mb-3 text-[var(--accent-light)]">{s.icon}</div>
              <div className="text-3xl md:text-4xl font-black mb-1">
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </div>
              <div className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Architecture ── */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 mb-24">
        <div className="text-center mb-12">
          <p className="section-label">Architecture</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">How It Works</h2>
          <p className="text-[var(--text-dim)] mt-3 max-w-lg mx-auto">
            OmegaAPI sits between raw OmegaScans data and your app — normalizing, caching, and protecting.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              step: '01', title: 'Source', subtitle: 'OmegaScans',
              desc: 'Raw manga and manhwa data from the upstream provider',
              color: 'var(--cyan)',
              icon: <IconDatabase size={24} />,
            },
            {
              step: '02', title: 'Middleware', subtitle: 'OmegaAPI',
              desc: 'Caching, Rate Limiting, Normalization, Error Handling',
              color: 'var(--accent)',
              icon: <IconSettings size={24} />,
            },
            {
              step: '03', title: 'Output', subtitle: 'Clean JSON',
              desc: 'Consistent, well-structured responses ready for your app',
              color: 'var(--emerald)',
              icon: <IconFileText size={24} />,
            },
          ].map((a, i) => (
            <div key={a.step} className="glass-card rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 text-[5rem] font-black opacity-[0.03] leading-none select-none" style={{ color: a.color }}>
                {a.step}
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${a.color}15`, color: a.color }}>
                  {a.icon}
                </div>
                <div>
                  <div className="text-[0.6rem] font-bold uppercase tracking-widest" style={{ color: a.color }}>
                    Step {a.step}
                  </div>
                  <div className="font-semibold text-lg">{a.title}</div>
                </div>
              </div>
              <div className="text-sm font-semibold text-[var(--text-dim)] mb-2">{a.subtitle}</div>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{a.desc}</p>
              {i < 2 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] z-10">
                  <IconChevronRight size={20} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="max-w-6xl mx-auto px-5 md:px-8 mb-24">
        <div className="text-center mb-12">
          <p className="section-label">Capabilities</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">Everything You Need</h2>
          <p className="text-[var(--text-dim)] mt-3 max-w-lg mx-auto">
            A complete API for building manga readers, trackers, and discovery tools.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: <IconSearch size={22} />, title: 'Full-Text Search', desc: 'Search across hundreds of series by title with instant results and pagination.' },
            { icon: <IconBook size={22} />, title: 'Chapter Images', desc: 'Get every page image URL for any chapter. Perfect for building reader apps.' },
            { icon: <IconZap size={22} />, title: 'Sub-Second Cache', desc: 'In-memory caching with 5-15 min TTL. Repeated requests served in milliseconds.' },
            { icon: <IconLockOpen size={22} />, title: 'Zero Authentication', desc: 'No API keys, no sign-ups, no OAuth. Make a request, get JSON.' },
            { icon: <IconGlobe size={22} />, title: 'CORS Ready', desc: 'Call directly from any frontend — browser, mobile, desktop, extension.' },
            { icon: <IconShield size={22} />, title: 'Rate Limiting', desc: '60 req/min per IP with informative headers. Fair usage enforced.' },
            { icon: <IconBarChart size={22} />, title: 'Rich Metadata', desc: 'Rating, status, views, author, studio, release schedule, alternative names.' },
            { icon: <IconHeartPulse size={22} />, title: 'Health Monitoring', desc: '/health endpoint with upstream probe, latency, and uptime tracking.' },
            { icon: <IconPlay size={22} />, title: 'Live Playground', desc: 'Test any endpoint directly from the docs. No setup needed.' },
          ].map((f) => (
            <div key={f.title} className="glass-card rounded-2xl p-6 group">
              <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 text-[var(--accent-light)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="font-semibold text-base mb-2">{f.title}</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── API Reference ── */}
      <section id="endpoints" className="max-w-6xl mx-auto px-5 md:px-8 mb-24">
        <div className="text-center mb-12">
          <p className="section-label">API Reference</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">Clean, Predictable Endpoints</h2>
          <p className="text-[var(--text-dim)] mt-3 max-w-lg mx-auto">
            Every response follows the same envelope format. No surprises.
          </p>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-4">
          <div className="glass-card rounded-2xl p-3 overflow-y-auto max-h-[600px]">
            {endpoints.map((e, i) => (
              <div
                key={e.label}
                id={`ep-${e.label}`}
                className={`endpoint-row ${i === activeEp ? 'active' : ''}`}
                onClick={() => { setActiveEp(i); setCodeTab('curl'); }}
              >
                <span className="badge-get shrink-0">{e.method}</span>
                <span className="font-mono text-xs text-[var(--text)] truncate">{e.path}</span>
              </div>
            ))}
          </div>

          <div className="glass-card rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="badge-get">{ep.method}</span>
              <code className="font-mono text-sm text-[var(--accent-light)]">{ep.path}</code>
            </div>
            <p className="text-sm text-[var(--text-dim)] mb-6">{ep.desc}</p>

            {ep.params.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3">Parameters</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[var(--text-muted)] border-b border-[var(--border)]">
                        <th className="pb-2 pr-4 font-semibold">Name</th>
                        <th className="pb-2 pr-4 font-semibold">Type</th>
                        <th className="pb-2 pr-4 font-semibold">Required</th>
                        <th className="pb-2 pr-4 font-semibold">Default</th>
                        <th className="pb-2 font-semibold">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ep.params.map((p) => (
                        <tr key={p.name} className="border-b border-[var(--border)]/50">
                          <td className="py-2.5 pr-4"><code className="text-[var(--accent-light)] text-xs">{p.name}</code></td>
                          <td className="py-2.5 pr-4 text-[var(--text-muted)] text-xs">{p.type}</td>
                          <td className="py-2.5 pr-4">
                            {p.required ? <span className="tag tag-rose">yes</span> : <span className="text-[var(--text-muted)] text-xs">no</span>}
                          </td>
                          <td className="py-2.5 pr-4 text-[var(--text-muted)] text-xs">{p.def}</td>
                          <td className="py-2.5 text-[var(--text-dim)] text-xs">{p.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex gap-1 mb-3">
              {(['curl', 'js'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCodeTab(tab)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                    codeTab === tab
                      ? 'bg-[var(--accent)]/15 text-[var(--accent-light)] border border-[var(--accent)]/25'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-dim)] border border-transparent'
                  }`}
                >
                  {tab === 'curl' ? 'cURL' : 'JavaScript'}
                </button>
              ))}
            </div>
            <CodeBlock code={codeTab === 'curl' ? ep.curl : ep.js} lang={codeTab === 'curl' ? 'bash' : 'javascript'} />
          </div>
        </div>
      </section>

      {/* ── Quick Start ── */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 mb-24">
        <div className="text-center mb-12">
          <p className="section-label">Quick Start</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">Common Recipes</h2>
          <p className="text-[var(--text-dim)] mt-3 max-w-lg mx-auto">
            Real-world code snippets to get you building immediately.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              title: 'Search for a Series',
              desc: 'Find any manga or manhwa by title with full-text search.',
              code: `const res = await fetch('${BASE}/api/v1/search?q=solo');
const { data } = await res.json();

data.forEach(series => {
  console.log(series.title);    // "Sex Stopwatch"
  console.log(series.rating);   // 4.96
  console.log(series.status);   // "Completed"
});`,
            },
            {
              title: 'Read Chapter Pages',
              desc: 'Get all page images for a chapter to build a reader.',
              code: `const res = await fetch(
  '${BASE}/api/v1/chapter/sex-stopwatch/chapter-1'
);
const { data } = await res.json();

// Render each page
data.images.forEach((url, i) => {
  const img = document.createElement('img');
  img.src = url;
  img.alt = \`Page \${i + 1}\`;
  document.getElementById('reader').appendChild(img);
});`,
            },
            {
              title: 'Get Series with Chapters',
              desc: 'Fetch complete series data including all chapters.',
              code: `const res = await fetch(
  '${BASE}/api/v1/series/sex-stopwatch?include=chapters'
);
const { data } = await res.json();

console.log(data.title);         // "Sex Stopwatch"
console.log(data.chaptersCount); // 155
console.log(data.chapters[0]);   // { id, name, slug, ... }`,
            },
            {
              title: 'Paginated Browsing',
              desc: 'Browse series with pagination for infinite scroll.',
              code: `async function loadPage(page = 1) {
  const res = await fetch(
    \`${BASE}/api/v1/series?page=\${page}&perPage=20\`
  );
  const { data, pagination } = await res.json();

  console.log(\`Page \${pagination.currentPage}/\${pagination.lastPage}\`);
  return { data, hasMore: pagination.hasNext };
}

// Load next page when scrolling
const { data, hasMore } = await loadPage(2);`,
            },
          ].map((recipe) => (
            <div key={recipe.title} className="glass-card rounded-2xl p-6 group">
              <h3 className="font-semibold text-base mb-1">{recipe.title}</h3>
              <p className="text-sm text-[var(--text-muted)] mb-4">{recipe.desc}</p>
              <CodeBlock code={recipe.code} lang="javascript" />
            </div>
          ))}
        </div>
      </section>

      {/* ── Response Format ── */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 mb-24">
        <div className="text-center mb-12">
          <p className="section-label">Response Format</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">Consistent Envelope</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              label: 'Success (list)',
              code: `{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "perPage": 20,
    "currentPage": 1,
    "lastPage": 5,
    "hasNext": true,
    "hasPrevious": false
  }
}`,
            },
            {
              label: 'Success (single)',
              code: `{
  "success": true,
  "data": {
    "id": 7,
    "title": "Sex Stopwatch",
    "rating": 4.96,
    "status": "Completed",
    ...
  }
}`,
            },
            {
              label: 'Error',
              code: `{
  "success": false,
  "error": "Series not found"
}`,
            },
          ].map((r) => (
            <div key={r.label} className="glass-card rounded-2xl p-5">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3">{r.label}</h4>
              <CodeBlock code={r.code} lang="json" />
            </div>
          ))}
        </div>
      </section>

      {/* ── Error Codes ── */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 mb-24">
        <div className="glass-card rounded-2xl p-6 md:p-8">
          <h3 className="text-xl font-bold mb-6">HTTP Status Codes</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { code: '200', desc: 'Success', color: 'var(--emerald)' },
              { code: '400', desc: 'Bad Request', color: 'var(--amber)' },
              { code: '404', desc: 'Not Found', color: 'var(--rose)' },
              { code: '429', desc: 'Rate Limited', color: 'var(--rose)' },
              { code: '500', desc: 'Server Error', color: 'var(--rose)' },
            ].map((c) => (
              <div key={c.code} className="text-center p-4 rounded-xl bg-white/[0.02] border border-[var(--border)]/50">
                <div className="text-2xl font-black font-mono" style={{ color: c.color }}>{c.code}</div>
                <div className="text-xs text-[var(--text-muted)] mt-1">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Playground ── */}
      <section id="playground" className="max-w-6xl mx-auto px-5 md:px-8 mb-24">
        <Playground />
      </section>

      {/* ── Rate Limiting ── */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 mb-24">
        <div className="glass-card rounded-2xl p-6 md:p-8">
          <h3 className="text-xl font-bold mb-6">Rate Limiting</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="space-y-3">
                {[
                  { label: 'Limit', value: '60 requests per minute' },
                  { label: 'Window', value: 'Rolling 60-second window' },
                  { label: 'Scope', value: 'Per IP address' },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between items-center py-2 border-b border-[var(--border)]/50">
                    <span className="text-sm text-[var(--text-muted)]">{r.label}</span>
                    <span className="text-sm font-medium">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3">Response Headers</h4>
              <div className="space-y-2">
                {[
                  { header: 'X-RateLimit-Limit', desc: 'Max requests allowed (60)' },
                  { header: 'X-RateLimit-Remaining', desc: 'Requests remaining in window' },
                  { header: 'X-RateLimit-Reset', desc: 'Window reset timestamp' },
                  { header: 'X-Request-ID', desc: 'Unique request ID for tracing' },
                ].map((h) => (
                  <div key={h.header} className="flex items-baseline gap-3">
                    <code className="text-xs text-[var(--accent-light)] shrink-0">{h.header}</code>
                    <span className="text-xs text-[var(--text-muted)]">{h.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 mb-24">
        <div className="glass-card rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-[var(--cyan)]/5" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">Ready to Build?</h2>
            <p className="text-[var(--text-dim)] max-w-md mx-auto mb-8">
              Start using OmegaAPI today. Free, fast, and requires no authentication.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="#endpoints" className="btn-primary text-sm">
                Explore API <IconChevronRight size={14} />
              </a>
              <a
                href="https://omegascans.org"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-sm inline-flex items-center gap-1.5"
              >
                Visit OmegaScans <IconExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--border)]/40 py-10">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--cyan)] flex items-center justify-center text-white font-black text-xs">
                Ω
              </div>
              <span className="text-sm text-[var(--text-muted)]">
                OmegaAPI v1.0 — Free Manga and Manhwa REST API
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="/docs" className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">Docs</a>
              <a href="/browse" className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">Browse</a>
              <a href="/support" className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">Support</a>
              <a href="/terms" className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">Terms</a>
              <a href="/privacy" className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">Privacy</a>
              <span className="text-[var(--text-muted)]">
                Data from{' '}
                <a href="https://omegascans.org" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-light)] hover:underline">
                  OmegaScans
                </a>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
