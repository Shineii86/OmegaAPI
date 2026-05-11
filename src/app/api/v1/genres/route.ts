import { successResponse } from '@/lib/utils';

export const runtime = 'edge';

export async function GET() {
  return successResponse({
    success: true,
    data: {
      genres: [
        'Action', 'Adult', 'Comedy', 'Drama', 'Fantasy', 'Harem',
        'Horror', 'Isekai', 'Martial Arts', 'Mature', 'Mystery',
        'Psychological', 'Romance', 'School Life', 'Sci-Fi',
        'Seinen', 'Shounen', 'Slice of Life', 'Supernatural',
        'Thriller', 'Tragedy', 'Webtoon', 'Yaoi', 'Yuri',
      ],
      note: 'Genre filtering is not yet supported by the upstream API. This list is for reference.',
    },
  });
}
