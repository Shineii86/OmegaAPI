# OmegaAPI

Free, public REST API for manga & manhwa data from [OmegaScans](https://omegascans.org). No authentication required.

**Powered by Next.js 14 on Vercel**

## Features

- 🔓 **No Auth** — Zero API keys, zero sign-ups
- ⚡ **Cached** — In-memory caching with configurable TTL (5–15 min)
- 🌐 **CORS Ready** — Call directly from any frontend
- 🛡️ **Rate Limited** — 60 req/min per IP with informative headers
- 📖 **Clean JSON** — Consistent `{ success, data, pagination? }` envelope
- 🎮 **Live Playground** — Interactive endpoint testing on the landing page
- 🔍 **⌘K Search** — Keyboard-navigable endpoint search modal
- 📜 **Terms & Privacy** — Full legal pages included
- 📊 **Health & Stats** — Upstream monitoring and API statistics

## Base URL

```
https://omegaapi.vercel.app/api/v1
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/series` | Browse all series with search & pagination |
| `GET` | `/api/v1/series/:slug` | Get series details (`?include=chapters` for full list) |
| `GET` | `/api/v1/chapters/:slug` | Get chapter list for a series |
| `GET` | `/api/v1/chapter/:slug/:chapter` | Get chapter content with images |
| `GET` | `/api/v1/search?q=` | Search series by title |
| `GET` | `/api/v1/genres` | List available genres |
| `GET` | `/api/v1/health` | Health check with upstream probe |
| `GET` | `/api/v1/stats` | API statistics |

## Quick Start

```bash
# Get a series
curl https://omegaapi.vercel.app/api/v1/series/sex-stopwatch

# Get series with chapters
curl "https://omegaapi.vercel.app/api/v1/series/sex-stopwatch?include=chapters"

# Search
curl "https://omegaapi.vercel.app/api/v1/search?q=solo"

# Get chapter content
curl https://omegaapi.vercel.app/api/v1/chapter/sex-stopwatch/chapter-1

# Health check
curl https://omegaapi.vercel.app/api/v1/health
```

### JavaScript

```javascript
const res = await fetch('https://omegaapi.vercel.app/api/v1/series/sex-stopwatch');
const { success, data } = await res.json();

if (success) {
  console.log(data.title);      // "Sex Stopwatch"
  console.log(data.rating);     // 4.96
  console.log(data.status);     // "Completed"
  console.log(data.chaptersCount); // 155
}
```

## Response Format

### Success (with pagination)

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "perPage": 20,
    "currentPage": 1,
    "lastPage": 5,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

### Success (single item)

```json
{
  "success": true,
  "data": { ... }
}
```

### Error

```json
{
  "success": false,
  "error": "Series not found"
}
```

## Rate Limiting

- **60 requests per minute** per IP
- Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, `X-Request-ID`
- Returns `429 Too Many Requests` when exceeded

## Caching

| Data | TTL |
|------|-----|
| Series list | 5 min |
| Search results | 10 min |
| Chapter content | 15 min |

- `X-Cache: HIT` header when served from cache

## Tech Stack

- **Framework**: Next.js 14 (App Router, Edge Runtime)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Fonts**: Space Grotesk + Outfit + JetBrains Mono
- **Deployment**: Vercel
- **Source**: [OmegaScans](https://omegascans.org) API

## Project Structure

```
src/
├── app/
│   ├── api/v1/
│   │   ├── series/route.ts           # Browse series
│   │   ├── series/[slug]/route.ts    # Series detail
│   │   ├── chapters/[slug]/route.ts  # Chapter list
│   │   ├── chapter/[slug]/[chapter]/ # Chapter content
│   │   ├── search/route.ts           # Search
│   │   ├── genres/route.ts           # Genres
│   │   ├── health/route.ts           # Health check
│   │   └── stats/route.ts            # Stats
│   ├── terms/page.tsx                # Terms of Service
│   ├── privacy/page.tsx              # Privacy Policy
│   ├── page.tsx                      # Landing page
│   ├── layout.tsx                    # Root layout
│   └── globals.css                   # Styles
└── lib/
    ├── omega.ts       # API client + normalization
    ├── cache.ts       # In-memory cache
    ├── rate-limit.ts  # Rate limiter
    └── utils.ts       # Response helpers
```

## Local Development

```bash
git clone https://github.com/your-username/OmegaAPI.git
cd OmegaAPI
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/OmegaAPI)

```bash
npm run build
npx vercel --prod
```

## Legal

OmegaAPI is a middleware layer that proxies publicly available data from [OmegaScans](https://omegascans.org). It is **not affiliated with, endorsed by, or connected to OmegaScans** in any way. All content rights belong to their respective owners.

This API is provided for educational and development purposes only. Use responsibly.

## License

MIT
