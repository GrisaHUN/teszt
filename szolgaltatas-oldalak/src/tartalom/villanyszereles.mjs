// Villanyszerelés oldal szövege. Forrás: az utolsó élő állapot (anyagok/szoveg/villanyszereles.txt), a GYIK
// Don 3.2 táblázatának kitehető soraiból; a sürgős hibaelhárítás kérdése az élő oldal szövegével (egyszer).
export default {
  slug: 'villanyszereles',
  prefix: 'vsz',
  hero: {
    h1: 'Villanyszerelés',
    alt: 'Villanyszerelés Szegeden',
    desktop: { file: 'villanyszereles-szeged-hero.jpeg', w: 1500, h: 1368 },
    mobil: { file: 'villanyszereles-szeged-hero-mobil.webp', w: 780, h: 711 },
    mobilAr: '780 / 600',
  },
  cta: 'Ingyenes árajánlat kérése',
  intro: 'Kisebb hibaelhárítástól a nagyobb villanyszerelési munkákig vállalunk megbízható, szakszerű kivitelezést Szegeden és környékén. Egy hibásan vagy házilag megoldott elektromos munka biztonsági kockázatot is jelenthet, ezért érdemes szakemberre bízni, akkor is, ha elsőre egyszerűnek tűnik a feladat.',
  szolgCim: 'Mit tartalmaz szolgáltatásunk ?',
  szolg: [
    { ikon: 'villam', t: 'Hibaelhárítás: meghibásodások diagnosztizálása és javítása.' },
    { ikon: 'konnektor', t: 'Kapcsolók, konnektorok cseréje és bővítése.' },
    { ikon: 'izzo', t: 'Világítás kiépítése, bővítése.' },
    { ikon: 'halozat', t: 'Kisebb elektromos hálózat-bővítési munkák.' },
  ],
  arCim: 'Ár',
  ar: 'Egy konnektorcsere és egy nagyobb hálózatbővítés ára jellemzően nagyságrendekben tér el egymástól, ezért ennél a szolgáltatásnál különösen fontos, hogy pontosan lássuk a feladatot. A munka jellegének felmérése után adunk reális, fix árajánlatot, mielőtt bármi elkezdődne.',
  kapcsolodo: { cim: 'Kapcsolódó oldal:', linkek: [{ t: 'Főoldal', href: '/' }] },
  gyikCim: 'GYIK',
  gyik: [
    { q: 'Milyen munkákat vállalnak?', a: 'Hibaelhárítást (a meghibásodások diagnosztizálását és javítását), kapcsolók és konnektorok cseréjét, világítás kiépítését és bővítését, valamint kisebb hálózatbővítést vállalunk.' },
    { q: 'Mennyibe kerül a villanyszerelés?', a: 'Egy konnektorcsere és egy nagyobb hálózatbővítés ára nagyságrendekkel tér el egymástól, ezért a munka felmérése után adunk árajánlatot, mielőtt bármi elkezdődne.' },
    { q: 'Sürgős hibaelhárítás esetén mennyi idő alatt tudnak kijönni?', a: 'Hívjon minket telefonon, és egyeztetünk egy mihamarabbi időpontot az adott nap elfoglaltságától függően.', tel: true },
    { q: 'Mit tegyek, ha égésszagot vagy szikrázást észlelek?', a: 'Ha égésszagot, füstöt vagy szikrázást észlel, vagy tűz vagy áramütés veszélye áll fenn, azonnal hívja a [112](tel:112)-t. Utána a telefonszámunkon is szólhat: [+36 20 373 4991](tel:+36203734991).', figyelem: true },
  ],
  service: {
    serviceType: 'Villanyszerelés',
    name: 'Villanyszerelés Szegeden',
    description: 'Hibaelhárítás, konnektor- és kapcsolócsere, világítás kiépítése, kisebb hálózatbővítés.',
    breadcrumb: 'Villanyszerelés',
  },
};
