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

  loadSections()
    .then(() => {
      initScrollSpy();
    })
    .catch(() => {
      initScrollSpy();
    });
})();
