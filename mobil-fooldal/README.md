# Jimmy Klíma – mobil főoldal (jkm- blokkok)

Három Raw HTML blokk a `jimmy-klima.systeme.io` főoldal **mobil** vásznára.
Beillesztésre kész fájlok: `dist/`.

| Fájl | Tartalom | Méret |
|---|---|---|
| `dist/mobil-fooldal-jkm-1.html` | Hero, Szolgáltatásaink, Referenciák-galéria | 56,0 KB |
| `dist/mobil-fooldal-jkm-2.html` | Miért minket válasszon?, CTA, Rólunk, Klíma vásárlás menete, Rólunk írták, Fűtés klímával, CTA | 27,9 KB |
| `dist/mobil-fooldal-jkm-3.html` | Forgalmazott készülékek (cím, Hűtő-Fűtő Klímák), márkalogó-szalag | 63,2 KB |

## Beillesztés

1. A mobil vászon három Raw HTML elemébe sorrendben: 1, 2, 3 (a teljes tartalmat lecserélve).
2. Minden elem és a szekciója is **csak Mobile** láthatóságú legyen (két szinten, "Item visible on").
3. Mentés után ellenőrzés az élő oldalon (desktop 1280, mobil 390 és 360 széles, cache-busting `?v=`).

## Mi készült el

- Minden azonosító, osztály, `@keyframes` és script-őr `jkm-` előtagú. A desktop `jk-` nevek egyike sem szerepel (a build ellenőrzi).
- Minden blokk önálló: saját gyökérelem (`#jkm-b1..3`), minden CSS erre szűkítve, idempotens IIFE őrrel (`window.__jkmB1..3`).
- A `html, body` szabály `@media (max-width: 767px)` alatt van. Blokkonként egy full-bleed (`100vw`) gyökér, a többi elem ezen belül marad.
- **CTA gombok:** mind a három „Ingyenes árajánlat kérése” gomb közvetlen `<a>` link a Zoho foglalási oldalra (`target="_blank" rel="noopener"`). A desktop popup-gombtól már nem függnek. Szín a márkaszabály szerint: lime háttér, navy szöveg, hoverre sötétebb lime.
- **Szövegek:** David kérésére változatlanul a desktop/09-23-i eredeti szövegek (a fűtés szekció állításai és a „fertőtlenítés” szó is marad).
- Képek: a hero, a „vásárlás menete” háttérmintája és a 7 márkalogó base64-ben van beágyazva. A referenciafotók és a fűtés-kép a Systeme.io saját CDN-jén (`d1yei2z3i6k35z.cloudfront.net`) vannak. Más domainről nincs kép.
- Animációk: egyszer lefutó, változatos irányú belépők (fel, balról/jobbra váltakozva, skálázás), 550 ms, ease-out. A vásárlás menetének lime vonala görgetésre rajzolódik ki. Érintésre hullám és ikon-pulzálás. `prefers-reduced-motion` esetén minden azonnal látszik.
- Karusszelek (szolgáltatások, referenciák, vélemények): natív swipe és snap, pöttyös lapozó. A referenciaképre koppintva nagyító nyílik (swipe-pal lapozható).
- A márkaszalag CSS-animáció, asztali gépen rejtve nem futtat JavaScript-ciklust.
- Nincs `position: fixed` elem a látható mobil tartalomban, így a chat-gomb sarka szabad marad. A nagyító csak megnyitáskor jelenik meg.

## Eltérések a 09-23-i fájlokhoz képest

- A „Rólunk írták” vélemény-karusszel címet kapott (a desktop szekciócíme). A mobil vászon külön van, ezért enélkül cím nélkül maradt volna.
- A klímatisztítás és a szellőztetés ikonja egyszerűbb lett (csepp, légáram). A régiek kis méretben nem voltak felismerhetők.
- A hero alatti ívelt elválasztó most a navy hero folytatása (a korábbi világos csíkot hagyott a hero alján).
- A Rólunk szekció címe alá egy rövid lime vonal került, és a navy Rólunk → vásárlás menete határ színátmenete sima lett.

## Tesztelés

```
node build.mjs         # dist/ előállítása + szabályellenőrzés (méret, jk- név, komment, külső kép, id-k)
node test/check.mjs    # Playwright: mobil 390/360, desktop 1280, mindkét DOM-sorrend, reduced-motion
```

A `test/check.mjs` egy Systeme-szerű mintaoldalba teszi a blokkokat egy `jk-` nevű asztali mintablokk mellé. Eredmény (2026-09-25):

- mobil 390: 7241 px magas, 360: 7612 px (csak a mobil blokkok, fejléc és lábléc nélkül)
- 0 vízszintes csúszás, 0 duplikált id, 0 konzolhiba, 50/50 animált elem megjelenik
- desktop 1280: a mobil tartalom rejtve, az asztali minta animációja 3/3 (nincs ütközés), mindkét sorrendben

**Az élő oldalon ez még nincs ellenőrizve:** a fejlesztői környezet hálózati szabálya tiltotta a `jimmy-klima.systeme.io` és a cloudfront elérését, ezért a referenciafotók a tesztben helyettesítő képek voltak. Beillesztés után az élő ellenőrzést (7. pont) el kell végezni.
