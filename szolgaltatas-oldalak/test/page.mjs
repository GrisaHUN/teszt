// Tesztoldal: a törlés előtti főoldal fejléce és lábléce (anyagok/elo-fooldal-*.html),
// közöttük az oldal reszponzív blokkja a Systeme.io szekció-szerkezetébe csomagolva,
// a végén a régi chat-gomb. A CDN-képek helyi másolatból jönnek (kepek-terkep-offline-teszthez.json).
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
export const playwright = (() => {
  try { return require('playwright'); } catch { return require(join(execSync('npm root -g').toString().trim(), 'playwright')); }
})();
const here = dirname(fileURLToPath(import.meta.url));
export const ANYAGOK = process.env.JKS_ANYAGOK || '/tmp/claude-0/-home-user-teszt/5fe1348b-77c1-5bb6-926a-205949d65f1a/scratchpad/csomag-szolg/claude-code-csomag-szolgaltatas-oldalak/anyagok';
export const OUT = join(here, '..', 'kimenet', 'aloldalak');
export const SITE = 'https://jimmy-klima.systeme.io';

let n = 0;
const wrap = (html) => `<section id="section-t${++n}" class="sc-ilfuVi gTYFeO"><div width="1120px" class="sc-uokuf clgGQj"><div id="row-t${n}" class="sc-ljMPrv lgEYkG"><div size="12" class="sc-fvpurI BEOfd"><div id="rawhtml-t${n}" class="sc-dMOHdm bbzpkN">${html}</div></div></div></div></section>`;

export function testPage(page, { withChat = true } = {}) {
  const s = readFileSync(join(ANYAGOK, 'elo-fooldal-2026-09-25-2220.html'), 'utf8');
  const mainOpen = s.indexOf('>', s.indexOf('<main')) + 1;
  const mainClose = s.indexOf('</main>');
  const pulse = s.indexOf('cdn.pulse.is');
  const chatStart = s.lastIndexOf('<div id="rawhtml-', pulse);
  const chatEnd = s.indexOf('</script></div>', pulse) + '</script></div>'.length;
  n = 0;
  const content = wrap(readFileSync(join(OUT, `${page}.html`), 'utf8')) + (withChat ? wrap(s.slice(chatStart, chatEnd)) : '');
  return s.slice(0, mainOpen) + `<div id="websitepagebody-test"><div class="sc-bdvwhi rExYR">${content}</div></div>` + s.slice(mainClose);
}

export async function preparePage(ctx, html, page) {
  const map = JSON.parse(readFileSync(join(ANYAGOK, 'kepek-terkep-offline-teszthez.json'), 'utf8'));
  const log = { requests: [] };
  await ctx.route('**/*', (r) => {
    const u = r.request().url();
    if (u === `${SITE}/${page}`) return r.fulfill({ contentType: 'text/html; charset=utf-8', body: html });
    if (map[u] && existsSync(join(ANYAGOK, map[u]))) {
      log.requests.push(u);
      const f = map[u];
      const type = f.endsWith('.webp') ? 'image/webp' : f.endsWith('.png') ? 'image/png' : 'image/jpeg';
      return r.fulfill({ contentType: type, body: readFileSync(join(ANYAGOK, f)) });
    }
    if (/zohobookings|jimmy-klima\.systeme\.io\/./.test(u) || u === `${SITE}/`) return r.fulfill({ contentType: 'text/html; charset=utf-8', body: '<title>cel</title>cel' });
    return r.abort();
  });
  return log;
}
