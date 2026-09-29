// Márka-oldal (AUX, Daikin, Fisher, Gree, Midea, Polar, Syen): egyetlen reszponzív blokk.
// Szöveg és modellek: src/tartalom/markak.mjs. Az energiaosztály-sor csak ott jelenik meg, ahol az
// `energia` mező ki van töltve (jelenleg a Gree Amber Royal és a Syen Muse Next).
import { feats, cta } from './_reszek.mjs';

export default (c, h) => {
  const b = c.marka;
  const n = b.modellek.length;
  return `
<section class="__P__hero __P__brand-hero" aria-labelledby="__P__h1">
<div class="__P__wrap __P__bh-grid">
<div class="__P__bh-logo"><img src="${h.img(c.hero.logo.file)}" alt="${c.hero.logo.alt}" width="${c.hero.logo.w}" height="${c.hero.logo.h}" loading="eager" fetchpriority="high"></div>
<div class="__P__hero-box">
<h1 id="__P__h1" class="__P__h1">${c.hero.h1}</h1>
<p class="__P__hero-sub">${c.hero.intro} ${c.hero.intro2}</p>
<div class="__P__btns">
${h.zoho(c.cta)}
${h.tel()}
</div>
</div>
</div>
${h.wave('#F5F6F8')}
</section>

<section class="__P__sec __P__sec-gray" aria-labelledby="__P__models-h">
<div class="__P__wrap">
<h2 id="__P__models-h" class="__P__h2 __P__center __P__rv __P__up">${c.modellekCim}</h2>
<div class="__P__models __P__models-n${n}">
${b.modellek.map((m, i) => `<article class="__P__model __P__card __P__host __P__rv __P__up" style="--__P__d:${(i % 3) * 100}ms">
<div class="__P__model-head">${h.badge('hopehely')}<h3 class="__P__model-name">${m.nev}</h3></div>
<ul class="__P__model-tags">${m.jelzo ? `<li class="__P__tag-hl">${m.jelzo}</li>` : ''}<li>${m.telj}</li><li>${m.tipus}</li></ul>
${m.energia ? `<p class="__P__model-energy">${m.energia}</p>` : ''}
<p class="__P__model-price"><span class="__P__model-price-l">${c.arCimke}</span> <span class="__P__model-price-v">${h.nb(m.ar)}</span></p>
</article>`).join('\n')}
</div>
</div>
${h.wave('#FFFFFF')}
</section>

<section class="__P__sec" aria-labelledby="__P__install-h">
<div class="__P__wrap __P__install-grid">
<div>
<h2 id="__P__install-h" class="__P__h2 __P__rv __P__up">${c.beszerelesCim}</h2>
${feats(c.beszereles, h, '__P__feats-compact')}
<p class="__P__p __P__install-link __P__rv __P__up">${h.md(c.beszerelesLink)}</p>
</div>
<aside class="__P__warranty __P__card __P__host __P__rv __P__zoomin" aria-labelledby="__P__warranty-h">
${h.badge('pajzs', '__P__badge-lime')}
<h3 id="__P__warranty-h" class="__P__warranty-h">Garancia</h3>
<p class="__P__warranty-t">${c.garancia}</p>
</aside>
</div>
${h.wave('#F5F6F8')}
</section>

<section class="__P__sec __P__sec-gray __P__related-sec" aria-labelledby="__P__rel-h">
<nav class="__P__wrap __P__rel __P__rv __P__up" aria-labelledby="__P__rel-h">
<h2 id="__P__rel-h" class="__P__rel-h">${c.kapcsolodoCim}</h2>
<ul class="__P__rel-list">
${c.kapcsolodo.map((t) => `<li>${h.md(t)}</li>`).join('\n')}
</ul>
</nav>
${h.wave('#0E1C43')}
</section>
${cta(c, h)}`;
};
