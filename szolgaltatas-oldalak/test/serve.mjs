// Helyi szerver a Lighthouse-méréshez: node test/serve.mjs [oldal] [port]
// A tesztoldalt (régi fejléc és lábléc + a két blokk) szolgálja ki; a CDN-képeket a helyi
// másolatokra írja át, a Systeme.io külső (itt elérhetetlen) CSS/JS hivatkozásait elhagyja.
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { testPage, ANYAGOK } from './page.mjs';

const page = process.argv[2] || 'klimaszereles';
const port = Number(process.argv[3] || 8091);
const map = JSON.parse(readFileSync(join(ANYAGOK, 'kepek-terkep-offline-teszthez.json'), 'utf8'));
let html = testPage(page);
for (const [u, f] of Object.entries(map)) html = html.split(u).join('/' + f);
html = html.replace(/<link[^>]+href="https:\/\/[^"]+"[^>]*>/g, '').replace(/<script[^>]+src="https:\/\/[^"]+"[^>]*><\/script>/g, '');
createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  if (url === '/') { res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); return res.end(html); }
  try {
    const body = readFileSync(join(ANYAGOK, url));
    const type = url.endsWith('.webp') ? 'image/webp' : url.endsWith('.png') ? 'image/png' : 'image/jpeg';
    res.writeHead(200, { 'content-type': type, 'cache-control': 'max-age=3600' });
    res.end(body);
  } catch { res.writeHead(404); res.end(); }
}).listen(port, () => console.log(`http://localhost:${port}/`));
