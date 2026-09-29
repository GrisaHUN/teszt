// Forgalmazott készülékek + 7 márka-oldal ellenőrzése (Elliot-prompt 9. pont): node test/check-km.mjs [oldal ...]
// Az elvárt modellek és árak itt KÜLÖN, a prompt 7. pontjából vannak beírva (nem a build forrásából),
// hogy a kimenetet független adathoz mérjük.
import { join, dirname } from 'node:path';
import { mkdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { playwright, testPage, preparePage, SITE, blockFile } from './page.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, 'out');
mkdirSync(out, { recursive: true });
const ZOHO = 'https://growthnestg.zohobookings.eu/254300000000290002';
const WIDTHS = [320, 360, 390, 430, 768, 800, 801, 1024, 1280, 1440, 1920, 2560];
const SHOTS = [360, 390, 430, 768, 1024, 1280, 1440, 1920];
const PRE = { keszulekek: 'jkk-', aux: 'jkb-aux-', daikin: 'jkb-dai-', fisher: 'jkb-fis-', gree: 'jkb-gre-', midea: 'jkb-mid-', polar: 'jkb-pol-', syen: 'jkb-sye-' };
const NEV = { aux: 'AUX', daikin: 'Daikin', fisher: 'Fisher', gree: 'Gree', midea: 'Midea', polar: 'Polar', syen: 'Syen' };
const EXPECT = {
  aux: [['AUX Delta 3', 'Inverter 3,5 kW', '325 000 Ft'], ['AUX Aura', 'Inverter 3,5 kW', '362 000 Ft']],
  daikin: [['Daikin Sensira E FTXF35/RXF35', 'Inverter 3,5 kW', '385 000 Ft'], ['Daikin Comfora FTXP35N/RXP35N', 'Inverter 3,5 kW', '430 000 Ft']],
  fisher: [['Fisher Special Edition', 'Inverter 3,6 kW', '320 000 Ft'], ['Fisher Art', 'Inverter 3,5 kW', '390 000 Ft', 'Háromféle színben!'], ['Fisher Nordic', 'Inverter 3,5 kW', '449 000 Ft']],
  gree: [['Gree Smart One', 'Inverter 3,5 kW', '362 000 Ft'], ['Gree Comfort Pro', 'Inverter 3,5 kW', '365 000 Ft'], ['Gree Dark Pro', 'Inverter 3,5 kW', '385 000 Ft'], ['Gree Amber Royal', 'Inverter 3,5 kW', '497 000 Ft']],
  midea: [['Midea Breezeless E', 'Inverter 3,5 kW', '362 000 Ft'], ['Midea All Easy Pro', 'Inverter 3,5 kW', '365 000 Ft'], ['Midea Oasis Plus+', 'Inverter 3,5 kW', '459 000 Ft']],
  polar: [['Polar Lite', 'Inverter 3,5 kW', '280 000 Ft'], ['Polar Optimum', 'Inverter 3,5 kW', '299 000 Ft']],
  syen: [['Syen Muse Next', 'Inverter 3,5 kW', '350 000 Ft']],
};
const ENERGIA = {
  'Syen Muse Next': 'Energiaosztály (gyártói adatlap szerint): hűtés A+++ (SEER 8,5), fűtés A++ (SCOP 4,8). Fűtés: -25 °C külső hőmérsékletig.',
  'Gree Amber Royal': 'Hűtési energiaosztály (gyártói adatlap szerint): A+++ (SEER 8,5). Fűtés: -30 °C külső hőmérsékletig.',
};
const TILTOTT = /bruttó|áfá|végleges ár|környezetbarát|\bzöld|energiatakarékos|legjobb|leghatékonyabb|legmegbízhatóbb|spórol|megtakarít|—/i;

const pages = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(PRE);
const browser = await playwright.chromium.launch();
const results = [];
const ok = (name, pass, info = '') => { results.push({ name, pass, info }); };
const norm = (s) => s.replace(/ /g, ' ').replace(/\s+/g, ' ').trim();

async function open(page, width, opts = {}) {
  const mob = width <= 800;
  const ctx = await browser.newContext({ viewport: { width, height: mob ? 844 : 900 }, deviceScaleFactor: 1, isMobile: mob, hasTouch: mob, reducedMotion: opts.reduce ? 'reduce' : 'no-preference' });
  const log = await preparePage(ctx, testPage(page), page);
  const pg = await ctx.newPage();
  const errors = [];
  pg.on('pageerror', (e) => errors.push(e.message));
  pg.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|ERR_FAILED/.test(m.text())) errors.push(m.text()); });
  await pg.goto(`${SITE}/${page}`);
  await pg.waitForTimeout(500);
  return { ctx, pg, errors, log };
}
async function scrollThrough(pg, step = 450) {
  const total = await pg.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= total; y += step) { await pg.evaluate((yy) => scrollTo(0, yy), y); await pg.waitForTimeout(70); }
  await pg.waitForTimeout(1300);
}

