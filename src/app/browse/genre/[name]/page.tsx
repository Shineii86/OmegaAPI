'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import type { Series } from '@/types';
import { IconStar, IconEye, IconBook, IconChevronLeft, IconChevronRight, IconHeart, IconSearch, IconInbox } from '@/components/icons';
import { formatViews } from '@/components/ui';
import { Footer } from '@/components/layout';
import { isBookmarked, toggleBookmark } from '@/lib/storage';
import PaymentGate from '@/components/PaymentGate';

const BASE = typeof window !== 'undefined' ? window.location.origin : 'https://omegaapi.vercel.app';
const GENRE_INDEX_KEY = 'omega_genre_index';
const GENRE_INDEX_TTL = 60 * 60 * 1000; // 1 hour

/* Map API tags to genre names — tags are often more specific than genres */
const TAG_TO_GENRE: Record<string, string> = {
  'mild': 'adult',
  'hardcore': 'adult',
  'netori': 'adult',
  'netorare': 'adult',
  'campus': 'school life',
  'school': 'school life',
  'office': 'slice of life',
  'cohabitation': 'slice of life',
  'martial art': 'martial arts',
  'martial arts': 'martial arts',
  'superhero': 'action',
  'super power': 'action',
  'superpower': 'action',
  'adventure': 'action',
  'monster': 'horror',
  'zombie': 'horror',
  'survival': 'thriller',
  'revenge': 'drama',
  'tragedy': 'tragedy',
  'romance': 'romance',
  'comedy': 'comedy',
  'drama': 'drama',
  'fantasy': 'fantasy',
  'harem': 'harem',
  'horror': 'horror',
  'isekai': 'isekai',
  'mature': 'mature',
  'mystery': 'mystery',
  'psychological': 'psychological',
  'sci-fi': 'sci-fi',
  'seinen': 'seinen',
  'shounen': 'shounen',
  'slice of life': 'slice of life',
  'supernatural': 'supernatural',
  'thriller': 'thriller',
  'webtoon': 'webtoon',
  'yaoi': 'yaoi',
  'yuri': 'yuri',
  'action': 'action',
  'adult': 'adult',
};

function matchesGenre(tags: string[], genre: string): boolean {
  return tags.some(t => {
    const tag = t.toLowerCase().trim();
    // Direct match
    if (tag === genre) return true;
    // Mapped match
    if (TAG_TO_GENRE[tag] === genre) return true;
    // Partial match (e.g. "martial art" in "martial arts")
    if (genre.includes(tag) || tag.includes(genre)) return true;
    return false;
  });
}

interface SeriesWithTags extends Series {
  tags: string[];
}

/* ── Manhwa Card ── */
function ManhwaCard({ series, onClick }: { series: Series; onClick: () => void }) {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setBookmarked(isBookmarked(series.slug));
  }, [series.slug]);

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    const added = toggleBookmark(series.slug);
    setBookmarked(added);
  };

  return (
    <div className="manhwa-card cursor-pointer" onClick={onClick}>
      <div className="cover-wrap">
        <img
          src={series.thumbnail}
          alt={series.title}
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <div className="rating-badge">
          <IconStar size={10} /> {series.rating.toFixed(1)}
        </div>
        <button
          onClick={handleBookmark}
          className="absolute top-2 right-2 z-10 w-7 h-7 flex items-center justify-center rounded-full transition-all"
          style={{
            background: bookmarked ? 'rgba(239,68,68,0.9)' : 'rgba(0,0,0,0.5)',
            color: bookmarked ? '#fff' : '#a1a1aa',
          }}
        >
          <IconHeart size={12} fill={bookmarked ? 'currentColor' : 'none'} />
        </button>
        <div className="info-overlay">
          <p className="text-white text-xs line-clamp-3 leading-relaxed mb-2">{series.description?.slice(0, 120) || 'No description.'}</p>
          <div className="flex items-center gap-2 text-white/80 text-[0.6rem]">
            <span>{series.chaptersCount} ch</span>
            <span>·</span>
            <span>{formatViews(series.totalViews)} views</span>
          </div>
        </div>
      </div>
      <div className="card-title">{series.title}</div>
    </div>
  );
}

