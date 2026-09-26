// Teljes ellenőrzés (prompt 9. pont): node test/check.mjs
// Eredmény: konzolra táblázat, képek: test/out/check-*.png, ikon-képkockák: test/out/ikon-*.png
import { join, dirname } from 'node:path';
import { mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { playwright, testPage, preparePage } from './page.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, 'out');
mkdirSync(out, { recursive: true });
const ZOHO = 'https://growthnestg.zohobookings.eu/254300000000290002/#/254300000000290002?booknow=true';
const WIDTHS = [320, 360, 390, 430, 768, 800, 801, 820, 1024, 1280, 1366, 1440, 1920, 2560];
const html = testPage();
const browser = await playwright.chromium.launch();
const results = [];
const ok = (name, pass, info = '') => { results.push({ name, pass, info }); };

async function open(width, opts = {}) {
  const height = opts.height || (width <= 800 ? 844 : 900);
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, isMobile: width <= 800, hasTouch: width <= 800, reducedMotion: opts.reduce ? 'reduce' : 'no-preference' });
  const log = await preparePage(ctx, html);
  const pg = await ctx.newPage();
  const errors = [];
  pg.on('pageerror', (e) => errors.push(e.message));
  pg.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|ERR_FAILED/.test(m.text())) errors.push(m.text()); });
  await pg.goto('https://jimmy-klima.systeme.io/');
  await pg.waitForTimeout(700);
  return { ctx, pg, errors, log };
}
async function scrollThrough(pg, step = 500) {
  const total = await pg.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= total; y += step) { await pg.evaluate((yy) => scrollTo(0, yy), y); await pg.waitForTimeout(90); }
  await pg.waitForTimeout(1300);
}

// 1. Szélességek: csúszás, id, hiba, felfedés, magasság, képernyőkép
for (const w of WIDTHS) {
  const { ctx, pg, errors } = await open(w);
  await scrollThrough(pg, w <= 800 ? 400 : 600);
  const m = await pg.evaluate(() => {
    const ids = [...document.querySelectorAll('[id]')].map((e) => e.id);
    const roots = [...document.querySelectorAll('[id^="jkh-b"]')];
    const rv = roots.flatMap((r) => [...r.querySelectorAll('.jkh-rv')]).filter((e) => e.getClientRects().length);
    const vis = (e) => { const s = getComputedStyle(e); return s.display !== 'none' && s.visibility !== 'hidden' && e.getClientRects().length; };
    const narrow = roots.flatMap((r) => [...r.querySelectorAll('.jkh-svc, .jkh-why-item, .jkh-step, .jkh-testi-card')]).filter(vis).map((e) => e.getBoundingClientRect().width).filter((x) => x < 250);
    return {
      sw: document.documentElement.scrollWidth, iw: innerWidth, height: document.documentElement.scrollHeight,
      dup: ids.filter((id, i) => ids.indexOf(id) !== i && id.startsWith('jkh')),
      h1: document.querySelectorAll('h1').length - document.querySelectorAll('header h1, footer h1').length,
      notIn: rv.filter((e) => !e.classList.contains('jkh-in')).length, rv: rv.length,
      narrow: narrow.length ? Math.min(...narrow) : 0,
    };
  });
  ok(`${w}px: nincs vízszintes csúszás`, m.sw <= m.iw, `${m.sw}/${m.iw}`);
  ok(`${w}px: nincs duplikált id, konzolhiba`, !m.dup.length && !errors.length, (m.dup.join(',') + ' ' + errors.join(' | ')).trim());
  ok(`${w}px: felfedés kész (${m.rv} elem)`, m.notIn === 0, `nem jelent meg: ${m.notIn}`);
  ok(`${w}px: nincs 250 px alatti kártya`, !m.narrow, m.narrow ? `${m.narrow.toFixed(0)} px` : '');
  results[results.length - 1].height = m.height;
  await pg.evaluate(() => scrollTo(0, 0));
  await pg.waitForTimeout(400);
  if ([320, 390, 800, 801, 1024, 1440, 1920, 2560].includes(w)) await pg.screenshot({ path: join(out, `check-${w}-full.png`), fullPage: true });
  console.log(`${w}px: magasság ${m.height}, csúszás ${m.sw}/${m.iw}, felfedés ${m.rv - m.notIn}/${m.rv}`);
  await ctx.close();
}

