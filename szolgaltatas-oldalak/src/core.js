(function () {
  if (window.__G__) return;
  window.__G__ = true;
  var root = document.getElementById('__R__');
  if (!root) return;
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var hasIO = 'IntersectionObserver' in window;
  root.classList.add('__P__js');

  // Foglalási link: a cél egy helyen, a gyökér data-__P__foglalas attribútumában van;
  // a gombok href-je ugyanez (JS nélkül is működjön), a script ehhez igazítja őket.
  var foglalas = root.getAttribute('data-__P__foglalas');
  if (foglalas) root.querySelectorAll('[data-__P__zoho]').forEach(function (a) { a.setAttribute('href', foglalas); });

  // Felfedés görgetésre: a szöveg a HTML-ben van, a script csak a láthatóságot vezérli.
  var rv = Array.prototype.slice.call(root.querySelectorAll('.__P__rv'));
  var show = function (el) {
    el.classList.add('__P__in');
    setTimeout(function () { el.classList.add('__P__done'); }, 1100);
  };
  if (reduce || !hasIO) {
    rv.forEach(show);
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0, rootMargin: '0px 0px 5% 0px' });
    rv.forEach(function (el) { io.observe(el); });
    // Biztonsági háló: ami betöltéskor már a látótérben van, az ne várjon.
    setTimeout(function () {
      rv.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < innerHeight && r.bottom > 0) show(el);
      });
    }, 1200);
  }

  // Ikon-animáció: egér rámutatáskor egyszer nagyít, és a keret széléről két üres
  // lime gyűrű tágul kifelé; érintésre ugyanez, egyszer. Ha a jelvény egy
  // .__P__host elemben (kártya, gomb) ül, annak bármely pontja indítja.
  if (!reduce) {
    root.querySelectorAll('.__P__badge').forEach(function (b) {
      var rings = [0, 1].map(function () {
        var r = document.createElement('span');
        r.className = '__P__ring';
        r.setAttribute('aria-hidden', 'true');
        b.appendChild(r);
        return r;
      });
      var wave = function () {
        rings.forEach(function (r) { r.classList.remove('__P__go'); void r.offsetWidth; r.classList.add('__P__go'); });
      };
      var host = b.closest('.__P__host') || b;
      var touchT = null;
      host.addEventListener('pointerenter', function (e) {
        if (e.pointerType !== 'mouse') return;
        b.classList.add('__P__zoom');
        wave();
      });
      host.addEventListener('pointerleave', function (e) {
        if (e.pointerType === 'mouse') b.classList.remove('__P__zoom');
      });
      host.addEventListener('touchstart', function () {
        b.classList.add('__P__zoom');
        wave();
        clearTimeout(touchT);
        touchT = setTimeout(function () { b.classList.remove('__P__zoom'); }, 420);
      }, { passive: true });
    });
  }

  // Hézagtöltés: a Systeme.io sora és szekciója margót tehet a blokk köré. A blokk
  // megméri a rést a fejlécig és a láblécig, és a saját nyitó (záró) színével tölti ki.
  var fill = function () {
    var r = root.getBoundingClientRect();
    if (!r.height) return;
    var head = null, foot = null;
    document.querySelectorAll('header, footer').forEach(function (c) {
      if (c.contains(root)) return;
      var cr = c.getBoundingClientRect();
      if (!cr.height) return;
      var pos = root.compareDocumentPosition(c);
      if ((pos & 4) && !foot && c.tagName === 'FOOTER') foot = cr;
      if ((pos & 2) && c.tagName === 'HEADER' && !/fixed|sticky/.test(getComputedStyle(c).position)) head = cr;
    });
    var gb = foot ? Math.round(foot.top - r.bottom) : 0;
    var gt = head ? Math.round(r.top - head.bottom) : 0;
    root.style.setProperty('--__P__fill-b', (gb > 0 && gb <= 160 ? gb : 0) + 'px');
    root.style.setProperty('--__P__fill-t', (gt > 0 && gt <= 160 ? gt : 0) + 'px');
  };
  var fillT = null;
  var fillSoon = function () { clearTimeout(fillT); fillT = setTimeout(fill, 120); };
  fill();
  window.addEventListener('load', fill);
  window.addEventListener('resize', fillSoon, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(fillSoon).observe(document.body);

  // Lebegő gomb (mobil): csak a hero után látszik, és eltűnik, amikor a záró gombsor képernyőre ér.
  var fab = root.querySelector('.__P__fab');
  var hero = root.querySelector('.__P__hero');
  var cta = root.querySelector('.__P__cta');
  if (fab && hero) {
    // Csak a hero után látszik, és eltűnik, amint a záró gombsor képernyőre ér (alatta, a láblécnél sem jön vissza).
    var sync = function () { fab.classList.toggle('__P__show', hero.getBoundingClientRect().bottom < 0 && (!cta || cta.getBoundingClientRect().top > innerHeight)); };
    var fabT = null;
    var onScroll = function () { if (!fabT) fabT = requestAnimationFrame(function () { fabT = null; sync(); }); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    sync();
  }
/*@PAGE_JS*/
})();
