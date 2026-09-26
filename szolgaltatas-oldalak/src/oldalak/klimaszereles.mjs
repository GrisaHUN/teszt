// Klímaszerelés: egyetlen reszponzív blokk (mobil-first, desktop 801 px-től). Szöveg: src/tartalom/klimaszereles.mjs
import { hero, steps, faq, cta, related } from './_reszek.mjs';

export default (c, h) => {
  const ar = h.ar(c.ar);
  return `
${hero(c, h)}

<section class="__P__sec">
<div class="__P__wrap __P__intro-grid">
<p class="__P__lead __P__rv __P__up">${c.intro[0]}</p>
<div class="__P__callout __P__card __P__host __P__rv __P__up" style="--__P__d:120ms">
${h.badge(c.introIkon)}
<p class="__P__p">${c.intro[1]}</p>
</div>
</div>
${h.wave('#F5F6F8')}
</section>

<section class="__P__sec __P__sec-gray" aria-labelledby="__P__steps-h">
<div class="__P__wrap">
<h2 id="__P__steps-h" class="__P__h2 __P__center __P__rv __P__up">${c.lepesekCim}</h2>
${steps(c.lepesek, h)}
</div>
${h.wave('#FFFFFF')}
</section>

<section class="__P__sec">
<div class="__P__wrap __P__pricing-grid">
<p class="__P__p __P__pricing-text __P__rv __P__up">${c.arMagyarazat}</p>
<aside class="__P__price __P__rv __P__zoomin" aria-label="${ar.label.replace(/:$/, '')}">
<div class="__P__price-head">${h.badge('cimke', '__P__badge-lime')}<p class="__P__price-label">${ar.label}</p></div>
<p class="__P__price-value">${ar.value}</p>
<div class="__P__btns">
${h.zoho(c.cta)}
${h.tel()}
</div>
</aside>
<div class="__P__brands __P__rv __P__up">
<div class="__P__brands-box"><p class="__P__p">${h.md(c.markak)}</p></div>
<div class="__P__brands-foot">
${h.keszulekek(c.keszulekekGomb)}
${related(c, h)}
</div>
</div>
</div>
${h.wave('#F5F6F8')}
</section>

${faq(c, h)}
${cta(c, h)}`;
};