// 2. Linkek és kattintások
{
  const { ctx, pg } = await open(1440);
  const links = await pg.evaluate(() => [...document.querySelectorAll('[id^="jkh-b"] a')].map((a) => ({ t: a.textContent.trim().replace(/\s+/g, ' '), h: a.getAttribute('href'), tg: a.target, rel: a.rel })));
  const zoho = links.filter((l) => l.t === 'Ingyenes árajánlat kérése');
  ok('3 Zoho-gomb a pontos linkre, új lapon', zoho.length === 3 && zoho.every((l) => l.h === ZOHO && l.tg === '_blank' && l.rel === 'noopener'), JSON.stringify(zoho.map((l) => l.h === ZOHO)));
  for (const href of ['/klimaszereles', '/klimatisztitas', '/szelloztetes', '/villanyszereles', '/keszulekek']) {
    const p2 = await ctx.newPage();
    await p2.goto('https://jimmy-klima.systeme.io/');
    await p2.waitForTimeout(400);
    const sel = href === '/keszulekek' ? '.jkh-dev-pill' : `a.jkh-svc[href="${href}"]`;
    const el = p2.locator(sel);
    await el.scrollIntoViewIfNeeded();
    await p2.waitForTimeout(900);
    const box = await el.boundingBox();
    // a kártya szélére kattint (nem a címre), hogy a teljes felület kattinthatósága is igazolva legyen
    await Promise.all([p2.waitForURL(`**${href}`, { timeout: 4000 }).catch(() => {}), p2.mouse.click(box.x + 8, box.y + box.height - 10)]);
    ok(`kattintás: ${sel} -> ${href}`, p2.url().endsWith(href), p2.url());
    await p2.close();
  }
  const [popup] = await Promise.all([ctx.waitForEvent('page', { timeout: 4000 }).catch(() => null), pg.click('.jkh-hero-cta', { force: true })]);
  if (popup) await popup.waitForLoadState().catch(() => {});
  ok('hero gomb új lapon a Zohóra', !!popup && popup.url().startsWith('https://growthnestg.zohobookings.eu/254300000000290002'), popup && popup.url());
  // Hero parallax és pulzálás
  const t0 = await pg.evaluate(() => getComputedStyle(document.querySelector('.jkh-hero-photo')).transform);
  await pg.evaluate(() => scrollTo(0, 300));
  await pg.waitForTimeout(300);
  const t1 = await pg.evaluate(() => getComputedStyle(document.querySelector('.jkh-hero-photo')).transform);
  const anim = await pg.evaluate(() => getComputedStyle(document.querySelector('.jkh-hero-cta')).animationName);
  ok('hero parallax (görgetésre mozdul)', t0 !== t1 && /matrix/.test(t1), `${t0} -> ${t1}`);
  ok('hero gomb pulzál', anim === 'jkh-pulse', anim);
  await ctx.close();
}

