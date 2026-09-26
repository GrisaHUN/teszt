// Helyi szerver a Lighthouse-méréshez: node test/serve.mjs [port]
// A tesztoldalt szolgálja ki; a CDN-képeket a helyi másolatokra írja át,
// a Systeme.io külső (itt elérhetetlen) CSS/JS hivatkozásait elhagyja.
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { testPage, ANYAGOK } from './page.mjs';

const port = Number(process.argv[2] || 8090);
const map = JSON.parse(readFileSync(join(ANYAGOK, 'kepek-terkep-offline-teszthez.json'), 'utf8'));
import { blocks } from './page.mjs';
const lean = process.argv.includes('--lean');
let html = lean
  ? `<!doctype html><html lang="hu"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Jimmy Klíma</title><meta name="description" content="teszt"><style>body{margin:0;background:#F2F2F3;font-family:system-ui,sans-serif}header,footer{background:#0E1C43;color:#fff;padding:24px 16px}.w{max-width:1120px;margin:0 auto}</style></head><body><header><div class="w">Jimmy Klíma</div></header><main>${blocks().map((b) => `<div class="w">${b}</div>`).join('')}</main><footer><div class="w">Lábléc</div></footer></body></html>`
  : testPage();
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
