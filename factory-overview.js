(() => {
  'use strict';

  const root = document.querySelector('.factory-overview-page');
  if (!root) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = [...root.querySelectorAll('[data-reveal]')];
  const counters = [...root.querySelectorAll('[data-counter]')];
  let countersStarted = false;

  const formatCounter = (value, element) => {
    const pad = Number(element.dataset.pad || 0);
    if (pad > 0) return String(value).padStart(pad, '0');
    if (element.dataset.format === 'dot') return value.toLocaleString('vi-VN');
    return String(value);
  };

  const runCounters = () => {
    if (countersStarted) return;
    countersStarted = true;

    counters.forEach((element) => {
      const target = Number(element.dataset.counter || 0);
      if (!Number.isFinite(target)) return;

      if (prefersReducedMotion) {
        element.textContent = formatCounter(target, element);
        return;
      }

      const duration = 1100;
      const startTime = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(target * eased);
        element.textContent = formatCounter(current, element);
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    });
  };

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
    runCounters();
    return;
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.12
  });

  revealItems.forEach((item) => revealObserver.observe(item));

  const stats = root.querySelector('.factory-overview-page__stats');
  if (stats) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        runCounters();
        observer.disconnect();
      });
    }, { threshold: 0.35 });
    counterObserver.observe(stats);
  } else {
    runCounters();
  }
})();