for (const page of pages) {
  const P = PRE[page];
  const R = `#${P}root`;
  const raw = readFileSync(blockFile(page), 'utf8');

  // 1. Szélességek
  for (const w of WIDTHS) {
    const { ctx, pg, errors } = await open(page, w);
    await scrollThrough(pg, w <= 800 ? 400 : 600);
    const m = await pg.evaluate((R) => {
      const root = document.querySelector(R);
      const ids = [...document.querySelectorAll('[id]')].map((e) => e.id);
      const rv = [...root.querySelectorAll('[class*="-rv"]')].filter((e) => e.getClientRects().length);
      const imgs = [...root.querySelectorAll('img')].filter((i) => i.getClientRects().length);
      const targets = [...root.querySelectorAll('a[class*="-btn"], a[class*="-brand"], [class*="-rel-list"] a')].filter((e) => e.getClientRects().length).map((e) => ({ t: e.textContent.trim().slice(0, 24), h: Math.round(e.getBoundingClientRect().height) }));
      const over = [...root.querySelectorAll('*')].filter((e) => { const r = e.getBoundingClientRect(); return r.width && (r.right > innerWidth + 1) && !e.closest('[class*="-sav"]'); }).length;
      return {
        sw: document.documentElement.scrollWidth, iw: innerWidth,
        dup: ids.filter((id, i) => ids.indexOf(id) !== i && /^jk/.test(id)),
        h1: [...document.querySelectorAll('h1')].filter((e) => e.getClientRects().length).length,
        notIn: rv.filter((e) => !/-in\b/.test(e.className)).length, rv: rv.length,
        imgBad: imgs.filter((i) => !i.alt || !i.getAttribute('width') || !i.getAttribute('height')).length,
        small: targets.filter((t) => t.h < 44), over,
      };
    }, R);
    const t = `${page} ${w}px`;
    ok(`${t}: nincs vízszintes csúszás, nincs túlnyúló elem`, m.sw <= m.iw && m.over === 0, `${m.sw}/${m.iw}, túlnyúló: ${m.over}`);
    ok(`${t}: nincs duplikált id, konzolhiba; egy H1`, !m.dup.length && !errors.length && m.h1 === 1, (m.dup.join(',') + ' ' + errors.join(' | ') + ' h1=' + m.h1).trim());
    ok(`${t}: felfedés kész (${m.rv}), képeken alt/width/height`, m.notIn === 0 && m.imgBad === 0, `nem jelent meg: ${m.notIn}, rossz kép: ${m.imgBad}`);
    ok(`${t}: gombok és linkek legalább 44 px magasak`, !m.small.length, JSON.stringify(m.small));
    if (SHOTS.includes(w)) {
      await pg.evaluate(() => scrollTo(0, 0));
      await pg.waitForTimeout(300);
      await pg.screenshot({ path: join(out, `${page}-km-${w}.png`), fullPage: true });
    }
    await ctx.close();
  }

  // 2. Nyers kód: nincs JSON-LD, tiltott szó, gondolatjel; külső link csak a Zoho
  {
    const text = raw.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ');
    ok(`${page}: nincs JSON-LD`, !/application\/ld\+json/.test(raw));
    ok(`${page}: nincs tiltott szó (bruttó, ÁFÁ, végleges ár, környezetbarát, zöld, energiatakarékos, szuperlatívusz, megtakarítás, gondolatjel)`, !TILTOTT.test(text), (text.match(TILTOTT) || [''])[0]);
    const ext = [...raw.matchAll(/\shref="(https?:[^"]+)"/g)].map((x) => x[1]).filter((u) => u !== ZOHO);
    ok(`${page}: külső link csak a Zoho foglalás`, !ext.length, ext.join(', '));
  }

  // 3. Linkek, kattintások
  {
    const { ctx, pg } = await open(page, 1440);
    const links = await pg.evaluate((R) => [...document.querySelector(R).querySelectorAll('a')].map((a) => ({ t: a.textContent.replace(/\s+/g, ' ').trim(), h: a.getAttribute('href'), tg: a.target, rel: a.rel })), R);
    const zoho = links.filter((l) => l.t === 'Ingyenes árajánlat kérése');
    ok(`${page}: minden „Ingyenes árajánlat kérése” (${zoho.length}) a pontos Zoho-linkre, új lapon`, zoho.length >= 2 && zoho.every((l) => l.h === ZOHO && l.tg === '_blank' && l.rel === 'noopener'), JSON.stringify(zoho));
    const tel = links.filter((l) => /^tel:/.test(l.h));
    ok(`${page}: telefon mindenhol tel:+36203734991 (${tel.length})`, tel.length >= 2 && tel.every((l) => l.h === 'tel:+36203734991' && /\+36 20 373 4991/.test(l.t)));
    const hrefs = links.map((l) => l.h);
    const need = page === 'keszulekek' ? ['/aux', '/daikin', '/fisher', '/gree', '/midea', '/polar', '/syen', '/klimaszereles', '/kedvezo'] : ['/keszulekek', '/klimaszereles'];
    ok(`${page}: belső linkek (${need.join(' ')})`, need.every((x) => hrefs.includes(x)), `hiányzik: ${need.filter((x) => !hrefs.includes(x)).join(', ')}`);
    if (page !== 'keszulekek') {
      const others = hrefs.filter((x) => /^\/(aux|daikin|fisher|gree|midea|polar|syen)$/.test(x) && x !== `/${page}`);
      ok(`${page}: 1-2 másik márka-oldal szöveges linkje`, others.length >= 1 && others.length <= 2, others.join(', '));
    }
    const clicks = page === 'keszulekek' ? ['/aux', '/daikin', '/fisher', '/gree', '/midea', '/polar', '/syen', '/klimaszereles'] : ['/keszulekek', '/klimaszereles'];
    for (const href of clicks) {
      const p2 = await ctx.newPage();
      await p2.goto(`${SITE}/${page}`);
      await p2.waitForTimeout(300);
      const el = p2.locator(`${R} a[href="${href}"]`).first();
      await el.scrollIntoViewIfNeeded();
      await p2.waitForTimeout(600);
      const box = await el.boundingBox();
      // a kártya szélére kattint (nem a logóra), hogy a teljes kártya kattinthatósága is igazolva legyen
      const x = page === 'keszulekek' && href !== '/klimaszereles' ? box.x + 24 : box.x + box.width / 2;
      const y = page === 'keszulekek' && href !== '/klimaszereles' ? box.y + box.height - 24 : box.y + box.height / 2;
      await Promise.all([p2.waitForURL(`**${href}`, { timeout: 4000 }).catch(() => {}), p2.mouse.click(x, y)]);
      ok(`${page}: kattintás ${href}`, p2.url().endsWith(href), p2.url());
      await p2.close();
    }
    const [np] = await Promise.all([ctx.waitForEvent('page', { timeout: 4000 }).catch(() => null), pg.locator(`${R} [class*="-hero"] a[data-${P}zoho]`).first().click()]);
    ok(`${page}: a hero gomb új lapon a Zoho foglalásra visz`, !!np && np.url().startsWith(ZOHO), np && np.url());
    await ctx.close();
  }

  // 4. Tartalom: modellek, árak, energiaosztály
  if (page === 'keszulekek') {
    const { ctx, pg } = await open(page, 1440);
    const cards = await pg.evaluate((P) => [...document.querySelectorAll(`.${P}brand`)].map((a) => ({ h: a.getAttribute('href'), n: a.querySelector(`.${P}brand-name`).textContent.trim(), alt: a.querySelector('img').alt })), P);
    const want = ['aux', 'daikin', 'fisher', 'gree', 'midea', 'polar', 'syen'];
    ok('hub: a 7 márka-kártya sorrendben, a helyes oldalra linkel, leíró alt', want.every((s, i) => cards[i] && cards[i].h === `/${s}` && cards[i].n === NEV[s] && cards[i].alt === `${NEV[s]} klíma logó`), JSON.stringify(cards.slice(0, 7)));
    const txt = norm(await pg.evaluate((R) => document.querySelector(R).innerText, R));
    ok('hub: nincs energiaosztály vagy hidegtűrés', !/energiaosztály|A\+\+|°C/i.test(txt));
    await ctx.close();
  } else {
    const { ctx, pg } = await open(page, 1440);
    const models = await pg.evaluate((P) => [...document.querySelectorAll(`.${P}model`)].map((a) => ({ n: a.querySelector('h3').textContent.trim(), tags: [...a.querySelectorAll(`.${P}model-tags li`)].map((l) => l.textContent.trim()), e: (a.querySelector(`.${P}model-energy`) || { textContent: '' }).textContent.trim(), p: a.querySelector(`.${P}model-price`).textContent })), P);
    const exp = EXPECT[page];
    const match = models.length === exp.length && exp.every((e, i) => models[i].n === e[0] && models[i].tags.includes(e[1]) && models[i].tags.includes('Klíma szett') && (!e[3] || models[i].tags.includes(e[3])) && norm(models[i].p) === `Beszerelve (3 m-ig): ${e[2]}`);
    ok(`${page}: minden modellnév, teljesítmény és ár szó szerint egyezik (${exp.length} modell)`, match, JSON.stringify(models.map((x) => [x.n, x.tags.join('/'), norm(x.p)])));
    const energyOk = models.every((x) => (ENERGIA[x.n] ? norm(x.e) === ENERGIA[x.n] : x.e === ''));
    const txt = norm(await pg.evaluate((R) => document.querySelector(R).innerText, R));
    const stray = txt.replace(Object.values(ENERGIA).map(norm).join('|') ? new RegExp(Object.values(ENERGIA).map((s) => norm(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g') : /$^/, '');
    ok(`${page}: energiaosztály/hidegtűrés csak a 2 engedélyezett modellnél, pontos szöveggel`, energyOk && !/energiaosztály|A\+\+|°C|SEER|SCOP/i.test(stray), JSON.stringify(models.map((x) => [x.n, x.e])));
    const h1 = await pg.evaluate(() => document.querySelector('h1').textContent.trim());
    ok(`${page}: H1 „${NEV[page]} klíma beszereléssel Szegeden”`, h1 === `${NEV[page]} klíma beszereléssel Szegeden`, h1);
    ok(`${page}: garancia-szöveg a prompt szerint`, txt.includes('2 év garancia a telepítésre (Jimmy Klíma). A gyártói garancia a gyártó saját feltételei szerint érvényes.'));
    await ctx.close();
  }

  // 5. Ikon-animáció (egér: a kártya bármely pontja; érintés: egyszer)
  {
    const { ctx, pg } = await open(page, 1440);
    const host = `${R} .${P}${page === 'keszulekek' ? 'brand' : 'model'}`;
    const card = pg.locator(host).first();
    await card.scrollIntoViewIfNeeded();
    await pg.waitForTimeout(1400);
    await pg.mouse.move(5, 5);
    await pg.waitForTimeout(300);
    const bb = await card.boundingBox();
    await pg.mouse.move(bb.x + bb.width / 2, bb.y + bb.height - 8);
    await pg.waitForTimeout(160);
    const st = await pg.evaluate((s) => { const b = document.querySelector(s + ' [class*="-badge"]'); return { z: getComputedStyle(b).transform, go: b.querySelectorAll('[class*="-go"]').length }; }, host);
    const sc = (tf) => (tf === 'none' ? 1 : Number(tf.match(/matrix\(([^,]+)/)[1]));
    ok(`${page}: ikon-animáció a kártyára vitt egérre (zoom ${sc(st.z).toFixed(2)}, 2 gyűrű)`, sc(st.z) >= 1.1 && sc(st.z) <= 1.16 && st.go === 2, JSON.stringify(st));
    await ctx.close();
    const m = await open(page, 390);
    const c2 = m.pg.locator(host).first();
    await c2.scrollIntoViewIfNeeded();
    await m.pg.waitForTimeout(1200);
    await m.pg.evaluate((s) => { window.__rl = 0; document.querySelector(s + ' [class*="-badge"]').querySelectorAll('[class*="-ring"]').forEach((r) => r.addEventListener('animationstart', () => window.__rl++)); }, host);
    const b2 = await m.pg.locator(`${host} [class*="-badge"]`).first().boundingBox();
    await m.pg.evaluate(() => { document.addEventListener('click', (e) => e.preventDefault(), true); });
    await m.pg.touchscreen.tap(b2.x + b2.width / 2, b2.y + b2.height / 2);
    await m.pg.waitForTimeout(900);
    ok(`${page}: érintésre a gyűrű egyszer fut`, await m.pg.evaluate(() => window.__rl) === 2);
    await m.ctx.close();
  }

  // 6. prefers-reduced-motion
  {
    const { ctx, pg } = await open(page, 1440, { reduce: true });
    const st = await pg.evaluate(() => ({ hidden: [...document.querySelectorAll('[class*="-rv"]')].filter((e) => e.getClientRects().length && getComputedStyle(e).opacity !== '1').length, rings: document.querySelectorAll('[class*="-ring"]').length }));
    ok(`${page}: reduced-motion: minden azonnal látszik, nincs gyűrű`, st.hidden === 0 && st.rings === 0, JSON.stringify(st));
    await ctx.close();
  }

  // 7. Képletöltés (hub: mobilon csak a háttér jobb fele; logók lazy)
  if (page === 'keszulekek') {
    const d = await open(page, 1440);
    const dReq = d.log.requests.map((u) => u.split('/').pop());
    const lazyAll = await d.pg.evaluate((R) => [...document.querySelector(R).querySelectorAll('[class*="-brand"] img')].every((i) => i.loading === 'lazy'), R);
    await d.ctx.close();
    const m = await open(page, 390);
    await scrollThrough(m.pg);
    const mReq = m.log.requests.map((u) => u.split('/').pop());
    await m.ctx.close();
    ok('hub desktop: a háttér mindkét fele eager, a logók lazy-k', dReq.some((u) => /hatter-bal/.test(u)) && dReq.some((u) => /hatter-jobb/.test(u)) && lazyAll, dReq.join(', '));
    ok('hub mobil: csak a háttér jobb fele töltődik (a 241 KB-os bal fele nem)', mReq.some((u) => /hatter-jobb/.test(u)) && !mReq.some((u) => /hatter-bal/.test(u)), mReq.join(', '));
  } else {
    const d = await open(page, 390);
    const r = await d.pg.evaluate((R) => { const i = document.querySelector(R + ' [class*="-bh-logo"] img'); return { eager: i.loading === 'eager', fp: i.getAttribute('fetchpriority') }; }, R);
    ok(`${page}: a hero logó eager + fetchpriority=high`, r.eager && r.fp === 'high', JSON.stringify(r));
    await d.ctx.close();
  }
}

await browser.close();
const passed = results.filter((r) => r.pass).length;
for (const r of results) if (!r.pass) console.log(`HIBA ${r.name}${r.info ? '  [' + r.info + ']' : ''}`);
console.log(`\n${passed}/${results.length} rendben`);
process.exit(passed === results.length ? 0 : 1);
