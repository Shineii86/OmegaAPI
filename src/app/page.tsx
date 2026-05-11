'use client';

import { useState, useEffect, useRef } from 'react';
import { Navbar, Footer } from '@/components/layout';
import { IconSearch, IconChevronRight, IconExternalLink, IconSignal, IconBolt, IconLockOpen, IconDiamond, IconBook, IconZap, IconGlobe, IconShield, IconBarChart, IconHeartPulse, IconPlay, IconDatabase, IconSettings, IconFileText } from '@/components/icons';
import { CodeBlock, CopyBtn, formatViews } from '@/components/ui';

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

/* ── Animated Counter ── */
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
          <kbd className="text-[0.6rem] font-mono bg-[var(--bg-muted)] border border-[var(--border)] rounded px-1.5 py-0.5 text-[var(--text-muted)]">ESC</kbd>
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
    <div className="glass-card rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-[var(--accent-subtle)] flex items-center justify-center text-[var(--accent)]">
          <IconPlay size={18} />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-[var(--text)]">Live Playground</h3>
          <p className="text-xs text-[var(--text-muted)]">Test any endpoint in real-time</p>
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && run()}
          placeholder="Enter API URL..."
          className="flex-1 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm font-mono text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]/50 transition-colors"
        />
        <button onClick={run} disabled={loading} className="btn-primary btn-sm px-5 disabled:opacity-50">
          {loading ? '...' : 'Send'}
        </button>
      </div>
      <div className="flex gap-3 mb-4 h-6 items-center">
        {status !== null && <span className={`tag ${status >= 200 && status < 300 ? 'tag-green' : status >= 400 ? 'tag-rose' : 'tag-amber'}`}>{status}</span>}
        {time !== null && <span className="tag tag-cyan">{time}ms</span>}
      </div>
      {resp && (
        <div className="code-block">
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
  useEffect(() => { fetch(`${BASE}/api/v1/health`).then(r => r.json()).then(setHealth).catch(() => {}); }, []);

  if (!health) return <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]"><span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-pulse" />checking...</div>;

  const ok = health.upstream?.status === 'ok';
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <span className={`w-2 h-2 rounded-full ${ok ? 'bg-[var(--emerald)]' : 'bg-[var(--amber)]'}`} />
      <span className="text-[var(--text-muted)]">{ok ? 'Operational' : 'Degraded'} · {health.upstream?.latencyMs}ms</span>
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
    <main className="bg-white relative">
      <Navbar active="home">
        <HealthBadge />
        <button onClick={() => setSearchOpen(true)} className="flex items-center gap-2 text-sm text-[var(--text-muted)] bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg px-3 py-1.5 hover:border-[var(--accent)]/30 transition-colors">
          <IconSearch size={14} />
          <span className="hidden lg:inline">Search</span>
          <kbd className="text-[0.6rem] font-mono bg-white border border-[var(--border)] rounded px-1 py-0.5 ml-1 hidden lg:inline">⌘K</kbd>
        </button>
      </Navbar>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ── Hero ── */}
      <section className="hero-mesh relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-5 md:px-8 pt-20 md:pt-28 pb-20 text-center relative">
          <div className="animate-fade-up opacity-0">
            <div className="inline-flex items-center gap-2 bg-white border border-[var(--border)] rounded-full px-4 py-1.5 mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[var(--emerald)]" />
              <span className="text-xs text-[var(--text-secondary)] font-medium">Live and Free — Powered by OmegaScans</span>
            </div>

            <h1 className="hero-title text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.95] mb-6">
              <span className="gradient-text">The API for</span><br />
              <span className="gradient-text">Manga and Manhwa</span><br />
              <span className="gradient-text">Data</span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-xl mx-auto mb-10 leading-relaxed">
              Browse series. Get chapter images. Search titles.<br className="hidden md:block" />
              No API key. No signup. Just build.
            </p>

            <div className="flex flex-wrap justify-center gap-2.5 mb-10">
              {['Free API', 'No Auth', 'Manga Data', 'Chapter Images', 'CORS Ready', 'Edge Cached'].map((t) => (
                <span key={t} className="tag tag-purple">{t}</span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
              <a href="#endpoints" className="btn-primary">Explore Endpoints <IconChevronRight size={14} /></a>
              <a href="#playground" className="btn-ghost">Try it Live</a>
            </div>

            <div className="max-w-2xl mx-auto">
              <CodeBlock code={`curl "${BASE}/api/v1/series/sex-stopwatch"`} lang="bash" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee ── */}
      <section className="py-5 border-y border-[var(--border-subtle)] overflow-hidden bg-[var(--bg-subtle)]">
        <div className="marquee-track">
          {[...keywords, ...keywords].map((kw, i) => (
            <span key={i} className="flex items-center gap-3 px-5 text-sm font-medium text-[var(--text-muted)] whitespace-nowrap select-none">
              {kw}
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]/30" />
            </span>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 py-20">
        <div className="stat-grid grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: 8, suffix: '', label: 'Endpoints', icon: <IconSignal size={22} /> },
            { value: 60, suffix: '', label: 'Req/Min', icon: <IconBolt size={22} /> },
            { value: 0, suffix: '', label: 'Auth Needed', icon: <IconLockOpen size={22} /> },
            { value: 100, suffix: '%', label: 'Free Forever', icon: <IconDiamond size={22} /> },
          ].map((s, i) => (
            <div key={s.label} className={`glass-card rounded-2xl p-6 text-center animate-fade-up opacity-0 stagger-${i + 1}`}>
              <div className="flex justify-center mb-3 text-[var(--accent)]">{s.icon}</div>
              <div className="text-3xl md:text-4xl font-black mb-1 text-[var(--text)]">
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </div>
              <div className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Architecture ── */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 pb-20">
        <div className="text-center mb-12">
          <p className="section-label">Architecture</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--text)]">How It Works</h2>
          <p className="text-[var(--text-secondary)] mt-3 max-w-lg mx-auto">OmegaAPI sits between raw OmegaScans data and your app — normalizing, caching, and protecting.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { step: '01', title: 'Source', subtitle: 'OmegaScans', desc: 'Raw manga and manhwa data from the upstream provider', color: 'var(--cyan)', icon: <IconDatabase size={22} /> },
            { step: '02', title: 'Middleware', subtitle: 'OmegaAPI', desc: 'Caching, Rate Limiting, Normalization, Error Handling', color: 'var(--accent)', icon: <IconSettings size={22} /> },
            { step: '03', title: 'Output', subtitle: 'Clean JSON', desc: 'Consistent, well-structured responses ready for your app', color: 'var(--emerald)', icon: <IconFileText size={22} /> },
          ].map((a, i) => (
            <div key={a.step} className="glass-card rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 text-[5rem] font-black opacity-[0.04] leading-none select-none" style={{ color: a.color }}>{a.step}</div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${a.color}12`, color: a.color }}>{a.icon}</div>
                <div>
                  <div className="text-[0.6rem] font-bold uppercase tracking-widest" style={{ color: a.color }}>Step {a.step}</div>
                  <div className="font-semibold text-lg text-[var(--text)]">{a.title}</div>
                </div>
              </div>
              <div className="text-sm font-semibold text-[var(--text-secondary)] mb-2">{a.subtitle}</div>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{a.desc}</p>
              {i < 2 && <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] z-10"><IconChevronRight size={20} /></div>}
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="bg-[var(--bg-subtle)] py-20">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="text-center mb-12">
            <p className="section-label">Capabilities</p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--text)]">Everything You Need</h2>
            <p className="text-[var(--text-secondary)] mt-3 max-w-lg mx-auto">A complete API for building manga readers, trackers, and discovery tools.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: <IconSearch size={20} />, title: 'Full-Text Search', desc: 'Search across hundreds of series by title with instant results and pagination.' },
              { icon: <IconBook size={20} />, title: 'Chapter Images', desc: 'Get every page image URL for any chapter. Perfect for building reader apps.' },
              { icon: <IconZap size={20} />, title: 'Sub-Second Cache', desc: 'In-memory caching with 5-15 min TTL. Repeated requests served in milliseconds.' },
              { icon: <IconLockOpen size={20} />, title: 'Zero Authentication', desc: 'No API keys, no sign-ups, no OAuth. Make a request, get JSON.' },
              { icon: <IconGlobe size={20} />, title: 'CORS Ready', desc: 'Call directly from any frontend — browser, mobile, desktop, extension.' },
              { icon: <IconShield size={20} />, title: 'Rate Limiting', desc: '60 req/min per IP with informative headers. Fair usage enforced.' },
              { icon: <IconBarChart size={20} />, title: 'Rich Metadata', desc: 'Rating, status, views, author, studio, release schedule, alternative names.' },
              { icon: <IconHeartPulse size={20} />, title: 'Health Monitoring', desc: '/health endpoint with upstream probe, latency, and uptime tracking.' },
              { icon: <IconPlay size={20} />, title: 'Live Playground', desc: 'Test any endpoint directly from the docs. No setup needed.' },
            ].map((f) => (
              <div key={f.title} className="glass-card rounded-2xl p-6 group">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">{f.icon}</div>
                <h3 className="font-semibold text-base mb-2 text-[var(--text)]">{f.title}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── API Reference ── */}
      <section id="endpoints" className="max-w-6xl mx-auto px-5 md:px-8 py-20">
        <div className="text-center mb-12">
          <p className="section-label">API Reference</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--text)]">Clean, Predictable Endpoints</h2>
          <p className="text-[var(--text-secondary)] mt-3 max-w-lg mx-auto">Every response follows the same envelope format. No surprises.</p>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-4">
          <div className="glass-card rounded-2xl p-3 overflow-y-auto max-h-[600px]">
            {endpoints.map((e, i) => (
              <div key={e.label} id={`ep-${e.label}`} className={`endpoint-row ${i === activeEp ? 'active' : ''}`} onClick={() => { setActiveEp(i); setCodeTab('curl'); }}>
                <span className="badge-get shrink-0">{e.method}</span>
                <span className="font-mono text-xs text-[var(--text)] truncate">{e.path}</span>
              </div>
            ))}
          </div>

          <div className="glass-card rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="badge-get">{ep.method}</span>
              <code className="font-mono text-sm text-[var(--accent)]">{ep.path}</code>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mb-6">{ep.desc}</p>

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
                        <tr key={p.name} className="border-b border-[var(--border-subtle)]">
                          <td className="py-2.5 pr-4"><code className="text-[var(--accent)] text-xs">{p.name}</code></td>
                          <td className="py-2.5 pr-4 text-[var(--text-muted)] text-xs">{p.type}</td>
                          <td className="py-2.5 pr-4">{p.required ? <span className="tag tag-rose text-[0.55rem]">yes</span> : <span className="text-[var(--text-muted)] text-xs">no</span>}</td>
                          <td className="py-2.5 pr-4 text-[var(--text-muted)] text-xs">{p.def}</td>
                          <td className="py-2.5 text-[var(--text-secondary)] text-xs">{p.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex gap-1 mb-3">
              {(['curl', 'js'] as const).map((tab) => (
                <button key={tab} onClick={() => setCodeTab(tab)} className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${codeTab === tab ? 'bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent)]/20' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] border border-transparent'}`}>
                  {tab === 'curl' ? 'cURL' : 'JavaScript'}
                </button>
              ))}
            </div>
            <CodeBlock code={codeTab === 'curl' ? ep.curl : ep.js} lang={codeTab === 'curl' ? 'bash' : 'javascript'} />
          </div>
        </div>
      </section>

      {/* ── Quick Start ── */}
      <section className="bg-[var(--bg-subtle)] py-20">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="text-center mb-12">
            <p className="section-label">Quick Start</p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--text)]">Common Recipes</h2>
            <p className="text-[var(--text-secondary)] mt-3 max-w-lg mx-auto">Real-world code snippets to get you building immediately.</p>
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

