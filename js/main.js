(function () {
  'use strict';
  var root = document.documentElement;
  var preloader = document.getElementById('preloader');
  var PF = (window.PF = { lenis: null, reduced: false, isTouch: false, ready: false });

  // Fallback: if libraries failed to load, show everything without animation
  if (!window.gsap || !window.ScrollTrigger) {
    root.classList.remove('js');
    if (preloader) preloader.remove();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  PF.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  PF.isTouch = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (PF.reduced) root.classList.add('reduced');

  /* ---------- Smooth scroll (Lenis) ---------- */
  if (!PF.reduced && window.Lenis) {
    PF.lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    PF.lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { PF.lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    PF.lenis.stop();
  }

  function scrollToTarget(target) {
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;
    if (PF.lenis) PF.lenis.scrollTo(el, { offset: -10, duration: 1.4 });
    else el.scrollIntoView({ behavior: PF.reduced ? 'auto' : 'smooth' });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length > 1 && document.querySelector(id)) { e.preventDefault(); scrollToTarget(id); }
    });
  });
  var toTop = document.getElementById('toTop');
  if (toTop) toTop.addEventListener('click', function () { scrollToTarget('#about'); });
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Progress bar, navbar hide/show, scroll-spy ---------- */
  var progress = document.getElementById('progress');
  var nav = document.getElementById('nav');
  var lastY = 0;
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: function (self) {
      progress.style.transform = 'scaleX(' + self.progress + ')';
      var y = self.scroll();
      nav.classList.toggle('is-scrolled', y > 20);
      if (y > 140 && y > lastY + 4) nav.classList.add('is-hidden');
      else if (y < lastY - 4 || y <= 140) nav.classList.remove('is-hidden');
      lastY = y;
    }
  });

  var links = document.querySelectorAll('[data-spy]');
  links.forEach(function (link) {
    var section = document.querySelector(link.getAttribute('href'));
    if (!section) return;
    ScrollTrigger.create({
      trigger: section, start: 'top 55%', end: 'bottom 55%',
      onToggle: function (self) {
        if (self.isActive) {
          links.forEach(function (l) { l.classList.remove('is-active'); });
          link.classList.add('is-active');
        }
      }
    });
  });
  // "Education" lives inside the About block, so keep About highlighted for it too
  var edu = document.getElementById('education');
  var aboutLink = document.querySelector('[data-spy][href="#about"]');
  if (edu && aboutLink) {
    ScrollTrigger.create({
      trigger: edu, start: 'top 55%', end: 'bottom 55%',
      onToggle: function (self) {
        if (self.isActive) {
          links.forEach(function (l) { l.classList.remove('is-active'); });
          aboutLink.classList.add('is-active');
        }
      }
    });
  }

  /* ---------- Split section titles into words ---------- */
  function splitWords(el) {
    var text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    el.textContent = '';
    text.split(/\s+/).forEach(function (w, i, arr) {
      var outer = document.createElement('span');
      outer.className = 'word';
      outer.setAttribute('aria-hidden', 'true');
      var inner = document.createElement('span');
      inner.textContent = w;
      outer.appendChild(inner);
      el.appendChild(outer);
      if (i < arr.length - 1) el.appendChild(document.createTextNode(' '));
    });
    return el.querySelectorAll('.word > span');
  }
  PF.splitWords = splitWords;

  /* ---------- Generic reveals ---------- */
  function initReveals() {
    document.querySelectorAll('[data-split]').forEach(function (el) {
      var words = splitWords(el);
      if (PF.reduced) return;
      gsap.from(words, {
        yPercent: 110, duration: 1, ease: 'power4.out', stagger: 0.06,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });

    // Hero items are animated by hero.js; everything else here
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      if (el.closest('.hero') || PF.reduced) return;
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true }
      });
    });
  }
  PF.initReveals = initReveals;

  /* ---------- Ambient canvas: drifting rose petals + dust ---------- */
  function initAmbient() {
    var canvas = document.getElementById('ambient');
    if (!canvas || PF.reduced) { if (canvas) canvas.remove(); return; }
    var ctx = canvas.getContext('2d');
    var w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var count = window.innerWidth < 700 ? 16 : 34;
    var items = [];
    var mouse = { x: -999, y: -999 };

    function resize() {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function make(initial) {
      var petal = Math.random() < 0.45;
      return {
        petal: petal,
        x: Math.random() * w,
        y: initial ? Math.random() * h : -20,
        s: petal ? 5 + Math.random() * 7 : 1 + Math.random() * 1.6,
        vy: 0.25 + Math.random() * 0.55,
        vx: -0.15 + Math.random() * 0.3,
        r: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.02,
        sw: Math.random() * Math.PI * 2,
        a: 0.12 + Math.random() * 0.3,
        hue: Math.random() < 0.5 ? '224,85,111' : '139,124,255'
      };
    }
    resize();
    for (var i = 0; i < count; i++) items.push(make(true));
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });

    var running = true;
    document.addEventListener('visibilitychange', function () { running = !document.hidden; });

    gsap.ticker.add(function () {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < items.length; i++) {
        var p = items[i];
        p.sw += 0.01;
        p.x += p.vx + Math.sin(p.sw) * 0.35;
        p.y += p.vy;
        p.r += p.vr;
        var dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < 14000) { var f = (1 - d2 / 14000) * 1.6; p.x += (dx / 120) * f; p.y += (dy / 120) * f; }
        if (p.y > h + 30 || p.x < -40 || p.x > w + 40) { items[i] = make(false); continue; }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillStyle = 'rgba(' + p.hue + ',' + p.a + ')';
        ctx.beginPath();
        if (p.petal) { ctx.ellipse(0, 0, p.s, p.s * 0.55, 0, 0, Math.PI * 2); }
        else { ctx.arc(0, 0, p.s, 0, Math.PI * 2); }
        ctx.fill();
        ctx.restore();
      }
    });
  }

  /* ---------- Preloader, then start the page ---------- */
  var barFill = document.getElementById('preloaderBar');
  function startPage() {
    root.classList.add('is-ready');
    PF.ready = true;
    if (PF.lenis) PF.lenis.start();
    initReveals();
    initAmbient();
    document.dispatchEvent(new CustomEvent('pf:ready'));
    ScrollTrigger.refresh();
  }

  var hiding = false;
  function hidePreloader() {
    if (hiding) return;
    hiding = true;
    if (!preloader) { startPage(); return; }
    if (PF.reduced) { preloader.remove(); startPage(); return; }
    gsap.timeline()
      .to(preloader.querySelector('.preloader__inner'), { opacity: 0, y: -20, duration: 0.5, ease: 'power2.in' })
      .to(preloader, {
        yPercent: -100, duration: 0.9, ease: 'power4.inOut',
        onStart: startPage,
        onComplete: function () { preloader.remove(); }
      }, '-=0.1');
  }

  function runPreloader() {
    if (PF.reduced || !barFill) { hidePreloader(); return; }
    gsap.to(barFill, { scaleX: 1, duration: 1.1, ease: 'power2.inOut', onComplete: hidePreloader });
  }

  var loaded = document.readyState === 'complete';
  if (loaded) runPreloader();
  else window.addEventListener('load', runPreloader);
  // Safety net so the page never stays hidden
  setTimeout(function () { if (!PF.ready) { hidePreloader(); } }, 6000);

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
