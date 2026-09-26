// Klímaszerelés: egyetlen reszponzív blokk (mobil-first, desktop 801 px-től). Szöveg: src/tartalom/klimaszereles.mjs
export default (c, h) => {
  const ar = h.ar(c.ar);
  return `
<section class="__P__hero" aria-labelledby="__P__h1">
<div class="__P__hero-media">${h.hero(c.hero.desktop, c.hero.mobil, c.hero.alt)}</div>
<div class="__P__wrap __P__hero-inner">
<div class="__P__hero-box">
<h1 id="__P__h1" class="__P__h1">${c.hero.h1}</h1>
<div class="__P__btns">
${h.zoho(c.cta)}
${h.tel()}
</div>
</div>
</div>
${h.wave('#FFFFFF')}
</section>

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
<ol class="__P__steps">
${c.lepesek.map((s, i) => `<li class="__P__step __P__rv __P__up" style="--__P__d:${(i % 3) * 110}ms">
<span class="__P__step-num" aria-hidden="true">${i + 1}</span>
<div class="__P__step-card __P__card __P__host">
${h.badge(s.ikon, '__P__step-ic')}
<p class="__P__step-text">${s.t}</p>
${s.kiemeles ? `<p class="__P__free">${s.kiemeles}</p>` : ''}
</div>
</li>`).join('\n')}
</ol>
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
<p class="__P__related">${c.kapcsolodo.cim} ${c.kapcsolodo.linkek.map((l) => h.link(l.t, l.href)).join(', ')}</p>
</div>
</div>
</div>
${h.wave('#F5F6F8')}
</section>

<section class="__P__sec __P__sec-gray" aria-labelledby="__P__faq-h">
<div class="__P__wrap __P__faq-grid">
<div class="__P__faq-side">
<h2 id="__P__faq-h" class="__P__h2 __P__rv __P__up">${c.gyikCim}</h2>
<div class="__P__rv __P__up" style="--__P__d:100ms">${h.tel('__P__btn-line')}</div>
</div>
<div class="__P__faq-list">
${c.gyik.map((f, i) => `<div class="__P__qa __P__card __P__host __P__rv __P__up" style="--__P__d:${i * 60}ms">
<span class="__P__badge __P__qa-ic" aria-hidden="true">?</span>
<h3 class="__P__qa-q">${f.q}</h3>
<p class="__P__qa-a">${h.md(f.a)}</p>
</div>`).join('\n')}
</div>
</div>
${h.wave('#0E1C43')}
</section>

<section class="__P__cta" aria-label="${c.cta}">
<div class="__P__wrap __P__btns __P__rv __P__up">
${h.zoho(c.cta)}
${h.tel()}
</div>
</section>
<div class="__P__fab">${h.zoho(c.cta)}</div>`;
};
