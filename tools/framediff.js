// Proves a view is actually moving: two shots ~1.1s apart, reports changed pixels.
// Usage: node framediff.js <x> <z> <lookAtX> <lookAtZ> <pitch> <outPrefix>
const { chromium } = require('playwright-core');
const sharp = require('sharp');
(async () => {
  const [x, z, lx, lz, pitch, out] = process.argv.slice(2);
  const yaw = Math.atan2(-(lx - x), -(lz - z));
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=metal'] });
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 850 } })).newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.goto('http://localhost:8743/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#loading', { state: 'detached', timeout: 90000 });
  await page.evaluate(([a, b, y, p]) => window.__lib.tp(a, b, y, p),
                      [Number(x), Number(z), yaw, Number(pitch)]);
  await page.waitForTimeout(900);
  await page.screenshot({ path: out + '-a.png' });
  await page.waitForTimeout(1100);
  await page.screenshot({ path: out + '-b.png' });
  await browser.close();
  const A = await sharp(out + '-a.png').raw().toBuffer();
  const B = await sharp(out + '-b.png').raw().toBuffer();
  let diff = 0;
  for (let i = 0; i < A.length; i += 12) if (Math.abs(A[i] - B[i]) > 6) diff++;
  console.log('changed samples:', diff, diff > 1500 ? '(MOVING)' : '(too static)');
  console.log('pageerrors:', errs.length ? errs.join(' | ') : 'none');
})().catch(e => { console.error('FATAL', e); process.exit(1); });