// 3. Körhinták
{
  const { ctx, pg } = await open(1440);
  const car = '.jkh-gal-car';
  await pg.locator(car).scrollIntoViewIfNeeded();
  await pg.waitForTimeout(900);
  const sl = () => pg.evaluate((c) => document.querySelector(c + ' .jkh-scroller').scrollLeft, car);
  const a = await sl();
  await pg.click(`${car} .jkh-next`);
  await pg.waitForTimeout(700);
  const b = await sl();
  ok('galéria: nyíl léptet (desktop)', b > a, `${a} -> ${b}`);
  await pg.focus(`${car} .jkh-scroller`);
  await pg.keyboard.press('ArrowRight');
  await pg.waitForTimeout(700);
  const c = await sl();
  ok('galéria: billentyűzet (jobbra nyíl)', c > b, `${b} -> ${c}`);
  const box = await pg.locator(`${car} .jkh-scroller`).boundingBox();
  await pg.mouse.move(box.x + box.width * 0.7, box.y + box.height / 2);
  await pg.mouse.down();
  await pg.mouse.move(box.x + box.width * 0.3, box.y + box.height / 2, { steps: 8 });
  await pg.mouse.up();
  await pg.waitForTimeout(900);
  const d = await sl();
  const lbOpenAfterDrag = await pg.evaluate(() => document.querySelector('.jkh-lb').classList.contains('jkh-open'));
  ok('galéria: egérrel húzható, húzás nem nyit nagyítást', d > c && !lbOpenAfterDrag, `${c} -> ${d}`);
  const tv = '.jkh-testi-car';
  await pg.locator(tv).scrollIntoViewIfNeeded();
  await pg.waitForTimeout(900);
  const e0 = await pg.evaluate((c2) => document.querySelector(c2 + ' .jkh-scroller').scrollLeft, tv);
  await pg.click(`${tv} .jkh-next`);
  await pg.waitForTimeout(700);
  const e1 = await pg.evaluate((c2) => document.querySelector(c2 + ' .jkh-scroller').scrollLeft, tv);
  ok('vélemények: nyíl léptet (desktop)', e1 > e0, `${e0} -> ${e1}`);
  await ctx.close();

  const m = await open(390);
  for (const [sel, name] of [['.jkh-svc-car', 'szolgáltatások'], ['.jkh-gal-car', 'galéria'], ['.jkh-testi-car', 'vélemények']]) {
    await m.pg.locator(sel).scrollIntoViewIfNeeded();
    await m.pg.waitForTimeout(700);
    const n = await m.pg.evaluate((s) => document.querySelectorAll(s + ' .jkh-dot').length, sel);
    await m.pg.locator(`${sel} .jkh-dot`).nth(2).click();
    await m.pg.waitForTimeout(900);
    const st = await m.pg.evaluate((s) => ({ on: [...document.querySelectorAll(s + ' .jkh-dot')].findIndex((d) => d.classList.contains('jkh-on')), sl: document.querySelector(s + ' .jkh-scroller').scrollLeft }), sel);
    ok(`mobil ${name}: pöttyök (${n}) lapoznak`, n > 2 && st.on === 2 && st.sl > 0, JSON.stringify(st));
  }
  await m.ctx.close();
}

// 4. Lightbox
{
  const { ctx, pg } = await open(1440);
  await pg.locator('.jkh-gal-car').scrollIntoViewIfNeeded();
  await pg.waitForTimeout(900);
  const first = pg.locator('.jkh-ref').first();
  await first.click();
  await pg.waitForTimeout(300);
  let st = await pg.evaluate(() => ({ open: document.querySelector('.jkh-lb').classList.contains('jkh-open'), focus: document.activeElement.className, src: document.querySelector('.jkh-lb-img').getAttribute('src') }));
  ok('nagyítás nyílik, fókusz a bezárás gombon', st.open && /jkh-lb-close/.test(st.focus) && !!st.src, JSON.stringify(st));
  const src1 = st.src;
  await pg.click('.jkh-lb-next');
  await pg.waitForTimeout(200);
  const src2 = await pg.evaluate(() => document.querySelector('.jkh-lb-img').getAttribute('src'));
  ok('nagyítás: következő kép', src2 && src2 !== src1);
  await pg.keyboard.press('Escape');
  await pg.waitForTimeout(200);
  st = await pg.evaluate(() => ({ open: document.querySelector('.jkh-lb').classList.contains('jkh-open'), focus: document.activeElement.className }));
  ok('Esc bezár, fókusz visszaáll a képre', !st.open && /jkh-ref/.test(st.focus), JSON.stringify(st));
  await first.click();
  await pg.waitForTimeout(200);
  await pg.mouse.click(8, 450);
  await pg.waitForTimeout(200);
  const closed = await pg.evaluate(() => !document.querySelector('.jkh-lb').classList.contains('jkh-open'));
  ok('háttérre kattintás bezár', closed);
  await ctx.close();
}

// 5. Futószalag
{
  const { ctx, pg } = await open(1440);
  await pg.locator('.jkh-brands').scrollIntoViewIfNeeded();
  await pg.waitForTimeout(800);
  await pg.mouse.move(5, 5);
  const tr = () => pg.evaluate(() => getComputedStyle(document.querySelector('.jkh-brands-track')).transform);
  const a = await tr(); await pg.waitForTimeout(600); const b = await tr();
  const box = await pg.locator('.jkh-brands').boundingBox();
  await pg.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await pg.waitForTimeout(200);
  const c = await tr(); await pg.waitForTimeout(600); const d = await tr();
  ok('futószalag mozog, egérre megáll', a !== b && c === d, `${a}|${b}|${c}|${d}`);
  await ctx.close();
}

