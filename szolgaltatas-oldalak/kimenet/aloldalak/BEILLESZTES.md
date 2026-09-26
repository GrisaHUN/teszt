# Szolgáltatás-oldalak: beillesztés (első kör: Klímaszerelés)

Első körben csak a **Klímaszerelés** oldal készült el, hogy ezen beállítsuk a dizájnt. A másik három oldal (Klímatisztítás, Villanyszerelés, Szellőztetés) ugyanerre a sémára épül, a jóváhagyás után.

## Klímaszerelés (`/klimaszereles`)

| Blokk | Fájl | Látszik | Méret |
|---|---|---|---|
| 1 | `klimaszereles.html` | mobilon és desktopon is (egy reszponzív kód, 800/801 px-es töréspont) | 41,0 KB |

**David döntése (2026-09-26):** a főoldalhoz hasonlóan oldalanként **egyetlen reszponzív blokk** készül, nem külön desktop és mobil blokk. A korábbi `desktop-klimaszereles.html` és `mobil-klimaszereles.html` törölve. Ha már be vannak illesztve, azokat a szekciókat töröld, és ezt az egyet tedd a helyükre.

Beillesztés a Systeme.io szerkesztőben:

1. Egy szekció, benne egy **Raw HTML** elem, **minden eszközön** látható (nincs eszköz-szűrés).
2. A fájl teljes tartalmát kell bemásolni (a `<style>`-tól a végén lévő JSON-LD `</script>`-ig).
3. A fejléchez, a lábléchez és a chat-gombhoz nem kell nyúlni.
   - A blokk a Systeme sor- és szekciómargóit maga tölti ki a fejléc és a lábléc felé (navy), így nem marad köztük csík.
   - Ha lehet, a szekció belső margója (padding) legyen 0.
4. **Hero:** a cím és a gombok animáció nélkül, azonnal látszanak (gyorsabb mobil LCP). A hero-kép `<picture>`: mobilon a kis WebP, desktopon az eredeti JPEG töltődik, mindig csak az egyik.

### Egy helyen cserélhető elemek

- **Foglalási link:** a kész fájlban a gyökér-elem `data-jks-ksz-foglalas` attribútuma. Ha ezt átírod, a script minden gombot erre állít át. A gombok `href`-je is ez a link: ez a JavaScript nélküli tartalék.
  - Jelenlegi érték (a rövid link, David döntése): `https://growthnestg.zohobookings.eu/254300000000290002`.
  - Nincs popup: minden „Ingyenes árajánlat kérése” gomb új lapon nyitja a foglalást.
- **Ár-sor:** a forrásban az `AR_SOR` változó (`src/tartalom/klimaszereles.mjs`). Jelenlegi szövege: `Klímaszerelés/telepítés ára: Br.: 99 999 Ft`.
- **A „Forgalmazott készülékek” cél-URL-je:** `KESZULEKEK` a `build.mjs`-ben, jelenleg `/keszulekek`.
- **Szöveg:** `src/tartalom/klimaszereles.mjs`, elrendezés: `src/oldalak/klimaszereles.mjs`, stílus: `src/oldal.css` (mobil az alap, desktop 801 px-től).

### Elrendezés

- **Desktop (801 px-től):**
  - Nagy, fotós hero: a cím és a két gomb jobbra, sötétkék fátylon. A fotó 1920 px-nél megáll, szélesebb képernyőn navy a folytatás.
  - Bevezető két oszlopban.
  - A telepítés 6 lépése kártyákon: 3 oszlop, 1100 px alatt 2.
  - Ár-rész: az ár, a fő gomb és a telefon egy oldalsó, görgetéskor helyben maradó (sticky) navy kiemelésben. Mellette a márkák a saját márka-oldalukra linkelnek, alattuk a „Forgalmazott készülékek” gomb és a „Kapcsolódó oldal: Klímatisztítás” link.
  - GYIK: bal oldalt a cím és a telefon, jobbra az 5 kérdés.
  - Záró gombsor, hullámos szekcióátmenetek.
