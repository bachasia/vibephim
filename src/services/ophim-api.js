import { API_BASE, API_V1, IMG_CDN } from '../utils/constants.js'

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`)
  return res.json()
}

export function getImageUrl(path) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${IMG_CDN}${path}`
}

export async function getNewestMovies(page = 1) {
  return fetchJson(`${API_BASE}/danh-sach/phim-moi-cap-nhat?page=${page}`)
}

export async function getMovieDetail(slug) {
  return fetchJson(`${API_BASE}/phim/${slug}`)
}

export async function searchMovies(keyword, page = 1) {
  return fetchJson(`${API_V1}/tim-kiem?keyword=${encodeURIComponent(keyword)}&page=${page}`)
}

export async function getCategories() {
  return fetchJson(`${API_V1}/the-loai`)
}

export async function getCountries() {
  return fetchJson(`${API_V1}/quoc-gia`)
}

export async function getMoviesByCategory(slug, page = 1) {
  return fetchJson(`${API_V1}/the-loai/${slug}?page=${page}`)
}

export async function getMoviesByCountry(slug, page = 1) {
  return fetchJson(`${API_V1}/quoc-gia/${slug}?page=${page}`)
}

export async function getMoviesByType(type, page = 1) {
  return fetchJson(`${API_V1}/danh-sach/${type}?page=${page}`)
}
