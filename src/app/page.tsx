'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Navbar, Footer } from '@/components/layout';
import {
  IconSearch, IconChevronRight, IconExternalLink, IconSignal, IconBolt, IconLockOpen,
  IconDiamond, IconBook, IconZap, IconGlobe, IconShield, IconBarChart, IconHeartPulse,
  IconPlay, IconDatabase, IconSettings, IconFileText, IconArrowRight, IconCode,
  IconSparkles, IconHeart, IconLayers, IconTerminal, IconCopy, IconCheck, IconGithub,
} from '@/components/icons';
import { CodeBlock, CopyBtn, formatViews } from '@/components/ui';

const BASE = typeof window !== 'undefined' ? window.location.origin : 'https://omegaapi.vercel.app';

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
console.log(data.chaptersCount); // 155`,
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

console.log(pagination.total); // 155`,
  },
  {
    method: 'GET', path: '/api/v1/chapter/{slug}/{chapter}', label: 'chapter/{slug}/{chapter}',
    desc: 'Get chapter content with all image URLs',
    params: [
      { name: 'slug', type: 'string', required: true, def: '—', desc: 'Series slug' },
      { name: 'chapter', type: 'string', required: true, def: '—', desc: 'Chapter slug' },
    ],
    curl: `curl "${BASE}/api/v1/chapter/sex-stopwatch/chapter-1"`,
    js: `const res = await fetch(
  '${BASE}/api/v1/chapter/sex-stopwatch/chapter-1'
);
const { data } = await res.json();

console.log(data.pageCount);   // 13
console.log(data.images[0]);   // "https://media..."`,
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
console.log(data.version);  // "1.0.0"`,
  },
];