- **Mobil (800 px-ig):** a már elfogadott mobil szolgáltatás-oldal nyelvén:
  - hero, bevezető;
  - lépések idővonalon;
  - árkártya;
  - márkák, készülékek gomb;
  - GYIK;
  - záró gombsor;
  - lebegő „Ingyenes árajánlat kérése” gomb a bal alsó sarokban, a chat-gomb helye szabad.

## Eltérések az élő szövegtől

- **Nincs jogi kivétel ezen az oldalon:** a szöveg szó szerint az élő oldalé.
- **Ár-sor:** a prompt szerinti `Br.: 99 999 Ft` formátum.
- **Új, kitehető elemek:**
  - a GYIK 4 új kérdése szó szerint Don 3.2 táblázatából;
  - a „Kapcsolódó oldal:” link-sor (csak a link szövege, új állítás nélkül);
  - a márkanevek linkjei a meglévő mondatban.

## Jóváhagyásra váró elemek (nincsenek beépítve)

- **„Mit tartalmaz, mitől függ az ár” táblázat** (Don 3.3): Imre válaszára vár. Helye: az ár-rész, a „A helyszíni felmérés célja…” bekezdés alatt, az árkártya mellett.
- **Kihagyott GYIK-sorok:**
  - „Mennyibe kerül a klímaszerelés?”: a „24 órán belül” és a „fix” Imre és Matt döntésére vár;
  - „Mit tartalmaz a klímaszerelés?”: az árban lévő tételek Imre döntésére várnak;
  - „Mely településeken dolgoznak?”: a települések Imre döntésére várnak.
- **Az ár-sor végleges szövege:** a bruttó vagy végleges ár, fix vagy „-tól” Imre válaszára és Matt szövegére vár. Egy helyen cserélhető.

## Nyitott kérdések

- **Foglalási link:** eldőlt, a rövid link van beépítve (David döntése).
- **JSON-LD:**
  - Nincs benne `@id` és `url` (a végleges domain még nincs eldöntve).
  - A BreadcrumbList relatív URL-eket használ (`/` és `/klimaszereles`), ahogy a prompt kéri. A domain eldöntése után érdemes abszolútra cserélni, és átfuttatni a Rich Results Testen.

## Ellenőrzés (helyi teszt: régi fejléc és lábléc, közöttük a blokk)

- `node build.mjs`: méret, előtagok, globális CSS, komment, gondolatjel, „fertőtlenítés”, link-fehérlista, img-attribútumok, egy H1, JSON-LD érvényessége.
- `node test/check.mjs`: **104/104 rendben.**
  - Szélességek:
    - mobil: 320, 360, 390, 430, 768, 800 px;
    - desktop: 801, 820, 1024, 1280, 1366, 1440, 1920, 2560 px.
  - Linkek és kattintások, ikon-animáció képkockákkal, érintés, lebegő gomb, reduced-motion, képletöltés, fejléc- és lábléc-illesztés, nyers HTML, a JSON-LD és a látható GYIK egyezése.
- **Lighthouse** (a régi Systeme-kerettel, helyben):

  | | Teljesítmény | Akadálymentesség | SEO | LCP | CLS |
  |---|---|---|---|---|---|
  | Desktop | 99 | 93 | 100 | 0,8 s | 0,006 |
  | Mobil | 83 | 93 | 100 | 3,2 s | 0 |

  - A mobil LCP-t a Systeme oldalkerete lassítja: a korábbi mérés szerint a 336 KB-os oldal-HTML feldolgozása adja az LCP nagyobb részét.
  - A fennmaradó akadálymentességi és egyéb hibák (logó méret nélkül, név nélküli menügomb) a Systeme fejlécéből jönnek.
  - A blokk saját része tiszta.

## Önértékelés (első kör)

