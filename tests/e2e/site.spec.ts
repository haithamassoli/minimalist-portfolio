import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // No external font/image availability is required for behavior/layout tests.
  await page.route('https://framerusercontent.com/**', route => route.abort());
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
});

test('homepage is RTL with one main heading and no horizontal overflow', async ({ page }) => {
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('.project-card')).toHaveCount(4);
  await expect(page.locator('.testimonial-card')).toHaveCount(6);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
});

test('menu supports open, Escape and focus restoration', async ({ page }) => {
  const trigger = page.locator('[data-menu-open]');
  await trigger.click();
  await expect(page.locator('#site-menu')).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(page.locator('#site-menu')).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test('FAQ opens with keyboard and preserves a single open answer', async ({ page }) => {
  const items = page.locator('.faq-item');
  await items.nth(1).locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(items.nth(1)).toHaveAttribute('open', '');
  await expect(items.nth(0)).not.toHaveAttribute('open', '');
});

test('listing links resolve locally', async ({ page }) => {
  await page.goto('/projects/');
  await expect(page.locator('.project-card')).toHaveCount(4);
  await page.goto('/blog/');
  await expect(page.locator('.article-card')).toHaveCount(3);
});

test('successful contact response is acknowledged and form is reset', async ({ page }) => {
  await page.locator('[data-contact-form]').evaluate((form: HTMLFormElement) => { form.dataset.endpoint = '/api/contact'; });
  await page.route('**/api/contact', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) }));
  await page.locator('#contact-name').fill('Test Person');
  await page.locator('#contact-email').fill('hello@example.com');
  await page.locator('#contact-message').fill('A valid project inquiry.');
  await page.locator('.contact-form__submit').click();
  await expect(page.locator('[data-form-status]')).toHaveAttribute('data-state', 'success');
  await expect(page.locator('#contact-name')).toHaveValue('');
});

test('failed contact response preserves the entered message', async ({ page }) => {
  await page.locator('[data-contact-form]').evaluate((form: HTMLFormElement) => { form.dataset.endpoint = '/api/contact'; });
  await page.route('**/api/contact', route => route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ ok: false }) }));
  await page.locator('#contact-name').fill('Test Person');
  await page.locator('#contact-email').fill('hello@example.com');
  await page.locator('#contact-message').fill('A valid project inquiry.');
  await page.locator('.contact-form__submit').click();
  await expect(page.locator('[data-form-status]')).toHaveAttribute('data-state', 'error');
  await expect(page.locator('#contact-message')).toHaveValue('A valid project inquiry.');
});
