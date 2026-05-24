import { getBrowser, getPage, disconnectBrowser, outputJSON } from '/Users/bachasia/.claude/skills/chrome-devtools/scripts/lib/browser.js'

async function run() {
  const browser = await getBrowser()
  const page = await getPage(browser)

  await page.goto('http://localhost:5200/', { waitUntil: 'domcontentloaded', timeout: 15000 })
  await new Promise(r => setTimeout(r, 5000))

  await page.screenshot({
    path: '/Users/bachasia/Working/VibeCoding/vibephim/.claude/chrome-devtools/screenshots/hero-final.png',
    fullPage: false,
  })

  outputJSON({ success: true, url: page.url(), title: await page.title() })
  await disconnectBrowser()
}

run().catch(e => { console.error(JSON.stringify({ success: false, error: e.message })); process.exit(1) })
