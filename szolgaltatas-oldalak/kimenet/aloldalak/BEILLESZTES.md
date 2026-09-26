# Szolgáltatás-oldalak: beillesztés (első kör: Klímaszerelés)

Első körben csak a **Klímaszerelés** oldal készült el, hogy ezen beállítsuk a dizájnt. A másik három oldal (Klímatisztítás, Villanyszerelés, Szellőztetés) ugyanerre a sémára épül, a jóváhagyás után.

## Klímaszerelés (`/klimaszereles`)

| Blokk | Fájl | Látszik | Méret |
|---|---|---|---|
| 1. | `desktop-klimaszereles.html` | **csak desktopon** (801 px-tól) | 31,2 KB |
| 2. | `mobil-klimaszereles.html` | **csak mobilon** (800 px-ig) | 28,5 KB |

Beillesztés a Systeme.io szerkesztőben:

1. Két külön szekció, mindkettőben egy **Raw HTML** elem. A két szekció egymás alatt van, a sorrend mindegy (mindkét sorrendet teszteltem).
2. Az eszközt **mindkét szinten** be kell állítani:
   - a desktop blokknál a szekció láthatósága és a Raw HTML elem „Item visible on” beállítása is **csak desktop**;
   - a mobil blokknál mindkettő **csak mobil**.
3. A fájl teljes tartalmát kell bemásolni (a `<style>`-tól a záró `</script>`-ig). A mobil fájl végén van a JSON-LD, azt is.
4. A fejléchez, a lábléchez és a chat-gombhoz nem kell nyúlni.
   - A blokk a Systeme sor- és szekciómargóit maga tölti ki a fejléc és a lábléc felé (navy), így nem marad köztük csík.
   - Ha lehet, a két szekció belső margója (padding) legyen 0.

### Egy helyen cserélhető elemek

- **Foglalási link:** a kész fájlban a gyökér-elem `data-jk-ksz-foglalas` (mobilon `data-jkm-ksz-foglalas`) attribútuma. Ha ezt átírod, a script minden gombot erre állít át. A gombok `href`-je is ez a link: ez a JavaScript nélküli tartalék.
  - Jelenlegi érték (a rövid link, David döntése): `https://growthnestg.zohobookings.eu/254300000000290002`.
  - Nincs popup: minden „Ingyenes árajánlat kérése” gomb új lapon nyitja a foglalást.
- **Ár-sor:** a forrásban az `AR_SOR` változó (`src/tartalom/klimaszereles.mjs`). Jelenlegi szövege: `Klímaszerelés/telepítés ára: Br.: 99 999 Ft`.
- **A „Forgalmazott készülékek” cél-URL-je:** `KESZULEKEK` a `build.mjs`-ben, jelenleg `/keszulekek`.
- **A két blokk szövege egyetlen forrásból épül** (`src/tartalom/klimaszereles.mjs`). Ha a szöveg változik, mindkét blokk újraépül, és azonos marad.

### Elrendezés

- **Desktop:**
  - Nagy, fotós hero: a cím és a két gomb jobbra, sötétkék fátylon. A fotó 1920 px-nél megáll, szélesebb képernyőn navy a folytatás.
  - Bevezető két oszlopban.
  - A telepítés 6 lépése kártyákon: 3 oszlop, 1100 px alatt 2.
  - Ár-rész: az ár, a fő gomb és a telefon egy oldalsó, görgetéskor helyben maradó (sticky) navy kiemelésben. Mellette a márkák a saját márka-oldalukra linkelnek, alattuk a „Forgalmazott készülékek” gomb és a „Kapcsolódó oldal: Klímatisztítás” link.
  - GYIK: bal oldalt a cím és a telefon, jobbra az 5 kérdés.
  - Záró gombsor, hullámos szekcióátmenetek.
- **Mobil:** a már elfogadott mobil szolgáltatás-oldal nyelvén:
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

## Ellenőrzés (helyi teszt: régi fejléc és lábléc, a két blokk az igazi 800/801 px-es eszközváltással)

- `node build.mjs`: méret, előtagok, globális CSS, komment, gondolatjel, „fertőtlenítés”, link-fehérlista, img-attribútumok, egy H1, JSON-LD érvényessége.
- `node test/check.mjs`: **130/130 rendben.**
  - Szélességek:
    - mobil: 320, 360, 390, 430, 768, 800 px;
    - desktop: 801, 820, 1024, 1280, 1366, 1440, 1920, 2560 px.
  - Mindkét blokk-sorrendet teszteltem.
  - Linkek és kattintások, ikon-animáció képkockákkal, érintés, lebegő gomb, reduced-motion, képletöltés, fejléc- és lábléc-illesztés, nyers HTML, a JSON-LD és a látható GYIK egyezése.
