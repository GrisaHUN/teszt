// Gyors képernyőképek: node test/shots.mjs [oldal] [szélesség ...]
import { join } from 'node:path';
import { mkdirSync } from 'node:fs';
import { playwright, testPage, preparePage, SITE } from './page.mjs';
const [page = 'klimaszereles', ...ws] = process.argv.slice(2);
const widths = ws.length ? ws.map(Number) : [390, 1440];
const out = join(import.meta.dirname, 'out');
mkdirSync(out, { recursive: true });
const b = await playwright.chromium.launch();
for (const w of widths) {
  const ctx = await b.newContext({ viewport: { width: w, height: w <= 800 ? 844 : 900 }, isMobile: w <= 800, hasTouch: w <= 800 });
  await preparePage(ctx, testPage(page), page);
  const p = await ctx.newPage();
  p.on('pageerror', (e) => console.log('HIBA', e.message));
  await p.goto(`${SITE}/${page}`);
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 400) { await p.evaluate((yy) => scrollTo(0, yy), y); await p.waitForTimeout(60); }
  await p.waitForTimeout(1300);
  await p.evaluate(() => scrollTo(0, 0));
  await p.waitForTimeout(300);
  await p.screenshot({ path: join(out, `${page}-${w}-full.png`), fullPage: true });
  const vh = w <= 800 ? 844 : 900;
  for (let i = 0, y = 0; y < H; i++, y += vh) await p.screenshot({ path: join(out, `${page}-${w}-${String(i).padStart(2, '0')}.png`), fullPage: true, clip: { x: 0, y, width: w, height: Math.min(vh, H - y) } });
  console.log(w, 'magasság', H);
  await ctx.close();
}
await b.close();
