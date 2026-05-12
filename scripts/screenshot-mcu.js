// Capture matched-pair screenshots from the old Manx Credit Union site
// (mcu.im — looks like a legacy classic ASP build) and the new Vercel build
// for the /mcu case study. Same pattern as screenshot-lonsdale.js.
//
// Usage: node scripts/screenshot-mcu.js
// Output: public/assets/projects/mcu/{old,new}-{slug}.jpg

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT = path.resolve(__dirname, '..', 'public', 'assets', 'projects', 'mcu');
fs.mkdirSync(OUT, { recursive: true });

const PAGES = [
  ['home',       'https://www.mcu.im/',                          'https://manx-credit-union-mcu-website.vercel.app/'],
  ['loans',      'https://www.mcu.im/loans',                     'https://manx-credit-union-mcu-website.vercel.app/loans'],
  ['loan',       'https://www.mcu.im/loans/basic-loan',          'https://manx-credit-union-mcu-website.vercel.app/loans/basic'],
  ['join',       'https://www.mcu.im/joinus',                    'https://manx-credit-union-mcu-website.vercel.app/membership'],
  ['about',      'https://www.mcu.im/aboutus',                   'https://manx-credit-union-mcu-website.vercel.app/about'],
  ['contact',    'https://www.mcu.im/contact',                   'https://manx-credit-union-mcu-website.vercel.app/contact'],
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
  // Hide common cookie banners (don't click — that often follows a "more info"
  // link and navigates away)
  try {
    await page.addStyleTag({ content: `
      [id*=cookie-banner], [class*=cookie-banner], [class*=CookieBanner],
      [id*=cookie-notice], [class*=cookie-notice], #cookieConsent,
      .lc-cookie, .cli-modal, #wt-cli-cookie-bar { display: none !important; }
    `});
  } catch {}
  await page.waitForTimeout(1500);
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

  for (const [slug, oldUrl, newUrl] of PAGES) {
    console.log(`\n== ${slug.toUpperCase()} ==`);
    await capture(page, oldUrl, path.join(OUT, `old-${slug}.jpg`));
    await capture(page, newUrl, path.join(OUT, `new-${slug}.jpg`));
  }

  await browser.close();
  console.log('\nDone.');
})().catch(e => { console.error(e); process.exit(1); });
