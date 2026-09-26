# Jimmy Klíma főoldal: egyetlen reszponzív kód (`jkh-`)

A kész fájlok a `dist/` mappában vannak. **Ugyanaz a kód** fut telefonon, tableten és desktopon. A mobil és a desktop már nem külön blokk.

## Beillesztés sorrendje

A fejléc után, fentről lefelé, négy Raw HTML elem:

| # | Fájl | Tartalom | Méret |
|---|---|---|---|
| 1 | `fooldal-1-hero-szolgaltatasok-cta.html` | Hero, Szolgáltatásaink, CTA-sáv | 57,9 KB |
| 2 | `fooldal-2-miert-galeria-rolunk.html` | Miért minket válasszon?, referencia-galéria (nagyítással), Rólunk | 29,4 KB |
| 3 | `fooldal-3-lepesek-velemenyek-futes-keszulekek.html` | Klíma vásárlás menete, Ügyfeleink mondták, CTA-sáv, Fűtés klímával, Forgalmazott készülékek sáv | 34,5 KB |
| 4 | `fooldal-4-markak.html` | Márka-futószalag (7 logó, beágyazva), hullám a láblécbe | 67,5 KB |

A chat-gomb blokkja külön marad, ahhoz nem kell nyúlni. A jobb alsó sarok szabad.

## Mit kell beállítani (David)

1. **Láthatóság:** mind a 4 elem és a szekciójuk is **Desktop + Mobile** (ez a reszponzív főoldal).
2. **A régi blokkok:** a korábbi `jkm-` (mobil) és `jk-` (desktop) blokkok ne legyenek a főoldalon egyszerre az újakkal. Az új kód egyiket sem használja, de dupla tartalom lenne.
3. **Szekció/sor térköz:** ha lehet, a 4 szekció és soruk felső és alsó térköze legyen 0. Nem kötelező, mert a blokkok maguk is kitöltik a rést a saját színükkel (lásd lent), de így a legtisztább.

## Fejléc, lábléc, átmenetek

- Minden szekcióváltás **hullámos**, a mobil főoldal két hullámformájával felváltva. Hullám vezet a heróból a szürke szolgáltatásokba, a láblécbe is (navy `#0E1C43`), a fűtés szekcióból pedig a készülékek-fotóba.
- **Hézagtöltés:** a Systeme.io minden Raw HTML elem köré 5–10 px sor-margót tesz, a tároló háttere `#F2F2F3`. Ebből jött a lábléc fölötti vékony csík. Minden blokk megméri a rést a következő blokkig vagy a láblécig, és a saját záró színével tölti ki. Az első blokk ugyanígy tölti ki a fejléc alatti rést navy színnel. A tesztoldalon, a törlés előtti oldal valódi Systeme-szerkezetében, sehol nem maradt csík.

## Ikon-animáció

- **Szolgáltatás-kártyák (David kérése, 2026-09-26):** a kártya bármely pontjára vitt egér elindítja a jelvény animációját. A jelvény 1,2×-re nő, és a keretéről kifelé fut a lime gyűrű. A kártyán belül az ikonra mozdulva nem indul újra, kilépéskor visszaáll. A jelvény körül több a hely, hogy a nagyítás ne érjen a címhez.
- **Miért minket, lépések:** az animáció az ikonra vitt egérre indul (1,15×).
- **Érintés:** mindenhol az ikon érintésére fut, egyszer.

## Linkek

- **3× „Ingyenes árajánlat kérése”** (hero, 2 CTA-sáv): `https://growthnestg.zohobookings.eu/254300000000290002/#/254300000000290002?booknow=true`, új lapon, `rel="noopener"`. A prompt szerint.
  - A szolgáltatás-oldalakon David kérésére a rövid `…/254300000000290002` link van. A kettő ugyanazt az oldalt nyitja.
  - Ha a főoldalon is a rövid kell: `build.mjs`, `ZOHO` változó, majd `node build.mjs`.
- **4 szolgáltatás-kártya:** a kártya teljes felülete link (`/klimaszereles`, `/klimatisztitas`, `/szelloztetes`, `/villanyszereles`).
- **„Hűtő-Fűtő Klímák”:** `/keszulekek`.
- **Szöveges belső linkek** (a szöveg változatlan): Rólunk: „szerelünk”, „tisztítunk”, „villanyszereléssel”. Lépések: „klímavásárlás”, „karbantartás”.

## Képek

