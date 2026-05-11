<div align="center">

<br />

[![](public/banner.png)](https://omegaapi.vercel.app/)

### The Fastest Free Manga & Manhwa API Built on OmegaScans

**A free, open-source REST API for manga, manhwa, and webtoon data — no authentication required.**

Built as a middleware layer on top of the [OmegaScans](https://omegascans.org) API with caching, rate limiting, error handling, and data normalization.

<br />

<a href="https://omegaapi.vercel.app/docs"><img src="https://img.shields.io/badge/Documentation-Live-0f172a?style=for-the-badge&logo=readthedocs&logoColor=white" alt="Documentation" /></a>
<a href="https://omegaapi.vercel.app/api/v1/health"><img src="https://img.shields.io/badge/Health_Check-Live-10b981?style=for-the-badge&logo=cloud&logoColor=white" alt="Health" /></a>
<a href="https://omegaapi.vercel.app/browse"><img src="https://img.shields.io/badge/Browse_Series-Live-ef4444?style=for-the-badge&logo=manga&logoColor=white" alt="Browse" /></a>

<br />

<a href="https://github.com/Shineii86/OmegaAPI/blob/main/LICENSE"><img src="https://img.shields.io/github/license/Shineii86/OmegaAPI?style=flat-square&color=0ea5e9" alt="License" /></a>
<a href="https://github.com/Shineii86/OmegaAPI/stargazers"><img src="https://img.shields.io/github/stars/Shineii86/OmegaAPI?style=flat-square&color=fbbf24" alt="Stars" /></a>
<a href="https://github.com/Shineii86/OmegaAPI/network/members"><img src="https://img.shields.io/github/forks/Shineii86/OmegaAPI?style=flat-square&color=0ea5e9" alt="Forks" /></a>
<a href="https://github.com/Shineii86/OmegaAPI/issues"><img src="https://img.shields.io/github/issues/Shineii86/OmegaAPI?style=flat-square&color=ef4444" alt="Issues" /></a>
<a href="https://github.com/Shineii86/OmegaAPI/pulls"><img src="https://img.shields.io/github/issues-pr/Shineii86/OmegaAPI?style=flat-square&color=22c55e" alt="Pull Requests" /></a>

<br />

<a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js" alt="Next.js" /></a>
<a href="https://vercel.com"><img src="https://img.shields.io/badge/Deployed_on-Vercel-black?style=flat-square&logo=vercel" alt="Vercel" /></a>
<a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" /></a>
<a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" /></a>
<a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>

<br /><br />

<a href="https://omegaapi.vercel.app/docs"><strong>Documentation</strong></a> ·
<a href="https://omegaapi.vercel.app/browse"><strong>Browse Series</strong></a> ·
<a href="https://omegaapi.vercel.app/api/v1/health"><strong>Health Status</strong></a> ·
<a href="https://github.com/Shineii86/OmegaAPI/issues/new?assignees=&labels=bug&template=bug_report.md"><strong>Report Bug</strong></a> ·
<a href="https://github.com/Shineii86/OmegaAPI/issues/new?assignees=&labels=enhancement&template=feature_request.md"><strong>Request Feature</strong></a>

</div>

---

## Table of Contents

- [About](#about)
- [Why OmegaAPI?](#why-omegaapi)
- [Key Features](#key-features)
- [Quick Start](#quick-start)
- [Base URL](#base-url)
- [API Endpoints](#api-endpoints)
  - [Browse Series](#browse-series)
  - [Series Detail](#series-detail)
  - [Chapter List](#chapter-list)
  - [Chapter Content](#chapter-content)
  - [Search](#search)
  - [Genres](#genres)
  - [Health Check](#health-check)
  - [Stats](#stats)
- [Response Format](#response-format)
- [Rate Limiting](#rate-limiting)
- [Caching](#caching)
- [Error Handling](#error-handling)
- [Code Examples](#code-examples)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Local Development](#local-development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [FAQ](#faq)
- [Legal](#legal)
- [Changelog](#changelog)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## About

**OmegaAPI** is a free, public REST API that provides comprehensive manga, manhwa, and webtoon data. It acts as a middleware layer on top of the [OmegaScans](https://omegascans.org) API, adding:

- **In-memory caching** with configurable TTL for fast responses
- **Rate limiting** with sliding window algorithm (60 req/min per IP)
- **Data normalization** for consistent, predictable JSON responses
- **Error handling** with descriptive messages and proper HTTP status codes
- **CORS support** for direct browser access from any origin
- **Browse interface** — a full manhwa-style website with search, genre filters, and series details

Whether you're building a manga reader app, a recommendation engine, a tracking tool, or a content aggregator — OmegaAPI gives you the data you need with a clean, consistent interface.

> **Why "Omega"?** — Named after OmegaScans, the upstream data source. The Ω symbol represents the final, complete API for manga data.

---

## Why OmegaAPI?

| | OmegaAPI | Other APIs |
|---|---|---|
| **Authentication** | None required | API keys, OAuth |
| **Rate Limit** | 60 req/min | Often lower or paid |
| **Response Format** | Consistent envelope | Varies by endpoint |
| **Caching** | Built-in (5–15 min) | Manual |
| **CORS** | All origins | Restricted |
| **Cost** | Free forever | Freemium/paid |
| **Browse UI** | Full manhwa website | Docs only |

---

## Key Features

| Feature | Description |
|---------|-------------|
| **Comprehensive Data** | Titles, descriptions, ratings, chapters, genres, authors, studios, cover images, alternative names, tags |
| **Sub-Second Responses** | In-memory caching with configurable TTL (5 min series, 10 min search, 15 min chapters) |
| **Full-Text Search** | Search across hundreds of series by title with pagination |
| **Chapter Images** | Get every page image URL for any chapter — perfect for building reader apps |
| **Zero Authentication** | No API keys, no sign-ups, no OAuth. Just make a request and get JSON. |
| **CORS Ready** | Call directly from any frontend — browser, mobile, desktop, browser extension |
| **Rate Limiting** | 60 req/min per IP with informative headers (`X-RateLimit-*`, `Retry-After`) |
| **Consistent Envelope** | Every response follows `{ success, data, pagination? }` — no surprises |
| **Health Monitoring** | `/api/v1/health` endpoint with upstream probe, latency, and uptime tracking |
| **Live API Playground** | Interactive endpoint testing directly from the landing page |
| **Manhwa Browse UI** | Full manhwa-style browse page with featured banner, horizontal scroll rows, genre filters, search autocomplete, and series detail modal |
| **Chapter Reader** | Built-in vertical and paged reading modes with prev/next chapter navigation |
| **Terms & Privacy** | Full Terms of Service and Privacy Policy pages included |
| **Neo-Brutalist UI** | Bold personality with frosted glass nav, brutalist cards, spring animations, dark manhwa theme |

---

## Quick Start

**No API key needed.** Just make a request:

```bash
# Get a series
curl https://omegaapi.vercel.app/api/v1/series/sex-stopwatch

# Search for a series
curl "https://omegaapi.vercel.app/api/v1/search?q=solo"

# Get chapter content with images
curl https://omegaapi.vercel.app/api/v1/chapter/sex-stopwatch/chapter-1

# Check API health
curl https://omegaapi.vercel.app/api/v1/health
```

<details>
<summary><strong>Try it in JavaScript</strong></summary>

```javascript
const res = await fetch('https://omegaapi.vercel.app/api/v1/series/sex-stopwatch');
const { success, data } = await res.json();

if (success) {
  console.log(data.title);         // "Sex Stopwatch"
  console.log(data.rating);        // 4.96
  console.log(data.chaptersCount); // 155
  console.log(data.status);        // "Completed"
}
```

</details>

---

## Base URL

```
https://omegaapi.vercel.app/api/v1
```

| Property | Value |
|----------|-------|
| **Protocol** | HTTPS only (HTTP auto-redirects) |
| **Method** | GET only (all endpoints) |
| **Auth** | None required |
| **CORS** | All origins allowed |
| **Content-Type** | `application/json` |
| **Rate Limit** | 60 requests/min per IP |

---

## API Endpoints

### Browse Series

```
GET /api/v1/series
```

Browse all series with search and pagination.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | `1` | Page number |
| `perPage` | integer | No | `20` | Results per page (max 100) |
| `q` | string | No | — | Search query to filter results |

```bash
# Browse all series
curl https://omegaapi.vercel.app/api/v1/series

# Paginated, 5 per page
curl "https://omegaapi.vercel.app/api/v1/series?page=1&perPage=5"

# Search within browse
curl "https://omegaapi.vercel.app/api/v1/series?q=solo"
```

---

### Series Detail

```
GET /api/v1/series/{slug}
```

Get complete information for a single series including metadata, ratings, cover images, authors, and tags.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `slug` | string | **Yes** | URL-friendly series identifier (e.g., `sex-stopwatch`, `solo-leveling`) |
| `include` | string | No | Pass `include=chapters` to embed the full chapter list |

```bash
# Standard response
curl https://omegaapi.vercel.app/api/v1/series/sex-stopwatch

# With full chapter list
curl "https://omegaapi.vercel.app/api/v1/series/sex-stopwatch?include=chapters"
```

<details>
<summary><strong>Full Response Example</strong></summary>

```json
{
  "success": true,
  "data": {
    "id": 7,
    "title": "Sex Stopwatch",
    "slug": "sex-stopwatch",
    "description": "When a man discovers a mysterious stopwatch...",
    "rating": 4.96,
    "status": "Completed",
    "type": "Manhwa",
    "totalViews": 20110784,
    "chaptersCount": 155,
    "bookmarksCount": 12840,
    "alternativeNames": "Sex Stopwatch",
    "author": "Author Name",
    "studio": "Studio Name",
    "releaseYear": "2023",
    "releaseSchedule": ["Monday", "Thursday"],
    "tags": ["Adult", "Comedy", "Drama"],
    "thumbnail": "https://media.omegascans.org/.../thumb.jpg",
    "cover": "https://media.omegascans.org/.../cover.jpg",
    "badge": null,
    "chapters": [
      {
        "id": 10811,
        "name": "Chapter 155",
        "slug": "chapter-155",
        "isFree": true,
        "price": 0,
        "index": "155.0",
        "createdAt": "2025-08-12T02:07:27.261+00:00"
      }
    ]
  }
}
```

</details>

---

### Chapter List

```
GET /api/v1/chapters/{slug}
```

Get all chapters for a series with pagination.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `slug` | string | **Yes** | — | Series slug |
| `page` | integer | No | `1` | Page number |
| `perPage` | integer | No | `100` | Results per page (max 500) |

```bash
# Get all chapters
curl https://omegaapi.vercel.app/api/v1/chapters/sex-stopwatch

# Paginated
curl "https://omegaapi.vercel.app/api/v1/chapters/sex-stopwatch?page=1&perPage=50"
```

---

### Chapter Content

```
GET /api/v1/chapter/{slug}/{chapter}
```

Get chapter content with all page image URLs. Perfect for building reader interfaces.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `slug` | string | **Yes** | Series slug |
| `chapter` | string | **Yes** | Chapter slug (e.g., `chapter-1`, `chapter-155`) |

```bash
# Get chapter images
curl https://omegaapi.vercel.app/api/v1/chapter/sex-stopwatch/chapter-1
```

<details>
<summary><strong>Response Example</strong></summary>

```json
{
  "success": true,
  "data": {
    "id": 10944,
    "name": "Chapter 1",
    "slug": "chapter-1",
    "pageCount": 13,
    "images": [
      "https://media.omegascans.org/.../01.jpg",
      "https://media.omegascans.org/.../02.jpg",
      "https://media.omegascans.org/.../03.jpg"
    ],
    "series": {
      "id": 7,
      "title": "Sex Stopwatch",
      "slug": "sex-stopwatch",
      "thumbnail": "https://media.omegascans.org/.../thumb.jpg",
      "status": "Completed"
    }
  }
}
```

</details>

---

### Search

```
GET /api/v1/search?q={query}
```

Full-text search across all series by title.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `q` | string | **Yes** | — | Search query |
| `page` | integer | No | `1` | Page number |

```bash
# Search
curl "https://omegaapi.vercel.app/api/v1/search?q=solo"

# Paginated
curl "https://omegaapi.vercel.app/api/v1/search?q=nano&page=2"
```

---

### Genres

```
GET /api/v1/genres
```

Returns all supported genre categories.

```bash
curl https://omegaapi.vercel.app/api/v1/genres
```

<details>
<summary><strong>Response Example</strong></summary>

```json
{
  "success": true,
  "data": {
    "genres": ["Action", "Adult", "Comedy", "Drama", "Fantasy", "Horror", "Romance", "Sci-Fi"]
  }
}
```

</details>

---

### Health Check

```
GET /api/v1/health
```

Returns API health status, upstream connectivity, and latency.

```bash
curl https://omegaapi.vercel.app/api/v1/health
```

<details>
<summary><strong>Response Example</strong></summary>

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "uptime": 86400,
    "upstream": {
      "status": "ok",
      "latencyMs": 180
    }
  }
}
```

</details>

---

### Stats

```
GET /api/v1/stats
```

Returns API statistics including version, cache info, and endpoint listing.

```bash
curl https://omegaapi.vercel.app/api/v1/stats
```

---

## Response Format

Every API response follows a consistent envelope format:

### Success (with pagination)

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 250,
    "perPage": 20,
    "currentPage": 1,
    "lastPage": 13,
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

---

## Rate Limiting

| Setting | Value |
|---------|-------|
| **Limit** | 60 requests per minute |
| **Window** | Rolling 60-second window |
| **Scope** | Per IP address |

### Response Headers

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Maximum requests allowed (60) |
| `X-RateLimit-Remaining` | Requests remaining in current window |
| `X-RateLimit-Reset` | Unix timestamp when window resets |
| `X-Request-ID` | Unique UUID for request tracing |
| `Retry-After` | Seconds to wait (only on 429 responses) |

### Handling Rate Limits

```javascript
const response = await fetch('https://omegaapi.vercel.app/api/v1/series/sex-stopwatch');

if (response.status === 429) {
  const retryAfter = response.headers.get('Retry-After');
  console.log(`Rate limited. Retry after ${retryAfter} seconds.`);
  await new Promise(r => setTimeout(r, retryAfter * 1000));
  // Retry the request...
}

const requestId = response.headers.get('X-Request-ID');
console.log(`Request ID: ${requestId}`);
```

---

## Caching

| Resource | Cache TTL | Description |
|----------|-----------|-------------|
| Series list | 5 minutes | Browse series with pagination |
| Series detail | 5 minutes | Individual series data |
| Search results | 10 minutes | Search query results |
| Chapter content | 15 minutes | Chapter images and metadata |
| Genres | 30 minutes | Genre list |

Cached responses include an `X-Cache: HIT` header. The `Cache-Control: public, s-maxage=300` header enables Vercel's edge cache for additional performance.

---

## Error Handling

### HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| `200` | OK | Request successful |
| `400` | Bad Request | Invalid parameters or missing required fields |
| `404` | Not Found | The requested resource does not exist |
| `429` | Too Many Requests | Rate limit exceeded (60 req/min) |
| `500` | Server Error | Upstream API returned an error |
| `503` | Service Unavailable | API is degraded (check `/health`) |

---

## Code Examples

<details>
<summary><strong>JavaScript (fetch)</strong></summary>

```javascript
// Get series details
const res = await fetch('https://omegaapi.vercel.app/api/v1/series/sex-stopwatch');
const { success, data } = await res.json();

if (success) {
  console.log(`Title: ${data.title}`);
  console.log(`Rating: ${data.rating}`);
  console.log(`Chapters: ${data.chaptersCount}`);
}

// Search
const search = await fetch('https://omegaapi.vercel.app/api/v1/search?q=solo');
const { data: results } = await search.json();
results.forEach(series => {
  console.log(`${series.title} — ${series.rating}`);
});

// Build a reader
const chapter = await fetch(
  'https://omegaapi.vercel.app/api/v1/chapter/sex-stopwatch/chapter-1'
);
const { data: ch } = await chapter.json();
ch.images.forEach((url, i) => {
  const img = document.createElement('img');
  img.src = url;
  img.alt = `Page ${i + 1}`;
  document.getElementById('reader').appendChild(img);
});
```

</details>

<details>
<summary><strong>Python</strong></summary>

```python
import requests

BASE_URL = "https://omegaapi.vercel.app/api/v1"

# Get a series
response = requests.get(f"{BASE_URL}/series/sex-stopwatch")
data = response.json()

if data["success"]:
    series = data["data"]
    print(f"Title: {series['title']}")
    print(f"Rating: {series['rating']}")
    print(f"Chapters: {series['chaptersCount']}")

# Search
response = requests.get(f"{BASE_URL}/search", params={"q": "solo leveling"})
results = response.json()["data"]
for series in results:
    print(f"{series['title']}: {series['chaptersCount']} chapters")

# Get chapter images
response = requests.get(f"{BASE_URL}/chapter/sex-stopwatch/chapter-1")
chapter = response.json()["data"]
print(f"Pages: {chapter['pageCount']}")
for url in chapter["images"]:
    print(url)
```

</details>

<details>
<summary><strong>cURL + jq</strong></summary>

```bash
# Get series title
curl -s https://omegaapi.vercel.app/api/v1/series/sex-stopwatch | jq '.data.title'

# Search and extract names
curl -s "https://omegaapi.vercel.app/api/v1/search?q=solo" | jq '.data[].title'

# Get chapter image count
curl -s https://omegaapi.vercel.app/api/v1/chapter/sex-stopwatch/chapter-1 | jq '.data.pageCount'

# List all genres
curl -s https://omegaapi.vercel.app/api/v1/genres | jq '.data.genres'

# Health check
curl -s https://omegaapi.vercel.app/api/v1/health | jq '.data.status'
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
package main

import (
    "encoding/json"
    "fmt"
    "net/http"
)

type Response struct {
    Success bool        `json:"success"`
    Data    interface{} `json:"data"`
}

func main() {
    resp, _ := http.Get("https://omegaapi.vercel.app/api/v1/series/sex-stopwatch")
    defer resp.Body.Close()

    var result Response
    json.NewDecoder(resp.Body).Decode(&result)
    fmt.Printf("Success: %v\n", result.Success)
}
```

</details>

<details>
<summary><strong>PHP</strong></summary>

```php
<?php
$response = file_get_contents('https://omegaapi.vercel.app/api/v1/series/sex-stopwatch');
$data = json_decode($response, true);

if ($data['success']) {
    echo "Title: " . $data['data']['title'] . "\n";
    echo "Rating: " . $data['data']['rating'] . "\n";
    echo "Chapters: " . $data['data']['chaptersCount'] . "\n";
}
?>
```

</details>

<details>
<summary><strong>Ruby</strong></summary>

```ruby
require 'net/http'
require 'json'

uri = URI('https://omegaapi.vercel.app/api/v1/series/sex-stopwatch')
response = JSON.parse(Net::HTTP.get(uri))

puts "Title: #{response['data']['title']}"
puts "Rating: #{response['data']['rating']}"
puts "Chapters: #{response['data']['chaptersCount']}"
```

</details>

---

## Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Runtime** | Node.js 18+ | Server-side JavaScript |
| **Framework** | Next.js 14 (App Router) | API routes, SSR, middleware |
| **Language** | TypeScript 5 | Type-safe development |
| **Data Source** | OmegaScans API | Upstream manga/manhwa data |
| **Caching** | In-memory (Map) | Response caching with configurable TTL |
| **Rate Limiting** | Custom middleware | Sliding window algorithm per IP |
| **Styling** | Tailwind CSS 3 | Neo-brutalist design system |
| **Deployment** | Vercel | Serverless edge functions |

---

## Project Structure

```
OmegaAPI/
├── public/
│   ├── favicon.svg                       # Site favicon
│   ├── favicon-16.png                    # Favicon 16x16
│   ├── favicon-32.png                    # Favicon 32x32
│   ├── apple-touch-icon.png              # Apple touch icon
│   ├── og-image.png                      # Open Graph social image
│   └── robots.txt                        # Search engine crawl rules
├── src/
│   ├── app/
│   │   ├── api/v1/
│   │   │   ├── series/
│   │   │   │   ├── route.ts              # GET /api/v1/series
│   │   │   │   └── [slug]/route.ts       # GET /api/v1/series/:slug
│   │   │   ├── chapters/[slug]/route.ts  # GET /api/v1/chapters/:slug
│   │   │   ├── chapter/[slug]/[chapter]/ # GET /api/v1/chapter/:slug/:chapter
│   │   │   ├── search/route.ts           # GET /api/v1/search
│   │   │   ├── genres/route.ts           # GET /api/v1/genres
│   │   │   ├── health/route.ts           # GET /api/v1/health
│   │   │   └── stats/route.ts            # GET /api/v1/stats
│   │   ├── browse/
│   │   │   ├── page.tsx                  # Manhwa-style browse page
│   │   │   └── [slug]/
│   │   │       ├── page.tsx              # Series detail page
│   │   │       └── [chapter]/page.tsx    # Chapter reader
│   │   ├── docs/page.tsx                 # Full API documentation
│   │   ├── support/page.tsx              # Support & FAQ
│   │   ├── terms/page.tsx                # Terms of Service
│   │   ├── privacy/page.tsx              # Privacy Policy
│   │   ├── page.tsx                      # Landing page
│   │   ├── layout.tsx                    # Root layout with SEO metadata
│   │   ├── globals.css                   # Design system (tokens, animations)
│   │   └── sitemap.ts                    # Dynamic sitemap
│   ├── components/
│   │   ├── icons.tsx                     # SVG icon library (35+ icons)
│   │   ├── layout.tsx                    # Navbar + Footer components
│   │   └── ui.tsx                        # Shared UI utilities
│   ├── lib/
│   │   ├── omega.ts                      # OmegaScans API client
│   │   ├── cache.ts                      # In-memory cache with TTL
│   │   ├── rate-limit.ts                 # Rate limiter
│   │   └── utils.ts                      # Response helpers
│   └── types/index.ts                    # TypeScript type definitions
├── CHANGELOG.md                          # Version history
├── LICENSE                               # MIT License
├── README.md                             # This file
├── next.config.js                        # Next.js configuration
├── tailwind.config.js                    # Tailwind CSS configuration
├── tsconfig.json                         # TypeScript configuration
├── package.json                          # Dependencies and scripts
└── vercel.json                           # Vercel deployment config
```

---

## Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- [npm](https://npmjs.com/) 9 or later

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/Shineii86/OmegaAPI.git
cd OmegaAPI

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The API will be available at [http://localhost:3000](http://localhost:3000).

### Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `npm run dev` | `next dev` | Start development server with hot reload |
| `npm run build` | `next build` | Build for production |
| `npm start` | `next start` | Start production server |
| `npm run lint` | `next lint` | Run ESLint |

### Testing Locally

```bash
# Health check
curl http://localhost:3000/api/v1/health

# Browse series
curl "http://localhost:3000/api/v1/series?page=1&perPage=5"

# Search
curl "http://localhost:3000/api/v1/search?q=solo"

# Chapter content
curl http://localhost:3000/api/v1/chapter/sex-stopwatch/chapter-1
```

---

## Deployment

### Vercel (Recommended)

1. **Fork** this repository
2. Go to [vercel.com/new](https://vercel.com/new)
3. **Import** your forked repository
4. Click **Deploy** — no environment variables needed!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Shineii86/OmegaAPI)

### Other Platforms

OmegaAPI is a standard Next.js application. Deploy anywhere that supports Node.js:

| Platform | Command | Notes |
|----------|---------|-------|
| **Vercel** | `vercel` | Zero config, recommended |
| **Railway** | `railway up` | Easy setup |
| **Render** | Connect repo | Auto-deploy on push |
| **Fly.io** | `fly deploy` | Edge deployment |
| **Self-hosted** | `npm run build && npm start` | Full control |

---

## Contributing

Contributions are welcome! Here's how to help:

- **Report bugs** — [Open an issue](https://github.com/Shineii86/OmegaAPI/issues/new?assignees=&labels=bug&template=bug_report.md)
- **Request features** — [Open an issue](https://github.com/Shineii86/OmegaAPI/issues/new?assignees=&labels=enhancement&template=feature_request.md)
- **Improve docs** — Fix typos, add examples, clarify explanations
- **Submit code** — Fix bugs or implement new features

```bash
# 1. Fork the repository
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/OmegaAPI.git
cd OmegaAPI

# 3. Create a feature branch
git checkout -b feature/amazing-feature

# 4. Make your changes
# 5. Test thoroughly
npm run build

# 6. Commit with conventional commits
git commit -m 'feat: add amazing feature'

# 7. Push and create a Pull Request
git push origin feature/amazing-feature
```

---

## FAQ

<details>
<summary><strong>Is OmegaAPI really free?</strong></summary>

Yes! OmegaAPI is completely free and always will be. No API keys, no sign-ups, no hidden costs.
</details>

<details>
<summary><strong>Do I need an API key?</strong></summary>

No! Just make a request and get your data. Zero authentication required.
</details>

<details>
<summary><strong>What are the rate limits?</strong></summary>

60 requests per minute per IP address. Rate limit headers are included in every response. If you hit the limit, check the `Retry-After` header.
</details>

<details>
<summary><strong>Can I use this in my frontend?</strong></summary>

Yes! CORS is enabled for all origins. You can call the API directly from any browser, mobile app, or desktop application.
</details>

<details>
<summary><strong>Where does the data come from?</strong></summary>

OmegaAPI wraps the OmegaScans API (omegascans.org), normalizing and caching the data for easier consumption. OmegaAPI is not affiliated with or endorsed by OmegaScans.
</details>

<details>
<summary><strong>How often is the data updated?</strong></summary>

Data is fetched from OmegaScans in real-time and cached for 5–15 minutes depending on the endpoint. This balances freshness with performance.
</details>

<details>
<summary><strong>Can I use this commercially?</strong></summary>

Yes! OmegaAPI is released under the MIT License, which allows commercial use. Please be mindful of the rate limits.
</details>

<details>
<summary><strong>Can I self-host this?</strong></summary>

Yes! Clone the repo, run `npm install`, and deploy to Vercel, Railway, Render, Fly.io, or any Node.js host. See [Deployment](#deployment).
</details>

<details>
<summary><strong>How do I report a bug?</strong></summary>

Open an issue on our [GitHub Issues](https://github.com/Shineii86/OmegaAPI/issues) page with steps to reproduce.
</details>

---

## Legal Disclaimer

This project is **unofficial** and **not affiliated with or endorsed by OmegaScans**.

- This API acts as a middleware/proxy to the official OmegaScans backend
- No content is hosted or redistributed
- Rate limiting is enforced to avoid overloading upstream
- Use responsibly and respect the original site's terms of service

---

## Legal

- **[Terms of Service](https://omegaapi.vercel.app/terms)** — Rules governing API usage
- **[Privacy Policy](https://omegaapi.vercel.app/privacy)** — Data collection and privacy practices
- **[MIT License](https://github.com/Shineii86/OmegaAPI/blob/main/LICENSE)** — Open source license

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed version history.

### Latest: v3.0.1 (2026-05-11)

- **Neo-Brutalist landing page** — Cool navy/cyan/amber design with brutalist cards, terminal code blocks, reveal animations, recipe tabs, live playground
- **Manhwa-style browse page** — Dark theme, featured banner, horizontal scroll rows, genre filters, search autocomplete, series detail modal
- **Chapter reader** — Vertical and paged reading modes with prev/next chapter navigation
- **Dual-theme design system** — Light landing, dark browse, frosted glass nav
- **35+ SVG icons** — Complete icon library with consistent sizing
- **TypeScript** — Full type safety across all components and API routes

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

| Project | Description |
|---------|-------------|
| [OmegaScans](https://omegascans.org) | The underlying manga/manhwa data source |
| [Next.js](https://nextjs.org) | The React framework for production |
| [Vercel](https://vercel.com) | Deployment and hosting platform |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first CSS framework |
| [ShineiAPI](https://github.com/Shineii86/ShineiAPI) | Design inspiration and reference |

---

<div align="center">

**Built with care by [Shinei Nouzen](https://github.com/Shineii86)**

<br />

<a href="https://github.com/Shineii86/OmegaAPI/stargazers">Star this repo</a> ·
<a href="https://github.com/Shineii86/OmegaAPI/fork">Fork it</a> ·
<a href="https://github.com/Shineii86/OmegaAPI/issues/new">Report issue</a>

</div>
