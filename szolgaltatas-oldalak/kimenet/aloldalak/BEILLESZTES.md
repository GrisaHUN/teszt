# Szolgáltatás-oldalak: beillesztés (mind a négy oldal)

**David döntése (2026-09-26):** a főoldalhoz hasonlóan oldalanként **egyetlen reszponzív blokk** készül (mobilon és desktopon ugyanaz a kód, 800/801 px-es töréspont), nem külön desktop és mobil blokk. A korábbi `desktop-…` és `mobil-…` fájlok törölve.

| Oldal | URL | Fájl | Előtag | Méret |
|---|---|---|---|---|
| Klímaszerelés | `/klimaszereles` | `klimaszereles.html` | `jks-ksz-` | 41,4 KB |
| Klímatisztítás | `/klimatisztitas` | `klimatisztitas.html` | `jks-kt-` | 60,5 KB |
| Villanyszerelés | `/villanyszereles` | `villanyszereles.html` | `jks-vsz-` | 37,6 KB |
| Hővisszanyerős szellőztetés | `/szelloztetes` | `szelloztetes.html` | `jks-sz-` | 39,3 KB |

## Beillesztés (minden oldalon ugyanígy)

1. Egy szekció, benne egy **Raw HTML** elem, **minden eszközön** látható (nincs eszköz-szűrés).
2. A fájl teljes tartalmát kell bemásolni (a `<style>`-tól a végén lévő JSON-LD `</script>`-ig).
3. Ha az oldalon a régi (két blokkos vagy csak mobilos) kód már fent van, azokat a szekciókat töröld, és ezt az egyet tedd a helyükre.
4. A fejléchez, a lábléchez és a chat-gombhoz nem kell nyúlni.
   - A blokk a Systeme sor- és szekciómargóit maga tölti ki a fejléc és a lábléc felé (navy), így nem marad köztük csík.
   - Ha lehet, a szekció belső margója (padding) legyen 0.
5. **Hero:** a cím és a gombok animáció nélkül, azonnal látszanak (gyorsabb mobil LCP). A hero-kép `<picture>`: mobilon a kis WebP, desktopon az eredeti JPEG töltődik, mindig csak az egyik.

## Egy helyen cserélhető elemek

- **Foglalási link:** a kész fájlban a gyökér-elem `data-jks-…-foglalas` attribútuma (pl. `data-jks-kt-foglalas`). Ha ezt átírod, a script minden gombot erre állít át. A gombok `href`-je is ez a link: ez a JavaScript nélküli tartalék.
  - Jelenlegi érték (a rövid link, David döntése): `https://growthnestg.zohobookings.eu/254300000000290002`.
  - Nincs popup: minden „Ingyenes árajánlat kérése” és „Időpont foglalása” gomb új lapon nyitja a foglalást.
- **Ár-sorok:** a forrásban az `AR_SOR` változó.
  - Klímaszerelés (`src/tartalom/klimaszereles.mjs`): `Klímaszerelés/telepítés ára: Br.: 99 999 Ft`.
  - Klímatisztítás (`src/tartalom/klimatisztitas.mjs`): `Ár: Br.: 14 999 Ft` (mellette nincs „készülékenként” vagy hasonló).
- **A „Forgalmazott készülékek” cél-URL-je:** `KESZULEKEK` a `build.mjs`-ben, jelenleg `/keszulekek`.
- **Források:**
  - szöveg: `src/tartalom/<oldal>.mjs`;
  - elrendezés: `src/oldalak/<oldal>.mjs` (közös részek: `src/oldalak/_reszek.mjs`);
  - stílus: `src/oldal.css` (mobil az alap, desktop 801 px-től), oldalankénti kiegészítés: `src/oldalak/<oldal>.css`.

## Oldalanként

### Klímaszerelés

- **Hero:** fotós, sötétkék fátyollal, a cím és a gombok jobbra.
- **Bevezető:** két oszlopban.
- **Telepítés folyamata:** 6 lépés kártyákon (mobilon idővonal).
- **Ár-rész:** az ár sticky navy kiemelésben, a fő gombbal és a telefonnal. Mellette:
  - a márkák a saját márka-oldalukra linkelnek;
  - a „Forgalmazott készülékek” gomb;
  - „Kapcsolódó oldal: Klímatisztítás”.
