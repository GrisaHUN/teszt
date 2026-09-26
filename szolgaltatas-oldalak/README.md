# Szolgáltatás-oldalak (oldalanként egy reszponzív Raw HTML blokk)

- `node build.mjs [oldal]`: elkészíti a `kimenet/aloldalak/<oldal>.html` fájlt, és ellenőrzi a szabályokat.
- `node test/check.mjs [oldal]`: teljes Playwright-ellenőrzés a régi fejléc és lábléc között (a képek helyi másolata: `JKS_ANYAGOK` környezeti változó, alapból a csomag `anyagok/` mappája).
- `node test/shots.mjs [oldal] [szélesség ...]`: képernyőképek a `test/out/` mappába.
- `node test/serve.mjs [oldal] [port]`: helyi szerver a Lighthouse-méréshez.

Szöveg: `src/tartalom/<oldal>.mjs`. Elrendezés: `src/oldalak/<oldal>.mjs`, stílus: `src/oldal.css` (mobil-first, desktop 801 px-től). Beillesztés: `kimenet/aloldalak/BEILLESZTES.md`.
