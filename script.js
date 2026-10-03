/* ==========================================================
   EVOLUTION DANCE CENTRE — site behaviour
   Theme switch · mobile drawer · reveal-on-scroll · counters
   filters · video modal · contact form
   (the first-paint theme is set by a tiny inline script in <head>)
   ========================================================== */
(() => {
  'use strict';

  const root = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const raf = (fn) => { let t = false; return (...a) => { if (t) return; t = true; requestAnimationFrame(() => { t = false; fn(...a); }); }; };

  /* ---------- Theme ---------- */
  const KEY = 'edc-theme';
  const themeColor = { dark: '#060e1d', light: '#f6faf1' };

  function applyTheme(theme, animate) {
    if (animate && !reduceMotion) {
      root.classList.add('theme-anim');
      clearTimeout(applyTheme.t);
      applyTheme.t = setTimeout(() => root.classList.remove('theme-anim'), 650);
    }
    root.setAttribute('data-theme', theme);
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', themeColor[theme]);
    $$('[data-theme-toggle]').forEach((b) => {
      b.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      b.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    });
  }

  applyTheme(root.getAttribute('data-theme') || 'dark', false);

  $$('[data-theme-toggle]').forEach((btn) =>
    btn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next, true);
      try { localStorage.setItem(KEY, next); } catch (e) { /* private mode */ }
    })
  );

  // Follow the OS setting until the visitor picks a theme themselves
  const mq = window.matchMedia('(prefers-color-scheme: light)');
  const onSystemChange = (e) => {
    let saved = null;
    try { saved = localStorage.getItem(KEY); } catch (err) { /* ignore */ }
    if (!saved) applyTheme(e.matches ? 'light' : 'dark', true);
  };
  if (mq.addEventListener) mq.addEventListener('change', onSystemChange);

  /* ---------- Mobile navigation drawer ---------- */
  const navToggle = $('#navToggle');
  const siteNav = $('#siteNav');
  const scrim = $('#navScrim');

  function setNav(open) {
    if (!navToggle || !siteNav) return;
    root.classList.toggle('nav-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (navToggle && siteNav) {
    $$('.nl', siteNav).forEach((a, i) => a.style.setProperty('--i', i));
    navToggle.addEventListener('click', () => setNav(!root.classList.contains('nav-open')));
    scrim && scrim.addEventListener('click', () => setNav(false));
    $$('a', siteNav).forEach((a) => a.addEventListener('click', () => setNav(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && root.classList.contains('nav-open')) { setNav(false); navToggle.focus(); } });
    window.matchMedia('(min-width: 961px)').addEventListener('change', (e) => { if (e.matches) setNav(false); });
  }

  /* ---------- Scroll: header state, progress bar, back-to-top, path ---------- */
  const header = $('#header');
  const bar = $('#progress');
  const toTop = $('#toTop');
  const paths = $$('.path');

  const onScroll = raf(() => {
    const y = window.scrollY;
    header && header.classList.toggle('scrolled', y > 12);
    if (bar) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
    }
    toTop && toTop.classList.toggle('show', y > 700);
    paths.forEach((p) => {
      const r = p.getBoundingClientRect();
      const vh = window.innerHeight;
      const prog = Math.max(0, Math.min(1, (vh * 0.72 - r.top) / (r.height * 0.9)));
      p.style.setProperty('--p', prog.toFixed(3));
      const steps = $$('.path-step', p);
      steps.forEach((s, i) => s.classList.toggle('on', prog > (steps.length === 1 ? 0 : i / (steps.length - 1)) - 0.001 && prog > 0.02));
    });
  });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
  toTop && toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  /* ---------- Reveal on scroll (+ stagger) ---------- */
  $$('[data-stagger]').forEach((box) =>
    $$(':scope > .reveal', box).forEach((el, i) => el.style.setProperty('--d', Math.min(i, 8) * 0.07 + 's'))
  );
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
  }

  /* ---------- Count-up numbers ---------- */
  function countUp(el) {
    const end = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    if (reduceMotion || isNaN(end)) { el.textContent = end + suffix; return; }
    const t0 = performance.now(), dur = 1500;
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(end * eased) + suffix;
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  const counters = $$('[data-count]');
  if ('IntersectionObserver' in window) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { countUp(en.target); co.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach((c) => co.observe(c));
  } else counters.forEach(countUp);

  /* ---------- Card spotlight follows the pointer ---------- */
  document.addEventListener('pointermove', raf((e) => {
    const card = e.target.closest && e.target.closest('.card');
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', e.clientX - r.left + 'px');
    card.style.setProperty('--my', e.clientY - r.top + 'px');
  }), { passive: true });

  /* ---------- Filters (classes + portfolio) ---------- */
  $$('[data-filter-group]').forEach((group) => {
    const items = $$(group.dataset.filterGroup);
    const empty = $(group.dataset.empty || '');
    const buttons = $$('[data-filter]', group);

    buttons.forEach((b) => {
      const n = b.dataset.filter === 'all' ? items.length : items.filter((i) => i.dataset.category === b.dataset.filter).length;
      const small = $('small', b);
      if (small) small.textContent = n;
    });

    function apply(value) {
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === value)));
      let shown = 0;
      items.forEach((it) => {
        const match = value === 'all' || it.dataset.category === value;
        if (match) shown++;
        if (match && it.hidden) {
          it.hidden = false;
          it.classList.add('f-out');
          requestAnimationFrame(() => requestAnimationFrame(() => it.classList.remove('f-out')));
        } else if (!match && !it.hidden) {
          it.classList.add('f-out');
          setTimeout(() => { if (it.classList.contains('f-out')) it.hidden = true; }, reduceMotion ? 0 : 240);
        }
      });
      if (empty) empty.hidden = shown !== 0;
    }
    buttons.forEach((b) => b.addEventListener('click', () => apply(b.dataset.filter)));
    group._apply = apply;
  });

  // Deep link such as classes.html#breaking — make sure the card isn't filtered out
  function revealHashTarget() {
    if (!location.hash) return;
    const target = $(location.hash.replace(/[^#\w-]/g, ''));
    if (target && target.hidden) {
      const g = $('[data-filter-group]');
      if (g && g._apply) {
        g._apply('all');
        requestAnimationFrame(() => target.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' }));
      }
    }
  }
  revealHashTarget();
  window.addEventListener('hashchange', revealHashTarget);

  /* ---------- Portfolio video modal ---------- */
  const dlg = $('#videoDialog');
  if (dlg && typeof dlg.showModal === 'function') {
    const frame = $('.vd-frame', dlg);
    const titleEl = $('#vdTitle', dlg);
    const fallback = $('.vd-fallback', dlg);
    let lastFocus = null;

    const clearPlayer = () => {
      $$('video, iframe', frame).forEach((n) => { if (n.pause) n.pause(); n.remove(); });
      fallback.classList.remove('show');
    };

    function openVideo(btn) {
      lastFocus = btn;
      clearPlayer();
      titleEl.textContent = btn.dataset.title || 'Video';
      const yt = btn.dataset.yt;
      if (yt) {
        const f = document.createElement('iframe');
        f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(yt) + '?autoplay=1&rel=0';
        f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
        f.allowFullscreen = true;
        f.title = btn.dataset.title || 'Video';
        frame.prepend(f);
      } else {
        const v = document.createElement('video');
        v.controls = true; v.autoplay = true; v.playsInline = true; v.preload = 'metadata';
        v.src = btn.dataset.src;
        v.addEventListener('error', () => { v.remove(); fallback.classList.add('show'); });
        frame.prepend(v);
      }
      dlg.showModal();
      root.classList.add('modal-open');
    }

    $$('.thumb[data-src], .thumb[data-yt]').forEach((b) => b.addEventListener('click', () => openVideo(b)));
    $$('[data-close-video]', dlg).forEach((b) => b.addEventListener('click', () => dlg.close()));
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', () => {
      clearPlayer();
      root.classList.remove('modal-open');
      lastFocus && lastFocus.focus();
    });
  }

  /* ---------- Contact form ---------- */
  const form = $('#contactForm');
  if (form) {
    const PHONE_WA = '919971711243';
    const TO = 'edceternals@gmail.com';
    const f = {
      name: $('#name'), email: $('#email'), phone: $('#phone'), subject: $('#subject'), message: $('#message'),
    };
    const success = $('#formSuccess');
    const mailLink = $('#mailFallback');
    const waLink = $('#waFallback');

    // Pre-fill from links like contact.html?subject=Trial%20Class&class=Hip%20Hop
    const qs = new URLSearchParams(location.search);
    const wantSubject = qs.get('subject');
    if (wantSubject) {
      const opt = Array.from(f.subject.options).find((o) => o.value.toLowerCase() === wantSubject.toLowerCase());
      if (opt) f.subject.value = opt.value;
    }
    const pre = [];
    if (qs.get('class')) pre.push("I'm interested in " + qs.get('class') + ' classes.');
    if (qs.get('package')) pre.push("I'd like a quote for the " + qs.get('package') + ' wedding choreography package.');
    if (pre.length && !f.message.value) f.message.value = pre.join(' ') + ' ';

    const setErr = (el, msg) => {
      const wrap = el.closest('.field');
      wrap.classList.toggle('invalid', !!msg);
      const e = $('.err', wrap);
      if (e) e.textContent = msg || '';
      el.setAttribute('aria-invalid', msg ? 'true' : 'false');
      return !msg;
    };
    const rules = {
      name: (v) => (v.trim().length < 2 ? 'Please enter your name.' : ''),
      email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Please enter a valid email address.'),
      phone: (v) => (!v.trim() || v.replace(/\D/g, '').length >= 10 ? '' : 'Please enter a 10-digit phone number.'),
      subject: (v) => (v ? '' : 'Please choose a subject.'),
      message: (v) => (v.trim().length < 10 ? 'Please write a short message (at least 10 characters).' : ''),
    };
    let attempted = false; // don't nag about empty fields until the first submit
    Object.keys(rules).forEach((k) => {
      f[k].addEventListener('blur', () => { if (attempted || f[k].value.trim()) setErr(f[k], rules[k](f[k].value)); });
      f[k].addEventListener('input', () => { if (f[k].closest('.field').classList.contains('invalid')) setErr(f[k], rules[k](f[k].value)); });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      attempted = true;
      let firstBad = null;
      Object.keys(rules).forEach((k) => { if (!setErr(f[k], rules[k](f[k].value)) && !firstBad) firstBad = f[k]; });
      if (firstBad) { firstBad.focus(); return; }

      const body =
        'Name: ' + f.name.value.trim() + '\n' +
        'Email: ' + f.email.value.trim() + '\n' +
        (f.phone.value.trim() ? 'Phone: ' + f.phone.value.trim() + '\n' : '') +
        '\n' + f.message.value.trim();
      const subject = f.subject.value + ' — ' + f.name.value.trim();
      const mailto = 'mailto:' + TO + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      const wa = 'https://wa.me/' + PHONE_WA + '?text=' + encodeURIComponent('Hi Evolution Dance Centre! (' + f.subject.value + ')\n\n' + body);

      mailLink.href = mailto;
      waLink.href = wa;
      success.classList.add('show');
      success.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      window.location.href = mailto;
    });
  }

  /* ---------- Prefetch internal pages on hover/touch for snappy navigation ---------- */
  const prefetched = new Set();
  const prefetch = (e) => {
    const a = e.target.closest && e.target.closest('a[href$=".html"]');
    if (!a || a.target === '_blank' || prefetched.has(a.href) || a.origin !== location.origin) return;
    prefetched.add(a.href);
    const l = document.createElement('link');
    l.rel = 'prefetch'; l.href = a.href;
    document.head.appendChild(l);
  };
  document.addEventListener('mouseover', prefetch, { passive: true });
  document.addEventListener('touchstart', prefetch, { passive: true });

  /* ---------- Footer year ---------- */
  $$('[data-year]').forEach((n) => (n.textContent = new Date().getFullYear()));
})();
