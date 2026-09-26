  // Hero parallax (mint a mobil blokkban): a fotó görgetésre lassan lefelé
  // csúszik és kicsit nagyobb; a mozgás a hero magasságával arányos.
  var hero = root.querySelector('.jkh-hero');
  var photo = root.querySelector('.jkh-hero-photo');
  if (!reduce && hero && photo) {
    var ticking = false;
    var drift = function () {
      ticking = false;
      var r = hero.getBoundingClientRect();
      if (!r.height || r.bottom < 0) return;
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var p = Math.max(0, Math.min(1, -r.top / vh));
      photo.style.transform = 'translateY(' + (p * r.height * 0.15).toFixed(1) + 'px) scale(1.06)';
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(drift); }
    }, { passive: true });
    window.addEventListener('resize', drift, { passive: true });
    drift();
  }
