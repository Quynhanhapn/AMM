(() => {
  const body = document.body;
  const menuToggle = document.querySelector('.menu-toggle');
  const backdrop = document.querySelector('.nav-backdrop');
  const nav = document.querySelector('.primary-nav');

  const closeMenu = () => {
    body.classList.remove('nav-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  };

  menuToggle?.addEventListener('click', () => {
    const open = !body.classList.contains('nav-open');
    body.classList.toggle('nav-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  backdrop?.addEventListener('click', closeMenu);

  document.querySelectorAll('.submenu-toggle').forEach((button) => {
    button.addEventListener('click', () => {
      const group = button.closest('.nav-group');
      const open = !group.classList.contains('open');
      document.querySelectorAll('.nav-group.open').forEach((item) => {
        if (item !== group) {
          item.classList.remove('open');
          item.querySelector('.submenu-toggle')?.setAttribute('aria-expanded', 'false');
        }
      });
      group.classList.toggle('open', open);
      button.setAttribute('aria-expanded', String(open));
    });
  });

  nav?.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (window.innerWidth > 1080) closeMenu(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });

  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08 })
    : null;

  document.querySelectorAll('.reveal').forEach((element) => {
    if (observer) observer.observe(element);
    else element.classList.add('visible');
  });

  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  const dialog = document.querySelector('#contact-dialog');
  const openButtons = document.querySelectorAll('[data-open-contact]');
  const closeButtons = document.querySelectorAll('[data-close-dialog]');
  const inquirySelect = dialog?.querySelector('[name="inquiry"]');

  openButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const value = button.dataset.contactType;
      if (value && inquirySelect) inquirySelect.value = value;
      if (dialog?.showModal) dialog.showModal();
      else dialog?.setAttribute('open', '');
    });
  });
  closeButtons.forEach((button) => button.addEventListener('click', () => dialog?.close()));
  dialog?.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
    if (!inside) dialog.close();
  });

  const toast = document.querySelector('#toast');
  let toastTimer;
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
  };

  document.querySelector('[data-video-button]')?.addEventListener('click', (event) => {
    const button = event.currentTarget;
    const url = button.dataset.videoUrl;
    if (url) window.open(url, '_blank', 'noopener');
    else showToast(button.dataset.emptyMessage || 'Video is being updated.');
  });

  const form = document.querySelector('[data-contact-form]');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const language = form.dataset.language || 'vi';
    const email = form.dataset.recipient;
    const subjectPrefix = form.dataset.subject || 'AMM cooperation inquiry';
    const labels = language === 'en'
      ? { company: 'Company', name: 'Contact person', phone: 'Phone', email: 'Email', inquiry: 'Inquiry', message: 'Message' }
      : { company: 'Doanh nghiệp', name: 'Người liên hệ', phone: 'Điện thoại', email: 'Email', inquiry: 'Nhu cầu', message: 'Nội dung' };
    const lines = Object.keys(labels).map((key) => `${labels[key]}: ${data.get(key) || ''}`);
    const subject = `${subjectPrefix} - ${data.get('company') || data.get('name') || ''}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
    showToast(form.dataset.successMessage || 'Your email application will open.');
    setTimeout(() => dialog?.close(), 600);
  });
})();