| Hova | Forrás |
|---|---|
| Hero, desktop | `profi-klimaszereles-szegeden-hero.jpg` (CDN, `fetchpriority="high"`) |
| Hero, telefon (`<picture>`, ≤800 px) | **`JKH_HERO_MOBIL_URL` üres**, ezért most base64 (27 KB). Ha megvan a CDN-cím, `build.mjs`-ben add meg, és futtasd a buildet: a blokk 37 KB-tal kisebb lesz. |
| Fűtés | `futes-klimaval-csalad-otthon.jpeg` (CDN, eredeti) |
| Készülékek sáv | `…-hatter-bal.webp` + `…-hatter-jobb.webp`, 8 px átfedéssel, maszkolt varrattal, 1920 px-nél megáll. **Mobilon nem jelenik meg és nem is töltődik le**: ott a mobil főoldal fehér, cím + gomb változata van. |
| Galéria | a 13 régi CDN-link, a mobil blokk leíró alt szövegeivel |
| Logók | base64 WebP (7 db) |
| Ikonok | inline SVG |

Minden képnek van `alt`, `width` és `height` attribútuma. A hero `eager` betöltésű, minden más `lazy`.

## Szövegek

Szó szerint a forrásból. Ahol a desktop és a mobil forrás eltért, a mobil (David által jóváhagyott) változat szerepel. Ezek a szándékos tipográfiai javítások:
- „szennyezettségtől függően**,** teljes szétszedéssel…”
- „kivitelezése A-Z-ig.” egy sorban
- a mottó idézőjelei és vesszője: „Csináld úgy, mintha magadnak csinálnád!” (a „Mottónk:” felirattal)
- nagykötőjel (–) a címekben: „Fűtés klímával – megéri?”, „H tarifa – klímás fűtésre”
- „kedvezményes **árú** H tarifa”
- a vélemények címe mindenhol „Ügyfeleink mondták”

**Nem jóváhagyott állítások** (Matt jogi felülvizsgálata alatt, hűen visszaállítva):
- „akár háromszor-négyszer olcsóbb lehet a piaci áras gázfűtéshez képest”
- „100 000 Ft+ megtakarítható havonta”
- „Energiatakarékos hőszivattyús működés”
- „–25 °C-ig megbízható működés télen”
- „~23 Ft/kWh”
- a szolgáltatás-kártyán a „fertőtlenítéssel” szó

## Ellenőrzés (2026-09-26, helyi teszt)

A teszt a törlés előtti főoldal valódi fejlécével és láblécével, a Systeme.io saját szekció-szerkezetében, helyi képmásolatokkal futott.
- `node build.mjs`: méret, előtag, komment, JSON-LD, linkek, képattribútumok, egy H1, duplikált ID.
- `node test/check.mjs`: **86/86 rendben**. 14 szélesség (320–2560 px): nincs csúszás, nincs duplikált ID, nincs konzolhiba, minden felfedés lefut, nincs 250 px-nél keskenyebb kártya. Ezen felül: linkek és kattintások, körhinták, lightbox, futószalag, parallax, pulzálás, ikon-animáció, érintés, reduced-motion, lazy loading, nyers HTML.
- **Lighthouse:**

| Mérés | Teljesítmény | Akadálymentesség | SEO | LCP | CLS |
|---|---|---|---|---|---|
| Csak a blokkok, egyszerű fejléc-lábléc, mobil | 99 | 100 | 100 | 1,6 s | 0 |
| Csak a blokkok, desktop | 100 | 100 | 100 | 0,5 s | 0 |
| Régi Systeme-oldalkeretben, mobil | 77 | 94 | 100 | 3,9 s | 0 |
| Régi Systeme-oldalkeretben, desktop | 97 | 94 | 100 | 1,0 s | 0,002 |

A keretben mért mobil LCP-t a törlés előtti oldal 629 KB-os HTML-je okozza: a fejléc beágyazott stílusai és a régi blokkok, lassított hálózaton 3,8 s csak a letöltés. A 94-es akadálymentesség is a régi fejlécből jön. Élesben, a régi blokkok nélkül, a keret sokkal kisebb lesz.

Az ikon-animáció képkockái a `test/out/ikon-kepkockak.png` fájlban vannak (a teszt futtatásakor készülnek).

## Önértékelés (95%-os kapu)

