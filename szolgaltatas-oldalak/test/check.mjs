// Teljes ellenőrzés (prompt 8. pont): node test/check.mjs [oldal]
// Eredmény: konzolra táblázat, képek: test/out/<oldal>-check-*.png, ikon-képkockák: test/out/<oldal>-ikon-*.png
import { join, dirname } from 'node:path';
import { mkdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { playwright, testPage, preparePage, SITE, OUT } from './page.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const FOGLALAS = readFileSync(join(here, '..', 'build.mjs'), 'utf8').match(/export const FOGLALAS = '([^']+)'/)[1];
const out = join(here, 'out');
mkdirSync(out, { recursive: true });
const page = process.argv[2] || 'klimaszereles';
const c = (await import(`../src/tartalom/${page}.mjs`)).default;
const PX = { klimaszereles: 'ksz', klimatisztitas: 'kt', szelloztetes: 'sz', villanyszereles: 'vsz' }[page];
const D = `jk-${PX}-`, M = `jkm-${PX}-`;
const DESKTOP_W = [801, 820, 1024, 1280, 1366, 1440, 1920, 2560];
const MOBIL_W = [320, 360, 390, 430, 768, 800];
const browser = await playwright.chromium.launch();
const results = [];
const ok = (name, pass, info = '') => { results.push({ name, pass, info }); };
const url = `${SITE}/${page}`;

async function open(width, opts = {}) {
  const mob = width <= 800;
  const ctx = await browser.newContext({ viewport: { width, height: mob ? 844 : 900 }, deviceScaleFactor: 1, isMobile: mob, hasTouch: mob, reducedMotion: opts.reduce ? 'reduce' : 'no-preference' });
  const log = await preparePage(ctx, testPage(page, { order: opts.order || 'dm' }), page);
  const pg = await ctx.newPage();
  const errors = [];
  pg.on('pageerror', (e) => errors.push(e.message));
  pg.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|ERR_FAILED/.test(m.text())) errors.push(m.text()); });
  await pg.goto(url);
  await pg.waitForTimeout(600);
  return { ctx, pg, errors, log };
}
async function scrollThrough(pg, step = 450) {
  const total = await pg.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= total; y += step) { await pg.evaluate((yy) => scrollTo(0, yy), y); await pg.waitForTimeout(80); }
  await pg.waitForTimeout(1300);
}

// 1. Szélességek (mindkét elhelyezési sorrendben): csúszás, id, hiba, eszköz-váltás, felfedés, H1, oszlopszélesség, képernyőkép
for (const order of ['dm', 'md']) {
  for (const w of [...MOBIL_W, ...DESKTOP_W]) {
    if (order === 'md' && ![360, 390, 800, 801, 1440].includes(w)) continue;
    const { ctx, pg, errors } = await open(w, { order });
    await scrollThrough(pg, w <= 800 ? 400 : 600);
    const m = await pg.evaluate(({ D, M }) => {
      const vis = (e) => { if (!e) return false; const s = getComputedStyle(e); return s.display !== 'none' && s.visibility !== 'hidden' && e.getClientRects().length > 0 && e.getBoundingClientRect().height > 0; };
      const ids = [...document.querySelectorAll('[id]')].map((e) => e.id);
      const dr = document.getElementById(D + 'root'), mr = document.getElementById(M + 'root');
      const act = vis(dr) ? dr : mr;
      const rv = [...act.querySelectorAll(`[class*="-rv"]`)].filter((e) => e.getClientRects().length);
      const cards = [...act.querySelectorAll(`.${D}step, .${D}qa, .${D}price, .${D}callout, .${D}brands`)].filter(vis).map((e) => e.getBoundingClientRect().width);
      const heroMedia = act.querySelector('[class$="hero-media"]');
      const h1s = [...document.querySelectorAll('h1')].filter(vis).length;
      return {
        sw: document.documentElement.scrollWidth, iw: innerWidth, height: document.documentElement.scrollHeight,
        dup: ids.filter((id, i) => ids.indexOf(id) !== i && /^jkm?-/.test(id)),
        dVis: vis(dr), mVis: vis(mr), h1s,
        notIn: rv.filter((e) => !/-in\b/.test(e.className)).length, rv: rv.length,
        narrow: cards.length ? Math.min(...cards) : 0,
        heroW: heroMedia ? heroMedia.getBoundingClientRect().width : 0,
        img: [...act.querySelectorAll('img')].map((i) => ({ nw: i.naturalWidth, rw: i.getBoundingClientRect().width, fit: getComputedStyle(i).objectFit })),
      };
    }, { D, M });
    const tagw = `${w}px${order === 'md' ? ' (mobil blokk elöl)' : ''}`;
    ok(`${tagw}: nincs vízszintes csúszás`, m.sw <= m.iw, `${m.sw}/${m.iw}`);
    ok(`${tagw}: nincs duplikált id, konzolhiba`, !m.dup.length && !errors.length, (m.dup.join(',') + ' ' + errors.join(' | ')).trim());
    ok(`${tagw}: csak a ${w <= 800 ? 'mobil' : 'desktop'} blokk látszik, egy H1`, (w <= 800 ? m.mVis && !m.dVis : m.dVis && !m.mVis) && m.h1s === 1, JSON.stringify({ d: m.dVis, m: m.mVis, h1: m.h1s }));
    ok(`${tagw}: felfedés kész (${m.rv} elem, nincs fagyás)`, m.notIn === 0, `nem jelent meg: ${m.notIn}`);
    if (w > 800) {
      ok(`${tagw}: nincs 260 px alatti oszlop`, m.narrow >= 260, `${m.narrow.toFixed(0)} px`);
      ok(`${tagw}: a hero fotó legfeljebb 1920 px széles (nincs megnyúlás)`, m.heroW <= 1920 && m.img.every((i) => i.fit === 'cover' || Math.abs(i.rw - i.nw) < 1 || i.rw <= i.nw * 1.35), `hero ${m.heroW}px`);
    }
    if (order === 'dm') {
      await pg.evaluate(() => scrollTo(0, 0));
      await pg.waitForTimeout(300);
      await pg.screenshot({ path: join(out, `${page}-check-${w}-full.png`), fullPage: true });
      console.log(`${w}px: magasság ${m.height}, csúszás ${m.sw}/${m.iw}, felfedés ${m.rv - m.notIn}/${m.rv}`);
    }
    await ctx.close();
  }
}

