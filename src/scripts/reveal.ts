export function initReveal(): void {
  if (!('IntersectionObserver' in window)) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-entering');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach(element => {
    observer.observe(element);
    element.addEventListener('animationend', () => element.classList.remove('is-entering'), { once: true });
  });
  motion.addEventListener('change', event => {
    if (event.matches) observer.disconnect();
  });
}
