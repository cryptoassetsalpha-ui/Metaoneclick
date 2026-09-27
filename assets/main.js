(() => {
  const btn = document.querySelector('.menu-btn');
  const nav = document.querySelector('.navlinks');
  if (btn && nav) {
    btn.addEventListener('click', () => {
      nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', nav.classList.contains('open') ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
  }

  const form = document.getElementById('leadForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const fd = new FormData(form);
      const services = fd.getAll('services').join(', ') || 'Not specified';
      const body = [
        `Name: ${fd.get('name') || ''}`,
        `Company / project: ${fd.get('company') || ''}`,
        `Email: ${fd.get('email') || ''}`,
        `Phone / WhatsApp: ${fd.get('phone') || ''}`,
        `Services: ${services}`,
        `Budget: ${fd.get('budget') || 'Not specified'}`,
        `Timeline: ${fd.get('timeline') || 'Not specified'}`,
        '',
        'Project details:',
        `${fd.get('message') || ''}`
      ].join('\n');
      const subject = `MetaOneClick enquiry — ${fd.get('company') || fd.get('name') || 'New project'}`;
      const status = form.querySelector('.form-status');
      if (status) status.textContent = 'Opening your email app with the project details…';
      window.location.href = `mailto:hello@metaoneclick.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }
})();
