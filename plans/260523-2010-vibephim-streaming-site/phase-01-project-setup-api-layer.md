---
phase: 1
title: "Project Setup & API Layer"
status: pending
priority: P1
effort: "1-2h"
dependencies: []
---

# Phase 1: Project Setup & API Layer

## Overview

Scaffold React + Vite project, configure Tailwind CSS v4, set up React Router v7 with all routes, create OPhim API service layer with custom hooks, and build layout shell (Header + Footer).

## Requirements

- Functional: Vite dev server runs, all routes defined, API calls return data, layout renders on all pages
- Non-functional: Fast HMR, clean project structure, centralized API config

## Architecture

```
App.jsx
├── BrowserRouter
│   ├── Layout (Header + Footer wrapper)
│   │   ├── / → HomePage
│   │   ├── /browse → BrowsePage
│   │   ├── /phim/:slug → DetailPage
│   │   ├── /xem/:slug/:ep → WatchPage
│   │   ├── /tim-kiem → SearchPage
│   │   ├── /the-loai/:slug → CategoryPage
│   │   ├── /quoc-gia/:slug → CountryPage
│   │   ├── /yeu-thich → FavoritesPage
│   │   └── /lich-su → HistoryPage
```

## Related Code Files

- Create: `package.json`, `vite.config.js`, `tailwind.config.js`, `index.html`
- Create: `src/main.jsx`, `src/App.jsx`, `src/index.css`
- Create: `src/services/ophim-api.js`
- Create: `src/hooks/use-movies.js`, `src/hooks/use-movie-detail.js`, `src/hooks/use-search.js`, `src/hooks/use-categories.js`
- Create: `src/components/layout/header.jsx`, `src/components/layout/footer.jsx`, `src/components/layout/layout.jsx`
- Create: `src/pages/home-page.jsx` (stub), all other page stubs
- Create: `src/utils/constants.js`

## Implementation Steps

1. **Scaffold Vite project**
   ```bash
   npm create vite@latest . -- --template react
   ```

2. **Install dependencies**
   ```bash
   npm install react-router-dom hls.js
   npm install -D tailwindcss @tailwindcss/vite
   ```

3. **Configure Tailwind CSS v4** — add `@import "tailwindcss"` to `src/index.css`, add Tailwind Vite plugin to `vite.config.js`

4. **Set up global CSS** — dark theme base styles in `index.css`:
   - `body { background: #141414; color: #fff; }`
   - Custom scrollbar, font-family (Inter or system)

5. **Create constants** — `src/utils/constants.js`:
   - `API_BASE = "https://ophim1.com"`
   - `API_V1 = "https://ophim1.com/v1/api"`
   - `IMG_CDN = "https://img.ophim.live/uploads/movies/"`
   - Route paths object

6. **Create API service** — `src/services/ophim-api.js`:
   - `getNewestMovies(page)` → `GET /danh-sach/phim-moi-cap-nhat?page={page}`
   - `getMovieDetail(slug)` → `GET /phim/{slug}`
   - `searchMovies(keyword, page)` → `GET /v1/api/tim-kiem?keyword={keyword}&page={page}`
   - `getCategories()` → `GET /v1/api/the-loai`
   - `getCountries()` → `GET /v1/api/quoc-gia`
   - `getMoviesByCategory(slug, page)` → `GET /v1/api/the-loai/{slug}?page={page}`
   - `getMoviesByCountry(slug, page)` → `GET /v1/api/quoc-gia/{slug}?page={page}`
   - `getMoviesByType(type, page)` → `GET /v1/api/danh-sach/{type}?page={page}`
   - Helper: `getImageUrl(path)` → prepend IMG_CDN if relative path

7. **Create custom hooks** — each hook wraps API call with `useState` + `useEffect`:
   - `src/hooks/use-movies.js` — `useMovies(page)` returns `{ movies, pagination, loading, error }`
   - `src/hooks/use-movie-detail.js` — `useMovieDetail(slug)` returns `{ movie, episodes, loading, error }`
   - `src/hooks/use-search.js` — `useSearch(keyword, page)` returns `{ results, pagination, loading, error }`
   - `src/hooks/use-categories.js` — `useCategories()` and `useCountries()`

8. **Create Layout components**:
   - `header.jsx` — logo, nav links (Home, Browse, Favorites, History), search icon/bar
   - `footer.jsx` — minimal footer with credits
   - `layout.jsx` — wraps `<Header />` + `<Outlet />` + `<Footer />`

9. **Set up React Router** in `App.jsx`:
   - `BrowserRouter` → `Routes` → all 9 routes inside `Layout`
   - Create stub page components (just `<h1>Page Name</h1>`) for each route

10. **Verify**: run `npm run dev`, navigate all routes, confirm API calls work via browser devtools

## Success Criteria

- [ ] `npm run dev` starts without errors
- [ ] All 9 routes render their stub pages
- [ ] Header/Footer visible on all pages
- [ ] API service fetches data from OPhim (verify in console)
- [ ] Custom hooks return correct data shape
- [ ] Tailwind CSS classes apply correctly (dark bg visible)

## Risk Assessment

- **OPhim CORS**: Tested and confirmed open. If blocked, add Vite proxy config as fallback.
- **Tailwind v4 breaking changes**: Use `@import "tailwindcss"` syntax, not v3 `@tailwind` directives.
