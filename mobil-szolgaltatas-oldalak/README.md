# Jimmy Klíma – szolgáltatás-oldalak mobil verziója

Mobile-only Raw HTML blokkok a négy szolgáltatás-oldalhoz. **Beillesztésre kész fájlok: `dist/`.**

| Oldal | Fájl(ok) a `dist/` mappában | Előtag | Méret most | Beágyazott hero-képpel |
|---|---|---|---|---|
| Klímaszerelés (`/klimaszereles`) | `mobil-klimaszereles.html` | `jkm-ksz-` | 15,8 KB | ~37 KB |
| Klímatisztítás (`/klimatisztitas`) | `mobil-klimatisztitas.html` | `jkm-kt-` | 23,5 KB | ~58 KB |
| Szellőztetés (`/szelloztetes`) | `mobil-szelloztetes.html` | `jkm-sz-` | 14,9 KB | ~54 KB |
| Villanyszerelés (`/villanyszereles`) | `mobil-villanyszereles-1.html` (hero), `mobil-villanyszereles-2.html` (a többi) | `jkm-vsz-` | 7,2 + 11,2 KB | ~64 + 11 KB |

A villanyszerelés két blokkra bomlik, mert az 57 KB-os hero-képpel egy blokkban 70 KB fölé menne. A két blokk sorrendben, egymás alá kerül.

## Beillesztés

1. Az oldal mobil vásznán Raw HTML elem, a fájl teljes tartalmával (villanyszerelésnél két elem, sorrendben).
2. Az elem ÉS a szekciója is **csak Mobile** láthatóságú (két szinten).
3. Utána élő ellenőrzés: desktop és mobil (390 és 360 px) oldalmagasság, duplikált ID, vízszintes csúszás, konzolhiba, és hogy a desktop oldal nem változott.

## (a) „Ingyenes árajánlat kérése” gombok (klímaszerelés, szellőztetés, villanyszerelés)

Beépítve: **a Zoho foglalási linkre mutatnak** (`target="_blank" rel="noopener"`), ugyanúgy, mint az általam készített mobil főoldal gombjai. Váltás egy helyen, a script első soraiban:

```js
var AJANLAT_MOD = 'link';   // 'popup' esetén az oldal Systeme.io popup-gombját nyomja meg
```

`'popup'` módban a gomb a `[data-test-id="show-popup-button"]` elemet kattintja meg. Ha az oldalon nincs ilyen, marad a Zoho link, így a gomb sosem némul el.

A klímatisztítás gombja „Időpont foglalása”, ez mindig a foglalási link.

## (b) Eltérés az élő oldal szövegétől

Csak a prompt 4. pontjában jelölt kivételek:
- **Klímatisztítás:** a „Miért kell tisztítani a klímánkat?” blokk a jóváhagyott szöveggel, a gyakoriság-mondat javított helyesírással, a garancia-szöveg a gyakoriság után (külön a módszer leírásától), `Ár: 14 999 Ft`.
- **Klímaszerelés:** `Klímaszerelés/telepítés ára: 99 999 Ft bruttó`.

Minden más szöveg szó szerint egyezik a prompttal. Ezt gépi ellenőrzés is megerősítette: 64 szövegrészből 64 megtalálható.

Tipográfiai megoldások, a szöveg változtatása nélkül:
- Az árak címkére és kiemelt összegre vannak bontva.
- A klímatisztítás szezon-kártyáin a hónapok félkövérek.

Új szöveg nem került az oldalakra. Új elemként egy **lebegő gomb** jelent meg a bal alsó sarokban, a fő gomb feliratával. Ez csak a hero után látszik, és eltűnik, amikor a záró gombsor képernyőre ér. A jobb alsó chat-sarok szabad marad (a teszt ellenőrzi).

## (c) Hero-képek: még nincsenek beágyazva

A `kepek/*.webp` fájlok nem voltak elérhetők a fejlesztői környezetben, a Systeme.io CDN-t pedig a hálózati szabály tiltotta. Ezért a hero most a Systeme.io saját CDN-jén lévő eredeti képre hivatkozik (ez a szabály szerint engedélyezett).

Beágyazás: a négy WebP-t tedd az `assets/` mappába ugyanezzel a névvel, majd futtasd a buildet:

```
assets/hero-klimaszereles.webp
assets/hero-klimatisztitas.webp
assets/hero-szelloztetes.webp
assets/hero-villanyszereles.webp
```

A build ekkor automatikusan base64-ként ágyazza be őket, és ellenőrzi a 70 KB-os keretet.

## Tesztelés

```
node build.mjs         # dist/ előállítása + szabályellenőrzés
node test/check.mjs    # Playwright: 390x844, 360x800, 1280x900, mindkét DOM-sorrend, reduced-motion
```

A build ellenőrzi:
- a méretet (a várható beágyazott mérettel együtt);
- hogy nincs `jk-` név és nincs másik oldal előtagja;
- hogy nincs előtag nélküli ID vagy osztály, sem duplikált ID;
- hogy nincs HTML-komment, gondolatjel, „fertőtlenítés” szó, külső kép vagy váratlan link.

A teszt egy Systeme-szerű mintaoldalon, egy `jk-` nevű asztali blokk és egy popup-gomb mellett mér. Eredmény (2026-09-25): 28/28 mérés rendben.
- 0 vízszintes csúszás, 0 duplikált ID, 0 konzolhiba.
- Minden animált elem megjelenik.
- Az asztali minta animációja 3/3, a mobil tartalom desktopon rejtve.
- A CTA új lapon nyitja a Zohót, és nem nyomja meg a popupot.
- A lebegő gomb nem lóg a chat-sarokba, és 44 px alatti érintési cél nincs.

## (d) Nyitott kérdések

- „Ingyenes árajánlat kérése”: foglalási link (most) vagy popup (David).
- Klímaszerelés: mit tartalmaz a 99 999 Ft bruttó ár (Imre). Csere: `src/klimaszereles.html`, `price-value`.
- Klímatisztítás: a 14 999 Ft egy készülékre vonatkozik-e (Imre). Csere: `src/klimatisztitas.html`, `price-value`.
- Szellőztetés: az „1,5-2 millió forint” és a „85-90%” marad-e (Matt).
- A lebegő gomb maradjon-e (David).
- A hero-képek beágyazása (lásd fent), utána élő ellenőrzés.

## Forrás felépítése

- `src/_base.css`, `src/_base.js`: közös stílus és script (`__P__` = oldal-előtag, `__R__` = blokk gyökér-ID).
- `src/<oldal>.html`: `@@CONFIG`, `@@HTML` (a `{{SPLIT}}` sor új blokkot kezd), `@@CSS`, `@@JS`.
- A build oldalanként kiszűri a nem használt CSS-szabályokat, az ikonokat pedig egyszer, SVG-szimbólumként teszi be.