- **GYIK:** 5 kérdés.

### Klímatisztítás

- **Hero:** fotós, a klímaszereléssel azonos elrendezés. A fő gomb: **„Időpont foglalása”**.
- **„Miért kell tisztítani a klímánkat?”:** a Matt által jóváhagyott, egészségügyi állítás nélküli szöveg. Mellette a módszer (Deep Clean) navy kiemelésben.
- **„Teljeskörű tisztítást végzünk!”:** 4 ikonos kártya.
- **13 referencia-fotó, filmszalag-galéria:** ugyanúgy működik, mint a főoldalé.
  - Magától, lassan gördül; egérre, érintésre vagy fókuszra megáll, utána folytatja.
  - Desktopon nyilakkal, egérhúzással és billentyűvel lapozható, mobilon pöttyökkel és húzással.
  - Kattintásra nagyítás (lightbox): bezárás gombbal, Esc-szel és háttérre kattintással, lapozható.
  - A fotók lazy-k. Mind a 13 kép saját, leíró alt-szöveget kapott a fotón látható tartalom alapján (márka, típus, település, év nélkül).
- **Időszak:** két szezon-kártya (hűtési és fűtési szezon előtt). Alatta a gyakoriság, a jóváhagyott jótállás-szöveg és a „Kapcsolódó oldal: Klímaszerelés”. Mellette az ár sticky navy kiemelésben.
- **GYIK:** 5 kérdés.

### Villanyszerelés

- **Hero:** osztott elrendezés, a szöveg balra navy háttéren, a fotó jobbra. Mobilon a fotó felül, kissé levágva.
- **Bevezető:** kiemelt kártya.
- **„Mit tartalmaz szolgáltatásunk ?”:** 4 ikonos kártya.
- **Ár:** a szöveg mellett desktopon oldalsó kiemelés a fő gombbal és a telefonnal; „Kapcsolódó oldal: Főoldal”.
- **GYIK:** 4 kérdés.
  - A sürgős hibaelhárítás válasza alatt telefon-gomb (az élő oldalon is ott volt).
  - A **112-es biztonsági sor** piros keretes, figyelmeztető ikonnal, jól látható. A `112` és a telefonszám kattintható.
- **Telefon:** a hero-ban, a GYIK mellett, a sürgős kérdésnél és a záró sávban is elöl van.

### Hővisszanyerős szellőztetés

- **Hero:** világos. A fehér hátterű illusztráció jobbra, a cím sötétkék, nem fehér.
- **Működés és probléma:** a működés-bekezdés mellett a „problémát okoz” rész kiemelt kártyán.
- **Kivitelezés:** a „Kivitelezést vállalunk…” mondat, alatta 3 lépés ikonos kártyákon.
- **Kivitelezés költsége:** mellette desktopon oldalsó kiemelés a gombokkal; „Kapcsolódó oldal: Főoldal”.
- **GYIK:** 5 kérdés.

Minden oldalon:

- záró gombsor, hullámos szekcióátmenetek;
- mobilon lebegő fő gomb a bal alsó sarokban. A hero után jelenik meg, a záró gombsornál eltűnik, és a lábléc fölött sem jön vissza. A chat-gomb helye szabad.

## Eltérések az élő szövegtől

- **Klímatisztítás:** a jogi kivételek, a prompt szerint:
  - a „Miért kell tisztítani” rész a Matt által jóváhagyott szöveg;
  - nincs „fertőtlenítés”, egészségügyi állítás, „fekete penészgomba” és „Gyártók többsége…” mondat;
  - a gyakoriság-mondat helyesírása javítva;
  - az ár formátuma `Br.: 14 999 Ft`.
- **A többi oldal:** a szöveg szó szerint az élő oldalé. A villanyszerelés alcíme az élő írásmóddal maradt: „Mit tartalmaz szolgáltatásunk ?” (szóközzel a kérdőjel előtt).
- **Új, kitehető elemek:**
  - a GYIK-sorok szó szerint Don 3.2 táblázatából;
  - ahol az élő kérdés és Don sora ugyanaz (szellőztetés: meglévő ingatlan; villanyszerelés: sürgős hibaelhárítás), ott az élő szöveg áll, egyszer;
  - a „Kapcsolódó oldal:” link-sorok;
  - a márkanevek linkjei.