| # | Ellenőrzés | Eredmény | Indoklás |
|---|---|---|---|
| 1 | Minden szöveg szó szerint egyezik a forrással | megfelelt | Egy forrásból épül; soronként összevetettem a `klimaszereles.txt`-vel, a GYIK Don 3.2 táblázatából való. |
| 2 | Nincs „fertőtlenítés”, egészségügyi állítás, kitalált szám, ár, jótállás | megfelelt | A build tiltja a szót; csak az élő szöveg és a jóváhagyott GYIK-sorok vannak benne. |
| 3 | Minden Zoho gomb a pontos linkre, új lapon; nincs popup | megfelelt | Mobilon és desktopon is legalább 3 gomb; a teszt kattintással is ellenőrzi. |
| 4 | Telefon `tel:+36203734991` | megfelelt | Minden telefon-link ez (teszt). |
| 5 | Nincs vízszintes csúszás | megfelelt | 14 szélességen. |
| 6 | Nincs duplikált azonosító, konzolhiba | megfelelt | Teszt és build. |
| 7 | Saját előtag, nincs globális CSS, nincs komment | megfelelt | `jks-ksz-`; a build szelektoronként ellenőrzi; az egyetlen kivétel a megengedett mobil `html, body` szabály. |
| 8 | Desktopon a desktop, mobilon a mobil elrendezés | megfelelt | Egy kód, 800/801 px-es töréspont; mindig csak az adott eszköz hero-képe töltődik le. |
| 9 | A mobil és a desktop tartalma azonos | megfelelt | Egyetlen kód, a szöveg csak egyszer van az oldalon. |
| 10 | Mobil kinézet a `mobil-vegleges/` nyelvén | megfelelt | A korábban elfogadott mobil szolgáltatás-oldal elemei és hullámai. |
| 11 | Desktop más logikájú, kihasználja a nagy képernyőt | megfelelt | Kétoszlopos részek, lépés-rács, sticky ár-kiemelés, oldalsó GYIK-cím. |
| 12 | Tablet rendezett, nagy képernyőn nincs megnyúlt fotó | megfelelt | 1100 px alatt kevesebb oszlop (min. 260 px); a fotó 1920 px-nél megáll. |
| 13 | Ikon-animáció: zoom egyszer, a hullám a keret széléről, érintésre egyszer | megfelelt | 1,15x zoom, `inset: 0` üres gyűrű; képkockák: `test/out/klimaszereles-ikon-*.png`. |
| 14 | Körhinta és lightbox | megfelelt (nem vonatkozik) | Ezen az oldalon nincs galéria; a klímatisztításnál lesz. |
| 15 | `prefers-reduced-motion` | megfelelt | Minden azonnal látszik, nincs gyűrű (teszt, mobilon és desktopon). |
| 16 | Egy H1, helyes hierarchia, alt, width, height | megfelelt | H1 → H2 (szekciók) → H3 (GYIK); a hero alt: „Klímaszerelés Szegeden”. |
| 17 | Lazy loading, nem rontja az animációt | megfelelt | Csak a hero-kép van az oldalon (eager, `fetchpriority="high"`); a felfedés nem függ képtől. |
| 18 | GYIK: csak kitehető sorok, látható | megfelelt | A prompt 7. pontjának 5 sora, mindig nyitva. |
| 19 | JSON-LD egyszer, szögletes mezők nélkül | megfelelt | Service, BreadcrumbList, FAQPage egy `@graph`-ban, a blokk végén; a build és a teszt ellenőrzi. |
| 20 | Lighthouse: LCP 2,5 s alatt, CLS 0,1 alatt, SEO és akadálymentesség jó, 70 KB alatt | részben | Desktopon minden cél teljesül. Mobilon a CLS 0 és a SEO 100, de az LCP 3,2 s a Systeme-keret miatt (lásd fent). A blokk 41 KB. |

**Összesen: 19/20 megfelelt, minden kritikus sor megfelelt.**

**Második kör javításai:**

- a záró gombsor fénye elcsúszott a hullám alatt, ezért kivettem;
- a mobil GYIK-válasz teljes szélességet kapott;
- mindig csak az adott eszköz hero-képe töltődjön le (`<picture>`);
- 2560 px-en az „INGYENES” címke és az ár ne törjön két sorba.

**Harmadik kör (David kérése):** a két blokk egyetlen reszponzív kódba került (`klimaszereles.html`), a hero szövege animáció nélkül jelenik meg.