/* ── Reveal (Intersection Observer) ── */
function Reveal({ children, className = '', direction = 'up', delay = 0 }: {
  children: React.ReactNode; className?: string; direction?: 'up' | 'left' | 'right' | 'scale'; delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const cls = direction === 'left' ? 'reveal-left' : direction === 'right' ? 'reveal-right' : direction === 'scale' ? 'reveal-scale' : 'reveal';
  return <div ref={ref} className={`${cls} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

/* ── Animated Counter ── */
function AnimCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
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
          const duration = 1400;
          const step = target / (duration / 16);
          let current = 0;
          const timer = setInterval(() => {
            current += step;
            if (current >= target) { setCount(target); clearInterval(timer); }
            else { setCount(Math.floor(current)); }
          }, 16);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return <span ref={ref} className="counter-value">{count.toLocaleString()}{suffix}</span>;
}

/* ── Live Response Preview ── */
function LivePreview() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE}/api/v1/series/sex-stopwatch`)
      .then(r => r.json())
      .then(d => { if (d.success) setData(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="code-brutal">
      <div className="code-header"><div className="dots"><span /><span /><span /></div><span>response.json</span></div>
      <pre className="text-[0.72rem]"><code><span className="text-[#64748b]">Loading live data...</span></code></pre>
    </div>
  );

  if (!data) return null;

  return (
    <div className="code-brutal">
      <div className="code-header">
        <div className="dots"><span /><span /><span /></div>
        <span>response.json</span>
        <span className="tag tag-green text-[0.5rem]">LIVE</span>
      </div>
      <pre className="text-[0.68rem] leading-relaxed"><code>{`{
  `}<span className="text-[#64748b]">"title"</span>{`: `}<span className="text-[#86efac]">"{data.title}"</span>{`,
  `}<span className="text-[#64748b]">"rating"</span>{`: `}<span className="text-[#fbbf24]">{data.rating}</span>{`,
  `}<span className="text-[#64748b]">"status"</span>{`: `}<span className="text-[#86efac]">"{data.status}"</span>{`,
  `}<span className="text-[#64748b]">"totalViews"</span>{`: `}<span className="text-[#fbbf24]">{data.totalViews?.toLocaleString()}</span>{`,
  `}<span className="text-[#64748b]">"chaptersCount"</span>{`: `}<span className="text-[#fbbf24]">{data.chaptersCount}</span>{`,
  `}<span className="text-[#64748b]">"tags"</span>{`: [`}<span className="text-[#86efac]">{data.tags?.slice(0, 3).map((t: string) => `"${t}"`).join(', ')}</span>{`]
}`}</code></pre>
    </div>
  );
}

/* ── Search Modal ── */
function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('');
  const [focusIdx, setFocusIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = endpoints.filter(
    (ep) => ep.path.toLowerCase().includes(q.toLowerCase()) || ep.desc.toLowerCase().includes(q.toLowerCase()) || ep.label.toLowerCase().includes(q.toLowerCase())
  );

  useEffect(() => {
    if (open) { setQ(''); setFocusIdx(0); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); if (open) onClose(); }
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
                document.getElementById(`ep-${filtered[focusIdx].label}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                onClose();
              }
            }}
          />
          <kbd className="text-[0.6rem] font-mono bg-[var(--bg-muted)] border border-[var(--border)] px-1.5 py-0.5 text-[var(--text-muted)]">ESC</kbd>
        </div>
        {filtered.length > 0 ? (
          <div className="max-h-72 overflow-y-auto">
            {filtered.map((ep, i) => (
              <div key={ep.label} className={`search-result ${i === focusIdx ? 'focused' : ''}`} onClick={() => { document.getElementById(`ep-${ep.label}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }); onClose(); }}>
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

/* ── Playground ── */
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
    <div className="card-brutal">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 flex items-center justify-center bg-[#f59e0b] text-[#0f172a] border-2 border-[#0f172a] shadow-brutal-sm">
          <IconPlay size={18} />
        </div>
        <div>
          <h3 className="font-display text-lg tracking-tight" style={{ textTransform: 'none' }}>LIVE PLAYGROUND</h3>
          <p className="text-xs text-[var(--text-muted)]">Test any endpoint in real-time</p>
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && run()}
          placeholder="Enter API URL..."
          className="flex-1 bg-[var(--bg-dim)] border-2 border-[#0f172a] px-4 py-3 text-sm font-mono text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#f59e0b] transition-colors"
        />
        <button onClick={run} disabled={loading} className="btn-brutal btn-sm disabled:opacity-50">
          {loading ? '...' : 'SEND'}
        </button>
      </div>
      <div className="flex gap-3 mb-4 h-6 items-center">
        {status !== null && <span className={`tag ${status >= 200 && status < 300 ? 'tag-green' : status >= 400 ? 'tag-rose' : 'tag-amber'}`}>{status}</span>}
        {time !== null && <span className="tag tag-cyan">{time}ms</span>}
      </div>
      {resp && (
        <div className="code-brutal">
          <div className="code-header"><div className="dots"><span /><span /><span /></div><span>response</span></div>
          <pre className="!text-[0.75rem] max-h-80 overflow-auto"><code>{resp}</code></pre>
        </div>
      )}
    </div>
  );
}

/* ── Health Badge ── */
function HealthBadge() {
  const [health, setHealth] = useState<{ status: string; upstream: { status: string; latencyMs: number } } | null>(null);
  useEffect(() => { fetch(`${BASE}/api/v1/health`).then(r => r.json()).then(d => setHealth(d.data || d)).catch(() => {}); }, []);

  if (!health) return <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]"><span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-pulse" />checking...</div>;

  const ok = health.upstream?.status === 'ok';
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <span className={`w-2 h-2 rounded-full ${ok ? 'bg-[#10b981]' : 'bg-[#f59e0b]'}`} />
      <span className="text-[var(--text-muted)] font-semibold uppercase tracking-wider" style={{ fontSize: '0.6rem', letterSpacing: '0.1em' }}>{ok ? 'OPERATIONAL' : 'DEGRADED'} · {health.upstream?.latencyMs}ms</span>
    </div>
  );
}

