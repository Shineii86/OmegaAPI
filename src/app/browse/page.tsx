'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Series, Pagination } from '@/types';
import { IconStar, IconEye, IconBook, IconSearch, IconInbox, IconAlertTriangle, IconArrowRight, IconArrowLeft, IconChevronLeft, IconChevronRight, IconFire, IconTrophy, IconSparkles, IconX, IconShuffle, IconHeart, IconClock, IconGrid, IconList } from '@/components/icons';
import { formatViews, Spinner } from '@/components/ui';
import { Footer } from '@/components/layout';
import { getHistory, getContinueReading, clearHistory, getBookmarks, toggleBookmark, isBookmarked, getRecentSearches, saveSearch, clearRecentSearches, type HistoryEntry } from '@/lib/storage';

const BASE = typeof window !== 'undefined' ? window.location.origin : 'https://omegaapi.vercel.app';

/* ── ScrollRow ── */
function ScrollRow({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const checkScroll = () => {
    const el = ref.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 10);
    setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => { checkScroll(); }, [children]);

  const scroll = (dir: 'left' | 'right') => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  return (
    <div className="scroll-row-container">
      {showLeft && (
        <button className="scroll-row-btn left" onClick={() => scroll('left')}>
          <IconChevronLeft size={18} />
        </button>
      )}
      <div ref={ref} className="scroll-row" onScroll={checkScroll}>
        {children}
      </div>
      {showRight && (
        <button className="scroll-row-btn right" onClick={() => scroll('right')}>
          <IconChevronRight size={18} />
        </button>
      )}
    </div>
  );
}

/* ── Series Card (Manhwa style) ── */
function ManhwaCard({ series, onClick, onBookmark }: { series: Series; onClick: () => void; onBookmark?: (e: React.MouseEvent) => void }) {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setBookmarked(isBookmarked(series.slug));
  }, [series.slug]);

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    const added = toggleBookmark(series.slug);
    setBookmarked(added);
    onBookmark?.(e);
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
        {/* Bookmark button */}
        <button
          onClick={handleBookmark}
          className="absolute top-2 right-2 z-10 w-7 h-7 flex items-center justify-center rounded-full transition-all"
          style={{
            background: bookmarked ? 'rgba(239,68,68,0.9)' : 'rgba(0,0,0,0.5)',
            color: bookmarked ? '#fff' : '#a1a1aa',
          }}
          title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
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
          <span className="mt-2 text-[0.6rem] font-semibold uppercase tracking-wider text-[#fbbf24] flex items-center gap-1">Read Now <IconArrowRight size={10} /></span>
        </div>
      </div>
      <div className="card-title">{series.title}</div>
    </div>
  );
}

/* ── Skeleton Card ── */
function SkeletonCard() {
  return (
    <div className="manhwa-card-skeleton">
      <div className="skeleton" style={{ aspectRatio: '2/3', borderRadius: '8px' }} />
      <div className="skeleton mt-2" style={{ height: '14px', width: '80%' }} />
      <div className="skeleton mt-1" style={{ height: '12px', width: '60%' }} />
    </div>
  );
}

/* ── Section Header ── */
function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="text-[#ef4444]">{icon}</div>
      <div>
        <h2 className="font-display text-lg text-[#e4e4e7]" style={{ textTransform: 'none' }}>{title}</h2>
        <p className="text-xs text-[#71717a]">{subtitle}</p>
      </div>
    </div>
  );
}

