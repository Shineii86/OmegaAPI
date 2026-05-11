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
  useEffect(() => { fetch(`${BASE}/api/v1/health`).then(r => r.json()).then(setHealth).catch(() => {}); }, []);

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
    <main className="relative" style={{ background: 'var(--bg)' }}>
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
        <div className="max-w-container mx-auto px-5 md:px-8 pt-20 md:pt-28 pb-20 text-center relative">
          <Reveal>
            <div className="inline-flex items-center gap-2 bg-white border-2 border-[#0f172a] px-4 py-1.5 mb-8 shadow-brutal-sm">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#64748b]" style={{ fontSize: '0.6rem', letterSpacing: '0.1em' }}>LIVE AND FREE — POWERED BY OMEGASCANS</span>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="hero-title font-display text-5xl md:text-6xl lg:text-7xl leading-[0.9] mb-6" style={{ textTransform: 'none' }}>
              <span className="gradient-text">The API for</span><br />
              <span className="gradient-text">Manga & Manhwa</span><br />
              <span className="gradient-text">Data</span>
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="text-lg md:text-xl text-[#334155] max-w-xl mx-auto mb-10 leading-relaxed">
              Browse series. Get chapter images. Search titles.<br className="hidden md:block" />
              No API key. No signup. Just build.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div className="flex flex-wrap justify-center gap-2.5 mb-10">
              {['FREE API', 'NO AUTH', 'MANGA DATA', 'CHAPTER IMAGES', 'CORS READY', 'EDGE CACHED'].map((t) => (
                <span key={t} className="pill-tag" style={{ color: '#8b5cf6', borderColor: '#8b5cf6' }}>{t}</span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={400}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a href="#endpoints" className="btn-brutal">EXPLORE ENDPOINTS <IconArrowRight size={16} /></a>
              <a href="#playground" className="btn-brutal-outline">TRY IT LIVE</a>
            </div>
          </Reveal>

          <Reveal delay={500}>
            <div className="max-w-2xl mx-auto">
              <CodeBlock code={`curl "${BASE}/api/v1/series/sex-stopwatch"`} lang="bash" />
            </div>
          </Reveal>

          {/* Scroll Indicator */}
          <div className="scroll-indicator">
            <span>Scroll</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
          </div>
        </div>
      </section>

      {/* ── Marquee ── */}
      <section className="py-4 overflow-hidden marquee-wrapper">
        <div className="marquee-track">
          {[...keywords, ...keywords].map((kw, i) => (
            <span key={i} className="flex items-center gap-3 px-5 text-xs font-bold uppercase tracking-widest text-[#94a3b8] whitespace-nowrap select-none" style={{ fontSize: '0.65rem', letterSpacing: '0.15em' }}>
              {kw}
              <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
            </span>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="max-w-container mx-auto px-5 md:px-8 py-20">
        <div className="stat-grid grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: 8, suffix: '', label: 'ENDPOINTS', icon: <IconSignal size={22} /> },
            { value: 60, suffix: '', label: 'REQ/MIN', icon: <IconBolt size={22} /> },
            { value: 0, suffix: '', label: 'AUTH NEEDED', icon: <IconLockOpen size={22} /> },
            { value: 100, suffix: '%', label: 'FREE FOREVER', icon: <IconDiamond size={22} /> },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 100}>
              <div className="card-brutal text-center">
                <div className="flex justify-center mb-3 text-[#f59e0b]">{s.icon}</div>
                <div className="text-3xl md:text-4xl font-display mb-1" style={{ textTransform: 'none' }}>
                  <AnimCounter target={s.value} suffix={s.suffix} />
                </div>
                <div className="text-[0.6rem] text-[var(--text-muted)] font-display tracking-widest">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Architecture ── */}
      <section className="max-w-container mx-auto px-5 md:px-8 pb-20">
        <Reveal>
          <div className="text-center mb-12">
            <span className="pill-tag" style={{ color: '#06b6d4', borderColor: '#06b6d4' }}>ARCHITECTURE</span>
            <h2 className="font-display text-3xl md:text-4xl mt-4" style={{ textTransform: 'none' }}>How It Works</h2>
            <p className="text-[#334155] mt-3 max-w-lg mx-auto">OmegaAPI sits between raw OmegaScans data and your app — normalizing, caching, and protecting.</p>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { step: '01', title: 'SOURCE', subtitle: 'OmegaScans', desc: 'Raw manga and manhwa data from the upstream provider', color: '#06b6d4', icon: <IconDatabase size={22} /> },
            { step: '02', title: 'MIDDLEWARE', subtitle: 'OmegaAPI', desc: 'Caching, Rate Limiting, Normalization, Error Handling', color: '#f59e0b', icon: <IconSettings size={22} /> },
            { step: '03', title: 'OUTPUT', subtitle: 'Clean JSON', desc: 'Consistent, well-structured responses ready for your app', color: '#10b981', icon: <IconFileText size={22} /> },
          ].map((a, i) => (
            <Reveal key={a.step} delay={i * 150}>
              <div className="card-brutal relative overflow-hidden group">
                <div className="absolute top-0 right-0 text-[5rem] font-display opacity-[0.06] leading-none select-none" style={{ color: a.color }}>{a.step}</div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 flex items-center justify-center border-2" style={{ background: `${a.color}15`, color: a.color, borderColor: a.color }}>
                    {a.icon}
                  </div>
                  <div>
                    <div className="text-[0.55rem] font-display tracking-widest" style={{ color: a.color }}>STEP {a.step}</div>
                    <div className="font-display text-lg" style={{ textTransform: 'none', color: 'var(--text)' }}>{a.title}</div>
                  </div>
                </div>
                <div className="text-sm font-semibold text-[var(--text-secondary)] mb-2">{a.subtitle}</div>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{a.desc}</p>
                {i < 2 && <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] z-10"><IconChevronRight size={20} /></div>}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" style={{ background: 'var(--bg-dim)' }} className="py-20">
        <div className="max-w-container mx-auto px-5 md:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <span className="pill-tag" style={{ color: '#8b5cf6', borderColor: '#8b5cf6' }}>CAPABILITIES</span>
              <h2 className="font-display text-3xl md:text-4xl mt-4" style={{ textTransform: 'none' }}>Everything You Need</h2>
              <p className="text-[#334155] mt-3 max-w-lg mx-auto">A complete API for building manga readers, trackers, and discovery tools.</p>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <IconSearch size={20} />, title: 'Full-Text Search', desc: 'Search across hundreds of series by title.' },
              { icon: <IconBook size={20} />, title: 'Chapter Images', desc: 'Get every page image URL for any chapter.' },
              { icon: <IconZap size={20} />, title: 'Sub-Second Cache', desc: 'In-memory caching with 5-15 min TTL.' },
              { icon: <IconLockOpen size={20} />, title: 'Zero Auth', desc: 'No API keys, no sign-ups. Just JSON.' },
              { icon: <IconGlobe size={20} />, title: 'CORS Ready', desc: 'Call directly from any frontend.' },
              { icon: <IconShield size={20} />, title: 'Rate Limiting', desc: '60 req/min per IP with headers.' },
              { icon: <IconBarChart size={20} />, title: 'Rich Metadata', desc: 'Rating, views, author, schedule.' },
              { icon: <IconHeartPulse size={20} />, title: 'Health Monitor', desc: '/health with upstream probe.' },
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 60}>
                <div className="card-brutal group">
                  <div className="w-10 h-10 flex items-center justify-center bg-[#f59e0b] text-[#0f172a] border-2 border-[#0f172a] mb-4 shadow-brutal-sm group-hover:shadow-brutal transition-all">{f.icon}</div>
                  <h3 className="font-display text-sm mb-2" style={{ textTransform: 'none' }}>{f.title}</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── API Reference — Endpoint Rows ── */}
      <section id="endpoints" className="max-w-container mx-auto px-5 md:px-8 py-20">
        <Reveal>
          <div className="text-center mb-12">
            <span className="pill-tag" style={{ color: '#06b6d4', borderColor: '#06b6d4' }}>API REFERENCE</span>
            <h2 className="font-display text-3xl md:text-4xl mt-4" style={{ textTransform: 'none' }}>Clean, Predictable Endpoints</h2>
            <p className="text-[#334155] mt-3 max-w-lg mx-auto">Every response follows the same envelope format. No surprises.</p>
          </div>
        </Reveal>

        {/* Endpoint Rows (horizontal cards) */}
        <Reveal>
          <div className="space-y-2 mb-6">
            {endpoints.map((e, i) => (
              <div key={e.label} id={`ep-${e.label}`} className={`endpoint-row ${i === activeEp ? 'active' : ''}`} onClick={() => { setActiveEp(i); setCodeTab('curl'); }}>
                <span className="badge-get shrink-0">{e.method}</span>
                <span className="font-mono text-xs text-[var(--text)] truncate flex-1">{e.path}</span>
                <span className="text-xs text-[var(--text-muted)] hidden sm:inline">{e.desc}</span>
                <IconChevronRight size={14} />
              </div>
            ))}
          </div>
        </Reveal>

        {/* Active Endpoint Detail */}
        <Reveal>
          <div className="card-brutal">
            <div className="flex items-center gap-3 mb-2">
              <span className="badge-get">{ep.method}</span>
              <code className="font-mono text-sm text-[#f59e0b]">{ep.path}</code>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mb-6">{ep.desc}</p>

            {ep.params.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-display tracking-widest text-[var(--text-muted)] mb-3">PARAMETERS</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[var(--text-muted)] border-b-2 border-[#0f172a]">
                        <th className="pb-2 pr-4 font-display text-xs">NAME</th>
                        <th className="pb-2 pr-4 font-display text-xs">TYPE</th>
                        <th className="pb-2 pr-4 font-display text-xs">REQUIRED</th>
                        <th className="pb-2 pr-4 font-display text-xs">DEFAULT</th>
                        <th className="pb-2 font-display text-xs">DESC</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ep.params.map((p) => (
                        <tr key={p.name} className="border-b border-[var(--border-subtle)]">
                          <td className="py-2.5 pr-4"><code className="text-[#f59e0b] text-xs">{p.name}</code></td>
                          <td className="py-2.5 pr-4 text-[var(--text-muted)] text-xs">{p.type}</td>
                          <td className="py-2.5 pr-4">{p.required ? <span className="tag tag-rose text-[0.55rem]">YES</span> : <span className="text-[var(--text-muted)] text-xs">no</span>}</td>
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
                <button key={tab} onClick={() => setCodeTab(tab)} className={`text-xs font-display px-3 py-1.5 transition-all border-2 ${codeTab === tab ? 'bg-[#f59e0b] text-[#0f172a] border-[#0f172a]' : 'text-[var(--text-muted)] hover:text-[var(--text)] border-transparent'}`}>
                  {tab === 'curl' ? 'CURL' : 'JAVASCRIPT'}
                </button>
              ))}
            </div>
            <CodeBlock code={codeTab === 'curl' ? ep.curl : ep.js} lang={codeTab === 'curl' ? 'bash' : 'javascript'} />
          </div>
        </Reveal>
      </section>

      {/* ── Quick Start with recipe tabs ── */}
      <section style={{ background: 'var(--bg-dim)' }} className="py-20">
        <div className="max-w-container mx-auto px-5 md:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <span className="pill-tag" style={{ color: '#f59e0b', borderColor: '#f59e0b' }}>QUICK START</span>
              <h2 className="font-display text-3xl md:text-4xl mt-4" style={{ textTransform: 'none' }}>Common Recipes</h2>
              <p className="text-[#334155] mt-3 max-w-lg mx-auto">Real-world code snippets to get you building immediately.</p>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: 'Search for a Series',
                desc: 'Find any manga or manhwa by title.',
                code: `const res = await fetch('${BASE}/api/v1/search?q=solo');
const { data } = await res.json();

data.forEach(series => {
  console.log(series.title);    // "Sex Stopwatch"
  console.log(series.rating);   // 4.96
});`,
              },
              {
                title: 'Read Chapter Pages',
                desc: 'Get all page images for a reader.',
                code: `const res = await fetch(
  '${BASE}/api/v1/chapter/sex-stopwatch/chapter-1'
);
const { data } = await res.json();

data.images.forEach((url, i) => {
  const img = document.createElement('img');
  img.src = url;
  document.getElementById('reader').appendChild(img);
});`,
              },
              {
                title: 'Series with Chapters',
                desc: 'Fetch complete series data.',
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
                desc: 'Browse with pagination for infinite scroll.',
                code: `async function loadPage(page = 1) {
  const res = await fetch(
    \`${BASE}/api/v1/series?page=\${page}&perPage=20\`
  );
  const { data, pagination } = await res.json();

  console.log(\`Page \${pagination.currentPage}/\${pagination.lastPage}\`);
  return { data, hasMore: pagination.hasNext };
}`,
              },
            ].map((recipe, i) => (
              <Reveal key={recipe.title} delay={i * 80}>
                <div className="card-brutal">
                  <h3 className="font-display text-base mb-1" style={{ textTransform: 'none' }}>{recipe.title}</h3>
                  <p className="text-sm text-[var(--text-muted)] mb-4">{recipe.desc}</p>
                  <CodeBlock code={recipe.code} lang="javascript" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Response Format ── */}
      <section className="max-w-container mx-auto px-5 md:px-8 py-20">
        <Reveal>
          <div className="text-center mb-12">
            <span className="pill-tag" style={{ color: '#8b5cf6', borderColor: '#8b5cf6' }}>RESPONSE FORMAT</span>
            <h2 className="font-display text-3xl md:text-4xl mt-4" style={{ textTransform: 'none' }}>Consistent Envelope</h2>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { label: 'SUCCESS (LIST)', code: `{\n  "success": true,\n  "data": [...],\n  "pagination": {\n    "total": 100,\n    "perPage": 20,\n    "currentPage": 1,\n    "lastPage": 5,\n    "hasNext": true\n  }\n}` },
            { label: 'SUCCESS (SINGLE)', code: `{\n  "success": true,\n  "data": {\n    "id": 7,\n    "title": "Sex Stopwatch",\n    "rating": 4.96,\n    "status": "Completed"\n  }\n}` },
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
      </section>

      {/* ── Error Codes ── */}
      <section className="max-w-container mx-auto px-5 md:px-8 pb-20">
        <Reveal>
          <div className="card-brutal">
            <h3 className="font-display text-xl mb-6" style={{ textTransform: 'none' }}>HTTP STATUS CODES</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { code: '200', desc: 'Success', color: '#10b981' },
                { code: '400', desc: 'Bad Request', color: '#f59e0b' },
                { code: '404', desc: 'Not Found', color: '#ef4444' },
                { code: '429', desc: 'Rate Limited', color: '#ef4444' },
                { code: '500', desc: 'Server Error', color: '#ef4444' },
              ].map((c) => (
                <div key={c.code} className="text-center p-4 border-2 border-[var(--border)]" style={{ background: 'var(--bg-dim)' }}>
                  <div className="text-2xl font-display font-mono" style={{ color: c.color }}>{c.code}</div>
                  <div className="text-xs text-[var(--text-muted)] mt-1 font-display tracking-wider">{c.desc.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Playground ── */}
      <section id="playground" style={{ background: 'var(--bg-dim)' }} className="py-20">
        <div className="max-w-container mx-auto px-5 md:px-8">
          <Reveal>
            <Playground />
          </Reveal>
        </div>
      </section>

      {/* ── Rate Limiting ── */}
      <section className="max-w-container mx-auto px-5 md:px-8 py-20">
        <Reveal>
          <div className="card-brutal">
            <h3 className="font-display text-xl mb-6" style={{ textTransform: 'none' }}>RATE LIMITING</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="space-y-3">
                  {[
                    { label: 'Limit', value: '60 requests per minute' },
                    { label: 'Window', value: 'Rolling 60-second window' },
                    { label: 'Scope', value: 'Per IP address' },
                  ].map((r) => (
                    <div key={r.label} className="flex justify-between items-center py-2 border-b-2 border-[var(--border-subtle)]">
                      <span className="text-sm text-[var(--text-muted)] font-display tracking-wider text-xs">{r.label.toUpperCase()}</span>
                      <span className="text-sm font-medium text-[var(--text)]">{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-display tracking-widest text-[var(--text-muted)] mb-3">RESPONSE HEADERS</h4>
                <div className="space-y-2">
                  {[
                    { header: 'X-RateLimit-Limit', desc: 'Max requests allowed (60)' },
                    { header: 'X-RateLimit-Remaining', desc: 'Requests remaining in window' },
                    { header: 'X-RateLimit-Reset', desc: 'Window reset timestamp' },
                    { header: 'X-Request-ID', desc: 'Unique request ID for tracing' },
                  ].map((h) => (
                    <div key={h.header} className="flex items-baseline gap-3">
                      <code className="text-xs text-[#f59e0b] shrink-0">{h.header}</code>
                      <span className="text-xs text-[var(--text-muted)]">{h.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: '#0f172a', borderTop: '3px solid #334155' }} className="py-20">
        <div className="max-w-container mx-auto px-5 md:px-8 text-center">
          <Reveal>
            <h2 className="font-display text-3xl md:text-4xl text-white mb-4" style={{ textTransform: 'none' }}>Ready to Build?</h2>
            <p className="text-[#94a3b8] max-w-md mx-auto mb-8">Start using OmegaAPI today. Free, fast, and requires no authentication.</p>
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
