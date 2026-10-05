(function () {
  'use strict';
  var PF = window.PF;
  if (!PF || !window.gsap) return;

  /* ---------- Card spotlight: works on touch too, harmless there ---------- */
  document.querySelectorAll('.card').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', e.clientX - r.left + 'px');
      card.style.setProperty('--my', e.clientY - r.top + 'px');
    });
  });

  // Everything below is desktop-only (mouse / trackpad) and skipped for reduced motion
  if (PF.isTouch || PF.reduced) return;

  var dot = document.getElementById('cursorDot');
  var ring = document.getElementById('cursorRing');
  var html = document.documentElement;
  html.classList.add('has-cursor');

  var dx = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3' });
  var dy = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3' });
  var rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' });
  var ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });

  window.addEventListener('pointermove', function (e) {
    dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
  }, { passive: true });
  document.addEventListener('pointerleave', function () { gsap.to([dot, ring], { opacity: 0, duration: 0.2 }); });
  document.addEventListener('pointerenter', function () { gsap.to([dot, ring], { opacity: 1, duration: 0.2 }); });

  var hoverSel = 'a, button, [data-magnetic], .chip, .award, .card';
  document.addEventListener('pointerover', function (e) {
    if (e.target.closest && e.target.closest(hoverSel)) ring.classList.add('is-hover');
  });
  document.addEventListener('pointerout', function (e) {
    if (e.target.closest && e.target.closest(hoverSel)) ring.classList.remove('is-hover');
  });

  /* ---------- Magnetic elements ---------- */
  document.querySelectorAll('[data-magnetic]').forEach(function (el) {
    var mx = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.45)' });
    var my = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.45)' });
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      mx((e.clientX - (r.left + r.width / 2)) * 0.25);
      my((e.clientY - (r.top + r.height / 2)) * 0.25);
    });
    el.addEventListener('pointerleave', function () { mx(0); my(0); });
  });
})();
