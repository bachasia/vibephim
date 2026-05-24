---
phase: 5
title: "Search & User Features"
status: pending
priority: P2
effort: "2h"
dependencies: [2]
---

# Phase 5: Search & User Features

## Overview

Build Search page with real-time results, Favorites system, and Watch History — all using localStorage. Create contexts for cross-component state sharing.

## Requirements

- Functional: Search with debounced input, Favorites add/remove/list, Watch History with progress tracking
- Non-functional: Instant localStorage persistence, no auth required, data survives refresh

## Architecture

```
SearchPage (/tim-kiem?q=X)
├── SearchBar (debounced input)
├── MovieGrid (results)
└── Pagination

FavoritesContext (React Context + localStorage)
├── favorites[] state
├── addFavorite(movie)
├── removeFavorite(slug)
├── isFavorite(slug)
└── Persists to localStorage key "vibephim_favorites"

WatchHistoryContext (React Context + localStorage)
├── history[] state
├── addToHistory(movie, episode, progress)
├── getProgress(slug, ep)
└── Persists to localStorage key "vibephim_history"
```

## Related Code Files

- Create: `src/contexts/favorites-context.jsx`
- Create: `src/contexts/watch-history-context.jsx`
- Create: `src/hooks/use-favorites.js`
- Create: `src/hooks/use-watch-history.js`
- Modify: `src/pages/search-page.jsx`
- Modify: `src/pages/favorites-page.jsx`
- Modify: `src/pages/history-page.jsx`
- Modify: `src/components/movie/movie-info.jsx` (enable favorites button)
- Modify: `src/components/player/video-player.jsx` (save progress)
- Modify: `src/App.jsx` (wrap providers)

## Implementation Steps

1. **FavoritesContext** — `favorites-context.jsx`:
   - Initialize from `localStorage.getItem("vibephim_favorites")`
   - State: `favorites[]` — array of `{ slug, name, thumb_url, year, addedAt }`
   - Actions: `addFavorite(movie)`, `removeFavorite(slug)`, `isFavorite(slug)`
   - Sync to localStorage on every state change via `useEffect`
   - Max 200 items (trim oldest if exceeded)

2. **WatchHistoryContext** — `watch-history-context.jsx`:
   - Initialize from `localStorage.getItem("vibephim_history")`
   - State: `history[]` — array of `{ slug, name, thumb_url, episode, episodeName, progress, watchedAt }`
   - Actions: `addToHistory(entry)`, `getProgress(slug, ep)`, `clearHistory()`
   - Update existing entry if same slug+episode (don't duplicate)
   - Max 100 items, sorted by `watchedAt` desc
   - Sync to localStorage on change

3. **Wrap App with providers** — update `App.jsx`:
   ```jsx
   <FavoritesProvider>
     <WatchHistoryProvider>
       <RouterProvider />
     </WatchHistoryProvider>
   </FavoritesProvider>
   ```

4. **Search page** — `search-page.jsx`:
   - Read `q` from URL search params
   - SearchBar component with debounced input (300ms delay)
   - On input change → update URL param → trigger search
   - `useSearch(keyword, page)` hook for results
   - MovieGrid + Pagination for results display
   - Empty state: "Nhập từ khóa để tìm phim"
   - No results state: "Không tìm thấy phim nào"

5. **Header search integration** — update `header.jsx`:
   - Search icon → expands to search input on click
   - On submit → navigate to `/tim-kiem?q={value}`

6. **Enable Favorites button** — update `movie-info.jsx`:
   - Replace disabled button with working toggle
   - Heart icon: filled (favorited) / outline (not)
   - Call `addFavorite()` / `removeFavorite()` on click

7. **Favorites page** — `favorites-page.jsx`:
   - Read from FavoritesContext
   - MovieGrid with favorite movies
   - Remove button on each card (X icon)
   - Empty state: "Chưa có phim yêu thích"

8. **Save watch progress** — update `video-player.jsx`:
   - On `timeupdate` event (throttled every 5s) → save progress via WatchHistoryContext
   - On page leave → save final progress

9. **History page** — `history-page.jsx`:
   - Read from WatchHistoryContext
   - List with movie thumb, title, episode, progress bar, timestamp
   - "Continue watching" link → `/xem/{slug}/{ep}?t={progress}`
   - "Clear History" button
   - Empty state: "Chưa xem phim nào"

10. **Resume playback** — update `watch-page.jsx`:
    - On load, check `getProgress(slug, ep)` → pass as `initialTime` to VideoPlayer

11. **Verify**: search returns results, favorites persist after refresh, watch history tracks progress

## Success Criteria

- [ ] Search returns results with debounced input
- [ ] URL updates with search query
- [ ] Favorites add/remove works
- [ ] Favorites persist across page refresh
- [ ] Heart icon toggles on detail page
- [ ] Watch history records episode + progress
- [ ] History page shows "continue watching" with progress
- [ ] Resume playback from saved position
- [ ] localStorage data survives browser refresh
- [ ] Empty states display correctly

## Risk Assessment

- **localStorage size**: ~5MB limit. With 200 favorites + 100 history entries (~50KB total), well within limits.
- **Context re-renders**: Wrap provider values in `useMemo` to prevent unnecessary child re-renders.
