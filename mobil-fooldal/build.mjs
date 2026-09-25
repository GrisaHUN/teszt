// A src/jkm-*.html fájlokból elkészíti a Systeme.io Raw HTML blokkokba
// bemásolható dist/mobil-fooldal-jkm-*.html fájlokat: a {{fájlnév}}
// helyőrzőket az assets/ mappa képeinek base64 data URI-jára cseréli,
// majd ellenőrzi a blokkszabályokat (méret, előtag, komment, külső kép).
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const MAX_BYTES = 70 * 1024;
const MIME = { '.webp': 'image/webp', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png' };
const ALLOWED_IMG_HOST = 'https://d1yei2z3i6k35z.cloudfront.net/';

mkdirSync(join(here, 'dist'), { recursive: true });
let failed = false;
const fail = (msg) => { console.error('  HIBA: ' + msg); failed = true; };

for (const name of readdirSync(join(here, 'src')).filter((f) => /^jkm-\d\.html$/.test(f)).sort()) {
  let html = readFileSync(join(here, 'src', name), 'utf8');
  html = html.replace(/\{\{([\w.-]+)\}\}/g, (_, file) => {
    const buf = readFileSync(join(here, 'assets', file));
    return `data:${MIME[extname(file)]};base64,${buf.toString('base64')}`;
  });
  const out = `mobil-fooldal-${name}`;
  writeFileSync(join(here, 'dist', out), html);

  const bytes = Buffer.byteLength(html);
  console.log(`${out}: ${(bytes / 1024).toFixed(1)} KB`);
  const code = html.replace(/data:[\w/+.-]+;base64,[A-Za-z0-9+/=]+/g, '');
  if (bytes > MAX_BYTES) fail(`${out} nagyobb, mint 70 KB`);
  if (/(?<![A-Za-z0-9_])(jk-|--jk-|data-jk)/.test(code.replace(/https?:\/\/\S+/g, ''))) fail(`${out}: desktop "jk-" név a mobil kódban`);
  if (code.includes('<!--')) fail(`${out}: HTML-komment`);
  if (code.includes('show-popup-button')) fail(`${out}: desktop popup-gombtól függ`);
  if (code.includes('{{')) fail(`${out}: kitöltetlen helyőrző`);
  for (const [, src] of code.matchAll(/<img[^>]*\ssrc="([^"]+)"/g)) {
    if (/^https?:/.test(src) && !src.startsWith(ALLOWED_IMG_HOST)) fail(`${out}: külső kép: ${src}`);
  }
  const ids = [...code.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dup.length) fail(`${out}: duplikált id: ${dup.join(', ')}`);
  if (ids.some((id) => !id.startsWith('jkm-'))) fail(`${out}: nem jkm- előtagú id`);
}
process.exit(failed ? 1 : 0);
