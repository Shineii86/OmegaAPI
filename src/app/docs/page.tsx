'use client';

import { useState } from 'react';

const BASE = typeof window !== 'undefined' ? window.location.origin : 'https://omegaapi.vercel.app';

const sections = [
  { id: 'overview', label: 'Overview' },
  { id: 'auth', label: 'Authentication' },
  { id: 'rate-limiting', label: 'Rate Limiting' },
  { id: 'caching', label: 'Caching' },
  { id: 'errors', label: 'Errors' },
  { id: 'pagination', label: 'Pagination' },
  { id: 'endpoints', label: 'Endpoints' },
  { id: 'series-list', label: 'GET /series' },
  { id: 'series-detail', label: 'GET /series/{slug}' },
  { id: 'chapters-list', label: 'GET /chapters/{slug}' },
  { id: 'chapter-content', label: 'GET /chapter/{slug}/{ch}' },
  { id: 'search', label: 'GET /search' },
  { id: 'genres', label: 'GET /genres' },
  { id: 'health', label: 'GET /health' },
  { id: 'stats', label: 'GET /stats' },
  { id: 'examples', label: 'Code Examples' },
];

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="text-[0.6rem] font-semibold uppercase tracking-wider px-2 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-[#5c5a70] hover:text-[#e8e6f0] transition-all border border-transparent hover:border-[#1e1e3a]"
    >
      {copied ? '✓ copied' : 'copy'}
    </button>
  );
}

