import { getBrowser, getPage, disconnectBrowser, outputJSON } from '/Users/bachasia/.claude/skills/chrome-devtools/scripts/lib/browser.js'

const OUT = '/Users/bachasia/Working/VibeCoding/vibephim/.claude/chrome-devtools/screenshots'

async function run() {
  const browser = await getBrowser({ close: true })
  const page = await getPage(browser)
  await page.setViewport({ width: 1440, height: 900 })

  // HOME hero (check left dead zone reduction)
  await page.goto('http://localhost:5200/', { waitUntil: 'domcontentloaded', timeout: 15000 })
  await new Promise(r => setTimeout(r, 7000))
  await page.screenshot({ path: `${OUT}/fix-home.png`, clip: { x: 0, y: 0, width: 1440, height: 900 } })

  // Category page (check header clearance)
  await page.goto('http://localhost:5200/the-loai/hanh-dong', { waitUntil: 'domcontentloaded', timeout: 10000 })
  await new Promise(r => setTimeout(r, 2000))
  await page.screenshot({ path: `${OUT}/fix-category.png`, clip: { x: 0, y: 0, width: 1440, height: 900 } })

  // Country page
  await page.goto('http://localhost:5200/quoc-gia/han-quoc', { waitUntil: 'domcontentloaded', timeout: 10000 })
  await new Promise(r => setTimeout(r, 2000))
  await page.screenshot({ path: `${OUT}/fix-country.png`, clip: { x: 0, y: 0, width: 1440, height: 900 } })

  // Detail page
  await page.goto('http://localhost:5200/phim/cham-soc-tu-lanh-cua-toi-nhe-phan-2', { waitUntil: 'domcontentloaded', timeout: 10000 })
  await new Promise(r => setTimeout(r, 3000))
  await page.screenshot({ path: `${OUT}/fix-detail.png`, clip: { x: 0, y: 0, width: 1440, height: 900 } })

  outputJSON({ success: true })
  await disconnectBrowser()
}

run().catch(e => { console.error(JSON.stringify({ success: false, error: e.message })); process.exit(1) })
