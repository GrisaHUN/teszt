// Klímaszerelés, MOBIL blokk (800 px-ig). Szöveg: src/tartalom/klimaszereles.mjs
export default (c, h) => {
  const ar = h.ar(c.ar);
  return `
<section class="__P__hero" aria-labelledby="__P__h1">
<div class="__P__hero-media" style="aspect-ratio:${c.hero.mobil.w} / ${c.hero.mobil.h}">${h.hero(c.hero.mobil, c.hero.alt, '(min-width: 801px)')}</div>
<div class="__P__hero-body">
<h1 id="__P__h1" class="__P__h1 __P__rv __P__up" style="--__P__d:80ms">${c.hero.h1}</h1>
<div class="__P__btns __P__rv __P__up" style="--__P__d:180ms">
${h.zoho(c.cta)}
${h.tel()}
</div>
</div>
${h.wave('#FFFFFF')}
</section>

<section class="__P__sec">
<div class="__P__wrap">
<p class="__P__lead __P__rv __P__up">${c.intro[0]}</p>
<div class="__P__callout __P__card __P__host __P__rv __P__up">
${h.badge(c.introIkon)}
<p class="__P__p">${c.intro[1]}</p>
</div>
</div>
${h.wave('#F5F6F8')}
</section>

<section class="__P__sec __P__sec-gray" aria-labelledby="__P__steps-h">
<div class="__P__wrap">
<h2 id="__P__steps-h" class="__P__h2 __P__rv __P__up">${c.lepesekCim}</h2>
<ol class="__P__steps">
${c.lepesek.map((s, i) => `<li class="__P__step __P__rv __P__right"><span class="__P__step-num" aria-hidden="true">${i + 1}</span><div class="__P__step-card __P__card"><p class="__P__step-text">${s.t}</p>${s.kiemeles ? `<p class="__P__free">${s.kiemeles}</p>` : ''}</div></li>`).join('\n')}
</ol>
</div>
${h.wave('#FFFFFF')}
</section>

<section class="__P__sec">
<div class="__P__wrap">
<p class="__P__p __P__rv __P__up">${c.arMagyarazat}</p>
<div class="__P__price __P__rv __P__zoomin" role="group" aria-label="${ar.label.replace(/:$/, '')}">
<p class="__P__price-label">${ar.label}</p>
<p class="__P__price-value">${ar.value}</p>
</div>
<div class="__P__brands __P__rv __P__up">
<p class="__P__p">${h.md(c.markak)}</p>
</div>
<div class="__P__btns __P__rv __P__up">
${h.keszulekek(c.keszulekekGomb)}
</div>
<p class="__P__related __P__rv __P__up">${c.kapcsolodo.cim} ${c.kapcsolodo.linkek.map((l) => h.link(l.t, l.href)).join(', ')}</p>
</div>
${h.wave('#F5F6F8')}
</section>

<section class="__P__sec __P__sec-gray" aria-labelledby="__P__faq-h">
<div class="__P__wrap">
<h2 id="__P__faq-h" class="__P__h2 __P__rv __P__up">${c.gyikCim}</h2>
<div class="__P__faq-list">
${c.gyik.map((f) => `<div class="__P__qa __P__card __P__host __P__rv __P__up">
<div class="__P__qa-head"><span class="__P__badge __P__qa-ic" aria-hidden="true">?</span><h3 class="__P__qa-q">${f.q}</h3></div>
<p class="__P__qa-a">${h.md(f.a)}</p>
</div>`).join('\n')}
</div>
</div>
${h.wave('#0E1C43')}
</section>

<section class="__P__cta" aria-label="${c.cta}">
<div class="__P__btns __P__rv __P__up">
${h.zoho(c.cta)}
${h.tel()}
</div>
</section>
<div class="__P__fab">${h.zoho(c.cta)}</div>`;
};