const { data, hasMore } = await loadPage(2);`,
              },
            ].map((recipe) => (
              <div key={recipe.title} className="glass-card rounded-2xl p-6">
                <h3 className="font-semibold text-base mb-1 text-[var(--text)]">{recipe.title}</h3>
                <p className="text-sm text-[var(--text-muted)] mb-4">{recipe.desc}</p>
                <CodeBlock code={recipe.code} lang="javascript" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Response Format ── */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 py-20">
        <div className="text-center mb-12">
          <p className="section-label">Response Format</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--text)]">Consistent Envelope</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { label: 'Success (list)', code: `{\n  "success": true,\n  "data": [...],\n  "pagination": {\n    "total": 100,\n    "perPage": 20,\n    "currentPage": 1,\n    "lastPage": 5,\n    "hasNext": true,\n    "hasPrevious": false\n  }\n}` },
            { label: 'Success (single)', code: `{\n  "success": true,\n  "data": {\n    "id": 7,\n    "title": "Sex Stopwatch",\n    "rating": 4.96,\n    "status": "Completed",\n    ...\n  }\n}` },
            { label: 'Error', code: `{\n  "success": false,\n  "error": "Series not found"\n}` },
          ].map((r) => (
            <div key={r.label} className="glass-card rounded-2xl p-5">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3">{r.label}</h4>
              <CodeBlock code={r.code} lang="json" />
            </div>
          ))}
        </div>
      </section>

      {/* ── Error Codes ── */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 pb-20">
        <div className="glass-card rounded-2xl p-6 md:p-8">
          <h3 className="text-xl font-bold mb-6 text-[var(--text)]">HTTP Status Codes</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { code: '200', desc: 'Success', color: 'var(--emerald)' },
              { code: '400', desc: 'Bad Request', color: 'var(--amber)' },
              { code: '404', desc: 'Not Found', color: 'var(--rose)' },
              { code: '429', desc: 'Rate Limited', color: 'var(--rose)' },
              { code: '500', desc: 'Server Error', color: 'var(--rose)' },
            ].map((c) => (
              <div key={c.code} className="text-center p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)]">
                <div className="text-2xl font-black font-mono" style={{ color: c.color }}>{c.code}</div>
                <div className="text-xs text-[var(--text-muted)] mt-1">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Playground ── */}
      <section id="playground" className="bg-[var(--bg-subtle)] py-20">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <Playground />
        </div>
      </section>

      {/* ── Rate Limiting ── */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 py-20">
        <div className="glass-card rounded-2xl p-6 md:p-8">
          <h3 className="text-xl font-bold mb-6 text-[var(--text)]">Rate Limiting</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="space-y-3">
                {[
                  { label: 'Limit', value: '60 requests per minute' },
                  { label: 'Window', value: 'Rolling 60-second window' },
                  { label: 'Scope', value: 'Per IP address' },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between items-center py-2 border-b border-[var(--border-subtle)]">
                    <span className="text-sm text-[var(--text-muted)]">{r.label}</span>
                    <span className="text-sm font-medium text-[var(--text)]">{r.value}</span>
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
                    <code className="text-xs text-[var(--accent)] shrink-0">{h.header}</code>
                    <span className="text-xs text-[var(--text-muted)]">{h.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 pb-20">
        <div className="glass-card rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-[var(--cyan)]/5" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4 text-[var(--text)]">Ready to Build?</h2>
            <p className="text-[var(--text-secondary)] max-w-md mx-auto mb-8">Start using OmegaAPI today. Free, fast, and requires no authentication.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="#endpoints" className="btn-primary">Explore API <IconChevronRight size={14} /></a>
              <a href="https://omegascans.org" target="_blank" rel="noopener noreferrer" className="btn-ghost inline-flex items-center gap-1.5">Visit OmegaScans <IconExternalLink size={14} /></a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
