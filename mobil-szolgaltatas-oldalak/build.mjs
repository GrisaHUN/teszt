// A src/<oldal>.html + a közös src/_base.css/_base.js fájlokból elkészíti a
// Systeme.io Raw HTML blokkba bemásolható dist/mobil-<oldal>.html fájlokat.
//
// Oldal-forrás felépítése: @@CONFIG (prefix, guard, out), @@HTML (a gyökér
// tartalma), @@CSS és @@JS (oldal-specifikus kiegészítés). A __P__ helyére
// az oldal előtagja kerül (pl. jkm-ksz-), a __G__ helyére a script-őr neve.
//
// Képek: {{IMG:fájl|tartalék-URL}} -> ha assets/fájl létezik, base64 data URI,
// különben a tartalék URL (csak a Systeme.io CDN engedélyezett).
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const MAX_BYTES = 70 * 1024;
const ZOHO = 'https://growthnestg.zohobookings.eu/254300000000290002/#/254300000000290002?booknow=true';
const CDN = 'https://d1yei2z3i6k35z.cloudfront.net/';
const KESZULEKEK = 'https://jimmy-klima.systeme.io/keszulekek';
const MIME = { '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml' };
const PREFIXES = ['jkm-ksz-', 'jkm-kt-', 'jkm-sz-', 'jkm-vsz-'];

// Ikonok: egyszer, rejtett SVG-szimbólumként kerülnek az oldalba, a gombok <use>-zal hivatkoznak rájuk.
const SYMBOLS = {
  tel: '<symbol id="__R__-i-tel" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></symbol>',
  cal: '<symbol id="__R__-i-cal" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM16 2v4M8 2v4M3 10h18"/></symbol>',
  arrow: '<symbol id="__R__-i-arrow" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M13 6l6 6-6 6"/></symbol>',
  check: '<symbol id="__R__-i-check" viewBox="0 0 24 24"><path fill="none" stroke="#0E1C43" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M20 6L9 17l-5-5"/></symbol>',
};
const icon = (name) => `<svg aria-hidden="true"><use href="#__R__-i-${name}"/></svg>`;

const macros = {
  BTN_AJANLAT: `<a class="__P__btn __P__btn-lime" href="${ZOHO}" target="_blank" rel="noopener" data-__P__ajanlat>Ingyenes árajánlat kérése</a>`,
  BTN_FOGLALAS: `<a class="__P__btn __P__btn-lime" href="${ZOHO}" target="_blank" rel="noopener">${icon('cal')}Időpont foglalása</a>`,
  BTN_TEL_GHOST: `<a class="__P__btn __P__btn-ghost" href="tel:+36203734991">${icon('tel')}+36 20 373 4991</a>`,
  BTN_TEL_NAVY: `<a class="__P__btn __P__btn-navy" href="tel:+36203734991">${icon('tel')}+36 20 373 4991</a>`,
  BTN_TEL_LIME: `<a class="__P__btn __P__btn-lime" href="tel:+36203734991">${icon('tel')}+36 20 373 4991</a>`,
  FAB_AJANLAT: `<div class="__P__fab"><a class="__P__btn __P__btn-lime" href="${ZOHO}" target="_blank" rel="noopener" data-__P__ajanlat>Ingyenes árajánlat kérése</a></div>`,
  FAB_FOGLALAS: `<div class="__P__fab"><a class="__P__btn __P__btn-lime" href="${ZOHO}" target="_blank" rel="noopener">${icon('cal')}Időpont foglalása</a></div>`,
  BTN_KESZULEKEK: `<a class="__P__btn __P__btn-dark" href="${KESZULEKEK}">Forgalmazott készülékek${icon('arrow')}</a>`,
  CHECK_IC: `<span class="__P__check-ic">${icon('check')}</span>`,
};

