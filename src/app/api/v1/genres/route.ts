/**
 * ┌─────────────────────────────────────────────────────────────┐
 * │  OmegaAPI — Genres Endpoint                                │
 * │  Author : Sʜɪɴᴇɪ Nᴏᴜᴢᴇɴ                                   │
 * │  License: MIT                                              │
 * │  Route  : GET /api/v1/genres                               │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Return the static list of known genres.
 *
 * NOTE: The upstream OmegaScans API does not support genre-based
 * filtering or provide a genre index endpoint. This list is
 * hardcoded from observed series tags for reference purposes.
 *
 * Response: ApiResponse<{ genres: string[], note: string }>
 */

import { successResponse } from '@/lib/utils';

export const runtime = 'edge';

// ==================== HANDLER ====================

// ---- FEATURE: GENRE LIST ----

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

// ==================== EOF ====================
