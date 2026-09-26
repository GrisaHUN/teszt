// Villanyszerelés: egyetlen reszponzív blokk (mobil-first, desktop 801 px-től). Szöveg: src/tartalom/villanyszereles.mjs
import { hero, feats, faq, cta, related, ctaAside } from './_reszek.mjs';

export default (c, h) => `
${hero(c, h, { variant: '__P__hero-split' })}

<section class="__P__sec">
<div class="__P__wrap">
<div class="__P__callout __P__intro-card __P__card __P__host __P__rv __P__up">
${h.badge('pajzs')}
<p class="__P__lead">${c.intro}</p>
</div>
</div>
${h.wave('#F5F6F8')}
</section>

<section class="__P__sec __P__sec-gray" aria-labelledby="__P__feat-h">
<div class="__P__wrap">
<h2 id="__P__feat-h" class="__P__h2 __P__center __P__rv __P__up">${c.szolgCim}</h2>
${feats(c.szolg, h)}
</div>
${h.wave('#FFFFFF')}
</section>

<section class="__P__sec" aria-labelledby="__P__ar-h">
<div class="__P__wrap __P__pricing-grid">
<div class="__P__pricing-text">
<h2 id="__P__ar-h" class="__P__h2 __P__rv __P__up">${c.arCim}</h2>
<p class="__P__p __P__rv __P__up">${c.ar}</p>
</div>
${ctaAside(c, h, 'tel')}
<div class="__P__brands-foot __P__rv __P__up">${related(c, h)}</div>
</div>
${h.wave('#F5F6F8')}
</section>

${faq(c, h)}
${cta(c, h)}`;
