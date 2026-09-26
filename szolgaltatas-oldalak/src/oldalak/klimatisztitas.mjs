// Klímatisztítás: egyetlen reszponzív blokk (mobil-first, desktop 801 px-től). Szöveg: src/tartalom/klimatisztitas.mjs
import { hero, feats, faq, cta, related } from './_reszek.mjs';

export default (c, h) => {
  const ar = h.ar(c.ar);
  return `
${hero(c, h)}

<section class="__P__sec" aria-labelledby="__P__why-h">
<div class="__P__wrap __P__intro-grid">
<div class="__P__why-text">
<h2 id="__P__why-h" class="__P__h2 __P__rv __P__up">${c.miertCim}</h2>
${c.miert.map((p, i) => `<p class="__P__p __P__rv __P__up"${i ? ` style="--__P__d:${i * 80}ms"` : ''}>${p}</p>`).join('\n')}
</div>
<div class="__P__method __P__card __P__host __P__rv __P__up" style="--__P__d:120ms">
${h.badge('csepp', '__P__badge-lime')}
<p class="__P__method-text">${c.modszer}</p>
</div>
</div>
${h.wave('#F5F6F8')}
</section>

<section class="__P__sec __P__sec-gray" aria-labelledby="__P__feat-h">
<div class="__P__wrap">
<h2 id="__P__feat-h" class="__P__h2 __P__center __P__rv __P__up">${c.teljesCim}</h2>
${feats(c.teljes, h)}
</div>
${h.wave('#FFFFFF')}
</section>

<section class="__P__sec __P__gal-sec" aria-label="Referencia-fotók">
<div class="__P__wrap __P__gal __P__rv __P__up">
<div class="__P__car __P__gal-car">
<button type="button" class="__P__arrow __P__prev" aria-label="Előző fotók">${h.arrow('prev')}</button>
<div class="__P__scroller __P__gal-vp" tabindex="0" role="region" aria-label="Referencia-fotók, lapozható">
<ul class="__P__gal-track">
${c.galeria.map((g) => `<li class="__P__slide"><button type="button" class="__P__ref" aria-label="Nagyítás: ${g.alt.charAt(0).toLowerCase() + g.alt.slice(1)}"><img src="${g.src}" alt="${g.alt}" width="${g.w}" height="${g.h}" loading="lazy" decoding="async"></button></li>`).join('\n')}
</ul>
</div>
<button type="button" class="__P__arrow __P__next" aria-label="Következő fotók">${h.arrow('next')}</button>
<div class="__P__dots"></div>
</div>
</div>
${h.wave('#F5F6F8')}
</section>

<section class="__P__sec __P__sec-gray" aria-label="Időszak, gyakoriság és ár">
<div class="__P__wrap __P__seasons">
${c.szezon.map((s, i) => `<div class="__P__season __P__host __P__rv __P__up" style="--__P__d:${i * 110}ms">${h.badge(s.ikon, '__P__badge-lime')}<p class="__P__season-text">${s.eleje} <strong>${s.kiemelt}</strong></p></div>`).join('\n')}
</div>
<div class="__P__wrap __P__pricing-grid __P__season-grid">
<div class="__P__pricing-text">
${c.gyakorisag.map((p) => `<p class="__P__p __P__rv __P__up">${p}</p>`).join('\n')}
<div class="__P__note __P__rv __P__up">${h.badge('pajzs')}<p class="__P__p">${c.jotallas}</p></div>
</div>
<aside class="__P__price __P__rv __P__zoomin" aria-label="${ar.label.replace(/:$/, '')}">
<div class="__P__price-head">${h.badge('cimke', '__P__badge-lime')}<p class="__P__price-label">${ar.label}</p></div>
<p class="__P__price-value">${ar.value}</p>
<div class="__P__btns">
${h.zoho(c.cta)}
${h.tel()}
</div>
</aside>
<div class="__P__brands-foot __P__rv __P__up">${related(c, h)}</div>
</div>
${h.wave('#FFFFFF')}
</section>

${faq(c, h, { gray: false })}
${cta(c, h)}

<div class="__P__lb" role="dialog" aria-modal="true" aria-label="Referencia-fotó nagyítva" hidden>
<button type="button" class="__P__lb-btn __P__lb-close" aria-label="Bezárás">&#10005;</button>
<button type="button" class="__P__lb-btn __P__lb-prev" aria-label="Előző fotó">${h.arrow('prev')}</button>
<button type="button" class="__P__lb-btn __P__lb-next" aria-label="Következő fotó">${h.arrow('next')}</button>
<img class="__P__lb-img" alt="Referencia-fotó nagyítva" width="1125" height="1500">
</div>`;
};
