(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('formula-motion');

  const revealItems = [...document.querySelectorAll('.formula-reveal')];
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 6, 5) * 55}ms`;
    });
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const counters = [...document.querySelectorAll('[data-count]')];
  const setCounterFinal = (counter) => {
    const target = Number(counter.dataset.count || 0);
    const suffix = counter.dataset.suffix || '';
    counter.textContent = `${target.toLocaleString('vi-VN')}${suffix}`;
  };

  const animateCounter = (counter) => {
    if (counter.dataset.counted === 'true') return;
    counter.dataset.counted = 'true';
    const target = Number(counter.dataset.count || 0);
    const suffix = counter.dataset.suffix || '';
    if (reducedMotion || target <= 0) {
      setCounterFinal(counter);
      return;
    }
    const duration = 1250;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      counter.textContent = `${value.toLocaleString('vi-VN')}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (reducedMotion || !('IntersectionObserver' in window)) {
    counters.forEach(setCounterFinal);
  } else {
    const countObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.45 });
    counters.forEach((counter) => countObserver.observe(counter));
  }
})();
