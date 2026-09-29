# Forgalmazott készülékek + 7 márka-oldal: beillesztés

Oldalanként **egyetlen reszponzív Raw HTML blokk** (mobilon és desktopon ugyanaz a kód). A Systeme.io-ban a Raw HTML elem **„Item visible on” beállításában a mobil ÉS a desktop is legyen bekapcsolva**, a szekció is mindkét eszközön látszódjon (nincs eszköz-szűrés).

| Oldal | URL | Fájl | Előtag | Méret |
|---|---|---|---|---|
| Forgalmazott készülékek | `/keszulekek` | `keszulekek.html` | `jkk-` | 30,7 KB |
| AUX | `/aux` | `aux.html` | `jkb-aux-` | 29,6 KB |
| Daikin | `/daikin` | `daikin.html` | `jkb-dai-` | 29,7 KB |
| Fisher | `/fisher` | `fisher.html` | `jkb-fis-` | 30,7 KB |
| Gree | `/gree` | `gree.html` | `jkb-gre-` | 31,7 KB |
| Midea | `/midea` | `midea.html` | `jkb-mid-` | 30,6 KB |
| Polar | `/polar` | `polar.html` | `jkb-pol-` | 29,6 KB |
| Syen | `/syen` | `syen.html` | `jkb-sye-` | 29,3 KB |

## Beillesztés

1. Oldalanként egy szekció, benne egy Raw HTML elem. A fájl teljes tartalmát kell bemásolni (a `<style>`-tól a záró `</script>`-ig).
2. Ha az oldalon régi kód van (pl. a korábbi csak-desktop, base64-képes vagy csak-mobil változat), azt töröld, és ezt az egyet tedd a helyére.
3. A fejléchez, a lábléchez és a chat-gombhoz nem kell nyúlni.
   - A blokk a Systeme sor- és szekciómargóit maga tölti ki a fejléc és a lábléc felé (navy), így nem marad köztük csík.
   - Ha lehet, a szekció belső margója (padding) legyen 0.
4. **A `/kedvezo` oldalhoz nem nyúltam.** A gyűjtőoldalon a régi szerkezet szerint egy kártya mutat rá (a borítóképével), hozzáírt szöveg nélkül.

## Felépítés

- **Gyűjtőoldal (`/keszulekek`):**
  - **Hero:** a két félkép 8 px átfedéssel, varrat nélkül illesztve, 1920 px-nél megáll, navy fátyollal.
    - Mobilon csak a jobb fele töltődik le (49 KB, ezen van a klíma); a 241 KB-os bal felét a telefon nem tölti le.
    - A hero-ban: H1, egymondatos alcím, a fő gomb és a telefon.
  - **7 márka-kártya** a megadott sorrendben, plusz a „Kedvező árú klímák” kártya:
    - mobilon 2, 560 px fölött 4 oszlopban;
    - a teljes kártya kattintható, logóval, névvel és a modellek számával.
  - **Árakról szóló összefoglaló:** szöveges linkkel a `/klimaszereles` oldalra.
  - **3 GYIK-kérdés.**
  - **Záró gombsor**, mobilon lebegő fő gomb.
- **Márka-oldalak:**
  - **Hero:** logó fehér keretben, H1 („{Márka} klíma beszereléssel Szegeden”), rövid bevezető, gombok.
  - **„Modellek és árak”:** modell-kártyák (név, teljesítmény, „Klíma szett”, ár).
  - **„Mit tartalmaz a beszerelés?”:** 6 ikonos elem, szöveges link a klímaszerelés oldalra.
  - **Garancia-kártya.**
  - **„Kapcsolódó oldalak”:**
    - vissza a gyűjtőoldalra;
    - a Klímaszerelés oldal;
    - 2 másik márka.
  - **Záró gombsor.**
- **Ikonok:** a kártya bármely pontjára vitt egérre egyszer nagyít (1,15x), és a lime gyűrű a keret széléről indul; érintésre egyszer fut. `prefers-reduced-motion` esetén nincs animáció.
- **JSON-LD nincs** egyik oldalon sem (a prompt 4.10. pontja szerint).