## Jóváhagyott, változatlan elemek (David, 2026-09-26: „Mehet úgy, ahogyan eredetileg volt.”)

- **Szellőztetés:** a „85-90%” hatásfok és az „1,5-2 millió forint” becslés jóváhagyva, az élő szöveg szerint marad.
- **Klímatisztítás:**
  - a „Milyen gyakran” GYIK-válasz az eredeti formában marad, NNGYK-mondat nélkül;
  - az ár-sor `Ár: Br.: 14 999 Ft`, jelölés nélkül.
- **Minden más szöveg is úgy marad, ahogy most a blokkokban van.**

## Véglegesen kihagyva (David döntése, 2026-09-26)

Ezek nem kerülnek az oldalakra, a blokkok így véglegesek:

- **Klímaszerelés:**
  - a „Mit tartalmaz, mitől függ az ár” táblázat;
  - a „Mennyibe kerül”, a „Mit tartalmaz” és a „Mely településeken dolgoznak?” GYIK-kérdés.
- **Klímatisztítás:** hogy mire vonatkozik a 14 999 Ft, nem írjuk ki, és a „Mennyibe kerül?” kérdés sem kerül be.
- **Villanyszerelés:** a „Mely településeken dolgoznak?” kérdés.

## Nyitott kérdések

- **JSON-LD:**
  - Nincs benne `@id` és `url` (a végleges domain még nincs eldöntve).
  - A BreadcrumbList relatív URL-eket használ (`/` és `/<oldal>`). A domain eldöntése után érdemes abszolútra cserélni, és átfuttatni a Rich Results Testen.
- **Referencia-fotók:** az alt-szövegek a fotón láthatót írják le. Ha Imre megadja a márkát, a települést vagy az évet, Don 3.6 képlete szerint pontosíthatók.

## Ellenőrzés (helyi teszt: régi fejléc és lábléc, közöttük a blokk)

- **`node build.mjs`:**
  - méret, előtagok, globális CSS, komment, gondolatjel, „fertőtlenítés”;
  - link-fehérlista (a `tel:112` is), img-attribútumok, egy H1;
  - JSON-LD érvényessége, tiltott és szögletes mezők.
- **`node test/check.mjs <oldal>`:**

  | Oldal | Eredmény |
  |---|---|
  | Klímaszerelés | **104/104** |
  | Klímatisztítás | **112/112** |
  | Villanyszerelés | **100/100** |
  | Szellőztetés | **100/100** |

  - Szélességek:
    - mobil: 320, 360, 390, 430, 768, 800 px;
    - desktop: 801, 820, 1024, 1280, 1366, 1440, 1920, 2560 px.
  - Linkek és kattintások, ikon-animáció képkockákkal, érintés, lebegő gomb, reduced-motion, képletöltés, fejléc- és lábléc-illesztés, nyers HTML, a JSON-LD és a látható GYIK egyezése.
  - Klímatisztításon a galéria: filmszalag, nyíl, billentyű, húzás, pöttyök, nagyítás (Esc, háttér, lapozás, érintés), lazy.
- **Lighthouse** (a régi Systeme-kerettel, helyben):

  | Oldal | Mobil telj. | Mobil LCP | Mobil CLS | Desktop telj. | Desktop LCP | SEO |
  |---|---|---|---|---|---|---|
  | Klímaszerelés | 83 | 3,2 s | 0 | 99 | 0,8 s | 100 |
  | Klímatisztítás | 80 | 3,3 s | 0 | 100 | 0,7 s | 100 |
  | Villanyszerelés | 86 | 3,3 s | 0 | 99 | 0,8 s | 100 |
  | Szellőztetés | 88 | 3,2 s | 0 | 99 | 0,7 s | 100 |

  - Akadálymentesség: 93-94.
  - Az egyetlen hibás tétel a Systeme fejlécének név nélküli menügombja, és a mobil LCP-t is a Systeme oldalkerete lassítja.
  - A blokkok saját része tiszta.

## Önértékelés