// A nem használt CSS-szabályokat elhagyja: egy szabály marad, ha legalább egy
// szelektorának minden __P__ osztálya előfordul a markupban vagy a scriptben.
function shakeCss(css, used) {
  const out = [];
  let i = 0;
  while (i < css.length) {
    const open = css.indexOf('{', i);
    if (open < 0) break;
    const head = css.slice(i, open).trim();
    let depth = 1, j = open + 1;
    while (depth && j < css.length) { if (css[j] === '{') depth++; else if (css[j] === '}') depth--; j++; }
    const body = css.slice(open + 1, j - 1);
    if (head.startsWith('@media')) {
      const inner = shakeCss(body, used);
      if (inner) out.push(`${head}{${inner}}`);
    } else if (head.startsWith('@')) {
      out.push(`${head}{${body}}`);
    } else if (head.split(',').some((sel) => [...sel.matchAll(/\.(__P__[\w-]+)/g)].every((m) => used.has(m[1])))) {
      out.push(`${head}{${body}}`);
    }
    i = j;
  }
  return out.join('');
}

// Várható beágyazott hero data-URI méretek (KB) a leírás szerint, amíg a kép nincs az assets/ mappában.
const EXPECTED_HERO_KB = { 'hero-klimaszereles.webp': 21, 'hero-klimatisztitas.webp': 34, 'hero-szelloztetes.webp': 39, 'hero-villanyszereles.webp': 57 };

function compactCss(css) {
  return css.replace(/\s+/g, ' ').replace(/\s*([{};,>])\s*/g, '$1').replace(/:\s+/g, ':').replace(/;}/g, '}').trim();
}

// Hullámos átmenet két eltérő hátterű szekció közé (mint a mobil főoldalon):
// a hullám az előző szekció színével "folyik rá" a következőre.
const NAVY = '#0E1C43', WHITE = '#FFFFFF', GRAY = '#F5F6F8';
const WAVES = ['M0,0 L400,0 L400,10 C 300,26 110,2 0,16 Z', 'M0,0 L400,0 L400,10 C 300,4 100,22 0,8 Z'];
function sectionColor(cls) {
  if (/__P__hero-light/.test(cls)) return WHITE;
  if (/__P__hero|__P__cta/.test(cls)) return NAVY;
  if (/__P__sec-gray/.test(cls)) return GRAY;
  return WHITE;
}
function addWaves(src) {
  const opens = [...src.matchAll(/<section class="([^"]+)"/g)];
  let out = '', last = 0, n = 0;
  opens.forEach((m, i) => {
    if (i === 0) return;
    const from = sectionColor(opens[i - 1][1]), to = sectionColor(m[1]);
    if (from === to) return;
    const d = WAVES[n++ % WAVES.length];
    out += src.slice(last, m.index) + `<div class="__P__wave" style="background:${to}" aria-hidden="true"><svg viewBox="0 0 400 26" preserveAspectRatio="none" focusable="false"><path d="${d}" fill="${from}"/></svg></div>\n`;
    last = m.index;
  });
  return out + src.slice(last);
}

function parts(src) {
  const out = {};
  for (const chunk of src.split(/^@@/m).slice(1)) {
    const nl = chunk.indexOf('\n');
    out[chunk.slice(0, nl).trim()] = chunk.slice(nl + 1).trim();
  }
  return out;
}

const baseCss = readFileSync(join(here, 'src', '_base.css'), 'utf8').trim();
const baseJs = readFileSync(join(here, 'src', '_base.js'), 'utf8').trim();
let failed = false;
const fail = (msg) => { console.error('  HIBA: ' + msg); failed = true; };