function CodeBlock({ code, lang = 'bash', title }: { code: string; lang?: string; title?: string }) {
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

function ParamTable({ params }: { params: { name: string; type: string; required: boolean; def: string; desc: string }[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[#5c5a70] border-b border-[#1e1e3a]">
            <th className="pb-2 pr-4 font-semibold">Name</th>
            <th className="pb-2 pr-4 font-semibold">Type</th>
            <th className="pb-2 pr-4 font-semibold">Required</th>
            <th className="pb-2 pr-4 font-semibold">Default</th>
            <th className="pb-2 font-semibold">Description</th>
          </tr>
        </thead>
        <tbody>
          {params.map((p) => (
            <tr key={p.name} className="border-b border-[#1e1e3a]/50">
              <td className="py-2.5 pr-4"><code className="text-[#a78bfa] text-xs">{p.name}</code></td>
              <td className="py-2.5 pr-4 text-[#5c5a70] text-xs">{p.type}</td>
              <td className="py-2.5 pr-4">
                {p.required ? <span className="tag tag-rose text-[0.6rem]">yes</span> : <span className="text-[#5c5a70] text-xs">no</span>}
              </td>
              <td className="py-2.5 pr-4 text-[#5c5a70] text-xs">{p.def}</td>
              <td className="py-2.5 text-[#8b89a0] text-xs">{p.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EndpointSection({
  id, method, path, desc, params, curl, js, jsonResponse
}: {
  id: string; method: string; path: string; desc: string;
  params: { name: string; type: string; required: boolean; def: string; desc: string }[];
  curl: string; js: string; jsonResponse: string;
}) {
  const [tab, setTab] = useState<'curl' | 'js' | 'response'>('curl');
  return (
    <div id={id} className="scroll-mt-24">
      <div className="flex items-center gap-3 mb-2">
        <span className="badge-get">{method}</span>
        <code className="font-mono text-sm text-[#a78bfa]">{path}</code>
      </div>
      <p className="text-sm text-[#8b89a0] mb-5">{desc}</p>

      {params.length > 0 && (
        <div className="mb-5">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#5c5a70] mb-3">Parameters</h4>
          <ParamTable params={params} />
        </div>
      )}

      <div className="flex gap-1 mb-3">
        {(['curl', 'js', 'response'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
              tab === t
                ? 'bg-[#7c3aed]/15 text-[#a78bfa] border border-[#7c3aed]/25'
                : 'text-[#5c5a70] hover:text-[#8b89a0] border border-transparent'
            }`}
          >
            {t === 'curl' ? 'cURL' : t === 'js' ? 'JavaScript' : 'Response'}
          </button>
        ))}
      </div>
      <CodeBlock
        code={tab === 'curl' ? curl : tab === 'js' ? js : jsonResponse}
        lang={tab === 'curl' ? 'bash' : tab === 'js' ? 'javascript' : 'json'}
      />
    </div>
  );
}

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#06060e]">
      {/* Nav */}
      <nav className="glass sticky top-0 z-50 border-b border-[#1e1e3a]/40">
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] flex items-center justify-center text-white font-black text-sm">Ω</div>
            <span className="font-bold text-lg tracking-tight">OmegaAPI</span>
            <span className="tag tag-purple ml-1 hidden sm:inline-flex">Docs</span>
          </a>
          <div className="hidden md:flex items-center gap-6">
            <a href="/" className="text-sm text-[#8b89a0] hover:text-[#e8e6f0] transition-colors">Home</a>
            <a href="/browse" className="text-sm text-[#8b89a0] hover:text-[#e8e6f0] transition-colors">Browse</a>
            <a href="/support" className="text-sm text-[#8b89a0] hover:text-[#e8e6f0] transition-colors">Support</a>
            <a href="#endpoints" className="btn-primary text-xs px-4 py-2">API Reference</a>
          </div>
          <button className="md:hidden text-[#8b89a0]" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              {sidebarOpen ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-56 lg:w-64 shrink-0 md:sticky md:top-16 md:h-[calc(100vh-4rem)] overflow-y-auto border-r border-[#1e1e3a]/40 p-4 md:p-6`}>
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.15em] text-[#7c3aed] mb-4">Documentation</p>
          <nav className="space-y-0.5">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => { setActiveSection(s.id); setSidebarOpen(false); }}
                className={`block text-xs py-1.5 px-3 rounded-lg transition-all ${
                  activeSection === s.id
                    ? 'bg-[#7c3aed]/10 text-[#a78bfa] font-semibold'
                    : 'text-[#5c5a70] hover:text-[#8b89a0] hover:bg-white/[0.02]'
                }`}
              >
                {s.label}
              </a>
            ))}
          </nav>
          <div className="mt-6 pt-6 border-t border-[#1e1e3a]/40">
            <a href="/api/v1/health" target="_blank" className="flex items-center gap-2 text-xs text-[#5c5a70] hover:text-[#8b89a0] transition-colors">
              <span className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_6px_rgba(16,185,129,0.4)]" />
              API Status
            </a>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0 px-5 md:px-10 lg:px-16 py-10 md:py-16">
          {/* Overview */}
          <section id="overview" className="mb-16 scroll-mt-24">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4">API Documentation</h1>
            <p className="text-[#8b89a0] leading-relaxed mb-6 max-w-2xl">
              OmegaAPI is a free, public REST API for manga and manhwa data. It acts as a middleware
              layer on top of the OmegaScans API, adding caching, rate limiting, data normalization,
              and consistent error handling.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {[
                { label: 'Base URL', value: `${BASE}/api/v1`, mono: true },
                { label: 'Protocol', value: 'HTTPS only' },
                { label: 'Method', value: 'GET only (all endpoints)' },
                { label: 'Auth', value: 'None required' },
                { label: 'CORS', value: 'All origins allowed' },
                { label: 'Content-Type', value: 'application/json' },
                { label: 'Rate Limit', value: '60 requests/min per IP' },
                { label: 'Cache', value: '5–15 min TTL' },
              ].map((p) => (
                <div key={p.label} className="flex justify-between items-center py-2.5 px-4 rounded-xl bg-white/[0.02] border border-[#1e1e3a]/50">
                  <span className="text-xs text-[#5c5a70]">{p.label}</span>
                  <code className={`text-xs ${p.mono ? 'text-[#a78bfa]' : 'text-[#e8e6f0]'}`}>{p.value}</code>
                </div>
              ))}
            </div>
          </section>

          {/* Auth */}
          <section id="auth" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4">Authentication</h2>
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#10b981]/10 text-[#10b981] flex items-center justify-center shrink-0">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="9" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">No authentication required</h3>
                  <p className="text-sm text-[#8b89a0] leading-relaxed">
                    OmegaAPI is completely open. No API keys, no OAuth tokens, no sign-up forms.
                    Just make a GET request and receive JSON. We enforce fair usage through
                    IP-based rate limiting instead of authentication.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Rate Limiting */}
          <section id="rate-limiting" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4">Rate Limiting</h2>
            <p className="text-sm text-[#8b89a0] mb-4 max-w-2xl">
              To ensure fair usage and protect the upstream API, OmegaAPI enforces rate limits
              on all endpoints. Limits are tracked per IP address using a sliding window algorithm.
            </p>
            <div className="glass-card rounded-2xl p-6 mb-4">
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label: 'Limit', value: '60 requests', sub: 'per minute' },
                  { label: 'Window', value: '60 seconds', sub: 'rolling' },
                  { label: 'Scope', value: 'Per IP', sub: 'address' },
                ].map((r) => (
                  <div key={r.label} className="text-center p-4 rounded-xl bg-white/[0.02] border border-[#1e1e3a]/50">
                    <div className="text-xs text-[#5c5a70] mb-1">{r.label}</div>
                    <div className="text-xl font-bold font-mono">{r.value}</div>
                    <div className="text-xs text-[#5c5a70]">{r.sub}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card rounded-2xl p-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#5c5a70] mb-4">Response Headers</h4>
              <div className="space-y-3">
                {[
                  { header: 'X-RateLimit-Limit', desc: 'Maximum requests allowed in the current window (60)' },
                  { header: 'X-RateLimit-Remaining', desc: 'Number of requests remaining in the current window' },
                  { header: 'X-RateLimit-Reset', desc: 'Unix timestamp when the current window resets' },
                  { header: 'X-Request-ID', desc: 'Unique UUID for request tracing and debugging' },
                  { header: 'Retry-After', desc: 'Seconds to wait before retrying (only on 429 responses)' },
                ].map((h) => (
                  <div key={h.header} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 py-2 border-b border-[#1e1e3a]/30 last:border-0">
                    <code className="text-xs text-[#a78bfa] shrink-0 w-44">{h.header}</code>
                    <span className="text-xs text-[#8b89a0]">{h.desc}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <CodeBlock
                title="Handling 429 responses"
                lang="javascript"
                code={`const res = await fetch('${BASE}/api/v1/series');

if (res.status === 429) {
  const retryAfter = res.headers.get('Retry-After');
  console.log(\`Rate limited. Retry after \${retryAfter}s\`);
  await new Promise(r => setTimeout(r, retryAfter * 1000));
  // Retry the request...
}`}
              />
            </div>
          </section>

          {/* Caching */}
          <section id="caching" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4">Caching</h2>
            <p className="text-sm text-[#8b89a0] mb-4 max-w-2xl">
              All responses are cached in-memory with configurable TTL to reduce load on the
              upstream API and deliver sub-second responses.
            </p>
            <div className="glass-card rounded-2xl p-6">
              <div className="space-y-3">
                {[
                  { data: 'Series list & details', ttl: '5 minutes' },
                  { data: 'Search results', ttl: '10 minutes' },
                  { data: 'Chapter content & images', ttl: '15 minutes' },
                  { data: 'Genres', ttl: '30 minutes' },
                ].map((c) => (
                  <div key={c.data} className="flex justify-between items-center py-2 border-b border-[#1e1e3a]/30 last:border-0">
                    <span className="text-sm text-[#8b89a0]">{c.data}</span>
                    <span className="tag tag-cyan text-[0.6rem]">{c.ttl}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-[#5c5a70] mt-3">
              Cached responses include an <code className="text-[#a78bfa]">X-Cache: HIT</code> header.
              The <code className="text-[#a78bfa]">Cache-Control: public, s-maxage=300</code> header
              enables Vercel&apos;s edge cache for additional performance.
            </p>
          </section>

          {/* Errors */}
          <section id="errors" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4">Error Handling</h2>
            <p className="text-sm text-[#8b89a0] mb-4 max-w-2xl">
              All error responses follow the same envelope format with a descriptive message.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
              {[
                { code: '200', desc: 'Success — data returned', color: '#10b981' },
                { code: '400', desc: 'Bad request — missing/invalid params', color: '#f59e0b' },
                { code: '404', desc: 'Not found — series/chapter doesn\'t exist', color: '#f43f5e' },
                { code: '429', desc: 'Rate limited — too many requests', color: '#f43f5e' },
                { code: '500', desc: 'Server error — upstream API issue', color: '#f43f5e' },
                { code: '503', desc: 'Service unavailable — upstream down', color: '#f43f5e' },
              ].map((e) => (
                <div key={e.code} className="glass-card rounded-xl p-4 text-center">
                  <div className="text-2xl font-black font-mono mb-1" style={{ color: e.color }}>{e.code}</div>
                  <div className="text-xs text-[#8b89a0]">{e.desc}</div>
                </div>
              ))}
            </div>
            <CodeBlock
              title="Error response format"
              lang="json"
              code={`{
  "success": false,
  "error": "Series not found"
}`}
            />
          </section>

          {/* Pagination */}
          <section id="pagination" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4">Pagination</h2>
            <p className="text-sm text-[#8b89a0] mb-4 max-w-2xl">
              List endpoints return paginated results. Use <code className="text-[#a78bfa]">page</code> and{' '}
              <code className="text-[#a78bfa]">perPage</code> parameters to navigate through results.
            </p>
            <CodeBlock
              title="Pagination object"
              lang="json"
              code={`{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 250,
    "perPage": 20,
    "currentPage": 2,
    "lastPage": 13,
    "hasNext": true,
    "hasPrevious": true
  }
}`}
            />
          </section>

          {/* Endpoints Header */}
          <section id="endpoints" className="mb-10 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-2">Endpoints</h2>
            <p className="text-sm text-[#8b89a0]">Detailed reference for every available endpoint.</p>
          </section>

          {/* Series List */}
          <section className="mb-14">
            <EndpointSection
              id="series-list"
              method="GET"
              path="/api/v1/series"
              desc="Browse all available series with optional search and pagination."
              params={[
                { name: 'page', type: 'integer', required: false, def: '1', desc: 'Page number' },
                { name: 'perPage', type: 'integer', required: false, def: '20', desc: 'Results per page (max 100)' },
                { name: 'q', type: 'string', required: false, def: '—', desc: 'Search query to filter results' },
              ]}
              curl={`curl "${BASE}/api/v1/series?page=1&perPage=5"`}
              js={`const res = await fetch('${BASE}/api/v1/series?page=1&perPage=5');
const { success, data, pagination } = await res.json();

console.log(\`Showing \${data.length} of \${pagination.total} series\`);
data.forEach(s => {
  console.log(\`\${s.title} — \${s.status} — ★\${s.rating}\`);
});`}
              jsonResponse={`{
  "success": true,
  "data": [
    {
      "id": 7,
      "title": "Sex Stopwatch",
      "slug": "sex-stopwatch",
      "description": "Just before the ordinary repeating student...",
      "thumbnail": "https://media.omegascans.org/...",
      "cover": "https://media.omegascans.org/...",
      "status": "Completed",
      "type": "Comic",
      "rating": 4.96,
      "totalViews": 20110784,
      "alternativeNames": "섹톱워치 | Sextopwatch",
      "author": "",
      "studio": "",
      "releaseYear": "",
      "releaseSchedule": ["Friday"],
      "tags": [],
      "chaptersCount": 155,
      "bookmarksCount": 0,
      "isComingSoon": false,
      "badge": "Hot",
      "createdAt": "2023-03-30T20:58:58.525+00:00",
      "updatedAt": "2023-04-01T21:57:22.886+00:00",
      "chapters": [],
      "url": "/api/v1/series/sex-stopwatch"
    }
  ],
  "pagination": {
    "total": 263,
    "perPage": 5,
    "currentPage": 1,
    "lastPage": 53,
    "hasNext": true,
    "hasPrevious": false
  }
}`}
            />
          </section>

          {/* Series Detail */}
          <section className="mb-14">
            <EndpointSection
              id="series-detail"
              method="GET"
              path="/api/v1/series/{slug}"
              desc="Get complete information for a single series. Pass include=chapters to embed the full chapter list."
              params={[
                { name: 'slug', type: 'string', required: true, def: '—', desc: 'URL-friendly series identifier' },
                { name: 'include', type: 'string', required: false, def: '—', desc: 'Pass "chapters" to embed chapter list' },
              ]}
              curl={`# Basic
curl "${BASE}/api/v1/series/sex-stopwatch"

# With chapters
curl "${BASE}/api/v1/series/sex-stopwatch?include=chapters"`}
              js={`const res = await fetch(
  '${BASE}/api/v1/series/sex-stopwatch?include=chapters'
);
const { data } = await res.json();

console.log(data.title);         // "Sex Stopwatch"
console.log(data.rating);        // 4.96
console.log(data.chaptersCount); // 155
console.log(data.author);        // ""
console.log(data.studio);        // ""
console.log(data.status);        // "Completed"
console.log(data.chapters[0]);   // { id, name, slug, ... }`}
              jsonResponse={`{
  "success": true,
  "data": {
    "id": 7,
    "title": "Sex Stopwatch",
    "slug": "sex-stopwatch",
    "description": "Just before the ordinary repeating student...",
    "thumbnail": "https://media.omegascans.org/...",
    "cover": "https://media.omegascans.org/...",
    "status": "Completed",
    "type": "Comic",
    "rating": 4.96,
    "totalViews": 20110784,
    "alternativeNames": "섹톱워치 | Sextopwatch",
    "author": "",
    "studio": "",
    "releaseYear": "",
    "releaseSchedule": ["Friday"],
    "tags": [],
    "chaptersCount": 155,
    "bookmarksCount": 0,
    "isComingSoon": false,
    "badge": "Hot",
    "url": "/api/v1/series/sex-stopwatch",
    "chapters": [
      {
        "id": 10811,
        "name": "Chapter 155",
        "title": null,
        "slug": "chapter-155",
        "thumbnail": "",
        "price": 0,
        "isFree": true,
        "createdAt": "2025-08-12T02:07:27.261+00:00",
        "index": "155.0",
        "url": "/api/v1/chapter/sex-stopwatch/chapter-155"
      }
    ]
  }
}`}
            />
          </section>

          {/* Chapters List */}
          <section className="mb-14">
            <EndpointSection
              id="chapters-list"
              method="GET"
              path="/api/v1/chapters/{slug}"
              desc="Get all chapters for a series with pagination."
              params={[
                { name: 'slug', type: 'string', required: true, def: '—', desc: 'Series slug' },
                { name: 'page', type: 'integer', required: false, def: '1', desc: 'Page number' },
                { name: 'perPage', type: 'integer', required: false, def: '100', desc: 'Results per page (max 500)' },
              ]}
              curl={`curl "${BASE}/api/v1/chapters/sex-stopwatch"`}
              js={`const res = await fetch('${BASE}/api/v1/chapters/sex-stopwatch');
const { data, pagination } = await res.json();

console.log(\`\${pagination.total} chapters available\`);
data.forEach(ch => {
  console.log(\`\${ch.name} — Free: \${ch.isFree}\`);
});`}
              jsonResponse={`{
  "success": true,
  "data": [
    {
      "id": 10811,
      "name": "Chapter 155",
      "title": null,
      "slug": "chapter-155",
      "thumbnail": "https://media.omegascans.org/...",
      "price": 0,
      "isFree": true,
      "createdAt": "2025-08-12T02:07:27.261+00:00",
      "index": "",
      "url": "/api/v1/chapter/sex-stopwatch/chapter-155"
    }
  ],
  "pagination": {
    "total": 155,
    "perPage": 100,
    "currentPage": 1,
    "lastPage": 2,
    "hasNext": true,
    "hasPrevious": false
  }
}`}
            />
          </section>

          {/* Chapter Content */}
          <section className="mb-14">
            <EndpointSection
              id="chapter-content"
              method="GET"
              path="/api/v1/chapter/{slug}/{chapter}"
              desc="Get chapter content with all page image URLs. Perfect for building reader interfaces."
              params={[
                { name: 'slug', type: 'string', required: true, def: '—', desc: 'Series slug' },
                { name: 'chapter', type: 'string', required: true, def: '—', desc: 'Chapter slug (e.g. chapter-1)' },
              ]}
              curl={`curl "${BASE}/api/v1/chapter/sex-stopwatch/chapter-1"`}
              js={`const res = await fetch(
  '${BASE}/api/v1/chapter/sex-stopwatch/chapter-1'
);
const { data } = await res.json();

console.log(data.name);       // "Chapter 1"
console.log(data.pageCount);  // 13
console.log(data.isFree);     // true

// Build a reader
data.images.forEach((url, i) => {
  const img = document.createElement('img');
  img.src = url;
  img.loading = 'lazy';
  document.getElementById('reader').appendChild(img);
});`}
              jsonResponse={`{
  "success": true,
  "data": {
    "id": 10944,
    "name": "Chapter 1",
    "title": null,
    "slug": "chapter-1",
    "index": "1.0",
    "price": 0,
    "isFree": true,
    "thumbnail": "https://media.omegascans.org/...",
    "images": [
      "https://media.omegascans.org/.../01.jpg",
      "https://media.omegascans.org/.../02.jpg",
      "https://media.omegascans.org/.../03.jpg"
    ],
    "pageCount": 13,
    "createdAt": "2024-01-15T10:30:00.000+00:00",
    "series": {
      "id": 722,
      "title": "The Father-In-Law Fucks Them All",
      "slug": "the-father-in-law-fucks-them-all",
      "thumbnail": "https://media.omegascans.org/...",
      "status": "Ongoing",
      "description": "Chairman… please, give me the seed..."
    },
    "url": "/api/v1/chapter/the-father-in-law-fucks-them-all/chapter-1"
  }
}`}
            />
          </section>

          {/* Search */}
          <section className="mb-14">
            <EndpointSection
              id="search"
              method="GET"
              path="/api/v1/search?q={query}"
              desc="Full-text search across all series by title. Minimum 1 character."
              params={[
                { name: 'q', type: 'string', required: true, def: '—', desc: 'Search query' },
                { name: 'page', type: 'integer', required: false, def: '1', desc: 'Page number' },
              ]}
              curl={`curl "${BASE}/api/v1/search?q=solo"`}
              js={`const res = await fetch('${BASE}/api/v1/search?q=solo');
const { data, pagination } = await res.json();

console.log(\`Found \${pagination.total} results\`);
data.forEach(s => {
  console.log(\`\${s.title} (\${s.status}) — ★\${s.rating}\`);
});`}
              jsonResponse={`{
  "success": true,
  "data": [
    {
      "id": 7,
      "title": "Sex Stopwatch",
      "slug": "sex-stopwatch",
      "description": "Just before the ordinary repeating student...",
      "thumbnail": "https://media.omegascans.org/...",
      "status": "Completed",
      "type": "Comic",
      "rating": 4.96,
      "totalViews": 20110784,
      "badge": "Hot",
      "url": "/api/v1/series/sex-stopwatch"
    }
  ],
  "pagination": {
    "total": 263,
    "perPage": 12,
    "currentPage": 1,
    "lastPage": 22,
    "hasNext": true,
    "hasPrevious": false
  }
}`}
            />
          </section>

          {/* Genres */}
          <section className="mb-14">
            <EndpointSection
              id="genres"
              method="GET"
              path="/api/v1/genres"
              desc="List all supported genre categories."
              params={[]}
              curl={`curl "${BASE}/api/v1/genres"`}
              js={`const res = await fetch('${BASE}/api/v1/genres');
const { data } = await res.json();
console.log(data.genres); // ["Action", "Adult", ...]`}
              jsonResponse={`{
  "success": true,
  "data": {
    "genres": [
      "Action", "Adult", "Comedy", "Drama", "Fantasy",
      "Harem", "Horror", "Isekai", "Martial Arts",
      "Mature", "Mystery", "Psychological", "Romance",
      "School Life", "Sci-Fi", "Seinen", "Shounen",
      "Slice of Life", "Supernatural", "Thriller",
      "Tragedy", "Webtoon", "Yaoi", "Yuri"
    ],
    "note": "Genre filtering is not yet supported by the upstream API."
  }
}`}
            />
          </section>

          {/* Health */}
          <section className="mb-14">
            <EndpointSection
              id="health"
              method="GET"
              path="/api/v1/health"
              desc="Check API health status, upstream connectivity, and latency."
              params={[]}
              curl={`curl "${BASE}/api/v1/health"`}
              js={`const res = await fetch('${BASE}/api/v1/health');
const { data } = await res.json();

console.log(data.status);            // "ok"
console.log(data.uptime);            // 86400 (seconds)
console.log(data.upstream.status);   // "ok"
console.log(data.upstream.latencyMs); // 180`}
              jsonResponse={`{
  "success": true,
  "data": {
    "status": "ok",
    "version": "1.0.0",
    "uptime": 86400,
    "upstream": {
      "status": "ok",
      "latencyMs": 180,
      "url": "https://api.omegascans.org"
    },
    "timestamp": "2026-05-11T12:00:00.000Z"
  }
}`}
            />
          </section>

          {/* Stats */}
          <section className="mb-14">
            <EndpointSection
              id="stats"
              method="GET"
              path="/api/v1/stats"
              desc="API statistics including uptime, cache info, and endpoint listing."
              params={[]}
              curl={`curl "${BASE}/api/v1/stats"`}
              js={`const res = await fetch('${BASE}/api/v1/stats');
const { data } = await res.json();

console.log(data.name);      // "OmegaAPI"
console.log(data.version);   // "1.0.0"
console.log(data.endpoints); // [{ method, path, desc }, ...]`}
              jsonResponse={`{
  "success": true,
  "data": {
    "name": "OmegaAPI",
    "version": "1.0.0",
    "description": "Free Manga & Manhwa REST API powered by OmegaScans",
    "uptime": 86400,
    "endpoints": [
      { "method": "GET", "path": "/api/v1/series", "description": "Browse series" },
      { "method": "GET", "path": "/api/v1/series/:slug", "description": "Series details" },
      { "method": "GET", "path": "/api/v1/chapters/:slug", "description": "Chapter list" },
      { "method": "GET", "path": "/api/v1/chapter/:slug/:chapter", "description": "Chapter content" },
      { "method": "GET", "path": "/api/v1/search", "description": "Search series" },
      { "method": "GET", "path": "/api/v1/genres", "description": "List genres" },
      { "method": "GET", "path": "/api/v1/health", "description": "Health check" },
      { "method": "GET", "path": "/api/v1/stats", "description": "API stats" }
    ],
    "cache": { "entries": 42 },
    "rateLimit": { "maxRequests": 60, "windowMs": 60000 },
    "source": "https://omegascans.org",
    "timestamp": "2026-05-11T12:00:00.000Z"
  }
}`}
            />
          </section>

          {/* Code Examples */}
          <section id="examples" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6">Code Examples</h2>
            <div className="space-y-6">
              {[
                {
                  title: 'Node.js / Fetch',
                  code: `const response = await fetch('${BASE}/api/v1/search?q=naruto');
const { success, data, pagination } = await response.json();

if (success) {
  console.log(\`Found \${pagination.total} series:\`);
  data.forEach(series => {
    console.log(\`  \${series.title} (★\${series.rating})\`);
  });
}`,
                },
                {
                  title: 'Python / requests',
                  code: `import requests

response = requests.get('${BASE}/api/v1/series/sex-stopwatch')
data = response.json()

if data['success']:
    series = data['data']
    print(f"{series['title']} — {series['status']}")
    print(f"Rating: {series['rating']}")
    print(f"Chapters: {series['chaptersCount']}")`,
                },
                {
                  title: 'cURL / Shell',
                  code: `# Search for series
curl -s "${BASE}/api/v1/search?q=solo" | jq '.data[] | .title'

# Get chapter images
curl -s "${BASE}/api/v1/chapter/sex-stopwatch/chapter-1" | jq '.data.images[]'

# Check health
curl -s "${BASE}/api/v1/health" | jq '.data.status'`,
                },
                {
                  title: 'Build a Reader (Browser)',
                  code: `async function loadChapter(seriesSlug, chapterSlug) {
  const res = await fetch(
    \`${BASE}/api/v1/chapter/\${seriesSlug}/\${chapterSlug}\`
  );
  const { data } = await res.json();

  const reader = document.getElementById('reader');
  reader.innerHTML = '';

  data.images.forEach((url, i) => {
    const img = document.createElement('img');
    img.src = url;
    img.alt = \`Page \${i + 1}\`;
    img.loading = 'lazy';
    img.style.width = '100%';
    img.style.display = 'block';
    reader.appendChild(img);
  });

  return data;
}

loadChapter('sex-stopwatch', 'chapter-1');`,
                },
              ].map((ex) => (
                <div key={ex.title}>
                  <h3 className="text-sm font-semibold mb-3">{ex.title}</h3>
                  <CodeBlock code={ex.code} lang="javascript" />
                </div>
              ))}
            </div>
          </section>

          {/* Footer nav */}
          <div className="flex flex-col sm:flex-row gap-3 pt-8 border-t border-[#1e1e3a]/40">
            <a href="/browse" className="btn-ghost text-sm text-center">Browse Series →</a>
            <a href="/support" className="btn-ghost text-sm text-center">Get Support →</a>
          </div>
        </div>
      </div>
    </main>
  );
}
