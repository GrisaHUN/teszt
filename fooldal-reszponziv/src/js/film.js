  // Filmszalag: a körhinta alapból lassan, folyamatosan gördül (végtelenítve, a
  // diák másolataival); egérre, érintésre, fókuszra és lapozásra megáll,
  // utána magától folytatja. prefers-reduced-motion esetén nincs mozgás.
  var filmPrep = function (car) {
    var track = car.querySelector('.jkh-scroller .jkh-slide').parentNode;
    var orig = Array.prototype.slice.call(track.children);
    orig.forEach(function (li, i) { li.setAttribute('data-jkh-i', i); });
    if (!reduce) {
      orig.forEach(function (li) {
        var c = li.cloneNode(true);
        c.classList.add('jkh-clone');
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
    var vp = car.querySelector('.jkh-scroller');
    var slides = prep.slides, n = prep.n;
    var lbox = root.querySelector('.jkh-lb');
    var pos = 0, last = null, paused = false, visible = false, resumeT = null;
    var pause = function () { paused = true; clearTimeout(resumeT); vp.classList.remove('jkh-auto'); };
    var resume = function (ms) {
      clearTimeout(resumeT);
      resumeT = setTimeout(function () {
        if ((lbox && lbox.classList.contains('jkh-open')) || car.matches(':hover') || car.contains(document.activeElement)) return resume(ms);
        pos = vp.scrollLeft; last = null; paused = false; vp.classList.add('jkh-auto');
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
    vp.classList.add('jkh-auto');
    requestAnimationFrame(tick);
  };
