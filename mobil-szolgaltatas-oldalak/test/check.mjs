// Izolált teszt élesítés előtt (mesterjegyzet 10. pont): minden oldal blokkjait
// egy Systeme-szerű mintaoldalba teszi (asztali és mobil szekció, egyik CSS-sel
// rejtve) egy "jk-" nevű asztali mintablokk és egy popup-gomb mellé, mindkét
// DOM-sorrendben. Mér: oldalmagasság, vízszintes csúszás, duplikált id,
// konzolhiba, animált elemek, lebegő gomb és chat-sarok, asztali animáció.
// Képernyőképek: test/out/<oldal>-<szélesség>-NN.png
// Futtatás: node build.mjs && node test/check.mjs
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); } catch {
  playwright = require(join(execSync('npm root -g').toString().trim(), 'playwright'));
}
const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, '..', 'dist');
const outDir = join(here, 'out');
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const pages = {};
for (const f of readdirSync(dist).filter((f) => f.endsWith('.html')).sort()) {
  const name = f.replace(/^mobil-/, '').replace(/(-\d)?\.html$/, '');
  (pages[name] ||= []).push(readFileSync(join(dist, f), 'utf8'));
}

const desktopBlock = `
<style>#jk-steps .jk-step{opacity:0;transition:opacity .3s}#jk-steps .jk-step.jk-in{opacity:1}</style>
<div id="jk-steps" style="padding:40px"><h2>Asztali mintablokk</h2>
  <div class="jk-step">A</div><div class="jk-step">B</div><div class="jk-step">C</div>
  <button data-test-id="show-popup-button" onclick="window.__popupClicked=(window.__popupClicked||0)+1">Popup</button></div>
<script>document.querySelectorAll('#jk-steps .jk-step').forEach(function(el){el.classList.add('jk-in');});</script>`;

function page(blocks, order) {
  const desktop = `<section class="sio-desktop">${desktopBlock}<div style="height:1400px;background:#eef"></div></section>`;
  const mobile = `<section class="sio-mobile"><div class="sio-row">${blocks.map((b) => `<div class="sio-raw">${b}</div>`).join('')}</div></section>`;
  return `<!doctype html><html lang="hu"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  body{margin:0;font-family:system-ui,sans-serif;background:#fff}
  header{height:64px;background:#0E1C43;color:#fff;display:flex;align-items:center;padding:0 16px;font-weight:800}
  footer{background:#0E1C43;color:#fff;padding:40px 16px}
  .sio-row{max-width:1100px;margin:0 auto;padding:0 10px}
  .sio-mobile{padding-bottom:8px;background:#fff}
  @media (max-width:800px){.sio-desktop{display:none}}
  @media (min-width:801px){.sio-mobile{display:none}}
  #chat{position:fixed;right:20px;bottom:20px;width:64px;height:64px;border-radius:50%;background:#2b6cf6;z-index:2147483647}
</style></head><body><header>Jimmy Klíma (fejléc)</header>
${order === 'mobile-first' ? mobile + desktop : desktop + mobile}
<footer>Lábléc</footer><div id="chat"></div></body></html>`;
}