// 6. Ikon-animáció: egér (képkockák) és érintés (egyszer fut)
{
  const { ctx, pg } = await open(1440);
  const badge = pg.locator('.jkh-svc .jkh-badge').first();
  await badge.scrollIntoViewIfNeeded();
  await pg.waitForTimeout(1200);
  await pg.mouse.move(5, 5);
  await pg.waitForTimeout(300);
  const bb = await badge.boundingBox();
  const clip = { x: bb.x - bb.width * 0.55, y: bb.y - bb.height * 0.55, width: bb.width * 2.1, height: bb.height * 2.1 };
  await pg.screenshot({ path: join(out, 'ikon-0-kiindulas.png'), clip });
  await pg.evaluate(() => {
    window.__jkhRingLog = [];
    document.querySelectorAll('.jkh-svc .jkh-badge')[0].querySelectorAll('.jkh-ring').forEach((r, i) => r.addEventListener('animationstart', () => window.__jkhRingLog.push(i)));
  });
  const card = await pg.locator('.jkh-svc').first().boundingBox();
  await pg.mouse.move(card.x + card.width - 12, card.y + card.height - 14);
  const frames = [[60, '1-gyuru-indul-az-elrol'], [200, '2-zoom-csucs'], [330, '3-gyuru-kifele'], [520, '4-gyuru-halvanyul'], [900, '5-vege']];
  let t = 0;
  const ringStates = [];
  for (const [ms, name] of frames) {
    await pg.waitForTimeout(ms - t); t = ms;
    await pg.screenshot({ path: join(out, `ikon-${name}.png`), clip });
    ringStates.push(await pg.evaluate(() => { const r = document.querySelector('.jkh-svc .jkh-badge .jkh-ring'); const s = getComputedStyle(r); return { tf: s.transform, op: s.opacity, zoom: getComputedStyle(r.parentElement).transform }; }));
  }
  const early = ringStates[0];
  const scaleEarly = early.tf === 'none' ? 1 : Number(early.tf.match(/matrix\(([^,]+)/)[1]);
  ok('ikon: a kártya bármely pontjára vitt egérre nagyít (1,2x)', /matrix\(1\.(1[5-9]|2)/.test(ringStates[1].zoom), ringStates[1].zoom);
  ok('ikon: a gyűrű a keret széléről indul (kezdeti méret ~1,0x, üres, inset:0)', scaleEarly < 1.2 && await pg.evaluate(() => { const r = document.querySelector('.jkh-svc .jkh-badge .jkh-ring'); const s = getComputedStyle(r); return s.top === '0px' && s.left === '0px' && s.backgroundColor === 'rgba(0, 0, 0, 0)' && parseFloat(s.borderTopWidth) > 0; }), `kezdeti skála ${scaleEarly.toFixed(2)}`);
  const logMouse = await pg.evaluate(() => window.__jkhRingLog.length);
  await pg.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2, { steps: 6 });
  await pg.waitForTimeout(700);
  const logStill = await pg.evaluate(() => window.__jkhRingLog.length);
  ok('ikon: egy belépésre egyszer fut (a kártyán belül az ikonra mozdulva sem ismétlődik)', logMouse === 2 && logStill === 2, `${logMouse}, ${logStill}`);
  await pg.mouse.move(5, 5);
  await pg.waitForTimeout(400);
  const back = await pg.evaluate(() => getComputedStyle(document.querySelector('.jkh-svc .jkh-badge')).transform);
  ok('ikon: egér elhagyásakor visszamegy', back === 'none' || /matrix\(1, 0, 0, 1/.test(back), back);
  await ctx.close();

  const m = await open(390);
  const b2 = m.pg.locator('.jkh-why-item .jkh-badge').first();
  await b2.scrollIntoViewIfNeeded();
  await m.pg.waitForTimeout(900);
  await m.pg.evaluate(() => {
    window.__jkhRingLog = [];
    document.querySelector('.jkh-why-item .jkh-badge').querySelectorAll('.jkh-ring').forEach((r, i) => r.addEventListener('animationstart', () => window.__jkhRingLog.push(i)));
  });
  const tb = await b2.boundingBox();
  await m.pg.touchscreen.tap(tb.x + tb.width / 2, tb.y + tb.height / 2);
  await m.pg.waitForTimeout(150);
  const zoomTouch = await m.pg.evaluate(() => getComputedStyle(document.querySelector('.jkh-why-item .jkh-badge')).transform);
  await m.pg.waitForTimeout(800);
  const touchLog = await m.pg.evaluate(() => window.__jkhRingLog.length);
  ok('érintés: zoom + gyűrű egyszer (nem kétszer)', touchLog === 2 && /matrix\(1\.1/.test(zoomTouch), `${touchLog} animáció, ${zoomTouch}`);
  await m.ctx.close();
}

// 7. prefers-reduced-motion
{
  const { ctx, pg } = await open(1440, { reduce: true });
  const st = await pg.evaluate(() => ({
    hidden: [...document.querySelectorAll('.jkh-rv')].filter((e) => getComputedStyle(e).opacity !== '1').length,
    rings: document.querySelectorAll('.jkh-ring').length,
    marquee: getComputedStyle(document.querySelector('.jkh-brands-track')).animationName,
    pulse: getComputedStyle(document.querySelector('.jkh-hero-cta')).animationName,
  }));
  await pg.evaluate(() => scrollTo(0, 300));
  await pg.waitForTimeout(200);
  const tf = await pg.evaluate(() => getComputedStyle(document.querySelector('.jkh-hero-photo')).transform);
  ok('reduced-motion: minden azonnal látszik, animációk kikapcsolva', st.hidden === 0 && st.rings === 0 && st.marquee === 'none' && st.pulse === 'none' && tf === 'none', JSON.stringify({ ...st, tf }));
  await ctx.close();
}

// 8. Lazy loading: az első képernyő képsúlya ~100 KB alatt; a rejtett (mobilon eltakart)
// készülékek-sáv képe sosem töltődik; minden nem-hero kép loading="lazy".
{
  const firstScreenKB = async (pg) => pg.evaluate(() => {
    const vis = [...document.querySelectorAll('[id^="jkh-b"] img')].filter((i) => { const r = i.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && r.width > 0; });
    return vis.map((i) => { const e = performance.getEntriesByName(i.currentSrc)[0]; return { src: i.currentSrc.slice(0, 60), kb: e ? e.encodedBodySize / 1024 : 0, data: i.currentSrc.startsWith('data:') ? i.currentSrc.length * 0.75 / 1024 : 0 }; });
  });
  const d = await open(1440);
  const fd = await firstScreenKB(d.pg);
  const kbD = fd.reduce((a, x) => a + (x.kb || x.data), 0);
  const lazyAll = await d.pg.evaluate(() => [...document.querySelectorAll('[id^="jkh-b"] img')].filter((i) => !i.closest('.jkh-hero') && !i.classList.contains('jkh-lb-img')).every((i) => i.loading === 'lazy'));
  ok('desktop: első képernyő képei ~100 KB alatt; minden más kép lazy', kbD < 110 && lazyAll, `${kbD.toFixed(0)} KB (${fd.length} kép)`);
  await d.ctx.close();
  const m = await open(390);
  const fm = await firstScreenKB(m.pg);
  const kbM = fm.reduce((a, x) => a + (x.kb || x.data), 0);
  await scrollThrough(m.pg, 400);
  const band = m.log.requests.filter((u) => /keszulekek-hatter/.test(u));
  ok('mobil: első képernyő képei ~100 KB alatt; a rejtett sáv képe sosem töltődik', kbM < 110 && band.length === 0, `${kbM.toFixed(0)} KB, sáv-kérés: ${band.length}`);
  await m.ctx.close();
}

// 9. Nyers HTML (JS nélkül): H1, szövegek, linkek statikusan
{
  const raw = readdirSync(join(here, '..', 'dist')).filter((f) => f.endsWith('.html')).map((f) => readFileSync(join(here, '..', 'dist', f), 'utf8')).join('\n');
  const text = raw.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
  const must = ['<h1', 'Profi klímaszerelés Szegeden', 'Szolgáltatásaink', 'Miért minket válasszon?', 'Rólunk', 'Mottónk:', 'Ügyfeleink mondták', 'Fűtés klímával', 'Forgalmazott készülékek', 'Hűtő-Fűtő Klímák', 'href="/klimaszereles"', 'href="/keszulekek"', ZOHO.replace(/&/g, '&amp;').split('?')[0]];
  const miss = must.filter((s) => !text.includes(s));
  ok('nyers HTML: H1, szövegek, linkek statikusan benne', !miss.length, miss.join(', '));
}

await browser.close();
const passed = results.filter((r) => r.pass).length;
for (const r of results) console.log(`${r.pass ? 'OK  ' : 'HIBA'} ${r.name}${r.info && !r.pass ? '  [' + r.info + ']' : ''}`);
console.log(`\n${passed}/${results.length} rendben`);
process.exit(passed === results.length ? 0 : 1);
