// Forgalmazott készülékek (hub): egyetlen reszponzív blokk. Szöveg: src/tartalom/keszulekek.mjs
// A háttér két félkép egymás mellé illesztve (8 px átfedéssel); mobilon csak a jobb fele töltődik le.
import { faq, cta } from './_reszek.mjs';

export default (c, h) => `
<section class="__P__hero __P__hub-hero" aria-labelledby="__P__h1">
<div class="__P__sav-wrap">
<div class="__P__sav">
<picture class="__P__sav-bal"><source media="(max-width: 800px)" srcset="${h.pixel}"><img src="${h.img(c.hero.kepBal.file)}" alt="Nappali nagy ablakokkal a kertre" width="${c.hero.kepBal.w}" height="${c.hero.kepBal.h}" loading="eager" fetchpriority="high"></picture>
<img class="__P__sav-jobb" src="${h.img(c.hero.kepJobb.file)}" alt="${c.hero.alt}" width="${c.hero.kepJobb.w}" height="${c.hero.kepJobb.h}" loading="eager" fetchpriority="high">
</div>
</div>
<div class="__P__wrap __P__hero-inner">
<div class="__P__hero-box">
<h1 id="__P__h1" class="__P__h1">${c.hero.h1}</h1>
<p class="__P__hero-sub">${c.hero.alcim}</p>
<div class="__P__btns">
${h.zoho(c.cta)}
${h.tel()}
</div>
</div>
</div>
${h.wave('#F5F6F8')}
</section>

<section class="__P__sec __P__sec-gray" aria-labelledby="__P__brands-h">
<div class="__P__wrap">
<h2 id="__P__brands-h" class="__P__h2 __P__center __P__rv __P__up">${c.markakCim}</h2>
<ul class="__P__brand-grid">
${c.markak.map((b, i) => `<li class="__P__rv __P__up" style="--__P__d:${(i % 4) * 80}ms"><a class="__P__brand __P__card __P__host" href="/${b.slug}">
<span class="__P__brand-logo"><img src="${h.img(b.logo)}" alt="${b.alt}" width="480" height="300" loading="lazy" decoding="async"></span>
<span class="__P__brand-body"><span class="__P__brand-name">${b.nev}</span><span class="__P__brand-meta">${b.db} modell</span></span>
<span class="__P__badge __P__badge-sm __P__badge-lime __P__brand-go">${h.icon('nyil')}</span>
</a></li>`).join('\n')}
<li class="__P__rv __P__up" style="--__P__d:240ms"><a class="__P__brand __P__brand-deal __P__card __P__host" href="${c.kedvezo.href}">
<span class="__P__brand-logo"><img src="${h.img(c.kedvezo.file)}" alt="${c.kedvezo.alt}" width="${c.kedvezo.w}" height="${c.kedvezo.h}" loading="lazy" decoding="async"></span>
<span class="__P__brand-body"><span class="__P__brand-name">${c.kedvezo.nev}</span></span>
<span class="__P__badge __P__badge-sm __P__badge-lime __P__brand-go">${h.icon('nyil')}</span>
</a></li>
</ul>
</div>
${h.wave('#FFFFFF')}
</section>

<section class="__P__sec" aria-label="Az árakról">
<div class="__P__wrap">
<div class="__P__callout __P__intro-card __P__card __P__host __P__rv __P__up">
${h.badge('cimke')}
<div>${c.osszegzes.map((p) => `<p class="__P__p">${h.md(p)}</p>`).join('\n')}</div>
</div>
</div>
${h.wave('#F5F6F8')}
</section>

${faq(c, h)}
${cta(c, h)}`;
