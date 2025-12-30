// Load modular sections and wire up scroll spy once content is in place.
(function () {
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

    const accent = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-accent')
      .trim();
    const border = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-border')
      .trim();

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
      context.strokeStyle = border;
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
      context.strokeStyle = border;
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
      context.strokeStyle = accent || '#8b5e34';
      context.shadowColor = accent || '#8b5e34';
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

  loadSections()
    .then(() => {
      initScrollSpy();
      initKnowledgeChart();
    })
    .catch(() => {
      initScrollSpy();
      initKnowledgeChart();
    });
})();
