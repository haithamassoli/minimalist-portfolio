/** @typedef {{ name: string, email: string, message: string, website: string }} ContactFields */

/** Normalize user input once, before validation or creating a mailto draft.
 * @param {FormData} formData
 * @returns {ContactFields}
 */
export function readContactFields(formData) {
  const text = (/** @type {string} */ key) => String(formData.get(key) ?? '').trim();
  return { name: text('name'), email: text('email'), message: text('message'), website: text('website') };
}

/** Client-side feedback only. Repeat validation and spam/rate limits on your server.
 * @param {ContactFields} fields
 * @returns {string | null}
 */
export function validateContact(fields) {
  if (fields.website) return 'تعذّر إرسال الرسالة. يرجى المحاولة مرة أخرى.';
  if (fields.name.length < 2 || fields.name.length > 100) return 'اكتب اسمًا من حرفين إلى ١٠٠ حرف.';
  if (fields.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    return 'تأكد من كتابة بريد إلكتروني صحيح.';
  }
  if (fields.message.length < 10 || fields.message.length > 5000) return 'اكتب رسالة من ١٠ إلى ٥٠٠٠ حرف.';
  return null;
}

/** @param {string} recipient @param {ContactFields} fields */
export function createMailto(recipient, fields) {
  // Keep the recipient fixed in site.json; visitors cannot supply additional recipients.
  if (!/^[^\s@,;?]+@[^\s@,;?]+\.[^\s@,;?]+$/.test(recipient)) throw new Error('Invalid configured recipient');
  const subject = encodeURIComponent(`استفسار مشروع — ${fields.name}`);
  const body = encodeURIComponent(`الاسم: ${fields.name}\nالبريد: ${fields.email}\n\n${fields.message}`);
  return `mailto:${recipient}?subject=${subject}&body=${body}`;
}

/** Reject non-HTTP schemes and protocol-relative configuration.
 * @param {string} endpoint @param {string} origin
 */
export function resolveContactEndpoint(endpoint, origin) {
  const input = endpoint.trim();
  if (!input || input.startsWith('//') || input.includes('\\')) throw new Error('Invalid contact endpoint');
  const url = /^https?:\/\//i.test(input) ? new URL(input) : new URL(input, origin);
  const localhost = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if (url.username || url.password || (url.protocol !== 'https:' && !(localhost && url.protocol === 'http:'))) {
    throw new Error('Contact endpoint must use HTTPS');
  }
  return url.href;
}