// 2. A két blokk tartalma azonos (a látható szövegegységek halmaza)
{
  const units = async (w, pre) => {
    const { ctx, pg } = await open(w);
    const u = await pg.evaluate((pre) => {
      const r = document.getElementById(pre + 'root');
      const set = new Set();
      r.querySelectorAll('h1, h2, h3, p, a').forEach((e) => { const t = e.textContent.replace(/\s+/g, ' ').trim(); if (t && t !== '?') set.add(t); });
      return [...set].sort();
    }, pre);
    await ctx.close();
    return u;
  };
  const du = await units(1440, D), mu = await units(390, M);
  const onlyD = du.filter((x) => !mu.includes(x)), onlyM = mu.filter((x) => !du.includes(x));
  ok(`a két blokk szövege azonos (${du.length} egység)`, !onlyD.length && !onlyM.length, JSON.stringify({ onlyD, onlyM }));
}

// 3. Linkek, gombok, kattintások
for (const [w, pre] of [[1440, D], [390, M]]) {
  const { ctx, pg } = await open(w);
  const links = await pg.evaluate((pre) => [...document.getElementById(pre + 'root').querySelectorAll('a')].map((a) => ({ t: a.textContent.trim().replace(/\s+/g, ' '), h: a.getAttribute('href'), tg: a.target, rel: a.rel })), pre);
  const zoho = links.filter((l) => l.t === c.cta);
  ok(`${w}px: minden "${c.cta}" gomb (${zoho.length}) a pontos foglalási linkre, új lapon`, zoho.length >= 3 && zoho.every((l) => l.h === FOGLALAS && l.tg === '_blank' && l.rel === 'noopener'), JSON.stringify(zoho.map((l) => l.h)));
  const ext = links.filter((l) => /^https?:/.test(l.h));
  ok(`${w}px: külső link csak a foglalás`, ext.every((l) => l.h === FOGLALAS), JSON.stringify(ext.map((l) => l.h)));
  const tel = links.filter((l) => /^tel:/.test(l.h));
  ok(`${w}px: telefon-hivatkozás tel:+36203734991 (${tel.length})`, tel.length >= 2 && tel.every((l) => l.h === 'tel:+36203734991' && l.t === '+36 20 373 4991'), JSON.stringify(tel));
  const popupBtn = await pg.evaluate(() => document.querySelectorAll('[data-test-id="show-popup-button"]').length);
  const [np] = await Promise.all([ctx.waitForEvent('page', { timeout: 4000 }).catch(() => null), pg.locator(`#${pre}root .${pre}hero a[data-${pre}zoho]`).click()]);
  if (np) await np.waitForLoadState().catch(() => {});
  ok(`${w}px: a hero gomb új lapon a Zoho foglalásra visz, nincs popup`, !!np && np.url() === FOGLALAS && popupBtn === 0 || (!!np && np.url().startsWith('https://growthnestg.zohobookings.eu/254300000000290002')), np && np.url());
  if (np) await np.close();
  const internal = links.filter((l) => /^\//.test(l.h)).map((l) => l.h);
  const need = page === 'klimaszereles' ? ['/aux', '/daikin', '/fisher', '/gree', '/midea', '/polar', '/syen', '/keszulekek', '/klimatisztitas'] : [];
  ok(`${w}px: belső szöveges linkek (Don 3.8)`, need.every((x) => internal.includes(x)), `hiányzik: ${need.filter((x) => !internal.includes(x)).join(', ')}`);
  for (const href of need.filter((x) => ['/daikin', '/keszulekek', '/klimatisztitas'].includes(x))) {
    const p2 = await ctx.newPage();
    await p2.goto(url);
    await p2.waitForTimeout(300);
    const el = p2.locator(`#${pre}root a[href="${href}"]`).first();
    await el.scrollIntoViewIfNeeded();
    await p2.waitForTimeout(700);
    await Promise.all([p2.waitForURL(`**${href}`, { timeout: 4000 }).catch(() => {}), el.click()]);
    ok(`${w}px: kattintás ${href}`, p2.url().endsWith(href), p2.url());
    await p2.close();
  }
  await ctx.close();
}

// 4. Ikon-animáció: egér (képkockák a keret széléről induló gyűrűről) és érintés (egyszer fut)
{
  const { ctx, pg } = await open(1440);
  const sel = `#${D}root .${D}step`;
  const badgeSel = `${sel} .${D}badge`;
  const badge = pg.locator(badgeSel).first();
  await badge.scrollIntoViewIfNeeded();
  await pg.waitForTimeout(1500);
  await pg.mouse.move(5, 5);
  await pg.waitForTimeout(300);
  const bb = await badge.boundingBox();
  const clip = { x: bb.x - bb.width * 0.6, y: bb.y - bb.height * 0.6, width: bb.width * 2.2, height: bb.height * 2.2 };
  await pg.screenshot({ path: join(out, `${page}-ikon-0-kiindulas.png`), clip });
  await pg.evaluate((s) => { window.__ringLog = []; document.querySelector(s).querySelectorAll('[class$="-ring"], [class*="-ring "]').forEach((r, i) => r.addEventListener('animationstart', () => window.__ringLog.push(i))); }, badgeSel);
  const card = await pg.locator(sel).first().boundingBox();
  await pg.mouse.move(card.x + card.width - 14, card.y + card.height - 16);
  const frames = [[50, '1-gyuru-indul-a-keret-szelerol'], [200, '2-zoom-csucs'], [340, '3-gyuru-kifele'], [540, '4-gyuru-halvanyul'], [950, '5-vege']];
  let t = 0;
  const states = [];
  for (const [ms, name] of frames) {
    await pg.waitForTimeout(ms - t); t = ms;
    await pg.screenshot({ path: join(out, `${page}-ikon-${name}.png`), clip });
    states.push(await pg.evaluate((s) => { const b = document.querySelector(s); const r = b.querySelector(`[class*="-ring"]`); const rs = getComputedStyle(r); return { tf: rs.transform, op: rs.opacity, top: rs.top, left: rs.left, bg: rs.backgroundColor, bw: rs.borderTopWidth, br: rs.borderRadius, zoom: getComputedStyle(b).transform }; }, badgeSel));
  }
  const sc = (tf) => (tf === 'none' ? 1 : Number(tf.match(/matrix\(([^,]+)/)[1]));
  ok('ikon: a kártyára vitt egérre egyszer nagyít (1,12-1,18x)', sc(states[1].zoom) >= 1.12 && sc(states[1].zoom) <= 1.18, states[1].zoom);
  ok('ikon: a gyűrű a KERET SZÉLÉRŐL indul (üres, inset:0, ~1,0x), majd kifelé tágul és halványul', sc(states[0].tf) < 1.15 && states[0].top === '0px' && states[0].left === '0px' && states[0].bg === 'rgba(0, 0, 0, 0)' && parseFloat(states[0].bw) > 0 && sc(states[2].tf) > sc(states[0].tf) && Number(states[3].op) < Number(states[1].op), states.map((s) => `${sc(s.tf).toFixed(2)}/${Number(s.op).toFixed(2)}`).join(' '));
  const logMouse = await pg.evaluate(() => window.__ringLog.length);
  await pg.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2, { steps: 6 });
  await pg.waitForTimeout(700);
  const logStill = await pg.evaluate(() => window.__ringLog.length);
  ok('ikon: egy belépésre egyszer fut (a kártyán belül mozogva sem ismétlődik)', logMouse === 2 && logStill === 2, `${logMouse}, ${logStill}`);
  await pg.mouse.move(5, 5);
  await pg.waitForTimeout(400);
  const back = await pg.evaluate((s) => getComputedStyle(document.querySelector(s)).transform, badgeSel);
  ok('ikon: az egér elhagyásakor visszamegy', sc(back) === 1, back);
  // telefon-gomb ikonja
  const telBadge = `#${D}root .${D}hero a[href^="tel:"] .${D}badge`;
  await pg.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await pg.waitForTimeout(900);
  await pg.mouse.move(5, 300);
  const tb = await pg.locator(`#${D}root .${D}hero a[href^="tel:"]`).boundingBox();
  await pg.mouse.move(tb.x + tb.width - 20, tb.y + tb.height / 2);
  await pg.waitForTimeout(200);
  const telSt = await pg.evaluate((s) => ({ z: getComputedStyle(document.querySelector(s)).transform, go: document.querySelectorAll(s + ' [class*="-go"]').length }), telBadge);
  ok('ikon: a telefon-gomb ikonja is animál', sc(telSt.z) > 1.1 && telSt.go === 2, JSON.stringify(telSt));
  await ctx.close();

  const m = await open(390);
  const qSel = `#${M}root .${M}qa .${M}badge`;
  const b2 = m.pg.locator(qSel).first();
  await b2.scrollIntoViewIfNeeded();
  await m.pg.waitForTimeout(1000);
  await m.pg.evaluate((s) => { window.__ringLog = []; document.querySelector(s).querySelectorAll('[class*="-ring"]').forEach((r, i) => r.addEventListener('animationstart', () => window.__ringLog.push(i))); }, qSel);
  const tb2 = await b2.boundingBox();
  await m.pg.touchscreen.tap(tb2.x + tb2.width / 2, tb2.y + tb2.height / 2);
  await m.pg.waitForTimeout(150);
  const zt = await m.pg.evaluate((s) => getComputedStyle(document.querySelector(s)).transform, qSel);
  await m.pg.waitForTimeout(900);
  const touchLog = await m.pg.evaluate(() => window.__ringLog.length);
  ok('érintés: zoom + gyűrű egyszer (nem kétszer)', touchLog === 2 && sc(zt) > 1.1, `${touchLog} animáció, ${zt}`);
  await m.ctx.close();
}

// 5. Lebegő gomb (mobil): a hero után jelenik meg, a záró gombsornál eltűnik, a jobb alsó sarok szabad
{
  const { ctx, pg } = await open(390);
  const fab = `#${M}root .${M}fab`;
  const shown = () => pg.evaluate((s) => /-show/.test(document.querySelector(s).className), fab);
  const a = await shown();
  await pg.evaluate(() => scrollTo(0, 1500));
  await pg.waitForTimeout(500);
  const b = await shown();
  const box = await pg.locator(`${fab} a`).boundingBox();
  await pg.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await pg.waitForTimeout(500);
  const cHidden = await pg.evaluate((s) => { const r = document.querySelector(s.replace('fab', 'cta')); const rr = r.getBoundingClientRect(); return rr.top < innerHeight && rr.bottom > 0 ? !/-show/.test(document.querySelector(s).className) : true; }, fab);
  ok('mobil: lebegő gomb a hero után, a záró gombsornál eltűnik, a jobb alsó 84 px szabad', !a && b && cHidden && box.x + box.width <= 390 - 84, JSON.stringify({ a, b, cHidden, right: box.x + box.width }));
  await ctx.close();
}

// 6. prefers-reduced-motion
for (const w of [1440, 390]) {
  const { ctx, pg } = await open(w, { reduce: true });
  const st = await pg.evaluate(() => ({
    hidden: [...document.querySelectorAll('[class*="-rv"]')].filter((e) => e.getClientRects().length && getComputedStyle(e).opacity !== '1').length,
    rings: document.querySelectorAll('[class*="-ring"]').length,
  }));
  ok(`${w}px reduced-motion: minden azonnal látszik, nincs ikon-animáció`, st.hidden === 0 && st.rings === 0, JSON.stringify(st));
  await ctx.close();
}

// 7. Képek: a hero eager + fetchpriority, a rejtett blokk hero-ja NEM töltődik le; minden más kép lazy
{
  const d = await open(1440);
  await scrollThrough(d.pg);
  const dReq = d.log.requests.map((u) => u.split('/').pop());
  await d.ctx.close();
  const m = await open(390);
  await scrollThrough(m.pg);
  const mReq = m.log.requests.map((u) => u.split('/').pop());
  await m.ctx.close();
  const mob = c.hero.mobil.file, desk = c.hero.desktop.file;
  ok('desktopon csak a desktop hero töltődik (a mobil blokk képe nem)', dReq.some((u) => u.endsWith(desk)) && !dReq.some((u) => u.endsWith(mob)), dReq.join(', '));
  ok('mobilon csak a mobil hero töltődik (a desktop blokk képe nem)', mReq.some((u) => u.endsWith(mob)) && !mReq.some((u) => u.endsWith(desk)), mReq.join(', '));
}

// 8. Hézag: a blokk a fejléchez és a lábléchez illeszkedik (nincs idegen színű csík)
for (const w of [1440, 390]) {
  const { ctx, pg } = await open(w);
  await pg.waitForTimeout(600);
  const g = await pg.evaluate(() => {
    const vis = [...document.querySelectorAll('[id$="-root"]')].find((r) => r.getBoundingClientRect().height > 0);
    const r = vis.getBoundingClientRect(), hd = document.querySelector('header').getBoundingClientRect(), ft = document.querySelector('footer').getBoundingClientRect();
    const cs = getComputedStyle(vis);
    const px = (v) => parseFloat(cs.getPropertyValue(v)) || 0;
    const pre = vis.id.replace('root', '');
    return { top: Math.round(r.top - hd.bottom), bottom: Math.round(ft.top - r.bottom), fillT: px(`--${pre}fill-t`), fillB: px(`--${pre}fill-b`) };
  });
  ok(`${w}px: fejléc/lábléc illesztés (rés kitöltve a blokk színével)`, (g.top <= 0 || g.fillT === g.top) && (g.bottom <= 0 || g.fillB === g.bottom), JSON.stringify(g));
  await ctx.close();
}

// 9. Nyers HTML (JS nélkül) és JSON-LD
{
  const dRaw = readFileSync(join(OUT, `desktop-${page}.html`), 'utf8');
  const mRaw = readFileSync(join(OUT, `mobil-${page}.html`), 'utf8');
  for (const [name, raw] of [['desktop', dRaw], ['mobil', mRaw]]) {
    const text = raw.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
    const must = ['<h1', c.hero.h1, c.lepesekCim, c.gyikCim, ...c.gyik.map((f) => f.q), c.intro[0].slice(0, 60), 'href="/keszulekek"'];
    const miss = must.filter((s) => !text.includes(s));
    ok(`nyers HTML (${name}): H1, szöveg, GYIK statikusan benne`, !miss.length, miss.join(', '));
  }
  const ld = [...mRaw.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  const dld = [...dRaw.matchAll(/application\/ld\+json/g)];
  let j = null;
  try { j = JSON.parse(ld[0][1]); } catch { /* */ }
  const faq = j && j['@graph'].find((x) => x['@type'] === 'FAQPage');
  const strip = (s) => s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
  const same = faq && faq.mainEntity.length === c.gyik.length && faq.mainEntity.every((q, i) => q.name === strip(c.gyik[i].q) && q.acceptedAnswer.text === strip(c.gyik[i].a));
  const { ctx, pg } = await open(390);
  const vis = await pg.evaluate((M) => [...document.getElementById(M + 'root').querySelectorAll(`.${M}qa`)].map((e) => ({ q: e.querySelector('h3').textContent.trim(), a: e.querySelector('p').textContent.trim() })), M);
  await ctx.close();
  const sameVisible = faq && vis.length === faq.mainEntity.length && vis.every((v, i) => v.q === faq.mainEntity[i].name && v.a === faq.mainEntity[i].acceptedAnswer.text);
  ok('JSON-LD: egyszer, csak a mobil blokkban, érvényes, Service + BreadcrumbList + FAQPage', ld.length === 1 && dld.length === 0 && !!j && ['Service', 'BreadcrumbList', 'FAQPage'].every((t) => j['@graph'].some((x) => x['@type'] === t)));
  ok('JSON-LD: a FAQPage szó szerint egyezik a látható GYIK-kal', !!same && !!sameVisible, JSON.stringify(vis.slice(0, 1)));
}

await browser.close();
const passed = results.filter((r) => r.pass).length;
for (const r of results) console.log(`${r.pass ? 'OK  ' : 'HIBA'} ${r.name}${r.info && !r.pass ? '  [' + r.info + ']' : ''}`);
console.log(`\n${passed}/${results.length} rendben`);
process.exit(passed === results.length ? 0 : 1);
