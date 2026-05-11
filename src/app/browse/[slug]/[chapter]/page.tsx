'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import type { ChapterData, Chapter } from '@/types';
import { IconChevronLeft, IconChevronRight, IconColumns, IconFile, IconHome, IconBook } from '@/components/icons';
import { saveHistory, saveReadingPosition, getReadingPosition } from '@/lib/storage';

const BASE = typeof window !== 'undefined' ? window.location.origin : 'https://omegaapi.vercel.app';

export default function ChapterReaderPage() {
  const params = useParams();
  const seriesSlug = params?.slug as string;
  const chapterSlug = params?.chapter as string;
  const [chapter, setChapter] = useState<ChapterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [readingMode, setReadingMode] = useState<'vertical' | 'paged'>('vertical');
  const [currentPage, setCurrentPage] = useState(0);
  const [showNav, setShowNav] = useState(true);

  /* Chapter navigation */
  const [allChapters, setAllChapters] = useState<Chapter[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    return () => { document.documentElement.removeAttribute('data-theme'); };
  }, []);

  /* Fetch chapter content */
  useEffect(() => {
    if (!seriesSlug || !chapterSlug) return;
    setLoading(true);
    fetch(`${BASE}/api/v1/chapter/${seriesSlug}/${chapterSlug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) {
          const ch = data.data;
          setChapter({
            ...ch,
            images: Array.isArray(ch.images) ? ch.images : [],
            pageCount: ch.pageCount || 0,
            series: ch.series || { id: 0, title: '', slug: '', thumbnail: '', status: '', description: '' },
          });
          setCurrentPage(0);

          /* Save reading history */
          if (ch.series) {
            // Extract chapter index from name (e.g., "Chapter 45" → 45)
            const match = ch.name?.match(/(\d+)/);
            const chapterIndex = match ? parseInt(match[1], 10) : 0;
            saveHistory({
              slug: seriesSlug,
              title: ch.series.title || '',
              thumbnail: ch.series.thumbnail || '',
              chapterSlug: chapterSlug,
              chapterName: ch.name || '',
              chapterIndex,
              totalChapters: 0, // Will be updated when chapter list loads
              timestamp: Date.now(),
            });
          }
        } else {
          setError(data.error || 'Chapter not found');
        }
      })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false));
  }, [seriesSlug, chapterSlug]);

  /* Fetch chapter list for prev/next navigation */
  useEffect(() => {
    if (!seriesSlug) return;
    fetch(`${BASE}/api/v1/chapters/${seriesSlug}?perPage=500`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          const sorted = data.data.sort((a: Chapter, b: Chapter) => {
            const ia = parseFloat(a.index) || 0;
            const ib = parseFloat(b.index) || 0;
            return ib - ia; // newest first (chapter 155 → 1)
          });
          setAllChapters(sorted);
          const idx = sorted.findIndex((c: Chapter) => c.slug === chapterSlug);
          setCurrentIndex(idx);

          /* Update history with total chapters count */
          if (sorted.length > 0) {
            const current = sorted[idx];
            if (current) {
              const match = current.name?.match(/(\d+)/);
              const chapterIndex = match ? parseInt(match[1], 10) : 0;
              saveHistory({
                slug: seriesSlug,
                title: chapter?.series?.title || '',
                thumbnail: chapter?.series?.thumbnail || '',
                chapterSlug: chapterSlug,
                chapterName: current.name || '',
                chapterIndex,
                totalChapters: sorted.length,
                timestamp: Date.now(),
              });
            }
          }
        }
      })
      .catch(() => {});
  }, [seriesSlug, chapterSlug]);

  /* Keyboard navigation */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (readingMode === 'paged') {
        if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); setCurrentPage((p) => Math.min(p + 1, (chapter?.pageCount || 1) - 1)); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); setCurrentPage((p) => Math.max(p - 1, 0)); }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [readingMode, chapter]);

  /* Restore scroll position for vertical reader */
  useEffect(() => {
    if (readingMode !== 'vertical' || loading) return;
    const saved = getReadingPosition(seriesSlug, chapterSlug);
    if (saved > 0) {
      setTimeout(() => window.scrollTo(0, saved), 100);
    }
  }, [loading, readingMode]);

  /* Save scroll position on scroll (debounced) */
  useEffect(() => {
    if (readingMode !== 'vertical') return;
    let timer: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        saveReadingPosition(seriesSlug, chapterSlug, window.scrollY);
      }, 500);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [readingMode, seriesSlug, chapterSlug]);

  const prevChapter = currentIndex >= 0 && currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;
  const nextChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;

  const navigateChapter = useCallback((slug: string) => {
    window.location.href = `/browse/${seriesSlug}/${slug}`;
  }, [seriesSlug]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: '#0c0c12' }}>
        <div className="w-7 h-7 border-2 border-[#2a2a36] border-t-[#ef4444] rounded-full animate-spin" />
      </main>
    );
  }

  if (error || !chapter) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: '#0c0c12' }}>
        <div className="text-center">
          <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 text-[#52525b] border-2 border-[#2a2a36]">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M16 16s-1.5-2-4-2-4 2-4 2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
          </div>
          <h1 className="font-display text-xl text-[#e4e4e7] mb-2" style={{ textTransform: 'none' }}>Chapter Not Found</h1>
          <p className="text-sm text-[#a1a1aa] mb-6">{error || 'Unable to load chapter.'}</p>
          <a href={`/browse/${seriesSlug}`} className="btn-brutal btn-sm"><IconChevronLeft size={14} /> BACK TO SERIES</a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative" style={{ background: '#0c0c12' }}>
      {/* ── Top Nav ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${showNav ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`} style={{ background: 'rgba(12, 12, 18, 0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #2a2a36' }}>
        <div className="max-w-container mx-auto px-5 h-14 flex items-center justify-between">
          <a href={`/browse/${seriesSlug}`} className="flex items-center gap-2 text-sm text-[#a1a1aa] hover:text-[#e4e4e7] transition-colors font-medium">
            <IconChevronLeft size={16} /> {chapter.series?.title || 'Back'}
          </a>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-[#e4e4e7]">{chapter.name}</span>
            <span className="text-xs text-[#71717a]">({chapter.pageCount} pages)</span>
          </div>
          <button onClick={() => setReadingMode(readingMode === 'vertical' ? 'paged' : 'vertical')} className="text-xs px-3 py-1.5 bg-[#1e1e2a] border border-[#2a2a36] text-[#a1a1aa] hover:text-[#e4e4e7] transition-colors flex items-center gap-1.5 font-medium">
            {readingMode === 'vertical' ? <><IconColumns size={13} /> Paged</> : <><IconFile size={13} /> Vertical</>}
          </button>
        </div>
      </nav>

      <div className="fixed inset-0 z-30" style={{ pointerEvents: readingMode === 'paged' ? 'auto' : 'none' }} onClick={() => readingMode === 'paged' && setShowNav(!showNav)} />

      {/* ── Vertical Reader ── */}
      {readingMode === 'vertical' && (
        <div className="max-w-3xl mx-auto pt-16 pb-4 cursor-pointer" onClick={() => setShowNav(!showNav)}>
          {chapter.images.map((url: string, i: number) => (
            <img key={i} src={url} alt={`Page ${i + 1}`} className="w-full block" loading={i < 3 ? 'eager' : 'lazy'} />
          ))}
        </div>
      )}

      {/* ── Paged Reader ── */}
      {readingMode === 'paged' && (
        <div className="flex items-center justify-center min-h-screen pt-14">
          {chapter.images[currentPage] ? (
            <img src={chapter.images[currentPage]} alt={`Page ${currentPage + 1}`} className="max-h-[calc(100vh-4rem)] max-w-full object-contain" />
          ) : (
            <div className="text-[#71717a]">Page not available</div>
          )}
        </div>
      )}

      {/* ── Paged Controls ── */}
      {readingMode === 'paged' && (
        <div className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 ${showNav ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
          <div className="max-w-lg mx-auto px-5 py-4" style={{ background: 'rgba(12, 12, 18, 0.92)', backdropFilter: 'blur(16px)', borderTop: '1px solid #2a2a36' }}>
            <div className="flex items-center gap-4">
              <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))} disabled={currentPage === 0} className="px-4 py-2 text-sm bg-[#1e1e2a] border border-[#2a2a36] text-[#a1a1aa] disabled:opacity-30 hover:text-[#e4e4e7] transition-colors">
                <IconChevronLeft size={16} />
              </button>
              <div className="flex-1">
                <input type="range" min={0} max={Math.max(0, chapter.pageCount - 1)} value={currentPage} onChange={(e) => setCurrentPage(parseInt(e.target.value))} className="w-full accent-[#ef4444]" />
              </div>
              <button onClick={() => setCurrentPage((p) => Math.min(p + 1, chapter.pageCount - 1))} disabled={currentPage >= chapter.pageCount - 1} className="px-4 py-2 text-sm bg-[#1e1e2a] border border-[#2a2a36] text-[#a1a1aa] disabled:opacity-30 hover:text-[#e4e4e7] transition-colors">
                <IconChevronRight size={16} />
              </button>
              <span className="text-xs text-[#71717a] font-mono w-16 text-center">{currentPage + 1}/{chapter.pageCount}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Chapter Navigation Bar (always visible) ── */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 ${readingMode === 'vertical' ? (showNav ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0') : 'pointer-events-none opacity-0'}`}>
        <div style={{ background: 'rgba(12, 12, 18, 0.95)', backdropFilter: 'blur(16px)', borderTop: '1px solid #2a2a36' }}>
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-2">
            {/* Previous Chapter */}
            <button
              onClick={() => prevChapter && navigateChapter(prevChapter.slug)}
              disabled={!prevChapter}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-[#1e1e2a] border border-[#2a2a36] text-[#a1a1aa] hover:text-[#e4e4e7] hover:border-[#ef4444]/40 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
              title={prevChapter ? prevChapter.name : 'No previous chapter'}
            >
              <IconChevronLeft size={16} />
              <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline">Prev</span>
            </button>

            {/* Home / Series Page */}
            <a
              href={`/browse/${seriesSlug}`}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1e1e2a] border border-[#2a2a36] text-[#a1a1aa] hover:text-[#fbbf24] hover:border-[#fbbf24]/40 transition-all"
              title="Back to series"
            >
              <IconHome size={16} />
              <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline">{chapter.series?.title || 'Series'}</span>
            </a>

            {/* Chapter List Dropdown */}
            {allChapters.length > 0 && (
              <div className="relative group">
                <button className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-[#1e1e2a] border border-[#2a2a36] text-[#a1a1aa] hover:text-[#e4e4e7] hover:border-[#ef4444]/40 transition-all">
                  <IconBook size={14} />
                  <span className="text-xs font-mono">{chapter.name}</span>
                  <span className="inline-block rotate-90"><IconChevronRight size={12} /></span>
                </button>
                {/* Dropdown */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 max-h-64 overflow-y-auto bg-[#16161e] border border-[#2a2a36] rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50" style={{ scrollbarWidth: 'thin' }}>
                  {allChapters.map((ch) => (
                    <a
                      key={ch.id}
                      href={`/browse/${seriesSlug}/${ch.slug}`}
                      className={`block px-3 py-2 text-xs border-b border-[#222230] last:border-0 transition-colors ${
                        ch.slug === chapterSlug
                          ? 'bg-[#ef4444]/10 text-[#ef4444] font-semibold'
                          : 'text-[#a1a1aa] hover:bg-[#1e1e2a] hover:text-[#e4e4e7]'
                      }`}
                    >
                      {ch.name}
                      {ch.title && <span className="text-[#52525b] ml-1">— {ch.title}</span>}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Next Chapter */}
            <button
              onClick={() => nextChapter && navigateChapter(nextChapter.slug)}
              disabled={!nextChapter}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-[#ef4444] border border-[#e4e4e7] text-white font-semibold shadow-[3px_3px_0_0_#e4e4e7] hover:bg-[#dc2626] transition-all disabled:opacity-20 disabled:cursor-not-allowed disabled:shadow-none"
              title={nextChapter ? nextChapter.name : 'No next chapter'}
            >
              <span className="text-xs uppercase tracking-wider hidden sm:inline">Next</span>
              <IconChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Footer Info (vertical, above nav bar) ── */}
      {readingMode === 'vertical' && (
        <div className="max-w-3xl mx-auto px-5 pb-20 text-center">
          <p className="text-xs text-[#71717a]">{chapter.name} · {chapter.pageCount} pages · {chapter.series?.title || ''}</p>
        </div>
      )}
    </main>
  );
}
