/* team-modal.js — click-through bio modal for Cardo leadership (Rich, Krissy).
   Cards with [data-member] open a dimmed modal with their photo + bio. */
(function () {
  'use strict';
  var BIOS = {
    rich: {
      name: 'Richard Scherf',
      role: 'Chief Executive Officer',
      photo: 'https://www.cardorentals.com/i/width=600,height=750,fit=cover,format=jpeg?src=https%3A%2F%2Fwander-upload-assets.wander.com%2F631245212978513381%2Ffiles%2F26052fd3-e825-42db-ac99-7b80c45163ed.jpg',
      bio: [
        "Richard Scherf, CEO of Cardo Vacation Rentals, identified Airbnb's disruptive potential in hospitality to rival traditional hotels. With substantial vision and an appetite for risk, he financed several Airbnb rentals with credit and savings, and built the teams to operate them. A CMU graduate in marketing and communications, with a background in web development and design, Richard launched Cardo (2013) for full-service management and Happy Host (2016) for cleaning and maintenance.",
        "The COVID-19 pandemic prompted a strategic shift to commission management, prioritizing exceptional guest and homeowner experiences. This dedication has fueled Cardo's 100% year-over-year growth, positioning it as a rising force in Southern California's vacation rental market."
      ]
    },
    krissy: {
      name: 'Krissy Hunter',
      role: 'Owner Services Manager',
      photo: 'https://www.cardorentals.com/i/width=600,height=750,fit=cover,format=jpeg?src=https%3A%2F%2Fwander-upload-assets.wander.com%2F631245212978513381%2Ffiles%2F7d0fd2ea-255e-4a51-9b00-2a7babfa0278.jpg',
      bio: [
        "Krissy serves as our Owner Services Manager, overseeing account management, customer support, communication, and — most importantly — relationship building. She provides operational support, offers property enhancement ideas, manages onboarding of new properties, and more.",
        "With her positive energy and strong work ethic, Krissy excels at building lasting relationships, making her the perfect fit for this role at Cardo. Her solution-oriented mindset and approachable demeanor ensure that every experience exceeds expectations."
      ]
    }
  };

  var modal = document.querySelector('[data-team-modal]');
  if (!modal) return;
  var imgEl = modal.querySelector('[data-tm-photo]');
  var nameEl = modal.querySelector('[data-tm-name]');
  var roleEl = modal.querySelector('[data-tm-role]');
  var bioEl = modal.querySelector('[data-tm-bio]');
  var lastFocus = null;

  function open(key) {
    var d = BIOS[key];
    if (!d) return;
    imgEl.src = d.photo; imgEl.alt = d.name;
    nameEl.textContent = d.name;
    roleEl.textContent = d.role;
    bioEl.innerHTML = d.bio.map(function (p) { return '<p>' + p + '</p>'; }).join('');
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  [].slice.call(document.querySelectorAll('[data-member]')).forEach(function (card) {
    card.style.cursor = 'pointer';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.addEventListener('click', function () { lastFocus = card; open(card.getAttribute('data-member')); });
    card.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); lastFocus = card; open(card.getAttribute('data-member')); } });
  });
  [].slice.call(modal.querySelectorAll('[data-tm-close]')).forEach(function (b) { b.addEventListener('click', close); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.classList.contains('is-open')) close(); });
})();
