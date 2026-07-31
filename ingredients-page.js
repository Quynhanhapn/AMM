(() => {
  const page = document.querySelector('.ingredients-page');
  if (!page) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = [...document.querySelectorAll('[data-ingredients-reveal]')];
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }
  page.classList.add('ingredients-motion');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const siblings = [...entry.target.parentElement.querySelectorAll('[data-ingredients-reveal]')];
      const index = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${Math.min(index, 6) * 70}ms`;
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
  items.forEach(item => observer.observe(item));
})();
