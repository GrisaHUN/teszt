// Klímaszerelés oldal: a desktop és a mobil blokk EGYETLEN szövegforrása.
// A szöveg szó szerint az utolsó élő állapotból való (anyagok/szoveg/klimaszereles.txt),
// a GYIK Don 3.2 táblázatának kitehető soraiból. Linkjelölés: [szöveg](/cel).

// Ár-sor: egy helyen cserélhető (Imre válaszára és Matt szövegére vár).
export const AR_SOR = 'Klímaszerelés/telepítés ára: Br.: 99 999 Ft';

export default {
  slug: 'klimaszereles',
  prefix: 'ksz',
  hero: {
    h1: 'Klímaszerelés',
    alt: 'Klímaszerelés Szegeden',
    desktop: { file: 'klimaszereles-szeged-hero.jpeg', w: 1500, h: 838 },
    mobil: { file: 'klimaszereles-szeged-hero-mobil.webp', w: 780, h: 436 },
  },
  cta: 'Ingyenes árajánlat kérése',
  introIkon: 'homero',
  intro: [
    'Klímaberendezés beszerelését vállaljuk Szegeden és a környező településeken, lakásokba, családi házakba és üzlethelyiségekbe egyaránt. A cél egy olyan rendszer, ami a helyiség méretéhez, tájolásához és az ingatlan adottságaihoz illeszkedik, ezért minden munka helyszíni felméréssel indul.',
    'Egy rosszul méretezett klíma évekig okoz bosszúságot. A túl kicsi egység szinte folyamatosan pörög, mégsem hűt rendesen, a túl nagy pedig feleslegesen sokat fogyaszt, és gyakran ki-be kapcsolgat, ami a berendezés élettartamát is rontja. A felmérés pontosan ezt a kockázatot küszöböli ki, mielőtt bármi eldőlne.',
  ],
  lepesekCim: 'Telepítés folyamata',
  lepesek: [
    { ikon: 'felmeres', t: 'Helyszíni felmérés: a helyiség mérete, tájolása, a meglévő elektromos hálózat állapota és a kültéri egység elhelyezési lehetőségei, felmérésnél megbeszéljük a klíma helyét, és a felmerülő igényeket.', kiemeles: '( A felmérés INGYENES! )' },
    { ikon: 'level', t: '24 órán belül Email-ben egy részletesen leírt ajánlatot küldünk, több készülék opcióval, a megbeszélt ársáv szerint, az előzetes felmérés alapján meghatározott, valós igényhez illő teljesítménnyel.' },
    { ikon: 'szereles', t: 'Beltéri és kültéri egység telepítése, elektromos bekötés.' },
    { ikon: 'mero', t: 'Vákuumozás, hűtőközeg-töltés, próbaüzem.' },
    { ikon: 'kulcs', t: 'Átadás, rövid kezelési tájékoztatás.' },
    { ikon: 'pajzs', t: 'Garancia: 2 év garancia a telepítésre.' },
  ],
  arMagyarazat: 'A helyszíni felmérés célja, hogy elkerüljük a fent említett rosszul méretezett klímát. Ez egyben azt is jelenti, hogy az árat is csak ez után tudjuk pontosan megmondani: számít a berendezés teljesítménye, a beltéri és kültéri egység közötti távolság, és a szerelés bonyolultsága, vagyis az emelet, a falazat és a szükséges csővezeték hossza. A fix árajánlat a felmérés után 24 órán belül elkészül, és utólag nem változik.',
  ar: AR_SOR,
  markak: 'Márkák, amikkel dolgozunk: [AUX](/aux), [Daikin](/daikin), [Fisher](/fisher), [Gree](/gree), [Midea](/midea), [Polar](/polar), [Syen](/syen). Az adott ingatlanhoz és büdzséhez illő márkát és típust javasoljuk.',
  keszulekekGomb: 'Forgalmazott készülékek',
  kapcsolodo: { cim: 'Kapcsolódó oldal:', linkek: [{ t: 'Klímatisztítás', href: '/klimatisztitas' }] },
  gyikCim: 'GYIK',
  gyik: [
    { q: 'Ingyenes a helyszíni felmérés?', a: 'Igen, a helyszíni felmérés ingyenes. Ekkor nézzük meg a helyiség méretét, tájolását, a meglévő elektromos hálózatot és a kültéri egység elhelyezési lehetőségeit.' },
    { q: 'Milyen teljesítményű klímára van szükségem?', a: 'A megfelelő teljesítményt a helyszíni felmérésen határozzuk meg a helyiség mérete, tájolása és az ingatlan adottságai alapján. A túl kicsi klíma folyamatosan pörög, mégsem hűt rendesen, a túl nagy feleslegesen sokat fogyaszt és gyakran ki-be kapcsol.' },
    { q: 'Milyen márkákkal dolgoznak?', a: 'AUX, Daikin, Fisher, Gree, Midea, Polar és Syen klímákat szerelünk. Az ingatlanhoz és a költségkerethez illő márkát és típust javasoljuk.' },
    { q: 'Van garancia a telepítésre?', a: 'Igen, a telepítésre 2 év garanciát vállalunk.' },
    { q: 'Mennyi idő alatt készül el egy klímaszerelés?', a: 'Az időigény a berendezés típusától és a szerelés bonyolultságától függ. Ezt a helyszíni felmérésnél pontosítjuk, és az árajánlattal együtt a várható időpontot is megkapja.' },
  ],
  // JSON-LD (Don 2.3 táblázata)
  service: {
    serviceType: 'Klímaszerelés',
    name: 'Klímaszerelés Szegeden',
    description: 'Klíma beszerelése lakásokba, családi házakba és üzlethelyiségekbe, ingyenes helyszíni felméréssel.',
    breadcrumb: 'Klímaszerelés',
  },
};