/* ── Search Overlay (renders outside nav) ── */
function SearchOverlay({ open, onClose, onSelect, allSeries }: { open: boolean; onClose: () => void; onSelect: (s: Series) => void; allSeries: Series[] }) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Series[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQ('');
      setResults([]);
      setRecentSearches(getRecentSearches());
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  /* Client-side search — filter from all loaded series */
  useEffect(() => {
    if (q.length < 2) { setResults([]); return; }
    const lower = q.toLowerCase();
    const filtered = allSeries.filter(s =>
      s.title.toLowerCase().includes(lower) ||
      s.alternativeNames?.toLowerCase().includes(lower) ||
      s.author?.toLowerCase().includes(lower) ||
      s.tags?.some(t => t.toLowerCase().includes(lower))
    ).slice(0, 12);
    setResults(filtered);
  }, [q, allSeries]);

  const handleSelect = (s: Series) => {
    saveSearch(q || s.title);
    onSelect(s);
    onClose();
  };

  const handleRecentClick = (term: string) => {
    setQ(term);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="max-w-2xl mx-auto mt-20 px-4" onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#16161e] border border-[#2a2a36] rounded-xl overflow-hidden shadow-2xl">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 border-b border-[#2a2a36]">
            <span className="text-[#71717a] shrink-0"><IconSearch size={18} /></span>
            <input
              ref={inputRef}
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && q.length >= 2) {
                  // Already filtering client-side, just ensure results are shown
                  const lower = q.toLowerCase();
                  const filtered = allSeries.filter(s =>
                    s.title.toLowerCase().includes(lower) ||
                    s.alternativeNames?.toLowerCase().includes(lower) ||
                    s.author?.toLowerCase().includes(lower) ||
                    s.tags?.some(t => t.toLowerCase().includes(lower))
                  ).slice(0, 12);
                  setResults(filtered);
                }
              }}
              placeholder="Search by title, author, or genre..."
              className="flex-1 bg-transparent text-[#e4e4e7] py-4 text-base placeholder:text-[#52525b] focus:outline-none"
              autoComplete="off"
            />
            {q.length >= 2 && (
              <button
                onClick={() => {
                  const lower = q.toLowerCase();
                  const filtered = allSeries.filter(s =>
                    s.title.toLowerCase().includes(lower) ||
                    s.alternativeNames?.toLowerCase().includes(lower) ||
                    s.author?.toLowerCase().includes(lower) ||
                    s.tags?.some(t => t.toLowerCase().includes(lower))
                  ).slice(0, 12);
                  setResults(filtered);
                }}
                className="shrink-0 px-3 py-1.5 bg-[#ef4444] text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-[#dc2626] transition-colors"
              >
                Search
              </button>
            )}
            {q && (
              <button onClick={() => { setQ(''); setResults([]); }} className="text-[#52525b] hover:text-[#a1a1aa] transition-colors shrink-0">
                <IconX size={16} />
              </button>
            )}
            <kbd className="text-[0.6rem] font-mono bg-[#1e1e2a] border border-[#2a2a36] rounded px-1.5 py-0.5 text-[#52525b] shrink-0">ESC</kbd>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {q.length >= 2 && results.length === 0 && (
              <div className="p-8 text-center">
                <span className="text-[#3f3f46] mx-auto mb-3 block"><IconSearch size={32} /></span>
                <p className="text-sm text-[#71717a]">No results found for &quot;{q}&quot;</p>
              </div>
            )}
            {results.map((s) => (
              <div
                key={s.id}
                onClick={() => handleSelect(s)}
                className="flex items-center gap-4 px-4 py-3 hover:bg-[#1e1e2a] cursor-pointer border-b border-[#222230] last:border-0 transition-colors"
              >
                <div className="w-11 h-14 rounded-lg overflow-hidden bg-[#1e1e2a] shrink-0">
                  <img src={s.thumbnail} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-[#e4e4e7] font-semibold truncate">{s.title}</div>
                  <div className="flex items-center gap-3 mt-1 text-[0.65rem] text-[#71717a]">
                    <span className="flex items-center gap-1 text-[#fbbf24]"><IconStar size={10} /> {s.rating.toFixed(1)}</span>
                    <span>{s.chaptersCount} chapters</span>
                    <span className={`px-1.5 py-0.5 rounded text-[0.55rem] font-semibold ${s.status === 'Ongoing' ? 'bg-[#22c55e]/10 text-[#22c55e]' : 'bg-[#3b82f6]/10 text-[#3b82f6]'}`}>{s.status}</span>
                  </div>
                </div>
                <span className="text-[#3f3f46] shrink-0"><IconChevronRight size={16} /></span>
              </div>
            ))}
            {q.length < 2 && (
              <>
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="px-4 pt-4 pb-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[0.6rem] font-semibold uppercase tracking-widest text-[#52525b]">Recent Searches</span>
                      <button onClick={() => { clearRecentSearches(); setRecentSearches([]); }} className="text-[0.55rem] text-[#52525b] hover:text-[#ef4444] transition-colors">Clear</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => handleRecentClick(term)}
                          className="text-xs px-3 py-1.5 bg-[#1e1e2a] border border-[#2a2a36] text-[#a1a1aa] hover:text-[#e4e4e7] hover:border-[#ef4444]/40 transition-all rounded"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {recentSearches.length === 0 && (
                  <div className="p-8 text-center">
                    <span className="text-[#3f3f46] mx-auto mb-3 block"><IconSearch size={32} /></span>
                    <p className="text-sm text-[#52525b]">Type at least 2 characters to search</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Series Detail Modal ── */
function SeriesDetailModal({ slug, onClose }: { slug: string; onClose: () => void }) {
  const [series, setSeries] = useState<Series | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setLoading(true);
    setBookmarked(isBookmarked(slug));
    fetch(`${BASE}/api/v1/series/${slug}?include=chapters`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data) setSeries(data.data);
      })
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
            {/* Banner */}
            <div className="relative h-48 overflow-hidden">
              {series.thumbnail && (
                <img src={series.thumbnail} alt="" className="w-full h-full object-cover opacity-30 blur-xl scale-110" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#16161e] via-[#16161e]/60 to-transparent" />
              <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors">
                <IconX size={16} />
              </button>
            </div>

            <div className="px-6 pb-6 -mt-16 relative">
              <div className="flex gap-5">
                {/* Cover */}
                <div className="w-28 shrink-0">
                  <div className="aspect-[3/4] rounded-lg overflow-hidden border border-[#2a2a36] shadow-lg bg-[#1e1e2a]">
                    {series.cover || series.thumbnail ? (
                      <img src={series.cover || series.thumbnail} alt={series.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#52525b]"><IconBook size={24} /></div>
                    )}
                  </div>
                </div>

                {/* Info */}
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

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {series.author && (
                      <div className="bg-[#1e1e2a] border border-[#2a2a36] rounded px-3 py-2">
                        <div className="text-[0.55rem] text-[#52525b] uppercase tracking-wider">Author</div>
                        <div className="text-xs font-medium text-[#e4e4e7]">{series.author}</div>
                      </div>
                    )}
                    {series.releaseYear && (
                      <div className="bg-[#1e1e2a] border border-[#2a2a36] rounded px-3 py-2">
                        <div className="text-[0.55rem] text-[#52525b] uppercase tracking-wider">Year</div>
                        <div className="text-xs font-medium text-[#e4e4e7]">{series.releaseYear}</div>
                      </div>
                    )}
                    <div className="bg-[#1e1e2a] border border-[#2a2a36] rounded px-3 py-2">
                      <div className="text-[0.55rem] text-[#52525b] uppercase tracking-wider">Type</div>
                      <div className="text-xs font-medium text-[#e4e4e7]">{series.type}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Synopsis */}
              <div className="mt-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#71717a] mb-2">Synopsis</h3>
                <p className="text-sm text-[#a1a1aa] leading-relaxed">{series.description || 'No description available.'}</p>
              </div>

              {/* Tags */}
              {series.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {series.tags.map((tag: string) => (
                    <span key={tag} className="genre-pill text-[0.6rem]">{tag}</span>
                  ))}
                </div>
              )}

              {/* Chapters */}
              {series.chapters?.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#71717a] mb-3">Chapters ({series.chapters.length})</h3>
                  <div className="max-h-64 overflow-y-auto space-y-1">
                    {series.chapters.slice(0, 30).map((ch) => (
                      <a
                        key={ch.id}
                        href={`/browse/${slug}/${ch.slug}`}
                        className="flex items-center gap-3 px-3 py-2.5 rounded hover:bg-[#1e1e2a] transition-colors group border border-transparent hover:border-[#2a2a36]"
                      >
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
                    {series.chapters.length > 30 && (
                      <a href={`/browse/${slug}`} className="block text-center text-xs text-[#ef4444] hover:underline py-2 font-semibold flex items-center justify-center gap-1">
                        View all {series.chapters.length} chapters <IconArrowRight size={12} />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    const added = toggleBookmark(slug);
                    setBookmarked(added);
                  }}
                  className="btn-brutal btn-sm flex items-center justify-center gap-2"
                  style={{
                    background: bookmarked ? '#ef4444' : 'transparent',
                    color: bookmarked ? '#fff' : '#e4e4e7',
                    borderColor: '#e4e4e7',
                    boxShadow: '3px 3px 0 0 #e4e4e7',
                  }}
                >
                  <IconHeart size={14} fill={bookmarked ? 'currentColor' : 'none'} />
                  {bookmarked ? 'BOOKMARKED' : 'BOOKMARK'}
                </button>
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

/* ── Main Browse Page ── */
export default function BrowsePage() {
  const [popular, setPopular] = useState<Series[]>([]);
  const [featured, setFeatured] = useState<Series | null>(null);
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [modalSlug, setModalSlug] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [bookmarkRefresh, setBookmarkRefresh] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [allSeriesIndex, setAllSeriesIndex] = useState<Series[]>([]);

  /* Continue Reading + My List state */
  const [continueReading, setContinueReading] = useState<HistoryEntry[]>([]);
  const [myList, setMyList] = useState<Series[]>([]);
  const [myListLoading, setMyListLoading] = useState(false);

  /* View All state */
  const [viewAll, setViewAll] = useState(false);
  const [allSeries, setAllSeries] = useState<Series[]>([]);
  const [allPage, setAllPage] = useState(1);
  const [allTotal, setAllTotal] = useState(0);
  const [allLoading, setAllLoading] = useState(false);
  const [allHasMore, setAllHasMore] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    return () => { document.documentElement.removeAttribute('data-theme'); };
  }, []);

  /* Sync genre from URL params */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const genre = params.get('genre');
    if (genre) setSelectedGenre(genre);
  }, []);

  /* Update URL when genre changes */
  useEffect(() => {
    const url = new URL(window.location.href);
    if (selectedGenre) {
      url.searchParams.set('genre', selectedGenre);
    } else {
      url.searchParams.delete('genre');
    }
    window.history.replaceState({}, '', url.toString());
  }, [selectedGenre]);

  /* Load Continue Reading from localStorage */
  useEffect(() => {
    setContinueReading(getContinueReading());
  }, [bookmarkRefresh]);

  /* Background: fetch ALL series for search index */
  useEffect(() => {
    const fetchAllForSearch = async () => {
      try {
        const all: Series[] = [];
        let page = 1;
        let hasMore = true;
        while (hasMore && page <= 25) {
          const res = await fetch(`${BASE}/api/v1/series?page=${page}&perPage=100`);
          const data = await res.json();
          if (data.success && data.data?.length > 0) {
            all.push(...data.data);
            hasMore = data.pagination?.hasNext || false;
            page++;
          } else {
            hasMore = false;
          }
        }
        setAllSeriesIndex(all);
      } catch { /* silent */ }
    };
    fetchAllForSearch();
  }, []);

  /* Load My List (bookmarked series) */
  useEffect(() => {
    const slugs = getBookmarks();
    if (slugs.length === 0) { setMyList([]); return; }
    setMyListLoading(true);
    Promise.all(
      slugs.map(slug =>
        fetch(`${BASE}/api/v1/series/${slug}`)
          .then(r => r.json())
          .then(data => data.success ? data.data : null)
          .catch(() => null)
      )
    ).then(series => {
      setMyList(series.filter(Boolean));
      setMyListLoading(false);
    });
  }, [bookmarkRefresh]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [seriesRes, genresRes] = await Promise.all([
          fetch(`${BASE}/api/v1/series?page=1&perPage=40`),
          fetch(`${BASE}/api/v1/genres`),
        ]);
        const seriesData = await seriesRes.json();
        const genresData = await genresRes.json();

        if (seriesData.success) {
          const all = seriesData.data || [];
          setPopular(all);
          if (all.length > 0) {
            setFeatured(all[Math.floor(Math.random() * Math.min(all.length, 10))]);
          }
        }
        if (genresData.success) {
          setGenres(genresData.data?.genres || []);
        }
      } catch { /* silent */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  /* Keyboard shortcut: Cmd/Ctrl+K to open search */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const trending = popular.filter(s => s.rating >= 4.5).slice(0, 15);
  const topRated = [...popular].sort((a, b) => b.rating - a.rating).slice(0, 15);
  const genreFiltered = selectedGenre
    ? popular.filter(s => s.tags?.some(t => t.toLowerCase() === selectedGenre.toLowerCase()))
    : popular;

  /* Fetch all series for "View All" mode */
  const fetchAll = useCallback(async (page: number) => {
    setAllLoading(true);
    try {
      const res = await fetch(`${BASE}/api/v1/series?page=${page}&perPage=40`);
      const data = await res.json();
      if (data.success) {
        if (page === 1) {
          setAllSeries(data.data || []);
        } else {
          setAllSeries(prev => [...prev, ...(data.data || [])]);
        }
        setAllTotal(data.pagination?.total || 0);
        setAllHasMore(data.pagination?.hasNext || false);
        setAllPage(page);
      }
    } catch { /* silent */ }
    finally { setAllLoading(false); }
  }, []);

  const openViewAll = useCallback(() => {
    setViewAll(true);
    setSelectedGenre(null);
    if (allSeries.length === 0) fetchAll(1);
  }, [allSeries.length, fetchAll]);

  const closeViewAll = useCallback(() => {
    setViewAll(false);
  }, []);

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
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-[#1e1e2a] border border-[#2a2a36] rounded-lg text-[#52525b] hover:text-[#a1a1aa] hover:border-[#ef4444]/40 transition-all text-sm"
            >
              <IconSearch size={14} />
              <span className="hidden sm:inline text-xs">Search</span>
              <kbd className="text-[0.55rem] font-mono bg-[#121218] border border-[#2a2a36] rounded px-1 py-0.5 text-[#52525b] hidden sm:inline">⌘K</kbd>
            </button>
            <div className="hidden md:flex items-center gap-6">
              <a href="/" className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#a1a1aa] hover:text-[#e4e4e7] transition-colors">Home</a>
              <a href="/docs" className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#a1a1aa] hover:text-[#e4e4e7] transition-colors">Docs</a>
              <a href="/support" className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#a1a1aa] hover:text-[#e4e4e7] transition-colors">Support</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} onSelect={(s) => setModalSlug(s.slug)} allSeries={allSeriesIndex.length > 0 ? allSeriesIndex : popular} />

      {/* Featured Banner */}
      {featured && (
        <section className="relative" style={{ minHeight: '380px', overflow: 'hidden' }}>
          {/* Blurred BG */}
          <div className="absolute inset-0" style={{ zIndex: 0 }}>
            {featured.thumbnail && (
              <img src={featured.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.25, filter: 'blur(40px)', transform: 'scale(1.1)' }} />
            )}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #121218, rgba(18,18,24,0.7), rgba(18,18,24,0.3))' }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(18,18,24,0.8), transparent)' }} />
          </div>
          {/* Content */}
          <div className="relative max-w-container mx-auto px-5 md:px-8 py-12 flex items-end" style={{ minHeight: '380px', zIndex: 1 }}>
            <div className="flex gap-6 items-end pb-4 w-full">
              {/* Cover Image */}
              <div className="shrink-0" style={{ width: '140px' }}>
                <div style={{ aspectRatio: '3/4', borderRadius: '12px', overflow: 'hidden', border: '2px solid #2a2a36', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', background: '#1e1e2a' }}>
                  <img
                    src={featured.cover || featured.thumbnail}
                    alt={featured.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={(e) => { (e.target as HTMLImageElement).src = featured.thumbnail; }}
                  />
                </div>
              </div>
              {/* Text Content */}
              <div className="flex-1 pb-2">
                <span className="px-2 py-0.5 text-[0.6rem] font-semibold rounded mb-3 inline-block" style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444' }}>FEATURED</span>
                <h1 className="font-display text-3xl md:text-4xl text-white mb-2" style={{ textTransform: 'none' }}>{featured.title}</h1>
                <p className="text-sm max-w-lg mb-4 line-clamp-2" style={{ color: '#a1a1aa' }}>{featured.description?.slice(0, 200) || 'No description.'}</p>
                <div className="flex items-center gap-4 text-sm mb-5" style={{ color: '#a1a1aa' }}>
                  <span className="flex items-center gap-1 font-semibold" style={{ color: '#fbbf24' }}><IconStar size={14} /> {featured.rating.toFixed(1)}</span>
                  <span className="flex items-center gap-1"><IconBook size={14} /> {featured.chaptersCount} chapters</span>
                  <span className="flex items-center gap-1"><IconEye size={14} /> {formatViews(featured.totalViews)}</span>
                  <span className="px-2 py-0.5 text-[0.6rem] font-semibold rounded" style={{ background: featured.status === 'Ongoing' ? 'rgba(34,197,94,0.1)' : 'rgba(59,130,246,0.1)', color: featured.status === 'Ongoing' ? '#22c55e' : '#3b82f6' }}>{featured.status}</span>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setModalSlug(featured.slug)} className="btn-brutal btn-sm" style={{ background: '#ef4444', borderColor: '#e4e4e7', boxShadow: '3px 3px 0 0 #e4e4e7' }}>
                    VIEW DETAILS
                  </button>
                  {featured.chapters?.length > 0 && (
                    <a href={`/browse/${featured.slug}/${featured.chapters[featured.chapters.length - 1].slug}`} className="btn-brutal-outline btn-sm" style={{ borderColor: '#e4e4e7', color: '#e4e4e7', boxShadow: '3px 3px 0 0 #e4e4e7' }}>
                      READ NOW
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="max-w-container mx-auto px-5 md:px-8 py-8">
        {/* Genre Pills */}
        {genres.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedGenre(null)}
                className={`genre-pill ${!selectedGenre ? 'active' : ''}`}
              >
                All
              </button>
              {genres.slice(0, 20).map(g => (
                <button
                  key={g}
                  onClick={() => setSelectedGenre(selectedGenre === g ? null : g)}
                  className={`genre-pill ${selectedGenre === g ? 'active' : ''}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Continue Reading */}
        {!selectedGenre && !viewAll && continueReading.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <SectionHeader icon={<IconClock size={20} />} title="Continue Reading" subtitle="Pick up where you left off" />
              <button
                onClick={() => { clearHistory(); setContinueReading([]); }}
                className="flex items-center gap-1.5 text-[0.6rem] font-semibold uppercase tracking-widest text-[#71717a] hover:text-[#ef4444] transition-colors"
                title="Clear reading history"
              >
                <IconX size={12} /> Dismiss
              </button>
            </div>
            <ScrollRow>
              {continueReading.map(entry => (
                <div
                  key={entry.slug}
                  className="manhwa-card cursor-pointer"
                  onClick={() => setModalSlug(entry.slug)}
                >
                  <div className="cover-wrap">
                    <img
                      src={entry.thumbnail}
                      alt={entry.title}
                      loading="lazy"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    {/* Progress overlay */}
                    <div className="absolute bottom-0 left-0 right-0 z-10" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}>
                      <div className="px-2 pb-2 pt-4">
                        <div className="text-[0.55rem] text-white/80 mb-1">{entry.chapterName}</div>
                        <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#ef4444] rounded-full transition-all"
                            style={{ width: `${Math.round((entry.chapterIndex / entry.totalChapters) * 100)}%` }}
                          />
                        </div>
                        <div className="text-[0.5rem] text-white/50 mt-0.5">{entry.chapterIndex}/{entry.totalChapters}</div>
                      </div>
                    </div>
                  </div>
                  <div className="card-title">{entry.title}</div>
                </div>
              ))}
            </ScrollRow>
          </section>
        )}

        {/* My List (Bookmarks) */}
        {!selectedGenre && !viewAll && getBookmarks().length > 0 && (
          <section className="mb-10">
            <SectionHeader icon={<IconHeart size={20} />} title="My List" subtitle={`${getBookmarks().length} bookmarked series`} />
            {myListLoading ? (
              <div className="flex gap-4 overflow-hidden">
                {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : myList.length > 0 ? (
              <ScrollRow>
                {myList.map(s => (
                  <ManhwaCard
                    key={s.id}
                    series={s}
                    onClick={() => setModalSlug(s.slug)}
                    onBookmark={() => setBookmarkRefresh(v => v + 1)}
                  />
                ))}
              </ScrollRow>
            ) : null}
          </section>
        )}

        {/* Popular */}
        {!selectedGenre && !viewAll && (
          <>
            <section className="mb-10">
              <div className="flex items-end justify-between mb-4">
                <SectionHeader icon={<IconFire size={20} />} title="Popular" subtitle="Most read series on OmegaScans" />
                <button onClick={openViewAll} className="text-xs font-semibold uppercase tracking-widest text-[#ef4444] hover:text-[#f87171] transition-colors flex items-center gap-1 shrink-0">
                  View All <IconArrowRight size={12} />
                </button>
              </div>
              {loading ? (
                <div className="flex gap-4 overflow-hidden">
                  {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : (
                <ScrollRow>
                  {popular.map(s => <ManhwaCard key={s.id} series={s} onClick={() => setModalSlug(s.slug)} onBookmark={() => setBookmarkRefresh(v => v + 1)} />)}
                </ScrollRow>
              )}
            </section>

            <section className="mb-10">
              <SectionHeader icon={<IconSparkles size={20} />} title="Trending" subtitle="High-rated series gaining attention" />
              {loading ? (
                <div className="flex gap-4 overflow-hidden">
                  {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : (
                <ScrollRow>
                  {trending.map(s => <ManhwaCard key={s.id} series={s} onClick={() => setModalSlug(s.slug)} onBookmark={() => setBookmarkRefresh(v => v + 1)} />)}
                </ScrollRow>
              )}
            </section>

            <section className="mb-10">
              <SectionHeader icon={<IconTrophy size={20} />} title="Top Rated" subtitle="Highest rated series of all time" />
              {loading ? (
                <div className="flex gap-4 overflow-hidden">
                  {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : (
                <ScrollRow>
                  {topRated.map(s => <ManhwaCard key={s.id} series={s} onClick={() => setModalSlug(s.slug)} onBookmark={() => setBookmarkRefresh(v => v + 1)} />)}
                </ScrollRow>
              )}
            </section>
          </>
        )}

        {/* View All — Full Grid with Pagination */}
        {viewAll && !selectedGenre && (
          <section className="mb-10">
            <div className="flex items-end justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-[#ef4444]"><IconBook size={20} /></div>
                <div>
                  <h2 className="font-display text-lg text-[#e4e4e7]" style={{ textTransform: 'none' }}>All Series</h2>
                  <p className="text-xs text-[#71717a]">{allTotal.toLocaleString()} series available</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* View Mode Toggle */}
                <div className="flex items-center border border-[#2a2a36] rounded overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-[#ef4444] text-white' : 'bg-[#1e1e2a] text-[#71717a] hover:text-[#a1a1aa]'}`}
                    title="Grid view"
                  >
                    <IconGrid size={14} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-[#ef4444] text-white' : 'bg-[#1e1e2a] text-[#71717a] hover:text-[#a1a1aa]'}`}
                    title="List view"
                  >
                    <IconList size={14} />
                  </button>
                </div>
                <button onClick={closeViewAll} className="text-xs font-semibold uppercase tracking-widest text-[#a1a1aa] hover:text-[#e4e4e7] transition-colors flex items-center gap-1">
                  <IconChevronLeft size={12} /> Back
                </button>
              </div>
            </div>
            {allSeries.length === 0 && allLoading ? (
              <div className={viewMode === 'grid'
                ? "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-5"
                : "space-y-2"
              }>
                {Array.from({ length: 16 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-5">
                    {allSeries.map(s => <ManhwaCard key={s.id} series={s} onClick={() => setModalSlug(s.slug)} onBookmark={() => setBookmarkRefresh(v => v + 1)} />)}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {allSeries.map(s => (
                      <div
                        key={s.id}
                        onClick={() => setModalSlug(s.slug)}
                        className="flex items-center gap-4 p-3 bg-[#16161e] border border-[#2a2a36] rounded-lg hover:bg-[#1e1e2a] cursor-pointer transition-colors"
                      >
                        <div className="w-12 h-16 rounded overflow-hidden bg-[#1e1e2a] shrink-0">
                          <img src={s.thumbnail} alt="" className="w-full h-full object-cover" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-[#e4e4e7] truncate">{s.title}</div>
                          <div className="flex items-center gap-3 mt-1 text-[0.65rem] text-[#71717a]">
                            <span className="flex items-center gap-1 text-[#fbbf24]"><IconStar size={10} /> {s.rating.toFixed(1)}</span>
                            <span>{s.chaptersCount} ch</span>
                            <span className={`px-1.5 py-0.5 rounded text-[0.55rem] font-semibold ${s.status === 'Ongoing' ? 'bg-[#22c55e]/10 text-[#22c55e]' : 'bg-[#3b82f6]/10 text-[#3b82f6]'}`}>{s.status}</span>
                            <span className="text-[#52525b]">{s.type}</span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleBookmark(s.slug); setBookmarkRefresh(v => v + 1); }}
                          className="p-1.5 rounded-full transition-colors shrink-0"
                          style={{ color: isBookmarked(s.slug) ? '#ef4444' : '#52525b' }}
                        >
                          <IconHeart size={14} fill={isBookmarked(s.slug) ? 'currentColor' : 'none'} />
                        </button>
                        <span className="text-[#3f3f46] shrink-0"><IconChevronRight size={16} /></span>
                      </div>
                    ))}
                  </div>
                )}
                {allHasMore && (
                  <div className="text-center mt-8">
                    <button
                      onClick={() => fetchAll(allPage + 1)}
                      disabled={allLoading}
                      className="btn-brutal-outline btn-sm"
                      style={{ borderColor: '#e4e4e7', color: '#e4e4e7', boxShadow: '3px 3px 0 0 #e4e4e7' }}
                    >
                      {allLoading ? 'LOADING...' : `LOAD MORE (${allSeries.length} of ${allTotal.toLocaleString()})`}
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        )}

        {/* Genre-filtered view */}
        {selectedGenre && (
          <section className="mb-10">
            <div className="flex items-end justify-between mb-4">
              <SectionHeader icon={<IconBook size={20} />} title={selectedGenre} subtitle={`${genreFiltered.length} series in this genre`} />
              <button onClick={() => setSelectedGenre(null)} className="text-xs font-semibold uppercase tracking-widest text-[#a1a1aa] hover:text-[#e4e4e7] transition-colors flex items-center gap-1">
                <IconChevronLeft size={12} /> Back
              </button>
            </div>
            {genreFiltered.length === 0 ? (
              <div className="card-brutal text-center py-12">
                <div className="flex justify-center mb-4 text-[#52525b]"><IconInbox size={48} /></div>
                <h3 className="text-lg font-display text-[#e4e4e7] mb-2" style={{ textTransform: 'none' }}>No Series Found</h3>
                <p className="text-sm text-[#71717a]">No series found in the {selectedGenre} genre.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-5">
                {genreFiltered.map(s => <ManhwaCard key={s.id} series={s} onClick={() => setModalSlug(s.slug)} onBookmark={() => setBookmarkRefresh(v => v + 1)} />)}
              </div>
            )}
          </section>
        )}

        {/* API Info Banner */}
        <section className="mb-10">
          <div className="card-brutal text-center py-8" style={{ background: '#1e1e2a', borderColor: '#2a2a36' }}>
            <div className="flex justify-center mb-3">
              <span className="animate-pulse w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
            </div>
            <h3 className="font-display text-base text-[#e4e4e7] mb-1" style={{ textTransform: 'none' }}>This Page Is Live</h3>
            <p className="text-xs text-[#71717a] max-w-md mx-auto mb-4">
              All data is fetched in real-time from the OmegaAPI. This browse page demonstrates the API&apos;s capabilities.
            </p>
            <a href="/docs" className="btn-brutal-outline btn-sm" style={{ borderColor: '#e4e4e7', color: '#e4e4e7', boxShadow: '3px 3px 0 0 #e4e4e7' }}>
              VIEW API DOCS
            </a>
          </div>
        </section>
      </div>

      <Footer theme="dark" />

      {/* Series Detail Modal */}
      {modalSlug && <SeriesDetailModal slug={modalSlug} onClose={() => setModalSlug(null)} />}
    </main>
  );
}