| # | Ellenőrzés | Eredmény | Indoklás |
|---|---|---|---|
| 1 | Minden szöveg szó szerint egyezik a forrással | megfelelt | Soronként az élő szövegből és Don 3.2 táblázatából; eltérés csak a jogi kivételeknél. |
| 2 | Nincs „fertőtlenítés”, egészségügyi állítás, kitalált szám, ár, jótállás | megfelelt | A build tiltja a szót; az NNGYK-mondat kimaradt; csak élő és jóváhagyott szöveg. |
| 3 | Minden Zoho gomb a pontos linkre, új lapon; nincs popup | megfelelt | Minden oldalon legalább 3 gomb, kattintással is ellenőrizve. |
| 4 | Telefon `tel:+36203734991` | megfelelt | Minden telefon-link ez; a villanyszerelésnél a `tel:112` is. |
| 5 | Nincs vízszintes csúszás | megfelelt | 14 szélességen, mind a négy oldalon. |
| 6 | Nincs duplikált azonosító, konzolhiba | megfelelt | Teszt és build. |
| 7 | Saját előtag, nincs globális CSS, nincs komment | megfelelt | `jks-ksz-`, `jks-kt-`, `jks-vsz-`, `jks-sz-`; az egyetlen kivétel a megengedett mobil `html, body` szabály. |
| 8 | Desktopon a desktop, mobilon a mobil elrendezés | megfelelt | Egy kód, 800/801 px-es töréspont; mindig csak az adott eszköz hero-képe töltődik. |
| 9 | A mobil és a desktop tartalma azonos | megfelelt | Egy kód, a szöveg egyszer van az oldalon. |
| 10 | Mobil kinézet a `mobil-vegleges/` nyelvén | megfelelt | Az elfogadott mobil szolgáltatás-oldal elemei, hullámai, lebegő gomb. |
| 11 | Desktop más logikájú, kihasználja a nagy képernyőt | megfelelt | Kétoszlopos részek, kártya-rácsok, sticky kiemelések, oldalanként illő hero. |
| 12 | Tablet rendezett, nagy képernyőn nincs megnyúlt fotó | megfelelt | 1100 px alatt kevesebb oszlop (min. 260 px); a fotók 1920 px-nél megállnak; a cím sehol nem lóg a képre. |
| 13 | Ikon-animáció: zoom egyszer, a hullám a keret széléről, érintésre egyszer | megfelelt | 1,15x zoom, `inset: 0` üres gyűrű, 1,0x kezdőkockából; képkockák: `test/out/<oldal>-ikon-*.png`. |
| 14 | Körhinta és lightbox működik, billentyűvel is | megfelelt | Klímatisztítás: nyíl, billentyű, húzás, pöttyök, nagyítás (Esc, háttér, lapozás). |
| 15 | `prefers-reduced-motion` | megfelelt | Minden azonnal látszik, nincs gyűrű és filmszalag. |
| 16 | Egy H1, helyes hierarchia, alt, width, height | megfelelt | H1 → H2 → H3 (GYIK); 13 egyedi, leíró referencia-alt. |
| 17 | Lazy loading működik, és nem rontja az animációkat | megfelelt | A hero eager, `fetchpriority="high"`; a galéria lazy; a felfedés nem függ képtől. |
| 18 | GYIK: csak kitehető sorok, látható | megfelelt | A prompt 7. pontjának sorai, mindig nyitva; a véglegesen kihagyott sorok fent felsorolva. |
| 19 | JSON-LD egyszer, szögletes mezők nélkül | megfelelt | Service, BreadcrumbList, FAQPage egy `@graph`-ban, a blokk végén; a FAQPage szó szerint egyezik a látható GYIK-kal. |
| 20 | Lighthouse: LCP 2,5 s alatt, CLS 0,1 alatt, SEO és akadálymentesség jó, 70 KB alatt | részben | Desktopon minden cél teljesül; mobilon a CLS 0 és a SEO 100, de az LCP 3,2-3,3 s a Systeme-keret miatt. A blokkok 38-61 KB-osak. |

**Összesen: 19/20 megfelelt, minden kritikus sor megfelelt.**

**Javítások a körök során:**

- a klímatisztítás szezon-kártyái teljes szélességű sorba kerültek (a keskeny oszlopban túl sok sorba törtek);
- a szellőztetés világos hero-jában a cím kisebb lett, és a kép a tartalomoszlophoz igazodik (1920 px-en belelógott);
- a lebegő gomb a lábléc fölött nem jelenik meg újra;
- a blokkba csak a használt CSS-szabályok kerülnek (a klímatisztítás 67 KB-ról 60,5 KB-ra csökkent).
