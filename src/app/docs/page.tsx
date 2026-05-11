'use client';

import { useState } from 'react';
import { Navbar, Footer } from '@/components/layout';
import { IconChevronRight } from '@/components/icons';
import { CodeBlock } from '@/components/ui';

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

function ParamTable({ params }: { params: { name: string; type: string; required: boolean; def: string; desc: string }[] }) {
  return (
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
          {params.map((p) => (
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
  );
}

function EndpointSection({ id, method, path, desc, params, curl, js, jsonResponse }: {
  id: string; method: string; path: string; desc: string;
  params: { name: string; type: string; required: boolean; def: string; desc: string }[];
  curl: string; js: string; jsonResponse: string;
}) {
  const [tab, setTab] = useState<'curl' | 'js' | 'response'>('curl');
  return (
    <div id={id} className="scroll-mt-24">
      <div className="flex items-center gap-3 mb-2">
        <span className="badge-get">{method}</span>
        <code className="font-mono text-sm text-[var(--accent)]">{path}</code>
      </div>
      <p className="text-sm text-[var(--text-secondary)] mb-5">{desc}</p>
      {params.length > 0 && (
        <div className="mb-5">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3">Parameters</h4>
          <ParamTable params={params} />
        </div>
      )}
      <div className="flex gap-1 mb-3">
        {(['curl', 'js', 'response'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${tab === t ? 'bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent)]/20' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] border border-transparent'}`}>
            {t === 'curl' ? 'cURL' : t === 'js' ? 'JavaScript' : 'Response'}
          </button>
        ))}
      </div>
      <CodeBlock code={tab === 'curl' ? curl : tab === 'js' ? js : jsonResponse} lang={tab === 'curl' ? 'bash' : tab === 'js' ? 'javascript' : 'json'} />
    </div>
  );
}

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar active="docs">
        <a href="#endpoints" className="btn-brutal btn-sm text-xs px-4 py-2">API REFERENCE</a>
      </Navbar>

      <div className="max-w-container mx-auto flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-56 lg:w-64 shrink-0 md:sticky md:top-16 md:h-[calc(100vh-4rem)] overflow-y-auto border-r border-[var(--border-subtle)] p-4 md:p-6 bg-[var(--bg-subtle)]`}>
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.15em] text-[var(--accent)] mb-4">Documentation</p>
          <nav className="space-y-0.5">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} onClick={() => { setActiveSection(s.id); setSidebarOpen(false); }} className={`block text-xs py-1.5 px-3 rounded-lg transition-all ${activeSection === s.id ? 'bg-[var(--accent-subtle)] text-[var(--accent)] font-semibold' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]'}`}>
                {s.label}
              </a>
            ))}
          </nav>
          <div className="mt-6 pt-6 border-t border-[var(--border-subtle)]">
            <a href="/api/v1/health" target="_blank" className="flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
              <span className="w-2 h-2 rounded-full bg-[var(--emerald)]" />
              API Status
            </a>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0 px-5 md:px-10 lg:px-16 py-10 md:py-16">
          <section id="overview" className="mb-16 scroll-mt-24">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4 text-[var(--text)]">API Documentation</h1>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-6 max-w-2xl">OmegaAPI is a free, public REST API for manga and manhwa data. It acts as a middleware layer on top of the OmegaScans API, adding caching, rate limiting, data normalization, and consistent error handling.</p>
            <div className="grid sm:grid-cols-2 gap-3 mb-8">
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
                <div key={p.label} className="flex justify-between items-center py-2.5 px-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)]">
                  <span className="text-xs text-[var(--text-muted)]">{p.label}</span>
                  <code className={`text-xs ${p.mono ? 'text-[var(--accent)]' : 'text-[var(--text)] font-medium'}`}>{p.value}</code>
                </div>
              ))}
            </div>
          </section>

          <section id="auth" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">Authentication</h2>
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--emerald-subtle)] text-[var(--emerald)] flex items-center justify-center shrink-0">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="9" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-[var(--text)]">No authentication required</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">OmegaAPI is completely open. No API keys, no OAuth tokens, no sign-up forms. Just make a GET request and receive JSON. We enforce fair usage through IP-based rate limiting instead of authentication.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="rate-limiting" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">Rate Limiting</h2>
            <p className="text-sm text-[var(--text-secondary)] mb-4 max-w-2xl">To ensure fair usage and protect the upstream API, OmegaAPI enforces rate limits on all endpoints. Limits are tracked per IP address using a sliding window algorithm.</p>
            <div className="glass-card rounded-2xl p-6 mb-4">
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label: 'Limit', value: '60 requests', sub: 'per minute' },
                  { label: 'Window', value: '60 seconds', sub: 'rolling' },
                  { label: 'Scope', value: 'Per IP', sub: 'address' },
                ].map((r) => (
                  <div key={r.label} className="text-center p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)]">
                    <div className="text-xs text-[var(--text-muted)] mb-1">{r.label}</div>
                    <div className="text-xl font-bold font-mono text-[var(--text)]">{r.value}</div>
                    <div className="text-xs text-[var(--text-muted)]">{r.sub}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card rounded-2xl p-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4">Response Headers</h4>
              <div className="space-y-3">
                {[
                  { header: 'X-RateLimit-Limit', desc: 'Maximum requests allowed in the current window (60)' },
                  { header: 'X-RateLimit-Remaining', desc: 'Number of requests remaining in the current window' },
                  { header: 'X-RateLimit-Reset', desc: 'Unix timestamp when the current window resets' },
                  { header: 'X-Request-ID', desc: 'Unique UUID for request tracing and debugging' },
                  { header: 'Retry-After', desc: 'Seconds to wait before retrying (only on 429 responses)' },
                ].map((h) => (
                  <div key={h.header} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 py-2 border-b border-[var(--border-subtle)] last:border-0">
                    <code className="text-xs text-[var(--accent)] shrink-0 w-44">{h.header}</code>
                    <span className="text-xs text-[var(--text-secondary)]">{h.desc}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <CodeBlock title="Handling 429 responses" lang="javascript" code={`const res = await fetch('${BASE}/api/v1/series');

if (res.status === 429) {
  const retryAfter = res.headers.get('Retry-After');
  console.log(\`Rate limited. Retry after \${retryAfter}s\`);
  await new Promise(r => setTimeout(r, retryAfter * 1000));
  // Retry the request...
}`} />
            </div>
          </section>

          <section id="caching" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">Caching</h2>
            <p className="text-sm text-[var(--text-secondary)] mb-4 max-w-2xl">All responses are cached in-memory with configurable TTL to reduce load on the upstream API and deliver sub-second responses.</p>
            <div className="glass-card rounded-2xl p-6">
              <div className="space-y-3">
                {[
                  { data: 'Series list & details', ttl: '5 minutes' },
                  { data: 'Search results', ttl: '10 minutes' },
                  { data: 'Chapter content & images', ttl: '15 minutes' },
                  { data: 'Genres', ttl: '30 minutes' },
                ].map((c) => (
                  <div key={c.data} className="flex justify-between items-center py-2 border-b border-[var(--border-subtle)] last:border-0">
                    <span className="text-sm text-[var(--text-secondary)]">{c.data}</span>
                    <span className="tag tag-cyan text-[0.6rem]">{c.ttl}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-3">Cached responses include an <code className="text-[var(--accent)]">X-Cache: HIT</code> header. The <code className="text-[var(--accent)]">Cache-Control: public, s-maxage=300</code> header enables Vercel&apos;s edge cache for additional performance.</p>
          </section>

          <section id="errors" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">Error Handling</h2>
            <p className="text-sm text-[var(--text-secondary)] mb-4 max-w-2xl">All error responses follow the same envelope format with a descriptive message.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
              {[
                { code: '200', desc: 'Success — data returned', color: 'var(--emerald)' },
                { code: '400', desc: 'Bad request — missing/invalid params', color: 'var(--amber)' },
                { code: '404', desc: 'Not found — series/chapter doesn\'t exist', color: 'var(--rose)' },
                { code: '429', desc: 'Rate limited — too many requests', color: 'var(--rose)' },
                { code: '500', desc: 'Server error — upstream API issue', color: 'var(--rose)' },
                { code: '503', desc: 'Service unavailable — upstream down', color: 'var(--rose)' },
              ].map((e) => (
                <div key={e.code} className="glass-card rounded-xl p-4 text-center">
                  <div className="text-2xl font-black font-mono mb-1" style={{ color: e.color }}>{e.code}</div>
                  <div className="text-xs text-[var(--text-muted)]">{e.desc}</div>
                </div>
              ))}
            </div>
            <CodeBlock title="Error response format" lang="json" code={`{\n  "success": false,\n  "error": "Series not found"\n}`} />
          </section>

          <section id="pagination" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">Pagination</h2>
            <p className="text-sm text-[var(--text-secondary)] mb-4 max-w-2xl">List endpoints return paginated results. Use <code className="text-[var(--accent)]">page</code> and <code className="text-[var(--accent)]">perPage</code> parameters to navigate through results.</p>
            <CodeBlock title="Pagination object" lang="json" code={`{\n  "success": true,\n  "data": [...],\n  "pagination": {\n    "total": 250,\n    "perPage": 20,\n    "currentPage": 2,\n    "lastPage": 13,\n    "hasNext": true,\n    "hasPrevious": true\n  }\n}`} />
          </section>

          <section id="endpoints" className="mb-10 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-2 text-[var(--text)]">Endpoints</h2>
            <p className="text-sm text-[var(--text-secondary)]">Detailed reference for every available endpoint.</p>
          </section>

          <section className="mb-14">
            <EndpointSection id="series-list" method="GET" path="/api/v1/series" desc="Browse all available series with optional search and pagination."
              params={[{ name: 'page', type: 'integer', required: false, def: '1', desc: 'Page number' }, { name: 'perPage', type: 'integer', required: false, def: '20', desc: 'Results per page (max 100)' }, { name: 'q', type: 'string', required: false, def: '—', desc: 'Search query to filter results' }]}
              curl={`curl "${BASE}/api/v1/series?page=1&perPage=5"`}
              js={`const res = await fetch('${BASE}/api/v1/series?page=1&perPage=5');\nconst { success, data, pagination } = await res.json();\n\nconsole.log(\`Showing \${data.length} of \${pagination.total} series\`);\ndata.forEach(s => {\n  console.log(\`\${s.title} — \${s.status} — ★\${s.rating}\`);\n});`}
              jsonResponse={`{\n  "success": true,\n  "data": [\n    {\n      "id": 7,\n      "title": "Sex Stopwatch",\n      "slug": "sex-stopwatch",\n      "status": "Completed",\n      "rating": 4.96,\n      "totalViews": 20110784,\n      "chaptersCount": 155,\n      "url": "/api/v1/series/sex-stopwatch"\n    }\n  ],\n  "pagination": {\n    "total": 263,\n    "perPage": 5,\n    "currentPage": 1,\n    "lastPage": 53,\n    "hasNext": true,\n    "hasPrevious": false\n  }\n}`}
            />
          </section>

          <section className="mb-14">
            <EndpointSection id="series-detail" method="GET" path="/api/v1/series/{slug}" desc="Get complete information for a single series. Pass include=chapters to embed the full chapter list."
              params={[{ name: 'slug', type: 'string', required: true, def: '—', desc: 'URL-friendly series identifier' }, { name: 'include', type: 'string', required: false, def: '—', desc: 'Pass "chapters" to embed chapter list' }]}
              curl={`curl "${BASE}/api/v1/series/sex-stopwatch?include=chapters"`}
              js={`const res = await fetch(\n  '${BASE}/api/v1/series/sex-stopwatch?include=chapters'\n);\nconst { data } = await res.json();\n\nconsole.log(data.title);         // "Sex Stopwatch"\nconsole.log(data.chaptersCount); // 155\nconsole.log(data.chapters[0]);   // { id, name, slug, ... }`}
              jsonResponse={`{\n  "success": true,\n  "data": {\n    "id": 7,\n    "title": "Sex Stopwatch",\n    "slug": "sex-stopwatch",\n    "status": "Completed",\n    "rating": 4.96,\n    "chaptersCount": 155,\n    "chapters": [\n      {\n        "id": 10811,\n        "name": "Chapter 155",\n        "slug": "chapter-155",\n        "isFree": true,\n        "index": "155.0"\n      }\n    ]\n  }\n}`}
            />
          </section>

          <section className="mb-14">
            <EndpointSection id="chapters-list" method="GET" path="/api/v1/chapters/{slug}" desc="Get all chapters for a series with pagination."
              params={[{ name: 'slug', type: 'string', required: true, def: '—', desc: 'Series slug' }, { name: 'page', type: 'integer', required: false, def: '1', desc: 'Page number' }, { name: 'perPage', type: 'integer', required: false, def: '100', desc: 'Results per page (max 500)' }]}
              curl={`curl "${BASE}/api/v1/chapters/sex-stopwatch"`}
              js={`const res = await fetch('${BASE}/api/v1/chapters/sex-stopwatch');\nconst { data, pagination } = await res.json();\n\nconsole.log(\`\${pagination.total} chapters available\`);\ndata.forEach(ch => {\n  console.log(\`\${ch.name} — Free: \${ch.isFree}\`);\n});`}
              jsonResponse={`{\n  "success": true,\n  "data": [\n    {\n      "id": 10811,\n      "name": "Chapter 155",\n      "slug": "chapter-155",\n      "isFree": true,\n      "createdAt": "2025-08-12T02:07:27.261+00:00"\n    }\n  ],\n  "pagination": { "total": 155, "perPage": 100, "currentPage": 1, "lastPage": 2 }\n}`}
            />
          </section>

          <section className="mb-14">
            <EndpointSection id="chapter-content" method="GET" path="/api/v1/chapter/{slug}/{chapter}" desc="Get chapter content with all page image URLs. Perfect for building reader interfaces."
              params={[{ name: 'slug', type: 'string', required: true, def: '—', desc: 'Series slug' }, { name: 'chapter', type: 'string', required: true, def: '—', desc: 'Chapter slug (e.g. chapter-1)' }]}
              curl={`curl "${BASE}/api/v1/chapter/sex-stopwatch/chapter-1"`}
              js={`const res = await fetch(\n  '${BASE}/api/v1/chapter/sex-stopwatch/chapter-1'\n);\nconst { data } = await res.json();\n\nconsole.log(data.name);       // "Chapter 1"\nconsole.log(data.pageCount);  // 13\ndata.images.forEach((url, i) => {\n  const img = document.createElement('img');\n  img.src = url;\n  document.getElementById('reader').appendChild(img);\n});`}
              jsonResponse={`{\n  "success": true,\n  "data": {\n    "id": 10944,\n    "name": "Chapter 1",\n    "slug": "chapter-1",\n    "pageCount": 13,\n    "images": [\n      "https://media.omegascans.org/.../01.jpg",\n      "https://media.omegascans.org/.../02.jpg"\n    ],\n    "series": { "title": "Sex Stopwatch", "slug": "sex-stopwatch" }\n  }\n}`}
            />
          </section>

          <section className="mb-14">
            <EndpointSection id="search" method="GET" path="/api/v1/search?q={query}" desc="Full-text search across all series by title. Minimum 1 character."
              params={[{ name: 'q', type: 'string', required: true, def: '—', desc: 'Search query' }, { name: 'page', type: 'integer', required: false, def: '1', desc: 'Page number' }]}
              curl={`curl "${BASE}/api/v1/search?q=solo"`}
              js={`const res = await fetch('${BASE}/api/v1/search?q=solo');\nconst { data, pagination } = await res.json();\n\nconsole.log(\`Found \${pagination.total} results\`);\ndata.forEach(s => {\n  console.log(\`\${s.title} (\${s.status}) — ★\${s.rating}\`);\n});`}
              jsonResponse={`{\n  "success": true,\n  "data": [{ "title": "Sex Stopwatch", "slug": "sex-stopwatch", "rating": 4.96 }],\n  "pagination": { "total": 263, "currentPage": 1, "lastPage": 22, "hasNext": true }\n}`}
            />
          </section>

          <section className="mb-14">
            <EndpointSection id="genres" method="GET" path="/api/v1/genres" desc="List all supported genre categories." params={[]}
              curl={`curl "${BASE}/api/v1/genres"`}
              js={`const res = await fetch('${BASE}/api/v1/genres');\nconst { data } = await res.json();\nconsole.log(data.genres); // ["Action", "Adult", ...]`}
              jsonResponse={`{\n  "success": true,\n  "data": { "genres": ["Action", "Adult", "Comedy", "Drama", ...] }\n}`}
            />
          </section>

          <section className="mb-14">
            <EndpointSection id="health" method="GET" path="/api/v1/health" desc="Check API health status, upstream connectivity, and latency." params={[]}
              curl={`curl "${BASE}/api/v1/health"`}
              js={`const res = await fetch('${BASE}/api/v1/health');\nconst { data } = await res.json();\nconsole.log(data.status);            // "ok"\nconsole.log(data.upstream.latencyMs); // 180`}
              jsonResponse={`{\n  "success": true,\n  "data": {\n    "status": "ok",\n    "uptime": 86400,\n    "upstream": { "status": "ok", "latencyMs": 180 }\n  }\n}`}
            />
          </section>

          <section className="mb-14">
            <EndpointSection id="stats" method="GET" path="/api/v1/stats" desc="API statistics including uptime, cache info, and endpoint listing." params={[]}
              curl={`curl "${BASE}/api/v1/stats"`}
              js={`const res = await fetch('${BASE}/api/v1/stats');\nconst { data } = await res.json();\nconsole.log(data.name);     // "OmegaAPI"\nconsole.log(data.version);  // "1.0.0"`}
              jsonResponse={`{\n  "success": true,\n  "data": {\n    "name": "OmegaAPI",\n    "version": "1.0.0",\n    "endpoints": [...],\n    "cache": { "entries": 42 }\n  }\n}`}
            />
          </section>

          <section id="examples" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6 text-[var(--text)]">Code Examples</h2>
            <div className="space-y-6">
              {[
                { title: 'Node.js / Fetch', code: `const response = await fetch('${BASE}/api/v1/search?q=naruto');\nconst { success, data, pagination } = await response.json();\n\nif (success) {\n  console.log(\`Found \${pagination.total} series:\`);\n  data.forEach(series => {\n    console.log(\`  \${series.title} (★\${series.rating})\`);\n  });\n}` },
                { title: 'Python / requests', code: `import requests\n\nresponse = requests.get('${BASE}/api/v1/series/sex-stopwatch')\ndata = response.json()\n\nif data['success']:\n    series = data['data']\n    print(f"{series['title']} — {series['status']}")\n    print(f"Rating: {series['rating']}")\n    print(f"Chapters: {series['chaptersCount']}")` },
                { title: 'cURL / Shell', code: `# Search for series\ncurl -s "${BASE}/api/v1/search?q=solo" | jq '.data[] | .title'\n\n# Get chapter images\ncurl -s "${BASE}/api/v1/chapter/sex-stopwatch/chapter-1" | jq '.data.images[]'\n\n# Check health\ncurl -s "${BASE}/api/v1/health" | jq '.data.status'` },
                { title: 'Build a Reader (Browser)', code: `async function loadChapter(seriesSlug, chapterSlug) {\n  const res = await fetch(\n    \`${BASE}/api/v1/chapter/\${seriesSlug}/\${chapterSlug}\`\n  );\n  const { data } = await res.json();\n\n  const reader = document.getElementById('reader');\n  reader.innerHTML = '';\n\n  data.images.forEach((url, i) => {\n    const img = document.createElement('img');\n    img.src = url;\n    img.alt = \`Page \${i + 1}\`;\n    img.loading = 'lazy';\n    img.style.width = '100%';\n    reader.appendChild(img);\n  });\n}\n\nloadChapter('sex-stopwatch', 'chapter-1');` },
              ].map((ex) => (
                <div key={ex.title}>
                  <h3 className="text-sm font-semibold mb-3 text-[var(--text)]">{ex.title}</h3>
                  <CodeBlock code={ex.code} lang="javascript" />
                </div>
              ))}
            </div>
          </section>

          <div className="flex flex-col sm:flex-row gap-3 pt-8 border-t border-[var(--border-subtle)]">
            <a href="/browse" className="btn-ghost btn-sm text-center inline-flex items-center gap-1">Browse Series <IconChevronRight size={14} /></a>
            <a href="/support" className="btn-ghost btn-sm text-center inline-flex items-center gap-1">Get Support <IconChevronRight size={14} /></a>
          </div>
        </div>
      </div>
    </main>
  );
}
