> [!WARNING]
> **This API Provides Access To Mature/Adult Manga And Manhwa Content**. By Using This API Or Its Browse Interface, You Confirm That You Are At Least **18 Years Of Age**. Parental Discretion Is Advised.

<div align="center">

<img src="public/banner.png" alt="OmegaAPI Banner" width="100%" />

<br />

# Ω OmegaAPI

### The Fastest Free Manga & Manhwa REST API

**A free, open-source REST API for manga, manhwa, and webtoon data — no authentication required.**

Built as a middleware layer on top of [OmegaScans](https://omegascans.org) with caching, rate limiting, retry logic, data normalization, and a full browse interface.

<br />

<a href="https://omegaapi.vercel.app/docs"><img src="https://img.shields.io/badge/📖_Documentation-Live-0f172a?style=for-the-badge&logo=readthedocs&logoColor=white" alt="Documentation" /></a>
<a href="https://omegaapi.vercel.app/api/v1/health"><img src="https://img.shields.io/badge/💓_Health_Check-Live-10b981?style=for-the-badge&logo=cloud&logoColor=white" alt="Health" /></a>
<a href="https://omegaapi.vercel.app/browse"><img src="https://img.shields.io/badge/📚_Browse_Series-Live-ef4444?style=for-the-badge&logo=manga&logoColor=white" alt="Browse" /></a>
<a href="https://omegaapi.vercel.app/api/v1/stats"><img src="https://img.shields.io/badge/📊_Stats-Live-fbbf24?style=for-the-badge&logo=chartdotjs&logoColor=black" alt="Stats" /></a>

<br /><br />

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
<img src="https://img.shields.io/badge/Version-3.9.0-ef4444?style=flat-square" alt="Version" />

<br /><br />

<a href="https://omegaapi.vercel.app/docs"><strong>📖 Documentation</strong></a> ·
<a href="https://omegaapi.vercel.app/browse"><strong>📚 Browse Series</strong></a> ·
<a href="https://omegaapi.vercel.app/api/v1/health"><strong>💓 Health Status</strong></a> ·
<a href="https://github.com/Shineii86/OmegaAPI/issues/new?assignees=&labels=bug&template=bug_report.md"><strong>🐛 Report Bug</strong></a> ·
<a href="https://github.com/Shineii86/OmegaAPI/issues/new?assignees=&labels=enhancement&template=feature_request.md"><strong>✨ Request Feature</strong></a>

</div>

---

## 📑 Table of Contents

- [📖 About](#-about)
- [🤔 Why OmegaAPI?](#-why-omegaapi)
- [✨ Key Features](#-key-features)
- [📡 API Endpoints](#-api-endpoints)
- [🚀 Quick Start](#-quick-start)
- [📦 Response Format](#-response-format)
- [⏱️ Rate Limiting](#️-rate-limiting)
- [💾 Caching](#-caching)
- [🔄 Retry Logic](#-retry-logic)
- [🚨 Error Handling](#-error-handling)
- [💻 Code Examples](#-code-examples)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [⚙️ Local Development](#️-local-development)
- [🚢 Deployment](#-deployment)
- [🗺️ Roadmap](#️-roadmap)
- [🤝 Contributing](#-contributing)
- [❓ FAQ](#-faq)
- [⚠️ Legal Disclaimer](#️-legal-disclaimer)
- [📋 Changelog](#-changelog)
- [📝 License](#-license)
- [🙏 Acknowledgments](#-acknowledgments)

---

<a id="-about"></a>

## 📖 About

**OmegaAPI** is a free, public REST API that provides comprehensive manga, manhwa, and webtoon data. It acts as a middleware layer on top of the [OmegaScans](https://omegascans.org) API, adding:

- **In-memory caching** with configurable TTL (5–15 min) for sub-second responses
- **Rate limiting** with sliding window algorithm (60 req/min per IP)
- **Retry logic** with automatic single retry on 5xx upstream errors
- **Data normalization** for consistent, predictable JSON responses
- **Error handling** with descriptive messages and proper HTTP status codes
- **CORS support** for direct browser access from any origin
- **Pagination headers** for programmatic access to metadata
- **Sorting & filtering** on series list endpoints
- **Browse interface** — a full manhwa-style website with search, genre filters, chapter reader, bookmarks, and reading history

Whether you're building a manga reader app, a recommendation engine, a tracking tool, or a content aggregator — OmegaAPI gives you the data you need with a clean, consistent interface.

> **Why "Omega"?** — Named after OmegaScans, the upstream data source. The Ω symbol represents the final, complete API for manga data.

---

<a id="-why-omegaapi"></a>

## 🤔 Why OmegaAPI?

<table>
<tr>
<th></th>
<th>OmegaAPI</th>
<th>Other APIs</th>
</tr>
<tr>
<td><strong>🔐 Authentication</strong></td>
<td>None required</td>
<td>API keys, OAuth</td>
</tr>
<tr>
<td><strong>⏱️ Rate Limit</strong></td>
<td>60 req/min</td>
<td>Often lower or paid</td>
</tr>
<tr>
<td><strong>📦 Response Format</strong></td>
<td>Consistent envelope</td>
<td>Varies by endpoint</td>
</tr>
<tr>
<td><strong>💾 Caching</strong></td>
<td>Built-in (5–15 min)</td>
<td>Manual</td>
</tr>
<tr>
<td><strong>🔄 Retry Logic</strong></td>
<td>Auto-retry on 5xx</td>
<td>Manual</td>
</tr>
<tr>
<td><strong>📊 Pagination Headers</strong></td>
<td>X-Pagination-*</td>
<td>Body only</td>
</tr>
<tr>
<td><strong>🔀 Sort & Filter</strong></td>
<td>?sort=&status=&type=</td>
<td>Client-side</td>
</tr>
<tr>
<td><strong>🌐 CORS</strong></td>
<td>All origins</td>
<td>Restricted</td>
</tr>
<tr>
<td><strong>💰 Cost</strong></td>
<td>Free forever</td>
<td>Freemium/paid</td>
</tr>
<tr>
<td><strong>🖥️ Browse UI</strong></td>
<td>Full manhwa website</td>
<td>Docs only</td>
</tr>
</table>

---

<a id="-key-features"></a>

## ✨ Key Features

### 📡 API

| Feature | Description |
|---------|-------------|
| 📚 **263+ Series** | Titles, descriptions, ratings, chapters, genres, authors, studios, cover images, tags |
| ⚡ **Sub-Second Responses** | In-memory caching (5 min series, 10 min search, 15 min chapters) |
| 🔍 **Full-Text Search** | Search across hundreds of series with pagination |
| 🖼️ **Chapter Images** | Every page image URL for any chapter — build reader apps |
| 🔀 **Sort & Filter** | `?sort=rating&order=desc&status=ongoing&type=manhwa` |
| 🎲 **Random Discovery** | `/api/v1/random` endpoint for series discovery |
| 📊 **Pagination Headers** | `X-Pagination-Total`, `X-Per-Page`, `X-Current-Page` in headers |
| 🔓 **Zero Auth** | No API keys, no sign-ups, no OAuth |
| 🌐 **CORS Ready** | Call from any frontend — browser, mobile, desktop |
| 🛡️ **Rate Limiting** | 60 req/min per IP with `X-RateLimit-*` headers |
| 📦 **Consistent Envelope** | Every response: `{ success, data, pagination? }` |
| 🔄 **Auto Retry** | Single retry on 5xx upstream errors |
| 💓 **Health Monitoring** | Upstream probe with latency tracking, cached 30s |
| 🖼️ **OG Image Generator** | `/api/og` for dynamic social sharing images |

### 🖥️ Frontend

| Feature | Description |
|---------|-------------|
| 📱 **Manhwa Browse UI** | Featured banner, scroll rows, genre filters, search autocomplete |
| 📖 **Chapter Reader** | Vertical and paged reading modes with prev/next navigation |
| ❤️ **Bookmarks / My List** | Heart button on cards, dedicated scroll row |
| 📜 **Reading History** | Track progress with "Continue Reading" row and progress bars |
| 🔍 **Recent Searches** | Shown in search overlay with clear history option |
| 📌 **Reading Position** | Scroll position saved per chapter, restored on revisit |
| 🔞 **Age Verification** | 18+ gate with localStorage persistence |
| 🎨 **Neo-Brutalist UI** | Bold cards, frosted glass nav, spring animations |
| 🌙 **Dark Theme** | Immersive manhwa reading experience |
| 📱 **Responsive** | Mobile-first, works on all screen sizes |
| 🎭 **Dual Theme** | Light landing page, dark browse pages |
| ⚡ **Error Boundary** | Graceful error recovery on all browse pages |

---

<a id="-api-endpoints"></a>

## 📡 API Endpoints

### 🌐 Base URL

```
https://omegaapi.vercel.app/api/v1
```

| Property | Value |
|----------|-------|
| **Protocol** | HTTPS only |
| **Method** | GET only |
| **Auth** | None required |
| **CORS** | All origins |
| **Content-Type** | `application/json` |
| **Rate Limit** | 60 req/min per IP |

---

### 📚 Browse Series

```
GET /api/v1/series
```

Browse all series with search, sorting, filtering, and pagination.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | `1` | Page number |
| `perPage` | integer | `20` | Results per page (max 100) |
| `q` | string | — | Search query to filter by title |
| `sort` | string | — | Sort by: `title`, `rating`, `views`, `updated` |
| `order` | string | `desc` | Sort direction: `asc`, `desc` |
| `status` | string | — | Filter: `ongoing`, `completed`, `hiatus` |
| `type` | string | — | Filter: `manga`, `manhwa`, `manhua` |

```bash
# Browse all series
curl https://omegaapi.vercel.app/api/v1/series

# Sort by rating, descending
curl "https://omegaapi.vercel.app/api/v1/series?sort=rating&order=desc"

# Filter ongoing manhwa
curl "https://omegaapi.vercel.app/api/v1/series?status=ongoing&type=manhwa"
```

---

### 📖 Series Detail

```
GET /api/v1/series/{slug}
```

Get complete metadata for a single series.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `slug` | string | ✅ | Series identifier |
| `include` | string | — | Pass `chapters` to embed full chapter list |

```bash
curl https://omegaapi.vercel.app/api/v1/series/sex-stopwatch
curl "https://omegaapi.vercel.app/api/v1/series/sex-stopwatch?include=chapters"
```

<details>
<summary><strong>📄 Full Response</strong></summary>

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
    "chapters": []
  }
}
```

</details>

---

### 📑 Chapter List

```
GET /api/v1/chapters/{slug}
GET /api/v1/series/{slug}/chapters    ← RESTful alias
```

Get all chapters for a series with pagination.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `slug` | string | — | Series slug |
| `page` | integer | `1` | Page number |
| `perPage` | integer | `100` | Results per page (max 500) |

```bash
curl https://omegaapi.vercel.app/api/v1/chapters/sex-stopwatch
curl https://omegaapi.vercel.app/api/v1/series/sex-stopwatch/chapters
```

---

### 📄 Chapter Content

```
GET /api/v1/chapter/{slug}/{chapter}
```

Get chapter content with all page image URLs.

```bash
curl https://omegaapi.vercel.app/api/v1/chapter/sex-stopwatch/chapter-1
```

<details>
<summary><strong>📄 Response</strong></summary>

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
      "https://media.omegascans.org/.../02.jpg"
    ],
    "series": {
      "title": "Sex Stopwatch",
      "slug": "sex-stopwatch"
    }
  }
}
```

</details>

---

### 🔍 Search

```
GET /api/v1/search?q={query}
```

Full-text search across all series.

```bash
curl "https://omegaapi.vercel.app/api/v1/search?q=solo"
```

---

### 🎲 Random Series

```
GET /api/v1/random
```

Get a random series for discovery.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `count` | integer | `1` | Number of random series (max 10) |

```bash
curl https://omegaapi.vercel.app/api/v1/random
curl "https://omegaapi.vercel.app/api/v1/random?count=5"
```

---

### 🏷️ Genres

```
GET /api/v1/genres
```

Returns all 24 supported genre categories.

```bash
curl https://omegaapi.vercel.app/api/v1/genres
```

---

### 💓 Health Check

```
GET /api/v1/health
```

API health status with upstream probe (cached 30s).

```bash
curl https://omegaapi.vercel.app/api/v1/health
```

<details>
<summary><strong>📄 Response</strong></summary>

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "version": "3.9.0",
    "uptime": 86400,
    "upstream": {
      "status": "ok",
      "latencyMs": 180,
      "url": "https://api.omegascans.org",
      "cached": true
    }
  }
}
```

</details>

---

### 📊 Stats

```
GET /api/v1/stats
```

API statistics, endpoint listing, cache state, and version info.

```bash
curl https://omegaapi.vercel.app/api/v1/stats
```

---

### 🖼️ OG Image Generator

```
GET /api/og?title={title}&rating={rating}&views={views}&status={status}
```

Generate dynamic SVG Open Graph images for social sharing.

```bash
curl "https://omegaapi.vercel.app/api/og?title=Solo%20Leveling&rating=4.9&views=15M&status=Completed"
```

---

<a id="-quick-start"></a>

## 🚀 Quick Start

**No API key needed.** Just make a request:

```bash
# Get a series
curl https://omegaapi.vercel.app/api/v1/series/sex-stopwatch

# Search
curl "https://omegaapi.vercel.app/api/v1/search?q=solo"

# Get chapter images
curl https://omegaapi.vercel.app/api/v1/chapter/sex-stopwatch/chapter-1

# Random series
curl https://omegaapi.vercel.app/api/v1/random

# Check health
curl https://omegaapi.vercel.app/api/v1/health
```

<details>
<summary><strong>JavaScript</strong></summary>

```javascript
const res = await fetch('https://omegaapi.vercel.app/api/v1/series/sex-stopwatch');
const { success, data } = await res.json();

if (success) {
  console.log(data.title);         // "Sex Stopwatch"
  console.log(data.rating);        // 4.96
  console.log(data.chaptersCount); // 155
}
```

</details>

<details>
<summary><strong>Python</strong></summary>

```python
import requests

BASE = "https://omegaapi.vercel.app/api/v1"

# Get a series
data = requests.get(f"{BASE}/series/sex-stopwatch").json()
print(data["data"]["title"], data["data"]["rating"])

# Search
results = requests.get(f"{BASE}/search", params={"q": "solo"}).json()
for s in results["data"]:
    print(f"{s['title']} — {s['rating']}")
```

</details>

<details>
<summary><strong>cURL + jq</strong></summary>

```bash
# Series title
curl -s https://omegaapi.vercel.app/api/v1/series/sex-stopwatch | jq '.data.title'

# Search results
curl -s "https://omegaapi.vercel.app/api/v1/search?q=solo" | jq '.data[].title'

# Chapter page count
curl -s https://omegaapi.vercel.app/api/v1/chapter/sex-stopwatch/chapter-1 | jq '.data.pageCount'
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
    Success bool                   `json:"success"`
    Data    map[string]interface{} `json:"data"`
}

func main() {
    resp, _ := http.Get("https://omegaapi.vercel.app/api/v1/series/sex-stopwatch")
    defer resp.Body.Close()

    var result Response
    json.NewDecoder(resp.Body).Decode(&result)
    fmt.Println(result.Data["title"])
}
```

</details>

<details>
<summary><strong>PHP</strong></summary>

```php
<?php
$data = json_decode(file_get_contents(
    'https://omegaapi.vercel.app/api/v1/series/sex-stopwatch'
), true);

echo $data['data']['title'] . ' — ' . $data['data']['rating'];
```

</details>

<details>
<summary><strong>Ruby</strong></summary>

```ruby
require 'net/http'
require 'json'

data = JSON.parse(Net::HTTP.get(URI(
    'https://omegaapi.vercel.app/api/v1/series/sex-stopwatch'
)))

puts "#{data['data']['title']} — #{data['data']['rating']}"
```

</details>

---

<a id="-response-format"></a>

## 📦 Response Format

Every response follows a consistent envelope:

<table>
<tr>
<td width="50%">

**✅ Success (paginated)**
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

</td>
<td width="50%">

**✅ Success (single item)**
```json
{
  "success": true,
  "data": { ... }
}
```

**❌ Error**
```json
{
  "success": false,
  "error": "Series not found"
}
```

</td>
</tr>
</table>

### Pagination Headers

All paginated endpoints include these headers:

| Header | Description |
|--------|-------------|
| `X-Pagination-Total` | Total items across all pages |
| `X-Pagination-Per-Page` | Items per page |
| `X-Pagination-Current-Page` | Current page number |
| `X-Pagination-Last-Page` | Last available page |
| `X-Pagination-Has-Next` | `true` if more pages exist |
| `X-Pagination-Has-Previous` | `true` if previous pages exist |

---

<a id="-rate-limiting"></a>

## ⏱️ Rate Limiting

| Setting | Value |
|---------|-------|
| **Limit** | 60 requests per minute |
| **Window** | Rolling 60-second window |
| **Scope** | Per IP address |

### Response Headers

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Max requests allowed (60) |
| `X-RateLimit-Remaining` | Requests remaining |
| `X-RateLimit-Reset` | Unix timestamp when window resets |
| `X-Request-ID` | Unique UUID for tracing |
| `Retry-After` | Seconds to wait (on 429 only) |

```javascript
const res = await fetch('https://omegaapi.vercel.app/api/v1/series');

if (res.status === 429) {
  const retryAfter = res.headers.get('Retry-After');
  await new Promise(r => setTimeout(r, retryAfter * 1000));
}
```

---

<a id="-caching"></a>

## 💾 Caching

| Resource | TTL | Why |
|----------|-----|-----|
| Series list | 5 min | General browsing |
| Series detail | 5 min | Metadata rarely changes |
| Search results | 10 min | Expensive upstream queries |
| Chapter content | 15 min | Images are immutable |
| Genres | 30 min | Static list |
| Health probe | 30 sec | Avoid upstream hammering |

Cached responses include `X-Cache: HIT`. Vercel edge cache adds additional layer via `Cache-Control: public, s-maxage=300`.

---

<a id="-retry-logic"></a>

## 🔄 Retry Logic

OmegaAPI automatically retries failed upstream requests:

| Setting | Value |
|---------|-------|
| **Retries** | 1 attempt |
| **Trigger** | 5xx status codes only |
| **Delay** | 1 second between attempts |
| **Scope** | Does not retry 4xx errors |

This handles transient upstream failures without exposing errors to API consumers.

---

<a id="-error-handling"></a>

## 🚨 Error Handling

| Code | Status | Description |
|------|--------|-------------|
| `200` | OK | Request successful |
| `400` | Bad Request | Invalid parameters |
| `404` | Not Found | Resource doesn't exist |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Server Error | Upstream API error |
| `503` | Service Unavailable | API degraded |

---

<a id="-code-examples"></a>

## 💻 Code Examples

<details>
<summary><strong>JavaScript — Build a Reader</strong></summary>

```javascript
const BASE = 'https://omegaapi.vercel.app/api/v1';

// Get series details
const series = await fetch(`${BASE}/series/sex-stopwatch`).then(r => r.json());
console.log(`${series.data.title} — ${series.data.chaptersCount} chapters`);

// Load chapter images into DOM
const chapter = await fetch(`${BASE}/chapter/sex-stopwatch/chapter-1`).then(r => r.json());
const reader = document.getElementById('reader');
chapter.data.images.forEach((url, i) => {
  const img = document.createElement('img');
  img.src = url;
  img.alt = `Page ${i + 1}`;
  img.loading = 'lazy';
  reader.appendChild(img);
});
```

</details>

<details>
<summary><strong>Python — Series Scraper</strong></summary>

```python
import requests

BASE = "https://omegaapi.vercel.app/api/v1"

# Get top-rated series
series = requests.get(f"{BASE}/series", params={
    "sort": "rating", "order": "desc", "perPage": 10
}).json()

for s in series["data"]:
    print(f"⭐ {s['rating']} — {s['title']} ({s['chaptersCount']} ch)")
```

</details>

<details>
<summary><strong>cURL + jq — Quick Queries</strong></summary>

```bash
# Top 5 rated series
curl -s "https://omegaapi.vercel.app/api/v1/series?sort=rating&perPage=5" | jq '.data[] | "\(.rating) \(.title)"'

# All ongoing manhwa
curl -s "https://omegaapi.vercel.app/api/v1/series?status=ongoing&type=manhwa" | jq '.data[].title'

# Random series
curl -s https://omegaapi.vercel.app/api/v1/random | jq '.data.title'
```

</details>

---

<a id="-tech-stack"></a>

## 🛠️ Tech Stack

<table>
<tr>
<td><strong>Runtime</strong></td>
<td>Node.js 18+</td>
</tr>
<tr>
<td><strong>Framework</strong></td>
<td>Next.js 14 (App Router, Edge Runtime)</td>
</tr>
<tr>
<td><strong>Language</strong></td>
<td>TypeScript 5</td>
</tr>
<tr>
<td><strong>Data Source</strong></td>
<td>OmegaScans API</td>
</tr>
<tr>
<td><strong>Caching</strong></td>
<td>In-memory Map with TTL + Vercel Edge Cache</td>
</tr>
<tr>
<td><strong>Rate Limiting</strong></td>
<td>Custom sliding window per IP</td>
</tr>
<tr>
<td><strong>Styling</strong></td>
<td>Tailwind CSS 3</td>
</tr>
<tr>
<td><strong>Deployment</strong></td>
<td>Vercel (iad1 region)</td>
</tr>
</table>

---

<a id="-project-structure"></a>

## 📁 Project Structure

```
OmegaAPI/
├── public/
│   ├── favicon.svg, favicon-*.png, og-image.png
│   └── robots.txt
├── scripts/
│   └── generate-search-index.ts          # Build-time search index
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── og/route.ts               # Dynamic OG image generator
│   │   │   └── v1/
│   │   │       ├── series/
│   │   │       │   ├── route.ts           # GET /api/v1/series
│   │   │       │   └── [slug]/
│   │   │       │       ├── route.ts       # GET /api/v1/series/:slug
│   │   │       │       └── chapters/      # GET /api/v1/series/:slug/chapters
│   │   │       ├── chapters/[slug]/       # GET /api/v1/chapters/:slug
│   │   │       ├── chapter/[slug]/[ch]/   # GET /api/v1/chapter/:slug/:chapter
│   │   │       ├── search/               # GET /api/v1/search
│   │   │       ├── random/               # GET /api/v1/random
│   │   │       ├── genres/               # GET /api/v1/genres
│   │   │       ├── health/               # GET /api/v1/health
│   │   │       └── stats/                # GET /api/v1/stats
│   │   ├── browse/
│   │   │   ├── page.tsx                   # Manhwa-style browse page
│   │   │   ├── [slug]/page.tsx            # Series detail
│   │   │   ├── [slug]/[chapter]/page.tsx  # Chapter reader
│   │   │   └── genre/[name]/page.tsx      # Genre pages
│   │   ├── docs/page.tsx                  # API documentation
│   │   ├── support/page.tsx               # Support & FAQ
│   │   ├── terms/page.tsx                 # Terms of Service
│   │   ├── privacy/page.tsx               # Privacy Policy
│   │   ├── page.tsx                       # Landing page
│   │   ├── layout.tsx                     # Root layout
│   │   ├── globals.css                    # Design tokens
│   │   └── sitemap.ts                     # Dynamic sitemap
│   ├── components/
│   │   ├── icons.tsx                      # 35+ SVG icons
│   │   ├── layout.tsx                     # Navbar + Footer
│   │   ├── ui.tsx                         # Shared UI utilities
│   │   └── ErrorBoundary.tsx              # React Error Boundary
│   ├── lib/
│   │   ├── omega.ts                       # OmegaScans API client + normalizer
│   │   ├── cache.ts                       # In-memory TTL cache
│   │   ├── rate-limit.ts                  # Sliding window rate limiter
│   │   ├── storage.ts                     # localStorage utilities
│   │   └── utils.ts                       # Response helpers
│   └── types/index.ts                     # TypeScript interfaces
├── .env.example                           # Environment variable template
├── CHANGELOG.md                           # Version history
├── LICENSE                                # MIT License
└── README.md                              # This file
```

---

<a id="-local-development"></a>

## ⚙️ Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [npm](https://npmjs.com/) 9+

### Setup

```bash
# Clone
git clone https://github.com/Shineii86/OmegaAPI.git
cd OmegaAPI

# Install
npm install

# Develop
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build |
| `npm start` | Production server |
| `npm run lint` | ESLint |

### Test Locally

```bash
curl http://localhost:3000/api/v1/health
curl "http://localhost:3000/api/v1/series?page=1&perPage=5"
curl "http://localhost:3000/api/v1/search?q=solo"
```

---

<a id="-deployment"></a>

## 🚢 Deployment

### Vercel (Recommended)

1. **Fork** this repository
2. Go to [vercel.com/new](https://vercel.com/new)
3. **Import** your fork
4. Click **Deploy** — no env vars needed

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Shineii86/OmegaAPI)

### Other Platforms

| Platform | Command | Notes |
|----------|---------|-------|
| **Vercel** | `vercel` | Zero config |
| **Railway** | `railway up` | Easy setup |
| **Render** | Connect repo | Auto-deploy |
| **Fly.io** | `fly deploy` | Edge deployment |
| **Self-hosted** | `npm run build && npm start` | Full control |

---

<a id="-roadmap"></a>

## 🗺️ Roadmap

- [x] REST API with caching & rate limiting
- [x] Browse UI with search & genre filters
- [x] Chapter reader (vertical + paged)
- [x] Reading history & bookmarks
- [x] Sort & filter on API
- [x] Random series endpoint
- [x] Pagination metadata headers
- [x] Retry logic on upstream errors
- [x] Dynamic OG image generator
- [x] React Error Boundary
- [ ] Static search index (build-time generation)
- [ ] WebSocket for real-time chapter notifications
- [ ] API key system for higher rate limits
- [ ] GraphQL endpoint
- [ ] Multi-language support

---

<a id="-contributing"></a>

## 🤝 Contributing

Contributions welcome! Here's how:

- 🐛 **Report bugs** — [Open an issue](https://github.com/Shineii86/OmegaAPI/issues/new?assignees=&labels=bug&template=bug_report.md)
- ✨ **Request features** — [Open an issue](https://github.com/Shineii86/OmegaAPI/issues/new?assignees=&labels=enhancement&template=feature_request.md)
- 📝 **Improve docs** — Fix typos, add examples
- 💻 **Submit code** — Fix bugs or implement features

```bash
# Fork → Clone → Branch → Code → Test → Commit → PR
git checkout -b feature/amazing-feature
npm run build   # Test
git commit -m 'feat: add amazing feature'
git push origin feature/amazing-feature
```

---

<a id="-faq"></a>

## ❓ FAQ

<details>
<summary><strong>Is OmegaAPI really free?</strong></summary>
Yes! Completely free, always. No API keys, no sign-ups, no hidden costs.
</details>

<details>
<summary><strong>Do I need an API key?</strong></summary>
No. Just make a request and get JSON.
</details>

<details>
<summary><strong>What are the rate limits?</strong></summary>
60 requests per minute per IP. Headers tell you exactly how many you have left.
</details>

<details>
<summary><strong>Can I use this in my frontend?</strong></summary>
Yes! CORS is enabled for all origins. Call directly from any browser or app.
</details>

<details>
<summary><strong>Where does the data come from?</strong></summary>
OmegaAPI wraps the OmegaScans API, normalizing and caching data. Not affiliated with OmegaScans.
</details>

<details>
<summary><strong>How often is data updated?</strong></summary>
Real-time from OmegaScans, cached 5–15 min per endpoint.
</details>

<details>
<summary><strong>Can I use this commercially?</strong></summary>
Yes! MIT License allows commercial use. Respect rate limits.
</details>

<details>
<summary><strong>Can I self-host?</strong></summary>
Yes! Clone, `npm install`, deploy anywhere. See [Deployment](#-deployment).
</details>

---

<a id="-legal-disclaimer"></a>

## ⚠️ Legal Disclaimer

This project is **unofficial** and **not affiliated with or endorsed by OmegaScans**.

- Acts as a middleware/proxy to the official OmegaScans backend
- No content is hosted or redistributed
- Rate limiting protects upstream servers
- Use responsibly and respect the original site's terms

**[Terms of Service](https://omegaapi.vercel.app/terms)** · **[Privacy Policy](https://omegaapi.vercel.app/privacy)** · **[MIT License](https://github.com/Shineii86/OmegaAPI/blob/main/LICENSE)**

---

<a id="-changelog"></a>

## 📋 Changelog

See [CHANGELOG.md](CHANGELOG.md) for full version history.

### Latest: v3.9.0 (2026-05-12)

- 🔄 **Retry Logic** — Auto-retry on 5xx upstream errors
- 💓 **Health Check Cache** — Upstream probe cached 30s
- 📊 **Pagination Headers** — `X-Pagination-*` on all paginated endpoints
- 🔀 **Sort & Filter** — `?sort=`, `?status=`, `?type=` on series list
- 🎲 **Random Endpoint** — `/api/v1/random` for discovery
- 🖼️ **OG Image Generator** — `/api/og` for dynamic social images
- 🛡️ **Error Boundary** — Graceful recovery on all browse pages
- 📝 **Structured Documentation** — Box headers, section markers, feature tags
- 🔓 **Payment System Removed** — All browse pages now free
- 📦 **Version Synced** — `3.9.0` across package.json, health, and stats

---

<a id="-license"></a>

## 📝 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE).

---

<a id="-acknowledgments"></a>

## 🙏 Acknowledgments

| Project | Role |
|---------|------|
| [OmegaScans](https://omegascans.org) | Upstream data source |
| [Next.js](https://nextjs.org) | React framework |
| [Vercel](https://vercel.com) | Hosting & edge deployment |
| [Tailwind CSS](https://tailwindcss.com) | CSS framework |
| [ShineiAPI](https://github.com/Shineii86/ShineiAPI) | Design inspiration |

---

<div align="center">

**Built with ❤️ by [Shinei Nouzen](https://github.com/Shineii86)**

<br />

<a href="https://github.com/Shineii86/OmegaAPI/stargazers">⭐ Star</a> ·
<a href="https://github.com/Shineii86/OmegaAPI/fork">🍴 Fork</a> ·
<a href="https://github.com/Shineii86/OmegaAPI/issues/new">🐛 Issue</a>

</div>
