const OMEGA_BASE = 'https://api.omegascans.org';

interface OmegaMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  first_page: number;
  first_page_url: string;
  last_page_url: string;
  next_page_url: string | null;
  previous_page_url: string | null;
}

interface OmegaChapter {
  id: number;
  chapter_name: string;
  chapter_title: string | null;
  chapter_thumbnail: string;
  chapter_slug: string;
  price: number;
  created_at: string;
  series: {
    series_slug: string;
    id: number;
    latest_chapter: unknown | null;
    meta: Record<string, unknown>;
  };
  meta: Record<string, unknown>;
}

interface OmegaChapterContent {
  chapter: {
    id: number;
    series_id: number;
    season_id: number | null;
    index: string;
    chapter_name: string;
    chapter_title: string | null;
    chapter_data: {
      images: string[];
    };
    chapter_content: unknown | null;
    chapter_thumbnail: string;
    chapter_slug: string;
    price: number;
    created_at: string;
    series: {
      series_slug: string;
      id: number;
      title: string;
      thumbnail: string;
      status: string;
      description: string;
      meta: Record<string, unknown>;
    };
  };
}

interface OmegaSeries {
  id: number;
  title: string;
  description: string;
  alternative_names: string;
  series_type: string;
  series_slug: string;
  thumbnail: string;
  total_views: number;
  status: string;
  created_at: string;
  updated_at: string;
  badge: string | null;
  rating: number;
  release_schedule: Record<string, boolean>;
  nu_link: string | null;
  is_coming_soon: boolean;
  paid_chapters: unknown[];
  free_chapters: Array<{
    id: number;
    chapter_name: string;
    chapter_slug: string;
    created_at: string;
    series_id: number;
    index: string;
    chapters_to_be_freed: unknown[];
    meta: Record<string, unknown>;
  }>;
}

interface OmegaSeriesDetail {
  id: number;
  title: string;
  series_slug: string;
  thumbnail: string;
  total_views: number;
  description: string;
  series_type: string;
  tags: Array<{ id: number; name: string; description: string; created_at: string; updated_at: string; color: string }>;
  rating: number;
  status: string;
  release_schedule: Record<string, boolean>;
  nu_link: string | null;
  seasons: unknown[];
  alternative_names: string;
  studio: string;
  author: string;
  release_year: string;
  ratings_count: number;
  viewer_rating: unknown | null;
  meta: {
    latest_update: unknown | null;
    folder_slug: string | null;
    metadata: Record<string, unknown>;
    chapters_count: string;
    who_bookmarked_count: string;
  };
}

export interface NormalizedSeries {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  cover: string;
  status: string;
  type: string;
  rating: number;
  totalViews: number;
  alternativeNames: string;
  author: string;
  studio: string;
  releaseYear: string;
  releaseSchedule: string[];
  tags: string[];
  chaptersCount: number;
  bookmarksCount: number;
  isComingSoon: boolean;
  badge: string | null;
  createdAt: string;
  updatedAt: string;
  chapters: NormalizedChapter[];
  url: string;
}

export interface NormalizedChapter {
  id: number;
  name: string;
  title: string | null;
  slug: string;
  thumbnail: string;
  price: number;
  isFree: boolean;
  createdAt: string;
  index: string;
  url: string;
}

export interface NormalizedChapterContent {
  id: number;
  name: string;
  title: string | null;
  slug: string;
  index: string;
  price: number;
  isFree: boolean;
  thumbnail: string;
  images: string[];
  pageCount: number;
  createdAt: string;
  series: {
    id: number;
    title: string;
    slug: string;
    thumbnail: string;
    status: string;
    description: string;
  };
  url: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

async function fetchOmega<T>(path: string): Promise<T> {
  const url = `${OMEGA_BASE}${path}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'OmegaAPI/1.0',
      'Accept': 'application/json',
    },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`OmegaScans API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

function normalizeSeries(series: OmegaSeries): NormalizedSeries {
  const days = Object.entries(series.release_schedule || {})
    .filter(([, v]) => v)
    .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1));

  return {
    id: series.id,
    title: series.title,
    slug: series.series_slug,
    description: stripHtml(series.description),
    thumbnail: normalizeImageUrl(series.thumbnail),
    cover: normalizeImageUrl(series.thumbnail),
    status: series.status,
    type: series.series_type,
    rating: Math.round(series.rating * 100) / 100,
    totalViews: series.total_views,
    alternativeNames: series.alternative_names || '',
    author: '',
    studio: '',
    releaseYear: '',
    releaseSchedule: days,
    tags: [],
    chaptersCount: series.free_chapters?.length || 0,
    bookmarksCount: 0,
    isComingSoon: series.is_coming_soon || false,
    badge: series.badge,
    createdAt: series.created_at,
    updatedAt: series.updated_at,
    chapters: (series.free_chapters || []).map((ch) => ({
      id: ch.id,
      name: ch.chapter_name,
      title: null,
      slug: ch.chapter_slug,
      thumbnail: '',
      price: 0,
      isFree: true,
      createdAt: ch.created_at,
      index: ch.index,
      url: `/api/v1/chapter/${series.series_slug}/${ch.chapter_slug}`,
    })),
    url: `/api/v1/series/${series.series_slug}`,
  };
}

