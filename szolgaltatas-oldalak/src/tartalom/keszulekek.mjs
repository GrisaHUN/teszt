// Forgalmazott készülékek (hub-oldal, /keszulekek). A 7 márka adatai: src/tartalom/markak.mjs.
import { MARKAK, SORREND, logoAlt } from './markak.mjs';

export default {
  slug: 'keszulekek',
  pre: 'jkk-',
  kimenet: 'keszulekek-markak',
  hero: {
    h1: 'Forgalmazott készülékek',
    alcim: 'Hét márka klímái, beszereléssel együtt. Válassza ki, melyik illik Önhöz, a részleteket a helyszíni felmérésen egyeztetjük.',
    kepBal: { file: 'forgalmazott-keszulekek-hatter-bal.webp', w: 1500, h: 834 },
    kepJobb: { file: 'forgalmazott-keszulekek-hatter-jobb.webp', w: 1500, h: 834 },
    alt: 'Világos nappali falra szerelt klímával, nagy ablakokkal a kertre',
  },
  cta: 'Ingyenes árajánlat kérése',
  markakCim: 'Márkáink',
  markak: SORREND.map((s) => ({ slug: s, nev: MARKAK[s].nev, logo: MARKAK[s].logo, alt: logoAlt(MARKAK[s].nev), db: MARKAK[s].modellek.length })),
  kedvezo: { href: '/kedvezo', nev: 'Kedvező árú klímák', file: 'kedvezo-cover.webp', w: 687, h: 512, alt: 'Kedvező árú klímák' },
  osszegzes: [
    'A márka-oldalakon a klíma szettek ára beszerelve szerepel, 3 méter csővezetékig. Ennél hosszabb csővezetéknél pótdíj lehet; a beszerelés menetét és az árat befolyásoló tényezőket a [klímaszerelés oldalunkon](/klimaszereles) mutatjuk be.',
    'A pontos árat a helyszíni felmérés után adjuk meg.',
  ],
  gyikCim: 'GYIK',
  gyik: [
    { q: 'Melyik márkát válasszam?', a: 'Ez az igénytől és a költségkerettől függ. A helyszíni felmérésnél segítünk kiválasztani az ingatlanhoz és a büdzséhez illő márkát és típust.' },
    { q: 'Mit tartalmaz a „Beszerelve (3 m-ig)” ár?', a: 'A klíma szettet beszerelve, 3 méter csővezetékig; ennél hosszabb csővezetéknél pótdíj lehet. A beszerelés lépéseit a [klímaszerelés oldalunkon](/klimaszereles) mutatjuk be.' },
    { q: 'Ingyenes a helyszíni felmérés?', a: 'Igen, a helyszíni felmérés ingyenes.' },
  ],
};
