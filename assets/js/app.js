/* Felix Machán — portfolio behaviours: theme, language, nav, reveal,
   crosshair readout, progress bar, lightbox, contact form. */
(function () {
  'use strict';

  var root = document.documentElement;
  var page = document.body.getAttribute('data-page') || 'index';

  /* ---------- Theme ---------- */
  var THEME_KEY = 'theme';

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    document.querySelectorAll('img[data-light]').forEach(function (img) {
      var next = theme === 'dark' ? img.getAttribute('data-dark') : img.getAttribute('data-light');
      if (next) img.setAttribute('src', next);
    });
    var toggle = document.querySelector('.theme-toggle');
    if (toggle) toggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  }

  function initTheme() {
    var stored = null;
    try { stored = localStorage.getItem(THEME_KEY); } catch (e) {}
    var theme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(theme);
    var toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
      applyTheme(next);
    });
  }

  /* ---------- Language / i18n ---------- */
  var LANG_KEY = 'lang';
  var dict = window.I18N || {};

  function lookup(key) {
    if (dict[page] && Object.prototype.hasOwnProperty.call(dict[page], key)) return dict[page][key];
    if (dict.common && Object.prototype.hasOwnProperty.call(dict.common, key)) return dict.common[key];
    return null;
  }

  function applyLang(lang) {
    root.setAttribute('lang', lang);
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      if (el.dataset.enHtml === undefined) el.dataset.enHtml = el.innerHTML;
      var hu = lookup(el.getAttribute('data-i18n'));
      el.innerHTML = lang === 'hu' && hu !== null ? hu : el.dataset.enHtml;
    });

    // Outbound links with a Hungarian variant (e.g. cheerlify.com vs cheerlify.com/en)
    document.querySelectorAll('a[data-href-hu]').forEach(function (a) {
      if (a.dataset.hrefEn === undefined) a.dataset.hrefEn = a.getAttribute('href');
      a.setAttribute('href', lang === 'hu' ? a.dataset.hrefHu : a.dataset.hrefEn);
    });

    // <title> and meta description
    var titleHu = lookup('_title');
    var descHu = lookup('_desc');
    var titleEl = document.querySelector('title');
    var descEl = document.querySelector('meta[name="description"]');
    if (titleEl) {
      if (titleEl.dataset.en === undefined) titleEl.dataset.en = titleEl.textContent;
      titleEl.textContent = lang === 'hu' && titleHu ? titleHu : titleEl.dataset.en;
    }
    if (descEl) {
      if (descEl.dataset.en === undefined) descEl.dataset.en = descEl.getAttribute('content');
      descEl.setAttribute('content', lang === 'hu' && descHu ? descHu : descEl.dataset.en);
    }

    document.querySelectorAll('.lang-toggle__opt').forEach(function (opt) {
      opt.classList.toggle('is-active', opt.getAttribute('data-lang-option') === lang);
    });
  }

  function initLang() {
    var stored = null;
    try { stored = localStorage.getItem(LANG_KEY); } catch (e) {}
    var lang = stored === 'hu' || stored === 'en' ? stored : 'en';
    if (lang !== 'en') applyLang(lang);
    else applyLang('en');
    var toggle = document.querySelector('.lang-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('lang') === 'hu' ? 'en' : 'hu';
      try { localStorage.setItem(LANG_KEY, next); } catch (e) {}
      applyLang(next);
    });
  }

  /* ---------- Nav: burger + scroll spy ---------- */
  function initNav() {
    var nav = document.querySelector('.nav');
    if (!nav) return;
    var burger = nav.querySelector('.nav__burger');
    if (burger) {
      burger.addEventListener('click', function () {
        var open = nav.classList.toggle('is-open');
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      nav.querySelectorAll('.nav__link').forEach(function (link) {
        link.addEventListener('click', function () {
          nav.classList.remove('is-open');
          burger.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // Scroll spy only on pages with in-page anchors
    var links = Array.prototype.slice.call(nav.querySelectorAll('.nav__link[href^="#"]'));
    if (!links.length || !('IntersectionObserver' in window)) return;
    var map = {};
    links.forEach(function (link) {
      var id = link.getAttribute('href').slice(1);
      var section = document.getElementById(id);
      if (section) map[id] = link;
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (l) { l.classList.remove('is-active'); });
        var link = map[entry.target.id];
        if (link) link.classList.add('is-active');
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    Object.keys(map).forEach(function (id) {
      spy.observe(document.getElementById(id));
    });
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    if (!('IntersectionObserver' in window) ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    // stagger siblings inside [data-stagger]
    document.querySelectorAll('[data-stagger]').forEach(function (group) {
      Array.prototype.forEach.call(group.querySelectorAll('.reveal'), function (el, i) {
        el.style.setProperty('--reveal-delay', Math.min(i * 0.08, 0.5) + 's');
      });
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Hero: draw-in + CAD readout ---------- */
  function initHero() {
    var hero = document.querySelector('.hero');
    if (!hero) return;
    window.setTimeout(function () { hero.classList.add('is-drawn'); }, 250);

    var readout = hero.querySelector('.hero__readout');
    if (!readout) return;
    var PX_TO_MM = 25.4 / 96;
    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      var x = ((e.clientX - rect.left) * PX_TO_MM).toFixed(1);
      var y = ((e.clientY - rect.top) * PX_TO_MM).toFixed(1);
      readout.textContent = 'X ' + x + '  Y ' + y + '  MM';
    });
  }

  /* ---------- Progress bar (project pages) ---------- */
  function initProgress() {
    var bar = document.querySelector('.progress__bar');
    if (!bar) return;
    var update = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---------- Lightbox ---------- */
  function initLightbox() {
    var figs = document.querySelectorAll('.fig');
    if (!figs.length) return;
    var overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML =
      '<figure><img alt="" /><figcaption></figcaption></figure>' +
      '<button class="lightbox__close" type="button" aria-label="Close">ESC / CLOSE</button>';
    document.body.appendChild(overlay);
    var img = overlay.querySelector('img');
    var caption = overlay.querySelector('figcaption');

    var activeFigure = null;
    var closeButton = overlay.querySelector('.lightbox__close');
    closeButton.setAttribute('aria-label', 'Close image');
    caption.id = 'lightbox-caption';
    overlay.setAttribute('aria-labelledby', caption.id);

    function close() {
      if (!overlay.classList.contains('is-open')) return;
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
      if (activeFigure) activeFigure.focus({ preventScroll: true });
    }

    figs.forEach(function (fig) {
      var src = fig.querySelector('img');
      if (!src) return;
      fig.tabIndex = 0;
      fig.setAttribute('role', 'button');
      fig.setAttribute('aria-haspopup', 'dialog');
      function open() {
        activeFigure = fig;
        img.src = src.currentSrc || src.src;
        img.alt = src.alt || '';
        var cap = fig.querySelector('figcaption');
        caption.textContent = cap ? cap.textContent : '';
        overlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        closeButton.focus();
      }
      fig.addEventListener('click', function (e) {
        if (e.target.closest('a')) return; // photo credit links open normally
        open();
      });
      fig.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
      });
    });

    overlay.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
      if (e.key === 'Tab' && overlay.classList.contains('is-open')) {
        e.preventDefault();
        closeButton.focus();
      }
    });
  }

  /* ---------- Contact form ---------- */
  function initForm() {
    var form = document.querySelector('.contact-form form');
    if (!form || !window.fetch) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var note = form.querySelector('.form-note');
      if (btn) btn.disabled = true;
      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (res) {
          if (!res.ok) throw new Error('send failed');
          form.reset();
          if (note) {
            note.classList.add('is-visible');
            note.dataset.state = 'ok';
          }
        })
        .catch(function () {
          if (note) {
            note.classList.add('is-visible');
            note.style.color = 'var(--warn)';
            var lang = root.getAttribute('lang');
            note.textContent = lang === 'hu'
              ? '// Hiba történt — írj inkább a LinkedIn-en.'
              : '// Transmission failed — reach me on LinkedIn instead.';
          }
        })
        .finally(function () {
          if (btn) btn.disabled = false;
        });
    });
  }

  /* ---------- 3D viewer: load model-viewer only when it is about to scroll into view ---------- */
  function initModelViewer() {
    var viewers = document.querySelectorAll('model-viewer');
    if (!viewers.length) return;
    var loaded = false;
    function load() {
      if (loaded) return;
      loaded = true;
      var s = document.createElement('script');
      s.type = 'module';
      s.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
      document.head.appendChild(s);
    }
    if (!('IntersectionObserver' in window)) { load(); return; }
    var io = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) { load(); io.disconnect(); }
    }, { rootMargin: '600px 0px' });
    viewers.forEach(function (v) { io.observe(v); });
  }

  /* ---------- Boot ---------- */
  initTheme();
  initLang();
  initNav();
  initReveal();
  initHero();
  initProgress();
  initLightbox();
  initForm();
  initModelViewer();
})();