- **Lighthouse** (a régi Systeme-kerettel, helyben):

  | | Teljesítmény | Akadálymentesség | SEO | LCP | CLS |
  |---|---|---|---|---|---|
  | Desktop | 100 | 93 | 100 | 0,7 s | 0,006 |
  | Mobil | 83 | 94 | 100 | 3,5 s | 0 |

  - A mobil LCP-t a Systeme oldalkerete lassítja: a mérés szerint a 336 KB-os oldal-HTML feldolgozása adja az LCP 68%-át.
  - A fennmaradó akadálymentességi és egyéb hibák (logó méret nélkül, név nélküli menügomb) a Systeme fejlécéből jönnek.
  - A blokkok saját része tiszta.

## Önértékelés (első kör)

| # | Ellenőrzés | Eredmény | Indoklás |
|---|---|---|---|
| 1 | Minden szöveg szó szerint egyezik a forrással | megfelelt | Egy forrásból épül; soronként összevetettem a `klimaszereles.txt`-vel, a GYIK Don 3.2 táblázatából való. |
| 2 | Nincs „fertőtlenítés”, egészségügyi állítás, kitalált szám, ár, jótállás | megfelelt | A build tiltja a szót; csak az élő szöveg és a jóváhagyott GYIK-sorok vannak benne. |
| 3 | Minden Zoho gomb a pontos linkre, új lapon; nincs popup | megfelelt | Mindkét blokkban 3-3 gomb; a teszt kattintással is ellenőrzi. |
| 4 | Telefon `tel:+36203734991` | megfelelt | Minden telefon-link ez (teszt). |
| 5 | Nincs vízszintes csúszás | megfelelt | 14 szélességen, mindkét sorrendben. |
| 6 | Nincs duplikált azonosító, konzolhiba | megfelelt | A két blokk együtt is (teszt és build). |
| 7 | Külön előtag, nincs globális CSS, nincs komment | megfelelt | `jk-ksz-` / `jkm-ksz-`; a build szelektoronként ellenőrzi; az egyetlen kivétel a megengedett mobil `html, body` szabály. |
| 8 | Desktopon csak desktop, mobilon csak mobil | megfelelt | 800/801 px-en is ellenőrizve; a rejtett blokk hero-képe sem töltődik le. |
| 9 | A két blokk tartalma azonos | megfelelt | Ugyanaz a 38 szövegegység mindkettőben (teszt). |
| 10 | Mobil kinézet a `mobil-vegleges/` nyelvén | megfelelt | A korábban elfogadott mobil szolgáltatás-oldal elemei és hullámai. |
| 11 | Desktop más logikájú, kihasználja a nagy képernyőt | megfelelt | Kétoszlopos részek, lépés-rács, sticky ár-kiemelés, oldalsó GYIK-cím. |
| 12 | Tablet rendezett, nagy képernyőn nincs megnyúlt fotó | megfelelt | 1100 px alatt kevesebb oszlop (min. 260 px); a fotó 1920 px-nél megáll. |
| 13 | Ikon-animáció: zoom egyszer, a hullám a keret széléről, érintésre egyszer | megfelelt | 1,15x zoom, `inset: 0` üres gyűrű; képkockák: `test/out/klimaszereles-ikon-*.png`. |
| 14 | Körhinta és lightbox | megfelelt (nem vonatkozik) | Ezen az oldalon nincs galéria; a klímatisztításnál lesz. |
| 15 | `prefers-reduced-motion` | megfelelt | Minden azonnal látszik, nincs gyűrű (teszt, mindkét blokk). |
| 16 | Egy H1, helyes hierarchia, alt, width, height | megfelelt | H1 → H2 (szekciók) → H3 (GYIK); a hero alt: „Klímaszerelés Szegeden”. |
| 17 | Lazy loading, nem rontja az animációt | megfelelt | Csak a hero-kép van az oldalon (eager, `fetchpriority="high"`); a felfedés nem függ képtől. |
| 18 | GYIK: csak kitehető sorok, látható, azonos | megfelelt | A prompt 7. pontjának 5 sora, nyitva, mindkét blokkban. |
| 19 | JSON-LD csak a mobil blokkban, szögletes mezők nélkül | megfelelt | Service, BreadcrumbList, FAQPage egy `@graph`-ban; a build és a teszt ellenőrzi. |
| 20 | Lighthouse: LCP 2,5 s alatt, CLS 0,1 alatt, SEO és akadálymentesség jó, 70 KB alatt | részben | Desktopon minden cél teljesül. Mobilon a CLS 0 és a SEO 100, de az LCP 3,5 s a Systeme-keret miatt (lásd fent). Blokkonként 31 és 29 KB. |

**Összesen: 19/20 megfelelt, minden kritikus sor megfelelt.**

**Második kör javításai:**

- a záró gombsor fénye elcsúszott a hullám alatt, ezért kivettem;
- a mobil GYIK-válasz teljes szélességet kapott;
- a rejtett blokk hero-képe ne töltődjön le (`<picture>` üres forrással a másik eszközre);
- 2560 px-en az „INGYENES” címke és az ár ne törjön két sorba.
