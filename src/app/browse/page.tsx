'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Series, Pagination } from '@/types';
import { IconStar, IconEye, IconBook, IconSearch, IconGrid, IconList, IconChevronRight, IconInbox, IconAlertTriangle } from '@/components/icons';
import { formatViews } from '@/components/ui';

const BASE = typeof window !== 'undefined' ? window.location.origin : 'https://omegaapi.vercel.app';

function SeriesCard({ series }: { series: Series }) {
  return (
    <a href={`/browse/${series.slug}`} className="glass-card rounded-2xl overflow-hidden group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#0d0d1a]">
        <img
          src={series.thumbnail}
          alt={series.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06060e] via-transparent to-transparent opacity-60" />
        {series.badge && <span className="absolute top-3 left-3 tag tag-rose text-[0.55rem]">{series.badge}</span>}
        <span className={`absolute top-3 right-3 tag text-[0.55rem] ${series.status === 'Ongoing' ? 'tag-green' : series.status === 'Completed' ? 'tag-cyan' : 'tag-amber'}`}>{series.status}</span>
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-2 text-xs text-white/80">
            <span className="flex items-center gap-1"><IconStar /> {series.rating.toFixed(1)}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><IconBook /> {series.chaptersCount} ch</span>
            <span>·</span>
            <span className="flex items-center gap-1"><IconEye /> {formatViews(series.totalViews)}</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-sm leading-tight mb-1 line-clamp-2 group-hover:text-[#a78bfa] transition-colors">{series.title}</h3>
        <p className="text-xs text-[#5c5a70] line-clamp-2 leading-relaxed">{series.description.slice(0, 100)}{series.description.length > 100 ? '...' : ''}</p>
        {series.releaseSchedule.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {series.releaseSchedule.map((d) => (
              <span key={d} className="text-[0.55rem] bg-white/[0.03] border border-[#1e1e3a] rounded px-1.5 py-0.5 text-[#5c5a70]">{d}</span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}

function PaginationNav({ pagination, onPage }: { pagination: Pagination; onPage: (p: number) => void }) {
  const pages: (number | '...')[] = [];
  const { currentPage, lastPage } = pagination;

  if (lastPage <= 7) {
    for (let i = 1; i <= lastPage; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(lastPage - 1, currentPage + 1); i++) pages.push(i);
    if (currentPage < lastPage - 2) pages.push('...');
    pages.push(lastPage);
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button onClick={() => onPage(currentPage - 1)} disabled={!pagination.hasPrevious} className="px-3 py-2 text-xs rounded-lg bg-white/[0.03] border border-[#1e1e3a] text-[#8b89a0] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#7c3aed]/30 transition-colors">Prev</button>
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`e${i}`} className="px-2 text-xs text-[#5c5a70]">...</span>
        ) : (
          <button key={p} onClick={() => onPage(p as number)} className={`w-9 h-9 text-xs rounded-lg font-medium transition-all ${p === currentPage ? 'bg-[#7c3aed]/15 text-[#a78bfa] border border-[#7c3aed]/25' : 'bg-white/[0.02] border border-[#1e1e3a] text-[#5c5a70] hover:border-[#7c3aed]/20 hover:text-[#8b89a0]'}`}>{p}</button>
        )
      )}
      <button onClick={() => onPage(currentPage + 1)} disabled={!pagination.hasNext} className="px-3 py-2 text-xs rounded-lg bg-white/[0.03] border border-[#1e1e3a] text-[#8b89a0] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#7c3aed]/30 transition-colors">Next</button>
    </div>
  );
}

export default function BrowsePage() {
  const [series, setSeries] = useState<Series[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const fetchData = useCallback(async (q: string, p: number) => {
    setLoading(true);
    setError('');
    try {
      const url = q
        ? `${BASE}/api/v1/search?q=${encodeURIComponent(q)}&page=${p}`
        : `${BASE}/api/v1/series?page=${p}&perPage=24`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setSeries(data.data || []);
        setPagination(data.pagination || null);
      } else {
        setError(data.error || 'Failed to load series');
      }
    } catch {
      setError('Network error — API may be down');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(query, page); }, [query, page, fetchData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-[#06060e]">
      <nav className="glass sticky top-0 z-50 border-b border-[#1e1e3a]/40">
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] flex items-center justify-center text-white font-black text-sm">Ω</div>
            <span className="font-bold text-lg tracking-tight">OmegaAPI</span>
            <span className="tag tag-cyan ml-1 hidden sm:inline-flex">Browse</span>
          </a>
          <div className="hidden md:flex items-center gap-6">
            <a href="/" className="text-sm text-[#8b89a0] hover:text-[#e8e6f0] transition-colors">Home</a>
            <a href="/docs" className="text-sm text-[#8b89a0] hover:text-[#e8e6f0] transition-colors">Docs</a>
            <a href="/support" className="text-sm text-[#8b89a0] hover:text-[#e8e6f0] transition-colors">Support</a>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Browse Series</h1>
          <p className="text-[#8b89a0]">Explore manga and manhwa from OmegaScans. {pagination && `${pagination.total.toLocaleString()} series available.`}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5c5a70]"><IconSearch /></div>
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search series by title..." className="w-full bg-[#0d0d1a] border border-[#1e1e3a] rounded-xl pl-11 pr-4 py-3 text-sm text-[#e8e6f0] placeholder:text-[#5c5a70] focus:outline-none focus:border-[#7c3aed]/50 transition-colors" />
            </div>
            <button type="submit" className="btn-primary text-sm px-5">Search</button>
          </form>
          <div className="flex gap-1 bg-[#0d0d1a] border border-[#1e1e3a] rounded-xl p-1">
            <button onClick={() => setViewMode('grid')} className={`px-3 py-2 rounded-lg text-xs transition-all ${viewMode === 'grid' ? 'bg-[#7c3aed]/15 text-[#a78bfa]' : 'text-[#5c5a70]'}`}><IconGrid /></button>
            <button onClick={() => setViewMode('list')} className={`px-3 py-2 rounded-lg text-xs transition-all ${viewMode === 'list' ? 'bg-[#7c3aed]/15 text-[#a78bfa]' : 'text-[#5c5a70]'}`}><IconList /></button>
          </div>
        </div>

        {pagination && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs text-[#5c5a70]">{query ? `Results for "${query}"` : 'All series'} — Page {pagination.currentPage} of {pagination.lastPage}</p>
            <p className="text-xs text-[#5c5a70]">{pagination.total.toLocaleString()} total</p>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#7c3aed]/20 border-t-[#7c3aed] rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="glass-card rounded-2xl p-8 text-center">
            <div className="flex justify-center mb-3 text-[#f43f5e]"><IconAlertTriangle /></div>
            <h3 className="font-semibold mb-2">Failed to load</h3>
            <p className="text-sm text-[#8b89a0] mb-4">{error}</p>
            <button onClick={() => fetchData(query, page)} className="btn-primary text-sm">Retry</button>
          </div>
        )}

        {!loading && !error && viewMode === 'grid' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {series.map((s) => <SeriesCard key={s.id} series={s} />)}
          </div>
        )}

        {!loading && !error && viewMode === 'list' && (
          <div className="space-y-2">
            {series.map((s) => (
              <a key={s.id} href={`/browse/${s.slug}`} className="glass-card rounded-xl p-4 flex gap-4 group hover:border-[#7c3aed]/30 transition-all">
                <div className="w-16 h-20 rounded-lg overflow-hidden bg-[#0d0d1a] shrink-0">
                  <img src={s.thumbnail} alt={s.title} className="w-full h-full object-cover" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm truncate group-hover:text-[#a78bfa] transition-colors">{s.title}</h3>
                    {s.badge && <span className="tag tag-rose text-[0.5rem]">{s.badge}</span>}
                  </div>
                  <p className="text-xs text-[#5c5a70] line-clamp-1 mb-2">{s.description.slice(0, 120)}</p>
                  <div className="flex items-center gap-3 text-xs text-[#5c5a70]">
                    <span className={`tag text-[0.5rem] ${s.status === 'Ongoing' ? 'tag-green' : 'tag-cyan'}`}>{s.status}</span>
                    <span className="flex items-center gap-1"><IconStar /> {s.rating.toFixed(1)}</span>
                    <span className="flex items-center gap-1"><IconBook /> {s.chaptersCount} ch</span>
                    <span className="flex items-center gap-1"><IconEye /> {formatViews(s.totalViews)}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {!loading && !error && series.length === 0 && (
          <div className="glass-card rounded-2xl p-12 text-center">
            <div className="flex justify-center mb-4 text-[#5c5a70]"><IconInbox /></div>
            <h3 className="text-lg font-semibold mb-2">No series found</h3>
            <p className="text-sm text-[#8b89a0]">{query ? `No results for "${query}". Try a different search.` : 'No series available.'}</p>
          </div>
        )}

        {pagination && pagination.lastPage > 1 && <PaginationNav pagination={pagination} onPage={setPage} />}
        <div className="h-16" />
      </div>
    </main>
  );
}
