(function(){
  'use strict';
  var header = document.querySelector('[data-header]');
  var onScroll = function(){ header && header.classList.toggle('is-scrolled', window.scrollY > 12); };
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  /* ----- Floating "Get my free earning estimate" button: appears after scrolling past the hero form ----- */
  (function(){
    var ctas = [].slice.call(document.querySelectorAll('[data-estimate-fab]'));
    var form = document.getElementById('estimate');
    if (!ctas.length || !form) return;
    function toggle(on) { ctas.forEach(function(el){ el.classList.toggle('is-visible', on); }); }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(en){
          // show once the form has scrolled up out of view
          var pastForm = !en.isIntersecting && en.boundingClientRect.top < 0;
          toggle(pastForm);
        });
      }, { threshold: 0 });
      io.observe(form);
    } else {
      window.addEventListener('scroll', function(){
        toggle(form.getBoundingClientRect().bottom < 60);
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
    var cardo  = [182,169,145,220,307,222];
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

  /* ----- Multi-step lead form: 1) book → 2) your details → 3) your property ----- */
  (function(){
    var panel = document.querySelector('[data-lead]');
    if (!panel) return;
    var steps = {
      '1': panel.querySelector('[data-lead-step="1"]'),
      '2': panel.querySelector('[data-lead-step="2"]'),
      '3': panel.querySelector('[data-lead-step="3"]')
    };
    var done = panel.querySelector('[data-lead-done]');
    var calMount = panel.querySelector('[data-leadcal]');
    var barSteps = [].slice.call(panel.querySelectorAll('.leadbar__step'));
    var apptBanner = panel.querySelector('[data-appt]');
    var apptLabelEl = panel.querySelector('[data-appt-label]');

    // Mock lead "record" — one row that each step updates. Swap saveLead's body
    // for a real POST/PATCH to your CRM or Firestore endpoint.
    var lead = { id: 'lead_' + Math.random().toString(36).slice(2, 10) };
    function saveLead(patch){
      Object.assign(lead, patch || {});
      // TODO(backend): persist `lead` here, e.g.
      //   fetch('/api/leads/' + lead.id, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(lead) });
      try { window.sessionStorage.setItem('cardoLead', JSON.stringify(lead)); } catch(e) {}
      return lead;
    }
    function values(f){ var o = {}; [].slice.call(f.elements).forEach(function(el){ if (el.name) o[el.name] = el.type === 'checkbox' ? el.checked : el.value; }); return o; }
    function esc(s){ return String(s).replace(/[&<>]/g, function(c){ return { '&':'&amp;', '<':'&lt;', '>':'&gt;' }[c]; }); }

    function setBar(active){ // active: '1' | '2' | '3' | 'done'
      barSteps.forEach(function(li){
        var n = parseInt(li.getAttribute('data-bar'), 10);
        li.classList.remove('is-active', 'is-done');
        if (active === 'done' || n < parseInt(active, 10)) li.classList.add('is-done');
        else if (String(n) === active) li.classList.add('is-active');
      });
    }
    function show(which){ // which: '1' | '2' | '3' | 'done'
      [steps['1'], steps['2'], steps['3'], done].forEach(function(el){ if (el) el.hidden = true; });
      if (which === 'done') { if (done) done.hidden = false; setBar('done'); }
      else { steps[which].hidden = false; setBar(which); }
      var hero = document.getElementById('estimate');
      if (hero) hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // "Add guests" disclosure
    var addBtn = panel.querySelector('[data-addguests]');
    var guests = panel.querySelector('[data-guests]');
    addBtn && addBtn.addEventListener('click', function(){
      var open = guests.hidden;
      guests.hidden = !open;
      addBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      addBtn.classList.toggle('is-open', open);
      if (open) { var t = guests.querySelector('textarea'); t && t.focus(); }
    });

    // Back buttons
    panel.querySelectorAll('[data-lead-back]').forEach(function(b){
      b.addEventListener('click', function(){ show(b.getAttribute('data-lead-back')); });
    });

    // Step 2 (details) → confirm appointment, advance to step 3
    steps['2'] && steps['2'].addEventListener('submit', function(e){
      e.preventDefault();
      if (!steps['2'].reportValidity()) return;
      saveLead(values(steps['2']));
      if (lead.appointment && apptLabelEl) { apptLabelEl.textContent = lead.appointment; if (apptBanner) apptBanner.hidden = false; }
      show('3');
    });

    // Step 3 (property) → full confirmation
    steps['3'] && steps['3'].addEventListener('submit', function(e){
      e.preventDefault();
      if (!steps['3'].reportValidity()) return;
      saveLead(values(steps['3']));
      renderConfirmation();
      show('done');
    });

    // Early-contact preference updates the record live.
    var early = panel.querySelector('input[name="earlyContact"]');
    early && early.addEventListener('change', function(){ saveLead({ earlyContact: early.checked }); });

    function renderConfirmation(){
      var titleEl = panel.querySelector('[data-done-title]');
      var apptEl = panel.querySelector('[data-done-appt]');
      var gcalBtn = panel.querySelector('[data-done-gcal]');
      if (titleEl && lead.firstName) titleEl.textContent = "You're all set, " + lead.firstName + '.';
      if (apptEl && lead.appointment) {
        apptEl.innerHTML = '<span class="leadappt__ic" aria-hidden="true">✓</span>'
          + '<div><b>' + esc(lead.appointment) + '</b><br><span class="muted">Consultation with your Cardo account manager</span></div>';
      }
      if (gcalBtn) { if (lead.gcalUrl) gcalBtn.href = lead.gcalUrl; else gcalBtn.style.display = 'none'; }
    }

    // Booking is the first step — build the scheduler on load.
    buildScheduler();

    /* ---- Booking calendar: real Google Calendar embed if provided, else a
            lightweight scheduling placeholder that captures a day + time. On
            confirm it stores the appointment and advances to step 2. ---- */
    var built = false;
    function buildScheduler(){
      if (built || !calMount) return;
      built = true;
      var gcal = calMount.getAttribute('data-gcal');
      if (gcal) {
        var f = document.createElement('iframe');
        f.src = gcal; f.width = '100%'; f.height = '600'; f.frameBorder = '0';
        f.style.border = '0'; f.title = 'Book your consultation';
        calMount.appendChild(f);
        return;
      }
      // Placeholder scheduler — next 8 weekdays + a few time slots.
      var days = [], d = new Date(); d.setHours(0,0,0,0);
      while (days.length < 8) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0 && d.getDay() !== 6) days.push(new Date(d)); }
      var times = ['9:00 AM','10:30 AM','1:00 PM','2:30 PM','4:00 PM'];
      var dn = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'], mn = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      var sel = { day: null, time: null };

      var wrap = document.createElement('div'); wrap.className = 'leadcal__inner';
      wrap.innerHTML =
        '<div class="leadcal__label">Pick a day</div>' +
        '<div class="leadcal__days"></div>' +
        '<div class="leadcal__label">Available times</div>' +
        '<div class="leadcal__times"></div>' +
        '<button type="button" class="btn btn-block leadcal__confirm" disabled>Select a day &amp; time</button>';
      calMount.appendChild(wrap);
      var daysEl = wrap.querySelector('.leadcal__days');
      var timesEl = wrap.querySelector('.leadcal__times');
      var confirm = wrap.querySelector('.leadcal__confirm');

      function refreshConfirm(){
        var ok = sel.day && sel.time;
        confirm.disabled = !ok;
        confirm.textContent = ok ? ('Continue · ' + dn[sel.day.getDay()] + ' ' + sel.time) : 'Select a day & time';
      }
      days.forEach(function(day){
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'leadcal__day';
        b.innerHTML = '<span class="leadcal__dow">' + dn[day.getDay()] + '</span><span class="leadcal__num">' + day.getDate() + '</span><span class="leadcal__mon">' + mn[day.getMonth()] + '</span>';
        b.addEventListener('click', function(){
          sel.day = day;
          [].slice.call(daysEl.children).forEach(function(x){ x.classList.toggle('is-on', x === b); });
          refreshConfirm();
        });
        daysEl.appendChild(b);
      });
      times.forEach(function(t){
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'leadcal__time'; b.textContent = t;
        b.addEventListener('click', function(){
          sel.time = t;
          [].slice.call(timesEl.children).forEach(function(x){ x.classList.toggle('is-on', x === b); });
          refreshConfirm();
        });
        timesEl.appendChild(b);
      });
      function pad(n){ return (n < 10 ? '0' : '') + n; }
      function stamp(dt){ return dt.getFullYear() + pad(dt.getMonth()+1) + pad(dt.getDate()) + 'T' + pad(dt.getHours()) + pad(dt.getMinutes()) + '00'; }
      function toStart(day, t){
        var m = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
        var h = (parseInt(m[1],10) % 12) + (/pm/i.test(m[3]) ? 12 : 0);
        var d = new Date(day); d.setHours(h, parseInt(m[2],10), 0, 0); return d;
      }
      confirm.addEventListener('click', function(){
        if (!sel.day || !sel.time) return;
        var label = dn[sel.day.getDay()] + ', ' + mn[sel.day.getMonth()] + ' ' + sel.day.getDate() + ' at ' + sel.time;
        var start = toStart(sel.day, sel.time), end = new Date(start.getTime() + 30*60000);
        // Prefilled Google Calendar event for the final confirmation step.
        var gcalUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
          + '&text=' + encodeURIComponent('Cardo — Earning Estimate Review')
          + '&dates=' + stamp(start) + '/' + stamp(end)
          + '&details=' + encodeURIComponent('Your Cardo account manager will walk you through your San Diego earning estimate.' + (lead.address ? '\nProperty: ' + lead.address : ''))
          + '&location=' + encodeURIComponent('Phone call')
          + '&ctz=America/Los_Angeles';
        saveLead({ appointment: label, appointmentStart: start.toISOString(), gcalUrl: gcalUrl });
        show('2');
      });
      refreshConfirm();
    }
  })();

  if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches && ('IntersectionObserver' in window)) {
    var io = new IntersectionObserver(function(entries){ entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('is-in'); io.unobserve(en.target); } }); }, { threshold: .12 });
    document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
    // safety net: reveal anything in view that the observer never fired for
    window.addEventListener('load', function(){ setTimeout(function(){ document.querySelectorAll('.reveal:not(.is-in)').forEach(function(el){ if(el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-in'); }); }, 1200); });
  } else {
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('is-in'); });
  }
})();
