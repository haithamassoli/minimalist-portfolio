import test from 'node:test';
import assert from 'node:assert/strict';
import { responsiveImage } from '../src/lib/images.mjs';

test('small assets and local images remain unchanged', () => {
  assert.deepEqual(responsiveImage({ src: '/images/local.jpg', width: 800, height: 800 }), { src: '/images/local.jpg', srcset: undefined });
  assert.equal(responsiveImage({ src: 'https://framerusercontent.com/images/logo.png', width: 300, height: 90 }).srcset, undefined);
});
test('portrait srcset uses actual scaled width, not height', () => {
  const result = responsiveImage({ src: 'https://framerusercontent.com/images/card.png', width: 904, height: 1200 });
  assert.ok(result.srcset.includes('386w'));
  assert.ok(result.srcset.includes('771w'));
  assert.ok(result.srcset.endsWith('904w'));
});