/* ── Main Page ── */
export default function HomePage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeEp, setActiveEp] = useState(0);
  const [codeTab, setCodeTab] = useState<'curl' | 'js'>('curl');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen((v) => !v); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const ep = endpoints[activeEp];

  return (
    <main className="relative overflow-x-hidden" style={{ background: 'var(--bg)' }}>
      <Navbar active="home">
        <HealthBadge />
        <button onClick={() => setSearchOpen(true)} className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] border-2 border-[#0f172a] px-3 py-1.5 hover:bg-[#0f172a] hover:text-white transition-all" style={{ fontSize: '0.65rem', letterSpacing: '0.08em' }}>
          <IconSearch size={14} />
          <span className="hidden lg:inline">Search</span>
          <kbd className="text-[0.55rem] font-mono bg-[var(--bg-dim)] border border-[var(--border)] px-1 py-0.5 ml-1 hidden lg:inline">⌘K</kbd>
        </button>
      </Navbar>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ── Hero ── */}
      <section className="hero-mesh relative overflow-hidden">
        <div className="max-w-container mx-auto px-5 md:px-8 pt-20 md:pt-28 pb-16 md:pb-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div>
              <Reveal>
                <div className="inline-flex items-center gap-2 bg-white border-2 border-[#0f172a] px-4 py-1.5 mb-8 shadow-brutal-sm">
                  <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#64748b]" style={{ fontSize: '0.6rem', letterSpacing: '0.1em' }}>FREE · NO AUTH · 263 SERIES</span>
                </div>
              </Reveal>

              <Reveal delay={100}>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[0.95] mb-6" style={{ textTransform: 'none' }}>
                  <span className="gradient-text">Manga data.</span><br />
                  <span className="gradient-text">Zero friction.</span>
                </h1>
              </Reveal>

              <Reveal delay={200}>
                <p className="text-base md:text-lg text-[#475569] max-w-md mb-8 leading-relaxed">
                  Browse series. Get chapter images. Search titles.<br />
                  No API key. No signup. Just build.
                </p>
              </Reveal>

              <Reveal delay={300}>
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <a href="#endpoints" className="btn-brutal">EXPLORE API <IconArrowRight size={16} /></a>
                  <a href="#playground" className="btn-brutal-outline">TRY IT LIVE</a>
                </div>
              </Reveal>

              <Reveal delay={400}>
                <div className="flex flex-wrap gap-2">
                  {['FREE', 'NO AUTH', 'CORS', 'EDGE CACHED', 'CACHED'].map((t) => (
                    <span key={t} className="pill-tag text-[#8b5cf6] border-[#8b5cf6]">{t}</span>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Right: Live Response */}
            <Reveal direction="right" delay={200}>
              <div className="space-y-4">
                <div className="code-brutal">
                  <div className="code-header">
                    <div className="dots"><span /><span /><span /></div>
                    <span>terminal</span>
                  </div>
                  <pre className="text-[0.72rem]"><code><span className="text-[#64748b]">$</span> curl <span className="text-[#86efac]">"{BASE}/api/v1/series/sex-stopwatch"</span></code></pre>
                </div>
                <LivePreview />
              </div>
            </Reveal>
          </div>

          {/* Scroll Indicator */}
          <div className="scroll-indicator">
            <span>Scroll</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="py-6" style={{ background: '#0f172a', borderTop: '3px solid #334155', borderBottom: '3px solid #334155' }}>
        <div className="max-w-container mx-auto px-5 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: 8, suffix: '', label: 'ENDPOINTS', icon: <IconSignal size={18} /> },
              { value: 60, suffix: '', label: 'REQ/MIN', icon: <IconBolt size={18} /> },
              { value: 0, suffix: '', label: 'AUTH NEEDED', icon: <IconLockOpen size={18} /> },
              { value: 100, suffix: '%', label: 'FREE', icon: <IconDiamond size={18} /> },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3 justify-center">
                <div className="text-[#f59e0b]">{s.icon}</div>
                <div>
                  <div className="font-display text-xl text-white" style={{ textTransform: 'none' }}>
                    <AnimCounter target={s.value} suffix={s.suffix} />
                  </div>
                  <div className="text-[0.55rem] text-[#64748b] font-display tracking-widest">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features (condensed) ── */}
      <section id="features" style={{ background: 'var(--bg-dim)' }} className="py-20">
        <div className="max-w-container mx-auto px-5 md:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <span className="pill-tag text-[#8b5cf6] border-[#8b5cf6]">WHY OMEGAAPI</span>
              <h2 className="font-display text-3xl md:text-4xl mt-4" style={{ textTransform: 'none' }}>Everything you need. Nothing you don&apos;t.</h2>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <IconLockOpen size={20} />, title: 'Zero Auth', desc: 'No API keys, no sign-ups, no OAuth. Just make a request and get JSON.', color: '#10b981' },
              { icon: <IconZap size={20} />, title: 'Sub-Second', desc: 'In-memory caching with 5–15 min TTL. Responses in milliseconds.', color: '#f59e0b' },
              { icon: <IconGlobe size={20} />, title: 'CORS Ready', desc: 'Call directly from any frontend. Browser, mobile, desktop — all origins.', color: '#06b6d4' },
              { icon: <IconBook size={20} />, title: 'Full Reader', desc: 'Chapter images, series metadata, ratings, tags, authors — complete data.', color: '#8b5cf6' },
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 80}>
                <div className="card-brutal group">
                  <div className="w-10 h-10 flex items-center justify-center border-2 mb-4 shadow-brutal-sm" style={{ background: `${f.color}15`, color: f.color, borderColor: f.color }}>{f.icon}</div>
                  <h3 className="font-display text-sm mb-2" style={{ textTransform: 'none' }}>{f.title}</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── API Reference ── */}
      <section id="endpoints" className="max-w-container mx-auto px-5 md:px-8 py-20">
        <Reveal>
          <div className="text-center mb-12">
            <span className="pill-tag text-[#06b6d4] border-[#06b6d4]">API REFERENCE</span>
            <h2 className="font-display text-3xl md:text-4xl mt-4" style={{ textTransform: 'none' }}>8 Endpoints. Zero Surprises.</h2>
            <p className="text-[#475569] mt-3 max-w-lg mx-auto">Every response follows the same envelope format. Pick an endpoint to explore.</p>
          </div>
        </Reveal>

        <Reveal>
          <div className="grid md:grid-cols-5 gap-4">
            {/* Endpoint List (left) */}
            <div className="md:col-span-2 space-y-1">
              {endpoints.map((e, i) => (
                <div key={e.label} id={`ep-${e.label}`} className={`endpoint-row ${i === activeEp ? 'active' : ''}`} onClick={() => { setActiveEp(i); setCodeTab('curl'); }}>
                  <span className="badge-get shrink-0">{e.method}</span>
                  <span className="font-mono text-xs text-[var(--text)] truncate flex-1">{e.path}</span>
                  <IconChevronRight size={14} />
                </div>
              ))}
            </div>

            {/* Endpoint Detail (right) */}
            <div className="md:col-span-3 card-brutal">
              <div className="flex items-center gap-3 mb-2">
                <span className="badge-get">{ep.method}</span>
                <code className="font-mono text-sm text-[#f59e0b]">{ep.path}</code>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-5">{ep.desc}</p>

              {ep.params.length > 0 && (
                <div className="mb-5">
                  <h4 className="text-xs font-display tracking-widest text-[var(--text-muted)] mb-3">PARAMETERS</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-[var(--text-muted)] border-b-2 border-[#0f172a]">
                          <th className="pb-2 pr-4 font-display text-xs">NAME</th>
                          <th className="pb-2 pr-4 font-display text-xs">TYPE</th>
                          <th className="pb-2 pr-4 font-display text-xs">REQ</th>
                          <th className="pb-2 font-display text-xs">DESC</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ep.params.map((p) => (
                          <tr key={p.name} className="border-b border-[var(--border-subtle)]">
                            <td className="py-2 pr-4"><code className="text-[#f59e0b] text-xs">{p.name}</code></td>
                            <td className="py-2 pr-4 text-[var(--text-muted)] text-xs">{p.type}</td>
                            <td className="py-2 pr-4">{p.required ? <span className="tag tag-rose text-[0.55rem]">YES</span> : <span className="text-[var(--text-muted)] text-xs">no</span>}</td>
                            <td className="py-2 text-[var(--text-secondary)] text-xs">{p.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="flex gap-1 mb-3">
                {(['curl', 'js'] as const).map((tab) => (
                  <button key={tab} onClick={() => setCodeTab(tab)} className={`text-xs font-display px-3 py-1.5 transition-all border-2 ${codeTab === tab ? 'bg-[#f59e0b] text-[#0f172a] border-[#0f172a]' : 'text-[var(--text-muted)] hover:text-[var(--text)] border-transparent'}`}>
                    {tab === 'curl' ? 'CURL' : 'JAVASCRIPT'}
                  </button>
                ))}
              </div>
              <CodeBlock code={codeTab === 'curl' ? ep.curl : ep.js} lang={codeTab === 'curl' ? 'bash' : 'javascript'} />
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Response Format ── */}
      <section style={{ background: 'var(--bg-dim)' }} className="py-16">
        <div className="max-w-container mx-auto px-5 md:px-8">
          <Reveal>
            <div className="text-center mb-10">
              <span className="pill-tag text-[#8b5cf6] border-[#8b5cf6]">RESPONSE FORMAT</span>
              <h2 className="font-display text-2xl md:text-3xl mt-4" style={{ textTransform: 'none' }}>Consistent. Always.</h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: 'SUCCESS (LIST)', code: `{\n  "success": true,\n  "data": [...],\n  "pagination": {\n    "total": 263,\n    "perPage": 20,\n    "currentPage": 1,\n    "hasNext": true\n  }\n}` },
              { label: 'SUCCESS (SINGLE)', code: `{\n  "success": true,\n  "data": {\n    "title": "Sex Stopwatch",\n    "rating": 4.96,\n    "status": "Completed"\n  }\n}` },
              { label: 'ERROR', code: `{\n  "success": false,\n  "error": "Series not found"\n}` },
            ].map((r, i) => (
              <Reveal key={r.label} delay={i * 100}>
                <div className="card-brutal">
                  <h4 className="text-[0.6rem] font-display tracking-widest text-[var(--text-muted)] mb-3">{r.label}</h4>
                  <CodeBlock code={r.code} lang="json" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Playground ── */}
      <section id="playground" className="max-w-container mx-auto px-5 md:px-8 py-20">
        <Reveal>
          <div className="text-center mb-10">
            <span className="pill-tag text-[#f59e0b] border-[#f59e0b]">TRY IT</span>
            <h2 className="font-display text-2xl md:text-3xl mt-4" style={{ textTransform: 'none' }}>Hit the API. Right here.</h2>
          </div>
        </Reveal>
        <Reveal>
          <Playground />
        </Reveal>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: '#0f172a', borderTop: '3px solid #334155' }} className="py-20">
        <div className="max-w-container mx-auto px-5 md:px-8 text-center">
          <Reveal>
            <h2 className="font-display text-3xl md:text-4xl text-white mb-4" style={{ textTransform: 'none' }}>Ready to Build?</h2>
            <p className="text-[#94a3b8] max-w-md mx-auto mb-8">Free, fast, and requires no authentication. Start using OmegaAPI today.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#endpoints" className="btn-brutal" style={{ background: '#f59e0b', borderColor: '#e4e4e7', boxShadow: '4px 4px 0 0 #e4e4e7' }}>EXPLORE API <IconArrowRight size={16} /></a>
              <a href="https://github.com/Shineii86/OmegaAPI" target="_blank" rel="noopener noreferrer" className="btn-brutal-outline" style={{ borderColor: '#e4e4e7', color: '#e4e4e7', boxShadow: '4px 4px 0 0 #e4e4e7' }}>
                <IconGithub size={16} /> GITHUB
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
