'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import type { Series, Chapter } from '@/types';
import { IconStar, IconEye, IconBook, IconBookmark, IconChevronRight, IconChevronLeft, IconArrowUp, IconArrowDown, IconExternalLink } from '@/components/icons';
import { formatViews, formatDate } from '@/components/ui';

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
          // Defensive normalization — ensure all fields have safe defaults
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
      <main className="min-h-screen bg-[#06060e] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#7c3aed]/20 border-t-[#7c3aed] rounded-full animate-spin" />
      </main>
    );
  }

  if (error || !series) {
    return (
      <main className="min-h-screen bg-[#06060e]">
        <nav className="glass sticky top-0 z-50 border-b border-[#1e1e3a]/40">
          <div className="max-w-5xl mx-auto px-5 md:px-8 h-16 flex items-center">
            <a href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] flex items-center justify-center text-white font-black text-sm">Ω</div>
              <span className="font-bold text-lg tracking-tight">OmegaAPI</span>
            </a>
          </div>
        </nav>
        <div className="max-w-5xl mx-auto px-5 md:px-8 py-20 text-center">
          <div className="flex justify-center mb-4 text-[#5c5a70]">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M16 16s-1.5-2-4-2-4 2-4 2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Series Not Found</h1>
          <p className="text-[#8b89a0] mb-6">{error || (slug ? `"${slug}" doesn't exist.` : 'Invalid series identifier.')}</p>
          <a href="/browse" className="btn-primary text-sm"><IconChevronLeft size={14} /> Back to Browse</a>
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
    <main className="min-h-screen bg-[#06060e]">
      <nav className="glass sticky top-0 z-50 border-b border-[#1e1e3a]/40">
        <div className="max-w-5xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] flex items-center justify-center text-white font-black text-sm">Ω</div>
            <span className="font-bold text-lg tracking-tight">OmegaAPI</span>
          </a>
          <div className="flex items-center gap-4">
            <a href="/browse" className="text-sm text-[#8b89a0] hover:text-[#e8e6f0] transition-colors flex items-center gap-1"><IconChevronLeft size={14} /> Browse</a>
            <a href={`/api/v1/series/${slug}?include=chapters`} target="_blank" className="text-sm text-[#a78bfa] hover:underline flex items-center gap-1">
              View JSON <IconExternalLink size={12} />
            </a>
          </div>
        </div>
      </nav>

      <div className="relative">
        {series.thumbnail && (
          <div className="absolute inset-0 h-[400px] overflow-hidden">
            <img src={series.thumbnail} alt="" className="w-full h-full object-cover opacity-15 blur-xl scale-110" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#06060e]/80 to-[#06060e]" />
          </div>
        )}
        <div className="max-w-5xl mx-auto px-5 md:px-8 pt-12 pb-8 relative">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-48 md:w-56 shrink-0 mx-auto md:mx-0">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-[#1e1e3a] shadow-2xl shadow-black/50 bg-[#0d0d1a]">
                {series.cover ? (
                  <img src={series.cover} alt={series.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#5c5a70]"><IconBook size={32} /></div>
                )}
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start mb-3">
                <span className={`tag text-[0.6rem] ${series.status === 'Ongoing' ? 'tag-green' : series.status === 'Completed' ? 'tag-cyan' : 'tag-amber'}`}>{series.status}</span>
                <span className="tag tag-purple text-[0.6rem]">{series.type}</span>
                {series.badge && <span className="tag tag-rose text-[0.6rem]">{series.badge}</span>}
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-3">{series.title}</h1>
              {series.alternativeNames && <p className="text-sm text-[#5c5a70] mb-4">{series.alternativeNames}</p>}
              <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start text-sm text-[#8b89a0] mb-6">
                <span className="flex items-center gap-1.5 text-[#fbbf24]"><IconStar /> {series.rating.toFixed(1)}</span>
                <span className="flex items-center gap-1.5"><IconEye /> {formatViews(series.totalViews)} views</span>
                <span className="flex items-center gap-1.5"><IconBook /> {series.chaptersCount} chapters</span>
                {series.bookmarksCount > 0 && <span className="flex items-center gap-1.5"><IconBookmark /> {formatViews(series.bookmarksCount)}</span>}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {series.author && (
                  <div className="bg-white/[0.02] border border-[#1e1e3a]/50 rounded-xl px-4 py-3">
                    <div className="text-[0.6rem] text-[#5c5a70] uppercase tracking-wider mb-1">Author</div>
                    <div className="text-sm font-medium">{series.author}</div>
                  </div>
                )}
                {series.studio && (
                  <div className="bg-white/[0.02] border border-[#1e1e3a]/50 rounded-xl px-4 py-3">
                    <div className="text-[0.6rem] text-[#5c5a70] uppercase tracking-wider mb-1">Studio</div>
                    <div className="text-sm font-medium">{series.studio}</div>
                  </div>
                )}
                {series.releaseYear && (
                  <div className="bg-white/[0.02] border border-[#1e1e3a]/50 rounded-xl px-4 py-3">
                    <div className="text-[0.6rem] text-[#5c5a70] uppercase tracking-wider mb-1">Year</div>
                    <div className="text-sm font-medium">{series.releaseYear}</div>
                  </div>
                )}
                {series.releaseSchedule.length > 0 && (
                  <div className="bg-white/[0.02] border border-[#1e1e3a]/50 rounded-xl px-4 py-3">
                    <div className="text-[0.6rem] text-[#5c5a70] uppercase tracking-wider mb-1">Schedule</div>
                    <div className="text-sm font-medium">{series.releaseSchedule.join(', ')}</div>
                  </div>
                )}
                <div className="bg-white/[0.02] border border-[#1e1e3a]/50 rounded-xl px-4 py-3">
                  <div className="text-[0.6rem] text-[#5c5a70] uppercase tracking-wider mb-1">Type</div>
                  <div className="text-sm font-medium">{series.type}</div>
                </div>
                <div className="bg-white/[0.02] border border-[#1e1e3a]/50 rounded-xl px-4 py-3">
                  <div className="text-[0.6rem] text-[#5c5a70] uppercase tracking-wider mb-1">ID</div>
                  <div className="text-sm font-medium font-mono">{series.id}</div>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#5c5a70] mb-2">Synopsis</h3>
                <p className="text-sm text-[#8b89a0] leading-relaxed">{series.description || 'No description available.'}</p>
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

      <div className="max-w-5xl mx-auto px-5 md:px-8 pb-16">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <IconBook size={18} /> Chapters
              <span className="text-xs font-normal text-[#5c5a70]">({chapters.length})</span>
            </h2>
            {chapters.length > 1 && (
              <button
                onClick={() => setSortAsc(!sortAsc)}
                className="text-xs text-[#8b89a0] hover:text-[#a78bfa] transition-colors flex items-center gap-1"
              >
                {sortAsc ? <><IconArrowUp size={12} /> Oldest first</> : <><IconArrowDown size={12} /> Newest first</>}
              </button>
            )}
          </div>
          {chapters.length === 0 ? (
            <div className="text-center py-10 text-[#5c5a70]">No chapters available</div>
          ) : (
            <>
              <div className="space-y-1">
                {displayedChapters.map((ch: Chapter) => (
                  <a
                    key={ch.id}
                    href={`/browse/${slug}/${ch.slug}`}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/[0.03] border border-transparent hover:border-[#1e1e3a] transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#0d0d1a] shrink-0">
                      {ch.thumbnail ? (
                        <img src={ch.thumbnail} alt="" className="w-full h-full object-cover" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#5c5a70]"><IconBook size={16} /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm group-hover:text-[#a78bfa] transition-colors truncate">{ch.name}</span>
                        {ch.title && <span className="text-xs text-[#5c5a70] truncate">— {ch.title}</span>}
                      </div>
                      <span className="text-xs text-[#5c5a70]">{formatDate(ch.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {ch.isFree ? (
                        <span className="tag tag-green text-[0.5rem]">Free</span>
                      ) : (
                        <span className="tag tag-amber text-[0.5rem]">{ch.price} coins</span>
                      )}
                      <IconChevronRight size={16} />
                    </div>
                  </a>
                ))}
              </div>
              {!showAll && chapters.length > 50 && (
                <div className="text-center mt-4">
                  <button onClick={() => setShowAll(true)} className="btn-ghost text-xs">Show all {chapters.length} chapters</button>
                </div>
              )}
            </>
          )}
        </div>
        <div className="mt-6 text-center">
          <a href={`/api/v1/series/${slug}?include=chapters`} target="_blank" className="text-xs text-[#5c5a70] hover:text-[#a78bfa] transition-colors flex items-center gap-1 justify-center">
            View as JSON <IconExternalLink size={10} />
          </a>
        </div>
      </div>
    </main>
  );
}
