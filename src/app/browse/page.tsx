'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Series, Pagination } from '@/types';
import { IconStar, IconEye, IconBook, IconSearch, IconInbox, IconAlertTriangle, IconArrowRight, IconArrowLeft, IconChevronLeft, IconChevronRight, IconFire, IconTrophy, IconSparkles, IconX, IconShuffle } from '@/components/icons';
import { formatViews, Spinner } from '@/components/ui';
import { Footer } from '@/components/layout';

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
function ManhwaCard({ series, onClick }: { series: Series; onClick: () => void }) {
  return (
    <div className="manhwa-card cursor-pointer" onClick={onClick} style={{ width: '160px', minWidth: '160px' }}>
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
        <div className="info-overlay">
          <p className="text-white text-xs line-clamp-3 leading-relaxed mb-2">{series.description?.slice(0, 120) || 'No description.'}</p>
          <div className="flex items-center gap-2 text-white/80 text-[0.6rem]">
            <span>{series.chaptersCount} ch</span>
            <span>·</span>
            <span>{formatViews(series.totalViews)} views</span>
          </div>
          <span className="mt-2 text-[0.6rem] font-semibold uppercase tracking-wider text-[#fbbf24]">Read Now →</span>
        </div>
      </div>
      <div className="card-title">{series.title}</div>
    </div>
  );
}