| # | Ellenőrzés | Krit. | Eredmény |
|---|---|---|---|
| 1 | Szövegek szó szerint | igen | **Megfelelt**: forrásszöveg, csak a fent felsorolt szándékos tipográfiai javítások. |
| 2 | 3 Zoho gomb, pontos link, új lap | igen | **Megfelelt**: a teszt ellenőrzi, a hero-gomb a Zohót nyitja új lapon. |
| 3 | 4 szolgáltatás-kártya egésze kattintható | igen | **Megfelelt**: a kártya szélére kattintva is a jó oldalra visz (4/4). |
| 4 | „Hűtő-Fűtő Klímák” → `/keszulekek` | igen | **Megfelelt**: kattintási teszt. |
| 5 | Nincs vízszintes csúszás 320–2560 px | igen | **Megfelelt**: 14/14 szélesség. |
| 6 | Nincs duplikált ID, konzolhiba | igen | **Megfelelt**: 14/14 szélesség. |
| 7 | Mobil kinézet a `mobil-vegleges/` szerint | nem | **Megfelelt**: ugyanaz a hero, kártyák, lépésvonal, galéria, futószalag. Eltérés: a CTA navy sáv, a mottó „Mottónk:” felirattal. |
| 8 | Desktop a referenciaképek szerint, javítva | nem | **Megfelelt**: azonos elrendezés és színek (lime Miért minket és fűtés, navy lépések ívekkel, fotós készülékek-sáv); rendszerfont, kártyák, hover- és fókusz-állapotok. |
| 9 | Tablet rendezett | nem | **Megfelelt**: 2 oszlopos kártyák és lépések, galéria és vélemények 2-esével. |
| 10 | 1920/2560: nincs megnyúlt fotó | nem | **Megfelelt**: tartalom 1120 px, a sáv 1920 px-nél megáll, `object-fit: cover`. |
| 11 | Hero parallax és pulzálás | nem | **Megfelelt**: a mobil kód, a hero magasságával arányosítva. |
| 12 | Ikon: egér-zoom egyszer, hullám a keret széléről | igen | **Megfelelt**: 1,15× (a szolgáltatás-kártyákon 1,2×), két üres gyűrű `inset: 0`-ról, egyszer fut. Képkockák mellékelve. |
| 13 | Érintésre ugyanaz, nem kétszer | nem | **Megfelelt**: teszt szerint 2 gyűrű-animáció érintésenként (1 futás). |
| 14 | Körhinták (pötty, nyíl, húzás, billentyű) | nem | **Megfelelt**: mind tesztelve. |
| 15 | Lightbox (nyit, zár, Esc, háttér, fókusz) | nem | **Megfelelt**: fókusz a bezárásra, majd vissza a képre. |
| 16 | `prefers-reduced-motion` | nem | **Megfelelt**: minden azonnal látszik, nincs gyűrű, parallax, pulzálás, futószalag. |
| 17 | Egy H1, cím-hierarchia, alt/width/height | nem | **Megfelelt**: build- és tesztellenőrzés. |
| 18 | Lazy loading, nem rontja az animációt | nem | **Megfelelt**: az első képernyő ~96 KB, a rejtett sáv sosem töltődik; a felfedés nem vár képre. |
| 19 | Lighthouse | nem | **Megfelelt**: a blokkok 99–100 / 100 / 100, LCP 0,5–1,6 s, CLS 0. |
| 20 | ≤70 KB, előtag, nincs komment, nincs JSON-LD | nem | **Megfelelt**: build-ellenőrzés. |

**20/20.** Első kör után javítottam:
- a Systeme-margó miatti szürke csíkok eltüntetése (hézagtöltés `z-index`-szel);
- a CTA-sáv széleinek egyszínűsítése, hogy a hullám ne hagyjon vonalat;
- a körhinta képen kívüli kártyáinak csoportos felfedése;
- 320 px-en a kártya minimális szélessége 260 px;
- a 4. blokk 70 KB alá vitele (a sáv átkerült a 3. blokkba);
- a lépés-ívek arányos rajzolása.

## Nyitott pontok

- `JKH_HERO_MOBIL_URL` (az álló mobil hero CDN-címe).
- Zoho-link egységesítése (booknow vagy rövid).
- A jogi pontok (Matt).
- **Élő ellenőrzés** beillesztés után: az élő oldalt innen nem érem el.

## Forrás

- `src/_base.css`: közös stílus.
- `src/js/*.js`: core (felfedés, ikon, hézagtöltés), carousel, parallax, lightbox.
- `src/bN-*.html`: blokkok.
- `build.mjs`: összeállítás és ellenőrzés.
- `test/`: `check.mjs` (teljes teszt), `shots.mjs` (képernyőképek), `serve.mjs` (Lighthouse-hoz).

A tesztekhez a csomag `anyagok/` mappája kell: `JKH_ANYAGOK=/út/anyagok node test/check.mjs`.
