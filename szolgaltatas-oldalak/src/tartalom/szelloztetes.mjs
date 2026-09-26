// Hővisszanyerős szellőztetés oldal szövege. Forrás: az utolsó élő állapot (anyagok/szoveg/szelloztetes.txt).
// A „85-90%” hatásfok és az „1,5-2 millió forint” becslés jóváhagyva (David, 2026-09-26), az élő szöveg szerint.
// A GYIK Don 3.2 táblázatának kitehető soraiból; a meglévő ingatlanos kérdés az élő oldal szövegével (egyszer).
export default {
  slug: 'szelloztetes',
  prefix: 'sz',
  hero: {
    h1: 'Hővisszanyerős szellőztetés',
    alt: 'Hővisszanyerős szellőztetés Szegeden',
    desktop: { file: 'hovisszanyeros-szellozteto-szeged-hero.jpeg', w: 1500, h: 1250 },
    mobil: { file: 'hovisszanyeros-szellozteto-szeged-hero-mobil.webp', w: 780, h: 650 },
    mobilAr: '780 / 650',
  },
  cta: 'Ingyenes árajánlat kérése',
  intro: 'A hővisszanyerős szellőztető rendszer folyamatosan friss, szűrt levegőt juttat az ingatlanba, miközben a távozó levegő hőjét egy keresztáramú hőcserélőn keresztül visszanyeri. A két légáram nem keveredik, csak a hőt adják át egymásnak egy elválasztófalon keresztül. A gyakorlatban ez azt jelenti, hogy nem kell ablakot nyitogatni a friss levegőért, és a fűtési vagy hűtési energia jelentős része, jellemzően 85-90%-a nem vész el a szellőztetés miatt.',
  problema: [
    'Egy jól szigetelt, modern ingatlanban a rendszeres szellőztetés hiánya könnyen problémát okoz:',
    'megemelkedik a belső páratartalom és a szén-dioxid-szint, ami hosszabb távon a falak penészesedéséhez és fülledt, kevésbé kellemes belső levegőhöz vezethet. A hővisszanyerős rendszer folyamatosan cseréli a levegőt, így ezt a kockázatot eleve kiküszöböli, és port, pollent és egyéb szennyeződést is kiszűr, mielőtt a levegő bejutna az ingatlanba.',
  ],
  kivitelezes: 'Kivitelezést vállalunk új építésű és felújítás alatt álló ingatlanokba egyaránt, Szegeden és környékén.',
  lepesek: [
    { ikon: 'felmeres', t: 'Helyszíni felmérés: a helyiségek száma, az alaprajz, a légcsatornák vezethetősége.' },
    { ikon: 'terv', t: 'Rendszer-tervezés a felmérés alapján.' },
    { ikon: 'szereles', t: 'Kivitelezés, beüzemelés, beszabályozás.' },
  ],
  koltsegCim: 'Kivitelezés költsége',
  koltseg: 'Minden hővisszanyerős rendszer valójában egyedi tervezés eredménye: a helyiségek száma és az alaprajz határozza meg a szükséges központi egység teljesítményét és a légcsatorna-hálózat kiépítését, ezért két hasonló méretű ingatlan is jelentősen eltérő megoldást igényelhet. Tájékoztatásul: egy átlagos családi háznál a teljes rendszer ára (gép, anyagok, munkadíj együtt) jellemzően 1,5-2 millió forint körül alakul, ami egy építkezés vagy felújítás teljes költségvetésének jellemzően kevesebb mint 10%-a. A pontos, fix árat mindig a helyszíni felmérés után adjuk meg.',
  kapcsolodo: { cim: 'Kapcsolódó oldal:', linkek: [{ t: 'Főoldal', href: '/' }] },
  gyikCim: 'GYIK',
  gyik: [
    { q: 'Mi az a hővisszanyerős szellőztetés?', a: 'A hővisszanyerős szellőztetés friss, szűrt levegőt juttat az ingatlanba, miközben a távozó levegő hőjét visszanyeri. A keresztáramú hőcserélőben a két légáram nem keveredik, csak a hőt adják át egymásnak.' },
    { q: 'Meglévő, már befejezett ingatlanba is beépíthető a rendszer?', a: 'Igen, bár új építésnél vagy felújítás alatt egyszerűbb és költséghatékonyabb a kivitelezés, mert a légcsatornák még szabadon vezethetők.' },
    { q: 'Mennyibe kerül?', a: 'Minden rendszer egyedi tervezés eredménye. A helyiségek száma és az alaprajz határozza meg a szükséges teljesítményt és a légcsatorna-hálózatot. A pontos árat mindig a helyszíni felmérés után adjuk meg.' },
    { q: 'Hogyan zajlik a kivitelezés?', a: 'Helyszíni felmérés (helyiségek száma, alaprajz, légcsatornák vezethetősége), rendszertervezés, majd kivitelezés, beüzemelés és beszabályozás.' },
    { q: 'Miért fontos a rendszeres szellőztetés?', a: 'Rendszeres szellőztetés nélkül nőhet a belső páratartalom, ami hosszabb távon a falak penészesedéséhez és fülledt, kevésbé kellemes levegőhöz vezethet.' },
  ],
  service: {
    serviceType: 'Hővisszanyerős szellőztetés',
    name: 'Hővisszanyerős szellőztetés Szegeden',
    description: 'Hővisszanyerős szellőztetőrendszer tervezése és kivitelezése új építésű, felújítás alatt álló és meglévő ingatlanokba.',
    breadcrumb: 'Hővisszanyerős szellőztetés',
  },
};