/* ── Skeleton Card ── */
function SkeletonCard() {
  return (
    <div style={{ width: '160px', minWidth: '160px' }}>
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

/* ── Search with Autocomplete ── */
function SearchBar({ onSelect }: { onSelect: (s: Series) => void }) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Series[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const search = useCallback(async (query: string) => {
    if (query.length < 2) { setResults([]); setOpen(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/api/v1/search?q=${encodeURIComponent(query)}&perPage=8`);
      const data = await res.json();
      if (data.success) { setResults(data.data || []); setOpen(true); }
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  const handleChange = (val: string) => {
    setQ(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => search(val), 350);
  };

  return (
    <div ref={wrapperRef} className="relative flex-1 max-w-md">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]"><IconSearch size={16} /></div>
        <input
          type="text"
          value={q}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => q.length >= 2 && results.length > 0 && setOpen(true)}
          placeholder="Search series..."
          className="w-full bg-[#1e1e2a] border border-[#2a2a36] text-[#e4e4e7] pl-10 pr-4 py-2.5 text-sm rounded-lg placeholder:text-[#52525b] focus:outline-none focus:border-[#ef4444] transition-colors"
        />
        {q && (
          <button onClick={() => { setQ(''); setResults([]); setOpen(false); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52525b] hover:text-[#a1a1aa]">
            <IconX size={14} />
          </button>
        )}
      </div>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#16161e] border border-[#2a2a36] rounded-lg overflow-hidden shadow-lg z-50 max-h-80 overflow-y-auto">
          {loading && <div className="p-4 text-center text-xs text-[#71717a]">Searching...</div>}
          {!loading && results.length === 0 && <div className="p-4 text-center text-xs text-[#71717a]">No results found</div>}
          {!loading && results.map((s) => (
            <div key={s.id} onClick={() => { onSelect(s); setOpen(false); setQ(''); }} className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#1e1e2a] cursor-pointer border-b border-[#222230] last:border-0">
              <div className="w-9 h-12 rounded overflow-hidden bg-[#1e1e2a] shrink-0">
                <img src={s.thumbnail} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-[#e4e4e7] font-medium truncate">{s.title}</div>
                <div className="flex items-center gap-2 text-[0.6rem] text-[#71717a]">
                  <span className="flex items-center gap-1"><IconStar size={9} /> {s.rating.toFixed(1)}</span>
                  <span>{s.chaptersCount} ch</span>
                  <span className={`px-1.5 py-0.5 rounded text-[0.55rem] ${s.status === 'Ongoing' ? 'bg-[#22c55e]/10 text-[#22c55e]' : 'bg-[#3b82f6]/10 text-[#3b82f6]'}`}>{s.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Series Detail Modal ── */
function SeriesDetailModal({ slug, onClose }: { slug: string; onClose: () => void }) {
  const [series, setSeries] = useState<Series | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
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
                      <a href={`/browse/${slug}`} className="block text-center text-xs text-[#ef4444] hover:underline py-2 font-semibold">
                        View all {series.chapters.length} chapters →
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Action buttons */}
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

/* ── Main Browse Page ── */
export default function BrowsePage() {
  const [popular, setPopular] = useState<Series[]>([]);
  const [featured, setFeatured] = useState<Series | null>(null);
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [modalSlug, setModalSlug] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    return () => { document.documentElement.removeAttribute('data-theme'); };
  }, []);

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

  const trending = popular.filter(s => s.rating >= 4.5).slice(0, 15);
  const topRated = [...popular].sort((a, b) => b.rating - a.rating).slice(0, 15);
  const genreFiltered = selectedGenre
    ? popular.filter(s => s.tags?.some(t => t.toLowerCase() === selectedGenre.toLowerCase()))
    : popular;

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
          <div className="flex items-center gap-4">
            <SearchBar onSelect={(s) => setModalSlug(s.slug)} />
            <div className="hidden md:flex items-center gap-6">
              <a href="/" className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#a1a1aa] hover:text-[#e4e4e7] transition-colors">Home</a>
              <a href="/docs" className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#a1a1aa] hover:text-[#e4e4e7] transition-colors">Docs</a>
              <a href="/support" className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#a1a1aa] hover:text-[#e4e4e7] transition-colors">Support</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Featured Banner */}
      {featured && (
        <section className="relative overflow-hidden" style={{ minHeight: '380px' }}>
          <div className="absolute inset-0">
            {featured.thumbnail && (
              <img src={featured.thumbnail} alt="" className="w-full h-full object-cover opacity-25 blur-2xl scale-110" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#121218] via-[#121218]/70 to-[#121218]/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#121218]/80 to-transparent" />
          </div>
          <div className="relative max-w-container mx-auto px-5 md:px-8 py-12 flex items-end" style={{ minHeight: '380px' }}>
            <div className="flex gap-6 items-end pb-4">
              <div className="w-36 md:w-44 shrink-0 hidden sm:block">
                <div className="aspect-[3/4] rounded-lg overflow-hidden border border-[#2a2a36] shadow-2xl bg-[#1e1e2a]">
                  <img src={featured.cover || featured.thumbnail} alt={featured.title} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex-1 pb-2">
                <span className="px-2 py-0.5 text-[0.6rem] font-semibold rounded bg-[#ef4444]/20 text-[#ef4444] mb-3 inline-block">FEATURED</span>
                <h1 className="font-display text-3xl md:text-4xl text-white mb-2" style={{ textTransform: 'none' }}>{featured.title}</h1>
                <p className="text-sm text-[#a1a1aa] max-w-lg mb-4 line-clamp-2">{featured.description?.slice(0, 200) || 'No description.'}</p>
                <div className="flex items-center gap-4 text-sm text-[#a1a1aa] mb-5">
                  <span className="flex items-center gap-1 text-[#fbbf24] font-semibold"><IconStar size={14} /> {featured.rating.toFixed(1)}</span>
                  <span className="flex items-center gap-1"><IconBook size={14} /> {featured.chaptersCount} chapters</span>
                  <span className="flex items-center gap-1"><IconEye size={14} /> {formatViews(featured.totalViews)}</span>
                  <span className={`px-2 py-0.5 text-[0.6rem] font-semibold rounded ${featured.status === 'Ongoing' ? 'bg-[#22c55e]/10 text-[#22c55e]' : 'bg-[#3b82f6]/10 text-[#3b82f6]'}`}>{featured.status}</span>
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

        {/* Popular */}
        {!selectedGenre && (
          <>
            <section className="mb-10">
              <SectionHeader icon={<IconFire size={20} />} title="Popular" subtitle="Most read series on OmegaScans" />
              {loading ? (
                <div className="flex gap-4 overflow-hidden">
                  {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : (
                <ScrollRow>
                  {popular.map(s => <ManhwaCard key={s.id} series={s} onClick={() => setModalSlug(s.slug)} />)}
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
                  {trending.map(s => <ManhwaCard key={s.id} series={s} onClick={() => setModalSlug(s.slug)} />)}
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
                  {topRated.map(s => <ManhwaCard key={s.id} series={s} onClick={() => setModalSlug(s.slug)} />)}
                </ScrollRow>
              )}
            </section>
          </>
        )}

        {/* Genre-filtered view */}
        {selectedGenre && (
          <section className="mb-10">
            <SectionHeader icon={<IconBook size={20} />} title={selectedGenre} subtitle={`${genreFiltered.length} series in this genre`} />
            {genreFiltered.length === 0 ? (
              <div className="card-brutal text-center py-12">
                <div className="flex justify-center mb-4 text-[#52525b]"><IconInbox size={48} /></div>
                <h3 className="text-lg font-display text-[#e4e4e7] mb-2" style={{ textTransform: 'none' }}>No Series Found</h3>
                <p className="text-sm text-[#71717a]">No series found in the {selectedGenre} genre.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                {genreFiltered.map(s => <ManhwaCard key={s.id} series={s} onClick={() => setModalSlug(s.slug)} />)}
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
