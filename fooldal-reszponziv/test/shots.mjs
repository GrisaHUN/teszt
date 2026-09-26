// Képernyőképek a tesztoldalról: node test/shots.mjs <szélesség> [magasság] [kimeneti előtag] [--full]
// Görget végig az oldalon (hogy a felfedés-animációk lefussanak), majd nézetenként vagy egészben fotóz.
import { join, dirname } from 'node:path';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { playwright, testPage, preparePage } from './page.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const [w = '1440', h = '900', prefix = 'shot'] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const full = process.argv.includes('--full');
const W = Number(w), H = Number(h);
const out = join(here, 'out');
mkdirSync(out, { recursive: true });
const browser = await playwright.chromium.launch();
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1, isMobile: W <= 800, hasTouch: W <= 800 });
await preparePage(ctx, testPage());
const pg = await ctx.newPage();
const errors = [];
pg.on('pageerror', (e) => errors.push(e.message));
await pg.goto('https://jimmy-klima.systeme.io/');
await pg.waitForTimeout(600);
const total = await pg.evaluate(() => document.documentElement.scrollHeight);
let i = 0;
for (let y = 0; y < total; y += H - 100) {
  await pg.evaluate((yy) => window.scrollTo(0, yy), y);
  await pg.waitForTimeout(full ? 250 : 900);
  if (!full) await pg.screenshot({ path: join(out, `${prefix}-${String(i++).padStart(2, '0')}.png`) });
}
if (full) {
  await pg.evaluate(() => window.scrollTo(0, 0));
  await pg.waitForTimeout(500);
  await pg.screenshot({ path: join(out, `${prefix}-full.png`), fullPage: true });
}
console.log(JSON.stringify({ total, shots: i, errors }));
await browser.close();
