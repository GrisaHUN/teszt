  // Körhinta: görgethető sáv scroll-snappel; mobilon pöttyök, desktopon nyilak,
  // egérrel húzható, billentyűzettel (nyilak) léptethető.
  var carousel = function (car, label, onCenter) {
    var vp = car.querySelector('.jkh-scroller');
    var items = vp ? Array.prototype.slice.call(vp.querySelectorAll('.jkh-slide')) : [];
    if (!vp || !items.length) return;
    var dotsWrap = car.querySelector('.jkh-dots');
    var prev = car.querySelector('.jkh-prev');
    var next = car.querySelector('.jkh-next');
    var smooth = reduce ? 'auto' : 'smooth';
    var stepW = function () {
      var a = items[0].getBoundingClientRect(), b = items[1] ? items[1].getBoundingClientRect() : a;
      return (b.left - a.left) || a.width;
    };
    var goTo = function (i) {
      var it = items[Math.max(0, Math.min(items.length - 1, i))];
      var center = getComputedStyle(it).scrollSnapAlign.indexOf('center') > -1;
      var left = center ? it.offsetLeft - (vp.clientWidth - it.offsetWidth) / 2 : it.offsetLeft - items[0].offsetLeft;
      vp.scrollTo({ left: left, behavior: smooth });
    };
    var dots = [];
    if (dotsWrap) {
      dots = items.map(function (it, i) {
        var d = document.createElement('button');
        d.type = 'button';
        d.className = 'jkh-dot';
        d.setAttribute('aria-label', label + ' ' + (i + 1));
        d.addEventListener('click', function () { goTo(i); });
        dotsWrap.appendChild(d);
        return d;
      });
    }
    var current = 0;
    var update = function () {
      var c = vp.getBoundingClientRect(), mid = c.left + c.width / 2, best = 0, bestD = Infinity;
      items.forEach(function (el, i) {
        var r = el.getBoundingClientRect(), d = Math.abs(r.left + r.width / 2 - mid);
        if (d < bestD) { bestD = d; best = i; }
      });
      current = best;
      dots.forEach(function (d, i) { d.classList.toggle('jkh-on', i === best); d.setAttribute('aria-current', i === best ? 'true' : 'false'); });
      var max = vp.scrollWidth - vp.clientWidth;
      if (prev) prev.disabled = vp.scrollLeft <= 2;
      if (next) next.disabled = vp.scrollLeft >= max - 2;
      if (onCenter) onCenter(best);
    };
    var t = null;
    vp.addEventListener('scroll', function () { clearTimeout(t); t = setTimeout(update, 60); }, { passive: true });
    window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(update, 120); }, { passive: true });
    if (prev) prev.addEventListener('click', function () { vp.scrollBy({ left: -stepW(), behavior: smooth }); });
    if (next) next.addEventListener('click', function () { vp.scrollBy({ left: stepW(), behavior: smooth }); });
    vp.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); vp.scrollBy({ left: stepW(), behavior: smooth }); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); vp.scrollBy({ left: -stepW(), behavior: smooth }); }
    });
    // Egérrel húzás (érintésnél a böngésző natív görgetése dolgozik).
    var sx = 0, sl = 0, down = false, moved = false;
    vp.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; moved = false; sx = e.clientX; sl = vp.scrollLeft;
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - sx;
      if (!moved && Math.abs(dx) > 6) { moved = true; vp.classList.add('jkh-drag'); }
      if (moved) vp.scrollLeft = sl - dx;
    });
    window.addEventListener('pointerup', function () {
      if (!down) return;
      down = false;
      if (moved) {
        vp.classList.remove('jkh-drag');
        update();
        goTo(current);
        setTimeout(function () { moved = false; }, 0);
      }
    });
    vp.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
    vp.addEventListener('dragstart', function (e) { e.preventDefault(); });
    update();
  };
