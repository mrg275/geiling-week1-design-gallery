// Walkthrough harness: teleports through stations and screenshots each.
// Usage: node tour.js <url> <stationsFile> <outDir>
// Station: { name, x, z, yaw?, lookAt?: [tx, tz], pitch? }  (css units, 100 = 1 m)
// yaw convention (from the app): forward = (-sin yaw, -cos yaw); lookAt computes it.
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

(async () => {
  const [url, stationsFile, outDir] = process.argv.slice(2);
  const stations = JSON.parse(fs.readFileSync(stationsFile, 'utf8'));
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=metal'] });
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 850 } })).newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#loading', { state: 'detached', timeout: 90000 });
  await page.waitForTimeout(1500);
  for (const s of stations) {
    let yaw = s.yaw;
    if (yaw === undefined && s.lookAt) {
      const dx = s.lookAt[0] - s.x, dz = s.lookAt[1] - s.z;
      yaw = Math.atan2(-dx, -dz);
    }
    await page.evaluate(([x, z, y, p]) => { window.__lib.tp(x, z, y, p); }, [s.x, s.z, yaw || 0, s.pitch || 0.02]);
    await page.waitForTimeout(650);
    await page.screenshot({ path: path.join(outDir, s.name + '.png') });
    console.log('shot', s.name);
  }
  fs.writeFileSync(path.join(outDir, 'console-errors.txt'), errors.join('\n') || 'none');
  console.log('done;', errors.length, 'console errors');
  await browser.close();
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
