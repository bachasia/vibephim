# Brainstorm: VibPhim - Personal Movie Streaming Site

**Date**: 2026-05-23
**Status**: Agreed

## Problem Statement

Build personal movie streaming website consuming OPhim API (`ophim1.com`). Must support browsing, searching, filtering, and watching movies via HLS streaming. Netflix-like dark cinematic design with localStorage-based user features.

## Final Solution

### Stack
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **Video**: Custom player + HLS.js
- **State**: React Context + localStorage
- **Deploy**: Static hosting (Vercel/Netlify)

### Architecture
```
React SPA (Vite) ──→ OPhim API (ophim1.com)
      │                  ├── /danh-sach/phim-moi-cap-nhat?page=N
      │                  ├── /phim/{slug}  (detail + episodes)
      │                  ├── /v1/api/tim-kiem?keyword=X
      │                  ├── /v1/api/the-loai/{slug}
      │                  ├── /v1/api/quoc-gia/{slug}
      │                  └── /v1/api/danh-sach/{type}
      │
      └──→ localStorage
              ├── favorites[]
              └── watchHistory[]
```

### Pages (8 pages)
| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero banner + carousels (trending, latest, by category) |
| Browse | `/browse` | Grid + filters (category, country, year, type) |
| Movie Detail | `/phim/:slug` | Poster, metadata, episodes list, related |
| Watch | `/xem/:slug/:ep` | Custom HLS player + episode selector |
| Search | `/tim-kiem?q=X` | Search results grid with filters |
| Category | `/the-loai/:slug` | Movies filtered by genre |
| Country | `/quoc-gia/:slug` | Movies filtered by country |
| Favorites | `/yeu-thich` | User's saved movies (localStorage) |
| History | `/lich-su` | Recently watched (localStorage) |

### Video Player Features
- Custom UI: play/pause, seek bar, volume, fullscreen
- Quality selector (if multiple m3u8 streams)
- Episode navigation (prev/next)
- Auto-save progress to localStorage
- Keyboard shortcuts (space, arrows, F)

### Design: Dark Cinematic (Netflix-like)
- Color palette: bg `#141414`, cards `#1a1a1a`, accent red `#e50914`
- Hero section with backdrop image + gradient overlay
- Horizontal scroll carousels for movie lists
- Hover effects: card scale + info reveal
- Responsive: mobile-first, breakpoints at sm/md/lg/xl

### Data Layer
- Custom hooks: `useMovies()`, `useMovieDetail()`, `useSearch()`, `useCategories()`
- Simple fetch wrapper with error handling
- Image CDN base: `https://img.ophim.live/uploads/movies/`
- Pagination support across all list views

### localStorage Schema
```json
{
  "favorites": [{ "slug": "...", "name": "...", "thumb_url": "...", "addedAt": "..." }],
  "watchHistory": [{ "slug": "...", "name": "...", "episode": "...", "progress": 0.75, "watchedAt": "..." }]
}
```

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| No backend | Direct API | OPhim has no auth, CORS open, personal site doesn't need proxy |
| Custom player | HLS.js raw | Full control over UI, Netflix-like controls, no library bloat |
| localStorage | No DB | Personal use, no auth needed, instant persistence |
| React SPA | No SSR | Personal site, SEO not priority, simpler architecture |
| Tailwind v4 | No CSS framework | Utility-first, rapid prototyping, dark theme easy |

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| OPhim API downtime | Site unusable | Show cached data, graceful error states |
| API domain changes | Broken endpoints | Centralize base URL config, easy to update |
| CORS policy change | API calls blocked | Add Cloudflare proxy if needed (future) |
| m3u8 stream issues | Video won't play | Fallback error message, retry logic |
| Large image payloads | Slow loading | Lazy loading, image optimization, skeleton UIs |

## Project Structure (Proposed)
```
src/
├── components/
│   ├── layout/          # Header, Footer, Sidebar
│   ├── movie/           # MovieCard, MovieGrid, MovieCarousel
│   ├── player/          # VideoPlayer, Controls, EpisodeList
│   └── ui/              # Button, Skeleton, SearchBar, Pagination
├── hooks/               # useMovies, useSearch, useFavorites, useWatchHistory
├── pages/               # Home, Browse, Detail, Watch, Search, Favorites, History
├── services/            # api.js (OPhim fetch wrapper)
├── utils/               # helpers, constants
├── contexts/            # FavoritesContext, HistoryContext
├── App.jsx
└── main.jsx
```

## Next Steps
1. Create detailed implementation plan with phases
2. Phase 1: Project setup + API service layer
3. Phase 2: Core pages (Home, Browse, Detail)
4. Phase 3: Video player + Watch page
5. Phase 4: User features (Favorites, History)
6. Phase 5: Polish, responsive, error handling
