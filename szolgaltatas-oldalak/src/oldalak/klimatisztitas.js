/*@galeria*/
  var gal = root.querySelector('.__P__gal-car');
  if (gal) {
    var gp = filmPrep(gal);
    carousel(gal, 'Fotó', function (i) { gp.slides.forEach(function (s, j) { s.classList.toggle('__P__center', i === j); }); }, gp.n);
    film(gal, gp, 5200);
  }
