---
phase: 2
title: "Home & Browse Pages"
status: pending
priority: P1
effort: "2-3h"
dependencies: [1]
---

# Phase 2: Home & Browse Pages

## Overview

Build the Home page with hero banner and horizontal carousels, and the Browse page with filterable grid. Create shared MovieCard and MovieCarousel components.

## Requirements

- Functional: Home shows hero + movie carousels, Browse shows grid with category/country/year filters, pagination works
- Non-functional: Smooth horizontal scroll, lazy loading images, skeleton loading states

## Architecture

```
HomePage
├── HeroBanner (random featured movie, backdrop + gradient)
├── MovieCarousel (Phim Mới Cập Nhật)
├── MovieCarousel (Phim Bộ)
├── MovieCarousel (Phim Lẻ)
├── MovieCarousel (Hoạt Hình)
└── MovieCarousel (TV Shows)

BrowsePage
├── FilterBar (category, country, year, type dropdowns)
├── MovieGrid (filtered results)
└── Pagination
```

## Related Code Files

- Create: `src/components/movie/movie-card.jsx`
- Create: `src/components/movie/movie-carousel.jsx`
- Create: `src/components/movie/movie-grid.jsx`
- Create: `src/components/movie/hero-banner.jsx`
- Create: `src/components/ui/skeleton.jsx`
- Create: `src/components/ui/pagination.jsx`
- Modify: `src/pages/home-page.jsx`
- Modify: `src/pages/browse-page.jsx`
- Create: `src/hooks/use-movies-by-type.js`

## Implementation Steps

1. **MovieCard component** — `movie-card.jsx`:
   - Props: `movie` object (name, slug, thumb_url, year, quality, lang, episode_current)
   - Thumbnail with lazy loading (`loading="lazy"`)
   - Hover: scale up, show overlay with title + year + quality badge
   - Click → navigate to `/phim/{slug}`
   - Quality/lang badge (HD, Vietsub) top-right corner
   - Episode count badge bottom-left

2. **Skeleton component** — `skeleton.jsx`:
   - Reusable animated placeholder (pulse animation)
   - Variants: card, text, banner

3. **MovieCarousel component** — `movie-carousel.jsx`:
   - Props: `title`, `movies[]`, `loading`
   - Horizontal scroll container with CSS `overflow-x: auto`, `scroll-snap-type`
   - Left/right arrow buttons (appear on hover)
   - Show Skeleton cards while loading
   - "Xem thêm" link to browse page with filter

4. **HeroBanner component** — `hero-banner.jsx`:
   - Pick random movie from newest list
   - Full-width backdrop image (poster_url) with gradient overlay
   - Movie title, description snippet, year, quality
   - "Xem Ngay" and "Chi Tiết" buttons
   - Auto-rotate every 8 seconds (optional)

5. **Home page** — update `home-page.jsx`:
   - Fetch newest movies + movies by type (phim-bo, phim-le, hoat-hinh, tv-shows)
   - Render HeroBanner + 4-5 MovieCarousels
   - Loading state: skeleton carousels

6. **MovieGrid component** — `movie-grid.jsx`:
   - Props: `movies[]`, `loading`
   - Responsive grid: 2 cols mobile, 3 md, 4 lg, 5 xl
   - Uses MovieCard for each item
   - Skeleton grid while loading

7. **Pagination component** — `pagination.jsx`:
   - Props: `currentPage`, `totalPages`, `onPageChange`
   - Previous/Next buttons + page numbers
   - Max 5 visible page buttons with ellipsis

8. **Browse page** — update `browse-page.jsx`:
   - Filter bar: category dropdown, country dropdown, year select, type select
   - Fetch categories + countries for dropdown options (use `useCategories()`)
   - URL search params for filter state (`?category=hanh-dong&country=han-quoc&page=2`)
   - MovieGrid + Pagination
   - Update results on filter change

9. **Image URL helper** — ensure `getImageUrl()` handles both absolute URLs and relative paths (some return full URL, some just filename)

10. **Verify**: Home page renders carousels with real data, Browse page filters work, pagination navigates

## Success Criteria

- [ ] Home page shows hero banner with movie data
- [ ] 4+ carousels render with horizontal scroll
- [ ] MovieCard shows thumbnail, title, quality badge
- [ ] Browse page grid displays movies
- [ ] Category/Country/Year filters update results
- [ ] Pagination works across pages
- [ ] Loading skeletons display while fetching
- [ ] Images lazy-load correctly

## Risk Assessment

- **Image paths**: API returns mixed (relative filenames vs full URLs). `getImageUrl()` must handle both.
- **Multiple API calls on Home**: 5+ parallel fetches. Use `Promise.all` to avoid waterfall.
