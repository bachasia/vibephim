/**
 * Local API server — serves SQLite data with same JSON shape as OPhim API.
 * Usage: node scripts/local-api-server.js [--port=3001]
 * Frontend points to http://localhost:3001 via VITE_API_BASE env var.
 */

import express from 'express'
import cors from 'cors'
import { openDb, initDb } from './db-init.js'

const ARGS = Object.fromEntries(
  process.argv.slice(2)
    .filter(a => a.startsWith('--'))
    .map(a => { const [k, v] = a.slice(2).split('='); return [k, v ?? true] })
)
const PORT = parseInt(ARGS.port ?? '3001', 10)
const PER_PAGE = 24

const db = openDb()
initDb(db)

const app = express()
app.use(cors())
app.use(express.json())

// ── helpers ────────────────────────────────────────────────────────────────

function parseJson(str, fallback = []) {
  try { return JSON.parse(str) } catch { return fallback }
}

function movieRow(row) {
  return {
    _id: row.slug,
    slug: row.slug,
    name: row.name,
    origin_name: row.origin_name,
    type: row.type,
    status: row.status,
    thumb_url: row.thumb_url,
    poster_url: row.poster_url,
    year: row.year,
    time: row.time,
    quality: row.quality,
    lang: row.lang,
    content: row.content,
    episode_current: row.episode_current,
    episode_total: row.episode_total,
    view: row.view,
    actor: parseJson(row.actor),
    director: parseJson(row.director),
    category: parseJson(row.categories),
    country: parseJson(row.countries),
    trailer_url: row.trailer_url,
    modified: { time: row.modified_at },
    created: { time: row.created_at },
  }
}

function paginate(page, totalItems) {
  const currentPage = parseInt(page, 10) || 1
  return {
    totalItems,
    totalItemsPerPage: PER_PAGE,
    currentPage,
    totalPages: Math.ceil(totalItems / PER_PAGE),
  }
}

// ── routes ─────────────────────────────────────────────────────────────────

// GET /danh-sach/phim-moi-cap-nhat?page=N
app.get('/danh-sach/phim-moi-cap-nhat', (req, res) => {
  const page = parseInt(req.query.page, 10) || 1
  const offset = (page - 1) * PER_PAGE
  const total = db.prepare('SELECT COUNT(*) as c FROM movies').get().c
  const items = db.prepare(
    'SELECT * FROM movies ORDER BY modified_at DESC, fetched_at DESC LIMIT ? OFFSET ?'
  ).all(PER_PAGE, offset)

  res.json({
    status: true,
    items: items.map(movieRow),
    pagination: paginate(page, total),
  })
})

// GET /phim/:slug
app.get('/phim/:slug', (req, res) => {
  const movie = db.prepare('SELECT * FROM movies WHERE slug = ?').get(req.params.slug)
  if (!movie) return res.status(404).json({ status: false, msg: 'Movie not found' })

  const epRows = db.prepare('SELECT * FROM episodes WHERE movie_slug = ?').all(req.params.slug)

  // Group episodes by server_name
  const serverMap = {}
  for (const ep of epRows) {
    if (!serverMap[ep.server_name]) serverMap[ep.server_name] = []
    serverMap[ep.server_name].push({
      name: ep.ep_name,
      slug: ep.ep_slug,
      link_embed: ep.link_embed,
      link_m3u8: ep.link_m3u8,
    })
  }
  const episodes = Object.entries(serverMap).map(([server_name, server_data]) => ({
    server_name,
    server_data,
  }))

  res.json({ status: true, msg: 'success', movie: movieRow(movie), episodes })
})

// GET /v1/api/tim-kiem?keyword=X&page=N
app.get('/v1/api/tim-kiem', (req, res) => {
  const keyword = (req.query.keyword ?? '').trim()
  const page = parseInt(req.query.page, 10) || 1
  const offset = (page - 1) * PER_PAGE

  if (!keyword) return res.json({ status: true, data: { items: [], params: { pagination: paginate(1, 0) } } })

  const like = `%${keyword}%`
  const total = db.prepare(
    'SELECT COUNT(*) as c FROM movies WHERE name LIKE ? OR origin_name LIKE ?'
  ).get(like, like).c
  const items = db.prepare(
    'SELECT * FROM movies WHERE name LIKE ? OR origin_name LIKE ? ORDER BY view DESC LIMIT ? OFFSET ?'
  ).all(like, like, PER_PAGE, offset)

  res.json({
    status: true,
    data: {
      titlePage: `Tìm kiếm: ${keyword}`,
      items: items.map(movieRow),
      params: { pagination: paginate(page, total) },
    },
  })
})

