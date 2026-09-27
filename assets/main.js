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
  if (!form) return;

  const currencyInput = form.querySelector('#currency');
  const currencyTabs = form.querySelectorAll('.currency-tab');
  currencyTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      currencyTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-pressed', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-pressed', 'true');
      if (currencyInput) currencyInput.value = tab.dataset.currency || 'USD';
    });
  });

  form.addEventListener('submit', () => {
    const status = form.querySelector('.form-status');
    const submit = form.querySelector('button[type="submit"]');
    if (status) status.textContent = 'Sending your enquiry…';
    if (submit) {
      submit.disabled = true;
      submit.textContent = 'Sending…';
    }
  });
})();
