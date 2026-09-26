(function () {
  if (window.__G__) return;
  window.__G__ = true;
  var root = document.getElementById('__R__');
  if (!root) return;
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var hasIO = 'IntersectionObserver' in window;
  root.classList.add('jkh-js');

  // Felfedés görgetésre: a szöveg a HTML-ben van, a script csak a láthatóságot vezérli.
  // A .jkh-group (pl. vízszintes körhinta) elemei együtt jelennek meg, amikor a csoport látszik.
  var rv = Array.prototype.slice.call(root.querySelectorAll('.jkh-rv'));
  var show = function (el) {
    el.classList.add('jkh-in');
    setTimeout(function () { el.classList.add('jkh-done'); }, 1200);
    if (el.classList.contains('jkh-group')) el.querySelectorAll('.jkh-rv').forEach(function (c) { c.classList.add('jkh-in'); });
  };
  var groups = Array.prototype.slice.call(root.querySelectorAll('.jkh-group'));
  if (reduce || !hasIO) {
    rv.forEach(show);
    groups.forEach(show);
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    rv.forEach(function (el) { if (!el.closest('.jkh-group') || el.classList.contains('jkh-group')) io.observe(el); });
    groups.forEach(function (el) { if (!el.classList.contains('jkh-rv')) io.observe(el); });
    // Biztonsági háló: ami a betöltéskor már a látótérben van, az ne várjon.
    setTimeout(function () {
      rv.concat(groups).forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < innerHeight && r.bottom > 0 && !(el.parentElement && el.parentElement.closest('.jkh-group:not(.jkh-in)'))) show(el);
      });
    }, 1200);
  }

  // Ikon-animáció: egér rámutatáskor egyszer nagyít, és a keret széléről
  // két üres lime gyűrű tágul kifelé; érintésre ugyanez, egyszer.
  if (!reduce) {
    root.querySelectorAll('.jkh-badge').forEach(function (b) {
      var rings = [0, 1].map(function () {
        var r = document.createElement('span');
        r.className = 'jkh-ring';
        r.setAttribute('aria-hidden', 'true');
        b.appendChild(r);
        return r;
      });
      var wave = function () {
        rings.forEach(function (r) { r.classList.remove('jkh-go'); void r.offsetWidth; r.classList.add('jkh-go'); });
      };
      var touchT = null;
      // Ha a jelvény egy .jkh-hover-host kártyában ül, a kártya bármely pontja indítja.
      var host = b.closest('.jkh-hover-host') || b;
      host.addEventListener('pointerenter', function (e) {
        if (e.pointerType !== 'mouse') return;
        b.classList.add('jkh-zoom');
        wave();
      });
      host.addEventListener('pointerleave', function (e) {
        if (e.pointerType === 'mouse') b.classList.remove('jkh-zoom');
      });
      b.addEventListener('touchstart', function () {
        b.classList.add('jkh-zoom');
        wave();
        clearTimeout(touchT);
        touchT = setTimeout(function () { b.classList.remove('jkh-zoom'); }, 420);
      }, { passive: true });
    });
  }

  // Hézagtöltés: a Systeme.io sorai és szekciói a blokk köré margót tehetnek.
  // A blokk megméri a rést a következő blokkig vagy a láblécig (és az első blokk
  // a fejlécig), és a saját záró (nyitó) színével tölti ki.
  var fill = function () {
    var r = root.getBoundingClientRect();
    if (!r.height) return;
    var cands = Array.prototype.slice.call(document.querySelectorAll('[id^="jkh-b"], footer, header'));
    var next = null, prev = null;
    cands.forEach(function (c) {
      if (c === root || root.contains(c) || c.contains(root)) return;
      var cr = c.getBoundingClientRect();
      if (!cr.height) return;
      var pos = root.compareDocumentPosition(c);
      if ((pos & 4) && !next) next = cr;
      if (pos & 2) prev = { r: cr, el: c };
    });
    var gb = next ? Math.round(next.top - r.bottom) : 0;
    root.style.setProperty('--jkh-fill-b', (gb > 0 && gb <= 160 ? gb : 0) + 'px');
    var gt = 0;
    if (prev && prev.el.tagName === 'HEADER') {
      var fixed = /fixed|sticky/.test(getComputedStyle(prev.el).position);
      gt = fixed ? 0 : Math.round(r.top - prev.r.bottom);
    }
    root.style.setProperty('--jkh-fill-t', (gt > 0 && gt <= 160 ? gt : 0) + 'px');
  };
  var fillT = null;
  var fillSoon = function () { clearTimeout(fillT); fillT = setTimeout(fill, 120); };
  fill();
  window.addEventListener('load', fill);
  window.addEventListener('resize', fillSoon, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(fillSoon).observe(document.body);
/*@MODULES*/
})();
