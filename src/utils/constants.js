// When VITE_API_BASE is set (e.g. http://localhost:3001), use local SQLite server.
// Otherwise fall back to the live OPhim API.
const LOCAL = import.meta.env.VITE_API_BASE ?? ''

export const API_BASE = LOCAL || 'https://ophim1.com'
export const API_V1   = LOCAL ? `${LOCAL}/v1/api` : 'https://ophim1.com/v1/api'
export const IMG_CDN  = 'https://img.ophim.live/uploads/movies/'

export const ROUTES = {
  HOME: '/',
  BROWSE: '/browse',
  DETAIL: '/phim/:slug',
  WATCH: '/xem/:slug/:ep',
  SEARCH: '/tim-kiem',
  CATEGORY: '/the-loai/:slug',
  COUNTRY: '/quoc-gia/:slug',
  FAVORITES: '/yeu-thich',
  HISTORY: '/lich-su',
}

export const MOVIE_TYPES = {
  SERIES: 'phim-bo',
  MOVIE: 'phim-le',
  ANIME: 'hoat-hinh',
  TV: 'tv-shows',
}

export const DEFAULT_PAGINATION = {
  currentPage: 1,
  totalItems: 0,
  totalItemsPerPage: 24,
}
