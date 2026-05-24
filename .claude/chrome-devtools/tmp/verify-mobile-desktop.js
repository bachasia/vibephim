import { getBrowser, getPage, disconnectBrowser, outputJSON } from '/Users/bachasia/.claude/skills/chrome-devtools/scripts/lib/browser.js'

const OUT = '/Users/bachasia/Working/VibeCoding/vibephim/.claude/chrome-devtools/screenshots'

async function run() {
  const browser = await getBrowser({ close: true })
  const page = await getPage(browser)

  // Desktop — home hero
  await page.setViewport({ width: 1440, height: 900 })
  await page.goto('http://localhost:5200/', { waitUntil: 'domcontentloaded', timeout: 15000 })
  await new Promise(r => setTimeout(r, 6000))
  await page.screenshot({ path: `${OUT}/verify-desktop-home.png`, clip: { x: 0, y: 0, width: 1440, height: 900 } })

  // Desktop — scroll to carousel section
  await page.evaluate(() => window.scrollTo(0, 750))
  await new Promise(r => setTimeout(r, 500))
  await page.screenshot({ path: `${OUT}/verify-desktop-carousel.png`, clip: { x: 0, y: 0, width: 1440, height: 900 } })

  // Mobile — home hero
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  await page.goto('http://localhost:5200/', { waitUntil: 'domcontentloaded', timeout: 15000 })
  await new Promise(r => setTimeout(r, 6000))
  await page.screenshot({ path: `${OUT}/verify-mobile-home.png` })

  // Mobile — scroll down
  await page.evaluate(() => window.scrollTo(0, 900))
  await new Promise(r => setTimeout(r, 500))
  await page.screenshot({ path: `${OUT}/verify-mobile-scroll.png` })

  // Mobile — category page
  await page.goto('http://localhost:5200/the-loai/hanh-dong', { waitUntil: 'domcontentloaded', timeout: 10000 })
  await new Promise(r => setTimeout(r, 2000))
  await page.screenshot({ path: `${OUT}/verify-mobile-category.png` })

  outputJSON({ success: true })
  await disconnectBrowser()
}

run().catch(e => { console.error(JSON.stringify({ success: false, error: e.message })); process.exit(1) })
