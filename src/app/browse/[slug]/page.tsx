'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import type { Series, Chapter } from '@/types';
import { IconStar, IconEye, IconBook, IconBookmark, IconChevronRight, IconChevronLeft, IconArrowUp, IconArrowDown, IconExternalLink } from '@/components/icons';
import { formatViews, formatDate, Spinner } from '@/components/ui';

const BASE = typeof window !== 'undefined' ? window.location.origin : 'https://omegaapi.vercel.app';

export default function SeriesDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [series, setSeries] = useState<Series | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortAsc, setSortAsc] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError('');
    fetch(`${BASE}/api/v1/series/${slug}?include=chapters`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) {
          const s = data.data;
          setSeries({
            ...s,
            description: s.description || '',
            thumbnail: s.thumbnail || '',
            cover: s.cover || s.thumbnail || '',
            alternativeNames: s.alternativeNames || '',
            author: s.author || '',
            studio: s.studio || '',
            releaseYear: s.releaseYear || '',
            releaseSchedule: Array.isArray(s.releaseSchedule) ? s.releaseSchedule : [],
            tags: Array.isArray(s.tags) ? s.tags : [],
            chapters: Array.isArray(s.chapters) ? s.chapters : [],
            chaptersCount: s.chaptersCount || 0,
            bookmarksCount: s.bookmarksCount || 0,
            rating: s.rating || 0,
            totalViews: s.totalViews || 0,
            badge: s.badge || null,
            status: s.status || 'Unknown',
            type: s.type || 'Unknown',
          });
        } else {
          setError(data.error || 'Series not found');
        }
      })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="w-7 h-7 border-2 border-[var(--border)] border-t-[var(--accent)] rounded-full animate-spin" />
      </main>
    );
  }

  if (error || !series) {
    return (
      <main className="min-h-screen bg-[var(--bg)]">
        <nav className="glass-nav sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-5 md:px-8 h-16 flex items-center">
            <a href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6355e3] to-[#8b5cf6] flex items-center justify-center text-white font-black text-sm shadow-sm">Ω</div>
              <span className="font-bold text-lg tracking-tight text-[var(--text)]">OmegaAPI</span>
            </a>
          </div>
        </nav>
        <div className="max-w-5xl mx-auto px-5 md:px-8 py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--bg-muted)] flex items-center justify-center mx-auto mb-4 text-[var(--text-muted)]">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M16 16s-1.5-2-4-2-4 2-4 2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
          </div>
          <h1 className="text-2xl font-bold mb-2 text-[var(--text)]">Series Not Found</h1>
          <p className="text-[var(--text-secondary)] mb-6">{error || (slug ? `"${slug}" doesn't exist.` : 'Invalid series identifier.')}</p>
          <a href="/browse" className="btn-primary btn-sm"><IconChevronLeft size={14} /> Back to Browse</a>
        </div>
      </main>
    );
  }

  const chapters = [...(series.chapters || [])].sort((a: Chapter, b: Chapter) => {
    const ia = parseFloat(a.index) || 0;
    const ib = parseFloat(b.index) || 0;
    return sortAsc ? ia - ib : ib - ia;
  });
  const displayedChapters = showAll ? chapters : chapters.slice(0, 50);

  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <nav className="glass-nav sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6355e3] to-[#8b5cf6] flex items-center justify-center text-white font-black text-sm shadow-sm">Ω</div>
            <span className="font-bold text-lg tracking-tight text-[var(--text)]">OmegaAPI</span>
          </a>
          <div className="flex items-center gap-4">
            <a href="/browse" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors flex items-center gap-1 font-medium"><IconChevronLeft size={14} /> Browse</a>
            <a href={`/api/v1/series/${slug}?include=chapters`} target="_blank" className="text-sm text-[var(--accent)] hover:underline flex items-center gap-1 font-medium">View JSON <IconExternalLink size={12} /></a>
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <div className="relative overflow-hidden">
        {series.thumbnail && (
          <div className="absolute inset-0 h-[300px] overflow-hidden">
            <img src={series.thumbnail} alt="" className="w-full h-full object-cover opacity-10 blur-2xl scale-110" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/80 to-[var(--bg)]" />
          </div>
        )}
        <div className="max-w-5xl mx-auto px-5 md:px-8 pt-10 pb-8 relative">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Cover */}
            <div className="w-44 md:w-52 shrink-0 mx-auto md:mx-0">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-[var(--border)] shadow-lg bg-[var(--bg-muted)]">
                {series.cover ? (
                  <img src={series.cover} alt={series.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]"><IconBook size={32} /></div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start mb-3">
                <span className={`tag text-[0.6rem] ${series.status === 'Ongoing' ? 'tag-green' : series.status === 'Completed' ? 'tag-cyan' : 'tag-amber'}`}>{series.status}</span>
                <span className="tag tag-purple text-[0.6rem]">{series.type}</span>
                {series.badge && <span className="tag tag-rose text-[0.6rem]">{series.badge}</span>}
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-3 text-[var(--text)]">{series.title}</h1>
              {series.alternativeNames && <p className="text-sm text-[var(--text-muted)] mb-4">{series.alternativeNames}</p>}

              <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start text-sm text-[var(--text-secondary)] mb-6">
                <span className="flex items-center gap-1.5 text-[var(--amber)] font-semibold"><IconStar size={15} /> {series.rating.toFixed(1)}</span>
                <span className="flex items-center gap-1.5"><IconEye size={15} /> {formatViews(series.totalViews)} views</span>
                <span className="flex items-center gap-1.5"><IconBook size={15} /> {series.chaptersCount} chapters</span>
                {series.bookmarksCount > 0 && <span className="flex items-center gap-1.5"><IconBookmark size={15} /> {formatViews(series.bookmarksCount)}</span>}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {series.author && (
                  <div className="bg-[var(--bg-subtle)] border border-[var(--border)] rounded-xl px-4 py-3">
                    <div className="text-[0.6rem] text-[var(--text-muted)] uppercase tracking-wider mb-1">Author</div>
                    <div className="text-sm font-medium text-[var(--text)]">{series.author}</div>
                  </div>
                )}
                {series.studio && (
                  <div className="bg-[var(--bg-subtle)] border border-[var(--border)] rounded-xl px-4 py-3">
                    <div className="text-[0.6rem] text-[var(--text-muted)] uppercase tracking-wider mb-1">Studio</div>
                    <div className="text-sm font-medium text-[var(--text)]">{series.studio}</div>
                  </div>
                )}
                {series.releaseYear && (
                  <div className="bg-[var(--bg-subtle)] border border-[var(--border)] rounded-xl px-4 py-3">
                    <div className="text-[0.6rem] text-[var(--text-muted)] uppercase tracking-wider mb-1">Year</div>
                    <div className="text-sm font-medium text-[var(--text)]">{series.releaseYear}</div>
                  </div>
                )}
                {series.releaseSchedule.length > 0 && (
                  <div className="bg-[var(--bg-subtle)] border border-[var(--border)] rounded-xl px-4 py-3">
                    <div className="text-[0.6rem] text-[var(--text-muted)] uppercase tracking-wider mb-1">Schedule</div>
                    <div className="text-sm font-medium text-[var(--text)]">{series.releaseSchedule.join(', ')}</div>
                  </div>
                )}
                <div className="bg-[var(--bg-subtle)] border border-[var(--border)] rounded-xl px-4 py-3">
                  <div className="text-[0.6rem] text-[var(--text-muted)] uppercase tracking-wider mb-1">Type</div>
                  <div className="text-sm font-medium text-[var(--text)]">{series.type}</div>
                </div>
                <div className="bg-[var(--bg-subtle)] border border-[var(--border)] rounded-xl px-4 py-3">
                  <div className="text-[0.6rem] text-[var(--text-muted)] uppercase tracking-wider mb-1">ID</div>
                  <div className="text-sm font-medium font-mono text-[var(--text)]">{series.id}</div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">Synopsis</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{series.description || 'No description available.'}</p>
              </div>

              {series.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {series.tags.map((tag: string) => <span key={tag} className="tag tag-purple text-[0.55rem]">{tag}</span>)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chapters */}
      <div className="max-w-5xl mx-auto px-5 md:px-8 pb-16">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold flex items-center gap-2 text-[var(--text)]">
              <IconBook size={18} /> Chapters
              <span className="text-xs font-normal text-[var(--text-muted)]">({chapters.length})</span>
            </h2>
            {chapters.length > 1 && (
              <button onClick={() => setSortAsc(!sortAsc)} className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors flex items-center gap-1 font-medium">
                {sortAsc ? <><IconArrowUp size={12} /> Oldest first</> : <><IconArrowDown size={12} /> Newest first</>}
              </button>
            )}
          </div>
          {chapters.length === 0 ? (
            <div className="text-center py-10 text-[var(--text-muted)]">No chapters available</div>
          ) : (
            <>
              <div className="space-y-1">
                {displayedChapters.map((ch: Chapter) => (
                  <a key={ch.id} href={`/browse/${slug}/${ch.slug}`} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[var(--bg-subtle)] border border-transparent hover:border-[var(--border)] transition-all group">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-[var(--bg-muted)] shrink-0">
                      {ch.thumbnail ? (
                        <img src={ch.thumbnail} alt="" className="w-full h-full object-cover" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]"><IconBook size={16} /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm group-hover:text-[var(--accent)] transition-colors truncate text-[var(--text)]">{ch.name}</span>
                        {ch.title && <span className="text-xs text-[var(--text-muted)] truncate">— {ch.title}</span>}
                      </div>
                      <span className="text-xs text-[var(--text-muted)]">{formatDate(ch.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {ch.isFree ? <span className="tag tag-green text-[0.5rem]">Free</span> : <span className="tag tag-amber text-[0.5rem]">{ch.price} coins</span>}
                      <IconChevronRight size={16} />
                    </div>
                  </a>
                ))}
              </div>
              {!showAll && chapters.length > 50 && (
                <div className="text-center mt-4">
                  <button onClick={() => setShowAll(true)} className="btn-ghost btn-sm text-xs">Show all {chapters.length} chapters</button>
                </div>
              )}
            </>
          )}
        </div>
        <div className="mt-6 text-center">
          <a href={`/api/v1/series/${slug}?include=chapters`} target="_blank" className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors flex items-center gap-1 justify-center font-medium">
            View as JSON <IconExternalLink size={10} />
          </a>
        </div>
      </div>
    </main>
  );
}
