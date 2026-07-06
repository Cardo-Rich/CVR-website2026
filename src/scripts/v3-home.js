/* v3-home.js — behaviors for the Brand V3 home-page proof.
   1) Scroll-linked reveal of section headings (50% → full).
   2) Subtle mouse parallax on the concierge photo strip. */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Heading scroll reveal ---------- */
  (function () {
    var heads = [].slice.call(document.querySelectorAll('main h2'));
    if (!heads.length) return;
    heads.forEach(function (h) {
      h.classList.add('h2-reveal');
      // split into words (kept unbreakable) of per-character spans, for letter-by-letter reveal
      var text = h.textContent;
      h.textContent = '';
      var chars = [];
      text.split(/(\s+)/).forEach(function (tok) {
        if (tok === '') return;
        if (/^\s+$/.test(tok)) { h.appendChild(document.createTextNode(tok)); return; }
        var w = document.createElement('span');
        w.className = 'h2word';
        for (var i = 0; i < tok.length; i++) {
          var s = document.createElement('span');
          s.className = 'h2ch';
          s.textContent = tok[i];
          w.appendChild(s);
          chars.push(s);
        }
        h.appendChild(w);
      });
      h.__chars = chars;
    });

    function effect() {
      return document.documentElement.getAttribute('data-h2reveal') || 'wipe';
    }
    function startFrac() {
      var v = parseFloat(document.documentElement.getAttribute('data-h2start'));
      return isNaN(v) ? 0.85 : v / 100;
    }
    function resetChars(h, op) {
      var c = h.__chars; if (!c) return;
      for (var i = 0; i < c.length; i++) c[i].style.opacity = op;
    }
    function clearStyles(h) {
      h.style.opacity = ''; h.style.filter = ''; h.style.transform = '';
      h.style.webkitMaskImage = ''; h.style.maskImage = '';
    }

    function update() {
      if (reduce) { heads.forEach(function (h) { clearStyles(h); resetChars(h, ''); }); return; }
      var vh = window.innerHeight;
      var e = effect();
      var startY = vh * startFrac();   // reveal begins once the heading top rises past this line
      var span = vh * 0.30;            // distance over which it completes
      for (var i = 0; i < heads.length; i++) {
        var h = heads[i];
        var r = h.getBoundingClientRect();
        var p = (startY - r.top) / span;
        p = p < 0 ? 0 : p > 1 ? 1 : p;
        clearStyles(h);
        if (e === 'wipe') {
          // reveal letter by letter in reading order (top line, then down); unread stays faint
          var chars = h.__chars, n = chars.length, soft = 6;
          var reveal = p * (n + soft);
          for (var k = 0; k < n; k++) {
            var d = reveal - k;
            var op = d <= 0 ? 0.12 : d >= soft ? 1 : 0.12 + 0.88 * (d / soft);
            chars[k].style.opacity = op.toFixed(3);
          }
        } else {
          resetChars(h, '');
          var o = (0.5 + 0.5 * p).toFixed(3);
          if (e === 'blur') { h.style.opacity = o; h.style.filter = 'blur(' + ((1 - p) * 6).toFixed(2) + 'px)'; }
          else if (e === 'rise') { h.style.opacity = o; h.style.transform = 'translateY(' + ((1 - p) * 22).toFixed(1) + 'px)'; }
          else if (e === 'scale') { h.style.opacity = o; h.style.transformOrigin = 'left'; h.style.transform = 'scale(' + (0.95 + 0.05 * p).toFixed(3) + ')'; }
          else { h.style.opacity = o; } // fade
        }
      }
    }

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { update(); ticking = false; });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    window.__h2reveal = update;
    update();
  })();

  /* ---------- 2. Concierge filmstrip drift (whole photos, opposite the mouse, slow, 5px) ---------- */
  (function () {
    var wrap = document.querySelector('[data-cphotos]');
    var track = document.querySelector('[data-cphotos-track]');
    if (!wrap || !track || reduce) return;
    var AMT = 5;
    var target = 0, cur = 0, raf = null;
    function loop() {
      cur += (target - cur) * 0.05;               // slow reaction
      track.style.transform = 'translateX(' + cur.toFixed(2) + 'px)';
      if (Math.abs(target - cur) > 0.05) { raf = requestAnimationFrame(loop); }
      else { cur = target; track.style.transform = 'translateX(' + cur + 'px)'; raf = null; }
    }
    function kick() { if (!raf) raf = requestAnimationFrame(loop); }
    wrap.addEventListener('mousemove', function (ev) {
      var r = wrap.getBoundingClientRect();
      var rel = (ev.clientX - r.left) / r.width;   // 0..1
      target = (0.5 - rel) * 2 * AMT;              // opposite side of the mouse, max ±5px
      kick();
    });
    wrap.addEventListener('mouseleave', function () { target = 0; kick(); });
  })();

  /* ---------- 3. Journal carousel arrows ---------- */
  (function () {
    var track = document.querySelector('[data-journal-track]');
    if (!track) return;
    var prev = document.querySelector('[data-journal-prev]');
    var next = document.querySelector('[data-journal-next]');
    function step(dir) {
      var card = track.querySelector('.jpost');
      var w = card ? card.getBoundingClientRect().width + 22 : 360;
      track.scrollBy({ left: dir * w, behavior: 'smooth' });
    }
    if (prev) prev.addEventListener('click', function () { step(-1); });
    if (next) next.addEventListener('click', function () { step(1); });
  })();
})();
