'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import type { Series, Chapter } from '@/types';
import { IconStar, IconEye, IconBook, IconBookmark, IconChevronRight, IconChevronLeft, IconArrowUp, IconArrowDown, IconExternalLink, IconX, IconMenu } from '@/components/icons';
import { formatViews, formatDate, Spinner } from '@/components/ui';
import { Footer } from '@/components/layout';
const BASE = typeof window !== 'undefined' ? window.location.origin : 'https://omegaapi.vercel.app';

export default function SeriesDetailPage() {
  return (
    <SeriesDetailContent />
  );
}

function SeriesDetailContent() {
  const params = useParams();
  const slug = params?.slug as string;
  const [series, setSeries] = useState<Series | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortAsc, setSortAsc] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    return () => { document.documentElement.removeAttribute('data-theme'); };
  }, []);

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
      <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="w-7 h-7 border-2 border-[#2a2a36] border-t-[#ef4444] rounded-full animate-spin" />
      </main>
    );
  }

  if (error || !series) {
    return (
      <main className="min-h-screen" style={{ background: 'var(--bg)' }}>
        <nav className="nav-frosted sticky top-0 z-50">
          <div className="max-w-container mx-auto px-5 md:px-8 h-16 flex items-center">
            <a href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 flex items-center justify-center font-black text-sm bg-[#fbbf24] text-[#0f172a] border-2 border-[#e4e4e7]">Ω</div>
              <span className="font-display text-lg text-[#e4e4e7]" style={{ textTransform: 'none' }}>OMEGAAPI</span>
            </a>
          </div>
        </nav>
        <div className="max-w-container mx-auto px-5 md:px-8 py-20 text-center">
          <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 text-[#52525b] border-2 border-[#2a2a36]">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M16 16s-1.5-2-4-2-4 2-4 2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
          </div>
          <h1 className="font-display text-2xl text-[#e4e4e7] mb-2" style={{ textTransform: 'none' }}>Series Not Found</h1>
          <p className="text-[#a1a1aa] mb-6">{error || (slug ? `"${slug}" doesn't exist.` : 'Invalid series identifier.')}</p>
          <a href="/browse" className="btn-brutal btn-sm"><IconChevronLeft size={14} /> BACK TO BROWSE</a>
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
    <main className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <nav className="nav-frosted sticky top-0 z-50">
        <div className="max-w-container mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 flex items-center justify-center font-black text-sm bg-[#fbbf24] text-[#0f172a] border-2 border-[#e4e4e7]">Ω</div>
            <span className="font-display text-lg text-[#e4e4e7]" style={{ textTransform: 'none' }}>OMEGAAPI</span>
          </a>
          <div className="flex items-center gap-4">
            <a href="/browse" className="text-xs font-semibold uppercase tracking-widest text-[#a1a1aa] hover:text-[#e4e4e7] transition-colors flex items-center gap-1">
              <IconChevronLeft size={14} /> BROWSE
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <div className="relative overflow-hidden">
        {series.thumbnail && (
          <div className="absolute inset-0 h-[300px] overflow-hidden">
            <img src={series.thumbnail} alt="" className="w-full h-full object-cover opacity-15 blur-2xl scale-110" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <div className="absolute inset-0 bg-gradient-to-b from-[#121218]/60 via-[#121218]/80 to-[#121218]" />
          </div>
        )}
        <div className="max-w-container mx-auto px-5 md:px-8 pt-10 pb-8 relative">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Cover */}
            <div className="w-44 md:w-52 shrink-0 mx-auto md:mx-0">
              <div className="aspect-[3/4] overflow-hidden border border-[#2a2a36] shadow-lg bg-[#1e1e2a]">
                {series.cover ? (
                  <img src={series.cover} alt={series.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#52525b]"><IconBook size={32} /></div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start mb-3">
                <span className={`px-2 py-0.5 text-[0.6rem] font-semibold rounded ${series.status === 'Ongoing' ? 'bg-[#22c55e]/10 text-[#22c55e]' : series.status === 'Completed' ? 'bg-[#3b82f6]/10 text-[#3b82f6]' : 'bg-[#fbbf24]/10 text-[#fbbf24]'}`}>{series.status}</span>
                <span className="px-2 py-0.5 text-[0.6rem] font-semibold rounded bg-[#a855f7]/10 text-[#a855f7]">{series.type}</span>
                {series.badge && <span className="px-2 py-0.5 text-[0.6rem] font-semibold rounded bg-[#ef4444]/10 text-[#ef4444]">{series.badge}</span>}
              </div>
              <h1 className="font-display text-2xl md:text-3xl text-[#e4e4e7] mb-3" style={{ textTransform: 'none' }}>{series.title}</h1>
              {series.alternativeNames && <p className="text-sm text-[#71717a] mb-4">{series.alternativeNames}</p>}

              <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start text-sm text-[#a1a1aa] mb-6">
                <span className="flex items-center gap-1.5 text-[#fbbf24] font-semibold"><IconStar size={15} /> {series.rating.toFixed(1)}</span>
                <span className="flex items-center gap-1.5"><IconEye size={15} /> {formatViews(series.totalViews)} views</span>
                <span className="flex items-center gap-1.5"><IconBook size={15} /> {series.chaptersCount} chapters</span>
                {series.bookmarksCount > 0 && <span className="flex items-center gap-1.5"><IconBookmark size={15} /> {formatViews(series.bookmarksCount)}</span>}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {series.author && (
                  <div className="bg-[#16161e] border border-[#2a2a36] px-4 py-3">
                    <div className="text-[0.55rem] text-[#52525b] uppercase tracking-wider mb-1">Author</div>
                    <div className="text-sm font-medium text-[#e4e4e7]">{series.author}</div>
                  </div>
                )}
                {series.studio && (
                  <div className="bg-[#16161e] border border-[#2a2a36] px-4 py-3">
                    <div className="text-[0.55rem] text-[#52525b] uppercase tracking-wider mb-1">Studio</div>
                    <div className="text-sm font-medium text-[#e4e4e7]">{series.studio}</div>
                  </div>
                )}
                {series.releaseYear && (
                  <div className="bg-[#16161e] border border-[#2a2a36] px-4 py-3">
                    <div className="text-[0.55rem] text-[#52525b] uppercase tracking-wider mb-1">Year</div>
                    <div className="text-sm font-medium text-[#e4e4e7]">{series.releaseYear}</div>
                  </div>
                )}
                {series.releaseSchedule.length > 0 && (
                  <div className="bg-[#16161e] border border-[#2a2a36] px-4 py-3">
                    <div className="text-[0.55rem] text-[#52525b] uppercase tracking-wider mb-1">Schedule</div>
                    <div className="text-sm font-medium text-[#e4e4e7]">{series.releaseSchedule.join(', ')}</div>
                  </div>
                )}
                <div className="bg-[#16161e] border border-[#2a2a36] px-4 py-3">
                  <div className="text-[0.55rem] text-[#52525b] uppercase tracking-wider mb-1">Type</div>
                  <div className="text-sm font-medium text-[#e4e4e7]">{series.type}</div>
                </div>
                <div className="bg-[#16161e] border border-[#2a2a36] px-4 py-3">
                  <div className="text-[0.55rem] text-[#52525b] uppercase tracking-wider mb-1">ID</div>
                  <div className="text-sm font-medium font-mono text-[#e4e4e7]">{series.id}</div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xs font-display tracking-widest text-[#71717a] mb-2">SYNOPSIS</h3>
                <p className="text-sm text-[#a1a1aa] leading-relaxed">{series.description || 'No description available.'}</p>
              </div>

              {series.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {series.tags.map((tag: string) => <span key={tag} className="genre-pill text-[0.6rem]">{tag}</span>)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chapters */}
      <div className="max-w-container mx-auto px-5 md:px-8 pb-16">
        <div className="card-brutal" style={{ background: '#16161e', borderColor: '#2a2a36' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-display flex items-center gap-2 text-[#e4e4e7]" style={{ textTransform: 'none' }}>
              <IconBook size={18} /> Chapters
              <span className="text-xs font-normal text-[#71717a]">({chapters.length})</span>
            </h2>
            {chapters.length > 1 && (
              <button onClick={() => setSortAsc(!sortAsc)} className="text-xs text-[#71717a] hover:text-[#fbbf24] transition-colors flex items-center gap-1 font-medium">
                {sortAsc ? <><IconArrowUp size={12} /> Oldest first</> : <><IconArrowDown size={12} /> Newest first</>}
              </button>
            )}
          </div>
          {chapters.length === 0 ? (
            <div className="text-center py-10 text-[#71717a]">No chapters available</div>
          ) : (
            <>
              <div className="space-y-1">
                {displayedChapters.map((ch: Chapter) => (
                  <a key={ch.id} href={`/browse/${slug}/${ch.slug}`} className="flex items-center gap-4 px-4 py-3 hover:bg-[#1e1e2a] border border-transparent hover:border-[#2a2a36] transition-all group">
                    <div className="w-10 h-10 overflow-hidden bg-[#1e1e2a] shrink-0">
                      {ch.thumbnail ? (
                        <img src={ch.thumbnail} alt="" className="w-full h-full object-cover" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#52525b]"><IconBook size={16} /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm group-hover:text-[#fbbf24] transition-colors truncate text-[#e4e4e7]">{ch.name}</span>
                        {ch.title && <span className="text-xs text-[#52525b] truncate">— {ch.title}</span>}
                      </div>
                      <span className="text-xs text-[#71717a]">{formatDate(ch.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {ch.isFree ? <span className="text-[0.55rem] px-1.5 py-0.5 rounded bg-[#22c55e]/10 text-[#22c55e] font-semibold">Free</span> : <span className="text-[0.55rem] px-1.5 py-0.5 rounded bg-[#fbbf24]/10 text-[#fbbf24] font-semibold">{ch.price} coins</span>}
                      <IconChevronRight size={16} />
                    </div>
                  </a>
                ))}
              </div>
              {!showAll && chapters.length > 50 && (
                <div className="text-center mt-4">
                  <button onClick={() => setShowAll(true)} className="btn-brutal-outline btn-sm text-xs" style={{ borderColor: '#e4e4e7', color: '#e4e4e7', boxShadow: '3px 3px 0 0 #e4e4e7' }}>SHOW ALL {chapters.length} CHAPTERS</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer theme="dark" />
    </main>
  );
}
