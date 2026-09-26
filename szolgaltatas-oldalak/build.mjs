// Szolgáltatás-oldalak: oldalanként EGY reszponzív Raw HTML blokk a Systeme.io-ba
// (mobilon és desktopon is ugyanaz a kód, 800/801 px-es töréspont). Futtatás: node build.mjs [oldal ...]
//
// Források:
//   src/tartalom/<oldal>.mjs   az oldal szövege
//   src/oldalak/<oldal>.mjs    az oldal elrendezése (sablon-függvény: (tartalom, segéd) => HTML)
//   src/oldalak/<oldal>.css    az oldal saját stílusa (nem kötelező)
//   src/_kozos.css, src/oldal.css   közös stílus (mobil-first, desktop 801 px-től)
//   src/core.js                közös script (felfedés, ikon-animáció, hézagtöltés, lebegő gomb)
// Helyőrzők: __R__ gyökér-id, __P__ előtag (pl. jks-ksz-), __G__ script-őr.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, 'kimenet', 'aloldalak');

// Egy helyen cserélhető célok. A foglalási link a kész blokkban is egy helyen, a gyökér
// data-<előtag>foglalas attribútumában van; a gombok href-je ugyanez (JS nélküli tartalék).
export const FOGLALAS = 'https://growthnestg.zohobookings.eu/254300000000290002';
export const KESZULEKEK = '/keszulekek';
const TEL = 'tel:+36203734991';
const TEL_TXT = '+36 20 373 4991';
const CDN = 'https://d1yei2z3i6k35z.cloudfront.net/';
const KEPEK = JSON.parse(readFileSync(join(here, 'src', 'kepek-urlek.json'), 'utf8'));
const PAGES = process.argv.slice(2).length ? process.argv.slice(2) : ['klimaszereles'];
const pre = (p) => `jks-${p}-`;
const guard = (p) => `__jks${p[0].toUpperCase()}${p.slice(1)}Init`;
const ALLOWED_LINK = /^(\/|\/(klimaszereles|klimatisztitas|szelloztetes|villanyszereles|keszulekek|aux|daikin|fisher|gree|midea|polar|syen|kedvezo))$/;

