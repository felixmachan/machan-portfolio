// Load modular sections and wire up scroll spy once content is in place.
(function () {
  const initThemeToggle = () => {
    const root = document.documentElement;
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;

    const swapThemeImages = (theme) => {
      const themedImages = document.querySelectorAll('[data-light][data-dark]');
      themedImages.forEach((img) => {
        const nextSrc = theme === 'dark' ? img.dataset.dark : img.dataset.light;
        if (nextSrc) {
          img.setAttribute('src', nextSrc);
        }
      });
    };

    const applyTheme = (theme) => {
      if (theme === 'dark') {
        root.setAttribute('data-theme', 'dark');
      } else {
        root.removeAttribute('data-theme');
      }
      toggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      toggle.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
      swapThemeImages(theme);
    };

    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = stored || 'light';
    applyTheme(initialTheme);
    requestAnimationFrame(() => {
      root.classList.add('theme-ready');
    });

    toggle.addEventListener('click', () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      const nextTheme = isDark ? 'light' : 'dark';
      localStorage.setItem('theme', nextTheme);
      applyTheme(nextTheme);
    });
  };

  const initProgressBar = () => {
    // The bar should only appear on project pages, and only on mobile.
    // CSS handles the mobile-only part. JS just needs to find the element.
    const progressBar = document.querySelector('.progress-bar');
    if (!progressBar) return;

    const updateProgress = () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (scrollHeight <= 0) {
        progressBar.style.width = '0%';
        return;
      }
      const scrollPercent = (scrollTop / scrollHeight) * 100;
      progressBar.style.width = scrollPercent + '%';
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();
  };
  initProgressBar(); // Call the function

  const includeTargets = Array.from(document.querySelectorAll('[data-include]'));

  const loadSections = async () => {
    if (includeTargets.length === 0) return;
    const fetches = includeTargets.map(async (target) => {
      const path = target.getAttribute('data-include');
      if (!path) return;
      const response = await fetch(path);
      if (!response.ok) {
        target.innerHTML = `<section class="section"><div class="container"><p>Missing section: ${path}</p></div></section>`;
        return;
      }
      const html = await response.text();
      target.outerHTML = html;
    });
    await Promise.all(fetches);
  };


  const initSectionPager = () => {
    const pager = document.querySelector('.section-pager');
    if (!pager) return;

    const btnUp = pager.querySelector('.section-pager__btn[data-dir="up"]');
    const btnDown = pager.querySelector('.section-pager__btn[data-dir="down"]');
    if (!btnUp || !btnDown) return;

    const sections = Array.from(document.querySelectorAll('main > section[id]'));
    if (sections.length === 0) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

    const getCurrentIndex = () => {
      const probeY = window.innerHeight * 0.35;
      let idx = 0;
      for (let i = 0; i < sections.length; i += 1) {
        const rect = sections[i].getBoundingClientRect();
        if (rect.top <= probeY) idx = i;
        else break;
      }
      return idx;
    };

    const updateDisabled = () => {
      const idx = getCurrentIndex();

      btnUp.disabled = idx <= 0;
      btnDown.disabled = idx >= sections.length - 1;

      btnUp.setAttribute('aria-disabled', btnUp.disabled ? 'true' : 'false');
      btnDown.setAttribute('aria-disabled', btnDown.disabled ? 'true' : 'false');
    };

    const scrollToIndex = (idx) => {
      const target = sections[clamp(idx, 0, sections.length - 1)];
      if (!target) return;
      target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
    };

    pager.addEventListener('click', (e) => {
      const btn = e.target.closest('.section-pager__btn');
      if (!btn || btn.disabled) return;

      const dir = btn.dataset.dir;
      const current = getCurrentIndex();
      const next = dir === 'up' ? current - 1 : current + 1;
      scrollToIndex(next);

      // smooth scroll alatt később “érkezik meg”, ezért kis késleltetés:
      window.setTimeout(updateDisabled, prefersReduced ? 0 : 250);
    });

    window.addEventListener('scroll', updateDisabled, { passive: true });
    window.addEventListener('resize', updateDisabled);

    updateDisabled();
  };




  const initScrollSpy = () => {
    const nav = document.querySelector('.side-nav');
    if (!nav) return;

    const items = Array.from(nav.querySelectorAll('.side-nav__item'));
    const indicator = nav.querySelector('.side-nav__indicator');
    const sections = items
      .map((item) => document.querySelector(item.getAttribute('href')))
      .filter(Boolean);

    const setActive = (item) => {
      items.forEach((el) => {
        const isActive = el === item;
        el.classList.toggle('is-active', isActive);
        if (isActive) {
          el.setAttribute('aria-current', 'true');
        } else {
          el.removeAttribute('aria-current');
        }
      });

      if (!indicator) return;
      const dot = item.querySelector('.side-nav__dot');
      if (!dot) return;
      const navRect = nav.getBoundingClientRect();
      const dotRect = dot.getBoundingClientRect();
      const top = dotRect.top - navRect.top + dotRect.height / 2;
      indicator.style.top = `${top}px`;
    };

    if (items.length > 0) {
      setActive(items[0]);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length === 0) return;
        const index = sections.indexOf(visible[0].target);
        if (index >= 0) {
          setActive(items[index]);
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0.1 }
    );

    sections.forEach((section) => observer.observe(section));

    items.forEach((item) => {
      item.addEventListener('click', (event) => {
        const targetSelector = item.getAttribute('href');
        if (!targetSelector || !targetSelector.startsWith('#')) return;
        const target = document.querySelector(targetSelector);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActive(item);
      });
    });

    const handleScroll = () => {
      if (items.length === 0) return;
      const marker = window.scrollY + window.innerHeight * 0.35;
      let activeIndex = 0;
      sections.forEach((section, index) => {
        if (marker >= section.offsetTop) {
          activeIndex = index;
        }
      });
      setActive(items[activeIndex]);

      const scrollBottom = window.scrollY + window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      if (scrollBottom >= docHeight - 2) {
        setActive(items[items.length - 1]);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    window.addEventListener('resize', () => {
      const activeItem = nav.querySelector('.side-nav__item.is-active');
      if (activeItem) setActive(activeItem);
    });
  };

  const initKnowledgeChart = () => {
    const canvas = document.querySelector('#knowledge-chart');
    if (!canvas) return;

    const section = canvas.closest('section');
    const context = canvas.getContext('2d');
    if (!context) return;

    const styles = getComputedStyle(document.documentElement);
    const accent = styles.getPropertyValue('--color-chart-line').trim();
    const grid = styles.getPropertyValue('--color-chart-grid').trim();
    const axis = styles.getPropertyValue('--color-chart-axis').trim();

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = (progress) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const padding = 28;
      const left = padding;
      const bottom = height - padding;
      const right = width - padding;
      const top = padding;

      context.clearRect(0, 0, width, height);
      const gridCount = 6;
      context.lineWidth = 1;
      context.strokeStyle = grid;
      context.beginPath();
      for (let i = 0; i <= gridCount; i += 1) {
        const x = left + ((right - left) / gridCount) * i;
        const y = top + ((bottom - top) / gridCount) * i;
        context.moveTo(x, top);
        context.lineTo(x, bottom);
        context.moveTo(left, y);
        context.lineTo(right, y);
      }
      context.stroke();

      context.lineWidth = 2;
      context.strokeStyle = axis;
      context.beginPath();
      context.moveTo(left, top);
      context.lineTo(left, bottom);
      context.lineTo(right, bottom);
      context.stroke();

      const arrowSize = 6;
      context.beginPath();
      context.moveTo(left, top);
      context.lineTo(left - arrowSize, top + arrowSize);
      context.moveTo(left, top);
      context.lineTo(left + arrowSize, top + arrowSize);
      context.moveTo(right, bottom);
      context.lineTo(right - arrowSize, bottom - arrowSize);
      context.moveTo(right, bottom);
      context.lineTo(right - arrowSize, bottom + arrowSize);
      context.stroke();

      context.lineWidth = 3;
      context.strokeStyle = accent || '#c88e4f';
      context.shadowColor = accent || '#c88e4f';
      context.shadowBlur = 5;
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
      context.beginPath();

      const startX = left;
      const endX = right;
      const usableWidth = endX - startX;
      const xMax = startX + usableWidth * progress;

      let first = true;
      for (let x = startX; x <= xMax; x += usableWidth / 80) {
        const t = (x - startX) / usableWidth;
        const y = bottom - (bottom - top) * (t * 0.9);
        if (first) {
          context.moveTo(left, bottom);
          if (x > left) {
            context.lineTo(x, y);
          }
          first = false;
        } else {
          context.lineTo(x, y);
        }
      }
      context.stroke();
      context.shadowColor = 'transparent';
      context.shadowBlur = 0;
    };

    let animated = false;
    const animate = () => {
      if (animated) return;
      animated = true;
      const start = performance.now();
      const duration = 1400;

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        draw(progress);
        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };
      requestAnimationFrame(tick);
    };

    resizeCanvas();
    draw(0);

    if (section) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animate();
              observer.disconnect();
            }
          });
        },
        { threshold: 0.4 }
      );
      observer.observe(section);
    } else {
      animate();
    }

    window.addEventListener('resize', () => {
      resizeCanvas();
      draw(animated ? 1 : 0);
    });
  };

  const initSkillTiles = () => {
    const tiles = Array.from(document.querySelectorAll('.skill-tile'));
    if (tiles.length === 0) return;

    const collapseAll = () => {
      tiles.forEach((tile) => {
        tile.classList.remove('is-expanded');
        tile.setAttribute('aria-expanded', 'false');
      });
    };

    tiles.forEach((tile) => {
      tile.setAttribute('aria-expanded', 'false');
      const update = (event) => {
        const rect = tile.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        tile.style.setProperty('--gx', `${x.toFixed(2)}%`);
        tile.style.setProperty('--gy', `${y.toFixed(2)}%`);
      };

      tile.addEventListener('mousemove', update);
      tile.addEventListener('mouseenter', update);
      tile.addEventListener('mouseleave', () => {
        tile.style.removeProperty('--gx');
        tile.style.removeProperty('--gy');
      });

      tile.addEventListener('click', (event) => {
        event.preventDefault();
        const isExpanded = tile.classList.contains('is-expanded');
        collapseAll();
        if (!isExpanded) {
          tile.classList.add('is-expanded');
          tile.setAttribute('aria-expanded', 'true');
        }
      });

      tile.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          tile.click();
        }
      });
    });

    document.addEventListener('click', (event) => {
      if (!event.target.closest('.skill-tile')) {
        collapseAll();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        collapseAll();
      }
    });
  };

  loadSections()
    .then(() => {
      initThemeToggle();
      initScrollSpy();
      initSectionPager();
      initKnowledgeChart();
      initSkillTiles();
    })
    .catch(() => {
      initThemeToggle();
      initScrollSpy();
      initSectionPager();
      initKnowledgeChart();
      initSkillTiles();
    });
})();