(function () {
  'use strict';
  var PF = window.PF;
  if (!PF || !window.gsap) return;

  function start() {
    var track = document.querySelector('.marquee__track');
    if (!track || PF.reduced) return;

    // Slide the outlined headline sideways, driven by scroll position
    gsap.fromTo(track, { xPercent: 0 }, {
      xPercent: -35, ease: 'none',
      scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'bottom bottom', scrub: 0.8 }
    });
  }

  if (PF.ready) start(); else document.addEventListener('pf:ready', start, { once: true });
})();
