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

  const chooser = document.createElement('div');
  chooser.className = 'email-chooser-backdrop';
  chooser.setAttribute('aria-hidden', 'true');
  chooser.innerHTML = `
    <div class="email-chooser" role="dialog" aria-modal="true" aria-labelledby="emailChooserTitle">
      <div class="email-chooser-head">
        <div>
          <h3 id="emailChooserTitle">Choose your email app</h3>
          <p>Your enquiry is ready. Pick how you want to send it.</p>
        </div>
        <button class="email-chooser-close" type="button" aria-label="Close">×</button>
      </div>
      <div class="email-app-grid">
        <button class="email-app-btn" type="button" data-mail="gmail"><span class="mail-icon">✉️</span><span>Gmail</span></button>
        <button class="email-app-btn" type="button" data-mail="outlook"><span class="mail-icon">📨</span><span>Outlook</span></button>
        <button class="email-app-btn" type="button" data-mail="yahoo"><span class="mail-icon">💌</span><span>Yahoo Mail</span></button>
        <button class="email-app-btn" type="button" data-mail="default"><span class="mail-icon">📧</span><span>Default Mail</span></button>
        <button class="email-app-btn full" type="button" data-mail="copy"><span class="mail-icon">📋</span><span>Copy enquiry details</span></button>
      </div>
      <div class="email-copy-note">On some phones, Gmail/Outlook may open in the browser if the app cannot be launched directly.</div>
    </div>`;
  document.body.appendChild(chooser);

  const closeChooser = () => {
    chooser.classList.remove('open');
    chooser.setAttribute('aria-hidden', 'true');
  };
  chooser.querySelector('.email-chooser-close').addEventListener('click', closeChooser);
  chooser.addEventListener('click', (e) => { if (e.target === chooser) closeChooser(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeChooser(); });

  let prepared = null;

  const openWithFallback = (appUrl, webUrl) => {
    if (!appUrl) {
      window.open(webUrl, '_blank', 'noopener');
      return;
    }
    const started = Date.now();
    window.location.href = appUrl;
    setTimeout(() => {
      if (document.visibilityState === 'visible' && Date.now() - started < 1800) {
        window.open(webUrl, '_blank', 'noopener');
      }
    }, 900);
  };

  chooser.querySelectorAll('[data-mail]').forEach(button => {
    button.addEventListener('click', async () => {
      if (!prepared) return;
      const { to, subject, body } = prepared;
      const qs = `to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      const type = button.dataset.mail;

      if (type === 'gmail') {
        openWithFallback(
          `googlegmail://co?${qs}`,
          `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
        );
      } else if (type === 'outlook') {
        openWithFallback(
          `ms-outlook://compose?${qs}`,
          `https://outlook.office.com/mail/deeplink/compose?${qs}`
        );
      } else if (type === 'yahoo') {
        window.open(`https://compose.mail.yahoo.com/?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank', 'noopener');
      } else if (type === 'default') {
        window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      } else if (type === 'copy') {
        const text = `To: ${to}\nSubject: ${subject}\n\n${body}`;
        try {
          await navigator.clipboard.writeText(text);
          button.querySelector('span:last-child').textContent = 'Copied ✓';
          setTimeout(() => button.querySelector('span:last-child').textContent = 'Copy enquiry details', 1600);
        } catch {
          window.prompt('Copy your enquiry details:', text);
        }
      }
    });
  });

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
      `Budget: ${fd.get('budget') ? `${fd.get('currency') || 'USD'} ${fd.get('budget')}` : 'Not specified'}`,
      `Timeline: ${fd.get('timeline') || 'Not specified'}`,
      '',
      'Project details:',
      `${fd.get('message') || ''}`
    ].join('\n');
    const subject = `MetaOneClick enquiry — ${fd.get('company') || fd.get('name') || 'New project'}`;
    prepared = { to: 'contact@metaoneclick.com', subject, body };
    const status = form.querySelector('.form-status');
    if (status) status.textContent = 'Your enquiry is ready — choose an email app to send it.';
    chooser.classList.add('open');
    chooser.setAttribute('aria-hidden', 'false');
  });
})();