// Ikonok (24x24, vonalas). A jelvényben a szín a CSS-ből jön (currentColor).
const ICONS = {
  tel: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  nyil: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  felmeres: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2.8h6V4M8.5 10h7M8.5 14h7M8.5 18h4"/>',
  level: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  szereles: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2-2 2.5-2.5z"/>',
  mero: '<path d="M4 17a8 8 0 1 1 16 0"/><path d="M12 17l4.5-5.5"/><circle cx="12" cy="17" r="1.3"/>',
  kulcs: '<circle cx="8" cy="15" r="4"/><path d="M10.9 12.1L20 3M16.5 6.5l3 3M14.5 8.5l2 2"/>',
  pajzs: '<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  homero: '<path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z"/><path d="M12 9v7"/>',
  cimke: '<path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
  kerdes: '<circle cx="12" cy="12" r="9.5"/><path d="M9.3 9.2a2.8 2.8 0 0 1 5.4 1c0 1.9-2.7 2.5-2.7 4"/><circle cx="12" cy="17.3" r="0.4"/>',
};
const icon = (n) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[n]}</svg>`;

const WAVES = ['M0,60 L0,26 C 380,64 1000,-6 1440,34 L1440,60 Z', 'M0,60 L0,36 C 300,2 1100,62 1440,20 L1440,60 Z'];

function helpers() {
  let waveN = 0;
  const nb = (s) => s.replace(/(\d) (\d)/g, '$1\u00a0$2').replace(/ Ft\b/g, '\u00a0Ft');
  const md = (s) => s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, href) => `<a class="__P__link" href="${href}">${t}</a>`);
  return {
    icon, nb, md,
    plain: (s) => s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1'),
    badge: (n, cls = '') => `<span class="__P__badge${cls ? ' ' + cls : ''}">${icon(n)}</span>`,
    zoho: (label, cls = '') => `<a class="__P__btn __P__btn-lime${cls ? ' ' + cls : ''}" href="${FOGLALAS}" target="_blank" rel="noopener" data-__P__zoho>${label}</a>`,
    tel: (cls = '__P__btn-ghost') => `<a class="__P__btn ${cls} __P__host" href="${TEL}"><span class="__P__badge __P__badge-sm">${icon('tel')}</span>${TEL_TXT}</a>`,
    keszulekek: (label) => `<a class="__P__btn __P__btn-dark __P__host" href="${KESZULEKEK}">${label}<span class="__P__badge __P__badge-sm __P__badge-lime">${icon('nyil')}</span></a>`,
    ar: (s) => { const i = s.indexOf(': '); return { label: s.slice(0, i + 1), value: nb(s.slice(i + 2)) }; },
    img: (file) => { if (!KEPEK[file]) throw new Error('nincs végleges URL: ' + file); return KEPEK[file]; },
    // Hero-kép: mobilon (800 px-ig) a kis WebP, desktopon az eredeti JPEG; mindig csak az egyik töltődik.
    hero: (d, m, alt) => { for (const f of [d.file, m.file]) if (!KEPEK[f]) throw new Error('nincs végleges URL: ' + f); return `<picture><source media="(max-width: 800px)" srcset="${KEPEK[m.file]}" width="${m.w}" height="${m.h}"><img src="${KEPEK[d.file]}" alt="${alt}" width="${d.w}" height="${d.h}" loading="eager" fetchpriority="high"></picture>`; },
    wave: (next) => `<svg class="__P__wave" style="--__P__next:${next}" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="${WAVES[waveN++ % 2]}"/></svg>`,
    link: (t, href) => `<a class="__P__link" href="${href}">${t}</a>`,
  };
}

// JSON-LD (csak a mobil blokk végén): Service + BreadcrumbList + FAQPage egy @graph-ban.
// Nincs @id, url, ár, értékelés; a GYIK szövege a látható GYIK-kal azonos forrásból jön.
function jsonLd(c, h) {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        serviceType: c.service.serviceType,
        name: c.service.name,
        description: c.service.description,
        provider: {
          '@type': ['HVACBusiness', 'Electrician'],
          name: 'Jimmy Klíma',
          telephone: '+36203734991',
          email: 'jimmyklimam@gmail.com',
          address: { '@type': 'PostalAddress', streetAddress: 'Gádor köz 3.', postalCode: '6710', addressLocality: 'Szeged', addressCountry: 'HU' },
          areaServed: { '@type': 'City', name: 'Szeged' },
        },
        areaServed: [
          { '@type': 'City', name: 'Szeged' },
          { '@type': 'GeoCircle', geoMidpoint: { '@type': 'GeoCoordinates', latitude: 46.253, longitude: 20.1414 }, geoRadius: '30000' },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Főoldal', item: '/' },
          { '@type': 'ListItem', position: 2, name: c.service.breadcrumb, item: `/${c.slug}` },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: c.gyik.map((f) => ({ '@type': 'Question', name: h.plain(f.q), acceptedAnswer: { '@type': 'Answer', text: h.plain(f.a) } })),
      },
    ],
  };
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

const compactCss = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{};,>])\s*/g, '$1').replace(/:\s+/g, ':').replace(/;}/g, '}').trim();
const compactJs = (js) => js.split('\n').filter((l) => !/^\s*\/\//.test(l)).map((l) => l.trim()).filter(Boolean).join('\n');
const read = (...p) => { const f = join(here, 'src', ...p); return existsSync(f) ? readFileSync(f, 'utf8') : ''; };

let failed = false;
const fail = (msg) => { console.error('  HIBA: ' + msg); failed = true; };
mkdirSync(OUT, { recursive: true });

for (const page of PAGES) {
  const c = (await import(pathToFileURL(join(here, 'src', 'tartalom', `${page}.mjs`)))).default;
  const P = pre(c.prefix);
  const rootId = `${P}root`;
  const tpl = (await import(pathToFileURL(join(here, 'src', 'oldalak', `${page}.mjs`)))).default;
  const h = helpers();
  const markup = tpl(c, h).split('\n').map((l) => l.trim()).filter(Boolean).join('\n');
  const css = compactCss(`${read('_kozos.css')}\n${read('oldal.css')}\n${read('oldalak', `${page}.css`)}`);
  const js = compactJs(read('core.js').replace('/*@PAGE_JS*/', read('oldalak', `${page}.js`)));
  let html = `<style>${css}</style>\n<div id="__R__" data-__P__foglalas="${FOGLALAS}">\n${markup}\n</div>\n<script>\n${js}\n</script>\n${jsonLd(c, h)}\n`;
  html = html.replaceAll('__R__', rootId).replaceAll('__P__', P).replaceAll('__G__', guard(c.prefix)).replaceAll('{{KESZULEKEK}}', KESZULEKEK);
  const out = `${page}.html`;
  writeFileSync(join(OUT, out), html);

  // Ellenőrzések
  const bytes = Buffer.byteLength(html);
  console.log(`${out}: ${(bytes / 1024).toFixed(1)} KB`);
  const tag = (m) => fail(`${out}: ${m}`);
  if (bytes > 70 * 1024) tag('70 KB fölött');
  const code = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, '');
  const names = code.replace(/https?:\/\/\S+?(?=["'\s)])/g, '');
  if (/(?<![A-Za-z0-9_])(jk|jkm|jkh)-/.test(names)) tag('más blokk előtagja (jk-, jkm-, jkh-) a kódban');
  if (/__P__|__G__|__R__|\{\{[A-Z]|undefined/.test(html)) tag('kitöltetlen helyőrző');
  if (html.includes('<!--')) tag('HTML-komment');
  if (html.includes('—')) tag('gondolatjel (—)');
  if (/fertőtlen/i.test(html)) tag('"fertőtlenítés" szó');
  if (/\[[^\]]*\]\(/.test(html)) tag('feldolgozatlan link-jelölés');
  const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
  if (ld.length !== 1) tag('pontosan egy JSON-LD kell');
  else { try { const j = JSON.stringify(JSON.parse(ld[0].replace(/^<script[^>]*>|<\/script>$/g, ''))); if (/\[[A-ZÁÉÍÓÖŐÚÜŰ ]+/.test(j)) tag('szögletes mező a JSON-LD-ben'); if (/"@id"|"url"|priceRange|offers|aggregateRating|founder|foundingDate|identifier/.test(j)) tag('tiltott JSON-LD mező'); } catch (e) { tag('érvénytelen JSON-LD: ' + e.message); } }
  // globális CSS: minden szelektor a gyökérre vagy az előtagos osztályra szűkül (kivétel: a mobil html/body szabály)
  const style = html.match(/<style>([\s\S]*?)<\/style>/)[1];
  for (const m of style.matchAll(/(?:^|[{}])([^{}@]+)\{/g)) {
    for (const s of m[1].split(',').map((x) => x.trim())) {
      if (/^(from|to|\d+%)$/.test(s) || s === 'html' || s === 'body') continue;
      if (!s.startsWith(`#${rootId}`) && !s.startsWith(`.${P}`)) tag(`globális szelektor: ${s}`);
    }
  }
  if (/(^|[{},])\s*(html|body)\s*[,{]/.test(style) && !style.includes('@media (max-width:800px){html,body{max-width:100%;overflow-x:hidden}}')) tag('a html/body szabály csak a megengedett mobil kivétel lehet');
  for (const k of style.matchAll(/@keyframes\s+([\w-]+)/g)) if (!k[1].startsWith(P)) tag(`előtag nélküli @keyframes: ${k[1]}`);
  for (const v of style.matchAll(/(--[\w-]+)\s*:/g)) if (!v[1].startsWith(`--${P}`)) tag(`előtag nélküli CSS-változó: ${v[1]}`);
  const classes = [...code.matchAll(/\sclass="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/));
  const badCls = [...new Set(classes.filter((x) => !x.startsWith(P)))];
  if (badCls.length) tag('előtag nélküli osztály: ' + badCls.join(', '));
  for (const a of code.matchAll(/\sdata-([\w-]+)/g)) if (!a[1].startsWith(P)) tag(`előtag nélküli data-attribútum: ${a[1]}`);
  const ids = [...code.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  if (ids.some((id) => !id.startsWith(P))) tag('előtag nélküli id');
  const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dup.length) tag(`duplikált id: ${dup.join(', ')}`);
  if ((code.match(/<h1[\s>]/g) || []).length !== 1) tag('nem pontosan egy <h1>');
  if (/<main[\s>]/.test(code)) tag('<main> elem');
  for (const [, href] of code.matchAll(/\shref="([^"]+)"/g)) {
    if (href === FOGLALAS || href === TEL || href === KESZULEKEK || ALLOWED_LINK.test(href)) continue;
    tag(`váratlan link: ${href}`);
  }
  for (const a of code.matchAll(/<a\s[^>]*href="https:[^"]*"[^>]*>/g)) if (!/target="_blank"/.test(a[0]) || !/rel="noopener"/.test(a[0])) tag('külső link target/rel nélkül');
  for (const [, src] of code.matchAll(/\ssrcset="([^"]+)"/g)) if (!src.startsWith(CDN)) tag(`nem a végleges CDN-kép: ${src}`);
  for (const im of code.matchAll(/<img\s[^>]*>/g)) {
    const t = im[0];
    const src = (t.match(/\ssrc="([^"]+)"/) || [])[1] || '';
    if (!/\salt="[^"]+"/.test(t) || !/\swidth="\d+"/.test(t) || !/\sheight="\d+"/.test(t)) tag(`kép alt/width/height nélkül: ${src}`);
    if (!src.startsWith(CDN)) tag(`nem a végleges CDN-kép: ${src}`);
    const hero = /fetchpriority="high"/.test(t);
    if (hero ? !/loading="eager"/.test(t) : !(/loading="lazy"/.test(t) && /decoding="async"/.test(t))) tag(`lazy/eager beállítás: ${src}`);
  }
}
process.exit(failed ? 1 : 0);
