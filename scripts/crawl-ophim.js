/**
 * OPhim crawler — fetches all movies + episodes into SQLite.
 * Resumes from where it left off (skips crawled pages and fetched slugs).
 * Usage: node scripts/crawl-ophim.js [--concurrency=5] [--delay=300]
 */

import { openDb, initDb } from './db-init.js'

const API_BASE = 'https://ophim1.com'
const ARGS = Object.fromEntries(
  process.argv.slice(2)
    .filter(a => a.startsWith('--'))
    .map(a => { const [k, v] = a.slice(2).split('='); return [k, v ?? true] })
)
const CONCURRENCY = parseInt(ARGS.concurrency ?? '5', 10)
const DELAY_MS = parseInt(ARGS.delay ?? '300', 10)

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

async function fetchJson(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(15000) })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return await res.json()
    } catch (err) {
      if (i === retries - 1) throw err
      await sleep(1000 * (i + 1))
    }
  }
}

function saveMovie(db, movie, episodes) {
  const upsert = db.prepare(`
    INSERT OR REPLACE INTO movies
      (slug, name, origin_name, type, status, thumb_url, poster_url, year, time,
       quality, lang, content, episode_current, episode_total, view,
       actor, director, categories, countries, trailer_url, modified_at, created_at, fetched_at)
    VALUES
      (@slug, @name, @origin_name, @type, @status, @thumb_url, @poster_url, @year, @time,
       @quality, @lang, @content, @episode_current, @episode_total, @view,
       @actor, @director, @categories, @countries, @trailer_url, @modified_at, @created_at, @fetched_at)
  `)

  const delEps = db.prepare('DELETE FROM episodes WHERE movie_slug = ?')
  const insEp  = db.prepare(`
    INSERT INTO episodes (movie_slug, server_name, ep_name, ep_slug, link_embed, link_m3u8)
    VALUES (@movie_slug, @server_name, @ep_name, @ep_slug, @link_embed, @link_m3u8)
  `)

  const run = db.transaction(() => {
    upsert.run({
      slug: movie.slug,
      name: movie.name,
      origin_name: movie.origin_name ?? '',
      type: movie.type ?? '',
      status: movie.status ?? '',
      thumb_url: movie.thumb_url ?? '',
      poster_url: movie.poster_url ?? '',
      year: movie.year ?? null,
      time: movie.time ?? '',
      quality: movie.quality ?? '',
      lang: movie.lang ?? '',
      content: movie.content ?? '',
      episode_current: movie.episode_current ?? '',
      episode_total: movie.episode_total ?? '',
      view: movie.view ?? 0,
      actor: JSON.stringify(movie.actor ?? []),
      director: JSON.stringify(movie.director ?? []),
      categories: JSON.stringify(movie.category ?? []),
      countries: JSON.stringify(movie.country ?? []),
      trailer_url: movie.trailer_url ?? '',
      modified_at: movie.modified?.time ?? '',
      created_at: movie.created?.time ?? '',
      fetched_at: new Date().toISOString(),
    })

    delEps.run(movie.slug)
    for (const server of (episodes ?? [])) {
      for (const ep of (server.server_data ?? [])) {
        insEp.run({
          movie_slug: movie.slug,
          server_name: server.server_name ?? '',
          ep_name: ep.name ?? '',
          ep_slug: ep.slug ?? '',
          link_embed: ep.link_embed ?? '',
          link_m3u8: ep.link_m3u8 ?? '',
        })
      }
    }
  })

  run()
}

async function processSlug(db, slug) {
  const data = await fetchJson(`${API_BASE}/phim/${slug}`)
  if (!data?.movie) return
  saveMovie(db, data.movie, data.episodes)
}

async function crawlPage(db, page, knownSlugs) {
  const data = await fetchJson(`${API_BASE}/danh-sach/phim-moi-cap-nhat?page=${page}`)
  const items = data?.items ?? []

  const newSlugs = items.map(i => i.slug).filter(s => !knownSlugs.has(s))

  for (const slug of newSlugs) {
    try {
      await processSlug(db, slug)
      knownSlugs.add(slug)
    } catch (err) {
      console.warn(`  ⚠ slug ${slug}: ${err.message}`)
    }
    await sleep(DELAY_MS)
  }

  db.prepare('INSERT OR REPLACE INTO crawl_pages (page, crawled_at) VALUES (?, ?)').run(page, new Date().toISOString())
  return { page, fetched: newSlugs.length, total: items.length }
}

async function runConcurrent(tasks, concurrency) {
  const results = []
  const queue = [...tasks]

  async function worker() {
    while (queue.length > 0) {
      const task = queue.shift()
      results.push(await task())
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker))
  return results
}

async function main() {
  const db = openDb()
  initDb(db)

  // Get total pages
  const first = await fetchJson(`${API_BASE}/danh-sach/phim-moi-cap-nhat?page=1`)
  const { totalPages, totalItems } = first.pagination
  console.log(`📦 OPhim: ${totalItems.toLocaleString()} movies across ${totalPages} pages`)

  // Build sets of already-crawled pages and slugs
  const donePagesSet = new Set(
    db.prepare('SELECT page FROM crawl_pages').all().map(r => r.page)
  )
  const knownSlugs = new Set(
    db.prepare('SELECT slug FROM movies').all().map(r => r.slug)
  )

  const pendingPages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(p => !donePagesSet.has(p))

  console.log(`✅ Already done: ${donePagesSet.size} pages, ${knownSlugs.size} movies`)
  console.log(`⏳ Remaining: ${pendingPages.length} pages | concurrency=${CONCURRENCY} delay=${DELAY_MS}ms`)

  if (pendingPages.length === 0) {
    console.log('🎉 All pages already crawled!')
    db.close()
    return
  }

  let completed = 0
  const startTime = Date.now()

  // Process pages in concurrent batches
  for (let i = 0; i < pendingPages.length; i += CONCURRENCY) {
    const batch = pendingPages.slice(i, i + CONCURRENCY)
    const tasks = batch.map(page => () => crawlPage(db, page, knownSlugs))

    const results = await Promise.all(tasks.map(t => t()))
    completed += batch.length

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(0)
    const rate = (completed / (elapsed / 60)).toFixed(1)
    const remaining = pendingPages.length - completed
    const etaMin = remaining > 0 ? (remaining / (completed / (elapsed / 60))).toFixed(0) : 0

    const fetched = results.reduce((s, r) => s + r.fetched, 0)
    console.log(
      `📄 Pages ${batch[0]}–${batch[batch.length - 1]} | +${fetched} new | ` +
      `${completed}/${pendingPages.length} pages (${rate}/min) | ETA ~${etaMin}min`
    )
  }

  const totalMovies = db.prepare('SELECT COUNT(*) as c FROM movies').get().c
  const totalEps = db.prepare('SELECT COUNT(*) as c FROM episodes').get().c
  console.log(`\n🎉 Done! DB: ${totalMovies.toLocaleString()} movies, ${totalEps.toLocaleString()} episodes`)
  db.close()
}

main().catch(err => {
  console.error('❌ Crawler error:', err)
  process.exit(1)
})
