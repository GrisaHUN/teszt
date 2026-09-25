(function () {
  // "Ingyenes árajánlat kérése" gombok működése:
  //   'link'  = a gomb href-je (Zoho foglalási oldal, új lapon)
  //   'popup' = az oldal Systeme.io popup-gombját nyomja meg, ha van; ha nincs, marad a link
  var AJANLAT_MOD = 'link';

  if (window.__G__) return;
  window.__G__ = true;
  var root = document.getElementById('__R__');
  if (!root) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;
  root.classList.add('__P__js');

  var rv = root.querySelectorAll('.__P__rv');
  if (reduce || !hasIO) {
    rv.forEach(function (el) { el.classList.add('__P__in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('__P__in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    rv.forEach(function (el) { io.observe(el); });
  }

  if (AJANLAT_MOD === 'popup') {
    root.querySelectorAll('[data-__P__ajanlat]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var b = document.querySelector('[data-test-id="show-popup-button"]');
        if (b) { e.preventDefault(); b.click(); }
      });
    });
  }

  // Lebegő gomb: csak a hero után látszik, és eltűnik, amikor a záró gombsor képernyőre ér.
  var fab = root.querySelector('.__P__fab');
  var hero = document.querySelector('.__P__hero');
  var cta = document.querySelector('.__P__cta');
  if (fab && hero && hasIO) {
    var heroSeen = true, ctaSeen = false;
    var sync = function () { fab.classList.toggle('__P__show', !heroSeen && !ctaSeen && hero.getBoundingClientRect().bottom < 0); };
    var fabIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.target === hero) heroSeen = e.isIntersecting;
        else ctaSeen = e.isIntersecting;
      });
      sync();
    });
    fabIO.observe(hero);
    if (cta) fabIO.observe(cta);
  }
/*__PAGE_JS__*/
})();
