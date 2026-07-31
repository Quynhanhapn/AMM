(() => {
  'use strict';

  const section = document.querySelector('.amm-tech-partners');
  if (!section) return;

  section.classList.add('amm-tech-partners--js');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = section.querySelectorAll('.amm-tech-partners__reveal');

  if (reducedMotion || !('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      currentObserver.unobserve(entry.target);
    });
  }, {
    root: null,
    threshold: 0.16,
    rootMargin: '0px 0px -8% 0px'
  });

  items.forEach((item) => observer.observe(item));
})();
