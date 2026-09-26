  // Nagyítás (lightbox) a referencia-fotókra: bezárás gombbal, Esc-szel,
  // háttérre kattintással; lapozás nyilakkal és húzással; a fókusz visszaáll.
  var lb = root.querySelector('.jkh-lb');
  var lbImg = lb && lb.querySelector('.jkh-lb-img');
  var shots = Array.prototype.slice.call(root.querySelectorAll('.jkh-ref'));
  if (lb && lbImg && shots.length) {
    var cur = 0, lastFocus = null;
    var btns = Array.prototype.slice.call(lb.querySelectorAll('button'));
    var openAt = function (i) {
      cur = (i + shots.length) % shots.length;
      var img = shots[cur].querySelector('img');
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt;
      if (!lb.classList.contains('jkh-open')) {
        lastFocus = document.activeElement;
        lb.hidden = false;
        lb.classList.add('jkh-open');
        btns[0].focus();
      }
    };
    var close = function () {
      lb.classList.remove('jkh-open');
      lb.hidden = true;
      lbImg.removeAttribute('src');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };
    shots.forEach(function (el, i) { el.addEventListener('click', function () { openAt(i); }); });
    lb.querySelector('.jkh-lb-close').addEventListener('click', close);
    lb.querySelector('.jkh-lb-prev').addEventListener('click', function (e) { e.stopPropagation(); openAt(cur - 1); });
    lb.querySelector('.jkh-lb-next').addEventListener('click', function (e) { e.stopPropagation(); openAt(cur + 1); });
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
