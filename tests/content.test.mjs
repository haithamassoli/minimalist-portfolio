import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const data = async name => JSON.parse(await readFile(path.join(root, 'src/data', `${name}.json`), 'utf8'));

test('content collections keep the homepage layout counts', async () => {
  for (const [name, count] of Object.entries({ projects: 12, posts: 3, testimonials: 6, certifications: 6, faq: 5, skills: 3, services: 3, clients: 6 })) {
    assert.equal((await data(name)).length, count, name);
  }
});

test('site identity matches Haitham Assoli', async () => {
  const site = await data('site');
  assert.equal(site.fullName, 'هيثم العسولي');
  assert.equal(site.email, 'haitham.b.assoli@gmail.com');
  assert.equal(site.socials[0].url, 'https://github.com/haithamassoli');
  assert.equal(site.socials[1].url, 'https://www.linkedin.com/in/haithamassoli/');
  assert.ok(site.avatar.src.startsWith('/images/'));
});

test('project and article links are unique live destinations with local images', async () => {
  for (const name of ['projects', 'posts']) {
    const entries = await data(name);
    assert.equal(new Set(entries.map(item => item.slug)).size, entries.length);
    for (const item of entries) {
      assert.ok(item.title.trim());
      assert.ok(item.image.width > 0 && item.image.height > 0);
      assert.ok(item.sourceUrl.startsWith('https://'));
      assert.ok(!item.sourceUrl.includes('rzgfolio.framer.ai'));
      assert.ok(item.image.src.startsWith('/images/'));
      assert.ok(item.image.alt.trim());
    }
  }
});

test('referenced local images exist on disk', async () => {
  const paths = new Set();
  const site = await data('site');
  paths.add(site.avatar.src);
  paths.add(site.faviconLight);
  paths.add(site.socialImage);
  for (const name of ['projects', 'posts', 'testimonials', 'clients']) {
    for (const item of await data(name)) {
      paths.add(item.image?.src ?? item.avatar?.src ?? item.src);
    }
  }
  for (const src of paths) {
    assert.ok(src.startsWith('/'), src);
    await access(path.join(root, 'public', src.slice(1)));
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
