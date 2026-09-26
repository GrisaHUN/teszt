# Szolgáltatás-oldalak (desktop + mobil Raw HTML blokk oldalanként)

- `node build.mjs [oldal]`: elkészíti a `kimenet/aloldalak/desktop-<oldal>.html` és `mobil-<oldal>.html` fájlokat, és ellenőrzi a szabályokat.
- `node test/check.mjs [oldal]`: teljes Playwright-ellenőrzés a régi fejléc és lábléc között (a képek helyi másolata: `JKS_ANYAGOK` környezeti változó, alapból a csomag `anyagok/` mappája).
- `node test/shots.mjs [oldal] [szélesség ...]`: képernyőképek a `test/out/` mappába.
- `node test/serve.mjs [oldal] [port]`: helyi szerver a Lighthouse-méréshez.

Szöveg: `src/tartalom/<oldal>.mjs` (a két blokk közös forrása). Elrendezés: `src/desktop/`, `src/mobil/`. Beillesztés: `kimenet/aloldalak/BEILLESZTES.md`.
