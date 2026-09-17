import test from 'node:test';
import assert from 'node:assert/strict';
import { createMailto, readContactFields, resolveContactEndpoint, validateContact } from '../src/lib/contact.mjs';

const valid = { name: 'Test Person', email: 'hello@example.com', message: 'A valid project inquiry.', website: '' };

test('accepts valid contact fields', () => assert.equal(validateContact(valid), null));
test('rejects invalid email', () => assert.ok(validateContact({ ...valid, email: 'not-an-email' })));
test('rejects multiple recipients', () => assert.ok(validateContact({ ...valid, email: 'a@x.com, b@y.com' })));
test('rejects short or excessively long names', () => {
  assert.ok(validateContact({ ...valid, name: 'a' }));
  assert.ok(validateContact({ ...valid, name: 'a'.repeat(101) }));
});
test('rejects short or excessively long messages', () => {
  assert.ok(validateContact({ ...valid, message: 'Hi' }));
  assert.ok(validateContact({ ...valid, message: 'a'.repeat(5001) }));
});
test('honors the honeypot', () => assert.ok(validateContact({ ...valid, website: 'spam' })));
test('trims form values', () => {
  const data = new FormData();
  data.set('name', '  Example  ');
  assert.equal(readContactFields(data).name, 'Example');
  assert.equal(readContactFields(data).message, '');
});
test('creates encoded mail draft without allowing header injection', () => {
  const url = createMailto('contact@example.com', { ...valid, name: 'Name & bcc=other@example.com', message: 'Hello & ? = مرحبًا' });
  assert.ok(url.startsWith('mailto:contact@example.com?subject='));
  const query = new URLSearchParams(url.split('?')[1]);
  assert.deepEqual([...query.keys()], ['subject', 'body']);
  assert.ok(query.get('body').includes('مرحبًا'));
});
test('rejects malformed configured recipients', () => {
  assert.throws(() => createMailto('a@x.com,b@y.com', valid));
  assert.throws(() => createMailto('a@x.com?bcc=b@y.com', valid));
});
test('allows HTTPS and same-origin HTTPS relative endpoints', () => {
  assert.equal(resolveContactEndpoint('/api/contact', 'https://example.com'), 'https://example.com/api/contact');
  assert.equal(resolveContactEndpoint('https://forms.example.com/contact', 'https://example.com'), 'https://forms.example.com/contact');
});
test('allows HTTP only on localhost for development', () => {
  assert.equal(resolveContactEndpoint('/api/contact', 'http://localhost:4321'), 'http://localhost:4321/api/contact');
  assert.throws(() => resolveContactEndpoint('http://example.com/api', 'https://example.com'));
});
test('rejects unsafe endpoint schemes and credentials', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,x', '//external.example/path', 'https://user:secret@example.com', '']) {
    assert.throws(() => resolveContactEndpoint(url, 'https://example.com'));
  }
});