// GET /v1/api/the-loai
app.get('/v1/api/the-loai', (req, res) => {
  const rows = db.prepare("SELECT categories FROM movies WHERE categories != '[]'").all()
  const catMap = {}
  for (const row of rows) {
    for (const cat of parseJson(row.categories)) {
      if (cat.slug && !catMap[cat.slug]) catMap[cat.slug] = cat
    }
  }
  res.json({ status: true, data: { items: Object.values(catMap).sort((a, b) => a.name.localeCompare(b.name)) } })
})

// GET /v1/api/quoc-gia
app.get('/v1/api/quoc-gia', (req, res) => {
  const rows = db.prepare("SELECT countries FROM movies WHERE countries != '[]'").all()
  const countryMap = {}
  for (const row of rows) {
    for (const c of parseJson(row.countries)) {
      if (c.slug && !countryMap[c.slug]) countryMap[c.slug] = c
    }
  }
  res.json({ status: true, data: { items: Object.values(countryMap).sort((a, b) => a.name.localeCompare(b.name)) } })
})

// GET /v1/api/the-loai/:slug?page=N
app.get('/v1/api/the-loai/:slug', (req, res) => {
  const { slug } = req.params
  const page = parseInt(req.query.page, 10) || 1
  const offset = (page - 1) * PER_PAGE

  // SQLite JSON: check if categories contains slug
  const total = db.prepare(
    `SELECT COUNT(*) as c FROM movies WHERE categories LIKE ?`
  ).get(`%"slug":"${slug}"%`).c
  const items = db.prepare(
    `SELECT * FROM movies WHERE categories LIKE ? ORDER BY modified_at DESC LIMIT ? OFFSET ?`
  ).all(`%"slug":"${slug}"%`, PER_PAGE, offset)

  res.json({
    status: true,
    data: {
      titlePage: slug,
      items: items.map(movieRow),
      params: { pagination: paginate(page, total) },
    },
  })
})

// GET /v1/api/quoc-gia/:slug?page=N
app.get('/v1/api/quoc-gia/:slug', (req, res) => {
  const { slug } = req.params
  const page = parseInt(req.query.page, 10) || 1
  const offset = (page - 1) * PER_PAGE

  const total = db.prepare(
    `SELECT COUNT(*) as c FROM movies WHERE countries LIKE ?`
  ).get(`%"slug":"${slug}"%`).c
  const items = db.prepare(
    `SELECT * FROM movies WHERE countries LIKE ? ORDER BY modified_at DESC LIMIT ? OFFSET ?`
  ).all(`%"slug":"${slug}"%`, PER_PAGE, offset)

  res.json({
    status: true,
    data: {
      titlePage: slug,
      items: items.map(movieRow),
      params: { pagination: paginate(page, total) },
    },
  })
})

// GET /v1/api/danh-sach/:type?page=N  (phim-bo, phim-le, hoat-hinh, tv-shows)
app.get('/v1/api/danh-sach/:type', (req, res) => {
  const typeMap = { 'phim-bo': 'series', 'phim-le': 'single', 'hoat-hinh': 'hoathinh', 'tv-shows': 'tvshows' }
  const dbType = typeMap[req.params.type] ?? req.params.type
  const page = parseInt(req.query.page, 10) || 1
  const offset = (page - 1) * PER_PAGE

  const total = db.prepare('SELECT COUNT(*) as c FROM movies WHERE type = ?').get(dbType).c
  const items = db.prepare(
    'SELECT * FROM movies WHERE type = ? ORDER BY modified_at DESC LIMIT ? OFFSET ?'
  ).all(dbType, PER_PAGE, offset)

  res.json({
    status: true,
    data: {
      titlePage: req.params.type,
      items: items.map(movieRow),
      params: { pagination: paginate(page, total) },
    },
  })
})

// ── start ──────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  const total = db.prepare('SELECT COUNT(*) as c FROM movies').get().c
  console.log(`🚀 Local API server: http://localhost:${PORT}`)
  console.log(`📦 DB: ${total.toLocaleString()} movies`)
  console.log(`   Set VITE_API_BASE=http://localhost:${PORT} to use local data`)
})

process.on('SIGINT', () => { db.close(); process.exit(0) })
