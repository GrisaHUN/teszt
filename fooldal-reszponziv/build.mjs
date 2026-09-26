// A src/bN-*.html blokk-forrásokból és a közös src/_base.css + src/js/*.js
// modulokból elkészíti a Systeme.io Raw HTML blokkokba bemásolható
// dist/fooldal-N-*.html fájlokat, és ellenőrzi a blokkszabályokat.
//
// Blokk-forrás: @@CONFIG (root, guard, out, modules), @@HTML, @@CSS, @@JS.
// A __R__ helyére a blokk gyökér-azonosítója, a __G__ helyére a script-őr kerül.
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

// ---- Végleges címek (a kimenetben ezek szerepelnek) ----
const ZOHO = 'https://growthnestg.zohobookings.eu/254300000000290002/#/254300000000290002?booknow=true';
const CDN = 'https://d1yei2z3i6k35z.cloudfront.net/19002789/';
const JKH_HERO_DESKTOP_URL = CDN + '6ab70e3f922b67.12682778_profi-klimaszereles-szegeden-hero.jpg';
// A mobil (álló) hero végleges CDN-címe még nincs meg. Amíg üres, a kép
// base64-ként kerül a blokkba (assets/hero-mobil-allo.webp, 27 KB).
const JKH_HERO_MOBIL_URL = CDN + '6ab70fbcafebb2.61270426_profi-klimaszereles-szegeden-hero-mobil.webp';
const JKH_FUTES_URL = CDN + '6ab70e37e78260.28840404_futes-klimaval-csalad-otthon.jpeg';
const JKH_KESZ_BAL_URL = CDN + '6ab71575da1d26.72504795_forgalmazott-keszulekek-hatter-bal.webp';
const JKH_KESZ_JOBB_URL = CDN + '6ab71572d1f637.82507672_forgalmazott-keszulekek-hatter-jobb.webp';

const MAX_BYTES = 70 * 1024;
const MIME = { '.webp': 'image/webp', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg' };
const LINKS = new Set([ZOHO, '/klimaszereles', '/klimatisztitas', '/szelloztetes', '/villanyszereles', '/keszulekek', 'tel:+36203734991']);

const WAVES_BOTTOM = ['M0,60 L0,26 C 380,64 1000,-6 1440,34 L1440,60 Z', 'M0,60 L0,36 C 300,2 1100,62 1440,20 L1440,60 Z'];
const WAVE_TOP = 'M0,0 L1440,0 L1440,24 C 1060,62 380,-4 0,36 Z';
let waveN = 0;

const macros = {
  ZOHO: () => ZOHO,
  HERO_DESKTOP: () => JKH_HERO_DESKTOP_URL,
  HERO_MOBIL: () => JKH_HERO_MOBIL_URL || dataUri('hero-mobil-allo.webp'),
  FUTES: () => JKH_FUTES_URL,
  KESZ_BAL: () => JKH_KESZ_BAL_URL,
  KESZ_JOBB: () => JKH_KESZ_JOBB_URL,
  WAVE: () => `<svg class="jkh-wave" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="${WAVES_BOTTOM[waveN++ % 2]}"/></svg>`,
  WAVE_TOP: () => `<svg class="jkh-wave jkh-wave-top" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="${WAVE_TOP}"/></svg>`,
  STEPS_PATTERN: () => readFileSync(join(here, 'assets', 'steps-pattern.svg')).toString('base64'),
  ARROW_PREV: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M15 5l-7 7 7 7"/></svg>',
  ARROW_NEXT: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M9 5l7 7-7 7"/></svg>',
};

function dataUri(file) {
  return `data:${MIME[extname(file)]};base64,${readFileSync(join(here, 'assets', file)).toString('base64')}`;
}

function compactCss(css) {
  return css.replace(/\s+/g, ' ').replace(/\s*([{};,>])\s*/g, '$1').replace(/:\s+/g, ':').replace(/;}/g, '}').trim();
}

