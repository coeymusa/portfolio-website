// Capture matched-pair screenshots from the old WP and new Astro Lonsdale sites
// for the /lonsdale case study. Hero (1440x900 viewport) only — keeps file sizes
// modest and forces a meaningful above-the-fold comparison.
//
// Usage: node scripts/screenshot-lonsdale.js
// Output: src/assets/projects/lonsdale/{wp,astro}-{slug}.jpg

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT = path.resolve(__dirname, '..', 'src', 'assets', 'projects', 'lonsdale');
fs.mkdirSync(OUT, { recursive: true });

// Slug → [WP url, Astro url]. Hero (viewport) shot, JPG q85.
const PAGES = [
  ['home',         'https://www.lonsdalecommercials.co.uk/',                                                                                                'https://londsdale.vercel.app/'],
  ['archive',      'https://www.lonsdalecommercials.co.uk/van-sales/',                                                                                      'https://londsdale.vercel.app/van-sales/'],
  ['product',      'https://www.lonsdalecommercials.co.uk/product/citroen-relay-luton-body-van-inc-tail-lift-13-4ft-335l3-blue2-2hdi-140ps-euro-6-4-copy/', 'https://londsdale.vercel.app/van-sales/citroen-relay-luton-body-van-inc-tail-lift-13-4ft-335l3-blue2-2hdi-140ps-euro-6-/'],
  ['bodybuilding', 'https://www.lonsdalecommercials.co.uk/bodybuilding/',                                                                                   'https://londsdale.vercel.app/bodybuilding/'],
  ['about',        'https://www.lonsdalecommercials.co.uk/about-us/',                                                                                       'https://londsdale.vercel.app/about/'],
  ['contact',      'https://www.lonsdalecommercials.co.uk/contact-us/',                                                                                     'https://londsdale.vercel.app/contact-us/'],
];

const VIEWPORT = { width: 1440, height: 900 };

async function capture(page, url, file) {
  console.log(`  → ${url}`);
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  } catch (e) {
    console.log(`    networkidle timed out, falling back to domcontentloaded`);
    try { await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 }); }
    catch (e2) { console.log(`    FAILED: ${e2.message}`); return false; }
  }
  // Hide common cookie banners (don't *click* — that often follows a "more info"
  // link and navigates us away from the page we wanted to shoot).
  try {
    await page.addStyleTag({ content: `
      .lc-cookie, #cookie-notice, #wt-cli-cookie-bar, .cli-modal, .pms-chat-widget-trigger,
      [id*=cookie-banner], [class*=cookie-banner], [class*=CookieBanner],
      .promptmysite-bubble, iframe[src*=promptmysite], iframe[src*=cookie] { display: none !important; }
    `});
  } catch {}
  // Give late-loading images / fonts a tick
  await page.waitForTimeout(1500);
  // Force eager-load any lazy imgs in the viewport
  try {
    await page.evaluate(() => {
      document.querySelectorAll('img[loading="lazy"]').forEach(img => img.loading = 'eager');
    });
    await page.waitForTimeout(500);
  } catch {}
  await page.screenshot({ path: file, type: 'jpeg', quality: 85 });
  console.log(`    saved → ${path.basename(file)}`);
  return true;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  });
  const page = await ctx.newPage();

  for (const [slug, wpUrl, astroUrl] of PAGES) {
    console.log(`\n== ${slug.toUpperCase()} ==`);
    await capture(page, wpUrl,    path.join(OUT, `wp-${slug}.jpg`));
    await capture(page, astroUrl, path.join(OUT, `astro-${slug}.jpg`));
  }

  await browser.close();
  console.log('\nDone.');
})().catch(e => { console.error(e); process.exit(1); });