function normalizeSeriesDetail(series: OmegaSeriesDetail): NormalizedSeries {
  const days = Object.entries(series.release_schedule || {})
    .filter(([, v]) => v)
    .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1));

  return {
    id: series.id,
    title: series.title,
    slug: series.series_slug,
    description: stripHtml(series.description),
    thumbnail: normalizeImageUrl(series.thumbnail),
    cover: normalizeImageUrl(series.thumbnail),
    status: series.status,
    type: series.series_type,
    rating: Math.round(series.rating * 100) / 100,
    totalViews: series.total_views,
    alternativeNames: series.alternative_names || '',
    author: series.author || '',
    studio: series.studio || '',
    releaseYear: series.release_year || '',
    releaseSchedule: days,
    tags: (series.tags || []).map((t) => typeof t === 'string' ? t : t.name),
    chaptersCount: parseInt(series.meta?.chapters_count || '0', 10),
    bookmarksCount: parseInt(series.meta?.who_bookmarked_count || '0', 10),
    isComingSoon: false,
    badge: null,
    createdAt: '',
    updatedAt: '',
    chapters: [],
    url: `/api/v1/series/${series.series_slug}`,
  };
}

function normalizeChapter(ch: OmegaChapter, seriesSlug: string): NormalizedChapter {
  return {
    id: ch.id,
    name: ch.chapter_name,
    title: ch.chapter_title,
    slug: ch.chapter_slug,
    thumbnail: normalizeImageUrl(ch.chapter_thumbnail),
    price: ch.price,
    isFree: ch.price === 0,
    createdAt: ch.created_at,
    index: ch.meta?.index as string || '',
    url: `/api/v1/chapter/${seriesSlug}/${ch.chapter_slug}`,
  };
}

function normalizeImageUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://media.omegascans.org/${url.replace(/^\//, '')}`;
}

function normalizeChapterContent(ch: OmegaChapterContent['chapter']): NormalizedChapterContent {
  const rawImages = ch.chapter_data?.images || [];
  const images = rawImages.map(normalizeImageUrl);

  return {
    id: ch.id,
    name: ch.chapter_name,
    title: ch.chapter_title,
    slug: ch.chapter_slug,
    index: ch.index,
    price: ch.price,
    isFree: ch.price === 0,
    thumbnail: normalizeImageUrl(ch.chapter_thumbnail),
    images,
    pageCount: images.length,
    createdAt: ch.created_at,
    series: {
      id: ch.series.id,
      title: ch.series.title,
      slug: ch.series.series_slug,
      thumbnail: normalizeImageUrl(ch.series.thumbnail),
      status: ch.series.status,
      description: stripHtml(ch.series.description),
    },
    url: `/api/v1/chapter/${ch.series.series_slug}/${ch.chapter_slug}`,
  };
}

function stripHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&ldquo;/g, '\u201C')
    .replace(/&rdquo;/g, '\u201D')
    .replace(/&mdash;/g, '\u2014')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// --- Public API Functions ---

export async function getSeriesList(
  page = 1,
  perPage = 20,
  q?: string
): Promise<PaginatedResponse<NormalizedSeries>> {
  const searchPath = q ? `/query?q=${encodeURIComponent(q)}&type=series&page=${page}` : `/query?type=series&page=${page}`;
  const data = await fetchOmega<{ meta: OmegaMeta; data: OmegaSeries[] }>(searchPath);

  return {
    success: true,
    data: data.data.map(normalizeSeries),
    pagination: {
      total: data.meta.total,
      perPage: data.meta.per_page,
      currentPage: data.meta.current_page,
      lastPage: data.meta.last_page,
      hasNext: !!data.meta.next_page_url,
      hasPrevious: !!data.meta.previous_page_url,
    },
  };
}

export async function getSeriesDetail(slug: string): Promise<ApiResponse<NormalizedSeries>> {
  const data = await fetchOmega<OmegaSeriesDetail>(`/series/${slug}`);
  return {
    success: true,
    data: normalizeSeriesDetail(data),
  };
}

export async function getSeriesChapters(
  seriesId: number,
  page = 1,
  perPage = 10000,
  seriesSlug = ''
): Promise<PaginatedResponse<NormalizedChapter>> {
  const data = await fetchOmega<{ meta: OmegaMeta; data: OmegaChapter[] }>(
    `/chapter/query?page=${page}&perPage=${perPage}&series_id=${seriesId}`
  );

  return {
    success: true,
    data: data.data.map((ch) => normalizeChapter(ch, seriesSlug)),
    pagination: {
      total: data.meta.total,
      perPage: data.meta.per_page,
      currentPage: data.meta.current_page,
      lastPage: data.meta.last_page,
      hasNext: !!data.meta.next_page_url,
      hasPrevious: !!data.meta.previous_page_url,
    },
  };
}

export async function getChapterContent(
  seriesSlug: string,
  chapterSlug: string
): Promise<ApiResponse<NormalizedChapterContent>> {
  const data = await fetchOmega<OmegaChapterContent>(
    `/chapter/${seriesSlug}/${chapterSlug}`
  );
  return {
    success: true,
    data: normalizeChapterContent(data.chapter),
  };
}

export async function searchSeries(
  query: string,
  page = 1
): Promise<PaginatedResponse<NormalizedSeries>> {
  const data = await fetchOmega<{ meta: OmegaMeta; data: OmegaSeries[] }>(
    `/query?q=${encodeURIComponent(query)}&type=series&page=${page}`
  );

  return {
    success: true,
    data: data.data.map(normalizeSeries),
    pagination: {
      total: data.meta.total,
      perPage: data.meta.per_page,
      currentPage: data.meta.current_page,
      lastPage: data.meta.last_page,
      hasNext: !!data.meta.next_page_url,
      hasPrevious: !!data.meta.previous_page_url,
    },
  };
}
