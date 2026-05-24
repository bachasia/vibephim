---
title: "VibPhim - Personal Movie Streaming Site"
description: "Personal movie streaming SPA consuming OPhim API. React 19 + Vite + Tailwind CSS v4. Dark cinematic Netflix-like design with HLS video player."
status: pending
priority: P2
branch: ""
tags: [react, vite, tailwind, streaming, ophim]
blockedBy: []
blocks: []
created: "2026-05-23T13:19:27.737Z"
createdBy: "ck:plan"
source: skill
---

# VibPhim - Personal Movie Streaming Site

## Overview

Personal movie streaming website consuming OPhim API (`ophim1.com`). SPA architecture with React 19 + Vite, Tailwind CSS v4 for dark cinematic styling, custom HLS.js video player, and localStorage-based user features (favorites, watch history).

**Brainstorm Report:** [brainstorm-260523-2010-vibephim-personal-movie-site.md](../reports/brainstorm-260523-2010-vibephim-personal-movie-site.md)

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| Video | HLS.js + custom player |
| State | React Context + localStorage |
| Deploy | Static (Vercel/Netlify) |

## API Base

- **List endpoint**: `https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=N`
- **Detail endpoint**: `https://ophim1.com/phim/{slug}`
- **Search**: `https://ophim1.com/v1/api/tim-kiem?keyword=X`
- **Categories/Countries**: `https://ophim1.com/v1/api/the-loai` | `quoc-gia`
- **Image CDN**: `https://img.ophim.live/uploads/movies/`

## Phases

| Phase | Name | Status | Effort |
|-------|------|--------|--------|
| 1 | [Project Setup & API Layer](./phase-01-project-setup-api-layer.md) | Pending | 1-2h |
| 2 | [Home & Browse Pages](./phase-02-home-browse-pages.md) | Pending | 2-3h |
| 3 | [Movie Detail & Category Pages](./phase-03-movie-detail-category-pages.md) | Pending | 2h |
| 4 | [Custom Video Player & Watch Page](./phase-04-custom-video-player-watch-page.md) | Pending | 2-3h |
| 5 | [Search & User Features](./phase-05-search-user-features.md) | Pending | 2h |
| 6 | [Polish & Responsive](./phase-06-polish-responsive.md) | Pending | 1-2h |

**Total estimated effort:** 10-14 hours

## Project Structure

```
src/
├── components/
│   ├── layout/       # Header, Footer
│   ├── movie/        # MovieCard, MovieGrid, MovieCarousel
│   ├── player/       # VideoPlayer, PlayerControls, EpisodeList
│   └── ui/           # Skeleton, Pagination, SearchBar
├── hooks/            # useMovies, useMovieDetail, useSearch, useFavorites, useWatchHistory
├── pages/            # Home, Browse, Detail, Watch, Search, Category, Country, Favorites, History
├── services/         # ophim-api.js
├── contexts/         # FavoritesContext, WatchHistoryContext
├── utils/            # constants, helpers
├── App.jsx
├── main.jsx
└── index.css
```

## Dependencies

No cross-plan dependencies. Greenfield project.
