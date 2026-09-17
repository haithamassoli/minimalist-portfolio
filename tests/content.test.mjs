import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const data = async name => JSON.parse(await readFile(path.join(root, 'src/data', `${name}.json`), 'utf8'));

test('source homepage items are preserved without responsive duplicates', async () => {
  for (const [name, count] of Object.entries({ projects: 4, posts: 3, testimonials: 6, certifications: 6, faq: 5, skills: 3, services: 3, clients: 6 })) {
    assert.equal((await data(name)).length, count, name);
  }
});

test('project and article links point to their source detail pages', async () => {
  for (const name of ['projects', 'posts']) {
    const entries = await data(name);
    assert.equal(new Set(entries.map(item => item.slug)).size, entries.length);
    for (const item of entries) {
      assert.ok(item.title.trim());
      assert.ok(item.image.width > 0 && item.image.height > 0);
      assert.equal(new URL(item.sourceUrl).origin, 'https://rzgfolio.framer.ai');
      assert.ok(item.image.alt.trim());
    }
  }
});

test('FAQ contains all answers, including initially collapsed items', async () => {
  for (const item of await data('faq')) {
    assert.ok(item.question.length > 10);
    assert.ok(item.answer.length > 30);
  }
});

test('no Framer application scripts or font binaries are bundled', async () => {
  async function walk(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const nested = await Promise.all(entries.map(entry => entry.isDirectory() ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)]));
    return nested.flat();
  }
  for (const file of [...await walk(path.join(root, 'src')), ...await walk(path.join(root, 'public'))]) {
    assert.ok(!/\.(woff2?|ttf|otf)$/i.test(file), file);
    if (!/\.(astro|ts|mjs|css|json)$/.test(file)) continue;
    const text = await readFile(file, 'utf8');
    assert.ok(!text.includes('framer.com/edit'), file);
    assert.ok(!text.includes('data-framer-name'), file);
    assert.ok(!text.includes('__framer_force_showing_editorbar'), file);
  }
});
