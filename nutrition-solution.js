(() => {
  'use strict';

  const page = document.querySelector('.nutrition-solution-page');
  if (!page) return;

  const items = Array.from(page.querySelectorAll('[data-ns-reveal]'));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  page.classList.add('ns-motion');

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const delay = Number.parseInt(entry.target.dataset.nsDelay || '0', 10);
      window.setTimeout(() => entry.target.classList.add('is-visible'), Number.isFinite(delay) ? delay : 0);
      currentObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -7% 0px'
  });

  items.forEach((item) => observer.observe(item));
})();
