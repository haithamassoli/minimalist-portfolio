import { lenis } from './motion';

export function initMenu(): void {
  const dialog = document.querySelector<HTMLDialogElement>('#site-menu');
  const trigger = document.querySelector<HTMLButtonElement>('[data-menu-open]');
  const closeButton = dialog?.querySelector<HTMLButtonElement>('[data-menu-close]');
  if (!dialog || !trigger || !closeButton) return;

  trigger.addEventListener('click', () => {
    if (dialog.open) return;
    dialog.showModal();
    trigger.setAttribute('aria-expanded', 'true');
    document.documentElement.classList.add('menu-is-open');
    lenis?.stop();
  });

  closeButton.addEventListener('click', () => dialog.close());
  dialog.querySelectorAll<HTMLAnchorElement>('a').forEach(link => {
    link.addEventListener('click', () => dialog.close());
  });

  // Native dialog supplies keyboard focus containment and Escape handling.
  dialog.addEventListener('close', () => {
    trigger.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('menu-is-open');
    lenis?.start();
    trigger.focus({ preventScroll: true });
  });
}
