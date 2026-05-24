import { getBrowser, getPage, disconnectBrowser, outputJSON } from '/Users/bachasia/.claude/skills/chrome-devtools/scripts/lib/browser.js'

const OUT = '/Users/bachasia/Working/VibeCoding/vibephim/.claude/chrome-devtools/screenshots'

async function shot(page, name, opts = {}) {
  await page.screenshot({ path: `${OUT}/${name}.png`, ...opts })
}

async function run() {
  const browser = await getBrowser({ close: true })
  const page = await getPage(browser)
  const errors = []
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
  await page.setViewport({ width: 1440, height: 900 })

  // HOME — hero area
  await page.goto('http://localhost:5200/', { waitUntil: 'domcontentloaded', timeout: 15000 })
  await new Promise(r => setTimeout(r, 7000))
  await shot(page, 'p0-home-hero', { clip: { x: 0, y: 0, width: 1440, height: 900 } })

  // HOME — scroll to carousels
  await page.evaluate(() => window.scrollTo(0, 900))
  await new Promise(r => setTimeout(r, 400))
  await shot(page, 'p0-home-carousels', { clip: { x: 0, y: 0, width: 1440, height: 900 } })

  // HOME — scroll to Top10 section
  await page.evaluate(() => window.scrollTo(0, 2400))
  await new Promise(r => setTimeout(r, 400))
  await shot(page, 'p0-home-top10', { clip: { x: 0, y: 0, width: 1440, height: 900 } })

  // HOME — footer area
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await new Promise(r => setTimeout(r, 400))
  await shot(page, 'p0-home-footer', { clip: { x: 0, y: 0, width: 1440, height: 900 } })

  // BROWSE page
  await page.goto('http://localhost:5200/browse', { waitUntil: 'domcontentloaded', timeout: 10000 })
  await new Promise(r => setTimeout(r, 3000))
  await shot(page, 'p1-browse', { clip: { x: 0, y: 0, width: 1440, height: 900 } })

  // DETAIL page — pick a slug from rendered links
  const movieSlug = await page.evaluate(() => {
    const a = document.querySelector('a[href^="/phim/"]')
    return a ? a.getAttribute('href').replace('/phim/', '') : null
  })
  if (movieSlug) {
    await page.goto(`http://localhost:5200/phim/${movieSlug}`, { waitUntil: 'domcontentloaded', timeout: 10000 })
    await new Promise(r => setTimeout(r, 3000))
    await shot(page, 'p2-detail', { clip: { x: 0, y: 0, width: 1440, height: 900 } })
  }

  // CATEGORY page
  await page.goto('http://localhost:5200/the-loai/hanh-dong', { waitUntil: 'domcontentloaded', timeout: 10000 })
  await new Promise(r => setTimeout(r, 2000))
  await shot(page, 'p3-category', { clip: { x: 0, y: 0, width: 1440, height: 900 } })

  // FAVORITES page
  await page.goto('http://localhost:5200/yeu-thich', { waitUntil: 'domcontentloaded', timeout: 10000 })
  await new Promise(r => setTimeout(r, 1000))
  await shot(page, 'p4-favorites', { clip: { x: 0, y: 0, width: 1440, height: 900 } })

  // 404 page
  await page.goto('http://localhost:5200/not-exist', { waitUntil: 'domcontentloaded', timeout: 10000 })
  await new Promise(r => setTimeout(r, 1000))
  await shot(page, 'p5-notfound', { clip: { x: 0, y: 0, width: 1440, height: 900 } })

  outputJSON({ success: true, errors: errors.slice(0, 10), movieSlug })
  await disconnectBrowser()
}

run().catch(e => { console.error(JSON.stringify({ success: false, error: e.message })); process.exit(1) })
