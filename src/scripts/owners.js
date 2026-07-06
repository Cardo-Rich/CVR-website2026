(function(){
  'use strict';
  var header = document.querySelector('[data-header]');
  var onScroll = function(){ header && header.classList.toggle('is-scrolled', window.scrollY > 12); };
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  /* ----- Center "Free estimate" CTA: appears after scrolling past the hero form ----- */
  (function(){
    var cta = document.querySelector('[data-header-cta]');
    var form = document.getElementById('estimate');
    if (!cta || !form) return;
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(en){
          // show once the form has scrolled up out of view
          var pastForm = !en.isIntersecting && en.boundingClientRect.top < 0;
          cta.classList.toggle('is-visible', pastForm);
        });
      }, { threshold: 0 });
      io.observe(form);
    } else {
      window.addEventListener('scroll', function(){
        cta.classList.toggle('is-visible', form.getBoundingClientRect().bottom < 60);
      }, { passive: true });
    }
  })();

  /* ----- Income calculator ----- */
  var hoodSel = document.getElementById('calc-hood');
  var bedRow = document.getElementById('calc-beds');
  var numEl = document.getElementById('calc-num');
  var noteEl = document.getElementById('calc-note');
  var beds = 3;
  var OCC = 0.72;
  var money = function(n){ return '$' + n.toLocaleString('en-US'); };
  function recalc(){
    if(!hoodSel) return;
    var baseAdr = parseFloat(hoodSel.value);
    var adr = baseAdr * (0.55 + beds * 0.15);
    var annual = adr * 365 * OCC;
    var lo = Math.round(annual * 0.92 / 1000) * 1000;
    var hi = Math.round(annual * 1.08 / 1000) * 1000;
    numEl.textContent = money(lo) + ' – ' + money(hi);
    noteEl.textContent = '≈ ' + money(Math.round(adr)) + ' / night at ~72% occupancy';
  }
  bedRow && bedRow.addEventListener('click', function(e){
    var chip = e.target.closest('.calc__bed');
    if(!chip) return;
    beds = parseInt(chip.dataset.beds, 10);
    [].forEach.call(bedRow.children, function(c){ c.classList.toggle('is-active', c === chip); });
    recalc();
  });
  hoodSel && hoodSel.addEventListener('change', recalc);
  recalc();

  /* ----- Performance chart (RevPAR vs market) ----- */
  (function(){
    var svg = document.querySelector('[data-perf-chart]');
    if(!svg) return;
    var months = ['Mar','Apr','May','Jun','Jul','Aug'];
    var cardo  = [238,174,167,269,377,304];
    var market = [158,147,126,191,267,194];
    var W = 960, H = 400, pl = 56, pr = 28, pt = 24, pb = 44;
    var plotW = W - pl - pr, plotH = H - pt - pb, maxY = 400;
    var x = function(i){ return pl + i * (plotW / (months.length - 1)); };
    var y = function(v){ return pt + plotH - (v / maxY) * plotH; };
    var NS = 'http://www.w3.org/2000/svg';
    function el(tag, attrs){ var e = document.createElementNS(NS, tag); for(var k in attrs) e.setAttribute(k, attrs[k]); return e; }
    // gridlines + y labels
    for(var g=0; g<=4; g++){
      var gv = g*100, gy = y(gv);
      svg.appendChild(el('line', { x1: pl, y1: gy, x2: W-pr, y2: gy, stroke: 'rgba(14,17,27,.10)', 'stroke-width': 1 }));
      var lbl = el('text', { x: pl-12, y: gy+4, 'text-anchor': 'end', fill: 'var(--muted)', 'font-size': 13, 'font-family': 'var(--font-body)' });
      lbl.textContent = '$' + gv; svg.appendChild(lbl);
    }
    // x labels
    months.forEach(function(m,i){
      var t = el('text', { x: x(i), y: H-14, 'text-anchor': 'middle', fill: 'var(--muted)', 'font-size': 13, 'font-family': 'var(--font-body)' });
      t.textContent = m; svg.appendChild(t);
    });
    // smooth path (Catmull-Rom -> bezier)
    function smooth(vals){
      var p = vals.map(function(v,i){ return [x(i), y(v)]; });
      var d = 'M' + p[0][0] + ',' + p[0][1];
      for(var i=0;i<p.length-1;i++){
        var p0 = p[i-1]||p[i], p1 = p[i], p2 = p[i+1], p3 = p[i+2]||p2;
        var c1x = p1[0] + (p2[0]-p0[0])/6, c1y = p1[1] + (p2[1]-p0[1])/6;
        var c2x = p2[0] - (p3[0]-p1[0])/6, c2y = p2[1] - (p3[1]-p1[1])/6;
        d += 'C' + c1x + ',' + c1y + ' ' + c2x + ',' + c2y + ' ' + p2[0] + ',' + p2[1];
      }
      return d;
    }
    function series(vals, color, width, dot){
      svg.appendChild(el('path', { d: smooth(vals), fill: 'none', stroke: color, 'stroke-width': width, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
      vals.forEach(function(v,i){
        svg.appendChild(el('circle', { cx: x(i), cy: y(v), r: dot, fill: '#fff', stroke: color, 'stroke-width': 2.5 }));
      });
    }
    series(market, 'var(--muted)', 2.5, 3.5);
    series(cardo, 'var(--rose)', 3.5, 4.5);
    // value labels for Cardo
    cardo.forEach(function(v,i){
      var t = el('text', { x: x(i), y: y(v)-14, 'text-anchor': 'middle', fill: 'var(--ink)', 'font-size': 14, 'font-weight': 600, 'font-family': 'var(--font-body)' });
      t.textContent = '$' + v; svg.appendChild(t);
    });
    var sc = cardo.reduce(function(a,b){return a+b;},0), sm = market.reduce(function(a,b){return a+b;},0);
    var avgEl = document.getElementById('perf-avg');
    if(avgEl) avgEl.textContent = '+' + Math.round((sc/sm - 1) * 100) + '%';
  })();

  /* ----- FAQ accordion (hairline) ----- */
  var list = document.querySelector('[data-faq]');
  list && list.querySelectorAll('[data-faq-item]').forEach(function(item){
    var btn = item.querySelector('.faq__q');
    var panel = item.querySelector('.faq__panel');
    btn && btn.addEventListener('click', function(){
      var willOpen = !item.classList.contains('is-open');
      list.querySelectorAll('[data-faq-item]').forEach(function(o){
        o.classList.remove('is-open');
        o.querySelector('.faq__q').setAttribute('aria-expanded','false');
        o.querySelector('.faq__panel').style.maxHeight = null;
      });
      if (willOpen) { item.classList.add('is-open'); btn.setAttribute('aria-expanded','true'); panel.style.maxHeight = panel.scrollHeight + 'px'; }
    });
  });
  var openItem = list && list.querySelector('[data-faq-item].is-open .faq__panel');
  if (openItem) openItem.style.maxHeight = openItem.scrollHeight + 'px';

  var form = document.querySelector('[data-lead-form]');
  var success = document.querySelector('[data-lead-success]');
  form && form.addEventListener('submit', function(e){ e.preventDefault(); if(!form.reportValidity()) return; form.hidden = true; if(success) success.hidden = false; });

  if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches && ('IntersectionObserver' in window)) {
    var io = new IntersectionObserver(function(entries){ entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('is-in'); io.unobserve(en.target); } }); }, { threshold: .12 });
    document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
    // safety net: reveal anything in view that the observer never fired for
    window.addEventListener('load', function(){ setTimeout(function(){ document.querySelectorAll('.reveal:not(.is-in)').forEach(function(el){ if(el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-in'); }); }, 1200); });
  } else {
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('is-in'); });
  }
})();
