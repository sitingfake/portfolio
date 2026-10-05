(function () {
  'use strict';
  var PF = window.PF;
  if (!PF || !window.gsap) return;

  var avatar = document.getElementById('avatar');

  /* ---------- Avatar 3D tilt (desktop only) ---------- */
  function initTilt() {
    if (!avatar || PF.isTouch || PF.reduced) return;
    var frame = avatar.querySelector('.avatar__frame');
    var rotX = gsap.quickTo(frame, 'rotationX', { duration: 0.6, ease: 'power3' });
    var rotY = gsap.quickTo(frame, 'rotationY', { duration: 0.6, ease: 'power3' });
    avatar.addEventListener('pointermove', function (e) {
      var r = avatar.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      rotY(px * 16); rotX(-py * 16);
    });
    avatar.addEventListener('pointerleave', function () { rotX(0); rotY(0); });
  }

  /* ---------- Hero intro ---------- */
  function intro() {
    var items = document.querySelectorAll('.hero [data-reveal]');
    if (PF.reduced) return;

    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hero__title .line__inner', { yPercent: 115, duration: 1.2, stagger: 0.12, ease: 'power4.out' }, 0.05)
      .to(items, { opacity: 1, y: 0, duration: 0.9, stagger: 0.09 }, 0.25)
      .from('.avatar__frame', { opacity: 0, scale: 0.88, y: 40, duration: 1.3, ease: 'power4.out' }, 0.15)
      .from('.avatar__tag', { opacity: 0, scale: 0.6, duration: 0.7, stagger: 0.12, ease: 'back.out(2)' }, 0.9)
      .from('.scroll-hint', { opacity: 0, y: -10, duration: 0.8 }, 1.3);

    // Parallax: text drifts up slower than the avatar as you scroll away
    gsap.to('.hero__text', {
      yPercent: -8, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    gsap.to('.avatar', {
      yPercent: 12, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  /* ---------- Education timeline ---------- */
  function timeline() {
    var tl = document.getElementById('timeline');
    var fill = document.getElementById('timelineFill');
    var items = document.querySelectorAll('[data-tl]');
    var chips = document.querySelectorAll('[data-chip]');
    if (!tl || PF.reduced) { items.forEach(function (i) { i.classList.add('is-on'); }); return; }

    gsap.to(fill, {
      scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: tl, start: 'top 70%', end: 'bottom 60%', scrub: 0.4 }
    });
    items.forEach(function (item) {
      gsap.to(item.querySelector('.tl-card'), {
        opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: {
          trigger: item, start: 'top 82%', once: true,
          onEnter: function () { item.classList.add('is-on'); }
        }
      });
    });
    if (chips.length) {
      gsap.to(chips, {
        opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.6)', stagger: 0.06,
        scrollTrigger: { trigger: '.chips', start: 'top 88%', once: true }
      });
    }
  }

  function start() { intro(); timeline(); initTilt(); }
  if (PF.ready) start(); else document.addEventListener('pf:ready', start, { once: true });
})();
