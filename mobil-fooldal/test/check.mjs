// Izolált teszt élesítés előtt: a három mobil blokkot egy Systeme-szerű
// oldalba teszi (asztali és mobil szekció, egyik CSS-sel rejtve), mellé egy
// "jk-" nevű asztali mintablokkot, mindkét DOM-sorrendben. Mér: oldalmagasság,
// vízszintes csúszás, duplikált id, konzolhiba, animált elemek, asztali
// animáció-osztályok. Képernyőképek: test/out/.
// Futtatás: node test/check.mjs   (előtte: node build.mjs)
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { readFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); } catch {
  playwright = require(join(execSync('npm root -g').toString().trim(), 'playwright'));
}
const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, 'out');
mkdirSync(outDir, { recursive: true });
const blocks = [1, 2, 3].map((n) => readFileSync(join(here, '..', 'dist', `mobil-fooldal-jkm-${n}.html`), 'utf8'));

const desktopBlock = `
<style>#jk-refs .jk-ref-item{opacity:0;transition:opacity .3s}#jk-refs .jk-ref-item.jk-in{opacity:1}</style>
<div id="jk-refs" style="padding:40px"><h2>Asztali referencia-blokk (minta)</h2>
  <div class="jk-ref-item">A</div><div class="jk-ref-item">B</div><div class="jk-ref-item">C</div></div>
<script>document.querySelectorAll('#jk-refs .jk-ref-item').forEach(function(el){el.classList.add('jk-in');});</script>`;

function page(order) {
  const desktop = `<section class="sio-desktop">${desktopBlock}<div style="height:1500px;background:#eef"></div></section>`;
  const mobile = `<section class="sio-mobile"><div class="sio-row">${blocks.map((b) => `<div class="sio-raw">${b}</div>`).join('')}</div></section>`;
  return `<!doctype html><html lang="hu"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  body{margin:0;font-family:Inter,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;background:#fff}
  header{height:64px;background:#0E1C43;color:#fff;display:flex;align-items:center;padding:0 16px;font-weight:800}
  footer{background:#0E1C43;color:#fff;padding:40px 16px}
  .sio-row{max-width:1100px;margin:0 auto;padding:0 10px}
  .sio-raw{width:100%}
  @media (max-width:800px){.sio-desktop{display:none}}
  @media (min-width:801px){.sio-mobile{display:none}}
  #chat{position:fixed;right:20px;bottom:20px;width:64px;height:64px;border-radius:50%;background:#2b6cf6;z-index:2147483647}
</style></head><body><header>Jimmy Klíma (fejléc)</header>
${order === 'mobile-first' ? mobile + desktop : desktop + mobile}
<footer>Lábléc</footer><div id="chat"></div></body></html>`;
}

