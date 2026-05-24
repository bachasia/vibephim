/**
 * Screenshot after waiting for React data to load
 * Uses puppeteer from chrome-devtools scripts
 */
const SKILL = '/Users/bachasia/.claude/skills/chrome-devtools/scripts';
const { default: puppeteer } = await import(`${SKILL}/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js`).catch(() =>
  import(`${SKILL}/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer.js`)
);
