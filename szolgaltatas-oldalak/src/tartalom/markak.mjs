// Forgalmazott készülékek: a 7 márka és modelljeik. Forrás: az Elliot-prompt 7. pontja
// (a 2026-09-18-i márka-oldalakból); a modellnevek, a teljesítmény és az árak szó szerint.
// Energiaosztály / hidegtűrés CSAK a két, gyártói adatlappal igazolt modellnél (Matt/Don, 2026-09-26),
// pontosan a jóváhagyott szöveggel. A többi modellnél az `energia` mező szándékosan üres: ha később
// megjön az igazolt adat, csak ki kell tölteni, és a kártyán megjelenik.
// Az ár jelző nélkül áll (nincs „bruttó”, „ÁFÁ-val” vagy „végleges ár”).
export const AR_CIMKE = 'Beszerelve (3 m-ig):';

const m = (nev, telj, ar, extra = {}) => ({ nev, telj, tipus: 'Klíma szett', ar, energia: '', ...extra });

export const MARKAK = {
  aux: { nev: 'AUX', nevelo: 'Az', pre: 'jkb-aux-', logo: 'aux-logo.png', lasd: ['daikin', 'gree'], modellek: [
    m('AUX Delta 3', 'Inverter 3,5 kW', '325 000 Ft'),
    m('AUX Aura', 'Inverter 3,5 kW', '362 000 Ft'),
  ] },
  daikin: { nev: 'Daikin', nevelo: 'A', pre: 'jkb-dai-', logo: 'daikin-logo.png', lasd: ['gree', 'midea'], modellek: [
    m('Daikin Sensira E FTXF35/RXF35', 'Inverter 3,5 kW', '385 000 Ft'),
    m('Daikin Comfora FTXP35N/RXP35N', 'Inverter 3,5 kW', '430 000 Ft'),
  ] },
  fisher: { nev: 'Fisher', nevelo: 'A', pre: 'jkb-fis-', logo: 'fisher-logo.png', lasd: ['polar', 'aux'], modellek: [
    m('Fisher Special Edition', 'Inverter 3,6 kW', '320 000 Ft'),
    m('Fisher Art', 'Inverter 3,5 kW', '390 000 Ft', { jelzo: 'Háromféle színben!' }),
    m('Fisher Nordic', 'Inverter 3,5 kW', '449 000 Ft'),
  ] },
  gree: { nev: 'Gree', nevelo: 'A', pre: 'jkb-gre-', logo: 'gree-logo.png', lasd: ['daikin', 'midea'], modellek: [
    m('Gree Smart One', 'Inverter 3,5 kW', '362 000 Ft'),
    m('Gree Comfort Pro', 'Inverter 3,5 kW', '365 000 Ft'),
    m('Gree Dark Pro', 'Inverter 3,5 kW', '385 000 Ft'),
    m('Gree Amber Royal', 'Inverter 3,5 kW', '497 000 Ft', { energia: 'Hűtési energiaosztály (gyártói adatlap szerint): A+++ (SEER 8,5). Fűtés: -30 °C külső hőmérsékletig.' }),
  ] },
  midea: { nev: 'Midea', nevelo: 'A', pre: 'jkb-mid-', logo: 'midea-logo.png', lasd: ['gree', 'aux'], modellek: [
    m('Midea Breezeless E', 'Inverter 3,5 kW', '362 000 Ft'),
    m('Midea All Easy Pro', 'Inverter 3,5 kW', '365 000 Ft'),
    // Oasis Plus+: a gyártói források ellentmondanak, ezért NINCS energiaosztály (EPREL-megerősítésig).
    m('Midea Oasis Plus+', 'Inverter 3,5 kW', '459 000 Ft'),
  ] },
  polar: { nev: 'Polar', nevelo: 'A', pre: 'jkb-pol-', logo: 'polar-logo.png', lasd: ['fisher', 'syen'], modellek: [
    m('Polar Lite', 'Inverter 3,5 kW', '280 000 Ft'),
    m('Polar Optimum', 'Inverter 3,5 kW', '299 000 Ft'),
  ] },
  syen: { nev: 'Syen', nevelo: 'A', pre: 'jkb-sye-', logo: 'syen-logo.png', lasd: ['polar', 'fisher'], modellek: [
    // Az energia-adat a SOH12MN-E32DA1D típuskódra vonatkozik (gyártói adatlap).
    m('Syen Muse Next', 'Inverter 3,5 kW', '350 000 Ft', { energia: 'Energiaosztály (gyártói adatlap szerint): hűtés A+++ (SEER 8,5), fűtés A++ (SCOP 4,8). Fűtés: -25 °C külső hőmérsékletig.' }),
  ] },
};
export const SORREND = ['aux', 'daikin', 'fisher', 'gree', 'midea', 'polar', 'syen'];
const SZAM = ['', 'egy', 'két', 'három', 'négy', 'öt'];

export const logoAlt = (nev) => `${nev} klíma logó`;

// Egy márka-oldal tartalma (a sablon: src/oldalak/_marka.mjs)
export const markaOldal = (slug) => {
  const b = MARKAK[slug];
  const db = b.modellek.length;
  const lasd = b.lasd.map((s) => `${MARKAK[s].nevelo.toLowerCase()} [${MARKAK[s].nev}](/${s})`).join(' és ');
  return {
    slug,
    pre: b.pre,
    sablon: '_marka',
    kimenet: 'keszulekek-markak',
    marka: b,
    hero: {
      h1: `${b.nev} klíma beszereléssel Szegeden`,
      logo: { file: b.logo, w: 480, h: 300, alt: logoAlt(b.nev) },
      intro: db === 1
        ? `${b.nevelo} ${b.nev} ${b.modellek[0].nev.replace(b.nev + ' ', '')} klíma szettet kínáljuk beszerelve, 3 m csőhosszig.`
        : `${b.nevelo} ${b.nev} ${SZAM[db]} klíma szettjét kínáljuk beszerelve, 3 m csőhosszig.`,
      intro2: 'A pontos árat az ingyenes helyszíni felmérés után adjuk meg.',
    },
    cta: 'Ingyenes árajánlat kérése',
    modellekCim: 'Modellek és árak',
    arCimke: AR_CIMKE,
    beszerelesCim: 'Mit tartalmaz a beszerelés?',
    beszereles: [
      { ikon: 'szereles', t: 'Beltéri és kültéri egység telepítése' },
      { ikon: 'villam', t: 'Elektromos bekötés' },
      { ikon: 'mero', t: 'Vákuumozás' },
      { ikon: 'hopehely', t: 'Hűtőközeg-töltés' },
      { ikon: 'ellenorzes', t: 'Próbaüzem' },
      { ikon: 'kulcs', t: 'Átadás' },
    ],
    beszerelesLink: 'A teljes folyamatot a [klímaszerelés oldalunkon](/klimaszereles) mutatjuk be.',
    garancia: '2 év garancia a telepítésre (Jimmy Klíma). A gyártói garancia a gyártó saját feltételei szerint érvényes.',
    kapcsolodoCim: 'Kapcsolódó oldalak',
    kapcsolodo: [
      'Vissza a [Forgalmazott készülékek](/keszulekek) oldalra.',
      'A beszerelés menete: [Klímaszerelés](/klimaszereles).',
      `Nézze meg ${lasd} kínálatunkat is.`,
    ],
  };
};