for (const file of readdirSync(join(here, 'src')).filter((f) => !f.startsWith('_') && f.endsWith('.html')).sort()) {
  const p = parts(readFileSync(join(here, 'src', file), 'utf8'));
  const cfg = Object.fromEntries(p.CONFIG.split('\n').map((l) => l.split('=').map((s) => s.trim())));
  const html0 = addWaves(p.HTML);
  // {{SPLIT}} sor: az oldal több, egymás után beillesztendő blokkra bomlik (-1, -2 ...).
  const chunks = html0.split(/^\s*\{\{SPLIT\}\}\s*$/m);
  const pageIds = [];
  chunks.forEach((chunk, idx) => {
    const n = idx + 1;
    const rootId = n === 1 ? `${cfg.prefix}root` : `${cfg.prefix}root-${n}`;
    const out = chunks.length > 1 ? cfg.out.replace(/\.html$/, `-${n}.html`) : cfg.out;
    const guard = n === 1 ? cfg.guard : cfg.guard + n;
    const embedded = [];
    let pendingKb = 0;
    let markup = chunk.split('\n').map((l) => l.trim()).filter(Boolean).join('\n').replace(/\{\{([A-Z_]+)\}\}/g, (m, k) => macros[k] ?? m);
    const syms = Object.keys(SYMBOLS).filter((k) => markup.includes(`#__R__-i-${k}"`));
    if (syms.length) markup = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">${syms.map((k) => SYMBOLS[k]).join('')}</svg>\n` + markup;
    const js = baseJs.replace('/*__PAGE_JS__*/', p.JS || '').split('\n').map((l) => l.trim()).filter(Boolean).join('\n');
    const used = new Set([...(markup + js).matchAll(/__P__[\w-]+/g)].map((m) => m[0]));
    const css = shakeCss(compactCss(`${baseCss}\n${p.CSS || ''}`), used);
    let html = `<style>${css}</style>\n<div id="__R__">\n${markup}\n</div>\n<script>\n${js}\n</script>\n`;
    html = html.replace(/\{\{IMG:([\w.-]+)\|([^}]+)\}\}/g, (_, f, fallback) => {
      const path = join(here, 'assets', f);
      if (!existsSync(path)) { pendingKb += EXPECTED_HERO_KB[f] || 0; return fallback; }
      embedded.push(f);
      return `data:${MIME[extname(f)]};base64,${readFileSync(path).toString('base64')}`;
    });
    html = html.replaceAll('__R__', rootId).replaceAll('__P__', cfg.prefix).replaceAll('__G__', guard);
    writeFileSync(join(here, 'dist', out), html);

    const bytes = Buffer.byteLength(html);
    const code = html.replace(/data:[\w/+.-]+;base64,[A-Za-z0-9+/=]+/g, '');
    const img = embedded.length ? ', beágyazva: ' + embedded.join(', ') : pendingKb ? ', hero: CDN URL' : '';
    console.log(`${out}: ${(bytes / 1024).toFixed(1)} KB (kód ${(Buffer.byteLength(code) / 1024).toFixed(1)} KB)${img}`);
    if (bytes > MAX_BYTES) fail('nagyobb, mint 70 KB');
    if (pendingKb) {
      const projected = bytes / 1024 + pendingKb;
      console.log(`  beágyazott hero-képpel várhatóan ${projected.toFixed(1)} KB`);
      if (projected > MAX_BYTES / 1024) fail('a hero beágyazása után 70 KB fölé menne');
    }
    const names = code.replace(/https?:\/\/\S+/g, '');
    if (/(?<![A-Za-z0-9_])(jk-|--jk-|data-jk-)/.test(names)) fail('desktop "jk-" név a kódban');
    for (const other of PREFIXES.filter((x) => x !== cfg.prefix)) if (names.includes(other)) fail(`másik oldal előtagja: ${other}`);
    if (/__P__|__G__|__R__|\{\{/.test(code)) fail('kitöltetlen helyőrző');
    if (code.includes('<!--')) fail('HTML-komment');
    if (code.includes('—')) fail('gondolatjel (—) a szövegben');
    if (/fertőtlen/i.test(code)) fail('"fertőtlenítés" szó');
    for (const [, src] of code.matchAll(/\ssrc="([^"]+)"/g)) if (/^https?:/.test(src) && !src.startsWith(CDN)) fail(`külső kép: ${src}`);
    for (const [, href] of code.matchAll(/\shref="([^"]+)"/g)) if (href !== ZOHO && href !== KESZULEKEK && href !== 'tel:+36203734991' && !href.startsWith(`#${rootId}-i-`)) fail(`váratlan link: ${href}`);
    const ids = [...code.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
    pageIds.push(...ids);
    if (ids.some((id) => !id.startsWith(cfg.prefix))) fail('előtag nélküli id');
    const classes = [...code.matchAll(/\sclass="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/));
    const bad = classes.filter((c) => !c.startsWith(cfg.prefix));
    if (bad.length) fail('előtag nélküli osztály: ' + [...new Set(bad)].join(', '));
  });
  const dup = pageIds.filter((id, i) => pageIds.indexOf(id) !== i);
  if (dup.length) fail(`${cfg.out}: duplikált id: ${[...new Set(dup)].join(', ')}`);
}
process.exit(failed ? 1 : 0);
