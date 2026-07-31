/* AMM R&D page interactions — vanilla JavaScript only */
(() => {
  'use strict';

  document.documentElement.classList.add('js');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = document.querySelectorAll('.rd-reveal');
  const processTrack = document.querySelector('[data-rd-process]');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
    processTrack?.classList.add('is-visible');
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });

    revealItems.forEach((item) => revealObserver.observe(item));

    if (processTrack) {
      const processObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -14% 0px', threshold: 0.2 });

      processObserver.observe(processTrack);
    }
  }

  const lightbox = document.querySelector('#rd-lightbox');
  const lightboxImage = lightbox?.querySelector('[data-rd-lightbox-image]');
  const lightboxCaption = lightbox?.querySelector('[data-rd-lightbox-caption]');
  const lightboxClose = lightbox?.querySelector('[data-rd-lightbox-close]');
  const galleryButtons = document.querySelectorAll('[data-rd-lightbox-open]');
  let lastTrigger = null;

  const closeLightbox = () => {
    if (!lightbox) return;
    if (typeof lightbox.close === 'function') lightbox.close();
    lastTrigger?.focus();
  };

  galleryButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (!lightbox || !lightboxImage || !lightboxCaption) return;
      const image = button.querySelector('img');
      const caption = button.dataset.caption || image?.alt || '';
      if (!image) return;

      lastTrigger = button;
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt;
      lightboxCaption.textContent = caption;

      if (typeof lightbox.showModal === 'function') {
        lightbox.showModal();
      } else {
        lightbox.setAttribute('open', '');
      }
    });
  });

  lightboxClose?.addEventListener('click', closeLightbox);

  lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  lightbox?.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeLightbox();
  });
})();
