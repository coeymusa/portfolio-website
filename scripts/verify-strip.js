// Quick verification: snap the live Astro home and dump computed padding +
// bounding rects for the stock strip parts so we can see whether the fix has
// actually shipped and is being applied.

const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });
  const page = await ctx.newPage();
  await page.goto('https://londsdale.vercel.app/?cb=' + Date.now(), {
    waitUntil: 'networkidle',
    timeout: 30000,
  });
  await page.waitForTimeout(1000);

  const data = await page.evaluate(() => {
    const strip = document.querySelector('.lc-stock-strip');
    const inner = document.querySelector('.lc-stock-strip__inner');
    const tag = document.querySelector('.lc-stock-strip__tag');
    const cta = document.querySelector('.lc-stock-strip__cta');
    const text = document.querySelector('.lc-stock-strip__text');
    const innerCs = inner ? getComputedStyle(inner) : null;
    const header = document.querySelector('header .lc-container, .lc-header__inner');
    return {
      viewport: { w: innerWidth, h: innerHeight },
      strip: strip ? strip.getBoundingClientRect() : null,
      inner: inner ? {
        rect: inner.getBoundingClientRect(),
        cs: {
          paddingLeft: innerCs.paddingLeft,
          paddingRight: innerCs.paddingRight,
          paddingTop: innerCs.paddingTop,
          paddingBottom: innerCs.paddingBottom,
          maxWidth: innerCs.maxWidth,
          width: innerCs.width,
        },
      } : null,
      tag: tag ? tag.getBoundingClientRect() : null,
      text: text ? text.getBoundingClientRect() : null,
      cta: cta ? cta.getBoundingClientRect() : null,
      header: header ? header.getBoundingClientRect() : null,
    };
  });
  console.log(JSON.stringify(data, null, 2));

  const out = path.resolve(__dirname, '..', '.tmp', 'strip-verify.jpg');
  require('fs').mkdirSync(path.dirname(out), { recursive: true });
  await page.screenshot({ path: out, type: 'jpeg', quality: 85, clip: { x: 0, y: 0, width: 1920, height: 240 } });
  console.log('\nsaved →', out);

  await browser.close();
})();
