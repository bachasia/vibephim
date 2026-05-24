---
phase: 3
title: "Movie Detail & Category Pages"
status: pending
priority: P1
effort: "2h"
dependencies: [2]
---

# Phase 3: Movie Detail & Category Pages

## Overview

Build the Movie Detail page showing full metadata + episodes list, and Category/Country listing pages reusing MovieGrid.

## Requirements

- Functional: Detail page shows all metadata, episodes list with server tabs, Category/Country pages filter and paginate
- Non-functional: Clean layout, responsive poster + info layout, smooth episode navigation

## Architecture

```
DetailPage (/phim/:slug)
├── Backdrop (poster_url with gradient)
├── MovieInfo (thumb, title, origin_name, year, quality, lang, time)
├── MetadataRow (categories, countries, director, actors)
├── Synopsis (content HTML rendered safely)
├── EpisodeSection
│   ├── ServerTabs (Vietsub #1, Vietsub #2, etc.)
│   └── EpisodeGrid (episode buttons → /xem/:slug/:ep)
└── RelatedMovies (same category carousel — optional)

CategoryPage (/the-loai/:slug)
├── PageTitle (category name)
├── MovieGrid
└── Pagination

CountryPage (/quoc-gia/:slug)
├── PageTitle (country name)
├── MovieGrid
└── Pagination
```

## Related Code Files

- Modify: `src/pages/detail-page.jsx`
- Create: `src/components/movie/movie-info.jsx`
- Create: `src/components/movie/episode-section.jsx`
- Modify: `src/pages/category-page.jsx`
- Modify: `src/pages/country-page.jsx`
- Create: `src/hooks/use-movies-by-category.js`
- Create: `src/hooks/use-movies-by-country.js`

## Implementation Steps

1. **Detail page layout** — `detail-page.jsx`:
   - Use `useMovieDetail(slug)` hook with `useParams()` to get slug
   - Full-width backdrop: poster_url as background with dark gradient overlay
   - Two-column layout below: thumbnail (left) + info (right) on desktop, stacked on mobile

2. **MovieInfo component** — `movie-info.jsx`:
   - Display: name, origin_name, alternative_names, year, time, quality, lang
   - Episode status: episode_current / episode_total, status (ongoing/completed)
   - Categories as clickable chips → `/the-loai/{slug}`
   - Countries as clickable chips → `/quoc-gia/{slug}`
   - Director and actors list
   - Trailer link (YouTube) if available
   - TMDB/IMDB ratings if available
   - "Add to Favorites" button (implement in Phase 5, render disabled for now)

3. **Synopsis section** — render `movie.content` (HTML string) safely:
   - Use `dangerouslySetInnerHTML` with basic sanitization (strip scripts)
   - Or render as text by stripping HTML tags

4. **EpisodeSection component** — `episode-section.jsx`:
   - Props: `episodes[]` (array of server objects), `currentSlug`
   - Tabs for each server (e.g., "Vietsub #1", "Vietsub #2")
   - Grid of episode buttons (numbered: Tập 1, Tập 2, etc.)
   - Each button links to `/xem/{slug}/{episode-slug}`
   - Highlight current episode if on watch page (reusable later)

5. **Category page** — `category-page.jsx`:
   - `useParams()` to get category slug
   - `useMoviesByCategory(slug, page)` hook
   - Title from API response `titlePage` field
   - Reuse MovieGrid + Pagination

6. **Country page** — `country-page.jsx`:
   - Same pattern as Category but using country API
   - `useMoviesByCountry(slug, page)` hook

7. **Category/Country hooks**:
   - `use-movies-by-category.js` → calls `getMoviesByCategory(slug, page)`
   - `use-movies-by-country.js` → calls `getMoviesByCountry(slug, page)`
   - Both return `{ movies, pagination, titlePage, loading, error }`

8. **Verify**: navigate to movie detail, all metadata displays, episodes clickable, category/country pages paginate

## Success Criteria

- [ ] Detail page displays movie poster, title, metadata
- [ ] Synopsis renders correctly
- [ ] Episode section shows server tabs + episode buttons
- [ ] Episode buttons link to `/xem/:slug/:ep`
- [ ] Category page lists movies with pagination
- [ ] Country page lists movies with pagination
- [ ] Category/country chips on detail page navigate correctly

## Risk Assessment

- **HTML content**: `movie.content` contains raw HTML. Must sanitize to prevent XSS. Strip `<script>` tags at minimum.
- **Multiple servers**: Some movies have multiple server entries. Tab UI must handle dynamic count.