function placeholder(url) {
  const n = parseInt(url.replace(/\D/g, '').slice(-3), 10) || 0;
  const [w, h] = n % 3 === 0 ? [900, 1200] : [1200, 900];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9fb0d6"/><stop offset="1" stop-color="#586a99"/></linearGradient></defs>
<rect width="100%" height="100%" fill="url(#g)"/><text x="50%" y="50%" font-family="sans-serif" font-size="56" fill="#fff" text-anchor="middle">Kép helye (${w}x${h})</text></svg>`;
}

async function run(browser, { name, width, height, order, reduce = false, shots = false }) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2, isMobile: width < 800, hasTouch: width < 800, reducedMotion: reduce ? 'reduce' : 'no-preference' });
  const pg = await ctx.newPage();
  const errors = [];
  pg.on('pageerror', (e) => errors.push(e.message));
  pg.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
  await pg.route('https://d1yei2z3i6k35z.cloudfront.net/**', (r) => r.fulfill({ contentType: 'image/svg+xml', body: placeholder(r.request().url()) }));
  await pg.route('https://test.local/', (r) => r.fulfill({ contentType: 'text/html', body: page(order) }));
  await pg.goto('https://test.local/');
  await pg.waitForTimeout(400);
  if (shots) await pg.screenshot({ path: join(outDir, `${name}-first-view.png`) });
  const total = await pg.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += Math.floor(height * 0.6)) {
    await pg.evaluate((yy) => window.scrollTo(0, yy), y);
    await pg.waitForTimeout(140);
  }
  await pg.waitForTimeout(900);
  const m = await pg.evaluate(() => {
    const ids = [...document.querySelectorAll('[id]')].map((e) => e.id);
    const vis = (el) => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
    const rv = [...document.querySelectorAll('[id^="jkm-b"] .jkm-rv, [id^="jkm-b"] .jkm-conn')].filter(vis);
    return {
      height: document.documentElement.scrollHeight,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      dupIds: ids.filter((id, i) => ids.indexOf(id) !== i),
      mobileVisible: vis(document.getElementById('jkm-b1')),
      animated: rv.length,
      animatedIn: rv.filter((e) => e.classList.contains('jkm-in')).length,
      notIn: rv.filter((e) => !e.classList.contains('jkm-in')).map((e) => (e.className.baseVal ?? e.className) + ' @' + Math.round(e.getBoundingClientRect().top + scrollY)),
      desktopIn: document.querySelectorAll('#jk-refs .jk-ref-item.jk-in').length,
      ctaLinks: [...document.querySelectorAll('[id^="jkm-b"] a.jkm-btn')].map((a) => `${a.textContent.trim()} -> ${a.href} [${a.target}|${a.rel}]`),
      fixedInMobile: [...document.querySelectorAll('[id^="jkm-b"] *')].filter((e) => getComputedStyle(e).position === 'fixed' && vis(e)).length,
      overflowing: [...document.querySelectorAll('[id^="jkm-b"] *')].filter((e) => {
        if (!vis(e) || e.closest('#jkm-services-vp, #jkm-refs-vp, #jkm-testi-vp, .jkm-brands, #jkm-hero-photo, .jkm-wave')) return false;
        const r = e.getBoundingClientRect();
        return r.right > window.innerWidth + 1 || r.left < -1;
      }).map((e) => e.className || e.tagName).slice(0, 5),
    };
  });
  if (shots) {
    await pg.evaluate(() => window.scrollTo(0, 0));
    await pg.waitForTimeout(300);
    await pg.screenshot({ path: join(outDir, `${name}-full.png`), fullPage: true });
  }
  await ctx.close();
  return { name, errors, ...m };
}

const browser = await playwright.chromium.launch();
const results = [];
for (const order of ['mobile-first', 'desktop-first']) {
  results.push(await run(browser, { name: `mobil-390-${order}`, width: 390, height: 844, order, shots: order === 'mobile-first' }));
  results.push(await run(browser, { name: `mobil-360-${order}`, width: 360, height: 780, order, shots: order === 'mobile-first' }));
  results.push(await run(browser, { name: `desktop-1280-${order}`, width: 1280, height: 900, order, shots: order === 'mobile-first' }));
}
results.push(await run(browser, { name: 'mobil-390-reduced-motion', width: 390, height: 844, order: 'mobile-first', reduce: true }));
await browser.close();

let ok = true;
for (const r of results) {
  const mobile = r.innerWidth < 800;
  const problems = [];
  if (r.errors.length) problems.push('konzolhiba: ' + r.errors.join(' | '));
  if (r.dupIds.length) problems.push('duplikált id: ' + r.dupIds.join(','));
  if (r.scrollWidth > r.innerWidth) problems.push(`vízszintes csúszás ${r.scrollWidth}>${r.innerWidth}`);
  if (r.desktopIn !== 3) problems.push(`asztali animáció-osztály ${r.desktopIn}/3`);
  if (mobile && !r.mobileVisible) problems.push('mobil tartalom nem látszik');
  if (!mobile && r.mobileVisible) problems.push('mobil tartalom látszik asztalin');
  if (mobile && r.animatedIn !== r.animated) problems.push(`animált elemek ${r.animatedIn}/${r.animated}: ${r.notIn.join(', ')}`);
  if (mobile && r.fixedInMobile) problems.push('látható fixed elem a mobil blokkban');
  if (mobile && r.overflowing.length) problems.push('kilógó elem: ' + r.overflowing.join(','));
  if (problems.length) ok = false;
  console.log(`${problems.length ? 'HIBA' : 'OK  '} ${r.name.padEnd(28)} magasság ${String(r.height).padStart(5)} px, scrollWidth ${r.scrollWidth}/${r.innerWidth}, animált ${r.animatedIn}/${r.animated}, asztali jk-in ${r.desktopIn}/3${problems.length ? '\n     ' + problems.join('\n     ') : ''}`);
}
console.log('\nCTA gombok:\n  ' + results[0].ctaLinks.join('\n  '));
process.exit(ok ? 0 : 1);