/* ── Series Detail Modal (inline) ── */
function SeriesDetailModal({ slug, onClose }: { slug: string; onClose: () => void }) {
  const [series, setSeries] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${BASE}/api/v1/series/${slug}?include=chapters`)
      .then(r => r.json())
      .then(data => { if (data.success && data.data) setSeries(data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-7 h-7 border-2 border-[#2a2a36] border-t-[#ef4444] rounded-full animate-spin" />
          </div>
        ) : series ? (
          <div>
            <div className="relative h-48 overflow-hidden">
              {series.thumbnail && <img src={series.thumbnail} alt="" className="w-full h-full object-cover opacity-30 blur-xl scale-110" />}
              <div className="absolute inset-0 bg-gradient-to-t from-[#16161e] via-[#16161e]/60 to-transparent" />
              <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors">✕</button>
            </div>
            <div className="px-6 pb-6 -mt-16 relative">
              <div className="flex gap-5">
                <div className="w-28 shrink-0">
                  <div className="aspect-[3/4] rounded-lg overflow-hidden border border-[#2a2a36] shadow-lg bg-[#1e1e2a]">
                    <img src={series.cover || series.thumbnail} alt={series.title} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="flex-1 min-w-0 pt-8">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className={`px-2 py-0.5 text-[0.6rem] font-semibold rounded ${series.status === 'Ongoing' ? 'bg-[#22c55e]/10 text-[#22c55e]' : 'bg-[#3b82f6]/10 text-[#3b82f6]'}`}>{series.status}</span>
                    <span className="px-2 py-0.5 text-[0.6rem] font-semibold rounded bg-[#a855f7]/10 text-[#a855f7]">{series.type}</span>
                  </div>
                  <h2 className="font-display text-xl text-[#e4e4e7] mb-1" style={{ textTransform: 'none' }}>{series.title}</h2>
                  {series.alternativeNames && <p className="text-xs text-[#71717a] mb-3">{series.alternativeNames}</p>}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-[#a1a1aa] mb-4">
                    <span className="flex items-center gap-1 text-[#fbbf24] font-semibold"><IconStar size={14} /> {series.rating.toFixed(1)}</span>
                    <span className="flex items-center gap-1"><IconEye size={14} /> {formatViews(series.totalViews)}</span>
                    <span className="flex items-center gap-1"><IconBook size={14} /> {series.chaptersCount} ch</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#71717a] mb-2">Synopsis</h3>
                <p className="text-sm text-[#a1a1aa] leading-relaxed">{series.description || 'No description available.'}</p>
              </div>
              {series.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {series.tags.map((tag: string) => (
                    <a key={tag} href={`/browse/genre/${encodeURIComponent(tag.toLowerCase())}`} className="genre-pill text-[0.6rem]">{tag}</a>
                  ))}
                </div>
              )}
              {series.chapters?.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#71717a] mb-3">Chapters ({series.chapters.length})</h3>
                  <div className="max-h-64 overflow-y-auto space-y-1">
                    {series.chapters.slice(0, 30).map((ch: any) => (
                      <a key={ch.id} href={`/browse/${slug}/${ch.slug}`} className="flex items-center gap-3 px-3 py-2.5 rounded hover:bg-[#1e1e2a] transition-colors group border border-transparent hover:border-[#2a2a36]">
                        <div className="flex-1 min-w-0">
                          <span className="text-sm text-[#e4e4e7] group-hover:text-[#fbbf24] transition-colors">{ch.name}</span>
                          {ch.title && <span className="text-xs text-[#52525b] ml-2">— {ch.title}</span>}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {ch.isFree ? (
                            <span className="text-[0.55rem] px-1.5 py-0.5 rounded bg-[#22c55e]/10 text-[#22c55e] font-semibold">Free</span>
                          ) : (
                            <span className="text-[0.55rem] px-1.5 py-0.5 rounded bg-[#fbbf24]/10 text-[#fbbf24] font-semibold">{ch.price} coins</span>
                          )}
                          <IconChevronRight size={14} />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-3 mt-6">
                {series.chapters?.length > 0 && (
                  <a href={`/browse/${slug}/${series.chapters[series.chapters.length - 1].slug}`} className="btn-brutal btn-sm flex-1 justify-center" style={{ background: '#ef4444', borderColor: '#e4e4e7', boxShadow: '3px 3px 0 0 #e4e4e7' }}>
                    READ FIRST CHAPTER
                  </a>
                )}
                <a href={`/browse/${slug}`} className="btn-brutal-outline btn-sm flex-1 justify-center" style={{ borderColor: '#e4e4e7', color: '#e4e4e7', boxShadow: '3px 3px 0 0 #e4e4e7' }}>
                  VIEW DETAILS
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-[#71717a]">Failed to load series</div>
        )}
      </div>
    </div>
  );
}

/* ── Main Genre Page ── */
export default function GenrePage() {
  return (
    <PaymentGate>
      <GenrePageContent />
    </PaymentGate>
  );
}

function GenrePageContent() {
  const params = useParams();
  const genre = decodeURIComponent((params?.name as string) || '').toLowerCase();
  const genreTitle = genre.charAt(0).toUpperCase() + genre.slice(1);

  const [allSeries, setAllSeries] = useState<SeriesWithTags[]>([]);
  const [filtered, setFiltered] = useState<SeriesWithTags[]>([]);
  const [loading, setLoading] = useState(true);
  const [enriched, setEnriched] = useState(false);
  const [modalSlug, setModalSlug] = useState<string | null>(null);
  const [progress, setProgress] = useState({ loaded: 0, total: 0 });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    return () => { document.documentElement.removeAttribute('data-theme'); };
  }, []);

  /* Load all series and enrich with tags */
  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      try {
        // 1. Check localStorage cache for genre index
        let seriesList: Series[] = [];
        const cached = localStorage.getItem(GENRE_INDEX_KEY);
        if (cached) {
          try {
            const { data, timestamp } = JSON.parse(cached);
            if (Array.isArray(data) && data.length > 0 && Date.now() - timestamp < GENRE_INDEX_TTL) {
              seriesList = data;
            }
          } catch { /* corrupt */ }
        }

        // 2. Fetch all series if no cache
        if (seriesList.length === 0) {
          let page = 1;
          let hasMore = true;
          while (hasMore && page <= 25) {
            const res = await fetch(`${BASE}/api/v1/series?page=${page}&perPage=100`);
            const data = await res.json();
            if (data.success && data.data?.length > 0) {
              seriesList.push(...data.data);
              hasMore = data.pagination?.hasNext || false;
              page++;
            } else {
              hasMore = false;
            }
          }
          // Cache the full list
          try {
            localStorage.setItem(GENRE_INDEX_KEY, JSON.stringify({ data: seriesList, timestamp: Date.now() }));
          } catch { /* quota */ }
        }

        setAllSeries(seriesList as SeriesWithTags[]);
        setProgress({ loaded: 0, total: seriesList.length });

        // 3. Check if tags are already populated
        const hasTags = seriesList.some((s: any) => s.tags?.length > 0);
        if (hasTags) {
          const matching = (seriesList as SeriesWithTags[]).filter(s =>
            matchesGenre(s.tags || [], genre)
          );
          setFiltered(matching);
          setEnriched(true);
          setLoading(false);
          return;
        }

        // 4. Batch-fetch tags from detail endpoints
        const BATCH = 10;
        const enrichedSeries: SeriesWithTags[] = [...(seriesList as SeriesWithTags[])];
        for (let i = 0; i < seriesList.length; i += BATCH) {
          const batch = seriesList.slice(i, i + BATCH);
          const results = await Promise.all(
            batch.map((s: Series) =>
              fetch(`${BASE}/api/v1/series/${s.slug}`)
                .then(r => r.json())
                .then(d => d.success ? { slug: s.slug, tags: d.data?.tags || [] } : null)
                .catch(() => null)
            )
          );
          for (const result of results) {
            if (!result) continue;
            const idx = enrichedSeries.findIndex(s => s.slug === result.slug);
            if (idx >= 0) enrichedSeries[idx] = { ...enrichedSeries[idx], tags: result.tags };
          }
          setProgress({ loaded: Math.min(i + BATCH, seriesList.length), total: seriesList.length });
          // Update filtered results incrementally
          const matching = enrichedSeries.filter(s =>
            matchesGenre(s.tags || [], genre)
          );
          setFiltered(matching);
        }

        // 5. Update cache with tags
        try {
          localStorage.setItem(GENRE_INDEX_KEY, JSON.stringify({ data: enrichedSeries, timestamp: Date.now() }));
        } catch {}

        setAllSeries(enrichedSeries);
        setEnriched(true);
      } catch { /* silent */ }
      finally { setLoading(false); }
    };

    if (genre) loadAll();
  }, [genre]);

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Nav */}
      <nav className="nav-frosted sticky top-0 z-50">
        <div className="max-w-container mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 flex items-center justify-center font-black text-sm bg-[#fbbf24] text-[#0f172a] border-2 border-[#e4e4e7] shadow-brutal-sm">Ω</div>
            <span className="font-display text-lg text-[#e4e4e7]" style={{ textTransform: 'none' }}>OMEGAAPI</span>
            <span className="pill-tag ml-1 hidden sm:inline-flex" style={{ color: '#ef4444', borderColor: '#ef4444' }}>BROWSE</span>
          </a>
          <div className="flex items-center gap-3">
            <a href="/browse" className="text-xs font-semibold uppercase tracking-widest text-[#a1a1aa] hover:text-[#e4e4e7] transition-colors flex items-center gap-1">
              <IconChevronLeft size={12} /> Back to Browse
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-container mx-auto px-5 md:px-8 py-8">
        {/* Genre Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <a href="/browse" className="text-[0.6rem] font-semibold uppercase tracking-widest text-[#71717a] hover:text-[#e4e4e7] transition-colors">Browse</a>
            <span className="text-[#3f3f46]">›</span>
            <span className="text-[0.6rem] font-semibold uppercase tracking-widest text-[#ef4444]">{genreTitle}</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-[#e4e4e7] mb-2" style={{ textTransform: 'none' }}>{genreTitle}</h1>
          <p className="text-sm text-[#71717a]">
            {loading && !enriched
              ? `Scanning ${progress.total} series... (${progress.loaded} checked)`
              : `${filtered.length} series found`
            }
          </p>
        </div>

        {/* Genre Pills (quick switch) */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['action', 'adult', 'comedy', 'drama', 'fantasy', 'harem', 'horror', 'isekai', 'martial arts', 'mature', 'mystery', 'psychological', 'romance', 'school life', 'sci-fi', 'seinen', 'shounen', 'slice of life', 'supernatural', 'thriller', 'tragedy', 'webtoon', 'yaoi', 'yuri'].map(g => (
            <a
              key={g}
              href={`/browse/genre/${encodeURIComponent(g)}`}
              className={`genre-pill ${g === genre ? 'active' : ''}`}
            >
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </a>
          ))}
        </div>

        {/* Progress Bar */}
        {loading && !enriched && progress.total > 0 && (
          <div className="mb-6">
            <div className="w-full h-1.5 bg-[#1e1e2a] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#ef4444] rounded-full transition-all duration-300"
                style={{ width: `${Math.round((progress.loaded / progress.total) * 100)}%` }}
              />
            </div>
            <p className="text-[0.6rem] text-[#52525b] mt-1.5 font-mono">Loading tags: {progress.loaded}/{progress.total}</p>
          </div>
        )}

        {/* Results Grid */}
        {loading && filtered.length === 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-5">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="manhwa-card-skeleton">
                <div className="skeleton" style={{ aspectRatio: '2/3', borderRadius: '8px' }} />
                <div className="skeleton mt-2" style={{ height: '14px', width: '80%' }} />
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-5">
            {filtered.map(s => (
              <ManhwaCard key={s.id} series={s} onClick={() => setModalSlug(s.slug)} />
            ))}
          </div>
        ) : enriched ? (
          <div className="card-brutal text-center py-16">
            <div className="flex justify-center mb-4 text-[#52525b]"><IconInbox size={48} /></div>
            <h3 className="text-lg font-display text-[#e4e4e7] mb-2" style={{ textTransform: 'none' }}>No Series Found</h3>
            <p className="text-sm text-[#71717a] mb-6">No series found in the {genreTitle} genre.</p>
            <a href="/browse" className="btn-brutal btn-sm">BACK TO BROWSE</a>
          </div>
        ) : null}
      </div>

      <Footer theme="dark" />

      {modalSlug && <SeriesDetailModal slug={modalSlug} onClose={() => setModalSlug(null)} />}
    </main>
  );
}