## Energiaosztály: hol van és hol maradt ki szándékosan

- **Kiírva, pontosan a jóváhagyott szöveggel (prompt 4.14):**
  - **Syen Muse Next:** „Energiaosztály (gyártói adatlap szerint): hűtés A+++ (SEER 8,5), fűtés A++ (SCOP 4,8). Fűtés: -25 °C külső hőmérsékletig.” Az adat a **SOH12MN-E32DA1D** típuskódra vonatkozik.
  - **Gree Amber Royal:** „Hűtési energiaosztály (gyártói adatlap szerint): A+++ (SEER 8,5). Fűtés: -30 °C külső hőmérsékletig.” Fűtési energiaosztály és SCOP nincs, mert még nincs megerősítve.
- **Szándékosan kimaradt:**
  - **Midea Oasis Plus+:** a régi oldalon tévesen „A+++” állt, és a gyártói források ellentmondanak egymásnak. Se energiaosztály, se hidegtűrés nem szerepel, amíg nincs EPREL-megerősítés.
  - **Az összes többi modellnél** sincs igazolt adat, ezért ott sem szerepel.
- **Ha később jön igazolt adat:** a forrásban (`src/tartalom/markak.mjs`) minden modellnek van egy `energia` mezője; ezt kell kitölteni, és a kártyán megjelenik egy kiemelt sor. Az oldalt nem kell újraépíteni.

## Szövegek, árak

- **Modellnevek, teljesítmény, árak:** szó szerint a prompt 7. pontjából.
  - Az ár formátuma: „Beszerelve (3 m-ig): 325 000 Ft”, szóközös ezres tagolással, jelző nélkül.
  - Nincs „bruttó”, „ÁFÁ-val” vagy „végleges ár”.
- **Saját mondatok** (a prompt kérte, mintaszövegek alapján):
  - a gyűjtőoldal alcíme;
  - az árakról szóló összefoglaló;
  - a 3 GYIK-válasz;
  - a márka-oldalak bevezető mondata;
  - a „Kapcsolódó oldalak” sorai.
  - Mindegyik az oldal meglévő, jóváhagyott állításaiból épül (ingyenes felmérés, 3 m-ig beszerelve, pontos ár a felmérés után), szuperlatívusz, környezeti állítás, megtakarítás és gondolatjel nélkül.
  - Az oldal többi részéhez igazodva magázó formát használtam („Válassza ki”, „Nézze meg”); a prompt példája tegező volt.
- **Kihagyva a prompt szerint:**
  - a „Kinek ajánljuk” szakasz (nincs rá forrás);
  - a gyártói garancia konkrét hossza.

## Ellenőrzés

- **`node build.mjs`:** méret, előtagok, globális CSS, komment, gondolatjel, link-fehérlista, img-attribútumok, egy H1, a JSON-LD hiánya.
- **`node test/check-km.mjs`: 532/532 rendben.**
  - Mind a 8 oldal, 12 szélességen (320–2560 px): csúszás, túlnyúló elem, duplikált id, konzolhiba, egy H1, felfedés, képattribútumok, 44 px-es érintési célpontok.
  - Tiltott szavak és külső linkek.
  - Zoho- és telefon-linkek, a hero-gomb új lapon.
  - Belső linkek és kattintások (a 7 márka-kártya a kártya szélére kattintva is).
  - Modellnevek és árak a prompttól függetlenül beírt listához mérve.
  - Energiaosztály csak a 2 engedélyezett modellnél, pontos szöveggel.
  - Ikon-animáció (egér, érintés), reduced-motion.
  - Képletöltés (mobilon a háttér bal fele nem töltődik; a logók lazy-k).
