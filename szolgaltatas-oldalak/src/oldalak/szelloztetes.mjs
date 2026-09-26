// Hővisszanyerős szellőztetés: egyetlen reszponzív blokk (mobil-first, desktop 801 px-től).
// Szöveg: src/tartalom/szelloztetes.mjs. A hero fehér hátterű illusztráció: világos hero, sötét szöveggel.
import { hero, steps, faq, cta, related, ctaAside } from './_reszek.mjs';

export default (c, h) => `
${hero(c, h, { variant: '__P__hero-light', tel: '__P__btn-line', next: '#F5F6F8' })}

<section class="__P__sec __P__sec-gray">
<div class="__P__wrap __P__intro-grid">
<p class="__P__lead __P__rv __P__up">${c.intro}</p>
<div class="__P__callout __P__card __P__host __P__rv __P__up" style="--__P__d:120ms">
${h.badge('para')}
<div><p class="__P__p __P__callout-head">${c.problema[0]}</p>
<p class="__P__p">${c.problema[1]}</p></div>
</div>
</div>
${h.wave('#FFFFFF')}
</section>

<section class="__P__sec" aria-label="Kivitelezés lépései">
<div class="__P__wrap">
<p class="__P__lead __P__lead-center __P__rv __P__up">${c.kivitelezes}</p>
${steps(c.lepesek, h, '__P__steps-3')}
</div>
${h.wave('#F5F6F8')}
</section>

<section class="__P__sec __P__sec-gray" aria-labelledby="__P__ar-h">
<div class="__P__wrap __P__pricing-grid">
<div class="__P__pricing-text">
<h2 id="__P__ar-h" class="__P__h2 __P__rv __P__up">${c.koltsegCim}</h2>
<p class="__P__p __P__rv __P__up">${c.koltseg}</p>
</div>
${ctaAside(c, h, 'levego')}
<div class="__P__brands-foot __P__rv __P__up">${related(c, h)}</div>
</div>
${h.wave('#FFFFFF')}
</section>

${faq(c, h, { gray: false })}
${cta(c, h)}`;
