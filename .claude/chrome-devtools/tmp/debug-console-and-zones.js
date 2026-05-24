import { getBrowser, getPage, disconnectBrowser, outputJSON } from '/Users/bachasia/.claude/skills/chrome-devtools/scripts/lib/browser.js'

async function run() {
  const browser = await getBrowser({ close: true })
  const page = await getPage(browser)

  const consoleLogs = []
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warn') {
      consoleLogs.push({ type: msg.type(), text: msg.text() })
    }
  })

  await page.setViewport({ width: 1440, height: 900 })
  await page.goto('http://localhost:5200/', { waitUntil: 'domcontentloaded', timeout: 15000 })
  await new Promise(r => setTimeout(r, 7000))

  // Hero area
  await page.screenshot({
    path: '/Users/bachasia/Working/VibeCoding/vibephim/.claude/chrome-devtools/screenshots/zone-hero.png',
    clip: { x: 0, y: 0, width: 1440, height: 860 },
  })

  // Hero bottom + first carousel
  await page.screenshot({
    path: '/Users/bachasia/Working/VibeCoding/vibephim/.claude/chrome-devtools/screenshots/zone-hero-transition.png',
    clip: { x: 0, y: 680, width: 1440, height: 320 },
  })

  // Scroll down to see more sections
  await page.evaluate(() => window.scrollTo(0, 1800))
  await new Promise(r => setTimeout(r, 500))
  await page.screenshot({
    path: '/Users/bachasia/Working/VibeCoding/vibephim/.claude/chrome-devtools/screenshots/zone-mid.png',
    clip: { x: 0, y: 0, width: 1440, height: 900 },
  })

  outputJSON({
    success: true,
    url: page.url(),
    consoleLogs: consoleLogs.slice(0, 20),
  })
  await disconnectBrowser()
}

run().catch(e => { console.error(JSON.stringify({ success: false, error: e.message })); process.exit(1) })