- **Képernyőképek:** `test/out/<oldal>-km-<szélesség>.png` (360, 390, 430, 768, 1024, 1280, 1440, 1920 px).
- **Lighthouse** (a régi Systeme-kerettel, helyben):

  | Oldal | Mobil telj. | Mobil LCP | Mobil CLS | Desktop telj. | Desktop LCP | SEO |
  |---|---|---|---|---|---|---|
  | Forgalmazott készülékek | 73 | 4,2 s | 0 | 99 | 1,0 s | 100 |
  | Gree (márka-oldal minta) | 87 | 3,2 s | 0 | 100 | 0,6 s | 100 |

  - A mobil LCP-t a Systeme oldalkerete húzza fel: a késés 69%-a megjelenítési késés a nagy oldal-HTML miatt, maga a kép 0,15 s alatt letöltődik.
  - Akadálymentesség: 93; az egyetlen hibás tétel a Systeme fejlécének név nélküli menügombja.

## Önértékelés (minden oldalra azonos eredménnyel)

| # | Ellenőrzés | Eredmény | Indoklás |
|---|---|---|---|
| 1 | Minden ár és modellnév szó szerint egyezik a 7. ponttal | megfelelt | A teszt a prompttól függetlenül beírt listához méri, mind a 7 márkánál egyezik. |
| 2 | Energiaosztály/hidegtűrés csak a 2 engedélyezett modellnél, pontos szöveggel | megfelelt | Syen Muse Next és Gree Amber Royal szó szerint; a Midea Oasis Plus+-nál és máshol nincs (teszt). |
| 3 | Nincs „bruttó”, „ÁFÁ-val”, „végleges ár” | megfelelt | Jelző nélküli ár; a teszt és a build is ellenőrzi. |
| 4 | Nincs környezeti állítás vagy megtakarítási szám | megfelelt | A teszt tiltott-szó listája üres találatot ad. |
| 5 | Minden Zoho-gomb a pontos linkre, új lapon, nincs popup | megfelelt | `https://growthnestg.zohobookings.eu/254300000000290002`, `target="_blank"`, `rel="noopener"`. |
| 6 | Egyetlen Raw HTML blokk, mindkét eszközön látható | megfelelt | Egy fájl oldalanként; a leírás elején a beállítás. |
| 7 | Nincs vízszintes csúszás | megfelelt | 12 szélességen, túlnyúló elem sincs. |
| 8 | Nincs duplikált id, konzolhiba, globális CSS, komment | megfelelt | Build és teszt. |
| 9 | Egy H1, helyes hierarchia, alt, width, height | megfelelt | H1 → H2 → H3; logók: „{Márka} klíma logó”. |
| 10 | A hub mind a 7 márka-kártyája a helyes oldalra linkel | megfelelt | Kattintással ellenőrizve, a kártya szélére is. |
| 11 | Márka-oldalak linkjei (`/keszulekek`, `/klimaszereles`, 1-2 márka) | megfelelt | Mind a 7 oldalon, szöveges linkként. |
| 12 | Reszponzív 360-1920 px között | megfelelt | Képernyőképek 8 szélességen; mobilon 2, desktopon 4 oszlopos márkarács. |
| 13 | Nincs JSON-LD | megfelelt | Build és teszt. |
| 14 | Telefon mindenhol `tel:+36203734991` | megfelelt | Teszt. |
| 15 | Lighthouse: LCP 2,5 s alatt, CLS 0,1 alatt; 70 KB alatt | részben | Desktopon teljesül, a CLS mindenhol 0-0,002, a blokkok 29-32 KB-osak; a mobil LCP a Systeme-keret miatt 3,2-4,2 s. |

**Összesen: 14/15 megfelelt oldalanként, minden kritikus sor megfelelt.**

**Javítások a körök során:**

- a gyűjtőoldal hero-gombjai desktopon sorba és középre kerültek;
- mobilon a háttérkép teljes szélességű lett (a rejtett bal fél helyet foglalt);
- a „Kapcsolódó oldalak” linkjei 44 px-es érintési célpontot kaptak, és a mondatvégi pont nem törik külön sorba.
