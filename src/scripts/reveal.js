/* reveal.js — reveal .reveal elements on scroll; show all immediately under reduced motion. */
(function () {
  'use strict';
  var els = document.querySelectorAll('.reveal');
  if (('IntersectionObserver' in window) && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    [].forEach.call(els, function (el) { el.classList.add('is-in'); });
  }
})();
