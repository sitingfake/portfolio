(function () {
  'use strict';
  var PF = window.PF;
  if (!PF || !window.gsap) return;

  function start() {
    if (PF.reduced) {
      document.querySelectorAll('[data-count]').forEach(function (el) { el.textContent = el.dataset.count; });
      return;
    }

    /* ---------- Scroll-scrubbed reveal: the further you scroll, the clearer each card gets ---------- */
    document.querySelectorAll('[data-award]').forEach(function (card) {
      var state = { p: 0 };
      gsap.to(state, {
        p: 1, ease: 'none',
        onUpdate: function () { card.style.setProperty('--p', state.p.toFixed(3)); },
        scrollTrigger: {
          trigger: card,
          start: 'top 98%',   // starts fading in as it enters the viewport
          end: 'top 62%',     // fully revealed once it reaches the upper-middle
          scrub: 0.6
        }
      });
    });

    /* ---------- Stats counters ---------- */
    document.querySelectorAll('[data-count]').forEach(function (el) {
      var target = parseInt(el.dataset.count, 10) || 0;
      var obj = { v: 0 };
      gsap.to(obj, {
        v: target, duration: 1.6, ease: 'power2.out',
        onUpdate: function () { el.textContent = Math.round(obj.v); },
        scrollTrigger: { trigger: el, start: 'top 90%', once: true }
      });
    });
  }

  if (PF.ready) start(); else document.addEventListener('pf:ready', start, { once: true });
})();
