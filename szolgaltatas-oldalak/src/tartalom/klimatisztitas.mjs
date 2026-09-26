// Klímatisztítás oldal szövege. Forrás: az utolsó élő állapot (anyagok/szoveg/klimatisztitas.txt, a Matt által
// jóváhagyott, egészségügyi állítás nélküli változat), a GYIK Don 3.2 táblázatának kitehető soraiból
// (az első válaszból az NNGYK-mondat kimaradt, az utolsó a jóváhagyott jótállás-szöveg, márkanevek nélkül).

// Ár-sor: egy helyen cserélhető (hogy mire vonatkozik, Imre válaszára vár; mellé nem írunk semmit).
export const AR_SOR = 'Ár: Br.: 14 999 Ft';

const REF = 'https://d1yei2z3i6k35z.cloudfront.net/19002789/';

export default {
  slug: 'klimatisztitas',
  prefix: 'kt',
  hero: {
    h1: 'Klímatisztítás',
    alt: 'Klímatisztítás Szegeden',
    desktop: { file: 'klimatisztitas-szeged-hero.jpeg', w: 1500, h: 838 },
    mobil: { file: 'klimatisztitas-szeged-hero-mobil.webp', w: 780, h: 436 },
  },
  cta: 'Időpont foglalása',
  miertCim: 'Miért kell tisztítani a klímánkat?',
  miert: [
    'A klíma beltéri egysége óránként több száz köbméter levegőt áramoltat át magán, közben por és egyéb szennyeződés rakódik le rajta. Hűtéskor a beltéri egység hőcserélőjének hideg felületén kondenzvíz keletkezik, és a felhalmozódott szennyeződésben, nedvességben mikroorganizmusok is megtelepedhetnek.',
    'Tisztítás nélkül a készülékben kellemetlen szag és penész is kialakulhat, ami ronthatja a beltéri levegő minőségét.',
    'Erősen szennyezett hőcserélőnél a ventilátor többet dolgozhat, ezért nőhet az áramfogyasztás, csökkenhet a teljesítmény és a hatásfok. A készülék emellett hamarabb meghibásodhat.',
  ],
  modszer: 'Professzionális Deep Clean klímamosó vegyszerrel dolgozunk, amelyet nagynyomású vízsugárral öblítünk le.',
  teljesCim: 'Teljeskörű tisztítást végzünk!',
  teljes: [
    { ikon: 'szuro', t: 'Szűrők kiszerelése és alapos tisztítása.' },
    { ikon: 'parologtato', t: 'A párologtató tisztítása.' },
    { ikon: 'kulteri', t: 'A kültéri egység átvizsgálása, tisztítása.' },
    { ikon: 'ellenorzes', t: 'Működés-ellenőrzés a munka végén.' },
  ],
  // 13 referencia-fotó (a régi CDN-linkeken). Az alt azt írja le, ami a fotón látszik.
  galeria: [
    { src: REF + '6ab2ee7ad8bbf0.19170727_FB_IMG_1790093040012.jpg', w: 1125, h: 1500, alt: 'Szennyezett, kiszerelt klíma-ventilátorhenger egy kádban' },
    { src: REF + '6ab2ee7f194152.69800172_FB_IMG_1790093042081.jpg', w: 1125, h: 1500, alt: 'Kimosott, világos klíma-ventilátorhenger egy kádban' },
    { src: REF + '6ab2f30d474f86.03377185_1111.jpg', w: 1500, h: 1372, alt: 'Beltéri egység hőcserélője nyitott burkolattal, alatta kék védőfólia' },
    { src: REF + '6ab2f310abe1c3.72693182_20260531_160828.jpg', w: 1125, h: 1500, alt: 'Falra szerelt beltéri egység szétnyitva, a hőcserélő és a ventilátor alatt gyűjtőfólia' },
    { src: REF + '6ab2f313457b95.61073852_20260531_163728.jpg', w: 1125, h: 1500, alt: 'A beltéri egység hőcserélője és ventilátora közelről, tisztítás közben' },
    { src: REF + '6ab2f316dd1391.32354183_20260531_170124.jpg', w: 1125, h: 1500, alt: 'Két poros légszűrő a kádban, mellettük a beltéri egység előlapja' },
    { src: REF + '6ab2f31b2fa844.91955339_20260531_171320.jpg', w: 1125, h: 1500, alt: 'Kiszerelt légszűrők mosás közben egy mosdókagylón' },
    { src: REF + '6ab2f325a455b4.80787444_20260602_172107.jpg', w: 1125, h: 1500, alt: 'Klímamosó gyűjtőzsák a falra szerelt beltéri egység alatt, mellette létra és mosóberendezés' },
    { src: REF + '6ab2f32c4fdc12.09540981_20260603_175028.jpg', w: 1125, h: 1500, alt: 'Szétszerelt beltéri egység burkolati elemei és légszűrői a csempén' },
    { src: REF + '6ab2f33385c717.35685857_20260627_190623.jpg', w: 1125, h: 1500, alt: 'Szennyezett ventilátor a szétnyitott beltéri egységben, alatta gyűjtőfólia' },
    { src: REF + '6ab2f3438f61f7.24603709_20260627_200458.jpg', w: 1125, h: 1500, alt: 'A beltéri egység ventilátorlapátjai közelről' },
    { src: REF + '6ab2f34c4e0691.42263197_20260630_1721150.jpg', w: 1125, h: 1500, alt: 'Gyűjtőzsák a beltéri egység alatt, a mosóvíz egy tartályba folyik' },
    { src: REF + '6ab2f357c81ec0.87611726_20260708_165646.jpg', w: 1125, h: 1500, alt: 'Két poros légszűrő és a beltéri egység burkolata a padlón' },
  ],
  szezon: [
    { ikon: 'nap', eleje: 'A klímatisztítások időszaka hűtési szezon előtt:', kiemelt: 'Március-Június eleje.' },
    { ikon: 'lang', eleje: 'Fűtési szezon előtt:', kiemelt: 'Szeptember-November.' },
  ],
  gyakorisag: [
    'A beltéri egység tisztítása függ az elhelyezkedéstől ( pl. egy konyhába szereltet sűrűbben kell) , illetve a használat gyakoriságától is.',
    'Általában évente egyszer elegendő a vegyszeres gépi klímamosás; ha fűtésre is használja, évente kétszer ajánljuk.',
  ],
  jotallas: 'Egyes gyártók a kiterjesztett jótállás feltételéül a rendszeres, igazolt szakszervizi karbantartást szabják. A pontos feltételt a gyártó jótállási feltételei tartalmazzák. A jótállás fenntartásához szükséges karbantartás feltételét érdemes a gyártótól vagy a forgalmazótól megkérdezni.',
  ar: AR_SOR,
  kapcsolodo: { cim: 'Kapcsolódó oldal:', linkek: [{ t: 'Klímaszerelés', href: '/klimaszereles' }] },
  gyikCim: 'GYIK',
  gyik: [
    { q: 'Milyen gyakran kell tisztítani a klímát?', a: 'Általában évente egyszer elegendő a vegyszeres gépi klímamosás; ha fűtésre is használja, évente kétszer ajánljuk. A konyhába szerelt egységet gyakrabban érdemes tisztítani.' },
    { q: 'Mikor érdemes tisztíttatni a klímát?', a: 'A hűtési szezon előtt, március és június eleje között, illetve a fűtési szezon előtt, szeptember és november között.' },
    { q: 'Mit tartalmaz a tisztítás?', a: 'A szűrők kiszerelését és alapos tisztítását, a párologtató tisztítását, a kültéri egység átvizsgálását és tisztítását, a munka végén működés-ellenőrzést. Vegyszeres gépi klímamosással dolgozunk, nagynyomású vízsugárral öblítve.' },
    { q: 'Miért kell tisztítani a klímát?', a: 'A beltéri egység levegőt áramoltat át magán, közben por és egyéb szennyeződés rakódik le rajta. Tisztítás nélkül kellemetlen szag és penész is kialakulhat, ami ronthatja a beltéri levegő minőségét. Erősen szennyezett hőcserélőnél nőhet az áramfogyasztás is.' },
    { q: 'Számít a klímatisztítás a jótállásra?', a: 'Egyes gyártók a kiterjesztett jótállás feltételéül a rendszeres, igazolt szakszervizi karbantartást szabják. A pontos feltételt a gyártó jótállási feltételei tartalmazzák. A jótállás fenntartásához szükséges karbantartás feltételét érdemes a gyártótól vagy a forgalmazótól megkérdezni.' },
  ],
  service: {
    serviceType: 'Klímatisztítás',
    name: 'Klímatisztítás Szegeden',
    description: 'Vegyszeres gépi klímamosás: a szűrők, a párologtató és a kültéri egység tisztítása, működés-ellenőrzéssel.',
    breadcrumb: 'Klímatisztítás',
  },
};