function placeholder(url) {
  const hero = /Gemini/.test(url);
  const [w, h] = hero ? [1200, 700] : /1111\.jpg/.test(url) ? [1500, 1372] : [1125, 1500];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<rect width="100%" height="100%" fill="${hero ? '#5b6f9e' : '#8a9bc4'}"/><text x="50%" y="50%" font-family="sans-serif" font-size="64" fill="#fff" text-anchor="middle">${hero ? 'Hero kép helye' : 'Referencia'} ${w}x${h}</text></svg>`;
}

async function run(browser, { name, blocks, width, height, order, reduce = false, shots = false }) {
  const mobile = width < 800;
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile, reducedMotion: reduce ? 'reduce' : 'no-preference' });
  const pg = await ctx.newPage();
  const errors = [];
  pg.on('pageerror', (e) => errors.push(e.message));
  pg.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
  await pg.route('https://d1yei2z3i6k35z.cloudfront.net/**', (r) => r.fulfill({ contentType: 'image/svg+xml', body: placeholder(r.request().url()) }));
  await ctx.route('https://growthnestg.zohobookings.eu/**', (r) => r.fulfill({ contentType: 'text/html', body: 'zoho' }));
  await pg.route('https://test.local/', (r) => r.fulfill({ contentType: 'text/html', body: page(blocks, order) }));
  await pg.goto('https://test.local/');
  await pg.waitForTimeout(500);

  const total = await pg.evaluate(() => document.documentElement.scrollHeight);
  const fabStates = [];
  let shot = 0;
  for (let y = 0; y < total; y += height - 80) {
    await pg.evaluate((yy) => window.scrollTo(0, yy), y);
    await pg.waitForTimeout(shots ? 1000 : 160);
    fabStates.push(await pg.evaluate(() => {
      const f = document.querySelector('[class$="-fab"], [class*="-fab "]');
      if (!f || !f.className.includes('-show')) return null;
      const r = f.getBoundingClientRect();
      return { right: Math.round(r.right), bottom: Math.round(r.bottom), w: innerWidth, h: innerHeight };
    }));
    if (shots) await pg.screenshot({ path: join(outDir, `${name}-${String(shot++).padStart(2, '0')}.png`) });
  }
  await pg.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await pg.waitForTimeout(900);
  const m = await pg.evaluate(() => {
    const vis = (el) => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
    const ids = [...document.querySelectorAll('[id]')].map((e) => e.id);
    const roots = [...document.querySelectorAll('div[id^="jkm-"][id*="-root"]')];
    const rv = roots.flatMap((r) => [...r.querySelectorAll('[class*="-rv"]')]).filter((e) => /-rv( |$)/.test(e.className) && vis(e));
    const all = roots.flatMap((r) => [...r.querySelectorAll('*')]);
    return {
      height: document.documentElement.scrollHeight,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      dupIds: ids.filter((id, i) => ids.indexOf(id) !== i),
      mobileVisible: roots.length > 0 && roots.every(vis),
      animated: rv.length,
      notIn: rv.filter((e) => !/-in( |$)/.test(e.className)).map((e) => e.className.split(' ')[0]),
      desktopIn: document.querySelectorAll('#jk-steps .jk-step.jk-in').length,
      fabAtEnd: !!document.querySelector('[class*="-fab "][class*="-show"], [class$="-show"][class*="-fab"]'),
      overflowing: all.filter((e) => {
        if (!vis(e) || e.closest('[class*="gal-vp"], [class*="-lb"]') || getComputedStyle(e).position === 'fixed') return false;
        const r = e.getBoundingClientRect();
        return r.right > window.innerWidth + 1 || r.left < -1;
      }).map((e) => e.className.baseVal ?? e.className).slice(0, 5),
      links: [...new Set(roots.flatMap((r) => [...r.querySelectorAll('a')]).map((a) => `${a.textContent.trim()} -> ${a.getAttribute('href')}${a.target ? ' [' + a.target + '|' + a.rel + ']' : ''}`))],
      smallTargets: roots.flatMap((r) => [...r.querySelectorAll('a, button')]).filter((e) => vis(e) && !/-dot/.test(e.className) && e.getBoundingClientRect().height < 44).map((e) => e.className),
    };
  });
  let popupClicked = 0, newPage = false;
  if (mobile && !reduce) {
    const ctaSel = '[id$="-root"] [class*="-btn-lime"][target="_blank"]';
    await pg.evaluate(() => window.scrollTo(0, 0));
    await pg.waitForTimeout(700);
    const [popup] = await Promise.all([ctx.waitForEvent('page', { timeout: 3000 }).catch(() => null), pg.click(ctaSel)]);
    if (popup) await popup.waitForLoadState().catch(() => {});
    newPage = !!popup && /zohobookings/.test(popup.url());
    popupClicked = await pg.evaluate(() => window.__popupClicked || 0);
  }
  await ctx.close();
  return { name, errors, fabStates: fabStates.filter(Boolean), popupClicked, newPage, ...m };
}

const browser = await playwright.chromium.launch();
const results = [];
for (const [name, blocks] of Object.entries(pages)) {
  for (const order of ['mobile-first', 'desktop-first']) {
    const first = order === 'mobile-first';
    results.push(await run(browser, { name: `${name}-390-${order}`, blocks, width: 390, height: 844, order, shots: first }));
    results.push(await run(browser, { name: `${name}-360-${order}`, blocks, width: 360, height: 800, order, shots: first }));
    results.push(await run(browser, { name: `${name}-1280-${order}`, blocks, width: 1280, height: 900, order }));
  }
  results.push(await run(browser, { name: `${name}-390-reduced`, blocks, width: 390, height: 844, order: 'mobile-first', reduce: true }));
}
await browser.close();

let ok = true;
for (const r of results) {
  const mobile = r.innerWidth < 800;
  const problems = [];
  if (r.errors.length) problems.push('konzolhiba: ' + r.errors.join(' | '));
  if (r.dupIds.length) problems.push('duplikált id: ' + r.dupIds.join(','));
  if (r.scrollWidth > r.innerWidth) problems.push(`vízszintes csúszás ${r.scrollWidth}>${r.innerWidth}`);
  if (r.desktopIn !== 3) problems.push(`asztali animáció ${r.desktopIn}/3`);
  if (mobile && !r.mobileVisible) problems.push('mobil tartalom nem látszik');
  if (!mobile && r.mobileVisible) problems.push('mobil tartalom látszik asztalin');
  if (mobile && r.notIn.length) problems.push(`nem jelent meg: ${r.notIn.join(', ')}`);
  if (mobile && r.overflowing.length) problems.push('kilógó elem: ' + r.overflowing.join(','));
  if (mobile && r.smallTargets.length) problems.push('44 px alatti érintési cél: ' + r.smallTargets.join(','));
  if (mobile && r.fabAtEnd) problems.push('lebegő gomb látszik a záró gombsornál');
  const corner = r.fabStates.filter((f) => f.right > f.w - 84 - 4);
  if (corner.length) problems.push('lebegő gomb a chat-sarokba lóg');
  if (mobile && !r.name.includes('reduced') && !r.fabStates.length) problems.push('a lebegő gomb sosem jelent meg');
  if (mobile && !r.name.includes('reduced') && (!r.newPage || r.popupClicked)) problems.push(`CTA: új lap ${r.newPage}, popup ${r.popupClicked}`);
  if (problems.length) ok = false;
  console.log(`${problems.length ? 'HIBA' : 'OK  '} ${r.name.padEnd(36)} ${String(r.height).padStart(5)} px, csúszás ${r.scrollWidth}/${r.innerWidth}, animált ${r.animated - r.notIn.length}/${r.animated}, asztali ${r.desktopIn}/3${problems.length ? '\n     ' + problems.join('\n     ') : ''}`);
}
for (const [name] of Object.entries(pages)) {
  const r = results.find((x) => x.name === `${name}-390-mobile-first`);
  console.log(`\n${name} linkjei:\n  ` + r.links.join('\n  '));
}
process.exit(ok ? 0 : 1);
