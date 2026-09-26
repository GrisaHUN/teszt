// Közös oldalrészek a szolgáltatás-oldalak sablonjaihoz (hero, GYIK, záró gombsor, lebegő gomb).

// Hero: variant = '' (teljes fotó, sötétkék fátyol), '__P__hero-split' (kép jobbra, szöveg balra),
// '__P__hero-light' (fehér hátterű illusztráció, sötét szöveg). A mobil kép-arány: c.hero.mobilAr.
export const hero = (c, h, { variant = '', tel = '__P__btn-ghost', next = '#FFFFFF' } = {}) => `
<section class="__P__hero${variant ? ' ' + variant : ''}" aria-labelledby="__P__h1"${c.hero.mobilAr ? ` style="--__P__hero-ar:${c.hero.mobilAr}"` : ''}>
<div class="__P__hero-media">${h.hero(c.hero.desktop, c.hero.mobil, c.hero.alt)}</div>
<div class="__P__wrap __P__hero-inner">
<div class="__P__hero-box">
<h1 id="__P__h1" class="__P__h1">${c.hero.h1}</h1>
<div class="__P__btns">
${h.zoho(c.cta)}
${h.tel(tel)}
</div>
</div>
</div>
${h.wave(next)}
</section>`;

// Lépések (számozott kártyák ikonnal; mobilon idővonal).
export const steps = (list, h, cls = '') => `<ol class="__P__steps${cls ? ' ' + cls : ''}">
${list.map((s, i) => `<li class="__P__step __P__rv __P__up" style="--__P__d:${(i % 3) * 110}ms">
<span class="__P__step-num" aria-hidden="true">${i + 1}</span>
<div class="__P__step-card __P__card __P__host">
${h.badge(s.ikon, '__P__step-ic')}
<p class="__P__step-text">${s.t}</p>
${s.kiemeles ? `<p class="__P__free">${s.kiemeles}</p>` : ''}
</div>
</li>`).join('\n')}
</ol>`;

// Ikonos kártyák (pl. „Teljeskörű tisztítást végzünk!”, „Mit tartalmaz szolgáltatásunk ?”).
export const feats = (list, h) => `<ul class="__P__feats">
${list.map((f, i) => `<li class="__P__feat __P__card __P__host __P__rv __P__up" style="--__P__d:${(i % 4) * 90}ms">
${h.badge(f.ikon)}
<p class="__P__feat-text">${f.t}</p>
</li>`).join('\n')}
</ul>`;

export const related = (c, h) => `<p class="__P__related">${c.kapcsolodo.cim} ${c.kapcsolodo.linkek.map((l) => h.link(l.t, l.href)).join(', ')}</p>`;

// Oldalsó kiemelés ár nélkül (desktopon; mobilon a hero-gombok és a lebegő gomb elég).
export const ctaAside = (c, h, ikon) => `<aside class="__P__price __P__price-cta __P__rv __P__zoomin" aria-label="${c.cta}">
<div class="__P__price-head">${h.badge(ikon, '__P__badge-lime')}</div>
<div class="__P__btns">
${h.zoho(c.cta)}
${h.tel()}
</div>
</aside>`;

// GYIK: mindig nyitva. f.tel: telefon-gomb a válasz alatt; f.figyelem: kiemelt biztonsági sor.
export const faq = (c, h, { gray = true, next = '#0E1C43' } = {}) => `
<section class="__P__sec${gray ? ' __P__sec-gray' : ''}" aria-labelledby="__P__faq-h">
<div class="__P__wrap __P__faq-grid">
<div class="__P__faq-side">
<h2 id="__P__faq-h" class="__P__h2 __P__rv __P__up">${c.gyikCim}</h2>
<div class="__P__rv __P__up" style="--__P__d:100ms">${h.tel('__P__btn-line')}</div>
</div>
<div class="__P__faq-list">
${c.gyik.map((f, i) => `<div class="__P__qa${f.figyelem ? ' __P__qa-warn' : ''} __P__card __P__host __P__rv __P__up" style="--__P__d:${i * 60}ms">
${f.figyelem ? h.badge('figyelem', '__P__qa-ic') : '<span class="__P__badge __P__qa-ic" aria-hidden="true">?</span>'}
<h3 class="__P__qa-q">${f.q}</h3>
<p class="__P__qa-a">${h.md(f.a)}</p>
${f.tel ? `<div class="__P__qa-extra">${h.tel('__P__btn-line')}</div>` : ''}
</div>`).join('\n')}
</div>
</div>
${h.wave(next)}
</section>`;

export const cta = (c, h) => `
<section class="__P__cta" aria-label="${c.cta}">
<div class="__P__wrap __P__btns __P__rv __P__up">
${h.zoho(c.cta)}
${h.tel()}
</div>
</section>
<div class="__P__fab">${h.zoho(c.cta)}</div>`;
