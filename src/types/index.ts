export interface Chapter {
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

export interface Series {
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
  chapters: Chapter[];
  url: string;
}

export interface ChapterData {
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
}

export interface Pagination {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  pagination?: Pagination;
}
