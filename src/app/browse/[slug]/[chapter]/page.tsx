'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import type { ChapterData } from '@/types';
import { IconChevronLeft, IconChevronRight, IconColumns, IconFile } from '@/components/icons';

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
        } else {
          setError(data.error || 'Chapter not found');
        }
      })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false));
  }, [seriesSlug, chapterSlug]);

  useEffect(() => {
    if (readingMode !== 'paged') return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        setCurrentPage((p) => Math.min(p + 1, (chapter?.pageCount || 1) - 1));
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentPage((p) => Math.max(p - 1, 0));
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [readingMode, chapter]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#000] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#7c3aed]/20 border-t-[#7c3aed] rounded-full animate-spin" />
      </main>
    );
  }

  if (error || !chapter) {
    return (
      <main className="min-h-screen bg-[#000] flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-4 text-[#5c5a70]">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M16 16s-1.5-2-4-2-4 2-4 2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
          </div>
          <h1 className="text-xl font-bold mb-2 text-[#e8e6f0]">Chapter Not Found</h1>
          <p className="text-sm text-[#8b89a0] mb-6">{error || 'Unable to load chapter.'}</p>
          <a href={`/browse/${seriesSlug}`} className="btn-primary text-sm"><IconChevronLeft size={14} /> Back to Series</a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#000] relative">
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${showNav ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`} style={{ background: 'rgba(6, 6, 14, 0.9)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <a href={`/browse/${seriesSlug}`} className="flex items-center gap-2 text-sm text-[#8b89a0] hover:text-[#e8e6f0] transition-colors">
            <IconChevronLeft size={16} /> {chapter.series?.title || 'Back'}
          </a>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[#e8e6f0]">{chapter.name}</span>
            <span className="text-xs text-[#5c5a70]">({chapter.pageCount} pages)</span>
          </div>
          <button
            onClick={() => setReadingMode(readingMode === 'vertical' ? 'paged' : 'vertical')}
            className="text-xs px-3 py-1.5 rounded-lg bg-white/[0.05] border border-[#1e1e3a] text-[#8b89a0] hover:text-[#e8e6f0] transition-colors flex items-center gap-1.5"
          >
            {readingMode === 'vertical' ? <><IconColumns /> Paged</> : <><IconFile /> Vertical</>}
          </button>
        </div>
      </nav>

      <div className="fixed inset-0 z-30" style={{ pointerEvents: readingMode === 'paged' ? 'auto' : 'none' }} onClick={() => readingMode === 'paged' && setShowNav(!showNav)} />

      {readingMode === 'vertical' && (
        <div className="max-w-3xl mx-auto pt-16 pb-8 cursor-pointer" onClick={() => setShowNav(!showNav)}>
          {chapter.images.map((url: string, i: number) => (
            <img key={i} src={url} alt={`Page ${i + 1}`} className="w-full block" loading={i < 3 ? 'eager' : 'lazy'} />
          ))}
        </div>
      )}

      {readingMode === 'paged' && (
        <div className="flex items-center justify-center min-h-screen pt-14">
          {chapter.images[currentPage] ? (
            <img src={chapter.images[currentPage]} alt={`Page ${currentPage + 1}`} className="max-h-[calc(100vh-4rem)] max-w-full object-contain" />
          ) : (
            <div className="text-[#5c5a70]">Page not available</div>
          )}
        </div>
      )}

      {readingMode === 'paged' && (
        <div className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 ${showNav ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
          <div className="max-w-lg mx-auto px-5 py-4" style={{ background: 'rgba(6, 6, 14, 0.9)', backdropFilter: 'blur(12px)', borderTop: '1px solid #1e1e3a' }}>
            <div className="flex items-center gap-4">
              <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))} disabled={currentPage === 0} className="px-4 py-2 text-sm rounded-lg bg-white/[0.05] border border-[#1e1e3a] text-[#8b89a0] disabled:opacity-30 hover:text-[#e8e6f0] transition-colors">
                <IconChevronLeft />
              </button>
              <div className="flex-1">
                <input type="range" min={0} max={Math.max(0, chapter.pageCount - 1)} value={currentPage} onChange={(e) => setCurrentPage(parseInt(e.target.value))} className="w-full accent-[#7c3aed]" />
              </div>
              <button onClick={() => setCurrentPage((p) => Math.min(p + 1, chapter.pageCount - 1))} disabled={currentPage >= chapter.pageCount - 1} className="px-4 py-2 text-sm rounded-lg bg-white/[0.05] border border-[#1e1e3a] text-[#8b89a0] disabled:opacity-30 hover:text-[#e8e6f0] transition-colors">
                <IconChevronRight />
              </button>
              <span className="text-xs text-[#5c5a70] font-mono w-16 text-center">{currentPage + 1}/{chapter.pageCount}</span>
            </div>
          </div>
        </div>
      )}

      {readingMode === 'vertical' && (
        <div className="max-w-3xl mx-auto px-5 pb-8 text-center">
          <p className="text-xs text-[#5c5a70] mb-4">{chapter.name} · {chapter.pageCount} pages · {chapter.series?.title || ''}</p>
          <a href={`/api/v1/chapter/${seriesSlug}/${chapterSlug}`} target="_blank" className="text-xs text-[#7c3aed] hover:underline">View JSON API response</a>
        </div>
      )}
    </main>
  );
}
