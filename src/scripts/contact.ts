import { createMailto, readContactFields, resolveContactEndpoint, validateContact } from '../lib/contact.mjs';

export function initContactForm(): void {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  const button = form?.querySelector<HTMLButtonElement>('button[type="submit"]');
  const status = form?.querySelector<HTMLParagraphElement>('[data-form-status]');
  if (!form || !button || !status) return;
  let submitting = false;

  function setStatus(message: string, state: 'error' | 'success' | 'draft'): void {
    if (!status) return;
    status.textContent = message;
    status.dataset.state = state;
    status.focus({ preventScroll: true });
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submitting || !form.reportValidity()) return;
    const fields = readContactFields(new FormData(form));
    const error = validateContact(fields);
    if (error) {
      setStatus(error, 'error');
      return;
    }

    const endpoint = form.dataset.endpoint?.trim();
    if (!endpoint) {
      try {
        const url = createMailto(form.dataset.recipient || '', fields);
        setStatus('تم تجهيز مسودة البريد. أرسلها من تطبيق بريدك؛ لم تُرسل رسالة من الموقع.', 'draft');
        window.location.href = url;
      } catch {
        setStatus('البريد غير مُعدّ بشكل صحيح. استخدم رابط التواصل المباشر.', 'error');
      }
      return;
    }

    submitting = true;
    button.disabled = true;
    button.textContent = 'جارٍ الإرسال…';
    form.setAttribute('aria-busy', 'true');
    status.textContent = '';

    try {
      const url = resolveContactEndpoint(endpoint, window.location.origin);
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        credentials: 'omit',
        body: JSON.stringify(fields),
        signal: AbortSignal.timeout(15000),
      });
      // A redirect to an HTML success page is not evidence of a delivered message.
      const payload: unknown = await response.json();
      if (!response.ok || !payload || typeof payload !== 'object' || !('ok' in payload) || payload.ok !== true) {
        throw new Error('Submission was not acknowledged');
      }
      form.reset();
      setStatus('تم استلام رسالتك بنجاح. شكرًا لتواصلك.', 'success');
    } catch {
      setStatus('تعذّر إرسال الرسالة. حاول مرة أخرى أو تواصل عبر البريد مباشرةً.', 'error');
    } finally {
      submitting = false;
      button.disabled = false;
      button.textContent = 'أرسل رسالة';
      form.removeAttribute('aria-busy');
    }
  });
}

export function initCopyEmail(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-copy-email]').forEach(button => {
    const label = button.querySelector('span');
    const original = label?.textContent || '';
    button.setAttribute('aria-live', 'polite');
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copyEmail || '');
        if (label) label.textContent = 'تم نسخ البريد';
      } catch {
        if (label) label.textContent = 'تعذّر النسخ — انسخ البريد من الرابط أعلاه';
      }
      window.setTimeout(() => { if (label) label.textContent = original; }, 4000);
    });
  });
}