// Nem használt CSS-szabályok elhagyása: marad, ha legalább egy szelektorának
// minden jkh- osztálya/azonosítója előfordul a markupban vagy a scriptben.
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
    } else if (head.split(',').some((sel) => [...sel.matchAll(/[.#](jkh-[\w-]+)/g)].every((m) => used.has(m[1])))) {
      out.push(`${head}{${body}}`);
    }
    i = j;
  }
  return out.join('');
}

function parts(src) {
  const out = {};
  for (const chunk of src.split(/^@@/m).slice(1)) {
    const nl = chunk.indexOf('\n');
    out[chunk.slice(0, nl).trim()] = chunk.slice(nl + 1).replace(/\s+$/, '');
  }
  return out;
}

const baseCss = readFileSync(join(here, 'src', '_base.css'), 'utf8');
const js = (name) => readFileSync(join(here, 'src', 'js', `${name}.js`), 'utf8');
mkdirSync(join(here, 'dist'), { recursive: true });

let failed = false;
const fail = (msg) => { console.error('  HIBA: ' + msg); failed = true; };
const allIds = [];
let h1Count = 0;

for (const file of readdirSync(join(here, 'src')).filter((f) => /^b\d-.*\.html$/.test(f)).sort()) {
  const p = parts(readFileSync(join(here, 'src', file), 'utf8'));
  const cfg = Object.fromEntries(p.CONFIG.split('\n').filter(Boolean).map((l) => l.split('=').map((s) => s.trim())));
  const mods = (cfg.modules || '').split(/\s*,\s*/).filter(Boolean);

  let markup = p.HTML.split('\n').map((l) => l.trim()).filter(Boolean).join('\n');
  markup = markup.replace(/\{\{IMG:([\w.-]+)\}\}/g, (_, f) => dataUri(f)).replace(/\{\{([A-Z_]+)\}\}/g, (m, k) => (macros[k] ? macros[k]() : m));
  let script = js('core').replace('/*@MODULES*/', mods.map(js).join('\n') + '\n' + (p.JS || ''));
  script = script.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('//')).join('\n');
  const used = new Set([...(markup + script).matchAll(/jkh-[\w-]+/g)].map((m) => m[0]));
  used.add(cfg.root);
  const cssSrc = `${baseCss}\n${p.CSS || ''}`.replace(/\{\{([A-Z_]+)\}\}/g, (m, k) => (macros[k] ? macros[k]() : m));
  const css = shakeCss(compactCss(cssSrc.replaceAll('__R__', cfg.root)), used);

  const html = `<style>${css}</style>\n<div id="${cfg.root}">\n${markup}\n</div>\n<script>\n${script}\n</script>\n`
    .replaceAll('__R__', cfg.root).replaceAll('__G__', cfg.guard);
  writeFileSync(join(here, 'dist', cfg.out), html);

  const bytes = Buffer.byteLength(html);
  const code = html.replace(/data:[\w/+.-]+;base64,[A-Za-z0-9+/=]+/g, 'data:');
  console.log(`${cfg.out}: ${(bytes / 1024).toFixed(1)} KB (kód ${(Buffer.byteLength(code) / 1024).toFixed(1)} KB)`);
  if (bytes > MAX_BYTES) fail('nagyobb, mint 70 KB');
  const names = code.replace(/https?:\/\/\S+/g, '');
  if (/(?<![A-Za-z0-9_])(jk-|jkm-)/.test(names)) fail('tiltott "jk-" vagy "jkm-" név');
  if (/__R__|__G__|\{\{/.test(code)) fail('kitöltetlen helyőrző');
  if (code.includes('<!--')) fail('HTML-komment');
  if (code.includes('—')) fail('gondolatjel (—)');
  if (/ld\+json/i.test(code)) fail('JSON-LD');
  if (/localhost|test\.local|TODO|lorem/i.test(code)) fail('teszt-maradvány');
  h1Count += (code.match(/<h1\b/g) || []).length;
  for (const [, href] of code.matchAll(/\shref="([^"]+)"/g)) if (!LINKS.has(href) && !href.startsWith(`#${cfg.root}`)) fail(`váratlan link: ${href}`);
  for (const [tag] of code.matchAll(/<img\b[^>]*>/g)) {
    for (const a of ['alt', 'width', 'height']) if (!new RegExp(`\\s${a}="`).test(tag)) fail(`img ${a} nélkül: ${tag.slice(0, 80)}`);
    if (!/fetchpriority="high"/.test(tag) && !/loading="lazy"/.test(tag) && !/jkh-lb-img/.test(tag)) fail(`img lazy nélkül: ${tag.slice(0, 80)}`);
    const src = (tag.match(/\ssrc="([^"]+)"/) || [])[1] || '';
    if (/^https?:/.test(src) && !src.startsWith(CDN)) fail(`külső kép: ${src}`);
  }
  const ids = [...code.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  allIds.push(...ids);
  if (ids.some((id) => !id.startsWith('jkh-'))) fail('nem jkh- előtagú id');
  const classes = [...code.matchAll(/\sclass="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/)).filter(Boolean);
  const bad = [...new Set(classes.filter((c) => !c.startsWith('jkh-')))];
  if (bad.length) fail('nem jkh- előtagú osztály: ' + bad.join(', '));
  if (/@keyframes\s+(?!jkh-)/.test(css)) fail('nem jkh- előtagú @keyframes');
  if (/--(?!jkh-)[\w-]+\s*:/.test(css)) fail('nem jkh- előtagú CSS-változó');
}
const dup = allIds.filter((id, i) => allIds.indexOf(id) !== i);
if (dup.length) fail('duplikált id a blokkok között: ' + [...new Set(dup)].join(', '));
if (h1Count !== 1) fail(`h1 száma: ${h1Count}`);
process.exit(failed ? 1 : 0);
