  // Körhinta: görgethető sáv scroll-snappel; mobilon pöttyök, desktopon nyilak,
  // egérrel húzható, billentyűzettel (nyilak) léptethető.
  var carousel = function (car, label, onCenter, loopN) {
    var vp = car.querySelector('.__P__scroller');
    var items = vp ? Array.prototype.slice.call(vp.querySelectorAll('.__P__slide')) : [];
    if (!vp || !items.length) return;
    var dotsWrap = car.querySelector('.__P__dots');
    var prev = car.querySelector('.__P__prev');
    var next = car.querySelector('.__P__next');
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
      dots = items.slice(0, loopN || items.length).map(function (it, i) {
        var d = document.createElement('button');
        d.type = 'button';
        d.className = '__P__dot';
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
      var di = loopN ? best % loopN : best;
      dots.forEach(function (d, i) { d.classList.toggle('__P__on', i === di); d.setAttribute('aria-current', i === di ? 'true' : 'false'); });
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
      if (!moved && Math.abs(dx) > 6) { moved = true; vp.classList.add('__P__drag'); }
      if (moved) vp.scrollLeft = sl - dx;
    });
    window.addEventListener('pointerup', function () {
      if (!down) return;
      down = false;
      if (moved) {
        vp.classList.remove('__P__drag');
        update();
        goTo(current);
        setTimeout(function () { moved = false; }, 0);
      }
    });
    vp.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
    vp.addEventListener('dragstart', function (e) { e.preventDefault(); });
    update();
  };
  // Filmszalag: a körhinta alapból lassan, folyamatosan gördül (végtelenítve, a
  // diák másolataival); egérre, érintésre, fókuszra és lapozásra megáll,
  // utána magától folytatja. prefers-reduced-motion esetén nincs mozgás.
  var filmPrep = function (car) {
    var track = car.querySelector('.__P__scroller .__P__slide').parentNode;
    var orig = Array.prototype.slice.call(track.children);
    orig.forEach(function (li, i) { li.setAttribute('data-__P__i', i); });
    if (!reduce) {
      orig.forEach(function (li) {
        var c = li.cloneNode(true);
        c.classList.add('__P__clone');
        c.setAttribute('aria-hidden', 'true');
        c.querySelectorAll('button, a').forEach(function (b) { b.tabIndex = -1; b.removeAttribute('aria-label'); });
        c.querySelectorAll('img').forEach(function (im) { im.alt = ''; });
        track.appendChild(c);
      });
    }
    return { n: orig.length, slides: Array.prototype.slice.call(track.children) };
  };
  var film = function (car, prep, msPerSlide) {
    if (reduce) return;
    var vp = car.querySelector('.__P__scroller');
    var slides = prep.slides, n = prep.n;
    var lbox = root.querySelector('.__P__lb');
    var pos = 0, last = null, paused = false, visible = false, resumeT = null;
    var pause = function () { paused = true; clearTimeout(resumeT); vp.classList.remove('__P__auto'); };
    var resume = function (ms) {
      clearTimeout(resumeT);
      resumeT = setTimeout(function () {
        if ((lbox && lbox.classList.contains('__P__open')) || car.matches(':hover') || car.contains(document.activeElement)) return resume(ms);
        pos = vp.scrollLeft; last = null; paused = false; vp.classList.add('__P__auto');
      }, ms);
    };
    car.addEventListener('mouseenter', pause);
    car.addEventListener('mouseleave', function () { resume(400); });
    car.addEventListener('touchstart', pause, { passive: true });
    car.addEventListener('touchend', function () { resume(3500); }, { passive: true });
    car.addEventListener('focusin', pause);
    car.addEventListener('focusout', function () { resume(1500); });
    car.addEventListener('click', function () { pause(); resume(4000); });
    var tick = function (ts) {
      if (!paused && visible) {
        if (last === null) last = ts;
        var dt = Math.min(64, ts - last);
        var step = slides[1].offsetLeft - slides[0].offsetLeft;
        var setW = slides[n].offsetLeft - slides[0].offsetLeft;
        pos += step / msPerSlide * dt;
        if (pos >= setW) pos -= setW;
        vp.scrollLeft = pos;
      }
      last = ts;
      requestAnimationFrame(tick);
    };
    new IntersectionObserver(function (es) { visible = es[es.length - 1].isIntersecting; }).observe(vp);
    vp.classList.add('__P__auto');
    requestAnimationFrame(tick);
  };
  // Nagyítás (lightbox) a referencia-fotókra: bezárás gombbal, Esc-szel,
  // háttérre kattintással; lapozás nyilakkal és húzással; a fókusz visszaáll.
  var lb = root.querySelector('.__P__lb');
  var lbImg = lb && lb.querySelector('.__P__lb-img');
  var shots = Array.prototype.slice.call(root.querySelectorAll('.__P__ref')).filter(function (el) { return !el.closest('.__P__clone'); });
  if (lb && lbImg && shots.length) {
    var cur = 0, lastFocus = null;
    var btns = Array.prototype.slice.call(lb.querySelectorAll('button'));
    var openAt = function (i) {
      cur = (i + shots.length) % shots.length;
      var img = shots[cur].querySelector('img');
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt;
      if (!lb.classList.contains('__P__open')) {
        lastFocus = document.activeElement;
        lb.hidden = false;
        lb.classList.add('__P__open');
        btns[0].focus();
      }
    };
    var close = function () {
      lb.classList.remove('__P__open');
      lb.hidden = true;
      lbImg.removeAttribute('src');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };
    // Delegált kattintás: a filmszalag másolatai (__P__clone) az eredeti képet nyitják.
    root.addEventListener('click', function (e) {
      var ref = e.target.closest && e.target.closest('.__P__ref');
      if (!ref || !root.contains(ref)) return;
      var li = ref.closest('[data-__P__i]');
      openAt(li ? Number(li.getAttribute('data-__P__i')) : shots.indexOf(ref));
    });
    lb.querySelector('.__P__lb-close').addEventListener('click', close);
    lb.querySelector('.__P__lb-prev').addEventListener('click', function (e) { e.stopPropagation(); openAt(cur - 1); });
    lb.querySelector('.__P__lb-next').addEventListener('click', function (e) { e.stopPropagation(); openAt(cur + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === 'ArrowLeft') openAt(cur - 1);
      else if (e.key === 'ArrowRight') openAt(cur + 1);
      else if (e.key === 'Tab') {
        var i = btns.indexOf(document.activeElement);
        e.preventDefault();
        btns[(i + (e.shiftKey ? -1 : 1) + btns.length) % btns.length].focus();
      }
    });
    var tx = null;
    lb.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (tx === null) return;
      var dx = e.changedTouches[0].clientX - tx;
      tx = null;
      if (Math.abs(dx) > 50) openAt(cur + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }
